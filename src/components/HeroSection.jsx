// src/components/HeroSection.jsx
import PropTypes from 'prop-types';
import WorldCanvas from './WorldCanvas';
import '../styles/style.css';
import '../styles/HeroSection.module.css';

const HeroSection = ({ canvasActive }) => {
  return (
    <section className="hero-container">
      <div className="text-column">
        <h2 className="heading-small">DESIGNING</h2>
        <h2 className="heading-large">BRANDS</h2>
        <h2 className="heading-large">PRODUCTS</h2>
        <h2 className="heading-large">EXPERIENCES</h2>
      </div>
      {canvasActive && (
        <WorldCanvas />
      )}
    </section>
  );
};

HeroSection.propTypes = {
  canvasActive: PropTypes.bool.isRequired,
};

export default HeroSection;
