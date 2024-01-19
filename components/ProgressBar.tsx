import { useNProgress } from "@tanem/react-nprogress";
import React from "react";

interface LoadingProps {
  isRouteChanging: boolean;
  color: string;
  enabled?: boolean;
}

const ProgressBar: React.FC<LoadingProps> = ({
  isRouteChanging,
  color,
  enabled = true,
}) => {
  const { animationDuration, isFinished, progress } = useNProgress({
    isAnimating: isRouteChanging,
  });

  if (!enabled) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        .container {
          opacity: ${isFinished ? 0 : 1};
          pointer-events: none;
          transition: opacity ${animationDuration}ms linear;
        }

        .bar {
          background: ${color};
          height: 2px;
          left: 0;
          margin-left: ${(-1 + progress) * 100}%;
          position: fixed;
          top: 0;
          transition: margin-left ${animationDuration}ms linear;
          width: 100%;
          z-index: 1031;
        }
      `}</style>
      <div className="container">
        <div className="bar"></div>
      </div>
    </>
  );
};

export default ProgressBar;
