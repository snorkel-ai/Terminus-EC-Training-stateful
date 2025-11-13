import './Videos.css';

function FAQ({ onNavigate }) {
  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="videos-logo">FAQ</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Frequently Asked Questions</h1>
        <div className="faq-container">
          <div className="faq-item">
            <h2 className="faq-question">1. Do I need to attend onboarding to get started?</h2>
            <p className="faq-answer">No, you do not need to attend a live onboarding. We encourage this so that you can ask questions and they're scheduled every couple of days in case you can't make one day. However, we also have a recording and slides from this session on this site, so you're free to look at those to familiarize yourself and get started right away.</p>
          </div>
          
          <div className="faq-item">
            <h2 className="faq-question">2. I didn't receive an assessment, do I need to take one?</h2>
            <p className="faq-answer">No, there is currently no assessment for this project, you can get started familiarizing yourself with the task and working on it immediately.</p>
          </div>
          
          <div className="faq-item">
            <h2 className="faq-question">3. How do I receive my API keys?</h2>
            <p className="faq-answer">You should receive an email with your OpenAI API key shortly after joining the project. If you haven't received it within a day or two, please reach out to Connor Young on Slack. You will only need the OpenAI key - our infrastructure will allow you to run Anthropic models using only this key.</p>
          </div>
          
          <div className="faq-item">
            <h2 className="faq-question">4. Why do I not see anything in my Snorkel Expert Platform?</h2>
            <p className="faq-answer">This project is currently being run entirely outside of the Snorkel Expert Platform. Therefore, you should not and will not see anything related to the project on the platform. Everything will be done through the GitHub repo at this point in time.</p>
          </div>
          
          <div className="faq-item">
            <h2 className="faq-question">5. How do I get served a task?</h2>
            <p className="faq-answer">You will not be "served" a task to complete like in other Snorkel projects. You will be ideating and creating the task completely from scratch. Please see the Task Walkthrough videos for more detail on how to do this.</p>
          </div>
          
          <div className="faq-item">
            <h2 className="faq-question">6. How do I get an idea for my task?</h2>
            <p className="faq-answer">You can either come up with a task from scratch or take a task idea from our sheet of task ideas, this is up to you. You can also use the task ideas as "inspiration" and come up with a similar or more complex version.</p>
          </div>
          
          <div className="faq-item">
            <h2 className="faq-question">7. How do I claim an existing task idea from the sheet?</h2>
            <p className="faq-answer">To claim a task, please DM Connor Young on Slack with the line number of the task that you would like to claim. Please do not request more than 2-3 tasks at once, you will be capped at this until you have completed one or more of the tasks that you have previously requested.</p>
          </div>
          
          <div className="faq-item">
            <h2 className="faq-question">8. What are the daily Office Hours sessions?</h2>
            <p className="faq-answer">These are open forums that are entirely for you. You can come and ask any general questions or specific questions about your task. These are not required, but we encourage attending either to ask questions yourself or just to learn from listening to other people.</p>
          </div>
          
          <div className="faq-item">
            <h2 className="faq-question">9. How do I make a hard task?</h2>
            <p className="faq-answer">
              <strong>Important:</strong> Tasks that are not at least "Easy" difficulty rating will NOT be accepted. Here are some suggestions and guidelines to make harder tasks:
            </p>
            <ul style={{ marginTop: '0.75rem', paddingLeft: '1.5rem', color: '#64748b' }}>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Make a debugging-style task:</strong> When an agent has to figure out the root cause of an issue, it inherently requires reasoning.
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Make tasks requiring special/niche knowledge:</strong> Knowledge is publicly available but LLMs have not been well-trained on it due to niche nature. Example: <a href="https://github.com/snorkel-ai/snorkel-tb-tasks/pull/103" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>Blockchains/NFT task</a>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Use a bespoke rule buried in common rules:</strong> The task.yaml still has to clearly define it, but a bespoke rule seems to confuse an agent. Example: <a href="https://github.com/snorkel-ai/snorkel-tb-tasks/pull/174#discussion_r2497044356" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'none' }}>Bespoke rule example</a>
              </li>
              <li style={{ marginBottom: '0.75rem' }}>
                <strong>Develop a complex, multi-step task:</strong> Each step has a certain amount of chance that an agent fails, making the overall failure rate higher.
              </li>
            </ul>
          </div>
        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default FAQ;

