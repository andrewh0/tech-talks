import React, { useState } from 'react';
import { sortBy, omit } from 'lodash';

import { Span, Box, H1, P, StyledLink } from './design';
import { CONTENT_MAX_WIDTH } from './theme';
import VideoCard, { VideoHit } from './VideoCard';
import {
  OnVideoCardClickType,
  SavedTalksMapType,
  OnVideoSaveType
} from './App';
import Icon, { add } from './Icon';

function SavedPage(props: {
  path: string;
  onVideoCardClick: OnVideoCardClickType;
  onVideoSave: OnVideoSaveType;
  playerSize: string;
  savedTalks: SavedTalksMapType;
}) {
  const initialSavedTalks = () =>
    sortBy(props.savedTalks, [o => o.order]).map(talk => omit(talk, ['order']));
  const [savedTalks, setSavedTalks] = useState(initialSavedTalks);
  const onVideoSave = (talk: VideoHit, shouldSave: boolean) => {
    const nextSavedTalks = savedTalks.filter(
      (savedTalk: VideoHit) => savedTalk.objectID !== talk.objectID
    );
    setSavedTalks(nextSavedTalks);
    props.onVideoSave(talk, shouldSave);
  };
  return (
    <Box px={[0, 4]} mx="auto" maxWidth={CONTENT_MAX_WIDTH}>
      <H1
        px={[2, 0]}
        pt={3}
        pb={2}
        m={0}
        fontWeight={900}
        color="almostWhite"
        fontSize={3}
      >
        My saved talks
      </H1>

      <Box
        display="flex"
        flexWrap="wrap"
        pb={props.playerSize === 'minimized' ? 7 : 4}
      >
        {savedTalks.length === 0 ? (
          <P
            my={1}
            p={2}
            color="almostWhite"
            fontWeight={900}
            fontSize={[2]}
            width="100%"
            textAlign="center"
          >
            <Span display="flex" justifyContent="center">
              No talks saved yet. When you press{' '}
              <Span display="inline-flex">
                <Icon path={add} />
              </Span>{' '}
              on a talk, it'll show up here.
            </Span>
            <StyledLink to="/" color="brand">
              Find a talk.
            </StyledLink>
          </P>
        ) : (
          savedTalks.map((talk: VideoHit) => (
            <VideoCard
              key={talk.objectID}
              hit={talk}
              isSearchResult={false}
              isSaved={true}
              onVideoCardClick={props.onVideoCardClick}
              onVideoSave={onVideoSave}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

export default SavedPage;
