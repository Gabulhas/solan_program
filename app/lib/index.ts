import * as anchor from "@coral-xyz/anchor";
import { Program} from "@coral-xyz/anchor";
import { PublicKey, Connection} from "@solana/web3.js";
import { useEffect, useState } from "react";
import { CID } from "multiformats/cid";
import { IDL, SolchanContract } from "./solchan_contract";
import { metadata } from "./solchan_contract.json";



const opts = {
  preflightCommitment: "recent",
};

const PID = new PublicKey(metadata.address);

let establishedConnection: Connection | null = null;

export function useConnection () {
  if (establishedConnection !== null) {
    return establishedConnection;
  }

  const rpcUrl = 'http://127.0.0.1:8899';
  establishedConnection = new Connection(rpcUrl, 'confirmed');
  console.log('Connection to cluster established:', rpcUrl);

  return establishedConnection;
};

//Temp
function usePublicKey(){
    return "Ck49mtEqF7RwagLh2at2jv6RzXKLyYivTCdAUQK4kVWB"
}

export function getProgram(): Program<SolchanContract> {
    const wallet = window.solana

    const connection = useConnection();

    const provider = new anchor.AnchorProvider(
      connection, wallet, opts.preflightCommitment,
    )

    return new Program<SolchanContract>(IDL, PID, provider);
}

export function getLandingThreads() {
  const publicKey = usePublicKey();
  const connection = useConnection();

  const [landingThreads, setLandingThreads] = useState<(Object | null)[]>([]);

  useEffect(() => {
    (async () => {
      setLandingThreads([]);
      const res = await getLastN(40);
      setLandingThreads(res);
    })();
  }, [publicKey, connection]);
  if (landingThreads === null) {
    return null;
  }
  console.log("Landing threads",landingThreads)
  return landingThreads;
}

export function getThreadContent(threadId: number) {
  const publicKey = usePublicKey();
  const connection = useConnection();

  const [threadContent, setThreadContent] = useState<Object | null>(null);
  const [replies, setReplies] = useState<(Object | null)[]>([]);

  useEffect(() => {
    (async () => {
      setThreadContent(null);
      setReplies([]);

      let threadAcc = await getThreadPDA(threadId);
      let threadState = await getProgram().account.threads.fetch(threadAcc);
      let threadReplies = await getAllThreadReplies(
        threadAcc,
        threadState.replyCount.toNumber()
      );

      setThreadContent(threadState);
      setReplies(threadReplies);
    })();
  }, [publicKey, connection]);
  return { threadContent: threadContent, threadReplies: replies };
}

export async function getImageboardAccount(): Promise<anchor.web3.PublicKey> {
  let [pda, _bump] = PublicKey.findProgramAddressSync(
    [anchor.utils.bytes.utf8.encode("imageboard")],
    getProgram().programId
  );
  return pda;
}

export async function getThreadPDA(
  threadId: number
): Promise<anchor.web3.PublicKey> {
  let [pda, _bump] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("thread"),
      anchor.utils.bytes.utf8.encode(`${threadId}`),
    ],
    getProgram().programId
  );
  return pda;
}

export async function getNextThreadID(): Promise<number> {
  let imageboardPDA = await getImageboardAccount();
  let imageboardState = await getProgram().account.imageboard.fetch(
    imageboardPDA
  );
  return imageboardState.threads.toNumber() + 1;
}

export async function getThread(threadId: number) {
  let threadAcc = await getThreadPDA(threadId);
  let threadState = await getProgram().account.threads.fetch(threadAcc);
  return threadState;
}

export async function getAllThreadReplies(
  threadPDA: anchor.web3.PublicKey,
  totalReplies: number
) {
  let repliesToFetch = [];
  for (let i = 1; i <= totalReplies; i++) {
    repliesToFetch.push(await getReplyPDA(i, threadPDA));
  }
  let repliesFetched = await getProgram().account.reply.fetchMultiple(
    repliesToFetch
  );
  return repliesFetched.filter((reply) => reply != null);
}

export async function getLastN(n: number) {
  let imageboardThreads = (await getNextThreadID()) - 1;

  let threadsToFetch = [];
  for (let i = n; i > imageboardThreads - n; i--) {
    threadsToFetch.push(await getThreadPDA(i));
  }

  let threadsFetched = await getProgram().account.threads.fetchMultiple(
    threadsToFetch
  );
  return threadsFetched.filter((thread) => thread != null);
}

export async function getReplyPDA(
  replyId: number,
  thread: anchor.web3.PublicKey
): Promise<anchor.web3.PublicKey> {
  let [pda, _bump] = PublicKey.findProgramAddressSync(
    [
      anchor.utils.bytes.utf8.encode("reply"),
      thread.toBytes(),
      anchor.utils.bytes.utf8.encode(`${replyId}`),
    ],
    getProgram().programId
  );
  return pda;
}

export async function getNextReplyID(
  thread: anchor.web3.PublicKey
): Promise<number> {
  let threadstate = await getProgram().account.threads.fetch(thread);
  return threadstate.replyCount.toNumber() + 1;
}

export async function getReply(replyId: number, thread: anchor.web3.PublicKey) {
  let replyAcc = await getReplyPDA(replyId, thread);
  let replyState = await getProgram().account.reply.fetch(replyAcc);
  return replyState;
}


export function bytesToIPFSlink(imageBytes: Uint8Array): string {
  const asCID = BytesToCID(imageBytes);
  return `https://ipfs.io/ipfs/${asCID}`;
}

export function BytesToCID(bts: Uint8Array): string {
  const prefix = [18, 32];
  let result = new Uint8Array([...prefix, ...bts]);
  return CID.decode(result).toString();
}
