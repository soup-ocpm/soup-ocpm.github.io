# Graph backends

SOUP development targets both **Neo4j** and **Memgraph** as graph backends. Backend support can differ between packages and queries.

## Compatibility checklist

When documenting a package, distinguish between:

| Capability | What to verify |
| --- | --- |
| Connectivity | Driver, authentication, connection setup |
| Query execution | Cypher dialect and supported features |
| Database selection | Dataset and database context propagation |
| Read-only mode | Whether exploration can modify data |
| Lifecycle | Dataset loading, changing, and cleanup |

A shared protocol or Bolt driver does **not** guarantee that every Cypher query behaves identically on both systems.

## Recommended documentation practice

For each package, record supported backends and any feature-level limitations after testing against both systems. Avoid labeling a feature as cross-backend compatible based on connectivity alone.
