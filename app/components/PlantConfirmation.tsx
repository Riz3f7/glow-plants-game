'use client';

import React from 'react';
import Image from 'next/image';
import { Plant } from '../models/Plant';

interface PlantConfirmationProps {
  plant: Plant | null;
  onConfirm: () => void;
  onCancel: () => void;
}

const PlantConfirmation: React.FC<PlantConfirmationProps> = ({ plant, onConfirm, onCancel }) => {
  if (!plant) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '20px',
        maxWidth: '400px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        border: '3px solid #4caf50',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <h2 style={{
          fontSize: '20px',
          color: '#2e7d32',
          marginBottom: '15px',
          fontWeight: 'bold'
        }}>この植物を選びますか？</h2>
        
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f1f8e9',
          borderRadius: '10px',
          border: '1px solid #c5e1a5'
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            marginRight: '15px',
            borderRadius: '50%',
            backgroundColor: '#e8f5e9',
            border: '2px solid #c5e1a5',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <Image
              src={plant.imageUrl}
              alt={plant.name}
              width={60}
              height={60}
              style={{ objectFit: 'contain' }}
            />
          </div>
          
          <div style={{ textAlign: 'left' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2e7d32',
              margin: '0 0 5px 0'
            }}>{plant.name}</h3>
            <p style={{
              fontSize: '12px',
              color: '#666',
              fontStyle: 'italic',
              margin: '0 0 5px 0'
            }}>{plant.species}</p>
            <p style={{
              fontSize: '13px',
              color: '#555',
              margin: '0'
            }}>{plant.description}</p>
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px'
        }}>
          <button
            onClick={onCancel}
            style={{
              backgroundColor: '#e0e0e0',
              color: '#333',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 0',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            キャンセル
          </button>
          <button
            onClick={onConfirm}
            style={{
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 0',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            選択する
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlantConfirmation;
