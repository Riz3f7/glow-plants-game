'use client';

import React from 'react';
import Image from 'next/image';
import { Plant, GrowthStage, PlantCondition } from '../models/Plant';

interface PlantCardProps {
  plant: Plant;
  onWater: () => void;
  onFertilize: () => void;
  onSunlight: () => void;
  onHarvest: () => void;
  actionsRemaining: number;
}

const PlantCard: React.FC<PlantCardProps> = ({
  plant,
  onWater,
  onFertilize,
  onSunlight,
  onHarvest,
  actionsRemaining,
}) => {
  // 収穫可能かどうか
  const canHarvest = plant.currentStage === GrowthStage.FRUITING;
  
  // 成長段階のテキスト
  const stageText = {
    [GrowthStage.SEED]: '種',
    [GrowthStage.SPROUT]: '芽',
    [GrowthStage.GROWING]: '成長中',
    [GrowthStage.MATURE]: '成熟',
    [GrowthStage.FLOWERING]: '開花',
    [GrowthStage.FRUITING]: '結実',
  };
  
  // 植物の状態に応じた情報
  const conditionInfo = {
    [PlantCondition.EXCELLENT]: {
      text: '絶好調',
      icon: '✨',
      color: 'text-green-800',
      bgColor: 'bg-green-100',
      growthMultiplier: '2.0倍'
    },
    [PlantCondition.GOOD]: {
      text: '良好',
      icon: '😊',
      color: 'text-blue-800',
      bgColor: 'bg-blue-100',
      growthMultiplier: '1.5倍'
    },
    [PlantCondition.NORMAL]: {
      text: '普通',
      icon: '😐',
      color: 'text-gray-800',
      bgColor: 'bg-gray-100',
      growthMultiplier: '1.0倍'
    },
    [PlantCondition.POOR]: {
      text: '不調',
      icon: '😟',
      color: 'text-yellow-800',
      bgColor: 'bg-yellow-100',
      growthMultiplier: '0.7倍'
    },
    [PlantCondition.CRITICAL]: {
      text: '危険',
      icon: '😨',
      color: 'text-red-800',
      bgColor: 'bg-red-100',
      growthMultiplier: '0.3倍'
    },
    [PlantCondition.DEAD]: {
      text: '枯れた',
      icon: '💀',
      color: 'text-gray-800',
      bgColor: 'bg-gray-200',
      growthMultiplier: '0倍'
    },
  };
  
  // 成長段階に応じた画像を取得
  const getPlantImage = () => {
    console.log(`植物 ${plant.name} の現在の成長段階: ${plant.currentStage}`);
    
    // 死んでいる場合は枯れた画像を表示
    if (plant.condition === PlantCondition.DEAD) {
      return '/assets/images/output/output/dead_plant.png';
    }
    
    // 成長段階に応じた画像を返す
    if (plant.currentStage === GrowthStage.SEED) {
      return '/assets/images/output/output/seed_stage.png';
    }
    
    if (plant.currentStage === GrowthStage.SPROUT) {
      return '/assets/images/output/output/sprout_stage.png';
    }
    
    if (plant.currentStage === GrowthStage.GROWING) {
      return '/assets/images/output/output/growing_stage.png';
    }
    
    if (plant.currentStage === GrowthStage.MATURE) {
      // 特定の植物の場合は専用画像を返す
      if (plant.name === 'サニーフラワー') {
        return '/assets/images/output/output/sunnyflower_mature.png';
      }
      if (plant.name === 'モイストファーン') {
        return '/assets/images/output/output/moistfern_mature.png';
      }
      if (plant.name === 'ニュートリブッシュ') {
        return '/assets/images/output/output/nutribush_mature.png';
      }
      if (plant.name === 'ムーンリリー') {
        return '/assets/images/output/output/moonlily_mature.png';
      }
      if (plant.name === 'ファイアペタル') {
        return '/assets/images/output/output/firepetal_mature.png';
      }
      return '/assets/images/output/output/mature_stage.png';
    }
    
    if (plant.currentStage === GrowthStage.FLOWERING) {
      return '/assets/images/output/output/flowering_stage.png';
    }
    
    if (plant.currentStage === GrowthStage.FRUITING) {
      return '/assets/images/output/output/fruiting_stage.png';
    }
    
    // デフォルトの画像
    return plant.imageUrl;
  };
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '15px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      border: `3px solid ${plant.condition === PlantCondition.DEAD ? '#e0e0e0' : '#e8f5e9'}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div style={{
          width: '70px',
          height: '70px',
          marginRight: '15px',
          borderRadius: '50%',
          backgroundColor: '#f1f8e9',
          border: '2px solid #c5e1a5',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative'
        }}>
          <Image
            src={getPlantImage()}
            alt={plant.name}
            width={60}
            height={60}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#2e7d32',
            margin: '0 0 5px 0'
          }}>{plant.name}</h3>
          <p style={{
            fontSize: '12px',
            color: '#666',
            fontStyle: 'italic',
            margin: '0 0 5px 0'
          }}>{plant.species}</p>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '2px 8px',
            borderRadius: '10px',
            backgroundColor: conditionInfo[plant.condition].bgColor,
            color: conditionInfo[plant.condition].color,
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            <span style={{ marginRight: '4px' }}>{conditionInfo[plant.condition].icon}</span>
            {conditionInfo[plant.condition].text}
            <span style={{ 
              marginLeft: '5px', 
              fontSize: '10px', 
              backgroundColor: 'rgba(255,255,255,0.5)', 
              padding: '1px 4px', 
              borderRadius: '4px' 
            }}>
              成長率 {conditionInfo[plant.condition].growthMultiplier}
            </span>
          </div>
        </div>
      </div>

      <p style={{
        fontSize: '13px',
        color: '#555',
        backgroundColor: '#f9f9f9',
        padding: '10px',
        borderRadius: '8px',
        marginBottom: '15px',
        fontStyle: 'italic',
        border: '1px solid #eee'
      }}>{plant.description}</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #bbdefb'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <span style={{ fontSize: '14px', marginRight: '5px' }}>💧</span>
            <p style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#1976d2',
              margin: 0
            }}>水分</p>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${plant.stats.waterLevel}%`,
                height: '100%',
                backgroundColor: '#2196f3',
                borderRadius: '4px'
              }}
            ></div>
          </div>
        </div>
        <div style={{
          backgroundColor: '#fffde7',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #fff9c4'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <span style={{ fontSize: '14px', marginRight: '5px' }}>☀️</span>
            <p style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#f57f17',
              margin: 0
            }}>日光</p>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${plant.stats.sunlightLevel}%`,
                height: '100%',
                backgroundColor: '#fdd835',
                borderRadius: '4px'
              }}
            ></div>
          </div>
        </div>
        <div style={{
          backgroundColor: '#e8f5e9',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #c8e6c9'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <span style={{ fontSize: '14px', marginRight: '5px' }}>🌿</span>
            <p style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#388e3c',
              margin: 0
            }}>栄養</p>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${plant.stats.nutrientLevel}%`,
                height: '100%',
                backgroundColor: '#4caf50',
                borderRadius: '4px'
              }}
            ></div>
          </div>
        </div>
        <div style={{
          backgroundColor: '#ffebee',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid #ffcdd2'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '5px'
          }}>
            <span style={{ fontSize: '14px', marginRight: '5px' }}>❤️</span>
            <p style={{
              fontSize: '12px',
              fontWeight: 'bold',
              color: '#d32f2f',
              margin: 0
            }}>健康</p>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${plant.stats.health}%`,
                height: '100%',
                backgroundColor: '#f44336',
                borderRadius: '4px'
              }}
            ></div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '5px'
        }}>
          <p style={{
            fontSize: '13px',
            fontWeight: 'bold',
            color: '#7b1fa2',
            margin: 0,
            display: 'flex',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '14px', marginRight: '5px' }}>🌱</span>
            成長段階: {stageText[plant.currentStage]}
          </p>
          <p style={{
            fontSize: '11px',
            color: '#757575',
            margin: 0
          }}>{plant.stats.growthProgress}%</p>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div
            style={{
              width: `${plant.stats.growthProgress}%`,
              height: '100%',
              backgroundColor: '#9c27b0',
              borderRadius: '4px'
            }}
          ></div>
        </div>
      </div>
      
      {/* ケアなしのターン数を表示 */}
      {plant.turnsWithoutCare && plant.turnsWithoutCare > 0 && (
        <div style={{
          backgroundColor: plant.turnsWithoutCare >= 3 ? '#ffebee' : '#fff8e1',
          padding: '5px 10px',
          borderRadius: '8px',
          marginBottom: '10px',
          fontSize: '12px',
          fontWeight: 'bold',
          color: plant.turnsWithoutCare >= 3 ? '#d32f2f' : '#ff9800',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{ marginRight: '5px' }}>⚠️</span>
          {plant.turnsWithoutCare >= 3 
            ? `${plant.turnsWithoutCare}ターン世話されていません！健康度が急速に低下中！` 
            : `${plant.turnsWithoutCare}ターン世話されていません`}
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px'
      }}>
        <button
          onClick={onWater}
          disabled={actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD}
          style={{
            backgroundColor: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? '#e0e0e0' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 0',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 0.6 : 1,
            boxShadow: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <span style={{ marginRight: '5px' }}>💧</span>
          水やり
        </button>
        <button
          onClick={onFertilize}
          disabled={actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD}
          style={{
            backgroundColor: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? '#e0e0e0' : '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 0',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 0.6 : 1,
            boxShadow: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <span style={{ marginRight: '5px' }}>🌿</span>
          肥料
        </button>
        <button
          onClick={onSunlight}
          disabled={actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD}
          style={{
            backgroundColor: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? '#e0e0e0' : '#ffc107',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 0',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 0.6 : 1,
            boxShadow: actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <span style={{ marginRight: '5px' }}>☀️</span>
          日光浴
        </button>
        <button
          onClick={onHarvest}
          disabled={!canHarvest || actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD}
          style={{
            backgroundColor: !canHarvest || actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? '#e0e0e0' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 0',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: !canHarvest || actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: !canHarvest || actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 0.6 : 1,
            boxShadow: !canHarvest || actionsRemaining <= 0 || plant.condition === PlantCondition.DEAD ? 'none' : '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}
        >
          <span style={{ marginRight: '5px' }}>🍎</span>
          収穫
        </button>
      </div>
    </div>
  );
};

export default PlantCard;
