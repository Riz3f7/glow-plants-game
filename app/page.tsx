'use client';

import React, { useState } from 'react';
import { GameProvider, useGameContext } from './store/GameContext';
import { Plant } from './models/Plant';
import PlantCard from './components/PlantCard';
import GameInfo from './components/GameInfo';
import GameInfoCompact from './components/GameInfoCompact';
import PlantSelector from './components/PlantSelector';
import Inventory from './components/Inventory';
import Shop from './components/Shop';
import PlantCollection from './components/PlantCollection';
import Achievements from './components/Achievements';
import EventMessages from './components/EventMessages';
import GameOver from './components/GameOver';
import SpecialEffects from './components/SpecialEffects';

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
  
  // ターン終了
  const handleEndTurn = () => {
    dispatch({ type: 'END_TURN' });
  };
  
  // ゲームを再スタート
  const handleRestart = () => {
    dispatch({ type: 'START_GAME' });
  };
  
  // PC用のナビゲーション
  const renderPcNavigation = () => (
    <div className="pc-nav">
      <button
        className={`pc-nav-button ${currentScreen === 'garden' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('garden')}
      >
        <span style={{ marginRight: '5px' }}>🌱</span>
        庭
      </button>
      <button
        className={`pc-nav-button ${currentScreen === 'shop' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('shop')}
      >
        <span style={{ marginRight: '5px' }}>🛒</span>
        ショップ
      </button>
      <button
        className={`pc-nav-button ${currentScreen === 'collection' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('collection')}
      >
        <span style={{ marginRight: '5px' }}>📚</span>
        図鑑
      </button>
      <button
        className={`pc-nav-button ${currentScreen === 'achievements' ? 'active' : ''}`}
        onClick={() => setCurrentScreen('achievements')}
      >
        <span style={{ marginRight: '5px' }}>🏆</span>
        実績
      </button>
    </div>
  );
  
  // PC用のフッター（ターン終了ボタンなど）
  const renderPcFooter = () => (
    <div className="pc-footer">
      <GameInfoCompact onEndTurn={handleEndTurn} />
    </div>
  );
  
  // モバイル用のナビゲーション
  const renderMobileNavigation = () => (
    <div className="nav-bar">
      <div style={{ maxWidth: '500px', margin: '0 auto', display: 'flex', justifyContent: 'space-around' }}>
        <button
          className={`nav-button ${currentScreen === 'garden' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('garden')}
        >
          <span style={{ fontSize: '20px' }}>🌱</span>
          <span style={{ fontSize: '12px', fontWeight: 'medium', marginTop: '4px' }}>庭</span>
        </button>
        <button
          className={`nav-button ${currentScreen === 'shop' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('shop')}
        >
          <span style={{ fontSize: '20px' }}>🛒</span>
          <span style={{ fontSize: '12px', fontWeight: 'medium', marginTop: '4px' }}>ショップ</span>
        </button>
        <button
          className={`nav-button ${currentScreen === 'collection' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('collection')}
        >
          <span style={{ fontSize: '20px' }}>📚</span>
          <span style={{ fontSize: '12px', fontWeight: 'medium', marginTop: '4px' }}>図鑑</span>
        </button>
        <button
          className={`nav-button ${currentScreen === 'achievements' ? 'active' : ''}`}
          onClick={() => setCurrentScreen('achievements')}
        >
          <span style={{ fontSize: '20px' }}>🏆</span>
          <span style={{ fontSize: '12px', fontWeight: 'medium', marginTop: '4px' }}>実績</span>
        </button>
      </div>
    </div>
  );
  
  // サイドバーコンテンツ（PC表示用）
  const renderSidebar = () => {
    switch (currentScreen) {
      case 'garden':
        return (
          <>
            <div style={{ marginBottom: '20px' }}>
              <GameInfo />
            </div>
            <Inventory
              items={state.player.inventory}
              plants={state.plants}
              onUseItem={handleUseItem}
            />
          </>
        );
      case 'shop':
        return null;
      case 'collection':
        return null;
      case 'achievements':
        return null;
      default:
        return null;
    }
  };
  
  // 画面に応じたコンテンツを表示
  const renderContent = () => {
    switch (currentScreen) {
      case 'garden':
        return (
          <div className="pc-layout">
            <div className="pc-column">
              {/* モバイル表示用のGameInfo - PCでは非表示 */}
              <div className="lg:hidden mb-4">
                <GameInfo />
              </div>
              
              {state.plants.length === 0 ? (
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
              ) : (
                <div className="plant-cards-container">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '15px', marginBottom: '20px' }}>
                    {state.plants.map(plant => (
                      <div key={plant.id}>
                        <PlantCard
                          plant={plant}
                          onWater={() => dispatch({ type: 'WATER_PLANT', plantId: plant.id })}
                          onFertilize={() => dispatch({ type: 'FERTILIZE_PLANT', plantId: plant.id })}
                          onSunlight={() => dispatch({ type: 'GIVE_SUNLIGHT', plantId: plant.id })}
                          onHarvest={() => dispatch({ type: 'HARVEST_PLANT', plantId: plant.id })}
                          onAbandon={() => dispatch({ type: 'REMOVE_PLANT', plantId: plant.id })}
                          actionsRemaining={state.actionsRemaining}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* モバイル表示用のインベントリ - PCでは非表示 */}
              <div className="lg:hidden mb-20">
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
                    <span style={{ marginRight: '8px' }}>🧰</span>
                    アイテム
                  </h2>
                  <Inventory
                    items={state.player.inventory}
                    plants={state.plants}
                    onUseItem={handleUseItem}
                  />
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'shop':
        return (
          <Shop
            items={state.shopItems}
            playerCurrency={state.player.currency}
            onBuyItem={handleBuyItem}
          />
        );
        
      case 'collection':
        return (
          <PlantCollection
            discoveredPlants={state.discoveredPlants}
            totalPlants={state.availablePlants.length}
          />
        );
        
      case 'achievements':
        return (
          <Achievements
            achievements={state.player.achievements}
          />
        );
        
      default:
        return null;
    }
  };
  
  return (
    <>
      {renderPcNavigation()}
      
      <div className="game-content">
        <div className="game-main">
          {renderContent()}
        </div>
        
        <div className="game-sidebar">
          {renderSidebar()}
        </div>
      </div>
      
      {renderPcFooter()}
      {renderMobileNavigation()}
      
      {/* イベントメッセージ表示 */}
      <EventMessages />
      
      {/* 特殊効果表示 */}
      {state.specialEffect && (
        <SpecialEffects
          type={state.specialEffect.type}
          message={state.specialEffect.message}
          onComplete={() => dispatch({ type: 'CLEAR_SPECIAL_EFFECT' })}
        />
      )}
      
      {/* ゲーム終了時の表示 */}
      {state.isGameOver && <GameOver onRestart={handleRestart} />}
    </>
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
