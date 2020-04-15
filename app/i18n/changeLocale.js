import moment from 'moment';
import { updateIntl } from 'react-intl-redux';

import { savePersistLocale } from '../store/middleware/persistState';
import enMessages from './messages/en.json';
import fiMessages from './messages/fi.json';
import svMessages from './messages/sv.json';

const messages = {
  fi: fiMessages,
  en: enMessages,
  sv: svMessages,
};

function changeLocale(locale) {
  savePersistLocale(locale);
  moment.locale(`varaamo-${locale}`);

  return updateIntl({
    locale,
    messages: messages[locale],
  });
}

export default changeLocale;
