import './VideoEmbed.css';

/**
 * Embeds a video in the docs - supports local video files and Loom embeds.
 * 
 * Usage in markdown:
 * <video-embed src="/path/to/video.mp4" title="Video Title" />
 * <video-loom id="loom-video-id" title="Video Title" />
 */

export function VideoEmbed({ src, title }) {
  return (
    <div className="video-embed">
      {title && <h4 className="video-embed-title">{title}</h4>}
      <div className="video-embed-wrapper">
        <video
          controls
          preload="metadata"
          className="video-embed-player"
          title={title}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export function LoomEmbed({ id, title }) {
  const embedUrl = `https://www.loom.com/embed/${id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`;
  
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
        />
      </div>
    </div>
  );
}

export default VideoEmbed;
