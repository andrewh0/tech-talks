import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Router, Link } from '@reach/router';

import theme from './theme';
import About from './About';
import Home from './Home';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <nav>
        <Link to="/">Home</Link>
        <Link to="about">About</Link>
      </nav>
      <Router>
        <Home path="/"/>
        <About path="about"/>
      </Router>
    </ThemeProvider>
  );
}

export default App;
