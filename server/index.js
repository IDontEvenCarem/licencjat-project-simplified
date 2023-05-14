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
            await fs.mkdir(path.dirname(filepath), {recursive: true})
            await fs.writeFile(filepath, contents)
        }
    }

    fastify.register(require('@fastify/static'), {
        root: path.resolve(__dirname, '../public'),
        prefix: '/public/'
    })
    
    fastify.get('/', async (req, res) => {
        res.type('text/html')
            .send(`<html><body><h1>Current developement:</h1><a href="/dev/">website</a><h1>Branches available:</h1><ul>${branches.all.map(v => `<li><a href="/website/${_.deburr(_.kebabCase(v))}">${v}</a></li>`).join('')}</ul></body></html>`)
    })

    fastify.get('/dev', async (req, res) => {
        const fullpath = path.resolve(__dirname, '..', 'website', 'index.html');
        return res.sendFile(path.basename(fullpath), path.dirname(fullpath))
    })

    fastify.get('/dev/*', async (req, res) => {
        const fullpath = path.resolve(__dirname, '..', 'website', req.params['*']); 
        return res.sendFile(path.basename(fullpath), path.dirname(fullpath))
    })

    fastify.get('/website/:branch', async (req, res) => {
        const fullpath = path.resolve(__dirname, 'tmp', req.params.branch, 'index.html');
        const content = await fs.readFile(fullpath)
        const basefixed = content.toString().replace(`<base href="/dev/">`, `<base href="/website/${req.params.branch}">`)
        res.type('text/html').send(basefixed)
    })

    fastify.get('/website/:branch/*', async (req, res) => {
        const fullpath = path.resolve(__dirname, 'tmp', req.params.branch, req.params['*']);
        if (req.params['*'].endsWith('.html')) {
            const content = await fs.readFile(fullpath)
            const basefixed = content.toString().replace(`<base href="/dev/">`, `<base href="/website/${req.params.branch}">`)
            res.type('text/html').send(basefixed)
        } else {
            return res.sendFile(path.basename(fullpath), path.dirname(fullpath))
        }
    })

    fastify.get('/api/top-news', async (req, res) => {
        return [
            {
                img: "/public/img/fish.png", 
                title: "Ryby w oceanie zaczynają mówić po angielsku - czy to koniec ciszy pod wodą?", 
                text: "Ostatnie doniesienia z oceanu wstrząsnęły światem nauki i przyrodników. Okazuje się, że ryby, które dotychczas komunikowały się za pomocą dźwięków i ruchów, zaczęły używać ludzkiego języka - angielskiego! To prawda, nie jest to żaden żart czy efekt szalonych eksperymentów, lecz obserwacje i analizy z renomowanych ośrodków badawczych na całym świecie."
            },
            {
                img: "/public/img/rabit.png", 
                title: "Króliki zaczynają gryźć ludzi na ulicach miasta - nowe zagrożenie czy zwykła głodna pandemia?", 
                text: "W ostatnich tygodniach miastem wstrząsnęła seria niecodziennych ataków. Króliki, te z pozoru niewinne i miłe stworzenia, nagle zaczęły gryźć ludzi na ulicach, pozostawiając ich z zakrwawionymi rękoma i przerażonym wyrazem twarzy. Czy to nowe zagrożenie czy zwykła głodna pandemia?"
            },
            {
                img: "/public/img/potatoes.png", 
                title: "Wymyśliliśmy maszynę, która zamienia ziemniaki w diamenty", 
                text: "Naukowcy przełamali kolejną granicę technologiczną - wymyślili maszynę, która zamienia ziemniaki w diamenty! Tak, dobrze przeczytaliście, twoje zwykłe, szare ziemniaki mogą stać się diamentami, dzięki najnowszej technologii."
            }
        ]
    })

    fastify.get('/api/newsHeaders', async (req, res) => {
        const posts = await fs.readdir(path.resolve(__dirname, "posts"))
        return await Promise.all(posts.map(async postFilename => {
            const contents = (await fs.readFile(path.resolve(__dirname, 'posts', postFilename))).toString()
            const [title,img,first, ...rest] = contents.split("\n");
            return {title, first, image: img || '/public/img/1.png'}
        }))
    })

    fastify.get('/api/news', async (req, res) => {
        const posts = await fs.readdir(path.resolve(__dirname, "posts"))
        return await Promise.all(posts.map(async postFilename => {
            const contents = (await fs.readFile(path.resolve(__dirname, 'posts', postFilename))).toString()
            const [title,img,first, ...rest] = contents.split("\n");
            return {title, first, rest: rest, image: img || '/public/img/1.png'}
        }))
    })

    fastify.get('/api/lastPoll', (req, res) => {
        return {
            "temat": "Czy optymistycznie patrzysz na przyszłość?",
            "opcje_odpowiedzi": [
              "Zdecydowanie tak",
              "Raczej tak",
              "Nie mam zdania",
              "Raczej nie",
              "Zdecydowanie nie"
            ],
            "wyniki": {
              "Zdecydowanie tak": 35,
              "Raczej tak": 45,
              "Nie mam zdania": 15,
              "Raczej nie": 3,
              "Zdecydowanie nie": 2
            }
          }
          
    })

    try {
        await fastify.listen({port: 8012})
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}



main()