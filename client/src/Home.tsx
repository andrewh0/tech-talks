import React from 'react';
import Search from './Search';
import { OnVideoCardClickType } from './App';
import { Box } from './design';

function Home(props: { onVideoCardClick: OnVideoCardClickType; path: string }) {
  return (
    <Box>
      <Search onVideoCardClick={props.onVideoCardClick} />
    </Box>
  );
}

export default Home;
