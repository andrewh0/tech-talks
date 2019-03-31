import React, { useEffect } from 'react';
import styled from '@emotion/styled';

import YouTubePlayer from './YouTubePlayer';
import { Box, Button } from './design';
import theme from './theme';
import { display, justifyContent } from 'styled-system';

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
        padding: 4px;
        margin: 8px;
        border-radius: 4px;
        background-color: ${theme.colors.brand};
        box-shadow: 0px 0px 16px 8px rgba(0,0,0,0.3);
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

const PlayerControlsContainer = styled(Box)`
  ${display}
  ${justifyContent}
  ${theme.space}
`;

function PlayerControls({
  onVideoClose,
  onVideoExpand
}: {
  onVideoClose: () => void;
  onVideoExpand: () => void;
}) {
  return (
    <PlayerControlsContainer
      display="flex"
      justifyContent="space-between"
      mb={1}
    >
      <Button
        p={2}
        onClick={(e: any) => {
          e.preventDefault();
          onVideoExpand();
        }}
      >
        Expand
      </Button>
      <Button
        p={2}
        onClick={(e: any) => {
          e.preventDefault();
          onVideoClose();
        }}
      >
        Close
      </Button>
    </PlayerControlsContainer>
  );
}

function Player(props: {
  playerSize: string;
  videoId: string;
  setPlayerSize: Function;
  match: { uri: string; path: string } | null;
  navigate: (path: string) => void;
  onVideoClose: () => void;
  onVideoExpand: (navigate: (path: string) => void) => void;
}) {
  const onVideoExpand = () => props.onVideoExpand(props.navigate);
  useEffect(() => {
    if (props.videoId && props.playerSize === 'full' && !props.match) {
      props.setPlayerSize('minimized');
    } else if (props.videoId && props.playerSize !== 'full' && props.match) {
      props.setPlayerSize('full');
    }
  }, [props.videoId, props.match]);
  return props.videoId ? (
    <VideoPlayerContainer playerSize={props.playerSize} videoId={props.videoId}>
      {props.playerSize !== 'full' ? (
        <PlayerControls
          onVideoClose={props.onVideoClose}
          onVideoExpand={onVideoExpand}
        />
      ) : null}
      <YouTubePlayer videoId={props.videoId} playerSize={props.playerSize} />
    </VideoPlayerContainer>
  ) : null;
}

export default Player;
