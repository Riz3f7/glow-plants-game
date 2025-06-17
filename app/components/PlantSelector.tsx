'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plant } from '../models/Plant';

interface PlantSelectorProps {
  availablePlants: Plant[];
  onSelectPlant: (plant: Plant) => void;
}

const PlantSelector: React.FC<PlantSelectorProps> = ({ availablePlants, onSelectPlant }) => {
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);

  const handleSelectPlant = () => {
    const plant = availablePlants.find(p => p.id === selectedPlantId);
    if (plant) {
      onSelectPlant(plant);
    }
  };

  // 植物ごとに異なる背景色を設定
  const plantColors = {
    'plant_1': { bg: '#fff8e1', border: '#ffecb3', accent: '#ffc107' }, // サニーフラワー: 黄色系
    'plant_2': { bg: '#e3f2fd', border: '#bbdefb', accent: '#2196f3' }, // モイストファーン: 青系
    'plant_3': { bg: '#e8f5e9', border: '#c8e6c9', accent: '#4caf50' }, // ニュートリブッシュ: 緑系
    'plant_4': { bg: '#f3e5f5', border: '#e1bee7', accent: '#9c27b0' }, // ムーンリリー: 紫系
    'plant_5': { bg: '#ffebee', border: '#ffcdd2', accent: '#f44336' }, // ファイアペタル: 赤系
  };

  return (
    <div style={{
      position: 'relative',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '2px solid #e8f5e9',
      overflow: 'hidden'
    }}>
      {/* 装飾要素 */}
      <div style={{
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        width: '80px',
        height: '80px',
        opacity: 0.1,
        transform: 'rotate(15deg)'
      }}>
        <Image
          src="/assets/images/output/plant_icon_1.png"
          alt="装飾"
          width={80}
          height={80}
        />
      </div>
      
      <h2 style={{
        fontSize: '20px',
        fontWeight: 'bold',
        color: '#2e7d32',
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '24px', marginRight: '8px' }}>🌱</span>
        植物を選択
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '15px',
        marginBottom: '20px'
      }}>
        {availablePlants.map(plant => {
          const colors = plantColors[plant.id as keyof typeof plantColors] || 
                        { bg: '#f5f5f5', border: '#e0e0e0', accent: '#9e9e9e' };
          
          return (
            <div
              key={plant.id}
              style={{
                padding: '15px',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: selectedPlantId === plant.id ? colors.bg : 'white',
                border: `2px solid ${selectedPlantId === plant.id ? colors.accent : colors.border}`,
                boxShadow: selectedPlantId === plant.id ? `0 4px 8px rgba(0, 0, 0, 0.1)` : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => setSelectedPlantId(plant.id)}
            >
              {/* 背景装飾 */}
              <div style={{
                position: 'absolute',
                top: '50%',
                right: '10px',
                transform: 'translateY(-50%)',
                width: '100px',
                height: '100px',
                opacity: 0.05,
                zIndex: 0
              }}>
                <Image
                  src={plant.imageUrl}
                  alt="背景装飾"
                  width={100}
                  height={100}
                />
              </div>
              
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
                  backgroundColor: colors.bg,
                  border: `2px solid ${colors.border}`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
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
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 'bold',
                    color: '#333',
                    margin: '0 0 5px 0'
                  }}>{plant.name}</h3>
                  <p style={{
                    fontSize: '12px',
                    color: '#666',
                    fontStyle: 'italic',
                    margin: 0
                  }}>{plant.species}</p>
                </div>
              </div>
              
              <p style={{
                fontSize: '14px',
                color: '#555',
                margin: '12px 0',
                position: 'relative',
                zIndex: 1
              }}>{plant.description}</p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px',
                marginTop: '10px',
                position: 'relative',
                zIndex: 1
              }}>
                <div style={{
                  backgroundColor: '#e3f2fd',
                  padding: '8px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '1px solid #bbdefb'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#1976d2',
                    margin: '0 0 2px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ marginRight: '4px' }}>💧</span>
                    水
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#0d47a1',
                    margin: 0
                  }}>{plant.requirements.waterNeed}/10</p>
                </div>
                <div style={{
                  backgroundColor: '#fff8e1',
                  padding: '8px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '1px solid #ffecb3'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#f57f17',
                    margin: '0 0 2px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ marginRight: '4px' }}>☀️</span>
                    日光
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#e65100',
                    margin: 0
                  }}>{plant.requirements.sunlightNeed}/10</p>
                </div>
                <div style={{
                  backgroundColor: '#e8f5e9',
                  padding: '8px',
                  borderRadius: '8px',
                  textAlign: 'center',
                  border: '1px solid #c8e6c9'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#388e3c',
                    margin: '0 0 2px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ marginRight: '4px' }}>🌿</span>
                    栄養
                  </p>
                  <p style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#2e7d32',
                    margin: 0
                  }}>{plant.requirements.nutrientNeed}/10</p>
                </div>
              </div>
              
              {selectedPlantId === plant.id && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: colors.accent,
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      <button
        onClick={handleSelectPlant}
        disabled={!selectedPlantId}
        style={{
          backgroundColor: !selectedPlantId ? '#e0e0e0' : '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '12px',
          width: '100%',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: !selectedPlantId ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: !selectedPlantId ? 'none' : '0 4px 8px rgba(76, 175, 80, 0.3)',
          transition: 'all 0.3s ease',
          opacity: !selectedPlantId ? 0.7 : 1
        }}
      >
        <span style={{ marginRight: '8px', fontSize: '20px' }}>🌱</span>
        この植物を育てる
      </button>
    </div>
  );
};

export default PlantSelector;
