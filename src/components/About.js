// @flow

import React from 'react';
import {
  PageContentContainer,
  SectionTitle,
  Copy,
  Section,
  A
} from './util/sharedStyles';

const About = () => (
  <PageContentContainer>
    <Section>
      <SectionTitle>More ideas, better software.</SectionTitle>
      <Copy>
        Technical presentations can take hundreds of hours to prepare, but
        unfortunately, some of the best ones are left undiscovered. There’s
        something here for everyone, whether you’re a developer who is just
        starting out or an experienced industry veteran.
      </Copy>
    </Section>
    <Section>
      <SectionTitle>Built for the community.</SectionTitle>
      <Copy>
        Tech Talks was inspired by and built for the web development community.
        The website is open-source so if you want to make it better, you can
        head over to GitHub and submit a pull request. Or if there’s a talk
        missing here, you can contact me.
      </Copy>
    </Section>
    <Section>
      <SectionTitle>Thanks!</SectionTitle>
      <Copy>
        Thanks to <A href="https://confs.tech">confs.tech</A> for maintaining a
        list of conferences, which helped with compiling the first batch of
        videos. Thanks to the JavaScript community for the idea and the support.
        And thank <i>you</i> for visiting! Go build something cool!
      </Copy>
    </Section>
    <Section>
      <Copy>
        Created by <A href="https://twitter.com/andrewlho">@andrewlho</A>.
        Open-source on{' '}
        <A href="https://github.com/andrewh0/tech-talks">GitHub</A>.
      </Copy>
    </Section>
  </PageContentContainer>
);

export default About;
