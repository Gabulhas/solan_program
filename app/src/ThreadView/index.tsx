import { Stack, Tab, View } from "react-xnft";
import { ThreadsGridScreen } from "./ThreadsGrid";
import { black, magenta, white } from "../Theme/colors";
import {PlusIcon, ThreadsIcon} from "../utils/Icon"

function GetLandingThreads() {
  return (
    <Stack.Navigator
      initialRoute={{ name: "main" }}
      options={({ route }) => {
        switch (route.name) {
          case "main":
            return {
              title: "Latest Threads",
            };
          default:
            throw new Error("unknown route");
        }
      }}
      style={{
        backgroundColor: black,
      }}
    >
      <Stack.Screen
        name={"main"}
        component={(props: any) => <ThreadsGridScreen {...props} />}
      />
    </Stack.Navigator>
  );
}
