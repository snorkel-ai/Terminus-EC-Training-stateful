export const trainingSections = [
  {
    id: 'overview',
    title: 'Project Overview',
    content: (
      <>
        <h2>Terminus Overview</h2>
        <p>Version 1.0 (Last updated: Oct 23, 2025)</p>
        
        <h3>Project Goal</h3>
        <p>
          This project aims to develop a high-quality dataset in the style of Terminal-Bench. 
          Terminal-Bench is a suite of multi-step agentic tasks executed in a Command-Line Interface (CLI) 
          environment, designed to benchmark the performance of models. You will design these tasks and 
          include the necessary components to be compatible with the Terminus framework.
        </p>

        <h3>Your Role as a Coding Expert</h3>
        <p>
          Your role is to develop a task, solution, and associated tests to verify the solution. These 
          should be quite difficult, targeting an accuracy of below 80% for GPT-5 or Sonnet 4.5.
        </p>
        
        <p><strong>Task Difficulty Classifications:</strong></p>
        <ul>
          <li><strong>Hard</strong> - accuracy &lt; 40% for GPT-5 or Sonnet 4.5</li>
          <li><strong>Medium</strong> - accuracy &lt; 60% for either GPT-5 or Sonnet 4.5</li>
          <li><strong>Easy</strong> - accuracy &lt; 80% for either GPT-5 or Sonnet 4.5</li>
        </ul>

        <p>
          You will create the task locally, validate that it meets all project criteria, and then package 
          it as part of your submissions. Each submission undergoes independent review by another qualified 
          coding expert with experience in the corresponding practice area to ensure accuracy and completeness.
        </p>

        <h3>Resources</h3>
        <ul>
          <li>Slack for all project-related questions: <strong>#ec-terminus-submission</strong></li>
          <li>Terminal-Bench site: <a href="https://www.tbench.ai/" target="_blank" rel="noopener noreferrer">https://www.tbench.ai/</a></li>
          <li>While this project is NOT affiliated with the official Terminal-Bench project, this is a valuable resource given their similarities</li>
          <li>Tickets for non-project-specific questions (i.e., payments): Expert Support Form</li>
        </ul>
      </>
    ),
  },
  {
    id: 'components',
    title: 'Task Components',
    content: (
      <>
        <h2>Key Submission Components</h2>
        
        <h3>Components that Define the Task</h3>
        
        <div className="info-box">
          <strong>Instruction/Prompt (task.yaml)</strong>
          <p>
            Clear and self-contained description of the task to be accomplished by the agent. The 
            instructions will include references to the relevant resources necessary for task completion, 
            rules and additional constraints, and a description of the success criteria. This will also 
            contain task metadata that is not available to the agent at runtime.
          </p>
        </div>

        <div className="info-box">
          <strong>Docker Environment (Dockerfile)</strong>
          <p>
            Base Dockerfile or image that fully sets up the environment, including all required tools, 
            resources, and dependencies. It should be reproducible, lightweight, and run without privileged mode.
          </p>
        </div>

        <div className="info-box">
          <strong>docker-compose.yaml</strong>
          <p>
            Configuration file that defines how containers, volumes, and networks are orchestrated for 
            the task. It should reference the base image from the Dockerfile and include any necessary 
            environment variables or mounted resources.
          </p>
        </div>

        <div className="info-box">
          <strong>Oracle Solution (solution.sh)</strong>
          <p>
            Expert-authored step-by-step solution contained within a shell script that reliably and 
            accurately completes the task.
          </p>
        </div>

        <div className="info-box">
          <strong>run-tests.sh</strong>
          <p>
            Script used to execute and validate the end-to-end evaluation of the task. It coordinates 
            running the agent within the defined environment, invokes test cases or success criteria 
            checks, and produces structured output (e.g., logs or JSON summaries) that indicate task 
            completion status. It must be deterministic, portable, and callable directly from the project root.
          </p>
        </div>

        <div className="info-box">
          <strong>Python Tests</strong>
          <p>
            Series of deterministic Python scripts containing unit tests that check task completion 
            based on the final state of the environment.
          </p>
        </div>

        <h3>Optional Components</h3>
        <ul>
          <li><strong>Supporting Data Files:</strong> Any additional inputs (e.g., data, configuration files, etc.) that are required for the task itself</li>
          <li><strong>Custom Tools:</strong> Custom tools to be used by the agent can be delivered in multiple ways, from source code files to companion containers</li>
        </ul>

        <p className="warning-box">
          <strong>Note:</strong> See the template task in the GitHub repository for an example of submission structure.
        </p>
      </>
    ),
  },
  {
    id: 'taxonomy',
    title: 'Task Type Taxonomy',
    content: (
      <>
        <h2>Task Type Taxonomy</h2>
        <p>
          The following taxonomy is used to label each task and describes the primary theme, topic, or activity in the task:
        </p>

        <div className="info-box">
          <strong>system-administration</strong>
          <p>
            Tasks involving OS-level configuration, user management, package management, processes, or installing, 
            configuring, and bringing up services, networks, and environments.
          </p>
        </div>

        <div className="info-box">
          <strong>build-and-dependency-management</strong>
          <p>Compile code, manage dependencies, build components.</p>
        </div>

        <div className="info-box">
          <strong>data-processing</strong>
          <p>
            Tasks that transform, parse, filter, aggregate datasets or files and directories and generate derived output.
          </p>
        </div>

        <div className="info-box">
          <strong>games</strong>
          <p>
            Tasks centered on game-like or simulated environments, interactive puzzles, or simulation games that run in the terminal.
          </p>
        </div>

        <div className="info-box">
          <strong>software-engineering</strong>
          <p>
            Tasks focused on developing or testing features and algorithms, fixing bugs and improving/optimizing an existing 
            feature, implementing tests, or maintaining software projects.
          </p>
        </div>

        <div className="info-box">
          <strong>machine-learning</strong>
          <p>
            Tasks requiring training, fine-tuning, running inference, or evaluating machine learning models, including 
            dependency setup, running training loops, and managing data pipelines for ML tasks.
          </p>
        </div>

        <div className="info-box">
          <strong>debugging</strong>
          <p>
            Tasks that require identifying, diagnosing, and fixing errors in scripts, codebases, or system configurations.
          </p>
        </div>

        <div className="info-box">
          <strong>security</strong>
          <p>
            Tasks related to cryptography, authentication, permissions, penetration-style tests, exploit, validate 
            vulnerabilities, reverse engineering or security configuration.
          </p>
        </div>

        <div className="info-box">
          <strong>scientific-computing</strong>
          <p>
            Tasks using scientific libraries or workflows, such as numerical computation, simulations, or domain-specific research code.
          </p>
        </div>

        <p className="warning-box">
          <strong>Note:</strong> If your Terminal-Bench tasks are designed to be relevant to a particular domain, 
          such as financial services, an additional taxonomy specific to that domain can be developed.
        </p>
      </>
    ),
  },
  {
    id: 'workflow',
    title: 'Setup + Workflow',
    content: (
      <>
        <h2>Environment Setup and Tasking Workflow</h2>
        
        <div className="warning-box">
          <strong>Before Beginning:</strong> Familiarize yourself with Terminal-Bench and its existing tasks here: 
          <a href="https://www.tbench.ai/registry/terminal-bench-core/0.1.1" target="_blank" rel="noopener noreferrer">
            https://www.tbench.ai/registry/terminal-bench-core/0.1.1
          </a>. 
          Our project, while not a direct contribution to Terminal-Bench, will mimic the style closely.
        </div>

        <h3>Submissions Workflow</h3>
        <p>Submissions will be created through a private GitHub repository: <code>https://github.com/snorkel-ai/snorkel-tb-tasks</code></p>
        
        <p>Once you receive access to this repository, please do the following:</p>
        <ol>
          <li>Clone the repository</li>
          <li>Create a task in your local environment under <code>tasks</code> directory</li>
          <li>Ensure the oracle solution passes and minimum criteria for difficulty are met</li>
          <li>Push a branch (e.g. <code>username/&lt;task-id&gt;</code>)</li>
          <li>Create a pull request against the repository and make sure the title starts with <strong>Task:</strong></li>
          <li>Iterate on that branch until all CI/Evals pass</li>
        </ol>

        <p className="info-box">
          <strong>Estimated Time:</strong> The submission task is expected to require around 2-5 hours to complete.
        </p>

        <h3>Initial Setup (one-time)</h3>
        <ol>
          <li>Install uv
            <pre><code>curl -LsSf https://astral.sh/uv/install.sh | sh</code></pre>
          </li>
          <li>Clone the repository
            <pre><code>git clone https://github.com/snorkel-ai/snorkel-tb-tasks.git</code></pre>
          </li>
          <li>Navigate to the created local directory
            <pre><code>cd snorkel-tb-tasks</code></pre>
          </li>
        </ol>

        <h3>Creating the File Structure for a New Task</h3>
        <ol>
          <li>Run the task creation wizard
            <pre><code>uv run stb tasks create</code></pre>
          </li>
          <li>[Optional] Enter 'y' to receive an overview of Terminal-Bench, or 'n' to skip</li>
          <li>Follow the steps given in the terminal to:
            <ul>
              <li>Provide a unique name for your task</li>
              <li>Provide the task description/what the task is</li>
              <li>Indicate whether interactive commands are required (most cases: no)</li>
              <li>Please skip entering your name and email (we will track this through the app)</li>
              <li>Enter a category for your task corresponding to one in the Taxonomy</li>
              <li>Enter 3-6 tags for your task (separated by spaces)</li>
              <li>Provide an easy/medium/hard rating based on how long it would take an expert to solve</li>
              <li>Provide a completion time estimate for an expert engineer</li>
              <li>Provide a completion time estimate for a junior engineer</li>
            </ul>
          </li>
        </ol>

        <p>
          This will create a new folder in your <code>snorkel-tb-tasks/tasks</code> directory, with a name 
          corresponding to the unique name provided. The contents contain all the necessary files needed for 
          task submission (unless you need to add additional data files).
        </p>

        <h3>Completing a Task After Creation</h3>
        <ol>
          <li>Edit the created Dockerfile to set up your task environment
            <ul>
              <li>Add any dependencies of the task, such as additional required packages</li>
              <li>If you require a multi-container environment or other custom configuration, see the documentation for customizing your docker-compose.yaml</li>
            </ul>
          </li>
          <li>Enter your task container in interactive mode
            <pre><code>tb tasks interact -t &lt;task-name&gt;</code></pre>
          </li>
          <li>While interacting with your task container, test your solution idea to make sure it works as expected</li>
          <li>Once solution is verified, record it and exit the container</li>
          <li>Modify the solution file (solution.sh) with the verified commands
            <ul>
              <li>This file will be used by the OracleAgent to ensure the task is solvable</li>
              <li>If you need to run commands that are not possible with a bash script (e.g. vim), use a solution.yaml file</li>
            </ul>
          </li>
          <li>Update the tests/test_outputs.py file to verify task completion
            <ul>
              <li>Create pytest unit tests to ensure that the task was completed correctly</li>
              <li>If tests require any file dependencies, place them in the tests/ directory</li>
            </ul>
          </li>
          <li>Test your task solution passes and meets all requirements
            <pre><code>tb run --agent oracle --task-id &lt;task-name&gt;</code></pre>
          </li>
          <li>Push a branch (e.g. my-task-1) to the repository</li>
          <li>Create a PR to submit your task</li>
        </ol>
      </>
    ),
  },
  {
    id: 'requirements',
    title: 'Task Requirements',
    content: (
      <>
        <h2>Task Design Requirements</h2>
        
        <div className="info-box">
          <strong>Frontier Models and Agents:</strong> The following combinations are used to evaluate each task 
          (evaluations are repeated 5 times):
          <ul>
            <li>Codex agent with GPT-5-Codex</li>
            <li>Claude Code agent with Sonnet 4.5</li>
          </ul>
        </div>

        <div className="checklist">
          <div className="checklist-item"><strong>Pass Rate Difficulty:</strong> Average pass rate for acceptable task is &lt;80%</div>
          <div className="checklist-item"><strong>Multi-Step:</strong> Tasks must require chaining multiple commands, handling intermediate states, and some reasoning</div>
          <div className="checklist-item"><strong>Testable:</strong> Each task must be fully specified with sufficient information for the agent to complete without ambiguity</div>
          <div className="checklist-item"><strong>Unique:</strong> All tasks must be unique and distinct from all existing Terminal-Bench tasks</div>
          <div className="checklist-item"><strong>No Privileged Ops:</strong> Tasks must not require root-level privileges or unsafe Docker settings</div>
          <div className="checklist-item"><strong>Standalone:</strong> Tasks must run to completion without additional user input after start</div>
          <div className="checklist-item"><strong>Task Type Distribution:</strong> No single type will exceed ~30% of offerings, with at least four types each representing ≥10%</div>
          <div className="checklist-item"><strong>(Optional) Domain Relevance:</strong> Tasks should reflect real-world skills for the relevant domain</div>
        </div>

        <h3>Submission Checklist</h3>
        <div className="checklist">
          <div className="checklist-item">All behavior checked in the test cases is described in the task instruction</div>
          <div className="checklist-item">All behavior described in the task instruction is checked in the unit tests</div>
          <div className="checklist-item">Test cases have informative docstrings that describe which behavior they check</div>
          <div className="checklist-item">Hard for agent to cheat (e.g. by editing data files or looking inside files for solutions)</div>
          <div className="checklist-item">task.yaml was written by a human</div>
          <div className="checklist-item">solution.sh was written by a human (with minimal LLM help)</div>
          <div className="checklist-item">If agent produces structured data, exact schema is described in task.yaml or separate file</div>
          <div className="checklist-item">External dependencies have pinned versions for reproducibility</div>
          <div className="checklist-item">Ran task using agent with powerful model and analyzed failing runs to confirm task validity</div>
          <div className="checklist-item">Formatted and linted the task (Ruff)</div>
        </div>
      </>
    ),
  },
  {
    id: 'examples',
    title: 'Example Tasks',
    content: (
      <>
        <h2>Example Tasks</h2>
        
        <h3>Example 1: VimGolf Challenge</h3>
        <div className="info-box">
          <strong>Category:</strong> games<br/>
          <strong>Difficulty:</strong> medium<br/>
          <strong>Tags:</strong> games, vim, text-editing
        </div>
        
        <pre><code>{`instruction: |-
  You are given a fresh install with python installed.
  First, use pip to install vimgolf.
  Then, read the file "/challenge.txt" to get the challenge id.
  Then, use vimgolf show <CHALLENGE_ID> to get the best scores,
  as well as the start file and end file.
  Then, write the Start File to /start.txt and End File to /end.txt
  Attempt the vimgolf challenge using vimgolf local /start.txt /end.txt,
  and output the string of vim inputs in "/score.txt".
  
  Your primary objective is to solve the problem within the
  minimum score * 1.5 in the leaderboard.`}</code></pre>

        <h3>Example 2: OpenCV Debugging</h3>
        <div className="info-box">
          <strong>Category:</strong> computer-vision<br/>
          <strong>Difficulty:</strong> medium<br/>
          <strong>Tags:</strong> computer-vision, jupyter-notebooks, bugfix
        </div>
        
        <pre><code>{`instruction: |-
  A Jupyter notebook at /app/opencv_analysis.ipynb contains
  several OpenCV image processing operations, but it has multiple
  errors preventing it from running successfully.
  Fix all errors in the notebook so that it executes completely
  without errors and produces the expected output image.`}</code></pre>

        <h3>Example 3: Python Bytecode Decompilation</h3>
        <div className="info-box">
          <strong>Category:</strong> software-engineering<br/>
          <strong>Difficulty:</strong> hard<br/>
          <strong>Tags:</strong> software-engineering, python, bytecode, serialization
        </div>
        
        <pre><code>{`instruction: |
  Your task is to decompile a Python function in bytecode format,
  compiled in CPython 3.8, and save the function in decompiled.py
  in the same folder as task.yaml.
  The function name should be "func".
  Note that the function is pickled using dill and serialized
  using base64 in the file called func.serialized.`}</code></pre>

        <h3>Example 4: Python Environment Setup</h3>
        <div className="info-box">
          <strong>Category:</strong> system-administration<br/>
          <strong>Difficulty:</strong> medium<br/>
          <strong>Tags:</strong> environment-setup, python, virtualenv, dependency-management
        </div>
        
        <pre><code>{`instruction: |
  Install Python using pyenv, create a virtual environment using
  pyenv/virtualenv called "venv", activate it and install
  numpy 1.26.4 in it.
  You shouldn't get any warning during Python installation.
  Make sure that tkinter is also available in the virtual environment.`}</code></pre>
      </>
    ),
  },
  {
    id: 'ci-quality',
    title: 'CI + Quality Control',
    content: (
      <>
        <h2>Quality Control</h2>
        
        <h3>Manual Peer Review</h3>
        <p>
          Peer reviewers will provide additional expert oversight on oracle correctness, prompt clarity, 
          environment correctness, and tagging. Disagreements are adjudicated by Snorkel's in-house experts.
        </p>

        <h3>LLMAJ Checks</h3>
        <p>The following automated checks evaluate task quality and correctness:</p>

        <table>
          <thead>
            <tr>
              <th>Check Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>behavior_in_task_description</code></td>
              <td>Whether all behavior checked in tests is described in the task</td>
            </tr>
            <tr>
              <td><code>behavior_in_tests</code></td>
              <td>Whether all behavior described in task is checked in unit tests</td>
            </tr>
            <tr>
              <td><code>informative_test_docstrings</code></td>
              <td>Whether test cases have informative docstrings</td>
            </tr>
            <tr>
              <td><code>anti_cheating_measures</code></td>
              <td>Is it hard for the agent to cheat on the task?</td>
            </tr>
            <tr>
              <td><code>structured_data_schema</code></td>
              <td>If agent produces structured data, is exact schema described?</td>
            </tr>
            <tr>
              <td><code>hardcoded_solution</code></td>
              <td>Solution should demonstrate command sequence, not just output answer</td>
            </tr>
            <tr>
              <td><code>file_reference_mentioned</code></td>
              <td>If agent needs to produce a file, is filename mentioned in task.yaml?</td>
            </tr>
          </tbody>
        </table>

        <h3>CI Checks</h3>
        <p>The following automated checks validate technical requirements:</p>

        <table>
          <thead>
            <tr>
              <th>Check Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>pinned_dependencies</code></td>
              <td>Are external dependencies pinned to ensure reproducibility?</td>
            </tr>
            <tr>
              <td><code>typos</code></td>
              <td>Check for typos in file and variable names</td>
            </tr>
            <tr>
              <td><code>tests_or_solution_in_image</code></td>
              <td>Ensure tests/ folder or solution file not copied to image</td>
            </tr>
            <tr>
              <td><code>test_deps_in_image</code></td>
              <td>Test dependencies should be installed in run-tests.sh</td>
            </tr>
            <tr>
              <td><code>check_canary</code></td>
              <td>Checks if canary string is present at top of required files</td>
            </tr>
            <tr>
              <td><code>check_dockerfile_references</code></td>
              <td>Ensure solution/test files not referenced in Dockerfile</td>
            </tr>
            <tr>
              <td><code>check_run-tests_sh</code></td>
              <td>Verifies run-tests.sh uses uv init or has proper task.yaml keywords</td>
            </tr>
            <tr>
              <td><code>check_task_absolute_path</code></td>
              <td>Task instructions use absolute paths rather than relative paths</td>
            </tr>
            <tr>
              <td><code>check_privileged_containers</code></td>
              <td>No privileged containers in docker-compose.yaml</td>
            </tr>
            <tr>
              <td><code>ruff</code></td>
              <td>Lint checks</td>
            </tr>
            <tr>
              <td><code>check_task_sizes</code></td>
              <td>Every file is under 1MB</td>
            </tr>
            <tr>
              <td><code>validate_task_fields</code></td>
              <td>All required fields are present in task.yaml</td>
            </tr>
          </tbody>
        </table>
      </>
    ),
  },
  {
    id: 'review',
    title: 'Review Guidelines',
    content: (
      <>
        <h2>Review Guidelines</h2>
        
        <h3>Steps for Checking Tasks</h3>
        
        <h4>1. Read the Task Description</h4>
        <div className="checklist">
          <div className="checklist-item">Check that the task description looks like it's written by a person</div>
          <div className="checklist-item">Imagine you're a malicious agent - does the description give extra information that makes cheating easier?</div>
          <div className="checklist-item">Carefully read each requirement and verify there is a corresponding test</div>
        </div>

        <h4>2. Read the Tests</h4>
        <div className="checklist">
          <div className="checklist-item">Do the tests seem brittle, with many hardcoded strings?</div>
          <div className="checklist-item">Are there hardcoded thresholds? Do these thresholds seem reasonable?</div>
          <div className="checklist-item">Are there any tests that unreasonably assume behavior not mentioned in the description?</div>
        </div>

        <h4>3. Check Timeouts, Time Estimates, and Difficulty</h4>
        <ul>
          <li>Difficulty should be based on effort required by a human</li>
          <li>Junior estimate is for an L3 at Google, expert is a domain expert</li>
          <li>Timeout should be high enough that it likely won't be the limiting factor</li>
        </ul>

        <h4>4. On the Task Viewer</h4>
        <ul>
          <li>Watch the terminal recording. If the agent fails, is it failing for a good reason?</li>
          <li>Check the analysis. Are the identified issues real?</li>
          <li>Read the debug pane, which shows why an agent failed the task</li>
        </ul>

        <h3>Common Errors to Watch For</h3>
        
        <div className="warning-box">
          <strong>Testing Behavior:</strong> It is almost always better to test a behavior by actually running 
          the code or environment the agent writes than trying to statically analyze it.
        </div>

        <div className="warning-box">
          <strong>Tool Specifications:</strong> Task instructions shouldn't mention specific tools that the agent 
          should use unless there's a way to check if these tools were actually used. For example, don't ask the 
          agent to use vim to write a text file because we can't confirm it was used over sed or emacs.
        </div>

        <div className="warning-box">
          <strong>Randomness:</strong> Tasks or solutions that involve randomness MUST NOT assume the solution 
          matches that same random order or implementation. Don't depend on particular <code>np.random.seed</code> 
          values.
        </div>

        <div className="warning-box">
          <strong>Test Complexity:</strong> Test files should be as clear and simple as possible. Long test files 
          are almost always wrong since more tests means more opportunities for error. Similarly, a task should be 
          carefully defined. It's usually a bad sign if a task description is long with many requirements.
        </div>

        <div className="warning-box">
          <strong>Data Formats:</strong> Be especially paranoid about specifying data formats like API structures, 
          json response schemas, etc. For example, if you're telling the model it needs to output a CSV you'll 
          also need to specify whether it needs a header.
        </div>

        <div className="warning-box">
          <strong>String Matching:</strong> Avoid tests that rely on string matching. This is almost always too 
          brittle. For example, checking for a python import by looking for <code>import pandas.DataFrame</code> 
          could fail because the agent could write <code>from pandas import DataFrame</code>.
        </div>

        <div className="warning-box">
          <strong>Anti-Cheating:</strong> Think about how agents could cheat. Examples:
          <ul>
            <li>If an answer is hidden in a program, ensure agents cannot directly get the answer by decompiling it</li>
            <li>If task requires running programs and reporting behavior, ensure agents can't pass by replacing programs with dummy versions</li>
            <li>If task exposes test cases, ensure they cannot pass real tests by deleting tests</li>
          </ul>
        </div>
      </>
    ),
  },
];

