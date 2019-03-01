import React, { useRef, useEffect, useState } from 'react';
import * as YTPlayer from 'yt-player';

function YouTubePlayer(props: { videoId: string }) {
  const playerEl = useRef(null);
  let player: any = null;
  useEffect(() => {
    player = new YTPlayer(playerEl.current, {
      related: false,
      annotations: false,
      modestBranding: false,
      controls: true
    });
    return () => {
      if (player) player.destroy();
    };
  }, [playerEl.current]);
  useEffect(() => {
    if (player) {
      player.load(props.videoId);
      // The autoplay option doesn't work unless the video is muted.
      player.play();
    }
  }, [props.videoId]);
  return <div ref={playerEl} />;
}

export default YouTubePlayer;
