import React from 'react';
import { connectInfiniteHits } from 'react-instantsearch-dom';

import VideoCard, { VideoHit } from './VideoCard';
import { OnVideoCardClickType } from './App';
import { Box, Button, Text } from './design';

const EmptyStateText = Text.withComponent('p');

function Hits(props: {
  hits: Array<VideoHit>;
  onVideoCardClick: OnVideoCardClickType;
  hasMore: boolean;
  refine: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  navigate: (path: string) => void;
  playerSize: string;
}) {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      pb={props.playerSize === 'minimized' ? 7 : 4}
    >
      {props.hits.length > 0 ? (
        props.hits.map((hit: VideoHit, i: number) => (
          <VideoCard
            key={i}
            hit={hit}
            onVideoCardClick={props.onVideoCardClick}
            navigate={props.navigate}
          />
        ))
      ) : (
        <EmptyStateText
          my={1}
          p={2}
          color="almostWhite"
          fontWeight={900}
          fontSize={[2]}
          width="100%"
          textAlign="center"
        >
          No talks to display. Maybe try a different search?
        </EmptyStateText>
      )}
      {props.hasMore ? (
        <Box display="flex" justifyContent="flex-start" width={1} my={2}>
          <Button
            p={3}
            mx={2}
            my={0}
            fontSize={2}
            onClick={props.refine}
            title="Load more talks"
          >
            Load more
          </Button>
        </Box>
      ) : null}
    </Box>
  );
}

const CustomHits = connectInfiniteHits(Hits);

function SearchResults(props: {
  onVideoCardClick: OnVideoCardClickType;
  navigate: (path: string) => void;
  playerSize: string;
}) {
  return (
    <CustomHits
      onVideoCardClick={props.onVideoCardClick}
      navigate={props.navigate}
      playerSize={props.playerSize}
    />
  );
}

export default SearchResults;
