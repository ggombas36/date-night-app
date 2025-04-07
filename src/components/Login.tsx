import React, { useState } from 'react';
import AuthButton from './AuthButton';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const isAuthenticated = await login(username, password);
      if (!isAuthenticated) {
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
          
          <AuthButton 
            isAuthenticated={false} 
            isLoading={isLoading} 
            isSubmit={true}
          />
        </form>
      </div>
    </div>
  );
}