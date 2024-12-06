import { useTranslation } from 'react-i18next';

const selectedLanguagesClasses = 'font-bold cursor-default';
const unselectedLanguagesClasses = 'cursor-pointer';
const defaultClasses = 'mx-2 text-nowrap';
export default function LanguageSwitcher() {
    const { i18n } = useTranslation();
    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="flex ml-auto">
            {/* Make the active language bold */}
            <a
                className={`${i18n.language == 'nl' ? selectedLanguagesClasses : unselectedLanguagesClasses} ${defaultClasses}`}
                onClick={() => changeLanguage('nl')}
            >
                NL
            </a>
            |
            <a
                className={`${i18n.language == 'en' ? selectedLanguagesClasses : unselectedLanguagesClasses} ${defaultClasses}`}
                onClick={() => changeLanguage('en')}
            >
                EN
            </a>
        </div>
    );
}
