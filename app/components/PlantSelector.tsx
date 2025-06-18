'use client';

import React from 'react';
import Image from 'next/image';
import { Plant } from '../models/Plant';

interface PlantSelectorProps {
  availablePlants: Plant[];
  onSelectPlant: (plant: Plant) => void;
}

const PlantSelector: React.FC<PlantSelectorProps> = ({ availablePlants, onSelectPlant }) => {
  // 難易度に基づく色を取得
  const getDifficultyColor = (plant: any) => {
    if (!plant.difficulty) return '#4caf50'; // デフォルト色
    
    switch (plant.difficulty) {
      case 'easy':
        return '#4caf50'; // 緑色
      case 'medium':
        return '#2196f3'; // 青色
      case 'hard':
        return '#ff9800'; // オレンジ色
      case 'expert':
        return '#f44336'; // 赤色
      default:
        return '#4caf50';
    }
  };
  
  // 難易度のラベルを取得
  const getDifficultyLabel = (plant: any) => {
    if (!plant.difficulty) return '';
    
    switch (plant.difficulty) {
      case 'easy':
        return '初級';
      case 'medium':
        return '中級';
      case 'hard':
        return '上級';
      case 'expert':
        return '超上級';
      default:
        return '';
    }
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
      {availablePlants.map(plant => (
        <div
          key={plant.id}
          style={{
            padding: '15px',
            borderRadius: '10px',
            backgroundColor: 'white',
            border: '2px solid #e8f5e9',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onClick={() => onSelectPlant(plant)}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              marginRight: '15px',
              borderRadius: '50%',
              backgroundColor: '#f1f8e9',
              border: '2px solid #c5e1a5',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '5px'
            }}>
              <Image
                src={plant.imageUrl}
                alt={plant.name}
                width={50}
                height={50}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                <h3 style={{
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#333',
                  margin: '0 8px 0 0'
                }}>{plant.name}</h3>
                
                {/* 難易度バッジ */}
                {'difficulty' in plant && (
                  <span style={{
                    fontSize: '12px',
                    backgroundColor: getDifficultyColor(plant),
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: 'bold'
                  }}>
                    {getDifficultyLabel(plant)}
                  </span>
                )}
              </div>
              <p style={{
                fontSize: '12px',
                color: '#666',
                fontStyle: 'italic',
                margin: '0 0 5px 0'
              }}>{plant.species}</p>
              <p style={{
                fontSize: '13px',
                color: '#666',
                margin: 0,
                maxWidth: '250px'
              }}>{plant.description}</p>
            </div>
          </div>
          
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            zIndex: 1
          }}>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '10px'
            }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '16px' }}>💧</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{plant.requirements.waterNeed}</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '16px' }}>☀️</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{plant.requirements.sunlightNeed}</span>
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '16px' }}>🌿</span>
                <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{plant.requirements.nutrientNeed}</span>
              </div>
            </div>
            <button
              style={{
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 15px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              選択
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlantSelector;
