'use client';

import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        maxWidth: '90%',
        width: '400px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: 'bold',
          marginBottom: '15px',
          color: '#d32f2f',
          display: 'flex',
          alignItems: 'center',
        }}>
          <span style={{ marginRight: '8px' }}>⚠️</span>
          {title}
        </h3>
        
        <p style={{
          marginBottom: '20px',
          fontSize: '16px',
          lineHeight: '1.5',
        }}>
          {message}
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '10px',
        }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              backgroundColor: '#e0e0e0',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#424242',
            }}
          >
            キャンセル
          </button>
          
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 16px',
              backgroundColor: '#d32f2f',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            育成をやめる
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
