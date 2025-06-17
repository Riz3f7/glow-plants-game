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
  
  // コレクター（3種類の植物）
  const uniqueSpecies = new Set(state.discoveredPlants.map(p => p.species));
  const collectorAchievement = updatedAchievements.find(a => a.id === 'achievement_plant_collector');
  if (collectorAchievement) {
    collectorAchievement.progress = uniqueSpecies.size;
    if (collectorAchievement.progress >= collectorAchievement.goal && !collectorAchievement.completed) {
      collectorAchievement.completed = true;
    }
  }
  
  // グリーンサム（植物を完全に成長させる）
  const hasFullyGrownPlant = state.plants.some(p => p.currentStage === 'fruiting') || 
                            state.discoveredPlants.some(p => p.currentStage === 'fruiting');
  const greenThumbAchievement = updatedAchievements.find(a => a.id === 'achievement_green_thumb');
  if (greenThumbAchievement && !greenThumbAchievement.completed && hasFullyGrownPlant) {
    greenThumbAchievement.progress = 1;
    if (greenThumbAchievement.progress >= greenThumbAchievement.goal) {
      greenThumbAchievement.completed = true;
    }
  }
  
  // 植物マスター（10ターン以上植物を生かし続ける）
  const longestLivingPlant = Math.max(
    ...state.plants.map(p => p.turnsAlive),
    ...state.discoveredPlants.map(p => p.turnsAlive)
  );
  const plantMasterAchievement = updatedAchievements.find(a => a.id === 'achievement_plant_master');
  if (plantMasterAchievement) {
    plantMasterAchievement.progress = longestLivingPlant;
    if (plantMasterAchievement.progress >= plantMasterAchievement.goal && !plantMasterAchievement.completed) {
      plantMasterAchievement.completed = true;
    }
  }
  
  // 植物学者（すべての種類の植物を発見）
  const botanistAchievement = updatedAchievements.find(a => a.id === 'achievement_botanist');
  if (botanistAchievement) {
    botanistAchievement.progress = uniqueSpecies.size;
    if (botanistAchievement.progress >= botanistAchievement.goal && !botanistAchievement.completed) {
      botanistAchievement.completed = true;
    }
  }
  
  // 熟練の庭師（植物を20回世話する）- このカウントは別途追跡する必要があります
  
  // 収穫王（5回植物を収穫する）- このカウントは別途追跡する必要があります
  
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
      
      updatedState = {
        ...state,
        plants: [...state.plants, newPlant],
      };
      
      // 実績の更新
      return updateAchievements(updatedState);
    }
    
    case 'REMOVE_PLANT': {
      const updatedPlants = state.plants.filter(p => p.id !== action.plantId);
      
      updatedState = {
        ...state,
        plants: updatedPlants,
      };
      
      // 実績の更新
      return updateAchievements(updatedState);
    }
    
    case 'BUY_ITEM': {
      const item = state.shopItems.find(i => i.id === action.itemId);
      if (!item) return state;
      
      // 所持金が足りるかチェック
      if (state.player.currency < item.price) return state;
      
      // アイテムを購入
      const boughtItem = { ...item, quantity: 1 };
      const updatedPlayer = addItem(
        { ...state.player, currency: state.player.currency - item.price },
        boughtItem
      );
      
      updatedState = {
        ...state,
        player: updatedPlayer,
      };
      
      // 実績の更新
      return updateAchievements(updatedState);
    }
    
    case 'USE_ITEM': {
      const item = state.player.inventory.find(i => i.id === action.itemId);
      if (!item || item.quantity <= 0) return state;
      
      const plantIndex = state.plants.findIndex(p => p.id === action.plantId);
      if (plantIndex < 0) return state;
      
      // アイテムの効果を適用
      let updatedPlant = { ...state.plants[plantIndex] };
      
      switch (item.effect.type) {
        case 'water':
          updatedPlant.stats.waterLevel = Math.min(100, updatedPlant.stats.waterLevel + item.effect.value);
          break;
        case 'nutrient':
          updatedPlant.stats.nutrientLevel = Math.min(100, updatedPlant.stats.nutrientLevel + item.effect.value);
          break;
        case 'sunlight':
          updatedPlant.stats.sunlightLevel = Math.min(100, updatedPlant.stats.sunlightLevel + item.effect.value);
          break;
        case 'health':
          updatedPlant.stats.health = Math.min(100, updatedPlant.stats.health + item.effect.value);
          break;
        case 'growth':
          updatedPlant.stats.growthProgress = Math.min(100, updatedPlant.stats.growthProgress + item.effect.value);
          break;
      }
      
      // アイテムを消費
      const updatedPlayer = useItem(state.player, action.itemId);
      
      // 植物を更新
      const updatedPlants = [...state.plants];
      updatedPlants[plantIndex] = updatedPlant;
      
      updatedState = {
        ...state,
        plants: updatedPlants,
        player: updatedPlayer,
        actionsRemaining: state.actionsRemaining - 1,
        careActionCount: (state.careActionCount || 0) + 1, // 世話カウントを追加
      };
      
      // 実績の更新
      return updateAchievements(updatedState);
    }
    
    case 'COMPLETE_ACHIEVEMENT': {
      const achievementIndex = state.player.achievements.findIndex(a => a.id === action.achievementId);
      if (achievementIndex < 0 || state.player.achievements[achievementIndex].completed) return state;
      
      const achievement = state.player.achievements[achievementIndex];
      let updatedPlayer = { ...state.player };
      
      // 報酬の付与
      switch (achievement.reward.type) {
        case 'currency':
          updatedPlayer = addCurrency(updatedPlayer, achievement.reward.value);
          break;
        case 'experience':
          // 経験値の追加は別の関数で実装
          break;
        case 'item':
          if (achievement.reward.itemId) {
            const rewardItem = state.shopItems.find(i => i.id === achievement.reward.itemId);
            if (rewardItem) {
              const itemToAdd = { ...rewardItem, quantity: achievement.reward.value };
              updatedPlayer = addItem(updatedPlayer, itemToAdd);
            }
          }
          break;
      }
      
      // 実績を完了済みにする
      const updatedAchievements = [...updatedPlayer.achievements];
      updatedAchievements[achievementIndex] = {
        ...updatedAchievements[achievementIndex],
        completed: true,
      };
      
      updatedPlayer.achievements = updatedAchievements;
      
      updatedState = {
        ...state,
        player: updatedPlayer,
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
