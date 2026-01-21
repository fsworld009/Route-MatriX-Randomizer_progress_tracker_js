window.RMRPTJS = {
  onMapLoaded() {
    setInterval(window.RMRPTJS.onInterval, window.RMRPTJS.options.interval);
  },
  onInterval() {
    const script = document.createElement("script");
    script.src = `${window.RMRPTJS.options.baseUrl}RMR_progress_tracker_report.js?t=${Date.now()}`;
    script.onload = function() {
      window.RMRPTJS.parseProgress();
      script.remove();
    }
    document.body.appendChild(script);
  },
  prevProgress: null,
  acquiredItems: [],
  parseProgress() {
    const parseConfigs = [
      { prop: 'items', mapName: 'itemId' },
      { prop: 'checks', mapName: 'checkId' },
    ];

    let progressList = []; // list of current progress, in format of ["CheckOrItemId": value]
    const newItems = []; // a list of new item IDs obtained since last check
    parseConfigs.forEach(({prop, mapName}) => {
      window.RMRPTJS.progress[prop].forEach((progValue, varIndex) => {
        let value = progValue;
        for(let bit = 0; bit <= 7; bit += 1) {
          const bitIndex = varIndex * 8 + bit;
          const id = window.RMRPTJS.maps[mapName][bitIndex];
          if (id) {
            const bitValue = value % 2;
            progressList.push([id, bitValue]);
            if (
              prop === 'items' && bitValue === 1 && !id.match(/^It.+$/) &&
              window.RMRPTJS.prevProgress && window.RMRPTJS.prevProgress[id] === 0
            ) {
              newItems.push(id);
            }
          }
          value = Math.floor(value / 2);
        }
      });
    });

    progressList.push(['SIfg', window.RMRPTJS.progress['ifg']]);
    progressList.push(['SCurrentGame', window.RMRPTJS.progress['currentGame']]);
    window.RMRPTJS.progress['clear'].forEach((value, index) => {
      progressList.push([`${index+1}AllClear`, value]);
    });

    progressList = progressList.sort((a, b) => a[0] - b[0]);
    const progress = {};
    progressList.forEach(([id, value]) => {
      progress[id] = value;
    });

    window.RMRPTJS.prevProgress = progress;
    window.RMRPTJS.options.callbacks.forEach((callback) => {
      callback(progress, window.RMRPTJS.acquiredItems, newItems);
    });
    window.RMRPTJS.acquiredItems = window.RMRPTJS.acquiredItems.concat(newItems);
  },
  options: {
    baseUrl: './RMR_progress_tracker/',
    interval: 250,
    callbacks: [],
  },

  // public interface
  configure(options) {
    Object.assign(window.RMRPTJS.options, options);
  },

  start() {
    const script = document.createElement("script");
    script.src = `${window.RMRPTJS.options.baseUrl}RMR_progress_tracker_id_maps.js`;
    script.onload = window.RMRPTJS.onMapLoaded;
    document.body.appendChild(script);
  },
};





