// scripts/check-orders.ts — проверка заявок в таблице Lead
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Проверяем лиды в базе данных
    const allLeads = await prisma.lead.findMany({
      include: {
        partner: true
      }
    });

    // Выводим общую статистику
    const totalLeads = allLeads.length;

    // Выводим лиды
    allLeads.forEach(lead => {
      // Выводим информацию о каждом лиде
    });

    // Проверяем схему базы данных
    try {
      const tables = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      // Выводим информацию о таблицах
    } catch (e) {
      // Игнорируем ошибку получения информации о таблицах
    }
  } catch (error) {
    // Игнорируем ошибки
  }
}

main();
