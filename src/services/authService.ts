interface User {
  username: string;
  password: string;
}

// Use environment variables for credentials
const MOCK_USER: User = {
  username: import.meta.env.VITE_AUTH_USERNAME || "admin",
  password: import.meta.env.VITE_AUTH_PASSWORD || "datenight2024"
};

const generateToken = (): string => {
  // Simple mock JWT structure
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    username: MOCK_USER.username,
    exp: Date.now() + (4 * 60 * 60 * 1000) // 4 hours from now
  }));
  const signature = btoa('mock-signature');
  
  return `${header}.${payload}.${signature}`;
};

export const authService = {
  login: (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const isAuthenticated = 
          username === MOCK_USER.username && 
          password === MOCK_USER.password;
        
        if (isAuthenticated) {
          const token = generateToken();
          localStorage.setItem('authToken', token);
        }
        
        resolve(isAuthenticated);
      }, 500);
    });
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
      const [, payload] = token.split('.');
      const { exp } = JSON.parse(atob(payload));
      return Date.now() < exp;
    } catch {
      return false;
    }
  }
};