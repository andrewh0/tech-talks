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

const search = {
  viewBox: '0 0 24 24',
  path:
    'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z'
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

export { expand, close, search };

export default Icon;
