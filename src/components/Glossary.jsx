import './Videos.css';
import './Content.css';

function Glossary({ onNavigate }) {
  return (
    <div className="videos-page">
      <header className="videos-header">
        <button className="back-button" onClick={() => onNavigate('home')}>
          ← Back to Home
        </button>
        <div className="videos-logo">Glossary</div>
      </header>
      
      <main className="videos-content">
        <h1 className="videos-title">Glossary</h1>
        <div className="content-body" style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'left' }}>
          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Oracle Agent</h3>
            <p style={{ marginBottom: 0 }}>
              Agent that is run in created environment to check the solution implemented in the solution.sh file. 
              Checks that the solution runs correctly and without bugs, and tests the output of the solution against 
              the created pytests to ensure that the solution passes.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Terminal-Bench</h3>
            <p style={{ marginBottom: 0 }}>
              A suite of multi-step agentic tasks executed in a Command-Line Interface (CLI) environment, designed to 
              benchmark the performance of models. This project aims to develop a high-quality dataset in the style 
              of Terminal-Bench.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Terminus Framework</h3>
            <p style={{ marginBottom: 0 }}>
              The framework for which tasks must be compatible. Tasks are designed to include necessary components 
              that work with the Terminus framework for evaluation and execution.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>task.yaml</h3>
            <p style={{ marginBottom: 0 }}>
              Clear and self-contained description of the task to be accomplished by the agent. Includes references 
              to relevant resources, rules and constraints, success criteria, and task metadata. Must be written by 
              a human and should explicitly mention any filenames that agents need to produce.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Dockerfile</h3>
            <p style={{ marginBottom: 0 }}>
              Base Dockerfile or image that fully sets up the environment, including all required tools, resources, 
              and dependencies. It should be reproducible, lightweight, and run without privileged mode. Must not 
              copy tests/ folder or solution files, as these are automatically copied by the harness.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>docker-compose.yaml</h3>
            <p style={{ marginBottom: 0 }}>
              Configuration file that defines how containers, volumes, and networks are orchestrated for the task. 
              It should reference the base image from the Dockerfile and include any necessary environment variables 
              or mounted resources. Must not use privileged containers.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>solution.sh</h3>
            <p style={{ marginBottom: 0 }}>
              Expert-authored step-by-step solution contained within a shell script that reliably and accurately 
              completes the task. Must demonstrate a sequence of commands that derive the answer, rather than 
              directly outputting the final answer with echo/cat. Used by the Oracle Agent to verify the task is solvable.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>run-tests.sh</h3>
            <p style={{ marginBottom: 0 }}>
              Script used to execute and validate the end-to-end evaluation of the task. It coordinates running the 
              agent within the defined environment, invokes test cases or success criteria checks, and produces 
              structured output (e.g., logs or JSON summaries) that indicate task completion status. Must be 
              deterministic, portable, and callable directly from the project root. Should use uv init or uv venv, 
              or have proper task.yaml keywords.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>test_outputs.py</h3>
            <p style={{ marginBottom: 0 }}>
              Series of deterministic Python scripts containing unit tests that check task completion based on the 
              final state of the environment. Each test should have informative docstrings describing which behavior 
              or requirement the test is checking. All behavior described in task.yaml should have corresponding tests.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>CI Checks</h3>
            <p style={{ marginBottom: 0 }}>
              Automated checks that validate technical requirements for submissions. Include checks for pinned 
              dependencies, typos, canary strings, Dockerfile references, absolute paths, privileged containers, 
              linting (ruff), file sizes, and required task.yaml fields. All CI checks must pass before a submission 
              can be accepted.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>LLMAJ Checks</h3>
            <p style={{ marginBottom: 0 }}>
              Automated checks that evaluate task quality and correctness. Include checks for behavior alignment 
              between task description and tests, informative test docstrings, anti-cheating measures, structured 
              data schema description, hardcoded solutions, and file reference mentions. These checks ensure the 
              task is well-designed and properly tested.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Canary String</h3>
            <p style={{ marginBottom: 0 }}>
              A special string that must be present at the top of all required files (task.yaml, solution.sh, 
              Dockerfile, test_outputs.py). Used to verify that these files have been properly reviewed and meet 
              project standards.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Task Difficulty Classifications</h3>
            <p style={{ marginBottom: 0 }}>
              Tasks are classified by difficulty based on accuracy targets for GPT-5 or Sonnet 4.5: <strong>Hard</strong> 
              - accuracy &lt; 40%, <strong>Medium</strong> - accuracy &lt; 60% for either model, <strong>Easy</strong> - 
              accuracy &lt; 80% for either model. Difficulty should be based on effort required by a human expert.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Pass Rate Difficulty</h3>
            <p style={{ marginBottom: 0 }}>
              The average pass rate for an acceptable task must be &lt;80%. This ensures tasks are challenging enough 
              to provide meaningful evaluation of agent capabilities.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>uv</h3>
            <p style={{ marginBottom: 0 }}>
              A fast Python package installer and resolver written in Rust. Used in the Terminus project for managing 
              Python dependencies and virtual environments. Required for running tasks and managing test dependencies.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>stb</h3>
            <p style={{ marginBottom: 0 }}>
              Command-line tool for Terminal-Bench tasks. Used with commands like <code>uv run stb tasks create</code> 
              to create new task structures and manage task-related operations.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>tb run</h3>
            <p style={{ marginBottom: 0 }}>
              Command used to run tasks with different agents. Example: <code>tb run --agent oracle --task-id &lt;task-name&gt;</code> 
              runs the Oracle Agent on a specified task to verify the solution works correctly.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Pinned Dependencies</h3>
            <p style={{ marginBottom: 0 }}>
              All Python dependencies must be pinned to specific versions to ensure reproducibility. Apt packages should 
              not be pinned, but all pip/uv dependencies should have exact versions specified. This is checked by the 
              pinned_dependencies CI check.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Absolute Paths</h3>
            <p style={{ marginBottom: 0 }}>
              Task instructions in task.yaml must use absolute paths (starting with /) instead of relative paths. 
              This ensures clarity and prevents ambiguity about file locations in the task environment.
            </p>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <h3 style={{ marginTop: 0, marginBottom: '0.75rem' }}>Anti-Cheating Measures</h3>
            <p style={{ marginBottom: 0 }}>
              Design elements that prevent agents from cheating by editing data files, looking inside files for solution 
              strings, training on the test set, or bypassing intended task requirements. Tasks should be designed so 
              that agents cannot pass by exploiting unintended shortcuts.
            </p>
          </div>
        </div>
      </main>

      <footer className="videos-footer">
        <p>&copy; 2025 Terminus EC Training. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Glossary;

