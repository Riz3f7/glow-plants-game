'use client';

import React, { useEffect, useState } from 'react';
import { useGameContext } from '../store/GameContext';

const EventMessages: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const [visible, setVisible] = useState(false);
  
  // メッセージが追加されたら表示する
  useEffect(() => {
    if (state.eventMessages.length > 0) {
      setVisible(true);
      
      // 5秒後に非表示にする
      const timer = setTimeout(() => {
        setVisible(false);
        // 非表示になった後にメッセージをクリア
        setTimeout(() => {
          dispatch({ type: 'CLEAR_EVENT_MESSAGES' });
        }, 300); // アニメーション完了後にクリア
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [state.eventMessages, dispatch]);
  
  if (state.eventMessages.length === 0) {
    return null;
  }
  
  return (
    <div 
      className={`event-messages ${visible ? 'visible' : ''}`}
      style={{
        position: 'fixed',
        bottom: '80px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '10px',
        maxWidth: '80%',
        zIndex: 1000,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {state.eventMessages.map((message, index) => (
          <div 
            key={index}
            style={{
              padding: '5px 0',
              borderBottom: index < state.eventMessages.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            {message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventMessages;
