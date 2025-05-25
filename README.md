# AITS (Academic Issue Tracking System)

## Project Description

AITS is a system that enables students to report academic issues online. The Academic Registrar views the issues and approves them before sending them to a lecturer to be resolved.

## Features

- **Academic Registrar Dashboard:** Allows registrars to view, confirm, and assign issues to relevant lecturers.
- **Lecturer Dashboard:** Enables lecturers to view assigned issues and resolve them.
- **Student Dashboard:** Allows students to submit academic issues and track their status.
- **Role-Based Login System:** Users access features based on their roles (Academic Registrar, Lecturer, Student).
- **Real-time Status Changes:** Track issues with statuses like Open, In Progress, Resolved.

## Contributors

| Name                  | RegNo          | StudentNo  | Role                 |
| --------------------- | -------------- | ---------- | -------------------- |
| Abinsinguza Morison K | 24/U/02594/PS  | 2400702594 | Backend and frontend |
| Serena Robinah        | 24/U/22603/PS  | 2400722603 | Frontend             |
| Aturinzire Hargreave  | 24/U/11034/PS  | 2400711034 | Frontend             |
| Lunkuse Dorcus        | 24/U/06515/PS  | 2400706515 | Backend              |
| Amanyire Cindy        | 23/U/05985/EVE | 2300705985 | Backend              |
| Elijah Biar Mabior    | 24/E/21430/PS  | 2400721430 | Backend              |

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Python 3.10 or higher

### Installation

1.  **Clone the repository (Optional):**
    If you have a git repository, clone it first.

    ```bash
    # git clone <repository-url>
    # cd <project-directory>
    ```

2.  **Create and activate a virtual environment:**
    Open a terminal in the project's root directory.

    - Create the virtual environment:
      ```bash
      python -m venv venv
      ```
    - Activate the virtual environment:
      _ On Windows (PowerShell):
      `powershell
.\venv\Scripts\Activate.ps1
`
      _ On Windows (Command Prompt):
      `cmd
venv\Scripts\activate.bat
` \* On macOS/Linux:
      `bash
source venv/bin/activate
` > **Note:** You'll know the virtual environment is active when your terminal prompt is prefixed with `(venv)`. For more information on Python virtual environments, see the [official documentation](https://docs.python.org/3/tutorial/venv.html).

3.  **Install dependencies:**
    The project dependencies are listed in `AITS/server/requirements.txt`. Install them using pip:
    ```bash
    pip install -r AITS/server/requirements.txt
    ```
