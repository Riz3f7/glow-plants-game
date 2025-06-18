'use client';

import React from 'react';
import { useGameContext } from '../store/GameContext';

interface GameOverProps {
  onRestart: () => void;
}

const GameOver: React.FC<GameOverProps> = ({ onRestart }) => {
  const { state } = useGameContext();
  
  // 収穫した植物の数
  const harvestCount = state.harvestCount || 0;
  
  // 世話をした回数
  const careActionCount = state.careActionCount || 0;
  
  // プレイヤーのレベル
  const playerLevel = state.player.level;
  
  // 獲得した通貨
  const currency = state.player.currency;
  
  // 発見した植物の種類
  const discoveredPlants = state.discoveredPlants.length;
  
  // 達成した実績の数
  const completedAchievements = state.player.achievements.filter(a => a.completed).length;
  
  // 総合スコアの計算
  const totalScore = harvestCount * 100 + careActionCount * 10 + playerLevel * 50 + currency + discoveredPlants * 200 + completedAchievements * 300;
  
  // ランクの決定
  let rank = 'D';
  if (totalScore >= 2000) rank = 'A';
  else if (totalScore >= 1500) rank = 'B';
  else if (totalScore >= 1000) rank = 'C';
  
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '15px',
        padding: '30px',
        maxWidth: '500px',
        width: '90%',
        textAlign: 'center',
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
        border: '3px solid #4caf50'
      }}>
        <h2 style={{
          fontSize: '28px',
          color: '#2e7d32',
          marginBottom: '20px',
          fontWeight: 'bold'
        }}>🏁 ゲーム終了！</h2>
        
        <div style={{
          backgroundColor: '#f1f8e9',
          borderRadius: '10px',
          padding: '20px',
          marginBottom: '20px',
          border: '1px solid #c5e1a5'
        }}>
          <h3 style={{
            fontSize: '24px',
            color: '#33691e',
            marginBottom: '10px'
          }}>最終スコア: {totalScore}</h3>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '15px'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: rank === 'A' ? '#4caf50' : rank === 'B' ? '#8bc34a' : rank === 'C' ? '#cddc39' : '#ff9800',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: '32px',
              fontWeight: 'bold',
              boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)'
            }}>
              {rank}
            </div>
          </div>
          
          <p style={{
            fontSize: '16px',
            color: '#555',
            fontStyle: 'italic',
            marginBottom: '5px'
          }}>
            {rank === 'A' ? '素晴らしい！あなたは天才的な園芸家です！' :
             rank === 'B' ? '素晴らしい成果です！あなたは優れた園芸家です！' :
             rank === 'C' ? '良い成果です！あなたは有望な園芸家です！' :
             'まだまだ伸びしろがあります！次回に期待しましょう！'}
          </p>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '10px',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}><span style={{ fontWeight: 'bold' }}>🌾 収穫数:</span> {harvestCount}</p>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}><span style={{ fontWeight: 'bold' }}>💧 世話回数:</span> {careActionCount}</p>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}><span style={{ fontWeight: 'bold' }}>⭐ 最終レベル:</span> {playerLevel}</p>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}><span style={{ fontWeight: 'bold' }}>💰 獲得通貨:</span> {currency}G</p>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}><span style={{ fontWeight: 'bold' }}>🌱 発見植物:</span> {discoveredPlants}</p>
          </div>
          <div style={{ padding: '10px', backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '14px' }}><span style={{ fontWeight: 'bold' }}>🏆 達成実績:</span> {completedAchievements}</p>
          </div>
        </div>
        
        <button
          onClick={onRestart}
          style={{
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '12px 25px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            transition: 'all 0.3s ease'
          }}
        >
          もう一度プレイする
        </button>
      </div>
    </div>
  );
};

export default GameOver;
