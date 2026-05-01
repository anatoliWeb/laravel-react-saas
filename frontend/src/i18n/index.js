import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

// Translation files
import en from './locales/en.json';
import uk from './locales/uk.json';
import de from './locales/de.json';

/**
 * i18n configuration for the entire application.
 *
 * WHY:
 * - Central place for all translations
 * - Automatic language detection
 * - Persistent user language preference
 * - Clean integration with React
 */

i18n
    /**
     * Detect user language automatically
     *
     * Order:
     * 1. localStorage (saved preference)
     * 2. browser settings
     * 3. <html lang="">
     */
    .use(LanguageDetector)

    /**
     * Connect i18next with React
     *
     * Enables useTranslation() hook and <Trans> component
     */
    .use(initReactI18next)

    /**
     * Initialize i18n
     */
    .init({
        /**
         * Translation resources
         *
         * Structure:
         * lang -> namespace -> keys
         */
        resources: {
            en: { translation: en },
            uk: { translation: uk },
            de: { translation: de },
        },

        /**
         * Fallback language
         *
         * Used when:
         * - translation key is missing
         * - detected language is not supported
         */
        fallbackLng: 'en',

        /**
         * Supported languages list
         *
         * Helps avoid unexpected values like "en-US"
         */
        supportedLngs: ['en', 'uk', 'de'],

        /**
         * Interpolation settings
         *
         * escapeValue = false → React already escapes values
         */
        interpolation: {
            escapeValue: false,
        },

        /**
         * Language detection configuration
         */
        detection: {
            /**
             * Priority order for language detection
             */
            order: ['localStorage', 'navigator', 'htmlTag'],

            /**
             * Where to store selected language
             */
            caches: ['localStorage'],

            /**
             * Key used in localStorage
             */
            lookupLocalStorage: 'i18nextLng',
        },
    });

export default i18n;