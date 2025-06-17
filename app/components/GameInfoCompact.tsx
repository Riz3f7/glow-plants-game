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
  
  return (
    <div className="game-info-compact">
      <div className="info-item">
        <span style={{ fontSize: '20px' }}>🌱</span>
        <div>
          <div style={{ fontWeight: 'bold' }}>ターン {state.currentTurn}</div>
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
      
      {/* イベントメッセージ表示エリア */}
      {state.randomEvents.length > 0 && (
        <div className="event-message">
          <div className="event-icon">✨</div>
          <div className="event-text">
            {state.randomEvents[0]}
          </div>
        </div>
      )}
      
      <button className="end-turn-button" onClick={onEndTurn}>
        <span>⏭️</span>
        ターン終了
      </button>
    </div>
  );
};

export default GameInfoCompact;
