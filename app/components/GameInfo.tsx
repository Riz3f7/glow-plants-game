'use client';

import React from 'react';
import Image from 'next/image';
import { useGameContext } from '../store/GameContext';
import Button from './Button';

const GameInfo: React.FC = () => {
  const { state, dispatch } = useGameContext();
  
  // 実績の達成状況
  const completedAchievements = state.player.achievements.filter(a => a.completed).length;
  const totalAchievements = state.player.achievements.length;
  
  // 発見した植物の数
  const discoveredPlants = state.discoveredPlants.length;
  const totalPlants = state.availablePlants.length;
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: '2px solid #e8f5e9'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{
            backgroundColor: '#e8f5e9',
            borderRadius: '50%',
            padding: '8px',
            marginRight: '10px',
            border: '2px solid #c8e6c9'
          }}>
            <span style={{ fontSize: '24px' }}>🌱</span>
          </div>
          <div>
            <h2 style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#2e7d32',
              margin: '0 0 5px 0'
            }}>ターン {state.currentTurn}</h2>
            <p style={{
              fontSize: '13px',
              color: '#666',
              margin: 0,
              display: 'flex',
              alignItems: 'center'
            }}>
              <span style={{ marginRight: '5px' }}>⚡</span>
              残りアクション: {state.actionsRemaining}/{state.actionsPerTurn}
            </p>
          </div>
        </div>
        <div style={{
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          padding: '8px',
          border: '1px solid #bbdefb'
        }}>
          <p style={{
            fontSize: '13px',
            fontWeight: 'bold',
            margin: '0 0 5px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '18px', marginRight: '5px' }}>{getWeatherEmoji(state.weather)}</span>
            {getWeatherName(state.weather)}
          </p>
          <p style={{
            fontSize: '11px',
            color: '#666',
            margin: 0,
            textAlign: 'center'
          }}>
            {getWeatherEffect(state.weather)}
          </p>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div>
          <p style={{
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            margin: '0 0 5px 0'
          }}>
            <span style={{ color: '#ffc107', marginRight: '5px' }}>⭐</span>
            <span style={{ fontWeight: 'bold' }}>レベル:</span> {state.player.level}
          </p>
          <div style={{
            width: '120px',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '5px'
          }}>
            <div
              style={{
                width: `${(state.player.experience / state.player.experienceToNextLevel) * 100}%`,
                height: '100%',
                backgroundColor: '#2196f3',
                borderRadius: '4px'
              }}
            ></div>
          </div>
          <p style={{
            fontSize: '11px',
            color: '#666',
            margin: '5px 0 0 0'
          }}>
            {state.player.experience}/{state.player.experienceToNextLevel} EXP
          </p>
        </div>
        <div style={{
          backgroundColor: '#fff8e1',
          borderRadius: '8px',
          padding: '8px',
          border: '1px solid #ffecb3',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '20px', color: '#ffc107', marginRight: '8px' }}>💰</span>
          <div>
            <p style={{
              fontSize: '11px',
              margin: '0 0 2px 0',
              fontWeight: 'bold'
            }}>
              所持金:
            </p>
            <p style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: '#ff9800',
              margin: 0
            }}>{state.player.currency} G</p>
          </div>
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #c8e6c9'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <span style={{ fontSize: '16px', marginRight: '5px' }}>🌿</span>
            <p style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#388e3c',
              margin: 0
            }}>発見した植物</p>
          </div>
          <p style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#2e7d32',
            margin: '0 0 5px 0'
          }}>{discoveredPlants}/{totalPlants}</p>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e0e0e0',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${(discoveredPlants / totalPlants) * 100}%`,
                height: '100%',
                backgroundColor: '#4caf50',
                borderRadius: '3px'
              }}
            ></div>
          </div>
        </div>
        <div style={{
          backgroundColor: '#f3e5f5',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #e1bee7'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <span style={{ fontSize: '16px', marginRight: '5px' }}>🏆</span>
            <p style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#7b1fa2',
              margin: 0
            }}>達成した実績</p>
          </div>
          <p style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#6a1b9a',
            margin: '0 0 5px 0'
          }}>{completedAchievements}/{totalAchievements}</p>
          <div style={{
            width: '100%',
            height: '6px',
            backgroundColor: '#e0e0e0',
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${(completedAchievements / totalAchievements) * 100}%`,
                height: '100%',
                backgroundColor: '#9c27b0',
                borderRadius: '3px'
              }}
            ></div>
          </div>
        </div>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #bbdefb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <span style={{ fontSize: '14px', marginRight: '5px' }}>💧</span>
            <p style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#1976d2',
              margin: 0
            }}>世話した回数</p>
          </div>
          <p style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#0d47a1',
            margin: 0
          }}>{state.careActionCount || 0}</p>
        </div>
        <div style={{
          backgroundColor: '#fff8e1',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid #ffecb3'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <span style={{ fontSize: '14px', marginRight: '5px' }}>🍎</span>
            <p style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#f57f17',
              margin: 0
            }}>収穫した回数</p>
          </div>
          <p style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#e65100',
            margin: 0
          }}>{state.harvestCount || 0}</p>
        </div>
      </div>
      
      {state.randomEvents.length > 0 && (
        <div style={{
          backgroundColor: '#f3e5f5',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px',
          border: '2px solid #e1bee7'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ fontSize: '18px', marginRight: '8px' }}>✨</span>
            <p style={{
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#7b1fa2',
              margin: 0
            }}>イベント発生!</p>
          </div>
          {state.randomEvents.map((event, index) => (
            <p key={index} style={{
              fontSize: '13px',
              color: '#6a1b9a',
              margin: '0 0 5px 25px',
              position: 'relative'
            }}>
              <span style={{ position: 'absolute', left: '-15px' }}>•</span>
              {event}
            </p>
          ))}
        </div>
      )}
      
      <button
        onClick={() => dispatch({ type: 'END_TURN' })}
        style={{
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '10px 0',
          width: '100%',
          fontSize: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        }}
      >
        <span style={{ marginRight: '8px' }}>⏭️</span>
        ターン終了
      </button>
    </div>
  );
};

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

// 天候の名前を返す関数
const getWeatherName = (weather: 'sunny' | 'cloudy' | 'rainy'): string => {
  switch (weather) {
    case 'sunny':
      return '晴れ';
    case 'cloudy':
      return 'くもり';
    case 'rainy':
      return '雨';
    default:
      return '晴れ';
  }
};

// 天候の効果を返す関数
const getWeatherEffect = (weather: 'sunny' | 'cloudy' | 'rainy'): string => {
  switch (weather) {
    case 'sunny':
      return '日光+10, 水分-5';
    case 'cloudy':
      return '変化なし';
    case 'rainy':
      return '水分+10, 日光-5';
    default:
      return '変化なし';
  }
};

export default GameInfo;
