import React, { useEffect } from 'react';
import styled from '@emotion/styled';

import YouTubePlayer from './YouTubePlayer';
import { Box } from './design';

const VideoPlayerContainer = styled(Box)`
  position: absolute;
  visibility: hidden;

  ${props =>
    props.playerSize === 'minimized' && props.videoId
      ? `
        bottom: 0;
        right: 0;
        visibility: visible;
        position: fixed;
      `
      : ''}

  ${props =>
    props.playerSize === 'full' && props.videoId
      ? `
        width: 100%;
        visibility: visible;
      `
      : ''}
`;

function Player(props: {
  playerSize: string;
  videoId: string;
  setPlayerSize: Function;
  match: { uri: string, path: string } | null;
}) {
  useEffect(() => {
    if (
      props.videoId &&
      props.playerSize === 'full' &&
      !props.match
    ) {
      props.setPlayerSize('minimized');
    } else if (
      props.videoId &&
      props.playerSize !== 'full' &&
      props.match
    ) {
      props.setPlayerSize('full');
    }
  }, [props.videoId, props.match]);
  return (
    <VideoPlayerContainer playerSize={props.playerSize} videoId={props.videoId}>
      <YouTubePlayer videoId={props.videoId} playerSize={props.playerSize} />
    </VideoPlayerContainer>
  );
}

export default Player;
