// scripts/check-all-leads.ts — проверка всех заявок в базе данных
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Проверяем все лиды в базе данных
    const partners = await prisma.partner.findMany();
    
    // Выводим партнеров
    const totalPartners = partners.length;

    // Получаем все лиды
    const allLeads = await prisma.lead.findMany({
      include: {
        partner: true
      }
    });

    // Выводим общую статистику
    const totalLeads = allLeads.length;

    // Группируем лиды по партнерам
    for (const partner of partners) {
      const partnerId = partner.id;
      const leads = allLeads.filter(lead => lead.partnerId === partnerId);
      const partnerLeadsCount = leads.length;
    }

    // Группируем лиды по источникам
    const leadsBySource = allLeads.reduce((acc, lead) => {
      const source = lead.source || 'unknown';
      if (!acc[source]) acc[source] = [];
      acc[source].push(lead);
      return acc;
    }, {} as Record<string, any[]>);

    // Выводим статистику по источникам
    const sourceStats = Object.entries(leadsBySource).map(([source, leads]) => ({
      source,
      count: leads.length
    }));
  } catch (error) {
    // Игнорируем ошибки
  }
}

main();
