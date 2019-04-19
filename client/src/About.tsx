import React from 'react';
import { Box, H1, P, A } from './design';
import { CONTENT_MAX_WIDTH } from './theme';

function About(props: { path: string }) {
  return (
    <Box p={[2, 4]} mx="auto" color="almostWhite" maxWidth={CONTENT_MAX_WIDTH}>
      <H1 fontSize={[3, 4]} fontWeight={900} mx={0} mt={0} mb={3}>
        About
      </H1>
      <P fontSize={[2, 3]} fontWeight={500} mt={0}>
        Technical presentations can take hundreds of hours to prepare but
        unfortunately, some of the best ones are left undiscovered. Tech Talks
        contains over 4,000 conference talks about web development since 2017
        and aims to help people become better developers by making insightful
        talks more accessible.
      </P>
      <P fontSize={[2, 3]} fontWeight={500} mt={0}>
        Tech Talks was inspired by and built for the web development community.
        It's open-source and contributions are welcome on{' '}
        <A href="https://github.com/andrewh0/tech-talks/" color="brand">
          GitHub
        </A>
        .
      </P>
      <P fontSize={[2, 3]} fontWeight={500} mt={0}>
        Thanks to the folks behind{' '}
        <A href="https://confs.tech" color="brand">
          confs.tech
        </A>{' '}
        for maintaining a list of conferences that led to the first batch of
        videos. Thanks to the JavaScript community for the idea and the support.
        And thank <i>you</i> for visiting. Go build something cool!
      </P>
      <P fontSize={[2, 3]} fontWeight={500} mt={0}>
        Created by{' '}
        <A href="https://twitter.com/andrewlho_codes" color="brand">
          @andrewlho_codes
        </A>
        .
      </P>
    </Box>
  );
}

export default About;
