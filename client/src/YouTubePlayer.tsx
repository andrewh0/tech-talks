import React from 'react';
import * as YTPlayer from 'yt-player';

type YouTubePlayerProps = {
  videoId: string | null;
};

class YouTubePlayer extends React.Component<YouTubePlayerProps> {
  player: any;
  playerEl: any;
  constructor(props: YouTubePlayerProps) {
    super(props);
    this.player = null;
    this.playerEl = React.createRef();
  }
  componentDidMount() {
    this.player = new YTPlayer(this.playerEl.current, {
      related: false,
      annotations: false,
      modestBranding: false,
      controls: true
    });
  }
  componentWillUnmount() {
    if (this.player !== null) {
      this.player.destroy();
    }
  }
  componentDidUpdate(prevProps: YouTubePlayerProps, _prevState: {}) {
    if (
      this.player &&
      this.props.videoId &&
      prevProps.videoId !== this.props.videoId
    ) {
      this.player.load(this.props.videoId);
      // The autoplay option doesn't work unless the video is muted.
      this.player.play();
    }
  }
  render() {
    return <div ref={this.playerEl} />;
  }
}

export default YouTubePlayer;
