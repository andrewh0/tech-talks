import React from 'react';
import { Box, H1, P, A } from './design';
import { CONTENT_MAX_WIDTH } from './theme';

function NotFound(_props: { path: string }) {
  return (
    <Box p={[2, 4]} mx="auto" color="almostWhite" maxWidth={CONTENT_MAX_WIDTH}>
      <H1 fontSize={[3, 4]} fontWeight={900} mx={0} mt={0} mb={3}>
        Not Found
      </H1>
      <P fontSize={[2, 3]} fontWeight={500} mt={0}>
        Sorry, we couldn't find that page.{' '}
        <A href="/" color="brand">
          Try a different search.
        </A>
      </P>
    </Box>
  );
}

export default NotFound;
