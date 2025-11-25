import { Router } from 'express';
import { classifyIssue } from '../services/classifier.service.js';
import {all, get, run} from "../db.js"

const router = Router();
const mapIssueROw = (row) => ({
  ...row,
  tags: row.tags ? JSON.parse(row.tags) : []
});

router.get('/', async (req, res, next) => {
    try{
      const rows = await all(
        "SELECT id, projectId, title, description, status, tags FROM issues ORDER BY id DESC"
      );
      res.json(rows.map(mapIssueROw));
    }catch (error) {
      console.error("Error fetching issues:", error);
      res.status(500).json({ message: "Internal server error" });
    }
});

router.post('/', async (req, res, next) => {
    try {
        const { projectId, title, description } = req.body;
        if (!projectId || !title) {
            return res.status(400).json({ message: 'Project ID and title are required' });
        }
        const project = await get (
          'SELECT id FROM projects WHERE id = ?',
          [projectId]
        );
        if (!project) {
          return res.status(400).json({ message: 'Invalid project ID: project does not exist' });
        }
        const tags = await classifyIssue(title, description || "");
        const tagsJson = JSON.stringify(tags);

        const result = await run (
          `INSERT INTO issues (projectId, title, description, status, tags)
          VALUES (?, ?, ?, 'open', ?)`,
          [projectId, title, description || "", tagsJson]
        );

        const row = await get (
          `SELECT id, projectId, title, description, status, tags
          FROM issues WHERE id = ?`,
          [result.lastID]
        );
        
        res.status(201).json(mapIssueROw(row));
    } catch (error) {
        console.error("Error creating issue:", error);
        res.status(500).json({ message: "Internal server error" });
    }
  });

  router.put('/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    try{
      const existing = await get(
        'SELECT id, projectId, title, description, status, tags FROM issues WHERE id = ?',
        [id]
      );
      if (!existing) {
        return res.status(404).json({ error: 'Issue not found' });
      }

      const { title, description, status } = req.body;
      const updatedTitle = title || existing.title;
      const updatedDescription = description || existing.description;
      const updatedStatus = status || existing.status;

      const tags = await classifyIssue(updatedTitle, updatedDescription);
      const tagsJson = JSON.stringify(tags);

      await run(
        `UPDATE issues SET title = ?, description = ?, status = ?, tags = ? WHERE id = ?`,
        [updatedTitle, updatedDescription, updatedStatus, tagsJson, id]
      );
      
      const updatedIssue = await get(
        'SELECT id, projectId, title, description, status, tags FROM issues WHERE id = ?',
        [id]
      );
      res.json(mapIssueROw(updatedIssue));
    } catch (error) {
      console.error("Error updating issue:", error);
      res.status(500).json({ message: "Internal server error" });
    }
    
  });

  router.delete('/:id', async (req, res) => {
    try{
      const id = parseInt(req.params.id);
      const existing = await get(
        'SELECT id FROM issues WHERE id = ?',
        [id]
      );
      if (!existing) {
        return res.status(404).json({ error: 'Issue not found' });
      }
      
      await run(
        'DELETE FROM issues WHERE id = ?',
        [id]
      );
      res.status(204).end();
    } catch (error) {
      console.error("Error deleting issue:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
   
export default router;