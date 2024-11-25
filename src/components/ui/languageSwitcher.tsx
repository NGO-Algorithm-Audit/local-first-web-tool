import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex ml-auto">
            {/* Make the active language bold */}
            <a
                className={
                    (i18n.language == 'nl' ? 'font-bold' : '') +
                    ' mx-2 text-nowrap'
                }
                onClick={() => changeLanguage('nl')}
            >
                NL
            </a>
            |
            <a
                className={
                    (i18n.language == 'en' ? 'font-bold' : '') +
                    ' mx-2 text-nowrap'
                }
                onClick={() => changeLanguage('en')}
            >
                EN
            </a>
        </div>
    );
}
