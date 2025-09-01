// src/features/lead/hooks.ts — Zustand: минимальное состояние формы
'use client';

import { create } from 'zustand';

type LeadStore = {
  partnerName: string | null;
  submittedLeadId: string | null;
  setPartnerName: (name: string | null) => void;
  setSubmittedLeadId: (id: string | null) => void;
};

export const useLeadStore = create<LeadStore>((set) => ({
  partnerName: null,
  submittedLeadId: null,
  setPartnerName: (partnerName) => set({ partnerName }),
  setSubmittedLeadId: (submittedLeadId) => set({ submittedLeadId })
}));


