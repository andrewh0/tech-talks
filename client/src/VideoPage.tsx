import React, { useEffect } from 'react';
import { Location, Link } from '@reach/router';
import { OnVideoCardClickType } from './App';
import { Box } from './design';

function VideoPage(props: {
  path: string;
}) {
  return (
    <Box>
      <Link to="/">Go back home</Link>
    </Box>
  );
}

export default VideoPage;
