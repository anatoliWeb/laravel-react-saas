import { useTranslation } from 'react-i18next';
import Table from '../components/ui/Table';

function UsersPage() {
  const { t } = useTranslation();

  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">{t('users')}</h2>
      </div>

      <Table
        columns={['ID', 'Name', 'Email', 'Role']}
        rows={[]}
      />
    </section>
  );
}

export default UsersPage;
