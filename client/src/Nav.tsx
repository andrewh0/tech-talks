import React from 'react';
import styled from '@emotion/styled';
import { color, space } from 'styled-system';
import { SearchBox, PoweredBy } from 'react-instantsearch-dom';
import Logo from './Logo';
import { StyledLink } from './design';

const StyledNav = styled('nav')`
  display: flex;
  align-items: center;
  ${color}
  ${space}
`;

function Nav() {
  return (
    <StyledNav bg="black" p={3}>
      <Logo />
      <StyledLink to="about" color="almostWhite">
        About
      </StyledLink>
      <SearchBox />
      <PoweredBy />
    </StyledNav>
  );
}

export default Nav;
