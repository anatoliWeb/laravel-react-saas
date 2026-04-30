import Table from '../components/ui/Table';

function UsersPage() {
  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">Users</h2>
      </div>

      <Table
        columns={['ID', 'Name', 'Email', 'Role']}
        rows={[]}
      />
    </section>
  );
}

export default UsersPage;
