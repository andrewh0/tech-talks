// @flow

import React from 'react';
import { Link } from 'react-router-dom';
import { SearchBox } from 'react-instantsearch/dom';
import styled from 'styled-components';
import { WHITE, BRAND_COLOR } from './util/sharedStyles';
import SignIn from './SignIn';

const NavWrapper = styled.ul`
  display: grid;
  grid-template: 56px / 1fr repeat(4, auto);
  align-items: center;
  list-style-type: none;
  padding: 0 24px;
  margin: 0;
  background-color: black;
`;

const NavListItem = styled.li`
  display: grid;
  align-items: center;
  &:first-child {
    margin-left: 0;
  }
  &:last-child {
    margin-right: 0;
  }
  width: max-content;
  height: 32px;
  margin: 0 16px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  text-transform: uppercase;
  font-weight: bold;
  color: ${WHITE};
  &:visited {
    color: ${WHITE};
  }
  font-size: 14px;
`;

const LogoWrapper = styled.span`
  color: ${BRAND_COLOR};
  &:visited {
    color: ${BRAND_COLOR};
  }
  font-size: 24px;
  font-weight: 800;
  text-transform: none;
`;

const Navigation = ({ user }) => (
  <NavWrapper>
    <NavListItem>
      <StyledLink to="/">
        <LogoWrapper>TechTalks</LogoWrapper>
      </StyledLink>
    </NavListItem>
    <NavListItem>
      <SearchBox translations={{ placeholder: 'Find a talk...' }} />
    </NavListItem>
    <NavListItem>
      <StyledLink to="/about">About</StyledLink>
    </NavListItem>
    <NavListItem>
      <StyledLink to="/contribute">Contribute</StyledLink>
    </NavListItem>
    <NavListItem>
      <SignIn user={user} />
    </NavListItem>
  </NavWrapper>
);

export default Navigation;
