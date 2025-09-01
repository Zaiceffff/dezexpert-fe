// src/features/lead/Steps.tsx — шаги формы: выбор вредителя, объекта, детализация, заражённость, предыдущая обработка, контакты
'use client';

import { Controller, useFormContext } from 'react-hook-form';
import { type CreateLead } from '@/entities/schemas';
import { ru } from '@/shared/i18n/ru';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import PhoneInput from '@/components/PhoneInput';
import { DayPicker } from '@/components/ui/calendar';

type Props = {
  step: number;
  onNext: () => void;
  onPrev: () => void;
  isLoading: boolean;
  pricing:
    | {
        partner: { id: string; name: string; brandColor?: string | null } | null;
        rules: Array<{ pestType: string; objectType: string; variant: string; basePrice: number }>;
        availablePests: string[];
      }
    | undefined;
};

export function LeadSteps({ step, isLoading, pricing }: Props) {
  const {
    control,
    register,
    setValue,
    watch,
    formState: { errors }
  } = useFormContext<CreateLead>();

  const objectType = watch('objectType');
  const partnerName = pricing?.partner?.name ?? ru.fallback.partnerUnknown;

  return (
    <div className="rounded-2xl border bg-white p-4 md:p-6">
      <div className="mb-3 flex items-center justify-between text-sm text-gray-500">
        <span>Партнёр: {partnerName}</span>
        {isLoading && <span className="animate-pulse">Загрузка прайсов...</span>}
      </div>

      {step === 0 && (
        <div className="grid gap-2">
          <Label htmlFor="pestType">{ru.form.pestType}</Label>
          <Controller
            control={control}
            name="pestType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите вредителя" />
                </SelectTrigger>
                <SelectContent>
                  {(pricing?.availablePests ?? ru.domain.allPests).map((p) => (
                    <SelectItem key={p} value={p}>
                      {ru.domain.pestLabels[p as keyof typeof ru.domain.pestLabels]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.pestType && <p className="text-sm text-red-600">{errors.pestType.message}</p>}
        </div>
      )}

      {step === 1 && (
        <div className="grid gap-2">
          <Label htmlFor="objectType">{ru.form.objectType}</Label>
          <Controller
            control={control}
            name="objectType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => {
                field.onChange(v);
                setValue('rooms', undefined);
              }}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Тип объекта" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ru.domain.objectLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.objectType && <p className="text-sm text-red-600">{errors.objectType.message}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="grid gap-2">
          {objectType === 'apartment' ? (
            <>
              <Label htmlFor="rooms">{ru.form.rooms}</Label>
              <Controller
                control={control}
                name="rooms"
                render={({ field }) => (
                  <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(Number(v))}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Количество комнат" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4].map((r) => (
                        <SelectItem key={r} value={r.toString()}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.rooms && <p className="text-sm text-red-600">{errors.rooms.message}</p>}
            </>
          ) : (
            <p className="text-sm text-gray-600">{ru.form.variantDefault}</p>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="grid gap-2">
          <Label htmlFor="infestation">{ru.form.infestation}</Label>
          <Controller
            control={control}
            name="infestation"
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v) => field.onChange(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Степень заражённости" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ru.domain.infestationLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.infestation && (
            <p className="text-sm text-red-600">{errors.infestation.message}</p>
          )}
          <p className="text-xs text-gray-500">{ru.form.infestationHint}</p>
        </div>
      )}

      {step === 4 && (
        <div className="grid gap-2">
          <Label htmlFor="previousTreatment">{ru.form.previousTreatment}</Label>
          <Controller
            control={control}
            name="previousTreatment"
            render={({ field }) => (
              <Select value={field.value?.toString()} onValueChange={(v) => field.onChange(v === 'true')}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите ответ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Да</SelectItem>
                  <SelectItem value="false">Нет</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.previousTreatment && (
            <p className="text-sm text-red-600">{errors.previousTreatment.message}</p>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="phone">{ru.form.phone}</Label>
            <Controller
              control={control}
              name="phone"
              render={({ field }) => <PhoneInput value={field.value} onChange={field.onChange} />}
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">{ru.form.name}</Label>
            <Input id="name" {...register('name')} placeholder="Как к вам обращаться?" />
            {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">{ru.form.address}</Label>
            <Input id="address" {...register('address')} placeholder="Адрес" />
            {errors.address && <p className="text-sm text-red-600">{errors.address.message}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expectedDate">{ru.form.expectedDate}</Label>
            <Controller
              control={control}
              name="expectedDate"
              render={({ field }) => (
                <DayPicker value={field.value} onChange={(d) => field.onChange(d)} />
              )}
            />
            {errors.expectedDate && (
              <p className="text-sm text-red-600">{errors.expectedDate.message}</p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="clientComment">{ru.form.comment}</Label>
            <textarea
              id="clientComment"
              className="min-h-[80px]"
              {...register('clientComment')}
              placeholder="Комментарий (необязательно)"
            />
          </div>
        </div>
      )}
    </div>
  );
}


