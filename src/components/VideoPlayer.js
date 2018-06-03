// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import YTPlayer from 'yt-player';

const VideoPlayerWrapper = styled.div`
  height: calc(100vh - 56px);
  width: 100%;
  display: block;
`;

class VideoPlayer extends Component<{| youtubeVideoId: null | string |}> {
  // $FlowFixMe React.createRef flow definition missing?
  playerRef = React.createRef();
  player = null;
  componentDidMount() {
    const { youtubeVideoId } = this.props;
    this.player = new YTPlayer(this.playerRef.current, {
      autoplay: true,
      related: false,
      info: false,
      annotations: false,
      modestBranding: false
    });
    this.player.load(youtubeVideoId);
  }
  componentDidUpdate(prevProps: *, _prevState: *) {
    const { youtubeVideoId } = this.props;
    if (this.player && prevProps.youtubeVideoId !== youtubeVideoId) {
      this.player.load(youtubeVideoId);
    }
  }
  componentWillUnmount() {
    if (this.player) {
      this.player.destroy();
    }
  }
  render() {
    return <VideoPlayerWrapper innerRef={this.playerRef} />;
  }
}

export default VideoPlayer;
