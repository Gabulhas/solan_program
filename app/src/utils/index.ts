import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";
import {useEffect, useState} from "react";
import ReactXnft, {LocalStorage, useConnection, usePublicKey} from "react-xnft";

import {IDL, SolchanContract} from "../../../target/types/solchan_contract";

export function getProgram(): Program<SolchanContract> {
  return new Program<SolchanContract>(IDL, PID, window.xnft);
}

export function getLandingThreads() {
  const publicKey = usePublicKey();
  const connection = useConnection();

  const [tokenAccounts, setTokenAccounts] = useState<[ any ]|null>(null);

  useEffect(() => {
    (async () => {
      setTokenAccounts(null);
      const res = await getLastN();
      setTokenAccounts(res);
    })();
  }, [ publicKey, connection ]);
  if (tokenAccounts === null) {
    return null;
  }
  return {
    dead : tokenAccounts[0].map((t) => ({...t, isStaked : true})),
    alive : tokenAccounts[1].map((t) => ({...t, isStaked : true})),
    deadUnstaked : tokenAccounts[2].map((t) => ({...t, isStaked : false})),
    aliveUnstaked : tokenAccounts[3].map((t) => ({...t, isStaked : false})),
  };
}

export async function getImageboardAccount(): Promise<anchor.web3.PublicKey> {
  let [pda, _bump] = await PublicKey.findProgramAddress(
      [ anchor.utils.bytes.utf8.encode("imageboard") ], getProgram().programId);
  return pda;
}

export async function getThreadPDA(threadId: number):
    Promise<anchor.web3.PublicKey> {
  let [pda, _bump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("thread"),
        anchor.utils.bytes.utf8.encode(`${threadId}`),
      ],
      getProgram().programId);
  return pda;
}

export async function getNextThreadID(): Promise<number> {
  let imageboardPDA = await getImageboardAccount();
  let imageboardState =
      await getProgram().account.imageboard.fetch(imageboardPDA);
  return imageboardState.threads.toNumber() + 1;
}

export async function getThread(threadId: number) {
  let threadAcc = await getThreadPDA(threadId);
  let threadState = await getProgram().account.threads.fetch(threadAcc);
  return threadState;
}

export async function getLastN(n: number) {
  let imageboardThreads = await getNextThreadID() - 1

  let threadsToFetch = [] 
  for (let i = n; i > imageboardThreads - n; i--) {
    threadsToFetch.push(await getThreadPDA(i))
  }

  let threadsFetched = await getProgram().account.threads.fetchMultiple();
  let threadstate = await getProgram().account.threads.fetch(thread);
  return threadstate.replyCount.toNumber() + 1;
}

export async function getReplyPDA(replyId: number,
                                  thread: anchor.web3.PublicKey):
    Promise<anchor.web3.PublicKey> {
  let [pda, _bump] = await PublicKey.findProgramAddress(
      [
        anchor.utils.bytes.utf8.encode("reply"),
        thread.toBytes(),
        anchor.utils.bytes.utf8.encode(`${replyId}`),
      ],
      getProgram().programId);
  return pda;
}

export async function getNextReplyID(thread: anchor.web3.PublicKey):
    Promise<number> {
  let threadstate = await getProgram().account.threads.fetch(thread);
  return threadstate.replyCount.toNumber() + 1;
}

export async function getReply(replyId: number, thread: anchor.web3.PublicKey) {
  let replyAcc = await getReplyPDA(replyId, thread);
  let replyState = await getProgram().account.reply.fetch(replyAcc);
  return replyState;
}

const PID = new PublicKey("HLN8PXJgGPHkATnWqWCABgaszEUPR9x13zc9iL6sz883");
