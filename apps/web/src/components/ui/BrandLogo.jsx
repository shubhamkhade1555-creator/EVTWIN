import React from 'react';
import { Link } from 'react-router-dom';

const BrandLogo = ({
  size = 'md', // 'sm', 'md', 'lg'
  linkTo = null, // if set, wraps in Link
  className = '',
}) => {
  const heights = { sm: 32, md: 42, lg: 56 };
  const h = heights[size] || 42;

  const imgEl = (
    <div
      className={`brand-logo-container ${className}`}
      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, userSelect: 'none', textDecoration: 'none' }}
    >
      <img
        src="/evtwin_logo.jpg"
        alt="EVTWIN Platform"
        width={h * 3}
        height={h}
        style={{
          height: h,
          width: 'auto',
          borderRadius: 'var(--r-xs)',
          objectFit: 'contain',
          display: 'block',
          boxShadow: '0 0 18px rgba(0, 210, 255, 0.22)',
        }}
        onError={e => { e.target.style.display = 'none'; }}
      />
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} style={{ textDecoration: 'none', display: 'inline-flex' }}>
        {imgEl}
      </Link>
    );
  }

  return imgEl;
};

export default BrandLogo;
