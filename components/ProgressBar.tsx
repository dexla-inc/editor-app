import { useNProgress } from "@tanem/react-nprogress";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
  color: string;
  enabled?: boolean;
}

export const ProgressBar: React.FC<Props> = ({ color, enabled = true }) => {
  const isRouteChanging = useRouteChange();
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

export const useRouteChange = () => {
  const [isRouteChanging, setIsRouteChanging] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsRouteChanging(true);
    };

    const handleRouteChangeEnd = () => {
      setIsRouteChanging(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);
    router.events.on("routeChangeError", handleRouteChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
      router.events.off("routeChangeError", handleRouteChangeEnd);
    };
  }, [router.events]);

  return isRouteChanging;
};
