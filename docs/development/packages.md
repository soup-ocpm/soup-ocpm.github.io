# Package development

SOUP's package system allows capabilities to be developed separately from core features. This page is a starting point for repository-specific contributor guidance.

## Principles

- Reuse core services and the active dataset context.
- Keep backend-specific behavior explicit.
- Prefer read-only access for exploration and query preview features.
- Avoid adding dependencies when existing infrastructure can handle the requirement.
- Add tests for Neo4j and Memgraph separately when claiming both are supported.

## Before documenting a new package

Confirm its package entry points, install/registration process, backend support, user-facing configuration, and current limitations in the source code.

Add the verified user-facing guide under `docs/packages/`.
