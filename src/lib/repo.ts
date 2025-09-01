// src/lib/repo.ts — репозиторий: Prisma или JSON в зависимости от DATABASE_URL
import { prisma } from './prisma';
import { readDb, writeDb } from './jsonDb';
import { randomUUID } from 'crypto';
import { type CreateLead } from '@/entities/schemas';

// Используем Prisma если есть DATABASE_URL или если файл dev.db существует
const useJson = !process.env.DATABASE_URL && !require('fs').existsSync('./prisma/dev.db');

type Repo = {
  getPartner(id: string): Promise<{ id: string; name: string; brandColor?: string | null } | null>;
  getPricingRules(
    partnerId: string
  ): Promise<Array<{ pestType: string; objectType: string; variant: string; basePrice: number }>>;
  createLead(data: CreateLead): Promise<{ id: string }>;
  listLeads(params: { partnerId: string; limit: number; search?: string; status?: string }): Promise<
    Array<{
      id: string;
      createdAt: string;
      name: string;
      phone: string;
      status: string;
      pestType: string;
      approxPrice: number;
    }>
  >;
  getLead(id: string): Promise<Record<string, unknown> | null>;
  updateLeadStatus(id: string, status: string): Promise<Record<string, unknown> | null>;
  scheduleReminder(data: { leadId: string; scheduledAt: Date; channel: string }): Promise<Record<string, unknown>>;
};

async function prismaRepo(): Promise<Repo> {
  return {
    async getPartner(id) {
      const p = await prisma.partner.findUnique({ where: { id } });
      if (!p) return null;
      return { id: p.id, name: p.name, brandColor: p.brandColor };
    },
    async getPricingRules(partnerId) {
      const rules = await prisma.pricingRule.findMany({
        where: { partnerId },
        select: { pestType: true, objectType: true, variant: true, basePrice: true }
      });
      return rules;
    },
    async createLead(data) {
      const created = await prisma.lead.create({
        data: {
          partnerId: data.partnerId,
          pestType: data.pestType,
          objectType: data.objectType,
          rooms: data.rooms ?? null,
          infestation: data.infestation,
          previousTreatment: data.previousTreatment,
          phone: data.phone,
          address: data.address,
          name: data.name,
          expectedDate: new Date(data.expectedDate),
          clientComment: data.clientComment ?? null,
          approxPrice: data.approxPrice,
          status: 'new',
          source: data.source ?? 'co'
        },
        select: { id: true }
      });
      return created;
    },
    async listLeads({ partnerId, limit, search, status }) {
      const list = await prisma.lead.findMany({
        where: {
          partnerId,
          status: status && status.length > 0 ? status : undefined,
          OR:
            search && search.length > 0
              ? [{ name: { contains: search } }, { phone: { contains: search } }]
              : undefined
        },
        orderBy: { createdAt: 'desc' },
        take: Math.max(1, Math.min(limit, 200)),
        select: { id: true, createdAt: true, name: true, phone: true, status: true, pestType: true, approxPrice: true }
      });
      return list.map((l) => ({ ...l, createdAt: l.createdAt.toISOString() }));
    },
    async getLead(id) {
      const l = await prisma.lead.findUnique({ where: { id } });
      if (!l) return null;
      return { ...l, createdAt: l.createdAt.toISOString(), expectedDate: l.expectedDate.toISOString() };
    },
    async updateLeadStatus(id, status) {
      const u = await prisma.lead.update({ where: { id }, data: { status } });
      return { ...u, createdAt: u.createdAt.toISOString(), expectedDate: u.expectedDate.toISOString() };
    },
    async scheduleReminder({ leadId, scheduledAt, channel }) {
      const r = await prisma.reminder.create({
        data: { leadId, scheduledAt, status: 'scheduled', channel }
      });
      return { ...r, scheduledAt: r.scheduledAt.toISOString() };
    }
  };
}

const jsonRepo: Repo = {
  async getPartner(id) {
    const db = readDb();
    const p = db.partners.find((x) => x.id === id) ?? null;
    return p ? { id: p.id, name: p.name, brandColor: p.brandColor ?? null } : null;
  },
  async getPricingRules(partnerId) {
    const db = readDb();
    return db.pricingRules
      .filter((r) => r.partnerId === partnerId)
      .map(({ pestType, objectType, variant, basePrice }) => ({ pestType, objectType, variant, basePrice }));
  },
  async createLead(data) {
    const db = readDb();
    const id = randomUUID();
    db.leads.unshift({
      id,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'new'
    });
    writeDb(db);
    return { id };
  },
  async listLeads({ partnerId, limit, search, status }) {
    const db = readDb();
    let result = db.leads.filter((l) => l.partnerId === partnerId);
    if (status && status.length > 0) {
      result = result.filter((l) => l.status === status);
    }
    if (search && search.length > 0) {
      const s = search.toLowerCase();
      result = result.filter((l) => 
        (l.name as string).toLowerCase().includes(s) || 
        (l.phone as string).toLowerCase().includes(s)
      );
    }
    return result
      .slice(0, Math.max(1, Math.min(limit, 200)))
      .map((l) => ({
        id: l.id as string,
        createdAt: l.createdAt as string,
        name: l.name as string,
        phone: l.phone as string,
        status: l.status as string,
        pestType: l.pestType as string,
        approxPrice: l.approxPrice as number
      }));
  },
  async getLead(id) {
    const db = readDb();
    return db.leads.find((l) => l.id === id) ?? null;
  },
  async updateLeadStatus(id, status) {
    const db = readDb();
    const i = db.leads.findIndex((l) => l.id === id);
    if (i >= 0) {
      db.leads[i].status = status;
      writeDb(db);
      return db.leads[i];
    }
    return null;
  },
  async scheduleReminder({ leadId, scheduledAt, channel }) {
    const db = readDb();
    const r = { id: randomUUID(), leadId, scheduledAt: scheduledAt.toISOString(), status: 'scheduled', channel };
    db.reminders.push(r);
    writeDb(db);
    return r;
  }
};

let _repo: Repo | null = null;
async function getRepo(): Promise<Repo> {
  if (_repo) return _repo;
  
  if (useJson) {
    _repo = jsonRepo;
  } else {
    _repo = await prismaRepo();
  }
  return _repo;
}

export const repo: Repo = new Proxy({ /* TODO: implement */ } as Repo, {
  get(_t, prop) {
    return async (...args: unknown[]) => {
      const r = await getRepo();
      // @ts-expect-error dynamic
      return r[prop](...args);
    };
  }
});

