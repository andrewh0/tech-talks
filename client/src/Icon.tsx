import React from 'react';
import styled from '@emotion/styled';

const expand = {
  viewBox: '0 0 24 24',
  path:
    'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z'
};

const close = {
  viewBox: '0 0 24 24',
  path:
    'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'
};

const SVG = styled('svg')`
  width: ${props => props.width || `24px`};
  height: ${props => props.height || `24px`};
`;

function Icon(props: {
  path: string;
  viewBox: string;
  width?: string;
  height?: string;
  title?: string;
}) {
  return (
    <SVG
      aria-hidden="true"
      focusable="false"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox={props.viewBox}
      width={props.width}
      height={props.height}
    >
      <path fill="currentColor" d={props.path} />
    </SVG>
  );
}

export { expand, close };

export default Icon;
