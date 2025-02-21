import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import '../styles/TransitionOverlay.css';

const TransitionOverlay = ({ progress }) => {
  const columns = [0, 1, 2, 3];
  const [columnWidths, setColumnWidths] = useState([25, 25, 25, 25]);

  useEffect(() => {
    const newWidths = columns.map((col, index) => {
      const threshold = index * 0.2;
      const effectiveProgress = Math.max(0, progress - threshold) / (1 - threshold);
      return 25 * (1 - Math.min(effectiveProgress, 1));
    });

    setColumnWidths(newWidths);
  }, [progress]);

  return (
    <div className="transition-overlay">
      {columns.map((col, index) => (
        <div
          key={index}
          className="transition-column"
          style={{ width: `${columnWidths[index]}%` }}
        />
      ))}
    </div>
  );
};

TransitionOverlay.propTypes = {
  progress: PropTypes.number.isRequired,
};

export default TransitionOverlay;
