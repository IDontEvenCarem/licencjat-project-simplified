const _ = require('lodash')
const fs = require('fs').promises
const path = require('path')
const fastify = require('fastify')({logger: true})
const simpleGit = require('simple-git')

const thisGit = simpleGit.simpleGit('.')

async function main () {
    await thisGit.fetch(['--all'])
    await thisGit.pull(['--all'])
    const branches = await thisGit.branch()
    await fs.mkdir(path.resolve(__dirname, './tmp'))
    for(const branch of branches.all.filter(v => v.startsWith)) {
        
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
        return `you got the branch ${req.params.branch}`
    })

    try {
        await fastify.listen({port: 8012})
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}



main()