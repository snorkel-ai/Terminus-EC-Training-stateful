import './GuidelineSection.css';
import Sidebar from './Sidebar';
import Content from './Content';
import CompletionToggle from './Progress/CompletionToggle';

function GuidelineSection({ section }) {
  if (!section) return null;

  // Hide sidebar for overview page
  const isOverview = section.id === 'overview';

  return (
    <div className="guideline-page">
      {!isOverview && <Sidebar />}
      <div className="guideline-content-wrapper">
        <Content section={section} />
        <div className="section-actions">
          <CompletionToggle itemId={section.id} />
        </div>
      </div>
    </div>
  );
}

export default GuidelineSection;
