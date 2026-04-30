import Card from '../components/ui/Card';

function DashboardPage() {
  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">Dashboard</h2>
      </div>

      <div className="card-grid">
        <Card title="Users">
          <p>Stats placeholder for total users.</p>
        </Card>

        <Card title="Revenue">
          <p>Stats placeholder for monthly revenue.</p>
        </Card>

        <Card title="System Health">
          <p>Status placeholder for future backend checks.</p>
        </Card>
      </div>
    </section>
  );
}

export default DashboardPage;
