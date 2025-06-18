'use client';

import React, { useEffect, useState } from 'react';
import { useGameContext } from '../store/GameContext';

const EventMessages: React.FC = () => {
  const { state, dispatch } = useGameContext();
  const [visible, setVisible] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  
  // メッセージが追加されたら表示する
  useEffect(() => {
    if (state.eventMessages.length > 0) {
      setVisible(true);
      
      // 3秒後に非表示にする（表示時間を短縮）
      const timer = setTimeout(() => {
        setVisible(false);
        // 非表示になった後にメッセージをクリアしない（ログ確認用に保持）
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [state.eventMessages, dispatch]);
  
  // ログモーダルを閉じる時にメッセージをクリア
  const handleCloseLogModal = () => {
    setShowLogModal(false);
    dispatch({ type: 'CLEAR_EVENT_MESSAGES' });
  };
  
  if (state.eventMessages.length === 0) {
    return null;
  }
  
  return (
    <>
      {/* メッセージ表示 - フッターのレベルとターン終了ボタンの間に表示 */}
      <div 
        className={`event-messages ${visible ? 'visible' : ''}`}
        style={{
          position: 'fixed',
          bottom: '60px', // フッターの上に表示
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '8px 15px',
          borderRadius: '10px',
          maxWidth: '80%',
          zIndex: 1000,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
        onClick={() => setShowLogModal(true)} // クリックでログモーダルを表示
      >
        <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
          {/* 最新のメッセージのみ表示 */}
          <div 
            style={{
              padding: '3px 0',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'center'
            }}
          >
            {state.eventMessages[state.eventMessages.length - 1]}
          </div>
          {state.eventMessages.length > 1 && (
            <div style={{ fontSize: '12px', textAlign: 'center', opacity: 0.8, marginTop: '3px' }}>
              タップしてログを表示 (+{state.eventMessages.length - 1})
            </div>
          )}
        </div>
      </div>
      
      {/* ログ確認モーダル */}
      {showLogModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
          }}
          onClick={handleCloseLogModal}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '10px',
              padding: '20px',
              maxWidth: '90%',
              width: '500px',
              maxHeight: '80%',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 15px 0', color: '#2e7d32', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
              イベントログ
            </h3>
            
            <div style={{ overflowY: 'auto', flex: 1, maxHeight: '400px' }}>
              {state.eventMessages.map((message, index) => (
                <div 
                  key={index}
                  style={{
                    padding: '8px 10px',
                    borderBottom: '1px solid #f0f0f0',
                    fontSize: '14px'
                  }}
                >
                  {message}
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: '15px', textAlign: 'right' }}>
              <button
                onClick={handleCloseLogModal}
                style={{
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 15px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventMessages;
