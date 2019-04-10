import React from 'react';
import { InstantSearch, connectInfiniteHits } from 'react-instantsearch-dom';
import VideoCard, { VideoHit } from './VideoCard';
import { OnVideoCardClickType } from './App';

import { Box, Button } from './design';

function InstantSearchProvider({ children }: { children: any }) {
  return (
    <InstantSearch
      appId="TOYFG73GH3"
      indexName="TALKS"
      apiKey="dd15269aa4416b500656d26f74c4126c"
    >
      {children}
    </InstantSearch>
  );
}

function Hits(props: {
  hits: Array<VideoHit>;
  onVideoCardClick: OnVideoCardClickType;
  hasMore: boolean;
  refine: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  navigate: (path: string) => void;
  playerSize: string;
}) {
  return (
    <Box display="flex" flexWrap="wrap" pb={props.playerSize === "minimized" ? 7 : 0}>
      {props.hits.map((hit: VideoHit, i: number) => (
        <VideoCard
          key={i}
          hit={hit}
          onVideoCardClick={props.onVideoCardClick}
          navigate={props.navigate}
        />
      ))}
      <Box display="flex" justifyContent="flex-start" width={1} my={2}>
        <Button
          p={3}
          mx={2}
          my={0}
          fontSize={2}
          disabled={!props.hasMore}
          onClick={props.refine}
          title="Load more talks"
        >
          Load more
        </Button>
      </Box>
    </Box>
  );
}

const CustomHits = connectInfiniteHits(Hits);

function Search(props: {
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

export { InstantSearchProvider };
export default Search;
