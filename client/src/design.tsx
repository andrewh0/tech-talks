import styled from '@emotion/styled';
import { Link } from '@reach/router';

import {
  space,
  width,
  fontSize,
  color,
  fontWeight,
  lineHeight,
  display,
  flexWrap,
  justifyContent,
  flexDirection,
  alignItems,
  textAlign,
  maxWidth
} from 'styled-system';

import theme from './theme';

const Box = styled('div')`
  ${space}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${flexWrap}
  ${flexDirection}
  ${justifyContent}
  ${alignItems}
  ${maxWidth}
`;

const Text = styled('div')`
  ${space}
  ${fontSize}
  ${fontWeight}
  ${lineHeight}
  ${color}
  ${textAlign}
  ${width}
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  ${color}
  &:visited {
    color: ${color};
  }
`;

const Button = styled('button')`
  ${space}
  ${fontSize}
  border-radius: 4px;
  border: none;
  background-color: ${theme.colors.brand};
  color: ${theme.colors.almostWhite};
  text-transform: uppercase;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: ${theme.colors.brandLighter};
  }
`;

const A = styled('a')`
  ${color}
  ${fontSize}
`;

const H1 = styled(Text)``.withComponent('h1');
const P = styled(Text)``.withComponent('p');

export { H1, P, A, Box, Button, Text, StyledLink };
