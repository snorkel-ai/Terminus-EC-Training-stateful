import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePostHog } from 'posthog-js/react';
import { useTasks } from '../hooks/useTasks';
import { Button, TaskWorkflowModal, LoadingState, TaskCard } from './ui';
import { FiRefreshCw } from 'react-icons/fi';
import './RecommendedTasksSection.css';

const REEL_COUNT = 3;
// Keep these in sync with CSS variables in `RecommendedTasksSection.css`
// TaskCard has `min-height: 280px` by default; match it to avoid layout jumps.
const REEL_CARD_HEIGHT = 280;
const REEL_GAP = 16;
const REEL_PEEK = 46;
const REEL_STEP = REEL_CARD_HEIGHT + REEL_GAP;

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickUnique(pool, count, excludeIds = new Set()) {
  const shuffled = shuffleArray(pool).filter(t => t && !excludeIds.has(t.id));
  return shuffled.slice(0, count);
}

function defaultReelItems(pool, centerTask) {
  const exclude = new Set(centerTask?.id ? [centerTask.id] : []);
  const [prev, next] = pickUnique(pool, 2, exclude);
  if (!centerTask) return [];
  return [prev || centerTask, centerTask, next || centerTask];
}

function buildSpinReelItems({ pool, currentTask, winnerTask, minLength }) {
  const items = [];
  const excludeIds = new Set();
  if (currentTask?.id) excludeIds.add(currentTask.id);
  if (winnerTask?.id) excludeIds.add(winnerTask.id);

  // Ensure we have: [prev, current, ..., winner, after]
  const [prev] = pickUnique(pool, 1, excludeIds);
  items.push(prev || currentTask);
  items.push(currentTask);

  // Fill the strip
  while (items.length < Math.max(minLength - 2, 3)) {
    const [t] = pickUnique(pool, 1, new Set([...excludeIds, ...items.map(x => x?.id).filter(Boolean)]));
    items.push(t || currentTask);
  }

  items.push(winnerTask);

  const [after] = pickUnique(pool, 1, new Set([...excludeIds, ...items.map(x => x?.id).filter(Boolean)]));
  items.push(after || winnerTask);

  const winnerIndex = items.length - 2;
  return { items, startIndex: 1, winnerIndex };
}

function getReelOffsetPx(index) {
  return REEL_PEEK - index * REEL_STEP;
}

function renderReelStub(task) {
  if (!task) return null;
  const title = task.subcategory || task.subsubcategory || task.category || 'Task';
  return (
    <div className="reel-stub">
      <div className="reel-stub-title" title={title}>{title}</div>
      <div className="reel-stub-desc" title={task.description}>{task.description}</div>
    </div>
  );
}

const RecommendedTasksSection = () => {
  const navigate = useNavigate();
  const posthog = usePostHog();
  const { tasks, loading, refetch } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  
  // Center tasks (used for analytics + initial render)
  const [visibleTasks, setVisibleTasks] = useState([]);

  // Reel state: each reel has a strip of items and a "current index" aligned to the payline
  const [reels, setReels] = useState(() => Array.from({ length: REEL_COUNT }, () => ({
    items: [],
    index: 1,
    locked: true,
    justLocked: false,
  })));

  const [isShuffling, setIsShuffling] = useState(false);
  
  const reelStripRefs = useRef([]);
  const animationsRef = useRef([]);
  const timeoutsRef = useRef([]);
  const spinTokenRef = useRef(0);

  // Filter for available tasks
  const availableTasks = useMemo(() => {
    if (!tasks || tasks.length === 0) return [];
    return tasks.filter(t => !t.is_selected);
  }, [tasks]);

  // Initial population of tasks
  useEffect(() => {
    if (availableTasks.length === 0) return;

    // In some load orders the component can render before we’ve populated reel items.
    // Ensure reels are always initialized once tasks are available.
    const reelsHaveItems = reels.some(r => (r.items?.length || 0) > 0);
    if (reelsHaveItems) return;

    const initial =
      visibleTasks.length === REEL_COUNT
        ? visibleTasks
        : pickUnique(availableTasks, REEL_COUNT);

    if (visibleTasks.length !== REEL_COUNT) {
      setVisibleTasks(initial);
    }

    setReels(prev => prev.map((r, i) => {
      const center = initial[i];
      return {
        ...r,
        items: defaultReelItems(availableTasks, center),
        index: 1,
        locked: true,
        justLocked: false,
      };
    }));
  }, [availableTasks, reels, visibleTasks]);

  // Track when recommended tasks are viewed
  useEffect(() => {
    if (posthog && visibleTasks.length > 0 && !isShuffling) {
      posthog.capture('recommended_tasks_viewed', {
        available_count: availableTasks.length,
        task_ids: visibleTasks.map(t => t.id)
      });
    }
  }, [posthog, isShuffling, visibleTasks.length]); // Only track when settled

  const clearPending = () => {
    for (const t of timeoutsRef.current) clearTimeout(t);
    timeoutsRef.current = [];
    for (const a of animationsRef.current) a?.cancel?.();
    animationsRef.current = [];
  };

  const handleReshuffle = () => {
    if (isShuffling || availableTasks.length < 3) return;
    
    clearPending();
    spinTokenRef.current += 1;
    const spinToken = spinTokenRef.current;

    const reduceMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    setIsShuffling(true);
    setReels(prev => prev.map(r => ({ ...r, locked: false, justLocked: false })));
    
    if (posthog) {
      posthog.capture('recommended_tasks_reshuffled');
    }

    const currentCenters = reels.map((r, i) => r.items?.[r.index] || visibleTasks[i]).filter(Boolean);
    const currentIds = new Set(currentCenters.map(t => t?.id).filter(Boolean));
    const winners = pickUnique(availableTasks, REEL_COUNT, currentIds);

    if (reduceMotion) {
      setReels(prev => prev.map((r, i) => ({
        ...r,
        items: defaultReelItems(availableTasks, winners[i]),
        index: 1,
        locked: true,
        justLocked: false,
      })));
      setVisibleTasks(winners);
      // Keep a small "win" glow even with reduced motion
      timeoutsRef.current.push(setTimeout(() => {
        setReels(prev => prev.map((r, i) => ({ ...r, justLocked: true })));
      }, 0));
      timeoutsRef.current.push(setTimeout(() => {
        setReels(prev => prev.map(r => ({ ...r, justLocked: false })));
        setIsShuffling(false);
      }, 450));
      return;
    }

    const spinPlans = winners.map((winnerTask, i) => {
      const currentTask = currentCenters[i] || winnerTask;
      return buildSpinReelItems({
        pool: availableTasks,
        currentTask,
        winnerTask,
        minLength: 18 + i * 6,
      });
    });

    // Put the reels in "spin list" state first, so the DOM contains the strip.
    setReels(prev => prev.map((r, i) => ({
      ...r,
      items: spinPlans[i].items,
      index: spinPlans[i].startIndex,
      locked: false,
      justLocked: false,
    })));

    // Kick the animations next frame once the new strips are mounted.
    timeoutsRef.current.push(setTimeout(() => {
      if (spinTokenRef.current !== spinToken) return;

      let finishedCount = 0;

      const triggerJustLocked = (reelIndex) => {
        setReels(prev => prev.map((r, i) => i === reelIndex ? ({ ...r, justLocked: true }) : r));
        timeoutsRef.current.push(setTimeout(() => {
          setReels(prev => prev.map((r, i) => i === reelIndex ? ({ ...r, justLocked: false }) : r));
        }, 650));
      };

      spinPlans.forEach((plan, i) => {
        const el = reelStripRefs.current[i];
        if (!el) return;

        const fromY = getReelOffsetPx(plan.startIndex);
        const toY = getReelOffsetPx(plan.winnerIndex);
        const mid1Y = fromY + (toY - fromY) * 0.35;
        const mid2Y = fromY + (toY - fromY) * 0.88;

        // Ensure we start from the "current" aligned position.
        el.style.transform = `translate3d(0, ${fromY}px, 0)`;
        el.style.opacity = '1';

        const duration = 1150 + i * 420 + Math.floor(Math.random() * 120);

        // Web Animations API: more natural acceleration → cruise → decel → snap.
        const animation = el.animate(
          [
            // Avoid `filter: blur(...)` here: blur gets clipped by the viewport and makes
            // the cards look narrower mid-spin. Use a subtle opacity shift instead.
            { offset: 0, transform: `translate3d(0, ${fromY}px, 0)`, opacity: 1, easing: 'cubic-bezier(0.2, 0, 0.2, 1)' },
            { offset: 0.16, transform: `translate3d(0, ${mid1Y}px, 0)`, opacity: 0.96, easing: 'linear' },
            { offset: 0.86, transform: `translate3d(0, ${mid2Y}px, 0)`, opacity: 0.96, easing: 'cubic-bezier(0, 0, 0.15, 1)' },
            { offset: 1, transform: `translate3d(0, ${toY}px, 0)`, opacity: 1 },
          ],
          { duration, fill: 'forwards' }
        );

        animationsRef.current[i] = animation;

        animation.finished
          .then(() => {
            if (spinTokenRef.current !== spinToken) return;

            // IMPORTANT: release WAAPI control of transform before we swap the strip contents.
            // Otherwise `fill: forwards` keeps the strip translated far off-screen.
            try {
              animation.cancel();
            } catch {
              // ignore
            }
            animationsRef.current[i] = null;
            el.style.opacity = '1';
            el.style.transform = `translate3d(0, ${getReelOffsetPx(1)}px, 0)`;

            // Collapse back to a simple 3-item reel so the "winner" is unambiguous
            // and we don't keep a long strip in the DOM.
            const winnerTask = winners[i];
            setReels(prev => prev.map((r, idx) => {
              if (idx !== i) return r;
              return {
                ...r,
                items: defaultReelItems(availableTasks, winnerTask),
                index: 1,
                locked: true,
              };
            }));
            triggerJustLocked(i);

            finishedCount += 1;
            if (finishedCount === REEL_COUNT) {
              setVisibleTasks(winners);
              setIsShuffling(false);
            }
          })
          .catch(() => {
            // cancelled
          });
      });
    }, 0));
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => clearPending();
  }, []);

  const handleBrowseTasksClick = () => {
    if (posthog) {
      posthog.capture('browse_tasks_clicked', {
        source: 'recommended_section'
      });
    }
    navigate('/portal/tasks');
  };

  const handleTaskClick = (task) => {
    if (isShuffling) return; // Prevent clicks while shuffling
    
    if (posthog) {
      posthog.capture('recommended_task_clicked', {
        task_id: task.id,
        category: task.category,
        subcategory: task.subcategory
      });
    }
    setSelectedTask(task);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    refetch(); // Update lists if task was claimed
  };

  if (loading && visibleTasks.length === 0) {
    return <LoadingState message="Finding tasks for you..." />;
  }

  if (visibleTasks.length === 0) {
    return null;
  }

  return (
    <section className="recommended-tasks-section">
      <div className="recommended-header">
        <h3 className="recommended-title">Some tasks to get you started</h3>
      </div>

      {/* Slot Machine Container */}
      <div className="slot-machine-container">
        <div className={`slot-machine-viewport ${isShuffling ? 'spinning' : ''}`}>
          {/* Fade overlays for depth effect */}
          <div className="slot-machine-fade-top" />
          <div className="slot-machine-fade-bottom" />
          
          {/* Glow effect during spin */}
          <div className={`slot-glow ${isShuffling ? 'active' : ''}`} />
          
          <div className="recommended-grid">
            {reels.map((reel, index) => {
              const centerTask = reel.items?.[reel.index];
              const reelClasses = [
                'recommended-reel',
                isShuffling && !reel.locked ? 'spinning' : '',
                reel.locked ? 'locked' : '',
                reel.justLocked ? 'just-locked' : '',
              ].filter(Boolean).join(' ');

              return (
                <div key={`reel-${index}`} className={reelClasses}>
                  <div className="reel-viewport" aria-hidden={isShuffling ? 'true' : undefined}>
                    <div className="reel-payline" />
                    <div
                      className="reel-strip"
                      ref={(el) => { reelStripRefs.current[index] = el; }}
                      style={{ transform: `translate3d(0, ${getReelOffsetPx(reel.index)}px, 0)` }}
                    >
                      {reel.items.map((task, itemIdx) => {
                        const key = `${index}-${task?.id || 'empty'}-${itemIdx}`;
                        const isCenter = itemIdx === reel.index;
                        const clickable = !isShuffling && isCenter && !!task;
                        const showFullCard = !!task && isCenter && reel.locked && !isShuffling;
                        return (
                          <div
                            key={key}
                            className={`reel-item ${isCenter ? 'center' : 'peek'}`}
                          >
                            {task ? (
                              showFullCard ? (
                                <TaskCard
                                  task={task}
                                  onClick={clickable ? () => handleTaskClick(task) : undefined}
                                  className="recommended-card"
                                />
                              ) : renderReelStub(task)
                            ) : (
                              <div className="recommended-card-placeholder" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="recommended-actions">
        <Button 
          variant="ghost" 
          onClick={handleReshuffle}
          className="reshuffle-btn"
          disabled={isShuffling}
        >
          <FiRefreshCw className={`btn-icon ${isShuffling ? 'spinning' : ''}`} />
          Show me different tasks
        </Button>
        
        <Button 
          variant="primary" 
          onClick={handleBrowseTasksClick}
        >
          Browse all tasks →
        </Button>
      </div>

      {/* Task Detail Modal */}
      <TaskWorkflowModal
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={handleCloseModal}
        onTaskUpdate={() => {
          refetch();
          handleReshuffle();
        }}
      />
    </section>
  );
};

export default RecommendedTasksSection;
