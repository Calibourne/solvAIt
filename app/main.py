from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Serve static files (for CSS, JS, etc.)
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Root endpoint to serve the updated index.html
@app.get("/", response_class=HTMLResponse)
async def read_root():
    index_file = os.path.join("app", "static", "index.html")
    with open(index_file, "r") as file:
        content = file.read()
    return HTMLResponse(content)

# Dummy API endpoint for testing
@app.get("/api/test")
async def test_endpoint():
    return {"message": "API is working!"}
