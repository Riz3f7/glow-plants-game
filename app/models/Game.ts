// Game.ts - ゲームの状態を管理するモデル

import { Plant } from './Plant';

export interface GameItem {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  effect: {
    type: 'water' | 'nutrient' | 'sunlight' | 'health' | 'growth';
    value: number;
  };
  quantity: number;
  price: number;
  unlocked: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  reward: {
    type: 'currency' | 'item' | 'plant' | 'experience';
    value: number;
    itemId?: string;
  };
  progress: number;
  goal: number;
}

export interface Player {
  level: number;
  experience: number;
  experienceToNextLevel: number;
  currency: number;
  inventory: GameItem[];
  achievements: Achievement[];
}

export interface GameState {
  currentTurn: number;
  player: Player;
  plants: Plant[];
  availablePlants: Plant[];
  discoveredPlants: Plant[];
  shopItems: GameItem[];
  actionsPerTurn: number;
  actionsRemaining: number;
  weather: 'sunny' | 'cloudy' | 'rainy';
  randomEvents: string[];
  // 実績追跡用のカウンター
  careActionCount?: number; // 植物の世話をした回数
  harvestCount?: number;    // 収穫した回数
}

// 初期ゲーム状態を生成する関数
export const createInitialGameState = (): GameState => {
  return {
    currentTurn: 1,
    player: {
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      currency: 100,
      inventory: [],
      achievements: [],
    },
    plants: [],
    availablePlants: [],
    discoveredPlants: [],
    shopItems: [],
    actionsPerTurn: 3,
    actionsRemaining: 3,
    weather: 'sunny',
    randomEvents: [],
    careActionCount: 0,
    harvestCount: 0,
  };
};

// プレイヤーレベルアップ関数
export const levelUpPlayer = (player: Player): Player => {
  const newLevel = player.level + 1;
  const newExperienceToNextLevel = Math.floor(player.experienceToNextLevel * 1.5);
  
  return {
    ...player,
    level: newLevel,
    experience: player.experience - player.experienceToNextLevel,
    experienceToNextLevel: newExperienceToNextLevel,
  };
};

// 経験値を追加する関数
export const addExperience = (player: Player, amount: number): Player => {
  let updatedPlayer = { ...player };
  updatedPlayer.experience += amount;
  
  // レベルアップ処理
  while (updatedPlayer.experience >= updatedPlayer.experienceToNextLevel) {
    updatedPlayer = levelUpPlayer(updatedPlayer);
  }
  
  return updatedPlayer;
};

// 通貨を追加する関数
export const addCurrency = (player: Player, amount: number): Player => {
  return {
    ...player,
    currency: player.currency + amount,
  };
};

// アイテムを追加する関数
export const addItem = (player: Player, item: GameItem): Player => {
  const existingItemIndex = player.inventory.findIndex(i => i.id === item.id);
  
  if (existingItemIndex >= 0) {
    // 既存のアイテムの数量を増やす
    const updatedInventory = [...player.inventory];
    updatedInventory[existingItemIndex] = {
      ...updatedInventory[existingItemIndex],
      quantity: updatedInventory[existingItemIndex].quantity + item.quantity,
    };
    
    return {
      ...player,
      inventory: updatedInventory,
    };
  } else {
    // 新しいアイテムを追加
    return {
      ...player,
      inventory: [...player.inventory, item],
    };
  }
};

// アイテムを使用する関数
export const useItem = (player: Player, itemId: string): Player => {
  const itemIndex = player.inventory.findIndex(i => i.id === itemId);
  
  if (itemIndex < 0 || player.inventory[itemIndex].quantity <= 0) {
    return player; // アイテムがない場合は何もしない
  }
  
  const updatedInventory = [...player.inventory];
  updatedInventory[itemIndex] = {
    ...updatedInventory[itemIndex],
    quantity: updatedInventory[itemIndex].quantity - 1,
  };
  
  // 数量が0になったらインベントリから削除
  if (updatedInventory[itemIndex].quantity <= 0) {
    updatedInventory.splice(itemIndex, 1);
  }
  
  return {
    ...player,
    inventory: updatedInventory,
  };
};
