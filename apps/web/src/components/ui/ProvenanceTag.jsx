import React from 'react';
import Badge from './Badge';

export const ProvenanceTag = ({ source = 'SIMULATION' }) => {
  let variant = 'source';
  let label = source;

  if (source === 'DEVICE' || source === 'MEASURED') {
    variant = 'live';
    label = 'MEASURED';
  } else if (source === 'ESTIMATED') {
    variant = 'twin';
    label = 'ESTIMATED';
  } else if (source === 'SIMULATION' || source === 'MOCK') {
    variant = 'source';
    label = 'SIMULATION';
  } else if (source === 'PREDICTED') {
    variant = 'stale';
    label = 'PREDICTED';
  }

  return (
    <Badge variant={variant} style={{ fontSize: '0.6875rem' }}>
      {label}
    </Badge>
  );
};

export default ProvenanceTag;
