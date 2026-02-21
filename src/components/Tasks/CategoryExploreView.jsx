import { useMemo } from 'react';
import { Button, Badge } from '../ui';
import TaskCategorySection from './TaskCategorySection';
import './CategoryExploreView.css';

function CategoryExploreView({ 
  category, 
  tasks = [], 
  onTaskSelect, 
  onBack,
  searchQuery = ''
}) {
  const availableTasks = useMemo(() => tasks.filter(t => !t.is_selected), [tasks]);

  const groupedBySubtype = useMemo(() => {
    const groups = {};
    
    availableTasks.forEach(task => {
      const subtypes = task.subtypes?.length > 0 ? task.subtypes : ['General'];
      subtypes.forEach(subtype => {
        if (!groups[subtype]) {
          groups[subtype] = [];
        }
        groups[subtype].push(task);
      });
    });

    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [availableTasks]);

  return (
    <div className="category-explore-view">
      <div className="explore-header">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="back-btn"
        >
          <span className="back-btn-content">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>Back to all categories</span>
          </span>
        </Button>
        
        <div className="explore-title-section">
          <div className="explore-title-row">
            <h2 className="explore-title">{category}</h2>
          </div>
        </div>
      </div>

      <div className="tasks-grouped-layout">
        {groupedBySubtype.map(([subtype, subtypeTasks]) => (
          <TaskCategorySection
            key={subtype}
            title={subtype}
            tasks={subtypeTasks}
            onTaskSelect={onTaskSelect}
            onTaskUnselect={() => {}}
            onExplore={() => {}}
            searchQuery={searchQuery}
            showAll={true}
          />
        ))}
      </div>
    </div>
  );
}

export default CategoryExploreView;
