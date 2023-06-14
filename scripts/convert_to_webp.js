const IMAGE_EXTENTIONS = ['.png', '.jpg', '.jpeg', '.tiff', '.bmp']

const childProcess = require('child_process')
const fs = require('fs')

for(const file of fs.readdirSync('.')) {
    if (!IMAGE_EXTENTIONS.map(ext => file.endsWith(ext)).some(Boolean)) {
        continue;
    }
    const newName = file.replace(/\.\w+$/, '.webp')
    const res = childProcess.spawnSync('ffmpeg', ['-i', file, newName])
    const msg = res.status === 0 ? "OK" : ("ERR: " + res.stderr.toString())
    console.log(`${file} => ${newName} ${msg}`);
}
