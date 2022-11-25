import {
  useNavigation,
  View,
  Image,
  Text,
} from "react-xnft";

import {LoadingIndicator} from "./LoadingIndicator"
import { bytesToIPFSlink, getLandingThreads } from "../utils";
import {cyan, magenta, white} from "../Theme/colors"

export function ThreadsGridScreen() {
  const landingThreads = getLandingThreads()!;
  console.log(landingThreads);

  if (landingThreads == null) {
    console.log("Loading");
    return <LoadingIndicator />;
  }
  return <ThreadsGrid threads={landingThreads} />;
}

function ThreadsGrid({ threads }: any) {
  const nav = useNavigation();

  // TODO: make this open the thread view
  const clickThread = (threadId: any) => {
    nav.push("replies", { threadId });
  };

  return (
    <View
      style={{
        marginRight: "20px",
        marginLeft: "20px",
        marginBottom: "38px",
      }}
    >
      <View
        style={{
          marginTop: "10px",
          display: "grid",
          justifyContent: "space-between",
          columnGap: "20px",
          rowGap: "20px",
          gridTemplateColumns: "1fr 1fr",
        }}
      >
        {threads.map((thread, index) => {
          return (
            <View
              key={thread.threadId}
              onClick={() => clickThread(thread.threadId)}

              style={{
                marginBottom: "0px",
                boxShadow: "0px 4px 8px 0 rgba(0,0,0,0.9)",
                border: "4px",
                borderRadius: "5px",
              }}
            >
              <Image
                src={bytesToIPFSlink(thread.content.image)}
                style={{
                  borderRadius: "6px",
                  width: "100%",
                  height: "auto",
                }}
              />
              <View
                style={{
                  marginTop: "3px",
                  marginLeft: "10px",
                  marginRight: "10px",
                  marginBottom: "5px",
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{
                    fontSize: "12px",
                    lineHeight: "19.08px",
                    color: white
                  }}
                >
                  By: {thread.content.replier.toBase58().slice(0, 10) + "..."}
                </Text>
                <Text
                  style={{
                    fontSize: "12px",
                    lineHeight: "19.08px",
                    marginBottom: "10px",
                    color: magenta
                  }}
                >
                  Replies: {thread.replyCount.toNumber()}
                </Text>
                <Text
                  style={{
                    fontSize: "12px",
                    lineHeight: "19.08px",
                    color: cyan,

                  }}
                >
                  {thread.content.text.length >= 40? thread.content.text.slice(0, 40) + "...": thread.content.text}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

