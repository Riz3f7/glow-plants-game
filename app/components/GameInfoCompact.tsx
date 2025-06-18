'use client';

import React from 'react';
import { useGameContext } from '../store/GameContext';

interface GameInfoCompactProps {
  onEndTurn: () => void;
}

const GameInfoCompact: React.FC<GameInfoCompactProps> = ({ onEndTurn }) => {
  const { state } = useGameContext();
  
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
    <div className="game-info-compact">
      <div className="info-item">
        <span style={{ fontSize: '20px' }}>🌱</span>
        <div>
          <div style={{ 
            fontWeight: 'bold', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            ターン {state.currentTurn}
            <span style={{ 
              fontSize: '12px', 
              marginLeft: '5px',
              color: getTurnColor(),
              fontWeight: 'bold'
            }}>
              (残り{remainingTurns}ターン)
            </span>
          </div>
          <div style={{ fontSize: '12px' }}>残り: {state.actionsRemaining}/{state.actionsPerTurn}</div>
        </div>
      </div>
      
      <div className="info-item">
        <span style={{ fontSize: '20px' }}>{getWeatherEmoji(state.weather)}</span>
        <div style={{ fontSize: '12px' }}>
          {state.weather === 'sunny' ? '晴れ' : 
           state.weather === 'cloudy' ? 'くもり' : '雨'}
        </div>
      </div>
      
      <div className="info-item">
        <span style={{ fontSize: '20px' }}>💰</span>
        <div style={{ fontWeight: 'bold', color: '#ff9800' }}>{state.player.currency} G</div>
      </div>
      
      <div className="info-item">
        <span style={{ fontSize: '20px' }}>⭐</span>
        <div>
          <div style={{ fontWeight: 'bold' }}>Lv. {state.player.level}</div>
          <div style={{ fontSize: '12px' }}>{state.player.experience}/{state.player.experienceToNextLevel}</div>
        </div>
      </div>
      
      <button className="end-turn-button" onClick={onEndTurn}>
        <span>⏭️</span>
        ターン終了
      </button>
    </div>
  );
};

export default GameInfoCompact;
