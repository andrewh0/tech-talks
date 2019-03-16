import React, { useState } from 'react';
import { ThemeProvider } from 'emotion-theming';
import { Router } from '@reach/router';

import theme from './theme';
import { Box } from './design';

import { InstantSearchProvider } from './Search';
import Nav from './Nav';
import Home from './Home';
import About from './About';
import YouTubePlayer from './YouTubePlayer';

export type OnVideoCardClickType = (objectId: string, videoId: string) => void;

function App() {
  const [videoId, setVideoId] = useState();
  const handleVideoCardClick = (objectId: string, videoId: string) => {
    setVideoId(videoId);
  };
  return (
    <ThemeProvider theme={theme}>
      <InstantSearchProvider>
        <Nav />
        <Box bg="darkGray">
          <Router>
            <Home path="/" onVideoCardClick={handleVideoCardClick} />
            <About path="about" />
          </Router>
          <YouTubePlayer videoId={videoId} />
        </Box>
      </InstantSearchProvider>
    </ThemeProvider>
  );
}

export default App;
