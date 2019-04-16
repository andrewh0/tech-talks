import React from 'react';
import { connectInfiniteHits } from 'react-instantsearch-dom';
import { get } from 'lodash';

import VideoCard, { VideoHit } from './VideoCard';
import { OnVideoCardClickType, OnVideoSaveType, SavedTalksMapType } from './App';
import { Box, Button, P } from './design';

function Hits(props: {
  hits: Array<VideoHit>;
  onVideoCardClick: OnVideoCardClickType;
  hasMore: boolean;
  refine: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  navigate: (path: string) => void;
  playerSize: string;
  onVideoSave: OnVideoSaveType;
  savedTalks: SavedTalksMapType;
}) {
  return (
    <Box
      display="flex"
      flexWrap="wrap"
      pb={props.playerSize === 'minimized' ? 7 : 4}
    >
      {props.hits.length > 0 ? (
        props.hits.map((hit: VideoHit) => (
          <VideoCard
            key={hit.objectID}
            hit={hit}
            onVideoCardClick={props.onVideoCardClick}
            navigate={props.navigate}
            isSearchResult={true}
            isSaved={!!get(props.savedTalks, [hit.objectID])}
            onVideoSave={props.onVideoSave}
          />
        ))
      ) : (
        <P
          my={1}
          p={2}
          color="almostWhite"
          fontWeight={900}
          fontSize={[2]}
          width="100%"
          textAlign="center"
        >
          No talks to display. Maybe try a different search?
        </P>
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
  onVideoSave: OnVideoSaveType;
  savedTalks: SavedTalksMapType;
}) {
  return (
    <CustomHits
      onVideoCardClick={props.onVideoCardClick}
      navigate={props.navigate}
      playerSize={props.playerSize}
      onVideoSave={props.onVideoSave}
      savedTalks={props.savedTalks}
    />
  );
}

export default SearchResults;
