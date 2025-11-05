import './Videos.css';
import './Content.css';

function LocalTestingInfo({ onNavigate }) {
  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Local Testing Info</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Local Testing Info</h1>
        <div className="content-body" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
          
          <h2>Test your task solution with real agent</h2>
          
          <ol>
            <li>Receive API key from Snorkel via email</li>
            <li>Update environmental variables:
              <pre><code>export OPENAI_API_KEY=&lt;Portkey API key&gt;
export OPENAI_BASE_URL=https://api.portkey.ai/v1</code></pre>
            </li>
            <li>Two models are available currently - GPT-5 and Claude Sonnet 4.5:
              <pre><code>tb run --agent terminus-2 --model openai/@openai-tbench/gpt-5 --task-id &lt;task_id&gt;
tb run --agent terminus-2 --model openai/@anthropic-tbench/claude-sonnet-4-5-20250929 --task-id &lt;task_id&gt;</code></pre>
            </li>
          </ol>

          <h2>Check your task solution with Terminal Bench check</h2>
          
          <ol>
            <li>Receive API key from Snorkel via email</li>
            <li>Update environmental variables:
              <pre><code>export OPENAI_API_KEY=&lt;Portkey API key&gt;
export OPENAI_BASE_URL=https://api.portkey.ai/v1</code></pre>
            </li>
            <li>Two models are available currently - GPT-5 and Claude Sonnet 4.5:
              <pre><code>tb tasks check &lt;task_id&gt; --model openai/@openai/gpt-5
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

