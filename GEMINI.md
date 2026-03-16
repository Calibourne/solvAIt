## Project Configuration

- **Language**: TypeScript
- **Package Manager**: npm
- **Add-ons**: none

---

# solvAIt - Project Context

## Project Overview
**solvAIt** (*"Solve It AI"*) is an AI-powered puzzle-solving application designed to tackle logical, spatial, and reverse-engineering challenges. It currently features a specialized interface for **Killer Sudoku** and aims to support **Sokoban** and **Reverse Conway’s Game of Life**.

The project is built with a **Python (FastAPI)** backend and a **Vanilla JavaScript/HTML/CSS** frontend.

## Tech Stack
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/) - High-performance web framework for building APIs.
- **Frontend:** HTML5, CSS3, and modern Vanilla JavaScript (no external frameworks).
- **Server:** [Uvicorn](https://www.uvicorn.org/) - ASGI server for Python.

## Building and Running

### Prerequisites
- Python 3.8+
- pip

### Installation
```bash
pip install -r requirements.txt
```

### Running the Application
To start the development server with auto-reload:
```bash
uvicorn app.main:app --reload
```
The application will be available at `http://127.0.0.1:8000`.

### Testing
- TODO: Implement backend unit tests using `pytest`.
- TODO: Implement frontend testing.

## Directory Structure
- `app/`: Main application directory.
  - `main.py`: FastAPI entry point and route definitions.
  - `static/`: Frontend assets.
    - `index.html`: The main user interface.
    - `app.js`: Client-side logic for grid interaction, cage management, and validation.
    - `styles.css`: UI styling.
- `requirements.txt`: Python package dependencies.
- `README.md`: Project introduction and high-level goals.

## Development Conventions
- **Code Style:** Follow PEP 8 for Python code.
- **Static Files:** All frontend assets must reside in `app/static/` and be served via FastAPI's `StaticFiles` mount at `/static`.
- **API Endpoints:** Use the `/api/` prefix for all backend logic endpoints.
- **Puzzle Logic:** Aim to separate the core solver algorithms (Python) from the web delivery layer (FastAPI).

## Roadmap & Features
- [x] **Killer Sudoku UI:** Interactive grid with cage creation and editing.
- [x] **Basic Validation:** Frontend checks for cage sum constraints.
- [ ] **AI Solvers:** Implementation of backtracking or constraint satisfaction algorithms for Sudoku.
- [ ] **Sokoban Interface:** Interactive box-pushing grid.
- [ ] **Reverse Game of Life:** Tool for finding initial states for cellular automata.
