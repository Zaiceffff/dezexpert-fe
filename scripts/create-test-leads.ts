// scripts/create-test-leads.ts — создание тестовых лидов для дашборда
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const testLeads = [
    {
      partnerId: 'test-partner',
      pestType: 'tarakany',
      objectType: 'apartment',
      rooms: 2,
      infestation: 'medium',
      previousTreatment: false,
      phone: '+79995556325',
      address: 'Москва, Улица Ленина 22',
      name: 'Валерий',
      expectedDate: new Date('2025-03-28'),
      clientComment: 'Срочно, клиент уезжает через неделю',
      approxPrice: 15000,
      status: 'new',
      source: 'co'
    },
    {
      partnerId: 'test-partner',
      pestType: 'klopy',
      objectType: 'apartment',
      rooms: 3,
      infestation: 'high',
      previousTreatment: true,
      phone: '+79528302414',
      address: 'Краснодар, Красная, д27, кв 5',
      name: 'Диана',
      expectedDate: new Date('2025-03-29'),
      clientComment: 'Повторная обработка',
      approxPrice: 18000,
      status: 'in_progress',
      source: 'co'
    },
    {
      partnerId: 'test-partner',
      pestType: 'muravi',
      objectType: 'house',
      rooms: null,
      infestation: 'low',
      previousTreatment: false,
      phone: '+76525588226',
      address: 'Северная 251',
      name: 'Светлана',
      expectedDate: new Date('2025-03-20'),
      clientComment: 'Муравьи в саду',
      approxPrice: 8000,
      status: 'completed',
      source: 'co'
    },
    {
      partnerId: 'test-partner',
      pestType: 'gryzuny',
      objectType: 'commercial',
      rooms: null,
      infestation: 'high',
      previousTreatment: false,
      phone: '+79996652333',
      address: 'Сочи, Береговая 1',
      name: 'Анатолий',
      expectedDate: new Date('2025-03-25'),
      clientComment: 'Склад продуктов',
      approxPrice: 25000,
      status: 'new',
      source: 'co'
    },
    {
      partnerId: 'test-partner',
      pestType: 'bleshi',
      objectType: 'apartment',
      rooms: 1,
      infestation: 'medium',
      previousTreatment: false,
      phone: '+76464646464',
      address: 'Анталия, 72стрит. 263',
      name: 'Раджип',
      expectedDate: new Date('2025-03-18'),
      clientComment: 'Квартира с животными',
      approxPrice: 12000,
      status: 'cancelled',
      source: 'co'
    }
  ];

  // Сначала удаляем существующие тестовые лиды
  try {
    await prisma.lead.deleteMany({
      where: {
        partnerId: 'test-partner'
      }
    });
  } catch (error) {
    // Игнорируем ошибки
  }

  // Создаем новые тестовые лиды
  try {
    await prisma.lead.createMany({
      data: testLeads
    });
  } catch (error) {
    // Игнорируем ошибки
  }

  console.info('Test leads created successfully');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
