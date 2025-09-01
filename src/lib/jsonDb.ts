// src/lib/jsonDb.ts — файловый JSON-репозиторий (.data/db.json)
import fs from 'fs';
import path from 'path';

type DbShape = {
  partners: Array<{
    id: string;
    name: string;
    phone: string;
    brandColor?: string | null;
    logoUrl?: string | null;
    isActive: boolean;
    createdAt: string;
  }>;
  pricingRules: Array<{
    id: string;
    partnerId: string;
    pestType: string;
    objectType: string;
    variant: string;
    basePrice: number;
  }>;
  leads: Array<Record<string, unknown>>;
  reminders: Array<Record<string, unknown>>;
};

const file = path.join(process.cwd(), '.data', 'db.json');

function ensure() {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(file)) {
    const seed: DbShape = { partners: [], pricingRules: [], leads: [], reminders: [] };
    fs.writeFileSync(file, JSON.stringify(seed, null, 2), 'utf8');
  }
}

export function readDb(): DbShape {
  ensure();
  const raw = fs.readFileSync(file, 'utf8');
  return JSON.parse(raw) as DbShape;
}

export function writeDb(db: DbShape) {
  ensure();
  fs.writeFileSync(file, JSON.stringify(db, null, 2), 'utf8');
}


