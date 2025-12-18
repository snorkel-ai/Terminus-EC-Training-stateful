import { useRef, useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import './VideoEmbed.css';

/**
 * Embeds a video in the docs - supports local video files and Loom embeds.
 * 
 * Usage in markdown:
 * <video-embed src="/path/to/video.mp4" title="Video Title" />
 * <video-loom id="loom-video-id" title="Video Title" />
 */

export function VideoEmbed({ src, title }) {
  const posthog = usePostHog();
  const hasTrackedStart = useRef(false);
  const hasTrackedComplete = useRef(false);

  // Handle absolute paths by prepending the base URL
  const basePath = import.meta.env.BASE_URL || '/';
  const videoSrc = src?.startsWith('/') && !src?.startsWith(basePath) 
    ? `${basePath.replace(/\/$/, '')}${src}` 
    : src;

  const handlePlay = useCallback(() => {
    if (posthog && !hasTrackedStart.current) {
      posthog.capture('docs_video_started', {
        video_src: src,
        video_title: title || src,
        video_type: 'local',
      });
      hasTrackedStart.current = true;
    }
  }, [posthog, src, title]);

  const handleEnded = useCallback(() => {
    if (posthog && !hasTrackedComplete.current) {
      posthog.capture('docs_video_completed', {
        video_src: src,
        video_title: title || src,
        video_type: 'local',
      });
      hasTrackedComplete.current = true;
    }
  }, [posthog, src, title]);

  return (
    <div className="video-embed">
      {title && <h4 className="video-embed-title">{title}</h4>}
      <div className="video-embed-wrapper">
        <video
          controls
          preload="metadata"
          className="video-embed-player"
          title={title}
          onPlay={handlePlay}
          onEnded={handleEnded}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export function LoomEmbed({ id, title }) {
  const posthog = usePostHog();
  const hasTrackedView = useRef(false);
  const embedUrl = `https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`;
  
  const handleLoad = useCallback(() => {
    // Track when Loom embed loads (user likely interacting)
    if (posthog && !hasTrackedView.current) {
      posthog.capture('docs_video_started', {
        video_src: id,
        video_title: title || id,
        video_type: 'loom',
      });
      hasTrackedView.current = true;
    }
  }, [posthog, id, title]);

  return (
    <div className="video-embed">
      {title && <h4 className="video-embed-title">{title}</h4>}
      <div className="video-embed-wrapper">
        <iframe
          src={embedUrl}
          frameBorder="0"
          allowFullScreen
          className="video-embed-iframe"
          title={title || 'Loom video'}
          onLoad={handleLoad}
        />
      </div>
    </div>
  );
}

export default VideoEmbed;
