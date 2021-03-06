import settings from '../../config/settings';

export default {
  API_URL: settings.API_URL,
  RESPA_ADMIN_URL: settings.RESPA_ADMIN_URL,
  CUSTOMIZATIONS: {
    'varaamo.espoo.fi': 'ESPOO',
    'varaamotest-espoo.hel.ninja': 'ESPOO',
    'varaamo.vantaa.fi': 'VANTAA',
    'varaamotest-vantaa.hel.ninja': 'VANTAA',
    'varaamo.tampere.fi': 'TAMPERE', // PROD
    'dev-varaamo.tampere.fi': 'TAMPERE', // QA
    'varaamotest-tampere.temp:3000': 'TAMPERE', // LOCAL DEV
  },
  DATE_FORMAT: 'YYYY-MM-DD',
  DATETIME_FORMAT: 'YYYY-MM-DD[T]HH:mmZZ',
  DEFAULT_LOCALE: 'fi',
  FEEDBACK_URL: 'https://palvelut2.tampere.fi/e3/lomakkeet/15701/lomake.html',
  FILTER: {
    timeFormat: 'HH:mm',
    timePeriod: 30,
    timePeriodType: 'minutes',
  },
  REQUIRED_API_HEADERS: {
    Accept: 'application/json',
    'Accept-Language': 'fi',
    'Content-Type': 'application/json',
  },
  REQUIRED_STAFF_EVENT_FIELDS: [
    'eventDescription',
    'reserverName',
    'reservationExtraQuestions',
  ],
  RESERVATION_STATE_LABELS: {
    cancelled: {
      labelBsStyle: 'default',
      labelTextId: 'common.cancelled',
    },
    confirmed: {
      labelBsStyle: 'success',
      labelTextId: 'common.confirmed',
    },
    denied: {
      labelBsStyle: 'danger',
      labelTextId: 'common.denied',
    },
    requested: {
      labelBsStyle: 'primary',
      labelTextId: 'common.requested',
    },
  },
  RESERVATION_PAYMENT_LABELS: {
    confirmed: {
      labelBsStyle: 'success',
      labelTextId: 'payment.success',
    },
    waiting: {
      labelBsStyle: 'warning',
      labelTextId: 'payment.processing',
    },
    rejected: {
      labelBsStyle: 'danger',
      labelTextId: 'payment.failed',
    },
    cancelled: {
      labelBsStyle: 'danger',
      labelTextId: 'payment.cancelled',
    },
  },
  SEARCH_PAGE_SIZE: 30,
  DEFAULT_MUNICIPALITY_OPTIONS: [
    'Kangasala',
    'Lempäälä',
    'Nokia',
    'Orivesi',
    'Pirkkala',
    'Tampere',
    'Vesilahti',
    'Ylöjärvi',
  ],
  SHOW_TEST_SITE_MESSAGE: settings.SHOW_TEST_SITE_MESSAGE,
  SUPPORTED_LANGUAGES: ['en', 'fi', 'sv'],
  SUPPORTED_SEARCH_FILTERS: {
    freeOfCharge: '',
    date: '',
    distance: '',
    municipality: [],
    lat: '',
    lon: '',
    orderBy: '',
    page: 1,
    people: '',
    purpose: '',
    search: '',
    unit: '',
    availableBetween: '',
  },
  TIME_FORMAT: 'H:mm',
  TIME_ZONE: settings.TIME_ZONE,
  TRACKING: settings.TRACKING,
  SORT_BY_OPTIONS: {
    NAME: 'resource_name_lang',
    TYPE: 'type_name_lang',
    PREMISES: 'unit_name_lang',
    PEOPLE: 'people_capacity',
  },
};
