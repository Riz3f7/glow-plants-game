'use client';

import React, { useState, useEffect } from 'react';
import { useGameContext } from '../store/GameContext';

interface SpecialEffectsProps {
  type: 'harvest' | 'dead';
  message: string;
  onComplete?: () => void;
}

const SpecialEffects: React.FC<SpecialEffectsProps> = ({ type, message, onComplete }) => {
  const [visible, setVisible] = useState(true);
  const [animationClass, setAnimationClass] = useState('');
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    // アニメーション開始
    setAnimationClass('animate-in');
    
    // パーティクルを生成
    setParticles(generateParticles());
    
    // 5秒後にアニメーション終了
    const timer = setTimeout(() => {
      setAnimationClass('animate-out');
      setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 1000); // アニメーション終了後に非表示
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  if (!visible) return null;
  
  // パーティクルを生成する関数
  function generateParticles() {
    const particleElements = [];
    const count = type === 'harvest' ? 30 : 20;
    const icons = type === 'harvest' 
      ? ['🍎', '✨', '🌟', '🎉', '🌱', '🌿', '🍀'] 
      : ['💀', '⚰️', '🥀', '☠️', '😭', '💔'];
    
    for (let i = 0; i < count; i++) {
      const randomIcon = icons[Math.floor(Math.random() * icons.length)];
      const delay = Math.random() * 2;
      const duration = 2 + Math.random() * 3;
      const size = 20 + Math.random() * 30;
      const left = Math.random() * 100;
      const rotation = Math.random() * 360;
      
      particleElements.push(
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${left}%`,
            top: '50%',
            fontSize: `${size}px`,
            opacity: 0,
            transform: `rotate(${rotation}deg)`,
            animation: `float ${duration}s ease-out ${delay}s forwards`
          }}
        >
          {randomIcon}
        </div>
      );
    }
    
    return particleElements;
  }
  
  const getBackgroundColor = () => {
    switch (type) {
      case 'harvest':
        return 'rgba(76, 175, 80, 0.9)'; // 緑色
      case 'dead':
        return 'rgba(244, 67, 54, 0.9)'; // 赤色
      default:
        return 'rgba(0, 0, 0, 0.8)';
    }
  };
  
  const getIcon = () => {
    switch (type) {
      case 'harvest':
        return '🍎';
      case 'dead':
        return '💀';
      default:
        return '⚠️';
    }
  };
  
  return (
    <div
      className={`special-effect ${animationClass}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: getBackgroundColor(),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        opacity: 0,
        transition: 'opacity 1s ease'
      }}
    >
      <style jsx global>{`
        .animate-in {
          opacity: 1 !important;
        }
        .animate-out {
          opacity: 0 !important;
        }
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        .icon-pulse {
          animation: pulse 1s infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        .shake {
          animation: shake 0.5s infinite;
        }
      `}</style>
      
      <div 
        className={type === 'dead' ? 'shake' : 'icon-pulse'} 
        style={{ 
          fontSize: '100px', 
          marginBottom: '20px',
          textShadow: '0 0 20px rgba(255,255,255,0.7)'
        }}
      >
        {getIcon()}
      </div>
      
      <h2 style={{
        fontSize: '36px',
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: '20px',
        textShadow: '0 2px 10px rgba(0,0,0,0.7)'
      }}>
        {message}
      </h2>
      
      {particles}
    </div>
  );
};

export default SpecialEffects;
