import { bytesToIPFSlink } from "@/lib";
import { Card, Badge, Image, Text } from '@geist-ui/core'

export default function ThreadThumbnail({thread}: any){

  return (
    <Card width="400px">
      <Image src={bytesToIPFSlink(thread.content.image)}
       height="300px" width="80%" draggable={false} />
      <Text type="default" p small b>By: {thread.content.replier.toBase58().slice(0, 26) + "..."}</Text>
      <Text type="default" my={0}> {thread.content.text.length >= 200? thread.content.text.slice(0, 200) + "...": thread.content.text}</Text>
      <Card.Footer>
        <Text type="secondary" p small b>Replies: <Badge>{thread.replyCount.toNumber()}</Badge></Text> 
      </Card.Footer>
    </Card>  );
}
