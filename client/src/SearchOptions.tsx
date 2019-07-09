import React, { useState } from 'react';
import {
  RefinementList,
  CurrentRefinements,
  ClearRefinements
} from 'react-instantsearch-dom';
import { Button, Box, Text } from './design';
import Icon, { filter } from './Icon';
import styled from '@emotion/styled';
import SortBy from './SortBy';
import SearchBox from './SearchBox';
import theme from './theme';
import { useSearchState } from './SearchProvider';
import { Link } from '@reach/router';

type RefinementItem = {
  count: number;
  isRefined: boolean;
  label: string;
  value: Array<string>;
};

type CurrentRefinement = {
  attribute: string;
  id: string;
  index: string;
  items: Array<CurrentRefinementItem>;
  label: string;
  value: Function;
};

type CurrentRefinementItem = {
  label: string;
  value: Function;
};

const HideableBox = styled(Box)`
  ${props => (props.isHidden ? `display: none;` : `display: flex;`)}
`;

const StyledSuggestionLink = styled(Link)`
  &:hover {
    color: ${theme.colors.brandLighter};
  }
  &:visited {
    color: ${theme.colors.brand};
  }
  color: ${theme.colors.brand};
`;

const DEFAULT_INDEX_NAME = 'TALKS';
const TALKS_RECENTLY_ADDED = 'TALKS_RECENTLY_ADDED';
const TALKS_RELEVANT = 'TALKS_RELEVANT';

const FilterButton = styled(Button)`
  padding: 0;
  display: inline-flex;
  align-items: center;
  text-transform: none;
  font-weight: normal;
  background: none;
  &:hover {
    background: none;
  }
  ${props =>
    props.isOpen
      ? `color: ${theme.colors.brand};`
      : `color: ${theme.colors.almostWhite};`}
`;

function SearchOptions() {
  const [isOpen, toggleOpen] = useState(false);
  const [searchState] = useSearchState();
  const transformItems = (items: Array<RefinementItem>) =>
    items.slice().sort((a: RefinementItem, b: RefinementItem) => {
      const textA = a.label.toUpperCase();
      const textB = b.label.toUpperCase();
      return textA < textB ? -1 : textA > textB ? 1 : 0;
    });
  const handleFilterButtonClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    toggleOpen(!isOpen);
  };
  const shouldShowRelevantOption = searchState && searchState.query;
  return (
    <Box mb={3} px={[2, 0]}>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <SearchBox />
        <Box display="flex" alignItems="center" flexWrap="wrap">
          <SortBy
            defaultRefinement={DEFAULT_INDEX_NAME}
            items={
              shouldShowRelevantOption
                ? [
                    { value: TALKS_RELEVANT, label: 'Relevance' },
                    { value: DEFAULT_INDEX_NAME, label: 'Most viewed' },
                    { value: TALKS_RECENTLY_ADDED, label: 'Newest' }
                  ]
                : [
                    { value: DEFAULT_INDEX_NAME, label: 'Most viewed' },
                    { value: TALKS_RECENTLY_ADDED, label: 'Newest' }
                  ]
            }
          />
          <FilterButton
            p={2}
            fontSize={2}
            onClick={handleFilterButtonClick}
            isOpen={isOpen}
          >
            <Box mr={1} display="flex" alignItems="center">
              <Icon path={filter} />
            </Box>
            Filter conferences
          </FilterButton>
        </Box>
      </Box>
      <Box mt={3}>
        <Text color="almostWhite">
          Try searching for talks on{' '}
          <StyledSuggestionLink to="?query=design%20systems&page=1&sort=rel">
            design systems
          </StyledSuggestionLink>
          ,{' '}
          <StyledSuggestionLink to="?query=server-side%20rendering&page=1&sort=rel">
            server-side rendering
          </StyledSuggestionLink>
          ,{' '}
          <StyledSuggestionLink to="?query=GraphQL&page=1&sort=rel">
            GraphQL
          </StyledSuggestionLink>
          , or{' '}
          <StyledSuggestionLink to="?query=web%20components&page=1&sort=rel">
            web components
          </StyledSuggestionLink>
          .
        </Text>
      </Box>
      <HideableBox
        isHidden={!isOpen}
        color="almostWhite"
        p={3}
        display="flex"
        justifyContent="center"
      >
        <RefinementList
          attribute="organizationName"
          searchable={true}
          transformItems={transformItems}
          translations={{ placeholder: 'Filter conferences...' }}
          limit={200}
        />
      </HideableBox>
      <Box color="almostWhite" px={3} pt={3} pb={0}>
        <CurrentRefinements
          transformItems={(items: Array<CurrentRefinement>) =>
            items.map(item => ({
              ...item,
              label: ''
            }))
          }
        />
        <ClearRefinements
          translations={{
            reset: 'Clear all'
          }}
        />
      </Box>
    </Box>
  );
}

export { DEFAULT_INDEX_NAME, TALKS_RECENTLY_ADDED, TALKS_RELEVANT };
export default SearchOptions;
