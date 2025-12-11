import { useNavigate } from 'react-router-dom';
import './Videos.css';
import './Content.css';

function LocalTestingInfo() {
  const navigate = useNavigate();
  
  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Local Testing Info</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Local Testing Info</h1>
        <div className="content-body" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
          
          <p style={{ marginBottom: '2rem', lineHeight: '1.7', color: '#475569' }}>
            Running agents locally allows you to iterate on your tasks more effectively compared to needing to submit your PR before receiving test results. By testing locally, you can quickly identify issues, refine your task design, and validate solutions before submitting. You'll receive your API key from Snorkel via email, which you'll need to set up your environment for local testing.
          </p>
          
          <h2>Test SOTA agent performance on your task</h2>
          
          <ol>
            <li>Receive API key from Snorkel via email</li>
            <li>Update environmental variables:
              <pre><code>export OPENAI_API_KEY=&lt;Portkey API key&gt;
export OPENAI_BASE_URL=https://api.portkey.ai/v1</code></pre>
            </li>
            <li>Two models are available currently - GPT-5 and Claude Sonnet 4.5:
              <pre><code># GPT-5
tb run --agent terminus-2 --model openai/@openai-tbench/gpt-5 --task-id &lt;task_id&gt;

# Claude Sonnet 4.5
tb run --agent terminus-2 --model openai/@anthropic-tbench/claude-sonnet-4-5-20250929 --task-id &lt;task_id&gt;</code></pre>
            </li>
          </ol>

          <h2>Check that your solution passes CI and LLMaJ checks</h2>
          
          <ol>
            <li>Receive API key from Snorkel via email</li>
            <li>Update environmental variables:
              <pre><code>export OPENAI_API_KEY=&lt;Portkey API key&gt;
export OPENAI_BASE_URL=https://api.portkey.ai/v1</code></pre>
            </li>
            <li>Two models are available currently - GPT-5 and Claude Sonnet 4.5:
              <pre><code># GPT-5
tb tasks check &lt;task_id&gt; --model openai/@openai-tbench/gpt-5

# Claude Sonnet 4.5
tb tasks check &lt;task_id&gt; --model openai/@anthropic-tbench/claude-sonnet-4-5-20250929</code></pre>
            </li>
          </ol>

        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default LocalTestingInfo;

