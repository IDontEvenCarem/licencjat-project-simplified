document.addEventListener("DOMContentLoaded", ev => {
    const {createApp} = Vue;

    // top news carousel
    createApp({
        data() {
            return {
                topNews: []
            }
        },
        mounted() {
            axios.get('/api/top-news').then(response => {
                this.topNews = response.data;
                requestAnimationFrame(() => {
                    $('#top-carousel').slick({dots: true, speed: 1000})
                })
            })
        },
        template: `
            <div v-for="neu in topNews">
                <div class="slider-article">
                    <figure class="slider-article--image is-square image 256x256">
                        <picture>
                            <source :srcset="neu.img.replace('WIDTH', 368)" media="(max-width: 416px), (min-width: 770px) and (max-width: 1366px)" />
                            <source :srcset="neu.img.replace('WIDTH', 432)" media="(min-width: 417px) and (max-width: 480px), (min-width: 1367px)" />
                            <img :src="neu.img.replace('WIDTH', 720)">
                        </picture>
                    </figure>
                    <p class="slider-article--title">
                        {{neu.title}}
                    </p>
                    <p class="slider-article--text">
                        {{neu.text}}
                    </p>
                </div>
            </div>
        `
    }).mount('#top-carousel')

    // post list
    createApp({
        data() {
            return {
                posts: []
            }
        },
        mounted() {
            axios.get("/api/newsHeaders").then(response => {
                this.posts = response.data;
            })
        },
        /* TODO: srcset/sizes needs to reflect the small device width, when the images grow, because they are not in a 3 column grid */
        template: `
            <div v-for="post in posts" class="column is-one-third">
                <div class="card has-shadow post-column">
                    <div class="card-image">
                        <figure class="image is-square">
                            <picture>
                                <source :srcset="post.image.replace('WIDTH', 368)" media="(max-width: 416px), (min-width: 770px) and (max-width: 1366px)" />
                                <source :srcset="post.image.replace('WIDTH', 432)" media="(min-width: 417px) and (max-width: 480px), (min-width: 1367px)" />
                                <img :src="post.image.replace('WIDTH', 720)">
                            </picture>
                        </figure>
                    </div>
                    <div class="card-content">
                        <p class="subtitle card-title">{{post.title}}</p>
                        <p>{{post.first}}</p>
                    </div>
                </div>
            </div>
        `
    }).mount("#post-columns");

    // load the content-spec asynchronously
    (async () => {
        const streamDoc = document.implementation.createHTMLDocument()
        const decoder = new TextDecoderStream('utf-8')
        const dlStream = await fetch('content-spec.html')
        
        decoder.readable.pipeTo(new WritableStream(
            {
                close() {
                    const asyncDocument = streamDoc.body.firstChild
                    asyncDocument.remove()
                    document.getElementById('replace-with-standard').replaceWith(asyncDocument)
                },
                abort() {
                    alert(`Failed to load async content, reason - ${reason}`)
                },
                write(chunk) {
                    streamDoc.write(chunk)
                }
            },
            {
                highWaterMark: 1024,
                size(chunk) {
                    return chunk.length
                }
            }
        ))
        dlStream.body.pipeTo(decoder.writable)
    })()
})