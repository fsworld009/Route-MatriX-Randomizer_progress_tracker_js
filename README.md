# Route MatriX Randomizer progress tracker JS

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
    baseUrl: './RMR_progress_tracker/',
    /**
     * callbacks when receiving progress report, function params are
     * (progress: {[id: string]: number}, acquiredItems: string[], newItems: string[])
     * 
     * progress: current progress
     * acquiredItems: all required items during the current play session
     * newAcquiredItems is a list of item IDs acquired between current report and previous report
     */
    callbacks: [],
    // progress report parsing interval (unit: ms)
    interval: 250,
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

## TODO

Do we want to keep `acquiredItems` and `newAcquiredItems` during page refresh? We could utilize
localStorage, but how do we decide when to delete localStorage?