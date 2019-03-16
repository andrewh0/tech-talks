import React from 'react';
import { Highlight } from 'react-instantsearch-dom';

export type VideoHit = {
  viewCount: number;
  description: string;
  title: string;
  publishedAt: number;
  objectID: string;
  duration: number;
  source: string;
  videoId: string;
  thumbnailUrl: string;
};

function VideoCard(props: {
  hit: VideoHit;
  onVideoCardClick: (objectID: string, videoId: string) => void;
}) {
  const handleVideoCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.onVideoCardClick(props.hit.objectID, props.hit.videoId);
  };
  return (
    <div onClick={handleVideoCardClick}>
      <img src={props.hit.thumbnailUrl} alt={props.hit.title} />
      <div className="hit-name">
        <Highlight attribute="title" hit={props.hit} />
      </div>
      <div className="hit-description">
        <Highlight attribute="description" hit={props.hit} />
      </div>
    </div>
  );
}

export default VideoCard;
