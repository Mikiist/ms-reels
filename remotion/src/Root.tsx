import { CalculateMetadataFunction, Composition, staticFile } from "remotion";
import { loadFont } from "@remotion/fonts";
import { Reel, ReelProps } from "./Reel";

// Schriften aus der Engine (liegen in public/fonts)
loadFont({ family: "D", url: staticFile("fonts/InterDisplay-Black.otf"), weight: "900" });
loadFont({ family: "D", url: staticFile("fonts/InterDisplay-Bold.otf"), weight: "700" });
loadFont({ family: "I", url: staticFile("fonts/Inter-SemiBold.otf"), weight: "600" });

const FPS = 30;

// Dauer kommt aus den Props (engine/remotion_job.py schreibt sie aus spec.json)
const calculateMetadata: CalculateMetadataFunction<ReelProps> = ({ props }) => {
  return { durationInFrames: Math.ceil(props.dur * FPS) };
};

const leer: ReelProps = { id: "leer", dur: 3, audio: null, words: [], scenes: [], keyword: "WEBSITE" };

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Reel"
      component={Reel}
      fps={FPS}
      width={1080}
      height={1920}
      durationInFrames={90}
      defaultProps={leer}
      calculateMetadata={calculateMetadata}
    />
  );
};
