import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), "db.json");

export const readDB = () => {
    const file = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(file);
};

export const writeDB = (data) => {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
};
