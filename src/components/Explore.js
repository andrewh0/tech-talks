// @flow

import React, { Component } from 'react';
import VideoItem from './VideoItem';
import { PageContentContainer } from './util/sharedStyles';
import { Hits } from 'react-instantsearch/dom';

class Explore extends Component<*> {
  render() {
    return (
      <PageContentContainer>
        <p>My list / New / Popular / Search results</p>
        <Hits hitComponent={VideoItem} />
      </PageContentContainer>
    );
  }
}

export default Explore;
