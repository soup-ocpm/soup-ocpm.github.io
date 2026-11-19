# Storage, catalog and preferences (`tool_storage`)

> **Source snapshot:** SOUP Studio archive dated 19 November 2026. This page is derived from the package's own README and manifest in that snapshot. [Source directory](https://github.com/soup-ocpm/soup/blob/main/soup-packages/tool_storage/).

## At a glance

| Property | Value |
| --- | --- |
| Package | `tool_storage` |
| Version | `1.0.0` |
| Contract API | `4.0` |
| Database compatibility (declared) | memgraph, neo4j |
| Required packages | None |
| Required tools | None |
| Provided tools | `storage`, `catalog`, `preferences` |
| Extension points opened | None |
| Frontend bundle | None |

## Python requirements declared by this package

```text
docker~=7.1.0
```

See [dependency management](lifecycle.md#python-dependencies) before installation.

## Package guide

Backend compatibility: **memgraph, neo4j**. Required packages: None.
Manifest-level tools: None. See the [manifest](https://github.com/soup-ocpm/soup/blob/main/soup-packages/tool_storage/soup-package.json) for Python
requirements.

## Storage, catalog and preferences

The package provides three globally named tools:

| Tool          | Storage and API                                                                                                                                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storage`     | `space(namespace)` returns a `StorageSpace`: `read(path) -> bytes`, `write(path, data: bytes)`, `exists(path)`, `delete(path)`, `list(prefix="") -> list[str]`, `subspace(name)`. `StorageTool` also provides `path_for(namespace, name)`, `namespaces()` and `delete_space(namespace)`. |
| `catalog`     | `add`, `get`, `list`, `children`, `update`, `remove`, `get_thumbnail`, `set_thumbnail`. Objects are JSON under `_catalog/objects/<id>.json`; thumbnails are SVG under `_catalog/thumbnails/<id>.svg`.                                                                                    |
| `preferences` | `get(key)` / `set(key, value)` persist JSON in `_catalog/preferences.json`.                                                                                                                                                                                                              |

The public API is [server/api.py](https://github.com/soup-ocpm/soup/blob/main/soup-packages/tool_storage/server/api.py). Importing `StorageTool`,
`StorageSpace`, `FileCatalog` or `FilePreferences` requires `tool_storage` in
`requires`; using a tool additionally requires its name in `requires_tools`. The
abstract `Catalog`, `Preferences` and `FileStorage` ports are core contracts.

`SOUP_STORAGE_KIND` selects `docker` (library default) or `local` (both shipped
Compose deployments). `SOUP_CONTAINER_NAME` defaults to `soup-database` for the
Docker backend; `SOUP_LOCAL_STORAGE_ROOT` defaults to `/soup`. Local storage
uses the filesystem directly. Docker storage uses the Docker SDK and requires
daemon access; the shipped application service does not mount the Docker socket.

Use a package-owned namespace. Namespace/file validation rejects empty names,
`..`, separators and a leading `_`; `_catalog` is not accessible through
`storage.space`. Use `subspace` instead of embedding path separators. `path_for`
returns an absolute Memgraph CSV path; the existing EKG deployment mounts the
same `/soup` path in both containers. It is not a Neo4j HTTP import URL.

Catalog reads use a lazy in-memory index with a lock guarding writes/index
changes. `reload()` refreshes it from disk. These contracts are persistence
interfaces, not a per-package filesystem sandbox.

See the [package developer documentation](https://github.com/soup-ocpm/soup/blob/main/soup-packages/README.md) for authoring, packaging
and lifecycle rules.


---

[All packages](index.md) · [Build a package](../../development/packages.md#build-a-complete-package) · [Package API](package-api.md)
