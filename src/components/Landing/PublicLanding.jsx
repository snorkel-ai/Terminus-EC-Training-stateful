import React from 'react';
import PublicHeader from './PublicHeader';
import Hero from './sections/Hero';
import WhatIsTerminalBench from './sections/WhatIsTerminalBench';
import HowItWorks from './sections/HowItWorks';
import Tasks from './sections/Tasks';
import Benefits from './sections/Benefits';
import Footer from './sections/Footer';
import './PublicLanding.css';

const PublicLanding = () => {
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

