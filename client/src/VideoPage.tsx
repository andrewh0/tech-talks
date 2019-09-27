import React, { useEffect } from 'react';
import { Box } from './design';
import { useCurrentVideo } from './CurrentVideoProvider';
import { usePlayerState } from './PlayerContextProvider';
import { navigate } from '@reach/router';
import db, { FirebaseTalk } from './firebaseDbClient';

function VideoPage(props: { path: string; objectId?: string }) {
  const setPlayerSize = usePlayerState()[1];
  const { setCurrentVideo, video } = useCurrentVideo();
  useEffect(() => {
    const handleVideoPageLoad = async (objectId?: string): Promise<void> => {
      if (objectId) {
        let talk = null;
        try {
          const talkDoc = await db
            .collection('talks')
            .doc(objectId)
            .get();
          const talkData = talkDoc.data() as FirebaseTalk;
          if (talkData && talkDoc.exists) {
            const {
              eventId,
              updatedAt,
              createdAt,
              hidden,
              publishedAt,
              id,
              ...talkAttributes
            } = talkData;
            const eventDoc = await db
              .collection('events')
              .doc(eventId)
              .get();
            const eventData = eventDoc.exists && eventDoc.data();
            if (eventData) {
              const orgDoc = await db
                .collection('organizations')
                .doc(eventData.organizationId)
                .get();
              const orgData = orgDoc.exists && orgDoc.data();
              if (orgData) {
                talk = {
                  ...talkAttributes,
                  objectID: id,
                  publishedAt: new Date(publishedAt).valueOf(),
                  organizationName: orgData.name,
                  organizationId: orgData.id
                };
              }
            }
          }
        } catch (e) {
          console.log(e);
        }
        if (talk) {
          setCurrentVideo(talk);
          setPlayerSize('full');
          return;
        }
      }
      navigate('/404', { replace: true });
    };
    if (
      (props.objectId && !video) ||
      (video && props.objectId !== video.objectID)
    ) {
      handleVideoPageLoad(props.objectId);
    }
  }, [props.objectId, video, setCurrentVideo, setPlayerSize]);
  return <Box />;
}

export default VideoPage;
