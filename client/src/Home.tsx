import React from 'react';
import { Location } from '@reach/router';
import Search from './Search';
import { OnVideoCardClickType } from './App';
import { Box } from './design';

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
