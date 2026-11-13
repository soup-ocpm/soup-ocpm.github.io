# Installation

SOUP's exact installation commands depend on the current repository and deployment setup. This starter intentionally avoids publishing unverified commands.

## Before you start

Check your SOUP repository for:

- the supported runtime and tool versions;
- the recommended local or containerized setup;
- environment variables for the backend and graph database;
- database-specific prerequisites and startup order.

## Documentation preview (not a SOUP installation)

To work on **this documentation website** locally:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

On Windows, activate the environment with `.venv\Scripts\activate`.

The documentation preview will normally be available at `http://127.0.0.1:8000/`.

> **Note**
> When your application's installation procedure is finalized, replace this page with commands taken directly from the tested SOUP repository setup.
