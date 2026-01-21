window.RMRPTJS = {
  init() {
    const script = document.createElement("script");
    script.src = "id_maps.js";
    script.onload = window.RMRPTJS.onMapLoaded;
    document.body.appendChild(script);
  },
  onMapLoaded() {
    setInterval(window.RMRPTJS.onInterval, 250);
  },
  onInterval() {
    console.log('interval start');

    const script = document.createElement("script");
    script.src = `progress.js?t=${Date.now()}`;
    script.onload = window.RMRPTJS.parseProgress;
    document.body.appendChild(script);

    console.log('interval end');
  },
  prevProgress: null,
  parseProgress() {
    console.log('parse progress');
    const parseConfigs = [
      { prop: 'items', mapName: 'itemName' },
      { prop: 'checks', mapName: 'checkName' },
    ];

    const progress = {}; // map of current progres, in format of {"ChOrItemId": value}
    const newItems = []; // a list of new items obtained since last check
    parseConfigs.forEach(({prop, mapName}) => {
      window.RMRPTJS.progress[prop].forEach((progValue, varIndex) => {
        let value = progValue;
        for(let bit = 0; bit <= 7; bit += 1) {
          const bitIndex = varIndex * 8 + bit;
          const name = window.RMRPTJS.maps[mapName][bitIndex];
          if (name) {
            const bitValue = value % 2;
            progress[name] = bitValue;
            if (prop === 'items' && bitValue === 1 && window.RMRPTJS.prevProgress && window.RMRPTJS.prevProgress[name] === 0) {
              newItems.push(name);
            }
          }
          value = Math.floor(value / 2);
        }
      });
    });

    console.log('parse progress done', newItems);
    window.RMRPTJS.prevProgress = progress;
  },
};





