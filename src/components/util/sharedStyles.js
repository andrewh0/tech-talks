// @flow

import styled from 'styled-components';

// Grayscale
const BLACK = '#00031A';
const GRAY = '#646570';
const DARK_GRAY = '#131313';
const WHITE = '#dedede';

const BRAND_COLOR = '#56A4FF';
const TEXT_COLOR = BLACK;
const MUTED_TEXT_COLOR = GRAY;

const PageContentContainer = styled.div`
  padding: 16px 24px;
`;

const SectionTitle = styled.h1`
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 40px;
  font-weight: 800;
`;

const Section = styled.section`
  max-width: 800px;
  padding: 24px;
`;

const Copy = styled.p`
  font-size: 18px;
  line-height: 1.6;
`;

const A = styled.a`
  color: ${TEXT_COLOR};
  &:visited: {
    color: ${TEXT_COLOR};
  }
`;

export {
  PageContentContainer,
  SectionTitle,
  Section,
  Copy,
  A,
  BLACK,
  DARK_GRAY,
  GRAY,
  WHITE,
  BRAND_COLOR,
  TEXT_COLOR,
  MUTED_TEXT_COLOR
};
