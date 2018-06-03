// @flow

import type { Video } from './util/types';
import React from 'react';
import styled from 'styled-components';
import VideoItem from './VideoItem';

const VideoListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  grid-gap: 8px;
  justify-content: center;
`;

const VideoList = ({ videos }: { videos: Array<Video> }) => (
  <VideoListWrapper>
    {videos.map((video, i) => <VideoItem key={i} {...video} />)}
  </VideoListWrapper>
);

export default VideoList;
