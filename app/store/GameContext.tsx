'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, createInitialGameState, Player, addItem, useItem, addCurrency } from '../models/Game';
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
  | { type: 'COMPLETE_ACHIEVEMENT'; achievementId: string };

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
      };
      
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
      };
      
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
      };
      
      // 実績の更新
      return updateAchievements(updatedState);
    }
    
    case 'HARVEST_PLANT': {
      if (state.actionsRemaining <= 0) return state;
      
      const plantIndex = state.plants.findIndex(p => p.id === action.plantId);
      if (plantIndex < 0) return state;
      
      const { plant: updatedPlant, player: updatedPlayer } = harvestPlant(
        state.plants[plantIndex],
        state.player
      );
      
      const updatedPlants = [...state.plants];
      
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
        };
        
        // 実績の更新
        return updateAchievements(updatedState);
      }
    }
    
    case 'END_TURN': {
      updatedState = endTurn(state);
      
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
      };
      
      // 実績の更新
      return updateAchievements(updatedState);
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
