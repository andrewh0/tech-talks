import React from 'react';
import styled from '@emotion/styled';
import { color, space } from 'styled-system';
import { SearchBox } from 'react-instantsearch-dom';
import { Match } from '@reach/router';

import { Box } from './design';
import Logo from './Logo';
import AlgoliaLogo from './AlgoliaLogo';

const StyledNav = styled('nav')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${color}
  ${space}
`;

function Nav() {
  return (
    <StyledNav bg="black" p={2}>
      <Logo />
      <Match path="/talks/:objectId">
        {({ match }) =>
          match ? null : (
            <Box display="flex" alignItems="center">
              <SearchBox
                translations={{
                  placeholder: 'Find a talk...'
                }}
              />
              <Box ml={1}>
                <a
                  href="https://www.algolia.com"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  <AlgoliaLogo />
                </a>
              </Box>
            </Box>
          )
        }
      </Match>
    </StyledNav>
  );
}

export default Nav;
