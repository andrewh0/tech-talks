import React from 'react';
import styled from '@emotion/styled';
import { connectSortBy } from 'react-instantsearch-dom';
import { space, fontSize, fontWeight, color } from 'styled-system';

type SortByItem = { value: string; label: string };

const Select = styled('select')`
  appearance: none;
  display: inline-block;
  border: none;
  cursor: pointer;
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
    <Select
      value={currentRefinement}
      onChange={onChange}
      fontWeight={900}
      color="brand"
      bg="darkGray"
      fontSize={[3]}
    >
      {items.map((item: SortByItem) => (
        <option value={item.value} key={item.value}>
          {item.label}
        </option>
      ))}
    </Select>
  );
};

const ConnectedSortBy = connectSortBy(SortBy);

export default ConnectedSortBy;
