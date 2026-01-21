window.RMRPTJS = {
  onMapLoaded() {
    setInterval(window.RMRPTJS.onInterval, 250);
  },
  onInterval() {
    const script = document.createElement("script");
    script.src = `progress.js?t=${Date.now()}`;
    script.onload = window.RMRPTJS.parseProgress;
    document.body.appendChild(script);
  },
  prevProgress: null,
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
    progressList = progressList.sort((a, b) => a[0] - b[0]);
    const progress = {};
    progressList.forEach(([id, value]) => {
      progress[id] = value;
    });

    window.RMRPTJS.prevProgress = progress;
    window.RMRPTJS.callbacks.forEach((callback) => {
      callback(progress, newItems);
    });
  },
  callbacks: [],

  // public interface
  onProgressUpdate(callback) {
    window.RMRPTJS.callbacks.push(callback);
  },

  start() {
    const script = document.createElement("script");
    script.src = "id_maps.js";
    script.onload = window.RMRPTJS.onMapLoaded;
    document.body.appendChild(script);
  },
};





