# SOUP Studio packages

SOUP Studio provides features through independently declared packages. This reference documents **all 18 packages included in the 19 November 2026 source archive**, plus the package-creation workflow. Descriptions and dependency declarations come from the archive manifests and package READMEs.

## Start developing

- [Getting started: scaffold your first package](getting-started.md)
- [Complete tutorial: JSON Lines importer, operation, visualizer and exporter](../../development/packages.md#build-a-complete-package)
- [Package API and manifest reference](package-api.md)
- [Cross-package extensions and EKG integration](extensions.md)
- [Installation, dependency management and lifecycle](lifecycle.md)

## Built-in and optional packages

| Package | Description | Database support¹ | Version |
| --- | --- | --- | --- |
| [`causal_df`](causal_df.md) | Contributes the causal :DF build step (order 450) to ekg.build_steps, for trigger/target entity-type pairs. | memgraph | `1.0.0` |
| [`csv_ekg`](csv_ekg.md) | Imports CSV files as event logs and builds their EKG on Memgraph (the import of the old New dataset page), with the multiplicities between entity columns in the preview, and converts csv_table tables into EKGs. | memgraph | `1.0.0` |
| [`csv_table`](csv_table.md) | Imports CSV/TSV files as tables (Python's csv module): remote paging, sorting and column filters, a column profile, the distribution of a column as a report and the CSV export. | memgraph/neo4j | `1.0.0` |
| [`ekg`](ekg.md) | Event log (normalization, entities, canonical CSV), datasets on the volume and the EKG on Memgraph: build pipeline, graph state of the 'ekg' objects and the datasets already on the volume added to the catalog. | memgraph | `1.0.0` |
| [`ekg_analysis`](ekg_analysis.md) | Analyses of 'ekg' objects as operations (filters contributed to ekg.analysis_filters, applied with a compensating rollback), the legacy analyses on the volume, the example and the export of a configuration, and the process indicators. | memgraph | `1.0.0` |
| [`ekg_class_graph`](ekg_class_graph.md) | The aggregate (class) graph of an 'ekg' object as an 'ekg_class' object: Class nodes, OBSERVED and DF_C relationships, its view, queries and JSON parts, its visualizers, and an Observer that removes the classes before the graph is reset or filtered. | memgraph | `1.0.0` |
| [`ekg_views`](ekg_views.md) | Visualizers and exporter of Memgraph 'ekg' and Memgraph/Neo4j 'oced_importer.log' objects: the graph (views contributed to ekg.graph_views), the statistics, the queries contributed to ekg.queries and the JSON of the graph (parts contributed to ekg.json_parts); the statistics show the notices contributed to ekg.stats_notices. | memgraph/neo4j | `1.0.0` |
| [`graph_explorer`](graph_explorer.md) | Read-only incremental exploration and application-stored graph scenes. | memgraph/neo4j | `1.0.0` |
| [`ocean_aggregation`](ocean_aggregation.md) | Configure original OCEAN aggregations on selected Neo4j OCED or Memgraph EKG datasets and explore Class/DF_C graphs. | memgraph/neo4j | `1.0.0` |
| [`oced_importer`](oced_importer.md) | Import OCED event/object CSV tables into dataset-scoped EKGs on Memgraph or Neo4j. | memgraph/neo4j | `1.2.0` |
| [`ocel`](ocel.md) | Imports OCEL 2.0 JSON logs (.json, .jsonocel) as tables in the package's storage space or as EKGs on Memgraph, shows the tables and a summary, decomposes the tables into an EKG (with the qualifiers on :CORR and the object-object relationships as :REL, through its step in ekg.build_steps) and exports them as OCEL 2.0 JSON. | memgraph | `1.1.0` |
| [`ocel2_oced_bridge`](ocel2_oced_bridge.md) | Import OCEL 2.0 JSON as a dedicated Neo4j EKG through the existing OCED importer. For native OCEL tables and PM4Py, select the existing OCEL 2.0 as tables importer. | memgraph/neo4j | `1.1.0` |
| [`pm4py_ocdfg`](pm4py_ocdfg.md) | OC-DFG discovery with interactive frequency/performance views and JSON, SVG and DOT exports. | memgraph | `1.1.3` |
| [`promg_bpic17`](promg_bpic17.md) | PromG BPIC17 Neo4j importer with non-destructive SOUP EKG normalization and legacy dataset migration. | neo4j | `1.1.0` |
| [`soup_base`](soup_base.md) | Reusable elements (text, markdown, image, table, chart, graph...), the Report visualizer and the JSON export of reports. | memgraph/neo4j | `1.0.0` |
| [`text`](text.md) | Imports text files (.txt, .md, .log) into the package's storage space and shows them as text or markdown. | memgraph/neo4j | `1.0.0` |
| [`tool_memgraph`](tool_memgraph.md) | Provides the 'memgraph' tool: parameterized Cypher queries and the active graph. | memgraph | `1.0.0` |
| [`tool_storage`](tool_storage.md) | Provides the 'storage' (files by namespace), 'catalog' (workspace objects) and 'preferences' tools. | memgraph/neo4j | `1.0.0` |

¹ Database support is **declared manifest compatibility**, not a guarantee that all optional capabilities work against every backend. A manifest without `databases` defaults to Memgraph in this source version. Consult each package guide for restrictions.

## Recommended learning route

1. Read [Getting started](getting-started.md) and generate a package from the existing template.
2. Follow the [complete tutorial](../../development/packages.md#build-a-complete-package), which includes working server and browser examples.
3. Consult [Package API](package-api.md) for contracts, manifests, tool access, database scoping, and validation.
4. Use [Extensions](extensions.md) for EKG build steps, query and analysis contributions, events, and backend-specific integration.
5. Finish with [Lifecycle](lifecycle.md) for Python dependencies, local builds, ZIP installation, upgrades, and safe package shutdown.

## Maintainer guidance

- Treat the package `soup-package.json`, `requirements.txt`, public `api.py`, `server/plugin.py`, and tests as authoritative when behavior changes.
- Update the matching website page whenever a package changes its manifest or public capabilities.
- Do not assume third-party Python libraries are installed simply because requirements are declared.
- Test both declared databases if supporting Memgraph and Neo4j, and verify dataset-scoped access.
- For community contributions, ship package source, manifest, tests, documentation, and versioned ZIP; keep reviews and dependency approval explicit.
