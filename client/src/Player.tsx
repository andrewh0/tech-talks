import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import { display, justifyContent } from 'styled-system';

import YouTubePlayer from './YouTubePlayer';
import Icon, { expand, close } from './Icon';
import { Box, Button } from './design';
import theme from './theme';
import { useCurrentVideo } from './CurrentVideoProvider';
import { usePlayerState } from './PlayerContextProvider';
import { usePrevious, useDebouncedWindowInnerHeight } from './util';
import { NAV_HEIGHT } from './theme';
import { NavigateFn } from '@reach/router';

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

function PlayerControls({ navigate }: { navigate: NavigateFn }) {
  const { video, setCurrentVideo } = useCurrentVideo();
  const [_playerSize, setPlayerSize] = usePlayerState();
  const handleVideoClose = () => {
    setCurrentVideo(null);
    setPlayerSize('hidden');
  };
  const handleVideoExpand = () => {
    if (video) {
      setPlayerSize('full');
      navigate(`/talks/${video.objectID}`);
    }
  };
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
          handleVideoExpand();
        }}
      >
        <Icon path={expand} />
      </Button>
      <Button
        title="Close"
        p={0}
        onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
          e.preventDefault();
          handleVideoClose();
        }}
      >
        <Icon path={close} />
      </Button>
    </PlayerControlsContainer>
  );
}

function Player(props: {
  match: { uri: string; path: string } | null;
  navigate: NavigateFn;
}) {
  const previousMatch = usePrevious(props.match);
  const { video } = useCurrentVideo();
  const videoId = video ? video.videoId : null;
  const [playerSize, setPlayerSize] = usePlayerState();
  useEffect(() => {
    if (videoId) {
      if (props.match && !previousMatch) {
        setPlayerSize('full');
      } else if (!props.match && previousMatch) {
        setPlayerSize('minimized');
      }
    } else {
      setPlayerSize('hidden');
    }
  }, [videoId, !!props.match]);
  const windowInnerHeight = useDebouncedWindowInnerHeight();
  return videoId ? (
    <VideoPlayerContainer
      playerSize={playerSize}
      videoId={videoId}
      playerHeight={windowInnerHeight}
    >
      {playerSize === 'minimized' ? (
        <PlayerControls navigate={props.navigate} />
      ) : null}
      <YouTubePlayer videoId={videoId} />
    </VideoPlayerContainer>
  ) : null;
}

export default Player;
