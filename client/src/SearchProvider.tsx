import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { InstantSearch } from 'react-instantsearch-dom';
import { WindowLocation, Location, NavigateFn } from '@reach/router';
import { debounce } from 'lodash';
import { usePrevious } from './util';

type SearchState = {
  query: string;
  refinementList: {
    organizationName: Array<string>;
  };
  page: number;
};

const createURL = (state: SearchState) => {
  const organizationName =
    state.refinementList &&
    state.refinementList.organizationName &&
    state.refinementList.organizationName.join('~');
  const routeState = {
    query: state.query || undefined,
    confs: organizationName || undefined,
    page: state.page
  };
  return `?${qs.stringify(routeState)}`;
};

const URL_UPDATE_DEBOUNCE_TIME: number = 500;

const searchStateToUrl = (location: WindowLocation, searchState: SearchState) =>
  searchState ? `${location.pathname}${createURL(searchState)}` : '';

const urlToSearchState = (location: WindowLocation) => {
  const routeState = qs.parse(location.search.slice(1));
  const searchState = {
    query: routeState.query || '',
    refinementList: {
      organizationName: (routeState.confs && routeState.confs.split('~')) || []
    },
    page: routeState.page || 1
  };

  return searchState;
};

const InstantSearchProvider = ({
  children,
  location,
  navigate
}: {
  children: any;
  navigate: NavigateFn;
  location: WindowLocation;
}) => {
  const [searchState, setSearchState] = useState(() =>
    urlToSearchState(location)
  );
  const prevLocation = usePrevious(location);
  useEffect(() => {
    if (prevLocation !== location) {
      setSearchState(urlToSearchState(location));
    }
  });
  const onSearchStateChange = (nextSearchState: SearchState) => {
    const debouncedNavigate = debounce(() => {
      navigate(searchStateToUrl(location, nextSearchState), {
        state: nextSearchState
      });
    }, URL_UPDATE_DEBOUNCE_TIME);
    setSearchState(nextSearchState);
    debouncedNavigate();
  };
  return (
    <InstantSearch
      appId="TOYFG73GH3"
      indexName="TALKS"
      apiKey="dd15269aa4416b500656d26f74c4126c"
      searchState={searchState}
      onSearchStateChange={onSearchStateChange}
      createURL={createURL}
    >
      {children}
    </InstantSearch>
  );
};

function InstantSearchWithLocation({ children }: { children: any }) {
  return (
    <Location>
      {({ location, navigate }) => (
        <InstantSearchProvider
          children={children}
          location={location}
          navigate={navigate}
        />
      )}
    </Location>
  );
}

export default InstantSearchWithLocation;
