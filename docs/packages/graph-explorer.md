# Graph Explorer

Graph Explorer is a SOUP package focused on viewing and exploring graph data.

## Intended capabilities

The project has discussed the following improvements for Graph Explorer. **Treat these as design goals until verified in the released package:**

- hierarchical graph layouts with zoom, pan, and selection;
- a query-building interface to choose node and relationship types, properties, and filters before rendering;
- visual node coloring based on labels, property rules, and rule priority;
- read-only graph exploration using the active dataset context;
- support for Neo4j and Memgraph where compatible.

## Suggested user flow

1. Select a dataset and graph backend.
2. Choose graph types and filters in the query interface.
3. Execute a read-only query.
4. Explore the resulting graph in the visualization.
5. Adjust visual rules without changing the stored graph.

> **Feature availability**
> Confirm features against the package currently installed in your instance. This page does not claim the proposed functionality has shipped.

For backend limitations, see [Graph backends](../concepts/graph-backends.md).
