import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';
import './Videos.css';
import './Content.css';
import './Sidebar.css';

function ExpertPlatformWalkthrough() {
  const navigate = useNavigate();
  const posthog = usePostHog();
  const [activeSection, setActiveSection] = useState('');

  const handleSkeletonDownload = () => {
    if (posthog) {
      posthog.capture('skeleton_downloaded', {
        file_name: 'template-task.zip',
        file_title: 'Task Skeleton',
        source: 'walkthrough',
      });
    }
  };

  const sections = [
    { id: 'workflow', title: 'Environment Setup and Tasking Workflow' },
    { id: 'high-level', title: 'High-Level Tasking Workflow' },
    { id: 'initial-setup', title: 'Initial Setup (one-time)' },
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
        <div className="videos-logo">Expert Platform Submission Walkthrough</div>
      </header>

      <main className="videos-content" style={{ position: 'relative' }}>
        <h1 className="videos-title">Expert Platform Submission Walkthrough</h1>
        <div className="workbook-intro">
          <p>
            Follow these step-by-step instructions to submit your task on the Snorkel Expert Platform.
          </p>
        </div>

        <div style={{ position: 'relative', width: '100%' }}>
          <div className="content-body" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'left', display: 'flex', gap: '2rem' }}>
            <div style={{ flex: '1', minWidth: 0 }}>
              <h2 id="workflow">Environment Setup and Tasking Workflow</h2>

            <h3 id="high-level">High-Level Tasking Workflow</h3>
          <p>
            Tasking will be performed through the terminus-project project on the Snorkel Expert Platform.
            Once you are granted access, you should:
          </p>
          <ol>
            <li>Clone the open-source Terminal-Bench repo to give you access to the <code>tb</code> commands used for running the agents and programmatic checks locally</li>
            <li>Go to the training site and download the task file skeleton</li>
            <li>Rename the task folder to match your intended task name</li>
            <li>Create your task instruction, an Oracle solution that passes, and Python tests</li>
            <li>Iterate on your submission until all CI/Evals pass</li>
            <li>Create a ZIP file for your task folder</li>
            <li>Submit your ZIP file on the Platform</li>
          </ol>

          <h3 id="initial-setup">Initial Setup (one-time)</h3>
          <ol>
            <li>Clone the Terminal-Bench repository
              <pre><code>git clone https://github.com/laude-institute/terminal-bench.git</code></pre>
              <p>This gives you access to the <code>tb</code> commands used for running agents and programmatic checks locally.</p>
            </li>
          </ol>

          <h3 id="completing-task">Completing a Task</h3>
          <ol>
            <li>Download the ZIP file of the task skeleton below:
              <div style={{ marginTop: '0.75rem', marginBottom: '0.5rem', marginLeft: '1.5rem' }}>
                <a 
                  href="/Terminus-EC-Training-stateful/template-task.zip" 
                  download="template-task.zip"
                  onClick={handleSkeletonDownload}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#1e40af',
                    color: '#ffffff',
                    padding: '0.5rem 1rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#3b82f6';
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#1e40af';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.2)';
                  }}
                >
                  📥 Download Task Skeleton
                </a>
              </div>
            </li>
            <li>Extract and rename your task folder as desired</li>
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
              <pre><code>tb tasks interact -t &lt;task-name&gt;</code></pre>
            </li>
            <li>While interacting with your task container, test your solution idea to make sure that it works as expected
              <ul>
                <li>Once solution is verified, record it and exit the container</li>
              </ul>
            </li>
            <li>Modify the solution file (solution.sh) with the verified commands from the previous step
              <ul>
                <li>This file will be used by the OracleAgent to ensure the task is solvable</li>
                <li>If you need to run commands that are not possible to run with a bash script (e.g. vim), use a solution.yaml file to configure interactive commands</li>
              </ul>
            </li>
            <li>Update the tests/test_outputs.py file to verify task completion
              <ul>
                <li>Create pytest unit tests to ensure that the task was completed correctly</li>
                <li>If tests require any file dependencies, place them in the tests/ directory</li>
              </ul>
            </li>
            <li>Test your task solution passes and meets all the requirements specified in the tests:
              <pre><code>tb run --agent oracle --task-id &lt;task-name&gt;</code></pre>
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
                  <pre><code># GPT-5
tb run --agent terminus-2 --model openai/@openai-tbench/gpt-5 --task-id &lt;task_id&gt;

# Claude Sonnet 4.5
tb run --agent terminus-2 --model openai/@anthropic-tbench/claude-sonnet-4-5-20250929 --task-id &lt;task_id&gt;</code></pre>
                </li>
              </ul>
            </li>
            <li>Run CI/LLMaJ locally on your task
              <ul>
                <li>Two models are available currently - GPT-5 and Claude Sonnet 4.5:
                  <pre><code># GPT-5
tb tasks check &lt;task_id&gt; --model openai/@openai-tbench/gpt-5

# Claude Sonnet 4.5
tb tasks check &lt;task_id&gt; --model openai/@anthropic-tbench/claude-sonnet-4-5-20250929</code></pre>
                </li>
              </ul>
            </li>
            <li>Create a ZIP file of your task folder
              <ul>
                <li>Select all the individual files inside the task folder and compress them - do not compress the whole folder directly</li>
              </ul>
            </li>
            <li>Submit your task on the Snorkel Expert Platform in the terminus-project project</li>
          </ol>

          <h2 id="videos" style={{ marginTop: '3rem' }}>Task Walkthrough Videos</h2>
          <p style={{ marginBottom: '2rem' }}>
            Watch these step-by-step videos to learn how to create and test your task:
          </p>
          
          <div className="videos-grid" style={{ marginBottom: '2rem' }}>
            <div className="video-card">
              <h3 className="video-card-title">1. Running your task</h3>
              <div className="video-wrapper">
                <iframe
                  src="https://www.loom.com/embed/22449b76123d41e6abff0efb39d0b960?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
                  frameBorder="0"
                  allowFullScreen
                  className="video-iframe"
                  title="1. Running your task"
                ></iframe>
              </div>
            </div>
            
            <div className="video-card">
              <h3 className="video-card-title">2. Creating a solution.sh</h3>
              <div className="video-wrapper">
                <iframe
                  src="https://www.loom.com/embed/140f2cf8f16d404abf5cbd7dcc66b7cb?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
                  frameBorder="0"
                  allowFullScreen
                  className="video-iframe"
                  title="2. Creating a solution.sh"
                ></iframe>
              </div>
            </div>
            
            <div className="video-card">
              <h3 className="video-card-title">3. Creating tests for your task</h3>
              <div className="video-wrapper">
                <iframe
                  src="https://www.loom.com/embed/a00541ff2787464c84bf4601415ee624?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
                  frameBorder="0"
                  allowFullScreen
                  className="video-iframe"
                  title="3. Creating tests for your task"
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

export default ExpertPlatformWalkthrough;

