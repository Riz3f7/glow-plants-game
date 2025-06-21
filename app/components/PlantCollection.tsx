'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Plant } from '../models/Plant';

interface PlantCollectionProps {
  discoveredPlants: Plant[];
  totalPlants: number;
}

const PlantCollection: React.FC<PlantCollectionProps> = ({ discoveredPlants, totalPlants }) => {
  const [selectedPlant, setSelectedPlant] = useState<Plant | null>(null);

  const completionPercentage = Math.floor((discoveredPlants.length / totalPlants) * 100);

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
      overflow: 'hidden',
      maxHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* 装飾要素 */}
      <div style={{
        position: 'absolute',
        bottom: '-20px',
        left: '-20px',
        width: '100px',
        height: '100px',
        opacity: 0.05,
        transform: 'rotate(-15deg)'
      }}>
        <Image
          src="/assets/images/output/plant_icon_1.png"
          alt="装飾"
          width={100}
          height={100}
        />
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        position: 'relative',
        zIndex: 1
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#2e7d32',
          margin: 0,
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '24px', marginRight: '8px' }}>📚</span>
          植物図鑑
        </h2>
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '8px 12px',
          borderRadius: '20px',
          border: '1px solid #c8e6c9',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '16px', color: '#4caf50', marginRight: '6px' }}>✅</span>
          <p style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#2e7d32',
            margin: 0
          }}>コンプリート: {completionPercentage}%</p>
        </div>
      </div>

      {discoveredPlants.length === 0 ? (
        <div style={{
          padding: '30px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '10px',
          color: '#757575',
          fontSize: '16px'
        }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>🔍</span>
          まだ植物が発見されていません
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          marginBottom: '20px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 300px)',
          paddingRight: '5px'
        }}>
          {discoveredPlants.map(plant => {
            const colors = plantColors[plant.id as keyof typeof plantColors] || 
                          { bg: '#f5f5f5', border: '#e0e0e0', accent: '#9e9e9e' };
            
            return (
              <div
                key={plant.id}
                style={{
                  padding: '10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedPlant?.id === plant.id ? colors.bg : 'white',
                  border: `2px solid ${selectedPlant?.id === plant.id ? colors.accent : colors.border}`,
                  boxShadow: selectedPlant?.id === plant.id ? `0 4px 8px rgba(0, 0, 0, 0.1)` : 'none'
                }}
                onClick={() => setSelectedPlant(plant)}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    marginBottom: '8px',
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
                      width={40}
                      height={40}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h3 style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: '#333',
                    margin: 0,
                    textAlign: 'center'
                  }}>{plant.name}</h3>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedPlant && (
        <div style={{
          borderTop: '1px dashed #ccc',
          paddingTop: '20px',
          position: 'relative',
          zIndex: 1
        }}>
          {/* 選択された植物の詳細情報 */}
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              marginRight: '15px',
              borderRadius: '10px',
              backgroundColor: plantColors[selectedPlant.id as keyof typeof plantColors]?.bg || '#f5f5f5',
              border: `2px solid ${plantColors[selectedPlant.id as keyof typeof plantColors]?.border || '#e0e0e0'}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '5px',
              overflow: 'hidden'
            }}>
              <Image
                src={selectedPlant.imageUrl}
                alt={selectedPlant.name}
                width={70}
                height={70}
                style={{ objectFit: 'contain' }}
              />
            </div>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#333',
                margin: '0 0 5px 0'
              }}>{selectedPlant.name}</h3>
              <p style={{
                fontSize: '13px',
                color: '#666',
                fontStyle: 'italic',
                margin: '0 0 10px 0'
              }}>{selectedPlant.species}</p>
              <p style={{
                fontSize: '14px',
                color: '#555',
                margin: 0
              }}>{selectedPlant.description}</p>
            </div>
          </div>

          {/* 植物の要件情報 */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '10px',
            backgroundColor: '#f9f9f9',
            padding: '15px',
            borderRadius: '10px',
            border: '1px solid #eee'
          }}>
            <div style={{
              backgroundColor: '#e3f2fd',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #bbdefb'
            }}>
              <p style={{
                fontSize: '12px',
                color: '#1976d2',
                margin: '0 0 5px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ marginRight: '4px' }}>💧</span>
                水分ニーズ
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#0d47a1',
                margin: 0
              }}>{selectedPlant.requirements.waterNeed}/10</p>
            </div>
            <div style={{
              backgroundColor: '#fff8e1',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #ffecb3'
            }}>
              <p style={{
                fontSize: '12px',
                color: '#f57f17',
                margin: '0 0 5px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ marginRight: '4px' }}>☀️</span>
                日光ニーズ
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#e65100',
                margin: 0
              }}>{selectedPlant.requirements.sunlightNeed}/10</p>
            </div>
            <div style={{
              backgroundColor: '#e8f5e9',
              padding: '10px',
              borderRadius: '8px',
              textAlign: 'center',
              border: '1px solid #c8e6c9'
            }}>
              <p style={{
                fontSize: '12px',
                color: '#388e3c',
                margin: '0 0 5px 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span style={{ marginRight: '4px' }}>🌿</span>
                栄養ニーズ
              </p>
              <p style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#2e7d32',
                margin: 0
              }}>{selectedPlant.requirements.nutrientNeed}/10</p>
            </div>
          </div>
          
          {/* 育成のヒント */}
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#e8f5e9',
            borderRadius: '8px',
            border: '1px solid #c8e6c9'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#2e7d32',
              margin: '0 0 5px 0',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '5px' }}>💡</span>
              育成のヒント
            </p>
            <p style={{
              fontSize: '13px',
              color: '#388e3c',
              margin: 0
            }}>
              {selectedPlant.name}は
              {selectedPlant.requirements.waterNeed > 7 ? '水分を多く必要とします。' : 
               selectedPlant.requirements.waterNeed < 4 ? '水分は少なめで大丈夫です。' : 
               '適度な水分を必要とします。'}
              {selectedPlant.requirements.sunlightNeed > 7 ? '日光をたくさん浴びせましょう。' : 
               selectedPlant.requirements.sunlightNeed < 4 ? '日陰を好みます。' : 
               '適度な日光が必要です。'}
              {selectedPlant.requirements.nutrientNeed > 7 ? '栄養をしっかり与えてください。' : 
               selectedPlant.requirements.nutrientNeed < 4 ? '栄養は控えめで大丈夫です。' : 
               '適度な栄養を与えましょう。'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantCollection;
