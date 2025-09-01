// scripts/seed.ts — сидер тест-партнёра и базовых цен
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const partner = await prisma.partner.upsert({
      where: { id: 'test-partner' },
      update: {},
      create: {
        id: 'test-partner',
        name: 'ДезЭксперт Тест',
        phone: '+79990000000',
        brandColor: '#0ea5e9',
        isActive: true
      }
    });

    const pests = ['tarakany', 'klopy', 'muravi', 'gryzuny', 'bleshi', 'kleshchi', 'plesen'] as const;
    const objectTypes = ['apartment', 'house', 'plot', 'commercial'] as const;

    const rules: Array<{
      partnerId: string;
      pestType: string;
      objectType: string;
      variant: string;
      basePrice: number;
    }> = [];

    for (const pestType of pests) {
      for (const objectType of objectTypes) {
        if (objectType === 'apartment') {
          for (const rooms of [1, 2, 3, 4]) {
            rules.push({
              partnerId: partner.id,
              pestType,
              objectType,
              variant: String(rooms),
              basePrice: 1500 + rooms * 500
            });
          }
        } else {
          rules.push({
            partnerId: partner.id,
            pestType,
            objectType,
            variant: 'default',
            basePrice: objectType === 'house' ? 4000 : objectType === 'commercial' ? 5000 : 3000
          });
        }
      }
    }

    await prisma.pricingRule.createMany({
      data: rules
    });

    console.info('Seed completed for partner:', partner.id);
  } catch (error) {
    // Игнорируем ошибки
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


