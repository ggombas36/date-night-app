interface User {
  username: string;
  password: string;
  isAdmin: boolean;
}

// Define both users
const USERS: User[] = [
  {
    username: import.meta.env.VITE_AUTH_USERNAME,
    password: import.meta.env.VITE_AUTH_PASSWORD,
    isAdmin: false
  },
  {
    username: "admin",
    password: "20220331",
    isAdmin: true
  }
];

const generateToken = (user: User): string => {
  // Simple mock JWT structure
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    username: user.username,
    isAdmin: user.isAdmin,
    exp: Date.now() + (4 * 60 * 60 * 1000) // 4 hours from now
  }));
  const signature = btoa('mock-signature');
  
  return `${header}.${payload}.${signature}`;
};

export const authService = {
  login: (username: string, password: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Find matching user
        const user = USERS.find(
          u => u.username === username && u.password === password
        );
        
        if (user) {
          const token = generateToken(user);
          localStorage.setItem('authToken', token);
          localStorage.setItem('isAdmin', user.isAdmin.toString());
        }
        
        resolve(!!user);
      }, 500);
    });
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('isAdmin');
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
  },
  
  isAdmin: (): boolean => {
    // First check if authenticated
    if (!authService.isAuthenticated()) return false;
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return false;
      
      const [, payload] = token.split('.');
      const { isAdmin } = JSON.parse(atob(payload));
      return !!isAdmin;
    } catch {
      return false;
    }
  }
};