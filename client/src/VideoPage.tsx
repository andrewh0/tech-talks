import React, { useEffect } from 'react';
import { Box } from './design';
import { useCurrentVideo } from './CurrentVideoProvider';
import { usePlayerState } from './PlayerContextProvider';
import { navigate } from '@reach/router';

function VideoPage(props: { path: string; objectId?: string }) {
  const setPlayerSize = usePlayerState()[1];
  const { setCurrentVideo, video } = useCurrentVideo();
  useEffect(() => {
    const handleVideoPageLoad = async (objectId?: string): Promise<void> => {
      if (objectId) {
        let json = await fetch(`/api/talks/${objectId}`)
          .then(r => {
            if (r.status !== 200) {
              return null;
            }
            return r.json();
          })
          .catch(_e => {
            return null;
          });
        if (json) {
          setCurrentVideo(json);
          setPlayerSize('full');
          return;
        }
      }
      navigate('/404', { replace: true });
    };
    if (
      (props.objectId && !video) ||
      (video && props.objectId !== video.objectID)
    ) {
      handleVideoPageLoad(props.objectId);
    }
  }, [props.objectId, video, setCurrentVideo, setPlayerSize]);
  return <Box />;
}

export default VideoPage;
