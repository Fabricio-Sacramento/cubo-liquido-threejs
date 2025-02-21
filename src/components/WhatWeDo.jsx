import { Html } from "@react-three/drei";

export default function WhatWeDo() {
  return (
    <Html
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      transform
      distanceFactor={1}
    >
      <div id="whatwedo">
        <h2>Work</h2>
      </div>
    </Html>
  );
}
