import { useState, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export interface DatePlan {
  id: string;
  title: string;
  date: string;
  description: string;
  activities: string[];
  is_deleted?: boolean;
}

export function useApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getActivePlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<DatePlan[]>(`${API_BASE_URL}/datePlans/active`);
      return response.data;
    } catch (err) {
      setError('Failed to fetch date plans');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAllPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get<DatePlan[]>(`${API_BASE_URL}/datePlans`);
      return response.data;
    } catch (err) {
      setError('Failed to fetch date plans');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPlan = useCallback(async (plan: Omit<DatePlan, 'id'>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<DatePlan>(`${API_BASE_URL}/datePlans`, plan);
      return response.data;
    } catch (err) {
      setError('Failed to create date plan');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePlan = useCallback(async (id: string, plan: Partial<DatePlan>) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.put<DatePlan>(
        `${API_BASE_URL}/datePlans/${id}`, 
        plan
      );
      return response.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update date plan';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deletePlan = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/datePlans/${id}`);
      return true;
    } catch (err) {
      setError('Failed to delete date plan');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    getActivePlans,
    getAllPlans,
    createPlan,
    updatePlan,
    deletePlan
  };
}