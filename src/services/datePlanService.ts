import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface DatePlan {
  id: string;
  title: string;
  date: string;
  description: string;
  activities: string[];
  is_deleted?: boolean;
}

const JSON_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'datePlans.json');

export const datePlanService = {
  getAllPlans: async (): Promise<DatePlan[]> => {
    try {
      const data = await fs.readFile(JSON_FILE_PATH, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading JSON file:', error);
      throw new Error('Failed to read date plans');
    }
  },

  addPlan: async (newPlan: Omit<DatePlan, 'id'>): Promise<DatePlan> => {
    try {
      const plans = await datePlanService.getAllPlans();
      
      const planToAdd: DatePlan = {
        ...newPlan,
        id: newPlan.date?.replace(/\./g, '-') || new Date().toISOString(),
        is_deleted: false
      };

      plans.unshift(planToAdd);
      await fs.writeFile(JSON_FILE_PATH, JSON.stringify(plans, null, 2));
      return planToAdd;
    } catch (error) {
      console.error('Error adding plan:', error);
      throw new Error('Failed to add date plan');
    }
  },

  updatePlan: async (id: string, updatedPlan: Partial<DatePlan>): Promise<DatePlan> => {
    try {
      const plans = await datePlanService.getAllPlans();
      const index = plans.findIndex(plan => plan.id === id);
      
      if (index === -1) {
        throw new Error('Plan not found');
      }

      plans[index] = {
        ...plans[index],
        ...updatedPlan,
        id // Preserve original ID
      };

      await fs.writeFile(JSON_FILE_PATH, JSON.stringify(plans, null, 2));
      return plans[index];
    } catch (error) {
      console.error('Error updating plan:', error);
      throw new Error('Failed to update date plan');
    }
  },

  deletePlan: async (id: string): Promise<boolean> => {
    try {
      const plans = await datePlanService.getAllPlans();
      const index = plans.findIndex(plan => plan.id === id);
      
      if (index === -1) {
        throw new Error('Plan not found');
      }

      plans[index] = {
        ...plans[index],
        is_deleted: true
      };

      await fs.writeFile(JSON_FILE_PATH, JSON.stringify(plans, null, 2));
      return true;
    } catch (error) {
      console.error('Error deleting plan:', error);
      throw new Error('Failed to delete date plan');
    }
  }
};