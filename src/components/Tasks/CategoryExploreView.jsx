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
  // Group tasks by subcategory
  const groupedBySubcategory = useMemo(() => {
    const groups = {};
    
    tasks.forEach(task => {
      const subcategory = task.subcategory || 'General';
      if (!groups[subcategory]) {
        groups[subcategory] = [];
      }
      groups[subcategory].push(task);
    });

    // Sort by number of tasks (most first)
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length);
  }, [tasks]);

  const isPrioritized = tasks.some(t => t.is_special || t.priority_tag);

  return (
    <div className="category-explore-view">
      {/* Header with back button */}
      <div className="explore-header">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onBack}
          className="back-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to all categories
        </Button>
        
        <div className="explore-title-section">
          <div className="explore-title-row">
            <h2 className="explore-title">{category}</h2>
            {isPrioritized && (
              <Badge variant="accent" size="sm" className="double-pay-badge">
                💰💰 Double Pay
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Subcategory sections - reusing TaskCategorySection pattern */}
      <div className="tasks-grouped-layout">
        {groupedBySubcategory.map(([subcategory, subcatTasks]) => (
          <TaskCategorySection
            key={subcategory}
            title={subcategory}
            tasks={subcatTasks}
            onTaskSelect={onTaskSelect}
            onTaskUnselect={() => {}}
            onExplore={() => {}} // No further drill-down
            searchQuery={searchQuery}
            showAll={true} // Always show grid view in explore mode
          />
        ))}
      </div>
    </div>
  );
}

export default CategoryExploreView;
