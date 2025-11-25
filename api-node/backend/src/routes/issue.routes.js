import { Router } from 'express';
import { classifyIssue } from '../services/classifier.service.js';
import { readDB, writeDB } from "../db.js";

const router = Router();
const db = readDB();


router.get('/', async (req, res, next) => {
    res.json(db.issues || []);
});

router.post('/', async (req, res, next) => {
    try {
        const { projectId, title, description } = req.body;
        if (!projectId || !title){
          return res
            .status(400)
            .json({ error: 'Project ID and title are required' });
        }
        const issues = db.issues || []; 
        const tags = await classifyIssue(title,description || "");
        const newIssue = {
          id: issues.length ? issues[issues.length - 1].id + 1 : 1,
          projectId,
          title,
          description: description || '',
          status: 'open',
          tags
        };
        issues.push(newIssue);
        writeDB({ ...db, issues });
        res.status(201).json(newIssue);
        }catch (err) {
        res.status(500).json({ error: 'Failed to classify issue' });
        next(err);
    }
  });

  router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const issues = db.issues || [];
    const issueIndex = issues.findIndex((i) => i.id === id);
    if (issueIndex === -1) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    const issue = issues[issueIndex];
    const { title, description, status } = req.body;
    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;
    issues[issueIndex] = issue;
    writeDB({ ...db, issues });
    res.json(issue);
    
  });

  router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const issues = db.issues || [];
    const issueIndex = issues.findIndex((i) => i.id === id);
    if (issueIndex === -1) {
      return res.status(404).json({ error: 'Issue not found' });
    }
    const [deleted] = issues.splice(issueIndex, 1);
    writeDB({ ...db, issues });
    res.json({ message: 'Issue deleted', issue: deleted });
  });
export default router;