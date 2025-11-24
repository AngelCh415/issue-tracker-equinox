import { Router } from 'express';

const router = Router();

let issues = [
    { id: 1, title: 'Issue One', description: 'First issue', status: 'open', projectId: 1 },
    ];

router.get('/', (req, res) => {
    res.json(issues);
});

router.post('/', (req, res) => {
    const { title, description, status, projectId } = req.body;
    const newIssue = {
        id: issues.length + 1,
        title,
        description,
        status,
        projectId,
    };
    issues.push(newIssue);
    res.status(201).json(newIssue);
});

export default router;