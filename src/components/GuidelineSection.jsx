import './GuidelineSection.css';
import Sidebar from './Sidebar';
import Content from './Content';
import CompletionToggle from './Progress/CompletionToggle';

function GuidelineSection({ section }) {
  if (!section) return null;

  return (
    <div className="guideline-page">
      <Sidebar />
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
