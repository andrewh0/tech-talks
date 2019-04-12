import React, { useState } from 'react';
import { RefinementList } from 'react-instantsearch-dom';
import { Button, Box } from './design';
import Icon, { filter } from './Icon';
import styled from '@emotion/styled';

type RefinementItem = {
  count: number;
  isRefined: boolean;
  label: string;
  value: Array<string>;
};

const HideableBox = styled(Box)`
  ${props => (props.isHidden ? `display: none;` : `display: flex;`)}
`;

const FilterButton = styled(Button)`
  display: inline-flex;
  align-items: center;
`;

function CustomRefinementList() {
  const [isOpen, toggleOpen] = useState(false);
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
  return (
    <Box>
      <FilterButton p={2} mb={3} onClick={handleFilterButtonClick}>
        <Box mr={1} display="flex" alignItems="center">
          <Icon path={filter.path} viewBox={filter.viewBox} />
        </Box>
        Filter
      </FilterButton>
      <HideableBox
        isHidden={!isOpen}
        color="almostWhite"
        mb={3}
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
    </Box>
  );
}

export default CustomRefinementList;
