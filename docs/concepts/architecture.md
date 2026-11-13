# Architecture

SOUP separates common application services from packages that provide domain-specific features.

```text
SOUP application (web UI)
           |
      SOUP server
           |
  +--------+----------+
  |                   |
Core services     Packages
  |                   |
  +---------+---------+
            |
 Dataset / graph context
            |
      Neo4j or Memgraph
```

This diagram is deliberately conceptual; it is not a complete component or deployment diagram.

## Core and packages

The core is responsible for shared application functionality and integration points. Packages supply specific features, such as graph exploration or data import. The exact boundaries and registration APIs should be documented from the installed code.

## Database context

Graph operations should execute against the dataset and backend selected by the application context, rather than assuming a globally fixed database. See [Datasets and workspaces](datasets.md) for the intended model.
