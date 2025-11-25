import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Button } from '../ui';
import './TaskPriorities.css';

function TaskPriorities() {
  const [categories, setCategories] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [priorityTag, setPriorityTag] = useState('$');
  const [tagLabel, setTagLabel] = useState('Higher Pay');
  const [displayOrder, setDisplayOrder] = useState(0);

  useEffect(() => {
    fetchCategoriesAndPriorities();
  }, []);

  const fetchCategoriesAndPriorities = async () => {
    try {
      setLoading(true);

      // Fetch unique categories/subcategories
      const { data: taskData, error: taskError } = await supabase
        .from('task_inspiration')
        .select('category, subcategory')
        .order('category')
        .order('subcategory');

      if (taskError) throw taskError;

      // Group by category
      const categoryMap = new Map();
      taskData.forEach(({ category, subcategory }) => {
        if (!categoryMap.has(category)) {
          categoryMap.set(category, new Set());
        }
        if (subcategory) {
          categoryMap.get(category).add(subcategory);
        }
      });

      const formattedCategories = Array.from(categoryMap.entries()).map(([cat, subs]) => ({
        category: cat,
        subcategories: Array.from(subs).sort()
      }));

      setCategories(formattedCategories);

      // Fetch existing priorities
      const { data: priorityData, error: priorityError } = await supabase
        .from('task_priorities')
        .select('*')
        .order('display_order')
        .order('category');

      if (priorityError) throw priorityError;

      setPriorities(priorityData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPriority = async (e) => {
    e.preventDefault();
    if (!selectedCategory) return;

    try {
      setSaving(true);

      const { error } = await supabase
        .from('task_priorities')
        .insert({
          category: selectedCategory,
          subcategory: selectedSubcategory || null,
          is_highlighted: true,
          priority_tag: priorityTag || null,
          tag_label: tagLabel || null,
          display_order: displayOrder
        });

      if (error) {
        if (error.code === '23505') {
          alert('This category/subcategory combination already has a priority setting.');
          return;
        }
        throw error;
      }

      // Reset form
      setSelectedCategory('');
      setSelectedSubcategory('');
      setPriorityTag('$');
      setTagLabel('Higher Pay');
      setDisplayOrder(0);

      // Refresh list
      await fetchCategoriesAndPriorities();
    } catch (error) {
      console.error('Error adding priority:', error);
      alert('Failed to add priority: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeletePriority = async (id) => {
    if (!confirm('Remove this priority setting?')) return;

    try {
      const { error } = await supabase
        .from('task_priorities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchCategoriesAndPriorities();
    } catch (error) {
      console.error('Error deleting priority:', error);
      alert('Failed to delete priority: ' + error.message);
    }
  };

  const subcategoriesForSelected = categories.find(c => c.category === selectedCategory)?.subcategories || [];

  if (loading) {
    return <div className="task-priorities-loading">Loading...</div>;
  }

  return (
    <div className="task-priorities">
      <div className="priorities-header">
        <h2>Task Priorities & Highlighting</h2>
        <p>Highlight task categories to make them more visible to ECs. Add tags like $ to indicate higher pay opportunities.</p>
      </div>

      <div className="priorities-content">
        <div className="add-priority-section">
          <h3>Add New Priority</h3>
          <form onSubmit={handleAddPriority} className="priority-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory('');
                  }}
                  required
                >
                  <option value="">Select category...</option>
                  {categories.map(({ category }) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="subcategory">Subcategory (optional)</label>
                <select
                  id="subcategory"
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={!selectedCategory}
                >
                  <option value="">All subcategories</option>
                  {subcategoriesForSelected.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priorityTag">Tag (shown in corner)</label>
                <select
                  id="priorityTag"
                  value={priorityTag}
                  onChange={(e) => setPriorityTag(e.target.value)}
                >
                  <option value="">No tag</option>
                  <option value="$">$ (Standard)</option>
                  <option value="$$">$$ (Higher)</option>
                  <option value="$$$">$$$ (Highest)</option>
                  <option value="💎">💎 (Diamond)</option>
                  <option value="🔥">🔥 (Hot)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="tagLabel">Tag Label (hover text)</label>
                <input
                  type="text"
                  id="tagLabel"
                  value={tagLabel}
                  onChange={(e) => setTagLabel(e.target.value)}
                  placeholder="e.g., Higher Pay, Urgent"
                />
              </div>

              <div className="form-group">
                <label htmlFor="displayOrder">Display Order</label>
                <input
                  type="number"
                  id="displayOrder"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                  min="0"
                  placeholder="0 = highest"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" loading={saving} disabled={!selectedCategory}>
              Add Priority
            </Button>
          </form>
        </div>

        <div className="priorities-list-section">
          <h3>Current Priorities ({priorities.length})</h3>
          
          {priorities.length === 0 ? (
            <div className="empty-state">
              <p>No task priorities configured yet.</p>
            </div>
          ) : (
            <div className="priorities-table">
              <table>
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Tag</th>
                    <th>Label</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {priorities.map(priority => (
                    <tr key={priority.id}>
                      <td>{priority.display_order}</td>
                      <td className="category-cell">{priority.category}</td>
                      <td>{priority.subcategory || <em>All</em>}</td>
                      <td className="tag-cell">
                        {priority.priority_tag && (
                          <span className="preview-tag" title={priority.tag_label}>
                            {priority.priority_tag}
                          </span>
                        )}
                      </td>
                      <td>{priority.tag_label}</td>
                      <td>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeletePriority(priority.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TaskPriorities;

