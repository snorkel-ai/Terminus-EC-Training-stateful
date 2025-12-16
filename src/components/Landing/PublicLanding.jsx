import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PublicHeader from './PublicHeader';
import Hero from './sections/Hero';
import WhatIsTerminalBench from './sections/WhatIsTerminalBench';
import HowItWorks from './sections/HowItWorks';
import Tasks from './sections/Tasks';
import Benefits from './sections/Benefits';
import Footer from './sections/Footer';
import './PublicLanding.css';

const PublicLanding = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for auth errors in URL hash (from Supabase redirects)
    if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const errorCode = hashParams.get('error_code');
      const accessToken = hashParams.get('access_token');
      const type = hashParams.get('type');

      // If there's an auth error or token, redirect to auth callback handler
      if (errorCode || accessToken || type === 'recovery') {
        navigate(`/auth/callback${location.hash}`, { replace: true });
      }
    }
  }, [location, navigate]);

  return (
    <div className="public-landing">
      <PublicHeader />
      <Hero />
      <WhatIsTerminalBench />
      <HowItWorks />
      <Tasks />
      <Benefits />
      <Footer />
    </div>
  );
};

export default PublicLanding;

