'use client';

import { forwardRef } from 'react';
import { getVideoPath } from '@/lib/utils';

interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
}

export const Video = forwardRef<HTMLVideoElement, VideoProps>(({ src, ...props }, ref) => {
  // Use the utility function to get the correct path
  const videoSrc = getVideoPath(src.replace(/^\//, ''));

  return (
    <video ref={ref} {...props}>
      <source src={videoSrc} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
});

Video.displayName = 'Video';
