import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8125rem', color: 'var(--text-muted)', marginBottom: 20 }}>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight size={14} color="var(--text-muted)" />}
            {isLast || !item.to ? (
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{item.label}</span>
            ) : (
              <Link to={item.to} style={{ color: 'var(--text-secondary)', transition: 'color 0.2s' }} className="hover-link">
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
