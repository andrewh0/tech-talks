import React from 'react';
import { InstantSearch } from 'react-instantsearch-dom';

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

export default InstantSearchProvider;