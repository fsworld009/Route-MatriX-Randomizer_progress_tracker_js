/**
 * check_id_maps.js
 * 2026/01/21 by fsworld009
 * Utility to create 'id_maps.js' for progress_tracker_js
 *
 * Usage: node check_id_maps.js path/to/RMR
 * Tested in Nodejs v24.4.1
 */

const path = require('path');
const fs = require('fs').promises;


(async function main(){
  const sourcePath = process.argv[2];
  const folderPath = path.resolve(__dirname, `${sourcePath}/data`);
  const outputFolderPath = path.resolve(__dirname, `../src/`);

  try {
    await fs.readdir(folderPath);
  } catch (e) {
    console.log('Unable to open folder', folderPath);
    console.error(e);
    process.exit(1);
  }

  const globalVarName = 'window.RMRPTJS.maps';
  const filenames = ['idItem.json', 'idCheck.json'];
  const mapNames = ['itemName', 'checkName']
  let outputContent = `${globalVarName} = {\n`;
  for (let i=0; i < filenames.length; i+=1) {
    const filename = filenames[i];
    let content;
    try {
      content = await fs.readFile(path.resolve(folderPath, filename));
    } catch (e) {
      console.log('Unable to read content of', filename);
      console.error(e);
      process.exit(1);
    }
    try {
      let idNames = [];
      let idList = JSON.parse(content);  // content is supposed to be a list of {k: string, v: number}
      // Remove duplicates in source content
      idList = idList.map((id) => JSON.stringify(id));
      idList = [... new Set(idList)].map((idStr) => JSON.parse(idStr));

      idList.forEach((id) => {
        idNames.push([id.v, id.k]);
        /**
         * For items, we need to create English IDs for "Multi world" items that number ID
         * starts at 768. These IDs are referenced in boot.lua (acquiredItem)
         * but don't have English ID in JSON.
         * Create these IDs from 1xxxx (Item 0~255) by
         * 1. Offset num ID to 768+num
         * 2. Replace the first letter `1` to `M` e.g. `MItLifeUp1`  `MItEnergyUp1`
         */
        if (filename === 'idItem.json' && id.k[0] === '1') {
          const multiWorldNumId = id.v + 768;
          const multiWorldEngId = `M${id.k.substr(1)}`;
          idNames.push([multiWorldNumId, multiWorldEngId]);
        }
      });

      if (filename === 'idItem.json') {
        // Manually insert ID 752 which is for unlocking Vava stage in X3
        idNames.push([572, '3ItKeyVavaStage']);
      }
      idNames = idNames.sort((a, b) => a[0] - b[0]);
      outputContent += `  ${mapNames[i]}: {\n`;
      outputContent += idNames.map((c) => `    "${c[0]}":"${c[1]}"`).join(',\n');
      outputContent += '\n  },\n';
    } catch (e) {
      console.log(`Failed to parse the content of ${filename} and create content for id_map.js`);
      console.error(e);
      process.exit(1);
    }
  }


  try {
    outputContent += '};\n';
    await fs.mkdir(outputFolderPath, { recursive: true });
    await fs.writeFile(
      path.resolve(outputFolderPath, 'id_maps.js'),
      outputContent,
      { }
    );
  } catch (e) {
    console.log(`Failed to write id_maps.js`);
    console.error(e);
    process.exit(1);
  }

  console.log('done');
})();
