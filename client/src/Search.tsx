import React from 'react';
import { InstantSearch, connectHits } from 'react-instantsearch-dom';
import VideoCard, { VideoHit } from './VideoCard';
import { OnVideoCardClickType } from './App';

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
}) {
  return props.hits.map((hit: VideoHit, i: number) => (
    <VideoCard key={i} hit={hit} onVideoCardClick={props.onVideoCardClick} />
  ));
}

const CustomHits = connectHits(Hits);

function Search(props: { onVideoCardClick: OnVideoCardClickType }) {
  return (
    <div className="search">
      <InstantSearchProvider>
        <CustomHits onVideoCardClick={props.onVideoCardClick} />
      </InstantSearchProvider>
    </div>
  );
}

export { InstantSearchProvider };
export default Search;
