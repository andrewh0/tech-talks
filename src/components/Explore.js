// @flow

import React, { Component } from 'react';
import VideoItem from './VideoItem';
import { SectionTitle, PageContentContainer } from './util/sharedStyles';
import { InfiniteHits } from 'react-instantsearch/dom';

class Explore extends Component<*> {
  render() {
    return (
      <PageContentContainer>
        <SectionTitle>Popular Talks</SectionTitle>
        <InfiniteHits hitComponent={VideoItem} />
      </PageContentContainer>
    );
  }
}

export default Explore;
