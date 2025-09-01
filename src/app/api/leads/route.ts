import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const partnerId = searchParams.get('partnerId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    if (!partnerId) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 });
    }

    // Строим условия для поиска
    const where: any = {
      partnerId: partnerId
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        partnerId: true,
        pestType: true,
        objectType: true,
        rooms: true,
        infestation: true,
        previousTreatment: true,
        phone: true,
        address: true,
        name: true,
        expectedDate: true,
        clientComment: true,
        approxPrice: true,
        status: true,
        source: true,
        createdAt: true
      }
    });

    // Преобразуем данные для соответствия интерфейсу
    const transformedLeads = leads.map(lead => ({
      ...lead
    }));

    return NextResponse.json(transformedLeads);
  } catch (error) {
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
