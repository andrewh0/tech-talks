import React from 'react';
import { Location } from '@reach/router';
import SearchResults from './SearchResults';
import SearchOptions from './SearchOptions';
import { OnVideoCardClickType, SavedTalksMapType, SetPlayerSizeType, OnVideoSaveType } from './App';
import { Box, H1 } from './design';
import AlgoliaLogo from './AlgoliaLogo';
import { CONTENT_MAX_WIDTH } from './theme';

function Home(props: {
  onVideoCardClick: OnVideoCardClickType;
  onVideoSave: OnVideoSaveType;
  path: string;
  setPlayerSize: SetPlayerSizeType;
  videoId?: string;
  playerSize: string;
  savedTalks: SavedTalksMapType;
}) {
  return (
    <Location>
      {({ navigate }) => (
        <Box px={[0, 4]} mx="auto" maxWidth={CONTENT_MAX_WIDTH}>
          <H1
            px={[2, 0]}
            pt={3}
            pb={0}
            m={0}
            fontWeight={900}
            color="almostWhite"
            fontSize={3}
          >
            Conference talks about web development
          </H1>
          <Box px={[2, 0]} pb={3}>
            <a
              href="https://www.algolia.com"
              target="_blank"
              rel="noreferrer noopener"
            >
              <AlgoliaLogo />
            </a>
          </Box>
          <SearchOptions />
          <SearchResults
            onVideoCardClick={props.onVideoCardClick}
            navigate={navigate}
            playerSize={props.playerSize}
            onVideoSave={props.onVideoSave}
            savedTalks={props.savedTalks}
          />
        </Box>
      )}
    </Location>
  );
}

export default Home;
