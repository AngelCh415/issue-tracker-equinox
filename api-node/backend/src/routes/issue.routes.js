import { Router } from 'express';
import { classifyIssue } from '../services/classifier.service.js';

const router = Router();

let issues = [
    { id: 1, title: 'Issue One', description: 'First issue', status: 'open', projectId: 1 },
    ];

router.get('/', async (req, res, next) => {
    res.json(issues);
});

router.post('/', async (req, res, next) => {
    try {
      const { projectId, title, description } = req.body;
      const tags = await classifyIssue(title, description);
  
      const newIssue = {
        id: issues.length + 1,
        projectId,
        title,
        description,
        status: "open",
        tags
      };
  
      issues.push(newIssue);
      res.status(201).json(newIssue);
  
    } catch (err) {
        res.status(500).json({ error: 'Failed to classify issue' });
        next(err);
    }
  });

export default router;