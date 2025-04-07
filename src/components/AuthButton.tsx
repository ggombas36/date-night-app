interface AuthButtonProps {
  isAuthenticated: boolean;
  onLogout?: () => void;
  isLoading?: boolean;
  isSubmit?: boolean;
}

export default function AuthButton({
  isAuthenticated,
  onLogout,
  isLoading = false,
  isSubmit = false
}: AuthButtonProps) {
  const buttonClasses = `
    ${isAuthenticated ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'} 
    text-white py-2 px-4 rounded 
    transition-colors duration-300 
    cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Position the button based on whether it's for login form or header
  const positionClasses = isAuthenticated ? 'absolute top-4 right-4 z-10' : '';
  
  if (isSubmit) {
    return (
      <button
        type="submit"
        disabled={isLoading}
        className={buttonClasses}
      >
        {isLoading ? 'Processing...' : isAuthenticated ? 'Logout' : 'Login'}
      </button>
    );
  }
  
  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={isLoading}
      className={`${buttonClasses} ${positionClasses}`}
    >
      {isLoading ? 'Processing...' : isAuthenticated ? 'Logout' : 'Login'}
    </button>
  );
}