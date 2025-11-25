from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class Issue(BaseModel):
    title: str
    description: str

@app.post("/classify")
def classify(issue: Issue):
    text = f"{issue.title} {issue.description}".lower()
    tags = []

    if any(word in text for word in ["auth", "login", "token"]):
        tags.append("security")
    if any(word in text for word in ["ui", "button", "layout"]):
        tags.append("frontend")
    if any(word in text for word in ["base de datos", "sql", "query"]):
        tags.append("database")
    if not tags:
        tags.append("general")
    return {"tags": tags}