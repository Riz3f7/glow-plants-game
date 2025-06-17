// initialData.ts - ゲームの初期データ

import { Plant, GrowthStage, createNewPlant } from '../models/Plant';
import { GameItem, Achievement } from '../models/Game';

// 初期植物データ
export const initialPlants: Plant[] = [
  createNewPlant(
    'plant_1',
    'サニーフラワー',
    'Helianthus simplex',
    'とても明るい場所を好む、太陽の光をたくさん浴びると元気に育つ花です。',
    {
      waterNeed: 5,
      sunlightNeed: 9,
      nutrientNeed: 4,
      growthRate: 5,
      turnsToNextStage: 3,
    },
    '/assets/images/output/output/sunnyflower_mature.png'
  ),
  createNewPlant(
    'plant_2',
    'モイストファーン',
    'Pteridophyta aqua',
    '湿度の高い環境を好む、水をたくさん与えると元気に育つシダ植物です。',
    {
      waterNeed: 9,
      sunlightNeed: 3,
      nutrientNeed: 5,
      growthRate: 4,
      turnsToNextStage: 4,
    },
    '/assets/images/output/output/moistfern_mature.png'
  ),
  createNewPlant(
    'plant_3',
    'ニュートリブッシュ',
    'Nutriens maxima',
    '栄養豊富な土壌を好む、肥料をたくさん与えると元気に育つ低木です。',
    {
      waterNeed: 4,
      sunlightNeed: 6,
      nutrientNeed: 9,
      growthRate: 3,
      turnsToNextStage: 5,
    },
    '/assets/images/output/output/nutribush_mature.png'
  ),
  createNewPlant(
    'plant_4',
    'ムーンリリー',
    'Lilium lunaris',
    '夜に美しく輝く、涼しい環境を好む神秘的な花です。',
    {
      waterNeed: 7,
      sunlightNeed: 2,
      nutrientNeed: 6,
      growthRate: 3,
      turnsToNextStage: 4,
    },
    '/assets/images/output/output/moonlily_mature.png'
  ),
  createNewPlant(
    'plant_5',
    'ファイアペタル',
    'Ignis floris',
    '暑い環境を好み、鮮やかな炎のような花を咲かせる珍しい植物です。',
    {
      waterNeed: 3,
      sunlightNeed: 10,
      nutrientNeed: 7,
      growthRate: 6,
      turnsToNextStage: 3,
    },
    '/assets/images/output/output/firepetal_mature.png'
  ),
];

// 初期アイテムデータ
export const initialItems: GameItem[] = [
  {
    id: 'item_watering_can',
    name: 'じょうろ',
    description: '植物に水を与えます。水分レベルが上昇します。',
    imageUrl: '/assets/images/output/watering_icon.png',
    effect: {
      type: 'water',
      value: 30,
    },
    quantity: 5,
    price: 10,
    unlocked: true,
  },
  {
    id: 'item_fertilizer',
    name: '肥料',
    description: '植物に栄養を与えます。栄養レベルが上昇します。',
    imageUrl: '/assets/images/output/fertilizer_icon.png',
    effect: {
      type: 'nutrient',
      value: 30,
    },
    quantity: 3,
    price: 15,
    unlocked: true,
  },
  {
    id: 'item_sunlamp',
    name: '日光ランプ',
    description: '植物に光を当てます。日光レベルが上昇します。',
    imageUrl: '/assets/images/output/sunlight_icon.png',
    effect: {
      type: 'sunlight',
      value: 30,
    },
    quantity: 2,
    price: 20,
    unlocked: true,
  },
  {
    id: 'item_plant_medicine',
    name: '植物用薬',
    description: '植物の健康を回復させます。',
    imageUrl: '/assets/images/output/fertilizer_icon.png',
    effect: {
      type: 'health',
      value: 50,
    },
    quantity: 1,
    price: 30,
    unlocked: true,
  },
  {
    id: 'item_growth_booster',
    name: '成長促進剤',
    description: '植物の成長を促進します。',
    imageUrl: '/assets/images/output/fertilizer_icon.png',
    effect: {
      type: 'growth',
      value: 20,
    },
    quantity: 0,
    price: 50,
    unlocked: false,
  },
  {
    id: 'item_premium_water',
    name: 'プレミアムウォーター',
    description: '高品質な水で、植物の水分レベルを大幅に上昇させます。',
    imageUrl: '/assets/images/output/watering_icon.png',
    effect: {
      type: 'water',
      value: 60,
    },
    quantity: 0,
    price: 40,
    unlocked: false,
  },
  {
    id: 'item_super_fertilizer',
    name: 'スーパー肥料',
    description: '高濃度の栄養素を含み、植物の栄養レベルを大幅に上昇させます。',
    imageUrl: '/assets/images/output/fertilizer_icon.png',
    effect: {
      type: 'nutrient',
      value: 60,
    },
    quantity: 0,
    price: 45,
    unlocked: false,
  },
  {
    id: 'item_growth_miracle',
    name: '成長の奇跡',
    description: '植物の成長を劇的に促進する特殊な薬剤です。',
    imageUrl: '/assets/images/output/fertilizer_icon.png',
    effect: {
      type: 'growth',
      value: 50,
    },
    quantity: 0,
    price: 100,
    unlocked: false,
  },
];

// 初期実績データ
export const initialAchievements: Achievement[] = [
  {
    id: 'achievement_first_plant',
    name: '初めての植物',
    description: '最初の植物を育てましょう',
    completed: false,
    reward: {
      type: 'currency',
      value: 50,
    },
    progress: 0,
    goal: 1,
  },
  {
    id: 'achievement_plant_collector',
    name: 'コレクター',
    description: '3種類の植物を育てましょう',
    completed: false,
    reward: {
      type: 'currency',
      value: 100,
    },
    progress: 0,
    goal: 3,
  },
  {
    id: 'achievement_green_thumb',
    name: 'グリーンサム',
    description: '植物を完全に成長させましょう',
    completed: false,
    reward: {
      type: 'item',
      value: 1,
      itemId: 'item_growth_booster',
    },
    progress: 0,
    goal: 1,
  },
  {
    id: 'achievement_plant_master',
    name: '植物マスター',
    description: '10ターン以上植物を生かし続けましょう',
    completed: false,
    reward: {
      type: 'experience',
      value: 200,
    },
    progress: 0,
    goal: 10,
  },
  {
    id: 'achievement_botanist',
    name: '植物学者',
    description: 'すべての種類の植物を発見しましょう',
    completed: false,
    reward: {
      type: 'item',
      value: 1,
      itemId: 'item_growth_miracle',
    },
    progress: 0,
    goal: 5,
  },
  {
    id: 'achievement_gardener',
    name: '熟練の庭師',
    description: '植物を20回世話しましょう',
    completed: false,
    reward: {
      type: 'currency',
      value: 200,
    },
    progress: 0,
    goal: 20,
  },
  {
    id: 'achievement_harvest_king',
    name: '収穫王',
    description: '5回植物を収穫しましょう',
    completed: false,
    reward: {
      type: 'item',
      value: 2,
      itemId: 'item_super_fertilizer',
    },
    progress: 0,
    goal: 5,
  },
];

// 植物の成長段階ごとの画像マッピング
export const growthStageImages = {
  'seed': '/assets/images/output/output/seed_stage.png',
  'sprout': '/assets/images/output/output/sprout_stage.png',
  'growing': '/assets/images/output/output/growing_stage.png',
  'mature': '/assets/images/output/output/mature_stage.png',
  'flowering': '/assets/images/output/output/flowering_stage.png',
  'fruiting': '/assets/images/output/output/fruiting_stage.png',
};
