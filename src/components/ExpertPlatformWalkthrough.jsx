import './Videos.css';
import './Content.css';

function ExpertPlatformWalkthrough({ onNavigate }) {
  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Platform Workflow</div>
      </header>

      <main className="videos-content">
        <h1 className="videos-title">Platform Workflow</h1>
        <div className="workbook-intro">
          <p>
            Follow these step-by-step instructions to submit your task on the Snorkel Expert Platform.
          </p>
        </div>

        <div className="content-body" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'left' }}>
          
          <h2>Part 1: Download Task Skeleton</h2>
          <p>
            Go to the Terminus EC Training Hub and download the ZIP file of the task skeleton.
            Rename your task folder as desired, then implement your task locally (unchanged from GitHub repo flow).
          </p>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_12_img_1.jpeg" 
              alt="Training Hub download page"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_12_img_2.jpeg" 
              alt="Task skeleton download"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>

          <h2>Part 2: Start Submission on Platform</h2>
          <p>
            Go to your homepage on the Snorkel Expert Platform and click "Start" on the submission node for terminus-project.
            This will load the Submission interface where you can drag and drop or browse to upload your task file.
          </p>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_13_img_1.jpeg" 
              alt="Platform homepage with Start button"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_13_img_2.jpeg" 
              alt="Submission interface"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>

          <h2>Part 3: Run Fast CI Checks</h2>
          <p>
            After uploading the file and clicking the "Check Feedback" button, the fast CI checks will run on your file and return a summary of passes and failures.
          </p>
          <ul>
            <li>Note that this takes a minute or two to run</li>
            <li>If the checks all pass (green), you can continue to the next step</li>
            <li>If some of your checks fail (red), you need to iterate on your task locally and then re-upload and run the checks again</li>
          </ul>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_14_img_1.jpeg" 
              alt="Check Feedback button"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_14_img_2.jpeg" 
              alt="CI check results"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>

          <h2>Part 4: Submit After Checks Pass</h2>
          <p>
            Nothing will appear in these fields on the right at this stage - these will be used later.
            Once all Fast Static Checks pass, click Submit - do NOT check the "Send to Reviewer" box at this point in time.
          </p>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_15_img_1.jpeg" 
              alt="Submission interface before submit"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_15_img_2.jpeg" 
              alt="Submit button"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>

          <h2>Part 5: Review Agent Runs and LLM Checks</h2>
          <p>
            After submitting, after 20-30 minutes, the task will appear on the right side under "Tasks to be revised" - click Revise here.
            Now these two fields will be populated with the results of the agent runs and the LLM quality checks.
            If these don't pass, you should iterate on your task and submit again.
          </p>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_16_img_1.jpeg" 
              alt="Tasks to be revised section"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_16_img_2.jpeg" 
              alt="Agent runs and LLM check results"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>

          <h2>Part 6: Send to Human Review</h2>
          <p>
            Once all checks pass, send the task to human review by checking the "Send to Reviewer" box and then clicking Submit.
            After a human reviews, they will either accept or send back for revision - if they send back, it will again appear on the right side and you will need to iterate on your task and re-submit.
          </p>
          <div style={{ margin: '2rem 0', textAlign: 'center' }}>
            <img 
              src="/Terminus-EC-Training/platform_workflow_images/page_17_img_1.jpeg" 
              alt="Send to Reviewer checkbox"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            />
          </div>

          <div className="info-box" style={{ marginTop: '3rem' }}>
            <strong>Important:</strong> Make sure all Fast Static Checks pass before submitting, and wait for agent runs and LLM checks to complete before sending to reviewer.
          </div>

        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default ExpertPlatformWalkthrough;
