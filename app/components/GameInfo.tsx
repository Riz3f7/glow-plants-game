'use client';

import React from 'react';
import { useGameContext } from '../store/GameContext';

const GameInfo: React.FC = () => {
  const { state, dispatch } = useGameContext();
  
  // 天候に応じた絵文字を返す関数
  const getWeatherEmoji = (weather: 'sunny' | 'cloudy' | 'rainy'): string => {
    switch (weather) {
      case 'sunny':
        return '☀️';
      case 'cloudy':
        return '☁️';
      case 'rainy':
        return '🌧️';
      default:
        return '☀️';
    }
  };
  
  // 残りターン数を計算
  const maxTurns = state.maxTurns || 30; // デフォルト値として30を設定
  const remainingTurns = maxTurns - state.currentTurn;
  
  // 残りターン数に応じた色を設定
  const getTurnColor = () => {
    if (remainingTurns <= 3) return '#f44336'; // 危険（赤）
    if (remainingTurns <= 7) return '#ff9800'; // 警告（オレンジ）
    return '#4caf50'; // 通常（緑）
  };
  
  return (
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
        <span style={{ marginRight: '8px' }}>📊</span>
        ゲーム情報
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>🌱</span>
          <div>
            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px' }}>ターン {state.currentTurn}</p>
            <p style={{ 
              margin: '0', 
              fontSize: '12px', 
              color: getTurnColor(),
              fontWeight: 'bold'
            }}>
              残り {remainingTurns} ターン
            </p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>{getWeatherEmoji(state.weather)}</span>
          <div>
            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px' }}>
              {state.weather === 'sunny' ? '晴れ' : 
               state.weather === 'cloudy' ? 'くもり' : '雨'}
            </p>
            <p style={{ margin: '0', fontSize: '12px' }}>
              {state.weather === 'sunny' ? '日光+, 水分-' : 
               state.weather === 'cloudy' ? '変化なし' : '水分+, 日光-'}
            </p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#fff8e1',
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>💰</span>
          <div>
            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px', color: '#ff9800' }}>{state.player.currency} G</p>
            <p style={{ margin: '0', fontSize: '12px' }}>所持金</p>
          </div>
        </div>
        
        <div style={{
          backgroundColor: '#f3e5f5',
          padding: '10px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '20px', marginRight: '10px' }}>⭐</span>
          <div>
            <p style={{ margin: '0', fontWeight: 'bold', fontSize: '14px' }}>レベル {state.player.level}</p>
            <p style={{ margin: '0', fontSize: '12px' }}>経験値: {state.player.experience}/{state.player.experienceToNextLevel}</p>
          </div>
        </div>
      </div>
      
      <button
        onClick={() => dispatch({ type: 'END_TURN' })}
        style={{
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 'bold',
          cursor: 'pointer',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <span style={{ marginRight: '5px' }}>⏭️</span>
        ターンを終了する
      </button>
    </div>
  );
};

export default GameInfo;
