import './Videos.css';

function Videos({ onNavigate }) {
  const videos = [
    {
      id: '92c2e195ac1c4b1e9b1177668dfcb81a',
      title: '1. Creating a Task',
    },
    {
      id: '22449b76123d41e6abff0efb39d0b960',
      title: '2. Running your task',
    },
    {
      id: '140f2cf8f16d404abf5cbd7dcc66b7cb',
      title: '3. Creating a solution.sh',
    },
    {
      id: 'a00541ff2787464c84bf4601415ee624',
      title: '4. Creating tests for your task',
    },
  ];

  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Task Walkthrough Training</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Task Walkthrough Training</h1>
        <p className="videos-subtitle">
          Watch these step-by-step videos to learn how to create and submit tasks
        </p>
        
        <div className="videos-grid">
          {videos.map((video, index) => (
            <div key={video.id} className="video-card">
              <h3 className="video-card-title">{video.title}</h3>
              <div className="video-wrapper">
                <iframe
                  src={`https://www.loom.com/embed/${video.id}?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true`}
                  frameBorder="0"
                  allowFullScreen
                  className="video-iframe"
                  title={video.title}
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Videos;

