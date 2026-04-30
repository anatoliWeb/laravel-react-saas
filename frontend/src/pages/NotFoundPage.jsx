import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <section>
      <div className="page-header">
        <h2 className="page-title">404 - Page Not Found</h2>
      </div>
      <p>The page you are looking for does not exist.</p>
      <p>
        <Link to="/" className="inline-link">Back to Dashboard</Link>
      </p>
    </section>
  );
}

export default NotFoundPage;
