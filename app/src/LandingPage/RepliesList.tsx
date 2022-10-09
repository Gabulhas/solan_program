import { LoadingIndicator } from "./LoadingIndicator";
import { View, Text, Image } from "react-xnft";
import { getThreadContent, bytesToIPFSlink } from "../utils";
import { red, blue, cyan, white } from "../Theme/colors";

export function RepliesListScreen({ threadId }: any) {
  const threadContent = getThreadContent(threadId)!;

  console.log(threadContent);
  if (threadContent === null) {
    console.log("Loading");
    return <LoadingIndicator />;
  }
  return (
    <RepliesList
      threadContent={threadContent.threadContent}
      replies={threadContent.threadReplies}
    />
  );
}

export function RepliesList({ threadContent, replies }: any) {
  return (
    <View style={{ height: "100%" }}>
      <View
        style={{
          margin: "0px 20px 0px 20px",
          backgroundColor: "none",
          paddingBottom: "10px",
        }}
      >
        {replies.map((reply, index) => {
          return (
            <View
            style={{
                  marginTop: "14px",

                }}
            >
              <Text
                style={{
                  marginLeft: "6px",
                  fontWeight: "600",
                  fontSize: "10px",
                  lineHeight: "120%",
                  color: red,
                }}
              >
                By: {reply.content.replier.toBase58()}
              </Text>
              <View
                key={reply.replyId}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: "10px",
                  marginBottom: "16px",
                }}
              >
                {!reply.content.image.every((byte) => byte == 0) ? (
                  <Image
                    src={bytesToIPFSlink(reply.content.image)}
                    style={{
                      height: "100px",
                    }}
                  />
                ) : (
                  <></>
                )}

                <View
                  style={{
                    marginLeft: "5px",
                  }}
                >
                  <View
                    style={{
                      display: "flex",
                      flewDirection: "row",
                      marginTop: "2px",
                    }}
                  >
                    <Text
                      style={{
                        marginTop: "2px",
                        marginLeft: "6px",
                        fontWeight: "400",
                        fontSize: "14px",
                        lineHeight: "120%",
                        color: white,
                      }}
                    >
                      {reply.content.text}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  borderRadius: "1px",
                  width: "100%",
                  height: "1px",
                  marginLeft: "5px",
                  marginRight: "16px",
                }}
              ></View>
            </View>
          );
        })}
      </View>
    </View>
  );
}
