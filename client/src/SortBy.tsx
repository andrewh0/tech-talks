import React from 'react';
import styled from '@emotion/styled';
import { connectSortBy } from 'react-instantsearch-dom';
import { space, fontSize, fontWeight, color } from 'styled-system';
import { Box, P } from './design';

type SortByItem = { value: string; label: string };

const Select = styled('select')`
  appearance: none;
  display: inline-block;
  border: none;
  cursor: pointer;
  font-weight: bold;
  ${fontWeight}
  ${space}
  ${fontSize}
  ${color}
`;

const SortBy = ({
  items,
  currentRefinement,
  refine
}: {
  items: Array<SortByItem>;
  currentRefinement: string;
  refine: (refinement: string) => void;
}) => {
  const onChange = (e: React.MouseEvent<HTMLSelectElement, MouseEvent>) => {
    refine((e.target as HTMLSelectElement).value);
  };
  return (
    <Box pr={2}>
      <P fontSize={2} color="almostWhite" m={0} display="inline-block">
      Sort by:{' '}
      </P>
      <Select
        value={currentRefinement}
        onChange={onChange}
        color="brand"
        bg="darkGray"
        fontSize={2}
        p={2}
      >
        {items.map((item: SortByItem) => (
          <option value={item.value} key={item.value}>
            {item.label}
          </option>
        ))}
      </Select>
    </Box>
  );
};

const ConnectedSortBy = connectSortBy(SortBy);

export default ConnectedSortBy;
