"use client";

import SideRays from "@/components/SideRays";
import Threads from "@/components/Threads";

const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div className="absolute inset-0">
        <SideRays
          speed={2.5}
          rayColor1="#EAB308"
          rayColor2="#96c8ff"
          intensity={2}
          spread={2}
          origin="top-right"
          tilt={0}
          saturation={1.5}
          blend={0.75}
          falloff={1.6}
          opacity={1}
          className="absolute inset-0"
        />
      </div>
      <div className="absolute inset-0">
        <Threads
          amplitude={1}
          distance={0}
          enableMouseInteraction
          className="absolute inset-0"
        />
      </div>
    </div>
  );
};

export default BackgroundEffects;
