const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 mt-8 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} EcomMERN. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
