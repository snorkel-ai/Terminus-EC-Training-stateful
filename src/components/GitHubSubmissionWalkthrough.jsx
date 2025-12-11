import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Videos.css';
import './Content.css';
import './Sidebar.css';

function GitHubSubmissionWalkthrough() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');

  const sections = [
    { id: 'workflow-overview', title: 'Environment Setup and Tasking Workflow' },
    { id: 'high-level', title: 'High-Level Tasking Workflow' },
    { id: 'initial-setup', title: 'Initial Setup and Task Creation' },
    { id: 'completing-task', title: 'Completing a Task' },
    { id: 'videos', title: 'Task Walkthrough Videos' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i].id);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => navigate('/portal')}>
          ← Back to Home
        </button>
        <div className="videos-logo">GitHub Submission Walkthrough</div>
      </header>

      <main className="videos-content" style={{ position: 'relative' }}>
        <h1 className="videos-title">GitHub Submission Walkthrough</h1>
        <div className="workbook-intro">
          <p>
            Follow these step-by-step instructions to submit your task via GitHub.
          </p>
        </div>

        <div style={{ position: 'relative', width: '100%' }}>
          <div className="content-body" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'left', display: 'flex', gap: '2rem' }}>
            <div style={{ flex: '1', minWidth: 0 }}>
              <h2 id="workflow-overview">Environment Setup and Tasking Workflow</h2>

              <h3 id="high-level">High-Level Tasking Workflow</h3>
              <p>
                Submissions should be made through this private GitHub repository: <a href="https://github.com/snorkel-ai/snorkel-tb-tasks" target="_blank" rel="noopener noreferrer">https://github.com/snorkel-ai/snorkel-tb-tasks</a>
              </p>
              <ul>
                <li>Please DM Puyun or Connor if you don't have access and you weren't onboarded onto the Snorkel Expert Platform.</li>
              </ul>
              <p>
                Once you are granted access, you should:
              </p>
              <ol>
                <li>Install uv: <code>curl -LsSf https://astral.sh/uv/install.sh | sh</code></li>
                <li>Clone the repository</li>
                <li>Create a task in your local environment under tasks directory using the CLI wizard</li>
                <li>Create your task instruction, an Oracle solution that passes, and Python tests</li>
                <li>Push a branch (e.g. <code>username/&lt;task-id&gt;</code>)</li>
                <li>Create a pull request against the repository and make sure the title starts with 'Task:'</li>
                <li>Iterate on that branch until all CI/Evals pass</li>
              </ol>

              <h3 id="initial-setup">Initial Setup and Task Creation</h3>
              <h4>Initial Setup</h4>
              <ol>
                <li>Install uv:
                  <pre><code>curl -LsSf https://astral.sh/uv/install.sh | sh</code></pre>
                </li>
                <li>Clone the repo:
                  <pre><code>git clone https://github.com/snorkel-ai/snorkel-tb-tasks.git</code></pre>
                </li>
                <li>Navigate to the created local directory:
                  <pre><code>cd snorkel-tb-tasks</code></pre>
                </li>
              </ol>
              <h4>Task Creation</h4>
              <ol>
                <li>Run the task creation wizard:
                  <pre><code>uv run stb tasks create</code></pre>
                </li>
                <li>Follow the steps given in the terminal to instantiate your task</li>
              </ol>
              <p>
                This will create a new folder for your task in your <code>snorkel-tb-tasks/harbor_tasks</code> directory. The contents of the folder contain the necessary file skeleton to complete the task.
              </p>

              <h3 id="completing-task">Completing a Task</h3>
              <ol>
                <li>Create your task instruction, an Oracle solution that passes, and Python tests</li>
                <li>Edit the created Dockerfile using a text editor to set up your task environment
                  <ul>
                    <li>Add any dependencies of the task, such as additional required packages</li>
                    <li>If you require a multi-container environment or other custom configuration, see the documentation for more information on how to customize your docker-compose.yaml</li>
                  </ul>
                </li>
                <li>Docker Troubleshooting:
                  <ul>
                    <li>Ensure you have a recent installation of Docker Desktop</li>
                    <li>On MacOS, enable the option in Advanced Settings: "Allow the default Docker socket to be used (requires password)."</li>
                    <li>Try the following:
                      <pre><code>sudo dscl . create /Groups/docker
sudo dseditgroup -o edit -a $USER -t user docker</code></pre>
                    </li>
                  </ul>
                </li>
                <li>Enter your task container in interactive mode:
                  <pre><code>uv run harbor tasks start-env --path harbor_tasks/&lt;task-name&gt; --interactive</code></pre>
                </li>
                <li>While interacting with your task container, test your solution idea to make sure that it works as expected
                  <ul>
                    <li>Once solution is verified, record it and exit the container</li>
                  </ul>
                </li>
                <li>Modify the solution file (solution/solve.sh) with the verified commands from the previous step
                  <ul>
                    <li>This file will be used by the OracleAgent to ensure the task is solvable</li>
                  </ul>
                </li>
                <li>Update the tests/test_outputs.py file to verify task completion
                  <ul>
                    <li>Create pytest unit tests to ensure that the task was completed correctly</li>
                    <li>If tests require any file dependencies, place them in the tests/ directory</li>
                  </ul>
                </li>
                <li>Test your task solution passes and meets all the requirements specified in the tests:
                  <pre><code>uv run harbor run --agent oracle --path harbor_tasks/&lt;task-name&gt;</code></pre>
                  <p>Note that you will need to clone the Terminal-Bench repo in order to run these tb commands.</p>
                </li>
                <li>Test your task solution with real agent
                  <ul>
                    <li>Receive API key from Snorkel via email</li>
                    <li>Update environment variables:
                      <pre><code>export OPENAI_API_KEY=&lt;Portkey API key&gt;
export OPENAI_BASE_URL=https://api.portkey.ai/v1</code></pre>
                    </li>
                    <li>Two models are available currently - GPT-5 and Claude Sonnet 4.5:
                      <li>GPT-5:</li>
                        <pre><code>
uv run harbor run -a terminus-2 -m openai/@openai-tbench/gpt-5 -p harbor_tasks/&lt;task-name&gt;</code></pre>
                      <li>Claude Sonnet 4.5:</li>
                        <pre><code>
uv run harbor run -a terminus-2 -m openai/@anthropic-tbench/claude-sonnet-4-5-20250929 -p harbor_tasks/&lt;task-name&gt;</code></pre>
                    </li>
                  </ul>
                </li>
                <li>Run CI/LLMaJ locally on your task
                  <ul>
                    <li>Use GPT-5 as it is used in CI:
                      <pre><code>
uv run harbor tasks check -m openai/@openai-tbench/gpt-5 -m openai/@openai-tbench/gpt-5 harbor_tasks/&lt;task-name&gt;
                      </code></pre>
                    </li>
                  </ul>
                </li>
                <li>Push a branch (e.g. <code>username/&lt;task-id&gt;</code>)
                  <ul>
                    <li>Create a new branch: <code>git checkout -b username/&lt;task-id&gt;</code></li>
                    <li>Stage your changes: <code>git add tasks/&lt;task-id&gt;</code></li>
                    <li>Commit your changes: <code>git commit -m "Add task: &lt;task-id&gt;"</code></li>
                    <li>Push your branch: <code>git push origin username/&lt;task-id&gt;</code></li>
                  </ul>
                </li>
                <li>Create a pull request against the repository and make sure the title starts with 'Task:'
                  <ul>
                    <li>Go to the snorkel-tb-tasks repository on GitHub</li>
                    <li>Click "New Pull Request" and select your branch</li>
                    <li>Make sure the PR title starts with "Task:" (e.g., "Task: Add task-id")</li>
                    <li>Fill out the pull request template with your task details</li>
                    <li>Submit the pull request for review</li>
                  </ul>
                </li>
                <li>Iterate on that branch until all CI/Evals pass</li>
              </ol>

              <h2 id="videos" style={{ marginTop: '3rem' }}>Task Walkthrough Videos</h2>
              <p style={{ marginBottom: '2rem' }}>
                Watch these step-by-step videos to learn how to create and test your task:
              </p>
              
              <div className="videos-grid" style={{ marginBottom: '2rem' }}>
                <div className="video-card">
                  <h3 className="video-card-title">1. Creating a Task</h3>
                  <div className="video-wrapper">
                    <iframe
                      src="https://www.loom.com/embed/92c2e195ac1c4b1e9b1177668dfcb81a?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
                      frameBorder="0"
                      allowFullScreen
                      className="video-iframe"
                      title="1. Creating a Task"
                    ></iframe>
                  </div>
                </div>
                
                <div className="video-card">
                  <h3 className="video-card-title">2. Running your task</h3>
                  <div className="video-wrapper">
                    <iframe
                      src="https://www.loom.com/embed/22449b76123d41e6abff0efb39d0b960?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
                      frameBorder="0"
                      allowFullScreen
                      className="video-iframe"
                      title="2. Running your task"
                    ></iframe>
                  </div>
                </div>
                
                <div className="video-card">
                  <h3 className="video-card-title">3. Creating a solution.sh</h3>
                  <div className="video-wrapper">
                    <iframe
                      src="https://www.loom.com/embed/140f2cf8f16d404abf5cbd7dcc66b7cb?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
                      frameBorder="0"
                      allowFullScreen
                      className="video-iframe"
                      title="3. Creating a solution.sh"
                    ></iframe>
                  </div>
                </div>
                
                <div className="video-card">
                  <h3 className="video-card-title">4. Creating tests for your task</h3>
                  <div className="video-wrapper">
                    <iframe
                      src="https://www.loom.com/embed/a00541ff2787464c84bf4601415ee624?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
                      frameBorder="0"
                      allowFullScreen
                      className="video-iframe"
                      title="4. Creating tests for your task"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>
            <aside style={{
              width: '180px',
              paddingRight: '1rem',
              flexShrink: 0,
              borderRight: '2px solid #e2e8f0'
            }}>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'sticky', top: '100px' }}>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    style={{
                      padding: '0.5rem 0.75rem',
                      textAlign: 'left',
                      border: 'none',
                      background: 'transparent',
                      color: activeSection === section.id ? '#1e40af' : '#64748b',
                      fontSize: '0.813rem',
                      fontWeight: activeSection === section.id ? 600 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      position: 'relative',
                      paddingLeft: '1rem'
                    }}
                    onMouseEnter={(e) => {
                      if (activeSection !== section.id) {
                        e.target.style.color = '#1e293b';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (activeSection !== section.id) {
                        e.target.style.color = '#64748b';
                      }
                    }}
                  >
                    {activeSection === section.id && (
                      <span style={{
                        position: 'absolute',
                        right: '-1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '2px',
                        height: '100%',
                        backgroundColor: '#1e40af'
                      }}></span>
                    )}
                    {section.title}
                  </button>
                ))}
              </nav>
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}

export default GitHubSubmissionWalkthrough;

