// @flow

import React, { Component } from 'react';
import VideoPlayer from './VideoPlayer';

class VideoPage extends Component<
  *,
  {
    youtubeVideoId: null | string
  }
> {
  state = {
    youtubeVideoId: null
  };
  componentDidMount() {
    const { videoId } = this.props;
    fetch(`/api/videos/${videoId}`)
      .then(response => response.json())
      .then(result => {
        if (result) {
          this.setState({
            youtubeVideoId: result.videoId
          });
        }
      });
  }
  render() {
    const { youtubeVideoId } = this.state;
    return <VideoPlayer youtubeVideoId={youtubeVideoId} />;
  }
}

export default VideoPage;
