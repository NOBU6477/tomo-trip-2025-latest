const { drizzle } = require('drizzle-orm/neon-http');
const { neon } = require('@neondatabase/serverless');
const { ranks } = require('../shared/schema');

const RANK_DATA = [
  { name: 'Bronze', minScore: 0, bonusRate: '0.0000', maxStores: 20 },
  { name: 'Silver', minScore: 60, bonusRate: '0.0500', maxStores: 50 },
  { name: 'Gold', minScore: 120, bonusRate: '0.1000', maxStores: 100 },
  { name: 'Platinum', minScore: 200, bonusRate: '0.1500', maxStores: 100 }
];

async function seedRanks() {
  try {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL is not set');
      process.exit(1);
    }

    const sql = neon(databaseUrl);
    const db = drizzle(sql);

    console.log('🌱 Seeding ranks...');

    for (const rankData of RANK_DATA) {
      try {
        await db.insert(ranks).values(rankData).onConflictDoUpdate({
          target: ranks.name,
          set: {
            minScore: rankData.minScore,
            bonusRate: rankData.bonusRate,
            maxStores: rankData.maxStores,
            updatedAt: new Date()
          }
        });
        console.log(`✅ Seeded rank: ${rankData.name}`);
      } catch (error) {
        console.log(`⚠️  Rank ${rankData.name} might already exist, updating...`);
      }
    }

    console.log('✅ Rank seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding ranks:', error);
    process.exit(1);
  }
}

seedRanks();
