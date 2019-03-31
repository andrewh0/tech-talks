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
  alignItems,
  textAlign
} from 'styled-system';

import theme from './theme';

const Box = styled('div')`
  ${space}
  ${width}
  ${fontSize}
  ${color}
  ${display}
  ${flexWrap}
  ${justifyContent}
  ${alignItems}
`;

const Text = styled('div')`
  ${space}
  ${fontSize}
  ${fontWeight}
  ${lineHeight}
  ${color}
  ${textAlign}
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

export { Box, Button, Text, StyledLink };
