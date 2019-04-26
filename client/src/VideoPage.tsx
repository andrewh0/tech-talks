import React, { useEffect } from 'react';
import { Box } from './design';
import { useCurrentVideo, usePlayerState } from './App';

function VideoPage(props: { path: string; objectId?: string }) {
  const [_playerSize, setPlayerSize] = usePlayerState();
  const { setCurrentVideo, video } = useCurrentVideo();
  const handleVideoPageLoad = async (objectId?: string): Promise<void> => {
    if (objectId) {
      let json = await fetch(`/api/talks/${objectId}`).then(r => r.json());
      if (json) {
        setCurrentVideo(json);
        setPlayerSize('full');
      }
    }
  };
  useEffect(() => {
    if (
      (props.objectId && !video) ||
      (video && props.objectId !== video.objectID)
    ) {
      handleVideoPageLoad(props.objectId);
    }
  }, [props.objectId]);
  return <Box />;
}

export default VideoPage;
