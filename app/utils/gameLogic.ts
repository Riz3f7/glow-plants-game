// gameLogic.ts - ゲームのコアロジック

import { Plant, GrowthStage, PlantCondition, updatePlantCondition } from '../models/Plant';
import { GameState, Player, addExperience } from '../models/Game';

// 植物に水をやる
export const waterPlant = (plant: Plant): Plant => {
  const updatedStats = { ...plant.stats };
  updatedStats.waterLevel = Math.min(100, updatedStats.waterLevel + 30);
  
  // 水が多すぎる場合は健康度が下がる
  if (updatedStats.waterLevel > 90 && plant.requirements.waterNeed < 7) {
    updatedStats.health = Math.max(0, updatedStats.health - 5);
  }
  
  const updatedPlant = { ...plant, stats: updatedStats };
  updatedPlant.condition = updatePlantCondition(updatedPlant);
  
  return updatedPlant;
};

// 植物に肥料をやる
export const fertilizePlant = (plant: Plant): Plant => {
  const updatedStats = { ...plant.stats };
  updatedStats.nutrientLevel = Math.min(100, updatedStats.nutrientLevel + 30);
  
  // 肥料が多すぎる場合は健康度が下がる
  if (updatedStats.nutrientLevel > 90 && plant.requirements.nutrientNeed < 7) {
    updatedStats.health = Math.max(0, updatedStats.health - 5);
  }
  
  const updatedPlant = { ...plant, stats: updatedStats };
  updatedPlant.condition = updatePlantCondition(updatedPlant);
  
  return updatedPlant;
};

// 植物に日光を当てる
export const giveSunlight = (plant: Plant): Plant => {
  const updatedStats = { ...plant.stats };
  updatedStats.sunlightLevel = Math.min(100, updatedStats.sunlightLevel + 30);
  
  // 日光が多すぎる場合は健康度が下がる
  if (updatedStats.sunlightLevel > 90 && plant.requirements.sunlightNeed < 7) {
    updatedStats.health = Math.max(0, updatedStats.health - 5);
  }
  
  const updatedPlant = { ...plant, stats: updatedStats };
  updatedPlant.condition = updatePlantCondition(updatedPlant);
  
  return updatedPlant;
};

// 植物を収穫する
export const harvestPlant = (plant: Plant, player: Player): { plant: Plant | null, player: Player } => {
  // 収穫可能な状態かチェック
  if (plant.currentStage !== GrowthStage.FRUITING) {
    return { plant, player }; // 収穫できない場合は何も変更しない
  }
  
  // 収穫による報酬計算
  const rewardMultiplier = plant.condition === PlantCondition.EXCELLENT ? 2 :
                          plant.condition === PlantCondition.GOOD ? 1.5 :
                          plant.condition === PlantCondition.NORMAL ? 1 :
                          plant.condition === PlantCondition.POOR ? 0.7 : 0.5;
  
  const experienceReward = Math.floor(50 * rewardMultiplier);
  const currencyReward = Math.floor(30 * rewardMultiplier);
  
  // 経験値と通貨を追加
  let updatedPlayer = addExperience(player, experienceReward);
  updatedPlayer.currency += currencyReward;
  
  // 収穫後は植物がなくなる
  return { plant: null, player: updatedPlayer };
};

// ターン終了時の処理
export const endTurn = (gameState: GameState): GameState => {
  const updatedPlants = gameState.plants.map(plant => processTurnForPlant(plant));
  
  // 天候の変化（ランダム）
  const weatherOptions: ('sunny' | 'cloudy' | 'rainy')[] = ['sunny', 'cloudy', 'rainy'];
  const newWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  
  // ランダムイベントの生成（10%の確率）
  const randomEvents: string[] = [];
  if (Math.random() < 0.1) {
    const possibleEvents = [
      '突然の雨が降り、すべての植物の水分レベルが上昇しました！',
      '強い日差しにより、すべての植物の日光レベルが上昇しました！',
      '害虫の発生により、一部の植物の健康状態が悪化しました。',
      '肥沃な土壌により、すべての植物の栄養レベルが上昇しました！'
    ];
    randomEvents.push(possibleEvents[Math.floor(Math.random() * possibleEvents.length)]);
  }
  
  // ランダムイベントの効果を適用
  let processedPlants = updatedPlants;
  if (randomEvents.length > 0) {
    if (randomEvents[0].includes('雨')) {
      processedPlants = processedPlants.map(plant => ({
        ...plant,
        stats: { ...plant.stats, waterLevel: Math.min(100, plant.stats.waterLevel + 20) }
      }));
    } else if (randomEvents[0].includes('日差し')) {
      processedPlants = processedPlants.map(plant => ({
        ...plant,
        stats: { ...plant.stats, sunlightLevel: Math.min(100, plant.stats.sunlightLevel + 20) }
      }));
    } else if (randomEvents[0].includes('害虫')) {
      processedPlants = processedPlants.map(plant => ({
        ...plant,
        stats: { ...plant.stats, health: Math.max(0, plant.stats.health - 10) }
      }));
    } else if (randomEvents[0].includes('肥沃')) {
      processedPlants = processedPlants.map(plant => ({
        ...plant,
        stats: { ...plant.stats, nutrientLevel: Math.min(100, plant.stats.nutrientLevel + 20) }
      }));
    }
  }
  
  // 天候の効果を適用
  if (newWeather === 'rainy') {
    processedPlants = processedPlants.map(plant => ({
      ...plant,
      stats: { 
        ...plant.stats, 
        waterLevel: Math.min(100, plant.stats.waterLevel + 10),
        sunlightLevel: Math.max(0, plant.stats.sunlightLevel - 5)
      }
    }));
  } else if (newWeather === 'sunny') {
    processedPlants = processedPlants.map(plant => ({
      ...plant,
      stats: { 
        ...plant.stats, 
        sunlightLevel: Math.min(100, plant.stats.sunlightLevel + 10),
        waterLevel: Math.max(0, plant.stats.waterLevel - 5)
      }
    }));
  }
  
  // 条件を更新
  processedPlants = processedPlants.map(plant => ({
    ...plant,
    condition: updatePlantCondition(plant)
  }));
  
  // 実績の更新
  const updatedState = {
    ...gameState,
    currentTurn: gameState.currentTurn + 1,
    plants: processedPlants,
    actionsRemaining: gameState.actionsPerTurn,
    weather: newWeather,
    randomEvents
  };
  
  // 熟練の庭師の実績を更新
  const gardenerAchievement = updatedState.player.achievements.find(a => a.id === 'achievement_gardener');
  if (gardenerAchievement && !gardenerAchievement.completed) {
    gardenerAchievement.progress = updatedState.careActionCount || 0;
    if (gardenerAchievement.progress >= gardenerAchievement.goal) {
      gardenerAchievement.completed = true;
    }
  }
  
  // 収穫王の実績を更新
  const harvestAchievement = updatedState.player.achievements.find(a => a.id === 'achievement_harvest_king');
  if (harvestAchievement && !harvestAchievement.completed) {
    harvestAchievement.progress = updatedState.harvestCount || 0;
    if (harvestAchievement.progress >= harvestAchievement.goal) {
      harvestAchievement.completed = true;
    }
  }
  
  return updatedState;
};

// 植物の1ターン分の処理
const processTurnForPlant = (plant: Plant): Plant => {
  // 死んでいる植物は処理しない
  if (plant.condition === PlantCondition.DEAD) {
    return plant;
  }
  
  // 現在の状態をコピー
  const updatedStats = { ...plant.stats };
  let updatedStage = plant.currentStage;
  
  // 各ステータスの自然減少
  updatedStats.waterLevel = Math.max(0, updatedStats.waterLevel - 5);
  updatedStats.nutrientLevel = Math.max(0, updatedStats.nutrientLevel - 3);
  updatedStats.sunlightLevel = Math.max(0, updatedStats.sunlightLevel - 4);
  
  // 条件が悪い場合は健康度が下がる
  const waterDiff = Math.abs(updatedStats.waterLevel - plant.requirements.waterNeed * 10);
  const nutrientDiff = Math.abs(updatedStats.nutrientLevel - plant.requirements.nutrientNeed * 10);
  const sunlightDiff = Math.abs(updatedStats.sunlightLevel - plant.requirements.sunlightNeed * 10);
  
  if (waterDiff > 30 || nutrientDiff > 30 || sunlightDiff > 30) {
    updatedStats.health = Math.max(0, updatedStats.health - 5);
  }
  
  // 条件が良い場合は成長が進む
  if (waterDiff < 20 && nutrientDiff < 20 && sunlightDiff < 20 && updatedStats.health > 50) {
    // 成長速度を調整 - より速く成長するように
    updatedStats.growthProgress += plant.requirements.growthRate * 5;
    console.log(`植物 ${plant.name} の成長進捗: ${updatedStats.growthProgress}%`);
  }
  
  // 成長段階の更新
  if (updatedStats.growthProgress >= 100) {
    console.log(`植物 ${plant.name} の成長段階を更新します。現在の段階: ${updatedStage}`);
    
    // 成長段階を進める
    if (updatedStage === GrowthStage.SEED) {
      updatedStage = GrowthStage.SPROUT;
      updatedStats.growthProgress = 0;
      console.log(`植物 ${plant.name} が発芽しました！`);
    } 
    else if (updatedStage === GrowthStage.SPROUT) {
      updatedStage = GrowthStage.GROWING;
      updatedStats.growthProgress = 0;
      console.log(`植物 ${plant.name} が成長中になりました！`);
    } 
    else if (updatedStage === GrowthStage.GROWING) {
      updatedStage = GrowthStage.MATURE;
      updatedStats.growthProgress = 0;
      console.log(`植物 ${plant.name} が成熟しました！`);
    } 
    else if (updatedStage === GrowthStage.MATURE) {
      updatedStage = GrowthStage.FLOWERING;
      updatedStats.growthProgress = 0;
      console.log(`植物 ${plant.name} が開花しました！`);
    } 
    else if (updatedStage === GrowthStage.FLOWERING) {
      updatedStage = GrowthStage.FRUITING;
      updatedStats.growthProgress = 100; // 最終段階では100%のままにする
      console.log(`植物 ${plant.name} が実をつけました！`);
    }
    
    console.log(`植物 ${plant.name} の新しい成長段階: ${updatedStage}`);
  }
  
  // 更新された植物を返す
  const updatedPlant = {
    ...plant,
    stats: updatedStats,
    currentStage: updatedStage,
    turnsAlive: plant.turnsAlive + 1,
  };
  
  // 条件の更新
  updatedPlant.condition = updatePlantCondition(updatedPlant);
  
  return updatedPlant;
};
