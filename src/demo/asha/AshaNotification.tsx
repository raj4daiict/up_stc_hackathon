import React from 'react';

interface Props { message: string | null; }

export function AshaNotification({ message }: Props) {
  if (!message) return null;
  return (
    <div style={{
      background: '#fffbeb', border: '1px solid #f59e0b',
      borderRadius: 10, padding: '10px 14px', marginBottom: 12,
    }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#92400e' }}>{message}</p>
    </div>
  );
}
