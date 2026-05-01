import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../config/languages';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // WHY: Soon this list will come from backend permissions per user.
  const allowedLanguages = ['en', 'uk', 'de'];
  const availableLanguages = LANGUAGES.filter((language) => allowedLanguages.includes(language.code));

  const resolved = (i18n.resolvedLanguage || i18n.language || 'en').slice(0, 2);
  const currentLanguage =
    availableLanguages.find((language) => language.code === resolved) ||
    availableLanguages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (availableLanguages.length <= 1) {
    return null;
  }

  return (
    <div className={`language-switcher ${open ? 'is-open' : ''}`} ref={containerRef}>
      <button
        type="button"
        className="language-switcher__trigger"
        onClick={() => setOpen((state) => !state)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {currentLanguage?.short || 'EN'}
      </button>

      <div className="language-switcher__menu" role="listbox">
        {availableLanguages.map((language) => (
          <button
            key={language.code}
            type="button"
            role="option"
            className={`language-switcher__option ${currentLanguage?.code === language.code ? 'is-active' : ''}`}
            aria-selected={currentLanguage?.code === language.code}
            onClick={() => {
              i18n.changeLanguage(language.code);
              setOpen(false);
            }}
          >
            {language.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LanguageSwitcher;
