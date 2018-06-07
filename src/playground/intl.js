import {addLocaleData} from 'react-intl';

import localeData from 'scratch-l10n';
import editorMessages from 'scratch-l10n/locales/editor-msgs';

Object.keys(localeData).forEach(locale => {
    addLocaleData(localeData[locale]);
});

const intlDefault = {
    defaultLocale: 'zh-cn',
    locale: 'zh-cn',
    messages: editorMessages["zh-cn"]
};

export {
    intlDefault as default,
    editorMessages
};
