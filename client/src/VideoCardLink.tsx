import React from 'react';
import { TextButton, Text } from './design';
import { WindowLocation } from '@reach/router';

function VideoCardLink(props: {
  isSaved: boolean;
  onClick: (location: WindowLocation) => void;
  label: string;
  filterable: boolean;
  location: WindowLocation;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    props.onClick(props.location);
  };
  const styleProps = {
    color: 'gray',
    fontSize: [1, 0],
    fontWeight: 500
  };
  return props.filterable ? (
    <TextButton {...styleProps} onClick={handleClick}>
      {props.label}
    </TextButton>
  ) : (
    <Text {...styleProps}>{props.label}</Text>
  );
}

export default VideoCardLink;
