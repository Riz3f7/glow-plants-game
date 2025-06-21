'use client';

import React from 'react';
import Image from 'next/image';
import { GameItem } from '../models/Game';

interface ShopProps {
  items: GameItem[];
  playerCurrency: number;
  onBuyItem: (itemId: string) => void;
}

const Shop: React.FC<ShopProps> = ({ items, playerCurrency, onBuyItem }) => {
  const unlockedItems = items.filter(item => item.unlocked);

  // アイテムタイプごとの色を設定
  const itemTypeColors = {
    'water': { bg: '#e3f2fd', border: '#bbdefb', accent: '#2196f3', icon: '💧' },
    'nutrient': { bg: '#e8f5e9', border: '#c8e6c9', accent: '#4caf50', icon: '🌿' },
    'sunlight': { bg: '#fff8e1', border: '#ffecb3', accent: '#ffc107', icon: '☀️' },
    'health': { bg: '#ffebee', border: '#ffcdd2', accent: '#f44336', icon: '❤️' },
    'growth': { bg: '#f3e5f5', border: '#e1bee7', accent: '#9c27b0', icon: '🌱' },
  };

  // アイテムのタイプに基づいて色を取得
  const getItemColors = (item: GameItem) => {
    if (item.effect.type in itemTypeColors) {
      return itemTypeColors[item.effect.type as keyof typeof itemTypeColors];
    }
    return { bg: '#f5f5f5', border: '#e0e0e0', accent: '#9e9e9e', icon: '📦' };
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
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        opacity: 0.05,
        transform: 'rotate(15deg)'
      }}>
        <Image
          src="/assets/images/output/fertilizer_icon.png"
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
          <span style={{ fontSize: '24px', marginRight: '8px' }}>🛒</span>
          ショップ
        </h2>
        <div style={{
          backgroundColor: '#fff8e1',
          padding: '8px 12px',
          borderRadius: '20px',
          border: '1px solid #ffecb3',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '18px', color: '#ffc107', marginRight: '6px' }}>💰</span>
          <p style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#ff9800',
            margin: 0
          }}>{playerCurrency} G</p>
        </div>
      </div>

      {unlockedItems.length === 0 ? (
        <div style={{
          padding: '30px',
          textAlign: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: '10px',
          color: '#757575',
          fontSize: '16px'
        }}>
          <span style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}>🏪</span>
          商品がありません
        </div>
      ) : (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          overflowY: 'auto',
          maxHeight: 'calc(100vh - 250px)',
          paddingRight: '5px'
        }}>
          {unlockedItems.map(item => {
            const colors = getItemColors(item);
            const canBuy = playerCurrency >= item.price;
            
            return (
              <div
                key={item.id}
                style={{
                  padding: '15px',
                  borderRadius: '10px',
                  backgroundColor: 'white',
                  border: `2px solid ${colors.border}`,
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* 背景装飾 */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  width: '80px',
                  height: '80px',
                  opacity: 0.03,
                  zIndex: 0
                }}>
                  <Image
                    src={item.imageUrl}
                    alt="背景装飾"
                    width={80}
                    height={80}
                  />
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    marginRight: '15px',
                    borderRadius: '50%',
                    backgroundColor: colors.bg,
                    border: `2px solid ${colors.border}`,
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
                  <div>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: 'bold',
                      color: '#333',
                      margin: '0 0 5px 0'
                    }}>{item.name}</h3>
                    <p style={{
                      fontSize: '13px',
                      color: '#666',
                      margin: 0
                    }}>{item.description}</p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '5px'
                    }}>
                      <span style={{
                        fontSize: '12px',
                        backgroundColor: colors.bg,
                        color: colors.accent,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        fontWeight: 'bold',
                        marginRight: '8px',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <span style={{ marginRight: '3px' }}>{colors.icon}</span>
                        +{item.effect.value}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <p style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#ff9800',
                    margin: '0 0 8px 0',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '14px', marginRight: '4px' }}>💰</span>
                    {item.price} G
                  </p>
                  <button
                    onClick={() => onBuyItem(item.id)}
                    disabled={!canBuy}
                    style={{
                      backgroundColor: canBuy ? colors.accent : '#e0e0e0',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '8px 15px',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      cursor: canBuy ? 'pointer' : 'not-allowed',
                      opacity: canBuy ? 1 : 0.6,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    購入
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Shop;
