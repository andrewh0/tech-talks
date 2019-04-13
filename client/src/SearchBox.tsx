import React from 'react';
import styled from '@emotion/styled';
import { SearchBox } from 'react-instantsearch-dom';

import { Box } from './design';
import Icon, { search, close } from './Icon';

const SearchContainer = styled(Box)`
  display: flex;
  flex-wrap: wrap;
`;

function CustomSearchBox() {
  return (
    <SearchContainer color="gray" mr={3}>
      <SearchBox
        translations={{
          placeholder: 'Find a talk...'
        }}
        submit={<Icon path={search} />}
        reset={<Icon path={close} />}
        autoFocus={true}
      />
    </SearchContainer>
  );
}

export default CustomSearchBox;
