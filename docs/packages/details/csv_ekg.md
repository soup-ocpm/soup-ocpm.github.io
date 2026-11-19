# CSV as event log (EKG) (`csv_ekg`)

> **Source snapshot:** SOUP Studio archive dated 19 November 2026. This page is derived from the package's own README and manifest in that snapshot. [Source directory](https://github.com/soup-ocpm/soup/blob/main/soup-packages/csv_ekg/).

## At a glance

| Property | Value |
| --- | --- |
| Package | `csv_ekg` |
| Version | `1.0.0` |
| Contract API | `4.0` |
| Database compatibility (declared) | memgraph |
| Required packages | `ekg`, `soup_base`, `csv_table` |
| Required tools | `memgraph`, `storage` |
| Provided tools | None |
| Extension points opened | None |
| Frontend bundle | None |

## Python requirements declared by this package

```text
pandas==2.2.3
numpy==2.2.6
```

See [dependency management](lifecycle.md#python-dependencies) before installation.

## Package guide

Backend compatibility: **memgraph**. Required packages: `ekg`, `soup_base`,
`csv_table`. Manifest-level tools: `memgraph`, `storage`. See the
[manifest](https://github.com/soup-ocpm/soup/blob/main/soup-packages/csv_ekg/soup-package.json) for Python requirements.

**CSV as event log (EKG on Memgraph)** importer (`.csv`, kind `ekg`), providing
previews, event/time/activity/entity/value mappings, trigger/target and timing
fields, and a multiplicity graph (1:1, 1:N, N:1, N:N) when there are at least
two entity columns. **Convert to EKG** operation (`csv_table` `table` → child
`ekg`).

See the [package developer documentation](https://github.com/soup-ocpm/soup/blob/main/soup-packages/README.md) for authoring, packaging
and lifecycle rules.


---

[All packages](index.md) · [Build a package](../../development/packages.md#build-a-complete-package) · [Package API](package-api.md)
