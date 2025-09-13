import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-2xl font-semibold mt-4">Page Not Found</p>
      <p className="text-gray-600 mt-2">Sorry, the page you are looking for does not exist.</p>
      <div className="mt-6">
        <Link 
          to="/" 
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
