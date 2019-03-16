import React, { useEffect } from 'react';
import styled from '@emotion/styled';

import YouTubePlayer from './YouTubePlayer';
import { Box } from './design';

const VideoPlayerContainer = styled(Box)`
  position: absolute;
  bottom: 0;
  visibility: hidden;

  ${props =>
    props.playerSize === 'minimized' && props.videoId
      ? `
        width: 100%;
        visibility: visible;
        transform: scale(0.25);
        transform-origin: bottom right;
        position: fixed;
      `
      : ''}

  ${props =>
    props.playerSize === 'full' && props.videoId
      ? `
        width: 100%;
        visibility: visible;
        transform: scale(1);
        transform-origin: bottom right;
      `
      : ''}
`;

function Player(props: {
  playerSize: string;
  videoId: string;
  setPlayerSize: Function;
  location: any;
}) {
  useEffect(() => {
    if (
      props.videoId &&
      props.playerSize === 'full' &&
      props.location.pathname === '/' // should be !matchesVideoPage
    ) {
      props.setPlayerSize('minimized');
    } else if (
      props.videoId &&
      props.playerSize !== 'full' &&
      props.location.pathname !== '/' // should be matchesVideoPage
    ) {
      props.setPlayerSize('full');
    }
  }, [props.playerSize, props.videoId, props.location.pathname]);
  return (
    <VideoPlayerContainer playerSize={props.playerSize} videoId={props.videoId}>
      <YouTubePlayer videoId={props.videoId} />
    </VideoPlayerContainer>
  );
}

export default Player;
