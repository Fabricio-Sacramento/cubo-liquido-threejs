// src/components/AboutUsWrapper.jsx
import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import AboutUs from './AboutUs';
import useSectionVisibility from '../hooks/useSectionVisibility';

const AboutUsWrapper = ({ onVisibilityChange }) => {
  const aboutRef = useRef(null);
  const isFullyVisible = useSectionVisibility(aboutRef, { threshold: 1 });

  useEffect(() => {
    onVisibilityChange(isFullyVisible);
  }, [isFullyVisible, onVisibilityChange]);

  return (
    <section id="about-us" ref={aboutRef}>
      <AboutUs />
    </section>
  );
};

AboutUsWrapper.propTypes = {
  onVisibilityChange: PropTypes.func.isRequired,
};

export default AboutUsWrapper;
