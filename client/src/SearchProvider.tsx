import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { InstantSearch } from 'react-instantsearch-dom';
import { WindowLocation, Location, NavigateFn } from '@reach/router';
import { debounce } from 'lodash';
import { usePrevious } from './util';
import {
  TALKS_MOST_VIEWED,
  TALKS_RECENTLY_ADDED,
  TALKS_RELEVANT
} from './SearchOptions';

type SearchState = {
  query: string;
  refinementList: {
    organizationName: Array<string>;
  };
  page: number;
  sortBy: string;
};

const INDEX_TO_URL_PARAMS: { [indexName: string]: string } = {
  [TALKS_MOST_VIEWED]: 'views',
  [TALKS_RECENTLY_ADDED]: 'newest',
  [TALKS_RELEVANT]: 'rel'
};

const URL_PARAMS_TO_INDEX_NAME: { [param: string]: string } = {
  views: TALKS_MOST_VIEWED,
  newest: TALKS_RECENTLY_ADDED,
  rel: TALKS_RELEVANT
};

const createURL = (state: SearchState) => {
  const organizationName =
    state.refinementList &&
    state.refinementList.organizationName &&
    state.refinementList.organizationName.join('~');
  const routeState = {
    query: state.query || undefined,
    confs: organizationName || undefined,
    page: state.page,
    sort: INDEX_TO_URL_PARAMS[state.sortBy]
  };
  return `?${qs.stringify(routeState)}`;
};

const URL_UPDATE_DEBOUNCE_TIME: number = 50;

const searchStateToUrl = (location: WindowLocation, searchState: SearchState) =>
  searchState ? `${location.pathname}${createURL(searchState)}` : '';

const urlToSearchState = (location: WindowLocation) => {
  const routeState = qs.parse(location.search.slice(1));
  const searchState = {
    query: routeState.query || '',
    refinementList: {
      organizationName: (routeState.confs && routeState.confs.split('~')) || []
    },
    page: routeState.page || 1,
    sortBy:
      (routeState.sort && URL_PARAMS_TO_INDEX_NAME[routeState.sort]) ||
      TALKS_RECENTLY_ADDED
  };

  return searchState;
};

const SearchStateContext = React.createContext<
  [SearchState, (state: SearchState) => void] | null
>(null);

function SearchStateProvider(props: any) {
  const [searchState, setSearchState] = useState<SearchState>(() =>
    urlToSearchState(props.location)
  );
  const value = React.useMemo(() => [searchState, setSearchState], [
    searchState
  ]);
  return <SearchStateContext.Provider {...props} value={value} />;
}

function useSearchState() {
  const context = React.useContext(SearchStateContext);
  if (!context) {
    throw new Error('useSearchState must be used within a SearchStateProvider');
  }
  return context;
}

const ControlledInstantSearch = ({
  children,
  location,
  navigate
}: {
  children: any;
  navigate: NavigateFn;
  location: WindowLocation;
}) => {
  const [searchState, setSearchState] = useSearchState();
  const prevLocation = usePrevious(location);
  useEffect(() => {
    if (prevLocation !== location) {
      setSearchState(urlToSearchState(location));
    }
  });
  const onSearchStateChange = (nextSearchState: SearchState) => {
    let modifiedNextSearchState = nextSearchState;
    if (!searchState.query && !!nextSearchState.query) {
      modifiedNextSearchState = {
        ...nextSearchState,
        sortBy: TALKS_RELEVANT
      };
    } else if (!!searchState.query && !nextSearchState.query) {
      modifiedNextSearchState = {
        ...nextSearchState,
        sortBy: TALKS_RECENTLY_ADDED
      };
    }
    const debouncedNavigate = debounce(() => {
      navigate(searchStateToUrl(location, modifiedNextSearchState), {
        state: modifiedNextSearchState
      });
    }, URL_UPDATE_DEBOUNCE_TIME);
    setSearchState(modifiedNextSearchState);
    debouncedNavigate();
  };
  return (
    <InstantSearch
      appId={process.env.REACT_APP_ALGOLIA_APP_ID}
      indexName={TALKS_RECENTLY_ADDED}
      apiKey={process.env.REACT_APP_ALGOLIA_API_KEY}
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
        <SearchStateProvider location={location}>
          <ControlledInstantSearch
            children={children}
            location={location}
            navigate={navigate}
          />
        </SearchStateProvider>
      )}
    </Location>
  );
}

export { useSearchState, urlToSearchState, searchStateToUrl };
export default InstantSearchWithLocation;
