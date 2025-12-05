// Central registry of all docs - used for navigation and search
export const docsConfig = {
  sections: [
    {
      title: 'Getting Started',
      items: [
        { slug: 'welcome', title: 'Welcome to TerminalBench', icon: '👋' },
        { slug: 'quick-start', title: 'Quick Start Guide', icon: '🚀' },
      ]
    },
    {
      title: 'Platform Guides',
      items: [
        { slug: 'platform-setup', title: 'Platform Setup', icon: '⚙️' },
        { slug: 'github-workflow', title: 'GitHub Workflow', icon: '🔀' },
      ]
    },
    {
      title: 'Creating Tasks',
      items: [
        { slug: 'what-makes-good-task', title: 'What Makes a Good Task', icon: '✨' },
        { slug: 'task-creation-guide', title: 'Task Creation Guide', icon: '📝' },
        { slug: 'task-examples', title: 'Example Tasks', icon: '💡' },
      ]
    },
    {
      title: 'Submitting Work',
      items: [
        { slug: 'submission-process', title: 'Submission Process', icon: '📤' },
        { slug: 'submission-checklist', title: 'Submission Checklist', icon: '✅' },
      ]
    },
    {
      title: 'Reference',
      items: [
        { slug: 'faq', title: 'FAQ', icon: '❓' },
        { slug: 'glossary', title: 'Glossary', icon: '📖' },
        { slug: 'troubleshooting', title: 'Troubleshooting', icon: '🔧' },
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
