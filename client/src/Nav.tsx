import React from 'react';
import { Link } from '@reach/router';
import { SearchBox, PoweredBy } from 'react-instantsearch-dom';
import { InstantSearchProvider } from './Search';

function Nav() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="about">About</Link>
      <InstantSearchProvider>
        <SearchBox />
        <PoweredBy />
      </InstantSearchProvider>
    </nav>
  );
}

export default Nav;
