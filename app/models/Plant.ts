// Plant.ts - 植物のモデル定義

export enum GrowthStage {
  SEED = 'seed',
  SPROUT = 'sprout',
  GROWING = 'growing',
  MATURE = 'mature',
  FLOWERING = 'flowering',
  FRUITING = 'fruiting',
}

export enum PlantCondition {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  NORMAL = 'normal',
  POOR = 'poor',
  CRITICAL = 'critical',
  DEAD = 'dead',
}

export interface PlantRequirements {
  waterNeed: number;      // 1-10 (低い-高い)
  sunlightNeed: number;   // 1-10 (低い-高い)
  nutrientNeed: number;   // 1-10 (低い-高い)
  growthRate: number;     // 成長速度 (1-10)
  turnsToNextStage: number; // 次の成長段階までのターン数
}

export interface PlantStats {
  waterLevel: number;     // 0-100
  sunlightLevel: number;  // 0-100
  nutrientLevel: number;  // 0-100
  health: number;         // 0-100
  growthProgress: number; // 0-100 (次の段階への進捗)
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  description: string;
  currentStage: GrowthStage;
  condition: PlantCondition;
  requirements: PlantRequirements;
  stats: PlantStats;
  imageUrl: string;
  discovered: boolean;
  turnsAlive: number;
  maxStage: GrowthStage;
  turnsWithoutCare?: number; // ケアなしのターン数を追加
  growthMessage?: string;    // 成長メッセージを追加
}

// 植物の初期データを生成する関数
export const createNewPlant = (
  id: string,
  name: string,
  species: string,
  description: string,
  requirements: PlantRequirements,
  imageUrl: string
): Plant => {
  return {
    id,
    name,
    species,
    description,
    currentStage: GrowthStage.SEED,
    condition: PlantCondition.NORMAL,
    requirements,
    stats: {
      waterLevel: 50,
      sunlightLevel: 50,
      nutrientLevel: 50,
      health: 100,
      growthProgress: 0,
    },
    imageUrl,
    discovered: true,
    turnsAlive: 0,
    maxStage: GrowthStage.FRUITING,
    turnsWithoutCare: 0, // 初期値は0
  };
};

// 植物の状態を更新する関数
export const updatePlantCondition = (plant: Plant): PlantCondition => {
  const { waterLevel, sunlightLevel, nutrientLevel, health } = plant.stats;
  
  // 健康度が0の場合は死亡
  if (health <= 0) {
    return PlantCondition.DEAD;
  }
  
  // 各要素の状態を評価
  const waterStatus = evaluateStatus(waterLevel, plant.requirements.waterNeed);
  const sunlightStatus = evaluateStatus(sunlightLevel, plant.requirements.sunlightNeed);
  const nutrientStatus = evaluateStatus(nutrientLevel, plant.requirements.nutrientNeed);
  
  // 総合評価
  const totalStatus = (waterStatus + sunlightStatus + nutrientStatus) / 3;
  
  if (totalStatus >= 90) return PlantCondition.EXCELLENT;
  if (totalStatus >= 75) return PlantCondition.GOOD;
  if (totalStatus >= 50) return PlantCondition.NORMAL;
  if (totalStatus >= 25) return PlantCondition.POOR;
  return PlantCondition.CRITICAL;
};

// 状態を評価するヘルパー関数
const evaluateStatus = (currentLevel: number, needLevel: number): number => {
  // 必要レベルに応じた最適値
  const optimalLevel = needLevel * 10; // 1-10 のニーズを 10-100 のスケールに変換
  
  // 現在の値と最適値の差を計算
  const difference = Math.abs(currentLevel - optimalLevel);
  
  // 差が小さいほど良い状態
  if (difference <= 5) return 100;
  if (difference <= 10) return 90;
  if (difference <= 20) return 75;
  if (difference <= 30) return 50;
  if (difference <= 40) return 25;
  return 0;
};
