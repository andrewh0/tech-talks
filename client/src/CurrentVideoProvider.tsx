import React, { useState } from 'react';
import { VideoHit } from './VideoCard';
import { usePrevious } from './util';

const CurrentVideoContext = React.createContext<
  [VideoHit | null, (video: VideoHit | null) => void] | null
>(null);

function CurrentVideoProvider(props: any) {
  const [video, setCurrentVideo] = useState<VideoHit | null>(null);
  const value = React.useMemo(() => [video, setCurrentVideo], [video]);
  return <CurrentVideoContext.Provider {...props} value={value} />;
}

function useCurrentVideo() {
  const context = React.useContext(CurrentVideoContext);
  if (!context) {
    throw new Error(
      'useCurrentVideo must be used within a CurrentVideoProvider'
    );
  }
  const [video, setCurrentVideo] = context;
  const prevVideo = usePrevious(video);
  return {
    prevVideo,
    video,
    setCurrentVideo
  };
}

export { CurrentVideoProvider, useCurrentVideo };
