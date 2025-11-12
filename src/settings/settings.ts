import {DurationOptionType} from '../types/duration-option.type';

export const Settings = {
  accessTokenKey: 'access',
  refreshTokenKey: 'refresh',
  maxCategoryCount: 5,
  maxAdditionEventPhotoCount: 3,
  maxAdditionUserPhotoCount: 3,
  maxAnswerLength: 1000,
  maxChatMessageLength: 500,
  minAnswerLength: 10,
  maxQuestionLength: 1000,
  minQuestionLength: 10,
  minAddressQueryLength: 3,
  minCityQueryLength: 2,
  minStreetQueryLength: 2,
  minHouseQueryLength: 1,
  questionDefaultLimit: 4,
  eventDefaultLimit: 9,
  articlesDefaultLimit: 8,
  masterDefaultLimit: 4,
  maxCategoryTagCount: 10,
  mapZoom: 16,
  passwordRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
  emailRegex: /^([-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|^"([\x01-\x08\x0b\x0c\x0e-\x1f!#-\[\]-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+[A-Z]{2,63}\.?$/i,
  youtube_regex: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(channel\/[A-Za-z0-9_-]{24}|c\/[A-Za-z0-9_-]+|user\/[A-Za-z0-9_-]+|@[\w.-]+)$/,
  telegram_regex: /^(?!_)(?!.*_$)(?!.*__)[A-Za-z0-9_]{5,32}$/,
  vk_regex: /^(?:https?:\/\/)?(?:www\.)?vk\.com\/[a-zA-Z0-9_.]{5,32}$/,
  instagram_regex: /^(?:https?:\/\/)?(?:www\.)?instagram\.com\/(?!.*\.\.)(?!\.)([a-zA-Z0-9._]{1,30})(?<!\.)\/?$/,
  offlineFormatsIDs: [2, 3], // Офлайн, Комбинированный
}

export const Duration: DurationOptionType[] = [
  {title: 'Любая', duration_from: undefined, duration_to: undefined, time_period: undefined, selected: true},
  {title: '1-2 часа', duration_from: 1, duration_to: 2, time_period: 'hours', selected: false},
  {title: '3-12 часов', duration_from: 3, duration_to: 12, time_period: 'hours', selected: false},
  {title: '1 день', duration_from: 1, duration_to: 1, time_period: 'days', selected: false},
  {title: '2-4 дня', duration_from: 2, duration_to: 4, time_period: 'days', selected: false},
  {title: '5 дней и более', duration_from: 5, duration_to: undefined, time_period: 'days', selected: false},
  // {title: '6 дней и более', duration_from: 6, duration_to: undefined, time_period: 'days', selected: false},
]


// telegram_regex: /^(?:https?:\/\/)?(?:t\.me|telegram\.me)\/[a-zA-Z][a-zA-Z0-9_]{4,31}$|^@[a-zA-Z][a-zA-Z0-9_]{4,31}$/,
