import React, { useEffect } from 'react';
import { Link } from '@reach/router';
import { Box } from './design';

function VideoPage(props: {
  path: string;
  objectId?: string;
  onPageLoad: (objectId?: string) => Promise<void>;
}) {
  useEffect(() => {
    if (props.objectId) {
      props.onPageLoad(props.objectId);
    }
  }, [props.objectId]);
  return (
    <Box>
      <Link to="/">Go back home</Link>
    </Box>
  );
}

export default VideoPage;
