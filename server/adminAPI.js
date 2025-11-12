let FLAGS = {
  ENABLE_PAYOUTS: true,
  ENABLE_GUIDE_RANKING: true,
  SHOW_GUIDE_REAL_NAME_TO_STORE: false
};

let WEIGHTS = { 
  sent: 0.4, 
  views: 0.3, 
  rating: 0.2, 
  retention: 0.1 
};

let TOP_POLICY = { 
  showRealName: false, 
  topN: 3 
};

const RANK_DEFINITIONS = [
  { name: 'Bronze', minScore: 0, bonusRate: 0.0000, maxStores: 20 },
  { name: 'Silver', minScore: 60, bonusRate: 0.0500, maxStores: 50 },
  { name: 'Gold', minScore: 120, bonusRate: 0.1000, maxStores: 100 },
  { name: 'Platinum', minScore: 200, bonusRate: 0.1500, maxStores: 100 }
];

class AdminAPIService {
  getFlags() {
    return FLAGS;
  }

  updateFlags(newFlags) {
    FLAGS = { ...FLAGS, ...newFlags };
    return FLAGS;
  }

  getWeights() {
    return WEIGHTS;
  }

  updateWeights(newWeights) {
    WEIGHTS = { ...WEIGHTS, ...newWeights };
    return WEIGHTS;
  }

  getTopGuidesPolicy() {
    return TOP_POLICY;
  }

  updateTopGuidesPolicy(newPolicy) {
    TOP_POLICY = { ...TOP_POLICY, ...newPolicy };
    return TOP_POLICY;
  }

  getRanks() {
    return RANK_DEFINITIONS.sort((a, b) => a.minScore - b.minScore);
  }

  updateRanks(ranks) {
    const ranksArray = Array.isArray(ranks) ? ranks : [ranks];
    
    ranksArray.forEach(rank => {
      const index = RANK_DEFINITIONS.findIndex(r => r.name === rank.name);
      if (index >= 0) {
        RANK_DEFINITIONS[index] = {
          ...RANK_DEFINITIONS[index],
          ...rank
        };
      } else {
        RANK_DEFINITIONS.push({
          name: rank.name,
          minScore: rank.minScore,
          bonusRate: rank.bonusRate,
          maxStores: rank.maxStores || 100
        });
      }
    });
    
    return RANK_DEFINITIONS.sort((a, b) => a.minScore - b.minScore);
  }

  deleteRank(rankName) {
    const index = RANK_DEFINITIONS.findIndex(r => r.name === rankName);
    if (index >= 0) {
      RANK_DEFINITIONS.splice(index, 1);
      return { ok: true };
    }
    return { ok: false, error: 'Rank not found' };
  }

  rankFromScore(score) {
    const sorted = RANK_DEFINITIONS.sort((a, b) => a.minScore - b.minScore);
    let current = sorted[0];
    
    for (const rank of sorted) {
      if (score >= rank.minScore) {
        current = rank;
      } else {
        break;
      }
    }
    
    return {
      name: current.name,
      bonusRate: current.bonusRate,
      minScore: current.minScore,
      maxStores: current.maxStores
    };
  }
}

module.exports = { adminAPIService: new AdminAPIService() };
