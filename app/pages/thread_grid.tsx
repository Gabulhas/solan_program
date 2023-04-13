import {  Grid} from '@geist-ui/core'
import ThreadThumbnail from "./thread_thumbnail"


export default function ThreadGrid({threads}) {
    return (
      <Grid.Container gap={4} justify="center" height="100px">
        {threads.map((thread, _index) => {
            return (
            <Grid xs><ThreadThumbnail thread={thread}/></Grid>)
            })
        }
        
      </Grid.Container>
    )
}
