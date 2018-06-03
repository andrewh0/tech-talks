// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import {
  PageContentContainer,
  SectionTitle,
  Copy,
  Section
} from './util/sharedStyles';

const Content = styled.div`
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: 8px;
`;

class Home extends Component<*> {
  render() {
    return (
      <Content>
        <PageContentContainer>
          <Section>
            <SectionTitle>TechTalks</SectionTitle>
            <Copy>Conference talks about web development</Copy>
          </Section>
          <Section>
            <SectionTitle>Newest</SectionTitle>
          </Section>
          <Section>
            <SectionTitle>Featured</SectionTitle>
          </Section>
          <Section>
            <SectionTitle>Most viewed</SectionTitle>
          </Section>
        </PageContentContainer>
      </Content>
    );
  }
}

export default Home;
