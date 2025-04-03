import React, { useState } from 'react';
import { authService } from '../services/authService';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isAuthenticated = await authService.login(username, password);
      if (isAuthenticated) {
        onLoginSuccess();
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white/10 backdrop-blur-lg 
                    rounded-xl shadow-lg p-4 md:p-8 transition-all duration-300">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 h-full justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-emerald-800 mb-6">
            Login to OG's Date Night App
          </h2>
          
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 rounded border border-emerald-200 bg-white/70"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded border border-emerald-200 bg-white/70"
            required
          />
          
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 text-white py-2 px-4 rounded hover:bg-emerald-700 
                     transition-colors duration-300 disabled:bg-emerald-400"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}