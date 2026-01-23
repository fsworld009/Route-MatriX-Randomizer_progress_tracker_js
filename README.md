# Route MatriX Randomizer progress tracker JS

## Prerequisite

Randomized games with Multi world support (Boot the game by `boot.lua`).

When randomizing single game, please enable `Pseudo Multi Game` option.

## Integration

1. Include main JS file
```html
<body>
  <script src="/path/to/RMR_progress_tracker.js"></script>
</body>
```

2. Configure the tracker
```js
  // All options are optional. The values in the example will be used if not provided.
  window.RMRPTJS.configure({
    // base URL to RMR_progress_tracker.js path
    baseUrl: './progress_tracker_js/',
    /**
     * callbacks when receiving progress changes, function params are
     * (progress: {[id: string]: number}, acquiredItems: string[], newItems: string[])
     * 
     * progress: current progress
     * acquiredItems: all required items during the current play session
     * newAcquiredItems is a list of item IDs acquired between current report and previous report
     * The callbacks are called on receiving the first report.
     * Afterwards, callbacks are only called when there is progress
     * change.
     */
    callbacks: [],
    // progress report parsing interval (unit: ms)
    interval: 250,
    /**
     * if the number of newly acquired items exceeds threshold between two parsing intervals,
     * it is likely that we are loading another game or a previous save. In this case, callbacks will
     * receive empty acquiredItems and newAcquiredItems on the callback
     */
    rebootDetectionNewItemsThreshold: 10,
  });
```

3. Start the tracker and receive reports
```js
window.RMRPTJS.start();
```

4. load `RMR_progress_tracker.lua` in BizHawk after loading RMR `boot.lua`

If you are building UI with TypeScript, you can include the .d.ts for type support. Update
your tsconfig to include the type path in source:

```json
{
  "compilerOptions": {
    ...
  },
  "include": [..., "/path/to/RMR_progress_tracker/@types"]
}

```

### Progress Map properties

The first param `progress` passed to callbacks is a map of `{[id: string]: number}`.
Most of the IDs can be found in [RMR_progress_tracker_id_maps](./src/RMR_progress_tracker_id_maps.js).

Below are extra IDs added to map during parsing game states:

| ID | Purpose |
|------------------|---------|
| SIfg | IFG counter |
| SCurrentTitle | Current playing title. 1=X1, 2=X2, 3=X3 |
| SDeathCount | Total death counter |
| 1Enabled | is X1 enabled in the randomized game, 1=yes 0=no |
| 2Enabled | is X2 enabled in the randomized game, 1=yes 0=no |
| 3Enabled | is X3 enabled in the randomized game, 1=yes 0=no |
| 1SFinalClear | cleared final boss in X1, 1=yes 0=no |
| 2SFinalClear | cleared final boss in X2, 1=yes 0=no |
| 3SFinalClear | cleared final boss in X3, 1=yes 0=no |




## TODO

* Death count (`addrTiwns`)
* Track which games are enabled (`addrMultiworldInfo`, AutoTracker `multiConfig` parsing )
* Do we want to keep `acquiredItems` and `newAcquiredItems` during page refresh? We could utilize
localStorage, but how do we decide when to delete localStorage?