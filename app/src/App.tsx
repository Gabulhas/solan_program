import ReactXnft, { View, Text } from "react-xnft";
//import {GetLandingPageScreen} from "./LandingPage"
//import { black } from "./Theme/colors";

//
// On connection to the host environment, warm the cache.
//
ReactXnft.events.on("connect", () => {
  
  // no-op  <GetLandingPageScreen/>
});

export function App() {
  return (
    <View style={{ height: "100%"}}>
        <Text>Hey </Text>
    </View>
  );
}
