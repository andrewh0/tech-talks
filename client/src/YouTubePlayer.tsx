import React from 'react';
import YouTube from 'react-youtube';
import { usePlayerState } from './PlayerContextProvider';

type YouTubePlayerProps = {
  videoId: string | null;
};

function YouTubePlayer(props: YouTubePlayerProps) {
  const [playerSize, _setPlayerSize] = usePlayerState();
  return props.videoId ? (
    <YouTube
      containerClassName="youtube-player-container"
      className={`youtube-player ${
        playerSize === 'minimized' ? 'youtube-player_min' : ''
      }`}
      videoId={props.videoId}
      opts={{
        // https://developers.google.com/youtube/player_parameters
        playerVars: {
          autoplay: 1,
          iv_load_policy: 3, // annotations off
          modestbranding: 1,
          playsinline: 1 // affects iOS
        },
        width: '100%',
        height: '100%'
      }}
    />
  ) : null;
}

export default YouTubePlayer;
