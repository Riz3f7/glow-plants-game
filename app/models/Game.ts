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
  goal: number;
  progress: number;
  completed: boolean;
  reward: {
    type: 'currency' | 'experience' | 'item' | 'plant';
    value: number;
    itemId?: string;
  };
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
  maxTurns: number; // 最大ターン数を追加
  actionsPerTurn: number;
  actionsRemaining: number;
  plants: Plant[];
  availablePlants: Plant[];
  discoveredPlants: Plant[];
  shopItems: GameItem[];
  player: Player;
  weather: 'sunny' | 'cloudy' | 'rainy';
  randomEvents: string[];
  careActionCount?: number; // 世話をした回数
  harvestCount?: number; // 収穫した回数
  eventMessages: string[]; // イベントメッセージを追加
  isGameOver?: boolean;   // ゲーム終了フラグを追加
  specialEffect?: {
    type: 'harvest' | 'dead';
    message: string;
  };
}

// 初期ゲーム状態を作成する関数
export const createInitialGameState = (): GameState => {
  return {
    currentTurn: 1,
    maxTurns: 15, // 最大ターン数を15に減らす
    actionsPerTurn: 2, // 1ターンあたりのアクション数を2に減らす
    actionsRemaining: 2,
    plants: [],
    availablePlants: [],
    discoveredPlants: [],
    shopItems: [],
    player: {
      level: 1,
      experience: 0,
      experienceToNextLevel: 100,
      currency: 100,
      inventory: [],
      achievements: []
    },
    weather: 'sunny',
    randomEvents: [],
    careActionCount: 0,
    harvestCount: 0,
    eventMessages: [],
    isGameOver: false,
    specialEffect: undefined
  };
};

// プレイヤーにアイテムを追加する関数
export const addItem = (player: Player, item: GameItem): Player => {
  const updatedInventory = [...player.inventory];
  const existingItemIndex = updatedInventory.findIndex(i => i.id === item.id);
  
  if (existingItemIndex >= 0) {
    // 既存のアイテムの数量を増やす
    updatedInventory[existingItemIndex] = {
      ...updatedInventory[existingItemIndex],
      quantity: updatedInventory[existingItemIndex].quantity + item.quantity
    };
  } else {
    // 新しいアイテムを追加
    updatedInventory.push(item);
  }
  
  return {
    ...player,
    inventory: updatedInventory
  };
};

// プレイヤーがアイテムを使用する関数
export const useItem = (player: Player, itemId: string): Player => {
  const updatedInventory = [...player.inventory];
  const itemIndex = updatedInventory.findIndex(i => i.id === itemId);
  
  if (itemIndex >= 0) {
    if (updatedInventory[itemIndex].quantity > 1) {
      // 数量を減らす
      updatedInventory[itemIndex] = {
        ...updatedInventory[itemIndex],
        quantity: updatedInventory[itemIndex].quantity - 1
      };
    } else {
      // アイテムを削除
      updatedInventory.splice(itemIndex, 1);
    }
  }
  
  return {
    ...player,
    inventory: updatedInventory
  };
};

// プレイヤーに通貨を追加する関数
export const addCurrency = (player: Player, amount: number): Player => {
  return {
    ...player,
    currency: player.currency + amount
  };
};

// プレイヤーに経験値を追加する関数
export const addExperience = (player: Player, amount: number): { player: Player, levelUpMessage?: string } => {
  const updatedPlayer = { ...player };
  updatedPlayer.experience += amount;
  
  let levelUpMessage: string | undefined;
  
  // レベルアップの処理
  while (updatedPlayer.experience >= updatedPlayer.experienceToNextLevel) {
    updatedPlayer.experience -= updatedPlayer.experienceToNextLevel;
    updatedPlayer.level += 1;
    updatedPlayer.experienceToNextLevel = Math.floor(updatedPlayer.experienceToNextLevel * 1.5);
    
    // レベルアップメッセージを設定
    levelUpMessage = `🎉 レベルアップ！ レベル${updatedPlayer.level}になりました！`;
  }
  
  return { player: updatedPlayer, levelUpMessage };
};
