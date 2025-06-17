'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GameItem } from '../models/Game';
import { Plant } from '../models/Plant';

interface InventoryProps {
  items: GameItem[];
  plants: Plant[];
  onUseItem: (itemId: string, plantId: string) => void;
}

const Inventory: React.FC<InventoryProps> = ({ items, plants, onUseItem }) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [showPlantSelector, setShowPlantSelector] = useState(false);

  const handleItemClick = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowPlantSelector(true);
  };

  const handleUseItem = () => {
    if (selectedItemId && selectedPlantId) {
      onUseItem(selectedItemId, selectedPlantId);
      setSelectedItemId(null);
      setSelectedPlantId(null);
      setShowPlantSelector(false);
    }
  };

  const handleCancel = () => {
    setSelectedItemId(null);
    setSelectedPlantId(null);
    setShowPlantSelector(false);
  };

  // アイテムタイプごとの色を設定
  const itemTypeColors = {
    'water': { bg: '#e3f2fd', border: '#bbdefb', accent: '#2196f3' },
    'nutrient': { bg: '#e8f5e9', border: '#c8e6c9', accent: '#4caf50' },
    'sunlight': { bg: '#fff8e1', border: '#ffecb3', accent: '#ffc107' },
    'health': { bg: '#ffebee', border: '#ffcdd2', accent: '#f44336' },
    'growth': { bg: '#f3e5f5', border: '#e1bee7', accent: '#9c27b0' },
  };

  // アイテムのタイプに基づいて色を取得
  const getItemColors = (item: GameItem) => {
    if (item.effect.type in itemTypeColors) {
      return itemTypeColors[item.effect.type as keyof typeof itemTypeColors];
    }
    return { bg: '#f5f5f5', border: '#e0e0e0', accent: '#9e9e9e' };
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
        bottom: '-15px',
        right: '-15px',
        width: '80px',
        height: '80px',
        opacity: 0.1,
        transform: 'rotate(-15deg)'
      }}>
        <Image
          src="/assets/images/output/fertilizer_icon.png"
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
        <span style={{ fontSize: '24px', marginRight: '8px' }}>🧰</span>
        インベントリ
      </h2>

      {items.length === 0 ? (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          color: '#757575',
          fontSize: '16px',
          marginBottom: '10px'
        }}>
          <span style={{ fontSize: '24px', display: 'block', marginBottom: '10px' }}>🔍</span>
          アイテムがありません
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '20px'
        }}>
          {items.map(item => {
            const colors = getItemColors(item);
            
            return (
              <div
                key={item.id}
                style={{
                  padding: '12px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedItemId === item.id ? colors.bg : 'white',
                  border: `2px solid ${selectedItemId === item.id ? colors.accent : colors.border}`,
                  boxShadow: selectedItemId === item.id ? `0 4px 8px rgba(0, 0, 0, 0.1)` : 'none',
                  position: 'relative'
                }}
                onClick={() => handleItemClick(item.id)}
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
                    border: `1px solid ${colors.border}`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '5px'
                  }}>
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={40}
                      height={40}
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <h3 style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333',
                    margin: '0 0 4px 0',
                    textAlign: 'center'
                  }}>{item.name}</h3>
                  <p style={{
                    fontSize: '12px',
                    color: '#666',
                    margin: 0,
                    backgroundColor: colors.bg,
                    padding: '2px 8px',
                    borderRadius: '10px',
                    fontWeight: 'bold'
                  }}>×{item.quantity}</p>
                </div>
                
                {selectedItemId === item.id && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: colors.accent,
                    color: 'white',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showPlantSelector && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          borderRadius: '10px',
          backgroundColor: '#f9f9f9',
          border: '1px dashed #ccc'
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '18px', marginRight: '6px' }}>🌱</span>
            使用する植物を選択
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '10px',
            marginBottom: '15px'
          }}>
            {plants.map(plant => (
              <div
                key={plant.id}
                style={{
                  padding: '10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backgroundColor: selectedPlantId === plant.id ? '#e8f5e9' : 'white',
                  border: `2px solid ${selectedPlantId === plant.id ? '#4caf50' : '#e0e0e0'}`,
                  display: 'flex',
                  alignItems: 'center'
                }}
                onClick={() => setSelectedPlantId(plant.id)}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  marginRight: '10px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f8e9',
                  border: '1px solid #c5e1a5',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={plant.imageUrl}
                    alt={plant.name}
                    width={30}
                    height={30}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
                <div>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: '#333',
                    margin: 0
                  }}>{plant.name}</h4>
                </div>
                
                {selectedPlantId === plant.id && (
                  <div style={{
                    marginLeft: 'auto',
                    backgroundColor: '#4caf50',
                    color: 'white',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '10px'
          }}>
            <button
              onClick={handleUseItem}
              disabled={!selectedPlantId}
              style={{
                backgroundColor: !selectedPlantId ? '#e0e0e0' : '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 15px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: !selectedPlantId ? 'not-allowed' : 'pointer',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: !selectedPlantId ? 0.7 : 1
              }}
            >
              <span style={{ marginRight: '5px' }}>✅</span>
              使用する
            </button>
            
            <button
              onClick={handleCancel}
              style={{
                backgroundColor: '#f5f5f5',
                color: '#333',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '10px 15px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <span style={{ marginRight: '5px' }}>❌</span>
              キャンセル
            </button>
          </div>
        </div>
      )}
      
      {/* アイテム説明 */}
      {selectedItemId && !showPlantSelector && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#555'
        }}>
          <p>{items.find(item => item.id === selectedItemId)?.description}</p>
        </div>
      )}
    </div>
  );
};

export default Inventory;
