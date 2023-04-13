import { getLandingThreads} from "@/lib";

import { Page, Button, Text } from '@geist-ui/core'
import ThreadGrid from "./thread_grid";

export default function App() {
    return (
          <Page>
            <Text h1>SolChan</Text>
            <ThreadGrid threads={getLandingThreads()}/>
          </Page>    

  )
}
