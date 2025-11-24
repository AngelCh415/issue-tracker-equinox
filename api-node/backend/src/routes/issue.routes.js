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

  router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const issue = issues.find(i => i.id === id);
    if (!issue) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    const { title, description, status, tags } = req.body;
    if (title) issue.title = title;
    if (description) issue.description = description;
    if (status) issue.status = status;
    if (tags) issue.tags = tags;
    res.json(issue);
  });

  router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = issues.findIndex(i => i.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    const deleted = issues.splice(index, 1);
    res.json({message: "Issue deleted", issue: deleted[0]});
  });
export default router;