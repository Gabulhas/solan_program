import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { SolchanContract } from "../target/types/solchan_contract";
import { PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("solchan_contract", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  // Configure the client to use the local cluster.
  const program = anchor.workspace.SolchanContract as Program<SolchanContract>;

  const connection = provider.connection;

  async function airdrop(acc: anchor.web3.Keypair) {
    let signature = await connection.requestAirdrop(
      acc.publicKey,
      100000000000
    );
    await connection.confirmTransaction(signature);
  }

  async function showBalance(acc: anchor.web3.Keypair) {
    let balance = await connection.getBalance(acc.publicKey);
    console.log(`${acc.publicKey} balance: ${balance}`);
  }

  async function getImageboardAccount(): Promise<anchor.web3.PublicKey> {
    let [pda, _bump] = await PublicKey.findProgramAddress(
      [anchor.utils.bytes.utf8.encode("imageboard")],
      program.programId
    );
    return pda;
  }

  async function getThreadPDA(
    threadId: number
  ): Promise<anchor.web3.PublicKey> {
    let [pda, _bump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("thread"),
        anchor.utils.bytes.utf8.encode(`${threadId}`),
      ],
      program.programId
    );
    return pda;
  }

  async function getNextThreadID(): Promise<number> {
    let imageboardPDA = await getImageboardAccount();
    let imageboardState = await program.account.imageboard.fetch(imageboardPDA);
    return imageboardState.threads + 1;
  }

  async function getThread(threadId: number) {
    let threadAcc = await getThreadPDA(threadId);
    let threadState = await program.account.threads.fetch(threadAcc);
    return threadState;
  }

  async function getReplyPDA(
    replyId: number,
    thread: anchor.web3.PublicKey
  ): Promise<anchor.web3.PublicKey> {
    let [pda, _bump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("reply"),
        thread.toBytes(),
        anchor.utils.bytes.utf8.encode(`${replyId}`),
      ],
      program.programId
    );
    return pda;
  }

  async function getNextReplyID(
    thread: anchor.web3.PublicKey
  ): Promise<number> {
    let threadstate = await program.account.threads.fetch(thread);
    return threadstate.replyCount + 1;
  }

  async function getReply(replyId: number, thread: anchor.web3.PublicKey) {
    let replyAcc = await getReplyPDA(replyId, thread);
    let replyState = await program.account.reply.fetch(replyAcc);
    return replyState;
  }

  const authorityAcc = anchor.web3.Keypair.generate();

  it("Is initialized!", async () => {
    const pda = await getImageboardAccount();
    await airdrop(authorityAcc);

    await program.methods
      .initImageboard()
      .accounts({
        authority: authorityAcc.publicKey,
        imageboard: pda,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([authorityAcc])
      .rpc();
  });

  async function startThreadGetPDA(
    user: anchor.web3.Keypair,
    text: string,
    image: Uint8Array
  ): Promise<anchor.web3.PublicKey> {
    const currentThreadId = await getNextThreadID();
    const currentThreadPDA = await getThreadPDA(currentThreadId);
    console.log("Next thread ID:", currentThreadId, "Next thread PDA:", currentThreadPDA)

    await program.methods
    .startThread(text, Buffer.from(image))
    .accounts({
        user: user.publicKey,
        imageboard: await getImageboardAccount(),
        thread: currentThreadPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
    })
    .signers([user])
    .rpc();

    console.log("Created PDA:", currentThreadPDA)
    return currentThreadPDA;
  }

  async function replyToThreadGetPDA(
    user: anchor.web3.Keypair,
    threadPDA: anchor.web3.PublicKey,
    text: string,
    image: Uint8Array
  ): Promise<anchor.web3.PublicKey> {
    const currentReplyID = await getNextReplyID(threadPDA);
    const currentReplyPDA = await getReplyPDA(currentReplyID, threadPDA);

    await program.methods
      .replyToThread(text, Buffer.from(image))
      .accounts({
        user: user.publicKey,
        reply: currentReplyPDA,
        thread: threadPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    return currentReplyPDA;
  }

  it("Can create thread", async () => {
    const op = anchor.web3.Keypair.generate();
    await airdrop(op);

    const myText = "Hello man";

    let newThreadPDA = await startThreadGetPDA(op, myText, new Uint8Array(32));

    let threadState = await program.account.threads.fetch(newThreadPDA);
    assert(threadState.content.text == myText);
  });

  it("Can reply to thread", async () => {
    const op = anchor.web3.Keypair.generate();
    await airdrop(op);

    const replier = anchor.web3.Keypair.generate();
    await airdrop(replier);

    const myText = "My second thread man";
    let newThreadPDA = await startThreadGetPDA(op, myText, new Uint8Array(32));
    let threadState = await program.account.threads.fetch(newThreadPDA);
    assert(threadState.content.text == myText);

    const myReplyText = "Hey! Wassup!";
    let newReplyPDA = await replyToThreadGetPDA(
      replier,
      newThreadPDA,
      myReplyText,
      new Uint8Array(32)
    );
    let replyState = await program.account.reply.fetch(newReplyPDA);
    assert(replyState.content.text == myReplyText);
  });

  it("Can multiple reply to thread", async () => {
    const op = anchor.web3.Keypair.generate();
    await airdrop(op);

    const myText = "My third thread, it works!";
    let newThreadPDA = await startThreadGetPDA(op, myText, new Uint8Array(32));
    let threadState = await program.account.threads.fetch(newThreadPDA);
    assert(threadState.content.text == myText);

    const random_replies = [
      "Nice!",
      "Glad it works!",
      "What's this",
      "Nah, it doesn't work for sure",
      "yo man",
    ];

    let i = 0;
    for (const replyText in random_replies) {
      i = i + 1;
      const replier = anchor.web3.Keypair.generate();
      await airdrop(replier);

      const myReplyText = replyText;
      let newReplyPDA = await replyToThreadGetPDA(
        replier,
        newThreadPDA,
        myReplyText,
        new Uint8Array(32)
      );
      let replyState = await program.account.reply.fetch(newReplyPDA);

      let replyPDAFromID = await getReplyPDA(i, newThreadPDA);
      let replyStateFromID = await program.account.reply.fetch(replyPDAFromID);

      assert(
        replyState.content.text == myReplyText &&
          replyStateFromID.content.text == replyState.content.text &&
          replyStateFromID.content.text == myReplyText
      );
    }
  });

  it("You can't reply with the same ID", async () => {
    const op = anchor.web3.Keypair.generate();
    await airdrop(op);

    const myText = "My third thread, it works!";
    let newThreadPDA = await startThreadGetPDA(op, myText, new Uint8Array(32));
    let threadState = await program.account.threads.fetch(newThreadPDA);
    assert(threadState.content.text == myText);

    const hackerino = anchor.web3.Keypair.generate();
    await airdrop(hackerino);

    let replyPDAFromID = await getReplyPDA(0, newThreadPDA);

    await program.methods
      .replyToThread("THIS MY TEXT", Buffer.from(new Uint8Array(32)))
      .accounts({
        user: hackerino.publicKey,
        reply: replyPDAFromID,
        thread: newThreadPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([hackerino])
      .rpc();

    await program.methods
      .replyToThread("THIS MY SECOND TEXT", Buffer.from(new Uint8Array(32)))
      .accounts({
        user: hackerino.publicKey,
        reply: replyPDAFromID, //SAME PDA
        thread: newThreadPDA,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([hackerino])
      .rpc();
  });
});
