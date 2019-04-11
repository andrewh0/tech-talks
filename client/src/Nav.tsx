import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { color, space } from 'styled-system';
import { SearchBox } from 'react-instantsearch-dom';
import { Match } from '@reach/router';

import { NAV_HEIGHT } from './theme';
import { Box, Button } from './design';
import Logo from './Logo';
import AlgoliaLogo from './AlgoliaLogo';
import Icon, { search, close } from './Icon';

const StyledNav = styled('nav')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${NAV_HEIGHT}px;
  ${color}
  ${space}
`;

const NavButton = styled(Button)`
  background: none;
  &:hover {
    background: none;
  }
  ${color};
`;

const SearchContainer = styled(Box)`
  display: flex;
  align-items: center;
  border-radius: 0;
  width: 100%;
`;

function HomeNav() {
  const [isSearchOpen, toggleSearchOpen] = useState();
  const handleCloseSearch = (e: KeyboardEvent) => {
    const which = e.which || e.keyCode;
    if (which === 27) {
      // Escape key
      toggleSearchOpen(false);
    }
  };
  useEffect(() => {
    if (isSearchOpen) {
      document.addEventListener('keydown', handleCloseSearch);
    }
    return () => {
      document.removeEventListener('keydown', handleCloseSearch);
    };
  }, [isSearchOpen]);

  return isSearchOpen ? (
    <SearchContainer color="gray" p={1}>
      <SearchBox
        translations={{
          placeholder: 'Find a talk...'
        }}
        submit={<Icon path={search.path} viewBox={search.viewBox} />}
        autoFocus={true}
      />
      <NavButton
        p={1}
        onClick={() => {
          toggleSearchOpen(false);
        }}
        color="gray"
      >
        <Icon path={close.path} viewBox={close.viewBox} />
      </NavButton>
      <Box p={1}>
        <a
          href="https://www.algolia.com"
          target="_blank"
          rel="noreferrer noopener"
        >
          <AlgoliaLogo />
        </a>
      </Box>
    </SearchContainer>
  ) : (
    <React.Fragment>
      <Logo />
      <NavButton
        onClick={() => {
          toggleSearchOpen(true);
        }}
      >
        <Icon path={search.path} viewBox={search.viewBox} />
      </NavButton>
    </React.Fragment>
  );
}

function Nav() {
  return (
    <StyledNav bg="black" p={2}>
      <Match path="/talks/:objectId">
        {({ match }) => (match ? <Logo /> : <HomeNav />)}
      </Match>
    </StyledNav>
  );
}

export default Nav;
