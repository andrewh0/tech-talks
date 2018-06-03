// @flow

import React from 'react';
import styled from 'styled-components';
import { WHITE } from './util/sharedStyles';

const StyledLink = styled.a`
  text-decoration: none;
  text-transform: uppercase;
  font-weight: bold;
  color: ${WHITE};
  &:visited {
    color: ${WHITE};
  }
  font-size: 14px;
`;

class SignIn extends React.Component<*> {
  handleClick = (e: SyntheticEvent<>): void => {
    e.preventDefault();
    fetch('/logout', {
      method: 'POST',
      credentials: 'same-origin'
    }).then(response => {
      if (response.redirected) {
        window.location = response.url;
      }
    });
  };
  render() {
    const { user } = this.props;
    return user ? (
      <StyledLink href={'/logout'} onClick={this.handleClick}>
        Sign Out
      </StyledLink>
    ) : (
      <StyledLink href={'/auth/twitter'}>Sign In</StyledLink>
    );
  }
}

export default SignIn;
