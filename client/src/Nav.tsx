import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { color, space, display } from 'styled-system';
import { SearchBox } from 'react-instantsearch-dom';
import { Link, Location, NavigateFn, WindowLocation } from '@reach/router';

import theme, { NAV_HEIGHT } from './theme';
import { Box, Button } from './design';
import Logo from './Logo';
import AlgoliaLogo from './AlgoliaLogo';
import Icon, { search, close, menu, openInNew } from './Icon';

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

const SearchContainer = styled(Box)`
  display: flex;
  align-items: center;
  width: 100%;
`;

function HomeNav({
  location,
  navigate,
  onMenuToggle,
  isMenuOpen
}: {
  location: WindowLocation;
  navigate: NavigateFn;
  onMenuToggle: (isMenuOpen: boolean) => void;
  isMenuOpen: boolean;
}) {
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

  useEffect(() => {
    if (location.pathname !== '/') {
      toggleSearchOpen(false);
    }
  }, [location.pathname]);

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
      <NavLinks onMenuToggle={onMenuToggle} isMenuOpen={isMenuOpen} />
      <NavButton
        onClick={() => {
          toggleSearchOpen(true);
          if (location.pathname !== '/') {
            navigate('/');
          }
        }}
      >
        <Icon path={search.path} viewBox={search.viewBox} />
      </NavButton>
    </React.Fragment>
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
            <Icon
              path={openInNew.path}
              viewBox={openInNew.viewBox}
              height="16px"
              width="16px"
            />
          </Box>
        </NavA>
      </Box>

      <Box display={['flex', 'none']} alignItems="center">
        <NavButton
          onClick={(_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            onMenuToggle(!isMenuOpen);
          }}
        >
          <Icon path={menu.path} viewBox={menu.viewBox} />
        </NavButton>
        <Logo />
      </Box>
    </Box>
  );
}

const MenuList = styled('ul')`
  margin: 0;
  padding: 0;
  z-index: 1;
  left: 0;
  top: 100%;
  background-color: ${theme.colors.darkGray};
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
      <Location>
        {({ location, navigate }) => (
          <HomeNav
            location={location}
            navigate={navigate}
            onMenuToggle={handleToggleMenu}
            isMenuOpen={isMenuOpen}
          />
        )}
      </Location>
      {isMenuOpen ? (
        <MenuList display={['block', 'none']}>
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
                <Icon
                  path={openInNew.path}
                  viewBox={openInNew.viewBox}
                  height="16px"
                  width="16px"
                />
              </Box>
            </MenuItemA>
          </MenuItem>
        </MenuList>
      ) : null}
    </StyledNav>
  );
}

export default Nav;
