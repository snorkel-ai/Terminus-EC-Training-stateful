import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

export const Navbar = ({ className = '', children, ...props }) => {
  return (
    <nav className={`ui-navbar ${className}`} {...props}>
      {children}
    </nav>
  );
};

export const NavLink = ({ 
  to, 
  href, 
  children, 
  className = '', 
  active = false, 
  variant = 'default', // 'default' | 'button'
  as: Component,
  ...props 
}) => {
  const classes = [
    'ui-nav-link',
    active && 'active',
    variant === 'button' && 'variant-button',
    className
  ].filter(Boolean).join(' ');

  // If a custom component is passed (like a button for dropdown triggers)
  if (Component) {
    return (
      <Component className={classes} {...props}>
        {children}
      </Component>
    );
  }

  // External link or anchor
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  // React Router Link
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  // Fallback to button if no to/href
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};








