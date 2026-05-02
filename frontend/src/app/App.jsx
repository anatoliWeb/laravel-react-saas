import AppRouter from '../router';
import GlobalLoader from '../components/ui/GlobalLoader';

// App shell for the entire frontend application.
function App() {
  return (
    <>
      <GlobalLoader />
      <AppRouter />
    </>
  );
}

export default App;
