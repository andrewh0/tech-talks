import React from 'react';
import Search from './Search';
import { OnVideoCardClickType } from './App';

function Home(props: {
  onVideoCardClick: OnVideoCardClickType,
  path: string
}) {
  return (
    <div>
      HOME
      <Search onVideoCardClick={props.onVideoCardClick} />
    </div>
  );
}

export default Home;