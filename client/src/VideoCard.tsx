import React, { useState } from 'react';
import styled from '@emotion/styled';
import { Highlight } from 'react-instantsearch-dom';
import formatDurationMs from 'format-duration';
import numeral from 'numeral';
import { space, fontSize, bottom, right, left, top } from 'styled-system';
import { Box, Text } from './design';
import { OnVideoCardClickType } from './App';
import theme from './theme';
import Icon, { check, add } from './Icon';

const StyledImage = styled('img')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  object-fit: contain;
`;

const Card = styled(Box)`
  cursor: pointer;
  &:hover {
    transform: translateY(-4px);
  }
  transition: transform 0.2s ease-out;
`;

const CardImage = styled(Box)`
  position: relative;
`;

const CardOverlayBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  background-color: ${theme.colors.darkGray};
  opacity: 0.9;
  color: ${theme.colors.white};
  font-weight: 500;
  border-radius: 4px;
  ${space}
  ${fontSize}
  ${top}
  ${bottom}
  ${right}
  ${left}
`;

const SaveUnsaveButton = styled(CardOverlayBox)`
  border: none;
  cursor: pointer;
  &:hover {
    background-color: ${theme.colors.brand};
  }
`.withComponent('button');

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
  organizationName: string;
  organizationId: string;
};

function formatViews(viewCount: number): string {
  const [floatString, abbreviation] = numeral(viewCount)
    .format('0.0 a')
    .toUpperCase()
    .split(' ');
  const parsedFloat = parseFloat(floatString);
  if (viewCount < 1000) {
    return `${viewCount}`;
  }
  if (parsedFloat >= 1.1 && parsedFloat <= 9.9) {
    return `${floatString}${abbreviation}`;
  }
  return numeral(viewCount)
    .format('0a')
    .toUpperCase();
}

function VideoCard(props: {
  hit: VideoHit;
  isSearchResult: boolean;
  isSaved: boolean;
  onVideoCardClick: OnVideoCardClickType;
  navigate: (path: string) => void;
  onVideoSave: Function;
}) {
  const [isSaved, setSaved] = useState(props.isSaved);
  const handleVideoCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.onVideoCardClick(
      props.hit.objectID,
      props.hit.videoId,
      props.navigate
    );
  };
  return (
    <Card
      onClick={handleVideoCardClick}
      bg="darkGray"
      p={[0, 1, 2]}
      mb={[4, 3]}
      width={[1, 1 / 2, 1 / 4]}
      title={props.hit.title}
    >
      <CardImage>
        <StyledImage src={props.hit.thumbnailUrl} alt={props.hit.title} />
        {props.isSearchResult ? (
          <CardOverlayBox bottom={4} left={4} p={1}>
            <Text fontSize={0}>
              {formatViews(props.hit.viewCount)}{' '}
              {props.hit.viewCount === 1 ? 'view' : 'views'}
            </Text>
          </CardOverlayBox>
        ) : null}
        <CardOverlayBox bottom={4} right={4} p={1}>
          <Text fontSize={0}>
            {formatDurationMs(props.hit.duration * 1000)}
          </Text>
        </CardOverlayBox>
        <SaveUnsaveButton
          top={4}
          right={4}
          p={1}
          title={isSaved ? 'Added to saved talks' : 'Save this talk'}
          onClick={(e: React.MouseEvent) => {
            const nextSavedState = !isSaved;
            e.stopPropagation();
            setSaved(nextSavedState);
            props.onVideoSave(props.hit, nextSavedState);
          }}
        >
          {isSaved ? <Icon path={check} /> : <Icon path={add} />}
        </SaveUnsaveButton>
      </CardImage>
      <Box p={2}>
        <Box width="100%" display="flex" justifyContent="space-between">
          <Text color="gray" fontSize={[1, 0]} fontWeight={500}>
            {props.hit.organizationName}
          </Text>
          <Text color="gray" fontSize={[1, 0]} fontWeight={500}>
            {new Date(props.hit.publishedAt).getFullYear()}
          </Text>
        </Box>
        <Text color="almostWhite" fontWeight={600} fontSize={[2, 1]}>
          {props.isSearchResult ? (
            <Highlight attribute="title" hit={props.hit} />
          ) : (
            props.hit.title
          )}
        </Text>
      </Box>
    </Card>
  );
}

export default VideoCard;
