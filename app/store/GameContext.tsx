'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, createInitialGameState } from '../models/Game';
import { Plant } from '../models/Plant';
import { waterPlant, fertilizePlant, giveSunlight, harvestPlant, endTurn } from '../utils/gameLogic';
import { initialPlants, initialItems, initialAchievements } from '../utils/initialData';

// アクションタイプの定義
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'WATER_PLANT'; plantId: string }
  | { type: 'FERTILIZE_PLANT'; plantId: string }
  | { type: 'GIVE_SUNLIGHT'; plantId: string }
  | { type: 'HARVEST_PLANT'; plantId: string }
  | { type: 'END_TURN' }
  | { type: 'ADD_PLANT'; plant: Plant }
  | { type: 'REMOVE_PLANT'; plantId: string }
  | { type: 'BUY_ITEM'; itemId: string }
  | { type: 'USE_ITEM'; itemId: string; plantId: string }
  | { type: 'COMPLETE_ACHIEVEMENT'; achievementId: string }
  | { type: 'CLEAR_EVENT_MESSAGES' };

// コンテキストの型定義
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

// コンテキストの作成
const GameContext = createContext<GameContextType | undefined>(undefined);

// ゲームの初期状態を設定
const getInitialState = (): GameState => {
  const initialState = createInitialGameState();
  
  // 初期データの設定
  initialState.availablePlants = initialPlants;
  initialState.shopItems = initialItems;
  initialState.player.achievements = initialAchievements;
  initialState.player.inventory = initialItems.filter(item => item.quantity > 0);
  
  // ゲーム性を高めるための調整
  initialState.actionsPerTurn = 3; // 1ターンあたりのアクション数を減らす（デフォルトは5）
  initialState.maxTurns = 20;      // 最大ターン数を設定（これを超えるとゲームオーバー）
  
  return initialState;
};

// 実績の進捗を更新する関数
const updateAchievements = (state: GameState): GameState => {
  const updatedAchievements = [...state.player.achievements];
  
  // 初めての植物
  if (state.plants.length > 0) {
    const firstPlantAchievement = updatedAchievements.find(a => a.id === 'achievement_first_plant');
    if (firstPlantAchievement && !firstPlantAchievement.completed) {
      firstPlantAchievement.progress = 1;
      if (firstPlantAchievement.progress >= firstPlantAchievement.goal) {
        firstPlantAchievement.completed = true;
        // 実績達成メッセージを追加
        state.eventMessages.push(`🏆 実績解除: ${firstPlantAchievement.name}`);
      }
    }
  }
  
  return {
    ...state,
    player: {
      ...state.player,
      achievements: updatedAchievements,
    }
  };
};

// 植物が枯れているかチェックする関数
const checkDeadPlants = (state: GameState): GameState => {
  const deadPlants = state.plants.filter(plant => plant.condition === 'dead');
  if (deadPlants.length > 0 && state.plants.length === deadPlants.length) {
    // すべての植物が枯れている場合、植物を削除して新しい植物を選択できるようにする
    return {
      ...state,
      plants: [], // 植物をクリア
      eventMessages: [...state.eventMessages, `🌱 新しい植物を選んでください`]
    };
  }
  return state;
};

// リデューサー関数
const gameReducer = (state: GameState, action: GameAction): GameState => {
  let updatedState = { ...state };
  
  switch (action.type) {
    case 'START_GAME':
      return getInitialState();
      
    case 'WATER_PLANT': {
      if (state.actionsRemaining <= 0) return state;
      
      const plantIndex = state.plants.findIndex(p => p.id === action.plantId);
      if (plantIndex < 0) return state;
      
      const updatedPlants = [...state.plants];
      updatedPlants[plantIndex] = waterPlant(updatedPlants[plantIndex]);
      
      updatedState = {
        ...state,
        plants: updatedPlants,
        actionsRemaining: state.actionsRemaining - 1,
        careActionCount: (state.careActionCount || 0) + 1, // 世話カウントを追加
        eventMessages: [...state.eventMessages, `💧 ${updatedPlants[plantIndex].name}に水をあげました`]
      };
      
      // 植物が枯れているかチェック
      updatedState = checkDeadPlants(updatedState);
      
      // 実績の更新
      return updateAchievements(updatedState);
    }
    
    case 'FERTILIZE_PLANT': {
      if (state.actionsRemaining <= 0) return state;
      
      const plantIndex = state.plants.findIndex(p => p.id === action.plantId);
      if (plantIndex < 0) return state;
      
      const updatedPlants = [...state.plants];
      updatedPlants[plantIndex] = fertilizePlant(updatedPlants[plantIndex]);
      
      updatedState = {
        ...state,
        plants: updatedPlants,
        actionsRemaining: state.actionsRemaining - 1,
        careActionCount: (state.careActionCount || 0) + 1, // 世話カウントを追加
        eventMessages: [...state.eventMessages, `🌿 ${updatedPlants[plantIndex].name}に肥料をあげました`]
      };
      
      // 植物が枯れているかチェック
      updatedState = checkDeadPlants(updatedState);
      
      // 実績の更新
      return updateAchievements(updatedState);
    }
    
    case 'GIVE_SUNLIGHT': {
      if (state.actionsRemaining <= 0) return state;
      
      const plantIndex = state.plants.findIndex(p => p.id === action.plantId);
      if (plantIndex < 0) return state;
      
      const updatedPlants = [...state.plants];
      updatedPlants[plantIndex] = giveSunlight(updatedPlants[plantIndex]);
      
      updatedState = {
        ...state,
        plants: updatedPlants,
        actionsRemaining: state.actionsRemaining - 1,
        careActionCount: (state.careActionCount || 0) + 1, // 世話カウントを追加
        eventMessages: [...state.eventMessages, `☀️ ${updatedPlants[plantIndex].name}に日光を当てました`]
      };
      
      // 植物が枯れているかチェック
      updatedState = checkDeadPlants(updatedState);
      
      // 実績の更新
      return updateAchievements(updatedState);
    }
    
    case 'HARVEST_PLANT': {
      if (state.actionsRemaining <= 0) return state;
      
      const plantIndex = state.plants.findIndex(p => p.id === action.plantId);
      if (plantIndex < 0) return state;
      
      const { plant: updatedPlant, player: updatedPlayer, message, levelUpMessage } = harvestPlant(
        state.plants[plantIndex],
        state.player
      );
      
      const updatedPlants = [...state.plants];
      
      // イベントメッセージを準備
      const newEventMessages = [...state.eventMessages];
      if (message) {
        newEventMessages.push(message);
      }
      if (levelUpMessage) {
        newEventMessages.push(levelUpMessage);
      }
      
      if (updatedPlant === null) {
        // 収穫された植物を削除
        updatedPlants.splice(plantIndex, 1);
        
        // 発見した植物に追加
        const harvestedPlant = state.plants[plantIndex];
        const alreadyDiscovered = state.discoveredPlants.some(p => p.species === harvestedPlant.species);
        
        if (!alreadyDiscovered) {
          const discoveredPlants = [...state.discoveredPlants, harvestedPlant];
          
          updatedState = {
            ...state,
            plants: updatedPlants,
            discoveredPlants,
            player: updatedPlayer,
            actionsRemaining: state.actionsRemaining - 1,
            harvestCount: (state.harvestCount || 0) + 1, // 収穫カウントを追加
            eventMessages: newEventMessages
          };
          
          // 実績の更新
          return updateAchievements(updatedState);
        }
        
        updatedState = {
          ...state,
          plants: updatedPlants,
          player: updatedPlayer,
          actionsRemaining: state.actionsRemaining - 1,
          harvestCount: (state.harvestCount || 0) + 1, // 収穫カウントを追加
          eventMessages: newEventMessages
        };
        
        // 実績の更新
        return updateAchievements(updatedState);
      } else {
        updatedPlants[plantIndex] = updatedPlant;
        
        updatedState = {
          ...state,
          plants: updatedPlants,
          player: updatedPlayer,
          actionsRemaining: state.actionsRemaining - 1,
          eventMessages: newEventMessages
        };
        
        // 実績の更新
        return updateAchievements(updatedState);
      }
    }
    
    case 'END_TURN': {
      // ターン終了処理
      updatedState = endTurn(state);
      
      // 最大ターン数に達したらゲーム終了フラグを設定
      if (updatedState.currentTurn > updatedState.maxTurns) {
        updatedState = {
          ...updatedState,
          isGameOver: true,
          eventMessages: [...updatedState.eventMessages, `🏁 ゲーム終了！最終ターン: ${updatedState.maxTurns}`]
        };
      }
      
      // 植物の成長メッセージを追加
      const growthMessages = updatedState.plants
        .filter(plant => plant.growthMessage)
        .map(plant => plant.growthMessage as string);
      
      if (growthMessages.length > 0) {
        updatedState = {
          ...updatedState,
          eventMessages: [...updatedState.eventMessages, ...growthMessages]
        };
        
        // 成長メッセージをクリア
        updatedState.plants = updatedState.plants.map(plant => ({
          ...plant,
          growthMessage: undefined
        }));
      }
      
      // 植物が枯れているかチェック
      const deadPlants = updatedState.plants.filter(plant => plant.condition === 'dead');
      if (deadPlants.length > 0 && updatedState.plants.length === deadPlants.length) {
        // すべての植物が枯れている場合、植物を削除して新しい植物を選択できるようにする
        updatedState = {
          ...updatedState,
          plants: [], // 植物をクリア
          eventMessages: [...updatedState.eventMessages, `🌱 新しい植物を選んでください`]
        };
      }
      
      // ランダムイベントをイベントメッセージに追加
      if (updatedState.randomEvents.length > 0) {
        updatedState = {
          ...updatedState,
          eventMessages: [...updatedState.eventMessages, ...updatedState.randomEvents]
        };
      }
      
      // 実績の更新
      return updateAchievements(updatedState);
    }
    
    case 'ADD_PLANT': {
      // 利用可能な植物から選択された植物を追加
      const newPlant = action.plant;
      
      // turnsWithoutCareプロパティを追加
      const plantWithCare = {
        ...newPlant,
        turnsWithoutCare: 0
      };
      
      updatedState = {
        ...state,
        plants: [...state.plants, plantWithCare],
        eventMessages: [...state.eventMessages, `🌱 ${newPlant.name}を植えました！`]
      };
      
      // 実績の更新
      return updateAchievements(updatedState);
    }
    
    case 'CLEAR_EVENT_MESSAGES': {
      return {
        ...state,
        eventMessages: []
      };
    }
    
    default:
      return state;
  }
};

// プロバイダーコンポーネント
export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, getInitialState());
  
  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// カスタムフック
export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};
