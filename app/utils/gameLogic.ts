// gameLogic.ts - ゲームのコアロジック

import { Plant, GrowthStage, PlantCondition, updatePlantCondition } from '../models/Plant';
import { GameState, Player, addExperience } from '../models/Game';

// 植物に水をやる
export const waterPlant = (plant: Plant): Plant => {
  const updatedStats = { ...plant.stats };
  updatedStats.waterLevel = Math.min(100, updatedStats.waterLevel + 30);
  
  // 水が多すぎる場合は健康度が下がる
  if (updatedStats.waterLevel > 90 && plant.requirements.waterNeed < 7) {
    updatedStats.health = Math.max(0, updatedStats.health - 10);
  }
  
  const updatedPlant = { 
    ...plant, 
    stats: updatedStats,
    turnsWithoutCare: 0 // ケアをしたのでリセット
  };
  updatedPlant.condition = updatePlantCondition(updatedPlant);
  
  return updatedPlant;
};

// 植物に肥料をやる
export const fertilizePlant = (plant: Plant): Plant => {
  const updatedStats = { ...plant.stats };
  updatedStats.nutrientLevel = Math.min(100, updatedStats.nutrientLevel + 30);
  
  // 肥料が多すぎる場合は健康度が下がる
  if (updatedStats.nutrientLevel > 90 && plant.requirements.nutrientNeed < 7) {
    updatedStats.health = Math.max(0, updatedStats.health - 10);
  }
  
  const updatedPlant = { 
    ...plant, 
    stats: updatedStats,
    turnsWithoutCare: 0 // ケアをしたのでリセット
  };
  updatedPlant.condition = updatePlantCondition(updatedPlant);
  
  return updatedPlant;
};

// 植物に日光を当てる
export const giveSunlight = (plant: Plant): Plant => {
  const updatedStats = { ...plant.stats };
  updatedStats.sunlightLevel = Math.min(100, updatedStats.sunlightLevel + 30);
  
  // 日光が多すぎる場合は健康度が下がる
  if (updatedStats.sunlightLevel > 90 && plant.requirements.sunlightNeed < 7) {
    updatedStats.health = Math.max(0, updatedStats.health - 10);
  }
  
  const updatedPlant = { 
    ...plant, 
    stats: updatedStats,
    turnsWithoutCare: 0 // ケアをしたのでリセット
  };
  updatedPlant.condition = updatePlantCondition(updatedPlant);
  
  return updatedPlant;
};

// 植物を収穫する
export const harvestPlant = (plant: Plant, player: Player): { plant: Plant | null, player: Player, message?: string, levelUpMessage?: string } => {
  // 収穫可能な状態かチェック
  if (plant.currentStage !== GrowthStage.FRUITING) {
    return { plant, player }; // 収穫できない場合は何も変更しない
  }
  
  // 収穫による報酬計算
  const rewardMultiplier = plant.condition === PlantCondition.EXCELLENT ? 3 :
                          plant.condition === PlantCondition.GOOD ? 2 :
                          plant.condition === PlantCondition.NORMAL ? 1 :
                          plant.condition === PlantCondition.POOR ? 0.7 : 0.5;
  
  const experienceReward = Math.floor(50 * rewardMultiplier);
  const currencyReward = Math.floor(30 * rewardMultiplier);
  
  // 経験値と通貨を追加
  const { player: updatedPlayer, levelUpMessage } = addExperience(player, experienceReward);
  updatedPlayer.currency += currencyReward;
  
  // 収穫成功メッセージを作成
  const conditionText = plant.condition === PlantCondition.EXCELLENT ? '最高品質の' :
                       plant.condition === PlantCondition.GOOD ? '良質な' :
                       plant.condition === PlantCondition.NORMAL ? '' :
                       plant.condition === PlantCondition.POOR ? '品質の低い' : '品質の悪い';
  
  const celebrationMessage = `🎉 ${plant.name}を収穫しました！ ${conditionText}収穫で${experienceReward}経験値と${currencyReward}Gを獲得！`;
  
  // 収穫後は植物がなくなる
  return { 
    plant: null, 
    player: updatedPlayer,
    message: celebrationMessage,
    levelUpMessage
  };
};

// ターン終了時の処理
export const endTurn = (gameState: GameState): GameState => {
  // 最大ターン数を超えた場合は現在の状態を返す（ゲーム終了）
  if (gameState.currentTurn >= gameState.maxTurns) {
    return gameState;
  }

  const updatedPlants = gameState.plants.map(plant => processTurnForPlant(plant));
  
  // 天候の変化（ランダム）
  const weatherOptions: ('sunny' | 'cloudy' | 'rainy')[] = ['sunny', 'cloudy', 'rainy'];
  const newWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  
  // ランダムイベントの生成（15%の確率に増加）
  const randomEvents: string[] = [];
  if (Math.random() < 0.15) {
    const possibleEvents = [
      '突然の雨が降り、すべての植物の水分レベルが上昇しました！',
      '強い日差しにより、すべての植物の日光レベルが上昇しました！',
      '害虫の発生により、一部の植物の健康状態が悪化しました。',
      '肥沃な土壌により、すべての植物の栄養レベルが上昇しました！',
      '強風により、植物の健康状態が少し低下しました。',
      '温暖な気候により、植物の成長が促進されました！'
    ];
    randomEvents.push(possibleEvents[Math.floor(Math.random() * possibleEvents.length)]);
  }
  
  // ランダムイベントの効果を適用
  let processedPlants = updatedPlants;
  if (randomEvents.length > 0) {
    if (randomEvents[0].includes('雨')) {
      processedPlants = processedPlants.map(plant => ({
        ...plant,
        stats: { ...plant.stats, waterLevel: Math.min(100, plant.stats.waterLevel + 25) }
      }));
    } else if (randomEvents[0].includes('日差し')) {
      processedPlants = processedPlants.map(plant => ({
        ...plant,
        stats: { ...plant.stats, sunlightLevel: Math.min(100, plant.stats.sunlightLevel + 25) }
      }));
    } else if (randomEvents[0].includes('害虫')) {
      processedPlants = processedPlants.map(plant => ({
        ...plant,
        stats: { ...plant.stats, health: Math.max(0, plant.stats.health - 15) }
      }));
    } else if (randomEvents[0].includes('肥沃')) {
      processedPlants = processedPlants.map(plant => ({
        ...plant,
        stats: { ...plant.stats, nutrientLevel: Math.min(100, plant.stats.nutrientLevel + 25) }
      }));
    } else if (randomEvents[0].includes('強風')) {
      processedPlants = processedPlants.map(plant => ({
        ...plant,
        stats: { ...plant.stats, health: Math.max(0, plant.stats.health - 10) }
      }));
    } else if (randomEvents[0].includes('温暖')) {
      processedPlants = processedPlants.map(plant => ({
        ...plant,
        stats: { 
          ...plant.stats, 
          growthProgress: Math.min(100, plant.stats.growthProgress + 15)
        }
      }));
    }
  }
  
  // 天候の効果を適用
  if (newWeather === 'rainy') {
    processedPlants = processedPlants.map(plant => ({
      ...plant,
      stats: { 
        ...plant.stats, 
        waterLevel: Math.min(100, plant.stats.waterLevel + 15),
        sunlightLevel: Math.max(0, plant.stats.sunlightLevel - 10)
      }
    }));
  } else if (newWeather === 'sunny') {
    processedPlants = processedPlants.map(plant => ({
      ...plant,
      stats: { 
        ...plant.stats, 
        sunlightLevel: Math.min(100, plant.stats.sunlightLevel + 15),
        waterLevel: Math.max(0, plant.stats.waterLevel - 10)
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
  
  // ケアなしのターン数を増加
  const turnsWithoutCare = (plant.turnsWithoutCare || 0) + 1;
  
  // 各ステータスの自然減少（より急激に減少するように調整）
  updatedStats.waterLevel = Math.max(0, updatedStats.waterLevel - 8);
  updatedStats.nutrientLevel = Math.max(0, updatedStats.nutrientLevel - 6);
  updatedStats.sunlightLevel = Math.max(0, updatedStats.sunlightLevel - 7);
  
  // 条件が悪い場合は健康度が下がる（より急激に）
  const waterDiff = Math.abs(updatedStats.waterLevel - plant.requirements.waterNeed * 10);
  const nutrientDiff = Math.abs(updatedStats.nutrientLevel - plant.requirements.nutrientNeed * 10);
  const sunlightDiff = Math.abs(updatedStats.sunlightLevel - plant.requirements.sunlightNeed * 10);
  
  if (waterDiff > 30 || nutrientDiff > 30 || sunlightDiff > 30) {
    updatedStats.health = Math.max(0, updatedStats.health - 10);
  }
  
  // 3ターン以上ケアがない場合、健康度が急激に低下
  if (turnsWithoutCare >= 3) {
    updatedStats.health = Math.max(0, updatedStats.health - 15);
    console.log(`植物 ${plant.name} は${turnsWithoutCare}ターン世話されていません！健康度が低下しています。`);
  }
  
  // 植物の状態に応じて成長率を変更
  let growthMultiplier = 1.0;
  
  if (waterDiff < 20 && nutrientDiff < 20 && sunlightDiff < 20 && updatedStats.health > 50) {
    // 条件が良い場合は成長が進む
    // 植物の状態に応じて成長率を変更
    if (plant.condition === PlantCondition.EXCELLENT) {
      growthMultiplier = 2.0; // 絶好調なら成長率2倍
      console.log(`植物 ${plant.name} は絶好調！成長率が2倍になります。`);
    } else if (plant.condition === PlantCondition.GOOD) {
      growthMultiplier = 1.5; // 良好なら成長率1.5倍
      console.log(`植物 ${plant.name} は良好！成長率が1.5倍になります。`);
    } else if (plant.condition === PlantCondition.POOR) {
      growthMultiplier = 0.7; // 不調なら成長率0.7倍
      console.log(`植物 ${plant.name} は不調...成長率が0.7倍になります。`);
    } else if (plant.condition === PlantCondition.CRITICAL) {
      growthMultiplier = 0.3; // 危険なら成長率0.3倍
      console.log(`植物 ${plant.name} は危険な状態！成長率が0.3倍になります。`);
    }
    
    // 成長速度を調整 - より速く成長するように
    updatedStats.growthProgress += plant.requirements.growthRate * 10 * growthMultiplier;
    console.log(`植物 ${plant.name} の成長進捗: ${updatedStats.growthProgress}%`);
  }
  
  // 成長段階の更新
  let growthMessage: string | undefined = undefined;
  if (updatedStats.growthProgress >= 100) {
    console.log(`植物 ${plant.name} の成長段階を更新します。現在の段階: ${updatedStage}`);
    
    // 成長段階を進める
    if (updatedStage === GrowthStage.SEED) {
      updatedStage = GrowthStage.SPROUT;
      updatedStats.growthProgress = 0;
      growthMessage = `🌱 ${plant.name}が発芽しました！`;
      console.log(`植物 ${plant.name} が発芽しました！`);
    } 
    else if (updatedStage === GrowthStage.SPROUT) {
      updatedStage = GrowthStage.GROWING;
      updatedStats.growthProgress = 0;
      growthMessage = `🌿 ${plant.name}が成長中になりました！`;
      console.log(`植物 ${plant.name} が成長中になりました！`);
    } 
    else if (updatedStage === GrowthStage.GROWING) {
      updatedStage = GrowthStage.MATURE;
      updatedStats.growthProgress = 0;
      growthMessage = `🌳 ${plant.name}が成熟しました！`;
      console.log(`植物 ${plant.name} が成熟しました！`);
    } 
    else if (updatedStage === GrowthStage.MATURE) {
      updatedStage = GrowthStage.FLOWERING;
      updatedStats.growthProgress = 0;
      growthMessage = `🌸 ${plant.name}が開花しました！美しい花が咲きました！`;
      console.log(`植物 ${plant.name} が開花しました！`);
    } 
    else if (updatedStage === GrowthStage.FLOWERING) {
      updatedStage = GrowthStage.FRUITING;
      updatedStats.growthProgress = 100; // 最終段階では100%のままにする
      growthMessage = `🍎 ${plant.name}に実がなりました！収穫できます！`;
      console.log(`植物 ${plant.name} が実をつけました！`);
    }
    
    console.log(`植物 ${plant.name} の新しい成長段階: ${updatedStage}`);
  }
  
  // 健康度が0になると植物が枯れる
  if (updatedStats.health <= 0) {
    console.log(`植物 ${plant.name} が枯れてしまいました...`);
    return {
      ...plant,
      stats: updatedStats,
      currentStage: updatedStage,
      turnsAlive: plant.turnsAlive + 1,
      turnsWithoutCare: turnsWithoutCare,
      condition: PlantCondition.DEAD,
      growthMessage: `💀 ${plant.name}が枯れてしまいました...`
    };
  }
  
  // 更新された植物を返す
  const updatedPlant = {
    ...plant,
    stats: updatedStats,
    currentStage: updatedStage,
    turnsAlive: plant.turnsAlive + 1,
    turnsWithoutCare: turnsWithoutCare,
    growthMessage: growthMessage
  };
  
  // 条件の更新
  updatedPlant.condition = updatePlantCondition(updatedPlant);
  
  return updatedPlant;
};
