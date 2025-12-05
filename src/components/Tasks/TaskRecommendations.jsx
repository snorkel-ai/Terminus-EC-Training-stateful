import { useState, useRef } from 'react';
import { Badge, Button } from '../ui';
import './TaskRecommendations.css';

// Icons for different recommendation types
const icons = {
  star: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  user: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  trending: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  zap: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  ),
  compass: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
};

function TaskRecommendations({ 
  sections = [], 
  onTaskSelect, 
  onRandomTask,
  collapsed = false,
  onToggleCollapse 
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id || 'featured');
  const scrollContainerRef = useRef(null);

  if (sections.length === 0) {
    return null;
  }

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  if (collapsed) {
    return (
      <div className="task-recommendations collapsed">
        <button className="recommendations-expand" onClick={onToggleCollapse}>
          <span>Show Recommendations</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="task-recommendations">
      <div className="recommendations-header">
        <div className="recommendations-tabs">
          {sections.map(section => (
            <button
              key={section.id}
              className={`recommendations-tab ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <span className="tab-icon">{icons[section.icon]}</span>
              <span className="tab-label">{section.title}</span>
              <Badge variant="secondary" size="sm">{section.tasks.length}</Badge>
            </button>
          ))}
        </div>
        
        <div className="recommendations-actions">
          {onRandomTask && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRandomTask}
              className="surprise-button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="2.5" />
                <circle cx="8" cy="8" r="1.5" fill="currentColor" />
                <circle cx="16" cy="16" r="1.5" fill="currentColor" />
              </svg>
              Surprise Me
            </Button>
          )}
          {onToggleCollapse && (
            <button className="recommendations-collapse" onClick={onToggleCollapse}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <p className="recommendations-subtitle">{currentSection.subtitle}</p>

      <div className="recommendations-carousel">
        <button className="carousel-arrow left" onClick={scrollLeft}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        
        <div className="recommendations-scroll" ref={scrollContainerRef}>
          {currentSection.tasks.map(task => (
            <div 
              key={task.id} 
              className={`recommendation-card ${task.is_highlighted ? 'highlighted' : ''}`}
              onClick={() => onTaskSelect(task)}
            >
              <div className="recommendation-card-header">
                <Badge variant="category" size="sm">{task.category}</Badge>
                {task.is_highlighted && (
                  <Badge variant="priority" size="sm">Priority</Badge>
                )}
              </div>
              
              {task.subcategory && (
                <h4 className="recommendation-card-title">{task.subcategory}</h4>
              )}
              
              <p className="recommendation-card-desc">
                {task.description?.substring(0, 150)}
                {task.description?.length > 150 ? '...' : ''}
              </p>
              
              <div className="recommendation-card-footer">
                {task.difficulty && (
                  <Badge variant={task.difficulty.toLowerCase()} size="sm">
                    {task.difficulty}
                  </Badge>
                )}
                <span className="view-task">View →</span>
              </div>
            </div>
          ))}
        </div>
        
        <button className="carousel-arrow right" onClick={scrollRight}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TaskRecommendations;


