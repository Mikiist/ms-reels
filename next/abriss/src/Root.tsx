import React from "react";
import { Composition, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Main, T } from "./Main";
import { FPS, H, W } from "./lib";

const fonts: [string, string, string][] = [
  ["Inter", "Inter-Regular.otf", "400"],
  ["Inter", "Inter-Medium.otf", "500"],
  ["Inter", "Inter-SemiBold.otf", "600"],
  ["Inter", "Inter-Bold.otf", "700"],
  ["InterDisplay", "InterDisplay-Light.otf", "300"],
  ["InterDisplay", "InterDisplay-SemiBold.otf", "600"],
  ["InterDisplay", "InterDisplay-Bold.otf", "700"],
  ["InterDisplay", "InterDisplay-ExtraBold.otf", "800"],
  ["InterDisplay", "InterDisplay-Black.otf", "900"],
];
for (const [family, file, weight] of fonts) {
  loadFont({ family, url: staticFile(`fonts/${file}`), weight });
}

export const RemotionRoot: React.FC = () => {
  return (
    <Composition id="Abriss" component={Main} durationInFrames={Math.round(T.end * FPS)} fps={FPS} width={W} height={H} />
  );
};
