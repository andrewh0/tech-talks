import React from 'react';
import YouTube from 'react-youtube';

type YouTubePlayerProps = {
  videoId: string | null;
  playerSize: string;
};

function YouTubePlayer(props: YouTubePlayerProps) {
  return props.videoId ? (
    <YouTube
      className={`youtube-player ${
        props.playerSize === 'full' ? 'youtube-player_full' : ''
      }`}
      videoId={props.videoId}
      opts={{
        // https://developers.google.com/youtube/player_parameters
        playerVars: {
          autoplay: 1,
          iv_load_policy: 3, // annotations off
          modestbranding: 1,
          playsinline: 1 // affects iOS
        }
      }}
    />
  ) : null;
}

export default YouTubePlayer;
