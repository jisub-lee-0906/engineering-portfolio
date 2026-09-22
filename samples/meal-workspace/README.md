# Meal workspace validation sample

**New extraction/adaptation prepared on 2026-09-15**, not an original historical source release.

This small, dependency-free JavaScript sample was adapted from the owner's then-private meal-planning project, specifically `lib/workspace.ts` and the required validation/backup portions of `lib/planner.ts`. The [full application repository](https://github.com/jisub-lee-0906/auto-menu) is now public; this remains a separate adaptation, not the full application. This publication does not establish historical authorship, production reliability, or prior test coverage.

## What is demonstrated

- Versioned JSON workspace and exact-shape plan-backup validation.
- Seven named string menu slots; real calendar-date validation.
- Boolean lock/filter checks, bounded lists and strings, name deduplication.
- Plan-day cloning and preservation of menus on no-school days.

## Files and running

- `validation.mjs`: extracted validation functions, no dependencies.
- `validation.test.mjs`: 31 newly written tests using synthetic fixtures only.
- `TEST-RESULTS.txt`: preserved output from the 2026-09-15 ES2023+ REPL run.
- `NODE24-TEST-RESULTS.txt`: output actually observed from the Node 24.21.0 LTS CLI run on 2026-09-23.

With a modern Node.js runtime (Node 22+ supported; Node 24.21.0 LTS verified):

```sh
node --test --test-reporter=spec samples/meal-workspace/validation.test.mjs
```

The Node 24.21.0 LTS CLI run exercised ESM loading and completed successfully. Its runner summary reports one passing **test file**; that file prints `31/31 tests passed` for its 31 internal synthetic assertions. See [the recorded output](NODE24-TEST-RESULTS.txt). This is evidence for this adaptation only, not the original application or its production deployment.

The preserved 2026-09-15 [REPL record](TEST-RESULTS.txt) has a narrower scope: ESM export keywords and the local test import were removed and the exact remaining module/test bodies were evaluated together using `Function`. ESM loading itself was not exercised in that earlier run.

## Adaptation boundary

TypeScript annotations and application imports were removed; relevant checks and numeric limits were retained. `parseWorkspace(text, filterKeys)` now receives an explicit list of required boolean filter names, replacing the original catalog's `DEFAULT_MENU_FILTERS` dependency. The extra argument validation is new. Tests use the invented `syntheticPreference` filter, not the application's filter schema. This is therefore not a drop-in application build or a complete compatibility guarantee.

Workspace/history mutation, initial state, storage keys, UI, CSV generation, recommendation logic and unrelated planner utilities are omitted. Existing semantics are deliberately retained: extra workspace/lock/filter fields are projected away, while extra menu/day/backup fields are rejected; blank menu names are accepted; name deduplication occurs after the list-count check. String limits count JavaScript UTF-16 code units. The original local-Date validation is retained, including its runtime/timezone behavior; tests are not a timezone matrix. There is no pre-parse JSON byte limit. Consumers must impose their own input-size limits and provide a trusted filter schema. No nutrition or allergy safety claim is made.

Limits retained: 120 code units per menu/excluded name, 500 per note, 10,000 excluded names, 2,000 menus per saved list, and 3,660 planned days.

## Publication audit

Only the selected validation source was extracted. All fixtures were newly generated for this sample. No catalog records, third-party menu datasets, user workspaces, credentials, keys, private endpoints, operational documentation, original git history, or screenshots are included. No dataset redistribution rights are assumed. This sample adds no license and makes no change to the original repository's visibility or license.
