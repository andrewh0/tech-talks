import React from 'react';
import { Location } from '@reach/router';
import Search from './Search';
import SortBy from './SortBy';
import { OnVideoCardClickType } from './App';
import { Box, Text } from './design';

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
        <Box>
          <Title
            p={2}
            my={2}
            fontWeight={900}
            color="almostWhite"
            fontSize={[3]}
          >
            Conference talks about web development, sorted by{' '}
            <SortBy
              defaultRefinement="TALKS"
              items={[
                { value: 'TALKS', label: 'view count' },
                { value: 'TALKS_RECENTLY_ADDED', label: 'publish date' }
              ]}
            />
          </Title>
          <Search
            onVideoCardClick={props.onVideoCardClick}
            navigate={navigate}
          />
        </Box>
      )}
    </Location>
  );
}

export default Home;
