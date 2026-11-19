# Packages

Packages are the primary extension mechanism for SOUP. A package can introduce functionality while using services and context exposed by the core application.

## Documenting a package

Each package page should answer four questions:

1. What problem does it solve?
2. Which SOUP version and graph backends does it support?
3. How does a user access it?
4. What limitations or requirements apply?

Add more rows as you confirm the installed package inventory.


## Packages overview

```mermaid
flowchart LR
  %% Arrow A --> B means A declares B in requires.
  %% Source: soup-19nov.zip, soup-package.json manifests.
  subgraph Infrastructure["Infrastructure"]
    soup_base["soup_base"]
    tool_storage["tool_storage"]
    tool_memgraph["tool_memgraph"]
  end
  subgraph Import_and_data_handling["Import and data handling"]
    text["text"]
    csv_table["csv_table"]
    csv_ekg["csv_ekg"]
    ocel["ocel"]
    oced_importer["oced_importer"]
    ocel2_oced_bridge["ocel2_oced_bridge"]
    promg_bpic17["promg_bpic17"]
  end
  subgraph EKG_foundation_and_visualization["EKG foundation and visualization"]
    ekg["ekg"]
    ekg_views["ekg_views"]
    graph_explorer["graph_explorer"]
  end
  subgraph Analysis_and_extensions["Analysis and extensions"]
    ekg_analysis["ekg_analysis"]
    ekg_class_graph["ekg_class_graph"]
    causal_df["causal_df"]
    pm4py_ocdfg["pm4py_ocdfg"]
    ocean_aggregation["ocean_aggregation"]
  end
  causal_df --> ekg
  csv_ekg --> ekg
  csv_ekg --> soup_base
  csv_ekg --> csv_table
  csv_table --> soup_base
  csv_table --> tool_storage
  ekg --> tool_memgraph
  ekg --> tool_storage
  ekg_analysis --> ekg
  ekg_analysis --> ekg_views
  ekg_analysis --> soup_base
  ekg_class_graph --> ekg
  ekg_class_graph --> ekg_views
  ekg_class_graph --> soup_base
  ekg_views --> soup_base
  graph_explorer --> soup_base
  graph_explorer --> tool_storage
  ocean_aggregation --> soup_base
  ocean_aggregation --> tool_storage
  oced_importer --> tool_storage
  ocel --> soup_base
  ocel --> ekg
  ocel --> ekg_views
  ocel --> tool_storage
  ocel2_oced_bridge --> oced_importer
  pm4py_ocdfg --> soup_base
  pm4py_ocdfg --> ocel
  pm4py_ocdfg --> ekg
  pm4py_ocdfg --> tool_storage
  pm4py_ocdfg --> tool_memgraph
  promg_bpic17 --> tool_storage
  promg_bpic17 --> ekg_views
  text --> soup_base
  text --> tool_storage
  style soup_base fill:#E6EDF7,stroke:#60758a,color:#17283a
  style tool_storage fill:#E6EDF7,stroke:#60758a,color:#17283a
  style tool_memgraph fill:#E6EDF7,stroke:#60758a,color:#17283a
  style text fill:#E2F2EB,stroke:#60758a,color:#17283a
  style csv_table fill:#E2F2EB,stroke:#60758a,color:#17283a
  style csv_ekg fill:#E2F2EB,stroke:#60758a,color:#17283a
  style ocel fill:#E2F2EB,stroke:#60758a,color:#17283a
  style oced_importer fill:#E2F2EB,stroke:#60758a,color:#17283a
  style ocel2_oced_bridge fill:#E2F2EB,stroke:#60758a,color:#17283a
  style promg_bpic17 fill:#E2F2EB,stroke:#60758a,color:#17283a
  style ekg fill:#E7EBFB,stroke:#60758a,color:#17283a
  style ekg_views fill:#E7EBFB,stroke:#60758a,color:#17283a
  style graph_explorer fill:#E7EBFB,stroke:#60758a,color:#17283a
  style ekg_analysis fill:#FFF0DA,stroke:#60758a,color:#17283a
  style ekg_class_graph fill:#FFF0DA,stroke:#60758a,color:#17283a
  style causal_df fill:#FFF0DA,stroke:#60758a,color:#17283a
  style pm4py_ocdfg fill:#FFF0DA,stroke:#60758a,color:#17283a
  style ocean_aggregation fill:#FFF0DA,stroke:#60758a,color:#17283a
```