import { useNavigate } from 'react-router-dom';
import CompletionToggle from './Progress/CompletionToggle';
import './Videos.css';
import './Workbook.css';

const baseUrl = import.meta.env.BASE_URL;

function OracleTraining() {
  const navigate = useNavigate();

  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Oracle Training</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Oracle Training</h1>
        <div className="workbook-intro">
          <p>
            This page covers what the Oracle Agent is, how to run it, how to debug its output, 
            and how to submit a debugged task. Use the practice workbook to iterate on your task 
            and watch the video tutorial for a step-by-step walkthrough.
          </p>
        </div>
        
        <div className="workbook-resources">
          <div className="download-card">
            <div className="download-icon">📓</div>
            <h3>Oracle Agent Training Notebook</h3>
            <p>Download the Jupyter notebook for hands-on practice with the Oracle Agent</p>
            <a 
              href={`${baseUrl}oracle_agent_training.ipynb`} 
              download="oracle_agent_training.ipynb"
              className="download-button"
            >
              Download Notebook
            </a>
          </div>
          
          <div className="video-card">
            <h3 className="video-card-title">Oracle Training Tutorial</h3>
            <div className="video-wrapper">
              <iframe
                src="https://www.loom.com/embed/72b70216a5314068823bc6ed0350e672?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
                frameBorder="0"
                allowFullScreen
                className="video-iframe"
                title="Oracle Training Tutorial"
              ></iframe>
            </div>
          </div>
        </div>

        <div className="workbook-actions">
          <CompletionToggle itemId="resource-oracle" />
        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default OracleTraining;
