interface AuthButtonProps {
  isAuthenticated: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  isLoading?: boolean;
  isSubmit?: boolean;
}

export default function AuthButton({
  isAuthenticated, 
  onLogin, 
  onLogout,
  isLoading = false,
  isSubmit = false
}: AuthButtonProps) {
  
  const handleClick = () => {
    if (isAuthenticated && onLogout) {
      onLogout();
    } else if (!isAuthenticated && onLogin) {
      onLogin();
    }
  };
  
  const buttonClasses = `
    ${isAuthenticated ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-600 hover:bg-emerald-700'} 
    text-white py-2 px-4 rounded z-100
    transition-colors duration-300 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Position the button based on whether it's for login form or header
  const positionClasses = isAuthenticated ? 'absolute top-4 right-4' : '';
  
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
      onClick={handleClick}
      disabled={isLoading}
      className={`${buttonClasses} ${positionClasses}`}
    >
      {isLoading ? 'Processing...' : isAuthenticated ? 'Logout' : 'Login'}
    </button>
  );
}