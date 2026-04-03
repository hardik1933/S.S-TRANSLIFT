import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-slate-200 dark:text-slate-800">404</h1>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 mb-2">Page Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate('/')} className="bg-blue-900 hover:bg-blue-800">
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
