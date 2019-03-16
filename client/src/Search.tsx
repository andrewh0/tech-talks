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
  navigate: Function;
}) {
  return (
    <Box display="flex" flexWrap="wrap">
      {props.hits.map((hit: VideoHit, i: number) => (
        <VideoCard
          key={i}
          hit={hit}
          onVideoCardClick={props.onVideoCardClick}
          navigate={props.navigate}
        />
      ))}
      <Box display="flex" justifyContent="center" width={1} my={2}>
        <Button disabled={!props.hasMore} onClick={props.refine}>
          Load more
        </Button>
      </Box>
    </Box>
  );
}

const CustomHits = connectInfiniteHits(Hits);

function Search(props: { onVideoCardClick: OnVideoCardClickType, navigate: Function }) {
  return <CustomHits onVideoCardClick={props.onVideoCardClick} navigate={props.navigate} />;
}

export { InstantSearchProvider };
export default Search;
