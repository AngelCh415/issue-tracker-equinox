import axios from 'axios';

const CLASSIFIER_URL = 
    process.env.CLASSIFIER_URL || 'http://localhost:8001/classify';

function ruleBasedTags(title = "", description = "") {
    const text = `${title} ${description}`.toLowerCase();
    const tags = [];
      
    if (text.includes("auth") || text.includes("login") || text.includes("token")) {
        tags.push("security");
    }
    if (text.includes("bug") || text.includes("error") || text.includes("fail")) {
        tags.push("bug");
    }
    if (text.includes("ui") || text.includes("front") || text.includes("screen")) {
        tags.push("frontend");
    }
      
    if (tags.length === 0) tags.push("other");
      
    return tags;
}
      

export const classifyIssue = async (title, description) => {
    if (process.env.NODE_ENV == "test"){
        console.log("Using rule-based tags in test environment");
        return ruleBasedTags(title, description);
    }
    const response = await axios.post(CLASSIFIER_URL,{
        title,
        description
    });
    return response.data.tags;
};