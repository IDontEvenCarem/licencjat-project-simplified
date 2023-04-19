const _ = require('lodash')
const fs = require('fs').promises
const path = require('path')
const fastify = require('fastify')({logger: true})
const simpleGit = require('simple-git')

const thisGit = simpleGit.simpleGit('.')

function keburr (input) {
    return _.kebabCase(_.deburr(input))
}

async function main () {
    await thisGit.fetch(['--all'])
    await thisGit.pull(['--all'])
    const branches = await thisGit.branch()
    for(const branch of branches.all) {
        const keburrBranch = keburr(branch)
        const websiteDir = await thisGit.show(`${branch}:website`)
        const files = websiteDir.split('\n').slice(2).filter(v => v.length > 0);
        for(const file of files) {
            const contents = await thisGit.show(`${branch}:website/${file}`)
            const filepath = path.resolve(__dirname, 'tmp', keburrBranch, file)
            console.log(filepath)
            await fs.mkdir(path.dirname(filepath), {recursive: true})
            await fs.writeFile(filepath, contents)
        }
    }

    branches.all.forEach(branch => console.log(branch))

    fastify.register(require('@fastify/static'), {
        root: path.resolve(__dirname, './public'),
        prefix: '/public/'
    })
    
    fastify.get('/', async (req, res) => {
        res.type('text/html')
        .send(`<html><body><h1>Branches available:</h1><ul>${branches.all.map(v => `<li><a href="/website/${_.deburr(_.kebabCase(v))}">${v}</a></li>`).join('')}</ul></body></html>`)
    })

    fastify.get('/website/:branch', async (req, res) => {
        const fullpath = path.resolve(__dirname, 'tmp', req.params.branch, 'index.html'); 
        return res.sendFile(path.basename(fullpath), path.dirname(fullpath))
    })

    fastify.get('/website/:branch/*', async (req, res) => {
        const fullpath = path.resolve(__dirname, 'tmp', req.params.branch, req.params['*']); 
        return res.sendFile(path.basename(fullpath), path.dirname(fullpath))
    })

    try {
        await fastify.listen({port: 8012})
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}



main()