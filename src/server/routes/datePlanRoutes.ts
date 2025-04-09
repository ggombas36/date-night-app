import { Router } from 'express';
import { datePlanService } from '../../services/datePlanService.js';

const router = Router();

// Get all date plans
router.get('/datePlans', async (req, res) => {
  try {
    const plans = await datePlanService.getAllPlans();
    res.json(plans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch date plans' });
  }
});

// Get active (non-deleted) date plans
router.get('/datePlans/active', async (req, res) => {
  try {
    const plans = await datePlanService.getAllPlans();
    const activePlans = plans.filter(plan => !plan.is_deleted);
    res.json(activePlans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active date plans' });
  }
});

// Create new date plan
router.post('/datePlans', async (req, res) => {
  try {
    const newPlan = await datePlanService.addPlan(req.body);
    res.status(201).json(newPlan);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create date plan' });
  }
});

// Update existing date plan
router.put('/datePlans/:id', async (req, res) => {
  try {
    const updated = await datePlanService.updatePlan(req.params.id, req.body);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update date plan' });
  }
});

// Delete date plan (soft delete)
router.delete('/datePlans/:id', async (req, res) => {
  try {
    await datePlanService.deletePlan(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete date plan' });
  }
});

export default router;