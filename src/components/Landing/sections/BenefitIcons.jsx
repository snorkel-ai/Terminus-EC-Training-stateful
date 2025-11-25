import React from 'react';

export const IconImpact = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="benefit-icon-svg impact-icon">
    <path d="M34 4L12 34H32L30 60L52 30H32L34 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M34 4L12 34H32L30 60L52 30H32L34 4Z" fill="currentColor" className="impact-fill" opacity="0.2"/>
  </svg>
);

export const IconPay = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="benefit-icon-svg pay-icon">
    <path d="M32 4L58 22L32 60L6 22L32 4Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" className="pay-diamond"/>
    <path d="M6 22H58" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M19 22L32 60L45 22" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M32 4V22" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M19 22L32 4L45 22" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M32 4L58 22L32 60L6 22L32 4Z" fill="currentColor" className="pay-fill" opacity="0"/>
  </svg>
);

export const IconBrain = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="benefit-icon-svg brain-icon">
    <path d="M12 32C12 20.9543 20.9543 12 32 12C36.4655 12 40.5963 13.4644 44 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M52 32C52 43.0457 43.0457 52 32 52C27.5345 52 23.4037 50.5356 20 48" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="22" y="22" width="20" height="20" rx="4" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M32 22V42M22 32H42" stroke="currentColor" strokeWidth="2.5"/>
    <circle cx="32" cy="32" r="3" fill="currentColor" className="brain-pulse"/>
    <path d="M48 24L56 16M16 40L8 48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="brain-connect"/>
  </svg>
);

export const IconFlexible = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="benefit-icon-svg flex-icon">
    <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="2.5"/>
    <path d="M32 8V56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3"/>
    <path d="M8 32H56" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.3"/>
    <ellipse cx="32" cy="32" rx="12" ry="24" stroke="currentColor" strokeWidth="2.5" className="flex-orbit"/>
    <circle cx="32" cy="32" r="6" fill="currentColor" className="flex-core"/>
  </svg>
);

