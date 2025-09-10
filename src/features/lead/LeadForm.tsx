// src/features/lead/LeadForm.tsx — многошаговая форма с валидацией и расчётом
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateLeadSchema, type CreateLead, type PricingRule } from '@/entities/schemas';
import { LeadSteps } from './Steps';
import PriceBox from './PriceBox';
import { ru } from '@/shared/i18n/ru';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { computeApproxPrice } from '@/lib/pricing';
import { useLeadStore } from './hooks';

type Props = { partnerId: string; csrfToken: string };

export default function LeadForm({ partnerId, csrfToken }: Props) {
  const [step, setStep] = useState(0);
  const setPartnerName = useLeadStore((s) => s.setPartnerName);
  const setSubmittedLeadId = useLeadStore((s) => s.setSubmittedLeadId);
  const methods = useForm<CreateLead>({
    resolver: zodResolver(CreateLeadSchema),
    mode: 'onChange',
    defaultValues: {
      partnerId,
      source: 'co',
      pestType: undefined as unknown as CreateLead['pestType'],
      objectType: undefined as unknown as CreateLead['objectType'],
      infestation: 'low',
      previousTreatment: false,
      approxPrice: 0,
      rooms: undefined
    }
  });

  const { data: pricing, isLoading } = useQuery({
    queryKey: ['pricing', partnerId],
    enabled: Boolean(partnerId),
    queryFn: async () => {
      const r = await fetch(`/api/partners/${partnerId}/pricing`, { cache: 'no-store' });
      if (!r.ok) throw new Error('failed');
      return (await r.json()) as {
        partner: { id: string; name: string; brandColor?: string | null } | null;
        rules: Array<Pick<PricingRule, 'pestType' | 'objectType' | 'variant' | 'basePrice'>>;
        availablePests: Array<PricingRule['pestType']>;
      };
    }
  });

  useEffect(() => {
    const name = pricing?.partner?.name ?? null;
    setPartnerName(name);
  }, [pricing?.partner?.name, setPartnerName]);

  const onNext = async () => setStep((s) => Math.min(s + 1, 5));
  const onPrev = async () => setStep((s) => Math.max(s - 1, 0));

  const values = methods.watch();
  const approx = useMemo(() => {
    if (!pricing) return 0;
    return computeApproxPrice(pricing.rules, values);
  }, [pricing, values]);

  useEffect(() => {
    methods.setValue('approxPrice', approx, { shouldValidate: step === 5 });
  }, [approx, methods, step]);

  const onSubmit = methods.handleSubmit(async (data) => {
    try {
      const r = await fetch('/leads', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-csrf-token': csrfToken
        },
        body: JSON.stringify({ ...data, expectedDate: new Date(data.expectedDate).toISOString() })
      });
      if (!r.ok) {
        const msg = await r.text();
        throw new Error(msg || 'Ошибка отправки');
      }
      const res = (await r.json()) as { leadId: string };
      toast.success(ru.form.submitSuccess);
      setSubmittedLeadId(res.leadId);
      setStep(6);
    } catch (error) {
      toast.error('Ошибка отправки формы');
    } finally {
      // setIsSubmitting(false); // This line was removed from the new_code, so it's removed here.
    }
  });

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={onSubmit}
        className="grid gap-6 lg:grid-cols-3"
        aria-label="lead-form"
        autoComplete="off"
      >
        <div className="lg:col-span-2 grid gap-4">
          <LeadSteps
            step={step}
            onNext={onNext}
            onPrev={onPrev}
            isLoading={isLoading}
            pricing={pricing}
          />
        </div>
        <div className="lg:col-span-1 space-y-4">
          <PriceBox approx={approx} />
          <div className="rounded-lg border bg-white p-4 space-y-3">
            {step < 5 && (
              <Button
                type="button"
                onClick={onNext}
                disabled={!methods.formState.isValid}
                className="w-full"
              >
                {ru.form.next}
              </Button>
            )}
            {step === 5 && (
              <Button type="submit" disabled={!methods.formState.isValid} className="w-full">
                {ru.form.submit}
              </Button>
            )}
            {step > 0 && step < 6 && (
              <Button type="button" variant="secondary" onClick={onPrev} className="w-full">
                {ru.form.prev}
              </Button>
            )}
            {step === 6 && <p className="text-sm text-green-700">{ru.form.thanks}</p>}
          </div>
        </div>
      </form>
    </FormProvider>
  );
}


