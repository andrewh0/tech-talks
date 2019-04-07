import React, { useEffect } from 'react';
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
  return <Box />;
}

export default VideoPage;
