import ReactXnft, { Text, View } from "react-xnft";
import * as anchor from "@project-serum/anchor";
import { THEME } from "./utils/theme";
import {getImageboardAccount} from "./utils"

//
// On connection to the host environment, warm the cache.
//
ReactXnft.events.on("connect", () => {
  
  // no-op
});

export function App() {
  return (
    <View style={{ height: "100%", backgroundColor: "#111827" }}>
      <Text>{}</Text>
    </View>
  );
}
