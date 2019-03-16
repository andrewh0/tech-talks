import React from 'react';
import styled from '@emotion/styled';
import { Highlight } from 'react-instantsearch-dom';
import { Box, Text } from './design';
import theme from './theme';

const StyledImage = styled('img')`
  width: 100%;
  object-fit: contain;
`;

const Card = styled(Box)`
  cursor: pointer;
  &:hover {
    background-color: ${theme.colors.gray};
  }
`;

export type VideoHit = {
  viewCount: number;
  description: string;
  title: string;
  publishedAt: number;
  objectID: string;
  duration: number;
  source: string;
  videoId: string;
  thumbnailUrl: string;
};

function VideoCard(props: {
  hit: VideoHit;
  onVideoCardClick: (objectID: string, videoId: string) => void;
}) {
  const handleVideoCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.onVideoCardClick(props.hit.objectID, props.hit.videoId);
  };
  return (
    <Card
      onClick={handleVideoCardClick}
      bg="darkGray"
      p={[0, 1, 2]}
      width={[1, 1 / 2, 1 / 4]}
      title={props.hit.title}
    >
      <Box>
        <StyledImage src={props.hit.thumbnailUrl} alt={props.hit.title} />
      </Box>
      <Box p={2}>
        <Text color="almostWhite" fontWeight={600}>
          <Highlight attribute="title" hit={props.hit} />
        </Text>
      </Box>
    </Card>
  );
}

export default VideoCard;
