import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { color, space, display } from 'styled-system';
import { Link } from '@reach/router';

import theme, { NAV_HEIGHT } from './theme';
import { Box, Button } from './design';
import Logo from './Logo';
import Icon, { menu, openInNew } from './Icon';

const StyledNav = styled('nav')`
  position: relative;
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

const NavLink = styled(Link)`
  text-transform: uppercase;
  text-decoration: none;
  font-weight: 900;
  ${space}
  ${color}
`;

const NavA = styled(NavLink)`
  display: flex;
  align-items: center;
`.withComponent('a');

const MenuList = styled('ul')`
  margin: 0;
  padding: 0;
  z-index: 2;
  left: 0;
  top: 100%;
  background-color: ${theme.colors.gray};
  position: absolute;
  width: 100%;
  box-shadow: 0px 8px 16px 8px rgba(0, 0, 0, 0.3);
  ${display}
`;

const MenuItem = styled('li')`
  color: ${theme.colors.almostWhite};
  list-style-type: none;
  text-align: center;
  cursor: pointer;
  &:hover {
    background-color: ${theme.colors.brand};
  }
`;

const menuItemStyles = `
  width: 100%;
  height: 100%;
  padding: ${theme.space[3]}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MenuItemLink = styled(NavLink)`
  ${menuItemStyles}
`;

const MenuItemA = styled(NavA)`
  ${menuItemStyles}
`;

function Nav() {
  const [isMenuOpen, toggleMenuOpen] = useState(false);
  const handleToggleMenu = (menuState: boolean) => {
    toggleMenuOpen(menuState);
  };
  const handleCloseMenu = () => {
    toggleMenuOpen(false);
  };
  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('click', handleCloseMenu);
      window.addEventListener('resize', handleCloseMenu);
    }
    return () => {
      document.removeEventListener('click', handleCloseMenu);
      window.removeEventListener('resize', handleCloseMenu);
    };
  }, [isMenuOpen]);
  return (
    <StyledNav bg="black" p={[2, 4]}>
      <NavLinks onMenuToggle={handleToggleMenu} isMenuOpen={isMenuOpen} />
      {isMenuOpen ? (
        <MenuList display={['block', 'none']}>
          <MenuItem>
            <MenuItemLink to="/saved" color="almostWhite">
              Saved Talks
            </MenuItemLink>
          </MenuItem>
          <MenuItem>
            <MenuItemLink to="/about" color="almostWhite">
              About
            </MenuItemLink>
          </MenuItem>
          <MenuItem>
            <MenuItemA
              href="https://github.com/andrewh0/tech-talks"
              color="almostWhite"
              px={2}
            >
              Contribute
              <Box pl={1} display="inline-flex">
                <Icon path={openInNew} height="16px" width="16px" />
              </Box>
            </MenuItemA>
          </MenuItem>
        </MenuList>
      ) : null}
    </StyledNav>
  );
}

function NavLinks({
  onMenuToggle,
  isMenuOpen
}: {
  onMenuToggle: (isMenuOpen: boolean) => void;
  isMenuOpen: boolean;
}) {
  return (
    <Box color="almostWhite">
      <Box display={['none', 'flex']} alignItems="center">
        <Logo />
        <NavLink to="/saved" color="almostWhite" px={2}>
          Saved Talks
        </NavLink>
        <NavLink to="/about" color="almostWhite" px={2}>
          About
        </NavLink>
        <NavA
          href="https://github.com/andrewh0/tech-talks"
          color="almostWhite"
          px={2}
        >
          Contribute
          <Box pl={1} display="inline-flex">
            <Icon path={openInNew} height="16px" width="16px" />
          </Box>
        </NavA>
      </Box>
      <Box display={['flex', 'none']} alignItems="center">
        <NavButton
          aria-label="Toggle navigation menu"
          onClick={(_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            onMenuToggle(!isMenuOpen);
          }}
        >
          <Icon path={menu} />
        </NavButton>
        <Logo />
      </Box>
    </Box>
  );
}

export default Nav;
