const childProcess = require('child_process')
const fs = require('fs')
const path = require('path')

const IMAGE_EXTENTIONS = ['.png', '.jpg', '.jpeg', '.tiff']
const QUALITY = process.argv[2] || 20

for(const file of fs.readdirSync('.')) {
    const pathParsed = path.parse(file)
    if (!IMAGE_EXTENTIONS.includes(pathParsed.ext)) {
        continue;
    }
    const newName = `${pathParsed.name}-${QUALITY}.webp`
    const res = childProcess.spawnSync('cwebp', [file, '-q', QUALITY, '-o', newName])
    const msg = res.status === 0 ? "OK" : ("ERR: " + res.stderr.toString())
    console.log(`${file} => ${newName} ${msg}`);
}
