import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">{t('page_not_found')}</h2>
      </div>
      <p>{t('page_not_found_text')}</p>
      <p>
        <Link to="/" className="inline-link">{t('back_to_dashboard')}</Link>
      </p>
    </section>
  );
}

export default NotFoundPage;
