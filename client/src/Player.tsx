import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { display, justifyContent } from 'styled-system';

import YouTubePlayer from './YouTubePlayer';
import Icon, { expand, close } from './Icon';
import { Box, Button } from './design';
import theme from './theme';
import { SetPlayerSizeType } from './App';
import { usePrevious, useDebouncedWindowInnerHeight } from './util';
import { NAV_HEIGHT } from './theme';

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
        height: ${props.playerHeight - NAV_HEIGHT}px;
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
        title="Expand"
        p={0}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.preventDefault();
          onVideoExpand();
        }}
      >
        <Icon path={expand} />
      </Button>
      <Button
        title="Close"
        p={0}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.preventDefault();
          onVideoClose();
        }}
      >
        <Icon path={close} />
      </Button>
    </PlayerControlsContainer>
  );
}

function Player(props: {
  playerSize: string;
  videoId: string;
  setPlayerSize: SetPlayerSizeType;
  match: { uri: string; path: string } | null;
  navigate: (path: string) => void;
  onVideoClose: () => void;
  onVideoExpand: (navigate: (path: string) => void) => void;
}) {
  const onVideoExpand = () => props.onVideoExpand(props.navigate);
  const previousMatch = usePrevious(props.match);
  useEffect(() => {
    if (props.videoId) {
      if (props.match && !previousMatch) {
        props.setPlayerSize('full');
      } else if (!props.match && previousMatch) {
        props.setPlayerSize('minimized');
      }
    } else {
      props.setPlayerSize('hidden');
    }
  }, [props.videoId, !!props.match]);
  const windowInnerHeight = useDebouncedWindowInnerHeight();
  return props.videoId ? (
    <VideoPlayerContainer
      playerSize={props.playerSize}
      videoId={props.videoId}
      playerHeight={windowInnerHeight}
    >
      {props.playerSize === 'minimized' ? (
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
