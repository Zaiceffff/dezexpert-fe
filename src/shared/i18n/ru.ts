// src/shared/i18n/ru.ts — строки интерфейса RU
export const ru = {
  form: {
    next: 'Далее',
    prev: 'Назад',
    submit: 'Отправить заявку',
    submitSuccess: 'Заявка отправлена!',
    submitError: 'Ошибка отправки',
    thanks: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
    pestType: 'Вредитель',
    objectType: 'Тип объекта',
    rooms: 'Количество комнат',
    infestation: 'Уровень заражённости',
    previousTreatment: 'Была ли предыдущая обработка?',
    phone: 'Телефон',
    name: 'Имя',
    address: 'Адрес',
    expectedDate: 'Желаемая дата визита',
    comment: 'Комментарий',
    variantDefault: 'Для данного объекта используется базовый вариант',
    infestationHint: 'Оцените ориентировочно. Это влияет на примерную стоимость.'
  },
  domain: {
    pestLabels: {
      tarakany: 'Тараканы',
      klopy: 'Клопы',
      muravi: 'Муравьи',
      gryzuny: 'Грызуны',
      bleshi: 'Блохи',
      kleshchi: 'Клещи',
      plesen: 'Плесень'
    },
    objectLabels: {
      apartment: 'Квартира',
      house: 'Дом',
      plot: 'Участок',
      commercial: 'Коммерция'
    },
    infestationLabels: {
      low: 'Низкий',
      medium: 'Средний',
      high: 'Высокий'
    },
    allPests: ['tarakany', 'klopy', 'muravi', 'gryzuny', 'bleshi', 'kleshchi', 'plesen']
  },
  fallback: {
    partnerUnknown: 'Неизвестный партнёр'
  }
} as const;


