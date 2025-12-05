// Central registry of all docs - used for navigation and search
export const docsConfig = {
  sections: [
    {
      title: 'Getting Started',
      items: [
        { slug: 'getting-started/welcome', title: 'Welcome to TerminalBench' },
        { slug: 'onboarding/project-overview', title: 'Project Overview' },
        { slug: 'getting-started/quick-start', title: 'Quick Start Guide' },
        { slug: 'getting-started/environment-setup', title: 'Environment Setup' },
      ]
    },
    {
      title: 'Onboarding',
      items: [
        { slug: 'onboarding/platform-onboarding', title: 'Platform Onboarding' },
        { slug: 'onboarding/github-onboarding', title: 'GitHub Onboarding' },
      ]
    },
    {
      title: 'Video Walkthroughs',
      items: [
        { slug: 'creating-tasks/videos/creating-task', title: 'Creating a Task' },
        { slug: 'creating-tasks/videos/running-your-task', title: 'Running Your Task' },
        { slug: 'creating-tasks/videos/creating-solution', title: 'Creating solution.sh' },
        { slug: 'creating-tasks/videos/creating-tests', title: 'Creating Tests' },
        { slug: 'testing-and-validation/oracle-training', title: 'Oracle Training' },
        { slug: 'testing-and-validation/ci-feedback-training', title: 'CI Feedback Training' },
      ]
    },
    {
      title: 'Understanding Tasks',
      items: [
        { slug: 'understanding-tasks/what-makes-a-good-task', title: 'What Makes a Good Task' },
        { slug: 'understanding-tasks/task-components', title: 'Task Components' },
        { slug: 'understanding-tasks/task-requirements', title: 'Task Requirements' },
        { slug: 'understanding-tasks/task-taxonomy', title: 'Task Taxonomy' },
        { slug: 'understanding-tasks/example-tasks', title: 'Example Tasks' },
        { slug: 'understanding-tasks/difficulty-guidelines', title: 'Difficulty Guidelines' },
      ]
    },
    {
      title: 'Creating Tasks',
      items: [
        { slug: 'creating-tasks/task-creation-wizard', title: 'Task Creation Wizard' },
        { slug: 'creating-tasks/writing-task-yaml', title: 'Writing task.yaml' },
        { slug: 'creating-tasks/creating-docker-environment', title: 'Docker Environment' },
        { slug: 'creating-tasks/writing-oracle-solution', title: 'Writing Oracle Solution' },
        { slug: 'creating-tasks/writing-tests', title: 'Writing Tests' },
      ]
    },
    {
      title: 'Testing & Validation',
      items: [
        { slug: 'testing-and-validation/oracle-agent', title: 'Oracle Agent' },
        { slug: 'testing-and-validation/oracle-training', title: 'Oracle Training' },
        { slug: 'testing-and-validation/running-real-agents', title: 'Running Real Agents' },
        { slug: 'testing-and-validation/ci-checks-reference', title: 'CI Checks Reference' },
        { slug: 'testing-and-validation/llmaj-checks-reference', title: 'LLMaJ Checks Reference' },
        { slug: 'testing-and-validation/ci-feedback-training', title: 'CI Feedback Training' },
      ]
    },
    {
      title: 'Submitting Tasks',
      items: [
        { slug: 'submitting-tasks/platform-submission', title: 'Platform Submission' },
        { slug: 'submitting-tasks/github-submission', title: 'GitHub Submission' },
        { slug: 'submitting-tasks/submission-checklist', title: 'Submission Checklist' },
        { slug: 'submitting-tasks/after-submission', title: 'After Submission' },
      ]
    },
    {
      title: 'Reviewing Tasks',
      items: [
        { slug: 'reviewing-tasks/review-guidelines', title: 'Review Guidelines' },
        { slug: 'reviewing-tasks/common-errors', title: 'Common Errors' },
        { slug: 'reviewing-tasks/defending-your-submission', title: 'Defending Your Submission' },
      ]
    },
    {
      title: 'Reference',
      items: [
        { slug: 'reference/faq', title: 'FAQ' },
        { slug: 'reference/glossary', title: 'Glossary' },
        { slug: 'reference/rate-schedule', title: 'Rate Schedule' },
        { slug: 'reference/troubleshooting', title: 'Troubleshooting' },
        { slug: 'reference/office-hours', title: 'Office Hours' },
        { slug: 'reference/external-resources', title: 'External Resources' },
      ]
    }
  ]
};

// Helper to get all docs as flat array
export const getAllDocs = () => {
  return docsConfig.sections.flatMap(section => 
    section.items.map(item => ({
      ...item,
      section: section.title
    }))
  );
};

// For loading markdown content
export const getDocContent = async (slug) => {
  const basePath = import.meta.env.BASE_URL || '/';
  const response = await fetch(`${basePath}docs/${slug}.md`);
  if (!response.ok) {
    throw new Error(`Doc not found: ${slug}`);
  }
  return response.text();
};
