// scripts/create-more-leads.ts — создание большего количества тестовых заявок
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Создаем дополнительные тестовые лиды
    const newLeads = [
      {
        name: 'Анна Петрова',
        pestType: 'Тараканы',
        status: 'New',
        address: 'ул. Ленина, 15, кв. 23',
        approxPrice: 2500,
        partnerId: 'test-partner',
        objectType: 'apartment',
        infestation: 'low',
        previousTreatment: false,
        phone: '+79991111111',
        expectedDate: new Date('2025-03-30'),
        clientComment: 'Небольшая квартира',
        source: 'website'
      },
      {
        name: 'Михаил Сидоров',
        pestType: 'Клопы',
        status: 'New',
        address: 'пр. Мира, 45, кв. 7',
        approxPrice: 3000,
        partnerId: 'test-partner',
        objectType: 'apartment',
        infestation: 'medium',
        previousTreatment: false,
        phone: '+79992222222',
        expectedDate: new Date('2025-03-31'),
        clientComment: 'Квартира с мебелью',
        source: 'website'
      },
      {
        name: 'Елена Козлова',
        pestType: 'Мыши',
        status: 'New',
        address: 'ул. Гагарина, 12, кв. 15',
        approxPrice: 2800,
        partnerId: 'test-partner',
        objectType: 'apartment',
        infestation: 'low',
        previousTreatment: false,
        phone: '+79993333333',
        expectedDate: new Date('2025-04-01'),
        clientComment: 'Квартира на первом этаже',
        source: 'website'
      },
      {
        name: 'Дмитрий Волков',
        pestType: 'Тараканы',
        status: 'New',
        address: 'ул. Пушкина, 8, кв. 31',
        approxPrice: 2200,
        partnerId: 'test-partner',
        objectType: 'apartment',
        infestation: 'low',
        previousTreatment: false,
        phone: '+79994444444',
        expectedDate: new Date('2025-04-02'),
        clientComment: 'Студия',
        source: 'website'
      },
      {
        name: 'Ольга Морозова',
        pestType: 'Клопы',
        status: 'New',
        address: 'пр. Победы, 67, кв. 12',
        approxPrice: 3200,
        partnerId: 'test-partner',
        objectType: 'apartment',
        infestation: 'high',
        previousTreatment: true,
        phone: '+79995555555',
        expectedDate: new Date('2025-04-03'),
        clientComment: 'Повторная обработка',
        source: 'website'
      }
    ];

    // Создаем лиды в базе данных
    for (const leadData of newLeads) {
      await prisma.lead.create({
        data: leadData
      });
    }

    // Проверяем общее количество лидов
    const totalLeads = await prisma.lead.count({
      where: { partnerId: 'test-partner' }
    });
  } catch (error) {
    // Игнорируем ошибки
  }
}

main();
