import axios from 'axios';

export const classifyIssue = async (title, description) => {
    const response = await axios.post('http://localhost:8001/classify',{
        title,
        description
    });
    return response.data.tags;
};