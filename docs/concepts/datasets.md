# Datasets and workspaces

A dataset is the unit of data a user selects to work with. A workspace provides the surrounding context for the selected dataset and the packages using it.

## Why context matters

A running instance may manage multiple datasets. Packages that read graphs need to know **which dataset** and **which graph database** are currently selected. These should be explicit inputs to package operations, not implicit defaults.

## Neo4j database isolation

Recent SOUP development has explored storing datasets in distinct Neo4j databases inside one instance. Whether this is enabled depends on the actual version and configuration of your deployment.

> **Verify on your version**
> Do not assume one database per dataset is already deployed everywhere. Check database creation, switching, naming, and permissions in the running system.

## Package responsibilities

Packages should use the active dataset context and avoid changing graph data as a side effect of read-only exploration.
