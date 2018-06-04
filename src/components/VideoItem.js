// @flow

import * as React from 'react';
import { Component } from 'react';
import styled from 'styled-components';
import numeral from 'numeral';
import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';
import { withRouter } from 'react-router';
import { WHITE, MUTED_TEXT_COLOR } from './util/sharedStyles';

momentDurationFormatSetup(moment);

const youtubeUrl = id => `https://www.youtube.com/watch?v=${id}`;

const VideoItemWrapper = styled.div`
  cursor: pointer;
  padding: 8px;
  transition: 0.1s ease-out;
  &:hover {
    transform: translateY(-4px);
  }
`;

const VideoImage = styled.img`
  object-fit: contain;
  width: 100%;
`;

const VideoTitle = styled.p`
  font-weight: bold;
  line-height: 1.5;
  margin: 0 0 8px 0;
`;
const VideoItemDescription = styled.div`
  padding: 8px;
`;

const VideoItemTextMuted = styled.p`
  font-size: 14px;
  color: ${MUTED_TEXT_COLOR};
  margin: 0;
`;

const MutedLink = styled.a`
  color: ${MUTED_TEXT_COLOR};
  text-decoration: none;
  font-size: 14px;
  &:hover {
    text-decoration: underline;
  }
`;

const VideoImageContainer = styled.div`
  position: relative;
`;

const VideoImageMetadata = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 8px;
`;

const VideoData = styled.div`
  display: flex;
  align-items: center;
  width: max-content;
  background-color: rgba(0, 0, 0, 0.6);
  color: ${WHITE};
  padding: 0 4px;
  border-radius: 2px;
  font-size: 12px;
`;

const VideoDescriptionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
`;

const formatDuration = duration =>
  moment.duration(duration, 'seconds').format('h:mm:ss');

const formatViews = views =>
  views >= 1000 ? numeral(views).format('0.0a') : views;

const VideoItem = withRouter(
  class VideoItem extends Component<
    { hit: * } & { match: any, location: any, history: any }
  > {
    handleClick = (e: SyntheticEvent<>): void => {
      e.preventDefault();
      const { history, hit } = this.props;
      history.push(`/videos/${hit.techTalkVideoId}`);
    };
    render() {
      const { hit } = this.props;
      const {
        eventName,
        title,
        videoId,
        thumbnailUrl,
        views,
        duration,
        year
      } = hit;
      return (
        <VideoItemInner
          onClick={this.handleClick}
          videoId={videoId}
          title={title}
          eventName={eventName}
          thumbnailUrl={thumbnailUrl}
          views={views}
          duration={duration}
          year={year}
        />
      );
    }
  }
);

const VideoItemInner = ({
  videoId,
  title,
  eventName,
  thumbnailUrl,
  views,
  duration,
  year,
  onClick
}: {
  videoId: string,
  title: string,
  eventName: string,
  thumbnailUrl: string,
  views: number,
  duration: number,
  year: number,
  onClick: (SyntheticEvent<>) => void
}) => {
  const url = youtubeUrl(videoId);
  return (
    <VideoItemWrapper onClick={onClick}>
      <VideoImageContainer background={thumbnailUrl}>
        <VideoImage src={thumbnailUrl} alt={title} />
        <VideoImageMetadata>
          <VideoData>
            <span role="img" aria-label="Views">
              👀
            </span>{' '}
            {formatViews(views)}
          </VideoData>
          <VideoData>{formatDuration(duration)}</VideoData>
        </VideoImageMetadata>
      </VideoImageContainer>
      <VideoItemDescription>
        <VideoDescriptionContainer>
          <VideoItemTextMuted>
            {eventName}, {year}
          </VideoItemTextMuted>
          <MutedLink
            href={url}
            target="_blank"
            rel="noopener"
            onClick={e => {
              e.stopPropagation();
            }}
          >
            On YouTube
          </MutedLink>
        </VideoDescriptionContainer>
        <VideoTitle>{title}</VideoTitle>
      </VideoItemDescription>
    </VideoItemWrapper>
  );
};

export default VideoItem;
