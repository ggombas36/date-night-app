import type { DatePlan } from '../types/DatePlan';
import type { DateOption } from '../types/DateOption';

const API_KEY = import.meta.env.VITE_JSONBIN_API_KEY;
const BIN_ID = import.meta.env.VITE_JSONBIN_BIN_ID;
const OPTIONS_BIN_ID = import.meta.env.VITE_JSONBIN_OPTION_BIN_ID;



const headers = {
  'Content-Type': 'application/json',
  'X-Master-Key': API_KEY,
  'X-Bin-Meta': 'false'
};

export const dateApiService = {
  getAllPlans: async (): Promise<DatePlan[]> => {
    try {
      console.log('Fetching plans...');
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${BIN_ID}`,
        {
          method: 'GET',
          headers
        }
      );

      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch plans');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching plans:', error);
      throw error;
    }
  },

  updatePlans: async (plans: DatePlan[]): Promise<boolean> => {
    try {
      console.log('Updating plans...');
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${BIN_ID}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(plans)
        }
      );

      if (!response.ok) {
        console.error('Update response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating plans:', error);
      return false;
    }
  },

  getAllOptions: async (): Promise<DateOption[]> => {
    try {
      console.log('Fetching date options...');
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${OPTIONS_BIN_ID}`,
        {
          method: 'GET',
          headers
        }
      );

      if (!response.ok) {
        console.error('Response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch date options');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching date options:', error);
      throw error;
    }
  },

  updateOptions: async (options: DateOption[]): Promise<boolean> => {
    try {
      console.log('Updating date options...');
      const response = await fetch(
        `https://api.jsonbin.io/v3/b/${OPTIONS_BIN_ID}`,
        {
          method: 'PUT',
          headers,
          body: JSON.stringify(options)
        }
      );

      if (!response.ok) {
        console.error('Update response not OK:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Update error response:', errorText);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error updating date options:', error);
      return false;
    }
  }
};