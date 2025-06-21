'use client';

import React from 'react';
import Image from 'next/image';
import { Achievement } from '../models/Game';

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements: React.FC<AchievementsProps> = ({ achievements }) => {
  const completedCount = achievements.filter(a => a.completed).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.floor((completedCount / totalCount) * 100);

  // 実績タイプごとの色とアイコン
  const achievementStyles = {
    'achievement_first_plant': { bg: '#e8f5e9', border: '#c8e6c9', accent: '#4caf50', icon: '🌱' },
    'achievement_plant_collector': { bg: '#e3f2fd', border: '#bbdefb', accent: '#2196f3', icon: '🌿' },
    'achievement_green_thumb': { bg: '#f3e5f5', border: '#e1bee7', accent: '#9c27b0', icon: '👍' },
    'achievement_plant_master': { bg: '#fff8e1', border: '#ffecb3', accent: '#ffc107', icon: '🏅' },
    'achievement_botanist': { bg: '#e8f5e9', border: '#c8e6c9', accent: '#4caf50', icon: '🔬' },
    'achievement_gardener': { bg: '#e3f2fd', border: '#bbdefb', accent: '#2196f3', icon: '🧑‍🌾' },
    'achievement_harvest_king': { bg: '#ffebee', border: '#ffcdd2', accent: '#f44336', icon: '👑' },
  };

  // 報酬のアイコンを取得
  const getRewardIcon = (achievement: Achievement): string => {
    switch (achievement.reward.type) {
      case 'currency':
        return '💰';
      case 'experience':
        return '⭐';
      case 'item':
        return '🎁';
      default:
        return '🎁';
    }
  };

  // 報酬のテキストを生成する関数
  const getRewardText = (achievement: Achievement): string => {
    switch (achievement.reward.type) {
      case 'currency':
        return `${achievement.reward.value} G`;
      case 'experience':
        return `${achievement.reward.value} EXP`;
      case 'item':
        return `アイテム × ${achievement.reward.value}`;
      case 'plant':
        return `新しい植物`;
      default:
        return '';
    }
  };

  return (
    <div style={{
      position: 'relative',
      padding: '20px',
      borderRadius: '12px',
      backgroundColor: 'white',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      border: '2px solid #e1bee7',
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
          color: '#7b1fa2',
          margin: 0,
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '24px', marginRight: '8px' }}>🏆</span>
          実績
        </h2>
        <div style={{
          backgroundColor: '#f3e5f5',
          padding: '8px 12px',
          borderRadius: '20px',
          border: '1px solid #e1bee7',
          display: 'flex',
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '16px', color: '#9c27b0', marginRight: '6px' }}>✨</span>
          <p style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#7b1fa2',
            margin: 0
          }}>達成: {completedCount}/{totalCount}</p>
        </div>
      </div>

      <div style={{
        width: '100%',
        height: '10px',
        backgroundColor: '#f3e5f5',
        borderRadius: '5px',
        marginBottom: '20px',
        overflow: 'hidden'
      }}>
        <div
          style={{
            width: `${completionPercentage}%`,
            height: '100%',
            backgroundColor: '#9c27b0',
            borderRadius: '5px',
            transition: 'width 0.5s ease'
          }}
        ></div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
        overflowY: 'auto',
        maxHeight: 'calc(100vh - 300px)',
        paddingRight: '5px'
      }}>
        {achievements.map(achievement => {
          const style = achievementStyles[achievement.id as keyof typeof achievementStyles] || 
                      { bg: '#f5f5f5', border: '#e0e0e0', accent: '#9e9e9e', icon: '🎯' };
          
          return (
            <div
              key={achievement.id}
              style={{
                padding: '15px',
                borderRadius: '10px',
                backgroundColor: achievement.completed ? style.bg : 'white',
                border: `2px solid ${achievement.completed ? style.accent : style.border}`,
                boxShadow: achievement.completed ? `0 4px 8px rgba(0, 0, 0, 0.1)` : '0 2px 4px rgba(0, 0, 0, 0.05)',
                position: 'relative',
                overflow: 'hidden',
                height: '150px', // 固定の高さを設定
                minHeight: '150px', // 最小の高さも設定
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* 背景装飾 */}
              {achievement.completed && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  fontSize: '60px',
                  opacity: 0.1,
                  color: style.accent
                }}>
                  ✓
                </div>
              )}
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                position: 'relative',
                zIndex: 1,
                flex: 1
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: achievement.completed ? style.accent : '#333',
                    margin: '0 0 5px 0',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '18px', marginRight: '8px' }}>{style.icon}</span>
                    {achievement.completed && (
                      <span style={{ color: style.accent, marginRight: '5px' }}>✓</span>
                    )}
                    {achievement.name}
                  </h3>
                  <p style={{
                    fontSize: '13px',
                    color: '#666',
                    margin: '0 0 10px 0'
                  }}>{achievement.description}</p>
                </div>
                <div style={{
                  textAlign: 'right',
                  minWidth: '80px'
                }}>
                  <p style={{
                    fontSize: '12px',
                    color: '#757575',
                    margin: '0 0 5px 0'
                  }}>
                    {achievement.progress}/{achievement.goal}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    backgroundColor: achievement.completed ? style.bg : '#f5f5f5',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    border: `1px solid ${achievement.completed ? style.border : '#e0e0e0'}`
                  }}>
                    <span style={{ fontSize: '14px', marginRight: '4px' }}>
                      {getRewardIcon(achievement)}
                    </span>
                    <p style={{
                      fontSize: '12px',
                      fontWeight: 'bold',
                      color: achievement.completed ? style.accent : '#757575',
                      margin: 0
                    }}>
                      {getRewardText(achievement)}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                marginTop: '10px',
                overflow: 'hidden'
              }}>
                <div
                  style={{
                    width: `${Math.min(100, (achievement.progress / achievement.goal) * 100)}%`,
                    height: '100%',
                    backgroundColor: achievement.completed ? style.accent : '#2196f3',
                    borderRadius: '4px',
                    transition: 'width 0.5s ease'
                  }}
                ></div>
              </div>
              
              {/* 達成時の装飾 */}
              {achievement.completed && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: style.accent,
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                }}>
                  ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* 達成率に応じたメッセージ */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        borderRadius: '10px',
        backgroundColor: '#f3e5f5',
        border: '1px dashed #e1bee7',
        textAlign: 'center'
      }}>
        <p style={{
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#7b1fa2',
          margin: '0 0 5px 0'
        }}>
          {completionPercentage === 100 ? '🎉 すべての実績を達成しました！' :
           completionPercentage >= 75 ? '🌟 素晴らしい進捗です！あと少しで全達成！' :
           completionPercentage >= 50 ? '👍 半分以上達成しました！頑張りましょう！' :
           completionPercentage >= 25 ? '🌱 良い進捗です！引き続き頑張りましょう！' :
           '🌱 実績達成を目指して植物を育てましょう！'}
        </p>
        <p style={{
          fontSize: '12px',
          color: '#9c27b0',
          margin: 0
        }}>
          達成率: {completionPercentage}%
        </p>
      </div>
    </div>
  );
};

export default Achievements;
