import * as anchor from "@project-serum/anchor";
import {Program} from "@project-serum/anchor";
import {PublicKey} from "@solana/web3.js";
import {useEffect, useState} from "react";
import {useConnection, usePublicKey} from "react-xnft";
import {CID} from "multiformats/cid"

import {IDL, SolchanContract} from "../../../target/types/solchan_contract";

export function getProgram(): Program<SolchanContract> {
  return new Program<SolchanContract>(IDL, PID, window.xnft);
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
  }, [ publicKey, connection ]);
  if (landingThreads === null) {
      return null;
  }
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
            setReplies([])



            let threadAcc = await getThreadPDA(threadId);
            let threadState = await getProgram().account.threads.fetch(threadAcc);
            let threadReplies = await getAllThreadReplies(threadAcc, threadState.replyCount.toNumber())


            setThreadContent(threadState)
            setReplies(threadReplies)
        })();
    }, [ publicKey, connection ]);
    return {threadContent: threadContent, threadReplies:replies};
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

export async function getAllThreadReplies(threadPDA: anchor.web3.PublicKey, totalReplies: number) {

    let repliesToFetch = [] 
    for(let i = 1; i <= totalReplies; i++){
        repliesToFetch.push(await getReplyPDA(i, threadPDA))
    }
    let repliesFetched = await getProgram().account.reply.fetchMultiple(repliesToFetch)
    return repliesFetched.filter((reply) => reply != null)

}

export async function getLastN(n: number) {
    let imageboardThreads = await getNextThreadID() - 1

    let threadsToFetch = [] 
    for (let i = n; i > imageboardThreads - n; i--) {
        threadsToFetch.push(await getThreadPDA(i))
    }

    let threadsFetched = await getProgram().account.threads.fetchMultiple(threadsToFetch);
    return threadsFetched.filter((thread) => thread != null)
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


                                  export function bytesToIPFSlink(imageBytes: Uint8Array): string {
                                      const asCID = BytesToCID(imageBytes)
                                      return `https://ipfs.io/ipfs/${asCID}`
                                  }

                                      export function BytesToCID(bts: Uint8Array): string{
                                          const prefix = [18, 32]
                                          let result = new Uint8Array([...prefix, ...bts])
                                          return CID.decode(result).toString()
                                      }

