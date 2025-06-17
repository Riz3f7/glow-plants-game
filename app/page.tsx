'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { GameProvider, useGameContext } from './store/GameContext';
import { Plant } from './models/Plant';
import Button from './components/Button';
import PlantCard from './components/PlantCard';
import GameInfo from './components/GameInfo';
import PlantSelector from './components/PlantSelector';
import Inventory from './components/Inventory';
import Shop from './components/Shop';
import PlantCollection from './components/PlantCollection';
import Achievements from './components/Achievements';

// ゲームの状態
type GameScreen = 'title' | 'garden' | 'shop' | 'collection' | 'achievements';

// タイトル画面コンポーネント
const TitleScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      width: '100%',
      position: 'relative'
    }}>
      <div style={{
        width: '400px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        border: '2px solid #4caf50',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: '-20px', 
          left: '50%', 
          transform: 'translateX(-50%)',
          backgroundColor: '#4caf50',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ fontSize: '24px' }}>🌱</span>
        </div>
        
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          color: '#2e7d32',
          marginTop: '20px',
          marginBottom: '10px'
        }}>
          植物育成ゲーム
        </h1>
        
        <p style={{ 
          fontSize: '16px', 
          color: '#388e3c',
          marginBottom: '20px'
        }}>
          あなただけの植物を育てよう！
        </p>
        
        <button 
          onClick={onStart} 
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = '#388e3c';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = '#4caf50';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          はじめる
        </button>
      </div>
    </div>
  );
};

// ゲーム画面コンポーネント
const GameScreen: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const [currentScreen, setCurrentScreen] = useState<GameScreen>('garden');
  
  // 植物を選択する
  const handleSelectPlant = (plant: Plant) => {
    dispatch({ type: 'ADD_PLANT', plant });
  };
  
  // アイテムを使用する
  const handleUseItem = (itemId: string, plantId: string) => {
    dispatch({ type: 'USE_ITEM', itemId, plantId });
  };
  
  // アイテムを購入する
  const handleBuyItem = (itemId: string) => {
    dispatch({ type: 'BUY_ITEM', itemId });
  };
  
  // 画面に応じたコンテンツを表示
  const renderContent = () => {
    switch (currentScreen) {
      case 'garden':
        return (
          <>
            <GameInfo />
            
            <div style={{ marginBottom: '20px' }}>
              {state.plants.map(plant => (
                <div key={plant.id} style={{ marginBottom: '15px' }}>
                  <PlantCard
                    plant={plant}
                    onWater={() => dispatch({ type: 'WATER_PLANT', plantId: plant.id })}
                    onFertilize={() => dispatch({ type: 'FERTILIZE_PLANT', plantId: plant.id })}
                    onSunlight={() => dispatch({ type: 'GIVE_SUNLIGHT', plantId: plant.id })}
                    onHarvest={() => dispatch({ type: 'HARVEST_PLANT', plantId: plant.id })}
                    actionsRemaining={state.actionsRemaining}
                  />
                </div>
              ))}
            </div>
            
            {state.plants.length === 0 && (
              <div style={{
                backgroundColor: 'white',
                borderRadius: '10px',
                padding: '15px',
                marginBottom: '20px',
                border: '2px solid #e8f5e9',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
              }}>
                <h2 style={{
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#2e7d32',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{ marginRight: '8px' }}>🌱</span>
                  植物を選んで育てましょう！
                </h2>
                <PlantSelector
                  availablePlants={state.availablePlants}
                  onSelectPlant={handleSelectPlant}
                />
              </div>
            )}
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '15px',
              marginBottom: '70px',
              border: '2px solid #e8f5e9',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
            }}>
              <h2 style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#2e7d32',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ marginRight: '8px' }}>🧰</span>
                アイテム
              </h2>
              <Inventory
                items={state.player.inventory}
                plants={state.plants}
                onUseItem={handleUseItem}
              />
            </div>
          </>
        );
        
      case 'shop':
        return (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '70px',
            border: '2px solid #e8f5e9',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2e7d32',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '8px' }}>🛒</span>
              ショップ
            </h2>
            <Shop
              items={state.shopItems}
              playerCurrency={state.player.currency}
              onBuyItem={handleBuyItem}
            />
          </div>
        );
        
      case 'collection':
        return (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '70px',
            border: '2px solid #e8f5e9',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2e7d32',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '8px' }}>📚</span>
              植物図鑑
            </h2>
            <PlantCollection
              discoveredPlants={state.discoveredPlants}
              totalPlants={state.availablePlants.length}
            />
          </div>
        );
        
      case 'achievements':
        return (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '70px',
            border: '2px solid #e8f5e9',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
          }}>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2e7d32',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '8px' }}>🏆</span>
              実績
            </h2>
            <Achievements
              achievements={state.player.achievements}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '15px' }}>
      {/* メインコンテンツ */}
      <div style={{ paddingBottom: '60px' }}>
        {renderContent()}
      </div>
      
      {/* ナビゲーションバー */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderTop: '3px solid #4caf50',
        padding: '10px 0',
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '500px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          <button
            onClick={() => setCurrentScreen('garden')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: currentScreen === 'garden' ? '#e8f5e9' : 'transparent',
              color: currentScreen === 'garden' ? '#2e7d32' : '#666',
              transform: currentScreen === 'garden' ? 'translateY(-3px)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ fontSize: '20px' }}>🌱</span>
            <span style={{ fontSize: '12px', marginTop: '4px', fontWeight: currentScreen === 'garden' ? 'bold' : 'normal' }}>庭</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('shop')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: currentScreen === 'shop' ? '#e8f5e9' : 'transparent',
              color: currentScreen === 'shop' ? '#2e7d32' : '#666',
              transform: currentScreen === 'shop' ? 'translateY(-3px)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ fontSize: '20px' }}>🛒</span>
            <span style={{ fontSize: '12px', marginTop: '4px', fontWeight: currentScreen === 'shop' ? 'bold' : 'normal' }}>ショップ</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('collection')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: currentScreen === 'collection' ? '#e8f5e9' : 'transparent',
              color: currentScreen === 'collection' ? '#2e7d32' : '#666',
              transform: currentScreen === 'collection' ? 'translateY(-3px)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ fontSize: '20px' }}>📚</span>
            <span style={{ fontSize: '12px', marginTop: '4px', fontWeight: currentScreen === 'collection' ? 'bold' : 'normal' }}>図鑑</span>
          </button>
          
          <button
            onClick={() => setCurrentScreen('achievements')}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: currentScreen === 'achievements' ? '#e8f5e9' : 'transparent',
              color: currentScreen === 'achievements' ? '#2e7d32' : '#666',
              transform: currentScreen === 'achievements' ? 'translateY(-3px)' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            <span style={{ fontSize: '20px' }}>🏆</span>
            <span style={{ fontSize: '12px', marginTop: '4px', fontWeight: currentScreen === 'achievements' ? 'bold' : 'normal' }}>実績</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// メインコンポーネント
export default function Home() {
  const [gameStarted, setGameStarted] = useState(false);
  
  if (!gameStarted) {
    return <TitleScreen onStart={() => setGameStarted(true)} />;
  }
  
  return (
    <GameProvider>
      <GameScreen />
    </GameProvider>
  );
}
