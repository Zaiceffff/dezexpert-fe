// scripts/check-leads.ts — проверка лидов в базе данных
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Проверяем базу данных
    const partners = await prisma.partner.findMany();
    
    // Выводим партнеров
    const totalPartners = partners.length;

    // Проверяем лиды для test-partner
    const testPartner = partners.find(p => p.id === 'test-partner');
    if (testPartner) {
      const leads = await prisma.lead.findMany({
        where: { partnerId: 'test-partner' }
      });
      const totalLeads = leads.length;
    }

    // Выводим все лиды
    const allLeads = await prisma.lead.findMany();
    const totalAllLeads = allLeads.length;
  } catch (error) {
    // Игнорируем ошибки
  }
}

main();
