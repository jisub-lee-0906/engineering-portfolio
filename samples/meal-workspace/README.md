# Meal workspace validation sample

**New extraction/adaptation prepared on 2026-09-15**, not an original historical source release.

This small, dependency-free JavaScript sample is adapted from the owner's private meal-planning project, specifically `lib/workspace.ts` and the required validation/backup portions of `lib/planner.ts`. The full application remains private. This publication does not establish historical authorship, production reliability, or prior test coverage.

## What is demonstrated

- Versioned JSON workspace and exact-shape plan-backup validation.
- Seven named string menu slots; real calendar-date validation.
- Boolean lock/filter checks, bounded lists and strings, name deduplication.
- Plan-day cloning and preservation of menus on no-school days.

## Files and running

- `validation.mjs`: extracted validation functions, no dependencies.
- `validation.test.mjs`: 31 newly written tests using synthetic fixtures only.
- `TEST-RESULTS.txt`: output actually observed when executing the adapted source and tests.

With a modern Node.js runtime (Node 20+ recommended):

```sh
node samples/meal-workspace/validation.test.mjs
```

The recorded run used an ES2023+ JavaScript REPL, not Node or GitHub CI. For that run only, ESM export keywords and the local test import were removed and the exact remaining module/test bodies were evaluated together using `Function`. ESM loading itself was not exercised. All 31 tests passed; this is evidence for this adaptation only, not the original application or its production deployment.

## Adaptation boundary

TypeScript annotations and application imports were removed; relevant checks and numeric limits were retained. `parseWorkspace(text, filterKeys)` now receives an explicit list of required boolean filter names, replacing the private catalog's `DEFAULT_MENU_FILTERS` dependency. The extra argument validation is new. Tests use the invented `syntheticPreference` filter, not the application's filter schema. This is therefore not a drop-in application build or a complete compatibility guarantee.

Workspace/history mutation, initial state, storage keys, UI, CSV generation, recommendation logic and unrelated planner utilities are omitted. Existing semantics are deliberately retained: extra workspace/lock/filter fields are projected away, while extra menu/day/backup fields are rejected; blank menu names are accepted; name deduplication occurs after the list-count check. String limits count JavaScript UTF-16 code units. The original local-Date validation is retained, including its runtime/timezone behavior; tests are not a timezone matrix. There is no pre-parse JSON byte limit. Consumers must impose their own input-size limits and provide a trusted filter schema. No nutrition or allergy safety claim is made.

Limits retained: 120 code units per menu/excluded name, 500 per note, 10,000 excluded names, 2,000 menus per saved list, and 3,660 planned days.

## Publication audit

Only the selected validation source was extracted. All fixtures were newly generated for this sample. No catalog records, third-party menu datasets, user workspaces, credentials, keys, private endpoints, operational documentation, original git history, or screenshots are included. No dataset redistribution rights are assumed. This sample adds no license and makes no change to the original repository's visibility or license.
