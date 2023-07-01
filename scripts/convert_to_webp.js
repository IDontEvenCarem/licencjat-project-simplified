const IMAGE_EXTENTIONS = ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']

const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

const QUALITY = process.argv[2] || 20

for(const file of fs.readdirSync('.')) {
    if (!IMAGE_EXTENTIONS.map(ext => file.endsWith(ext)).some(Boolean)) {
        continue;
    }
    const newName = `${path.parse(file).name}-${QUALITY}.webp`
    const res = childProcess.spawnSync('cwebp', [file, '-q', QUALITY, '-o', newName])
    const msg = res.status === 0 ? "OK" : ("ERR: " + res.stderr.toString())
    console.log(`${file} => ${newName} ${msg}`);
}
