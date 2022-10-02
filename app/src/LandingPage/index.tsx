import { Stack, Tab, View } from "react-xnft";
import { ThreadsGridScreen } from "./ThreadsGrid";
import { black, grey, magenta, white } from "../Theme/colors";
import {DegodsIcon, GodsIcon, PlusIcon, ThreadsIcon} from "../utils/Icon"

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
export function GetLandingPageScreen() {
    return (
    <View style={{ height: "100%", backgroundColor: black }}>
      <Tab.Navigator
        style={{
          backgroundColor: black, 
          borderTop: "none",
        }}

        options={({ route }) => {
          return {
            tabBarIcon: ({ focused }) => {
              const color = focused
                ? magenta 
                : white
              if (route.name === "threads") {
                return <Tab.Icon element={<ThreadsIcon fill={color} />} />;
              } else {
                return <Tab.Icon element={<PlusIcon fill={color} />} />;
              }
            },
          };
        }}
      >
        <Tab.Screen
          name="threads"
          disableLabel={true}
          component={() => <GetLandingThreads />}
        />
        <Tab.Screen
          name="reply"
          disableLabel={true}
          component={() => <View />}
        />
      </Tab.Navigator>
    </View>
  );

}
