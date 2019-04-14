import React from 'react';
import { Location } from '@reach/router';
import SearchResults from './SearchResults';
import SearchOptions from './SearchOptions';
import { OnVideoCardClickType } from './App';
import { Box, Text } from './design';
import AlgoliaLogo from './AlgoliaLogo';
import { CONTENT_MAX_WIDTH } from './theme';

const Title = Text.withComponent('h1');

function Home(props: {
  onVideoCardClick: OnVideoCardClickType;
  path: string;
  setPlayerSize: Function;
  videoId?: string;
  playerSize: string;
}) {
  return (
    <Location>
      {({ navigate }) => (
        <Box px={[0, 4]} mx="auto" maxWidth={CONTENT_MAX_WIDTH}>
          <Title
            px={[2, 0]}
            pt={3}
            pb={0}
            m={0}
            fontWeight={900}
            color="almostWhite"
            fontSize={3}
          >
            Conference talks about web development
          </Title>
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
          />
        </Box>
      )}
    </Location>
  );
}

export default Home;
