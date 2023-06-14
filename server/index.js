const _ = require('lodash')
const fs = require('fs').promises
const path = require('path')
const fastify = require('fastify')({logger: true})

async function main () {
    fastify.register(require('@fastify/static'), {
        root: path.resolve(__dirname, '../public'),
        prefix: '/public/'
    })
    
    fastify.get('/', async (req, res) => {
        const fullpath = path.resolve(__dirname, '..', 'website', 'index.html');
        return res.sendFile(path.basename(fullpath), path.dirname(fullpath))
    })

    fastify.get('/*', async (req, res) => {
        const fullpath = path.resolve(__dirname, '..', 'website', req.params['*']); 
        return res.sendFile(path.basename(fullpath), path.dirname(fullpath))
    })

    fastify.get('/api/top-news', async (req, res) => {
        return [
            {
                img: "/public/img/fish.webp", 
                title: "Ryby w oceanie zaczynają mówić po angielsku - czy to koniec ciszy pod wodą?", 
                text: "Ostatnie doniesienia z oceanu wstrząsnęły światem nauki i przyrodników. Okazuje się, że ryby, które dotychczas komunikowały się za pomocą dźwięków i ruchów, zaczęły używać ludzkiego języka - angielskiego! To prawda, nie jest to żaden żart czy efekt szalonych eksperymentów, lecz obserwacje i analizy z renomowanych ośrodków badawczych na całym świecie."
            },
            {
                img: "/public/img/rabit.webp", 
                title: "Króliki zaczynają gryźć ludzi na ulicach miasta - nowe zagrożenie czy zwykła głodna pandemia?", 
                text: "W ostatnich tygodniach miastem wstrząsnęła seria niecodziennych ataków. Króliki, te z pozoru niewinne i miłe stworzenia, nagle zaczęły gryźć ludzi na ulicach, pozostawiając ich z zakrwawionymi rękoma i przerażonym wyrazem twarzy. Czy to nowe zagrożenie czy zwykła głodna pandemia?"
            },
            {
                img: "/public/img/potatoes.webp", 
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
            return {title, first, image: img || '/public/img/1.webp'}
        }))
    })

    fastify.get('/api/news', async (req, res) => {
        const posts = await fs.readdir(path.resolve(__dirname, "posts"))
        return await Promise.all(posts.map(async postFilename => {
            const contents = (await fs.readFile(path.resolve(__dirname, 'posts', postFilename))).toString()
            const [title,img,first, ...rest] = contents.split("\n");
            return {title, first, rest: rest, image: img || '/public/img/1.webp'}
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