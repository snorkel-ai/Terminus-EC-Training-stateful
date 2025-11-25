import { createContext, useContext } from 'react';
import './Tabs.css';

const TabsContext = createContext(null);

export function Tabs({ 
  value, 
  onChange, 
  className = '',
  children,
  ...props 
}) {
  return (
    <TabsContext.Provider value={{ value, onChange }}>
      <div className={`ui-tabs ${className}`} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export function Tab({ 
  value: tabValue, 
  className = '',
  children,
  ...props 
}) {
  const context = useContext(TabsContext);
  
  if (!context) {
    throw new Error('Tab must be used within a Tabs component');
  }
  
  const { value, onChange } = context;
  const isActive = value === tabValue;
  
  return (
    <button
      type="button"
      className={`ui-tab ${isActive ? 'active' : ''} ${className}`}
      onClick={() => onChange(tabValue)}
      role="tab"
      aria-selected={isActive}
      {...props}
    >
      {children}
    </button>
  );
}

export default Tabs;

