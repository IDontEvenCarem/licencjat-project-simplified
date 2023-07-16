document.addEventListener("DOMContentLoaded", ev => {
    // top news carousel
    fetch('/api/top-news')
        .then(res => res.json())
        .then(json => {
            const els = json.map(neu => {
                const root = document.createElement('div')
                root.innerHTML = `
                    <div class="slider-article">
                        <figure class="slider-article--image is-square image 256x256">
                            <picture>
                                <source srcset="${neu.img.replace('WIDTH', 368)}" media="(max-width: 416px), (min-width: 770px) and (max-width: 1366px)" />
                                <source srcset="${neu.img.replace('WIDTH', 432)}" media="(min-width: 417px) and (max-width: 480px), (min-width: 1367px)" />
                                <img src="${neu.img.replace('WIDTH', 720)}">
                            </picture>
                        </figure>
                        <p class="slider-article--title">
                            ${neu.title}
                        </p>
                        <p class="slider-article--text">
                            ${neu.text}
                        </p>
                    </div>
                `
                return root;
            })
            const topCarousel = document.getElementById('top-carousel')
            topCarousel.replaceChildren.apply(topCarousel, els)
        })
        .then(_ => {
            $('#top-carousel').slick({dots: true, speed: 1000})
        })

    // post list
    fetch('/api/newsHeaders')
        .then(response => response.json())
        .then(json => {
            const postEls = json.map(post => {
                const root = document.createElement('div')
                root.classList.add('column', 'is-one-third')
                root.innerHTML = `
                    <div class="card has-shadow post-column">
                        <div class="card-image">
                            <figure class="image is-square">
                                <picture>
                                    <source srcset="${post.image.replace('WIDTH', 368)}" media="(max-width: 416px), (min-width: 770px) and (max-width: 1366px)" />
                                    <source srcset="${post.image.replace('WIDTH', 432)}" media="(min-width: 417px) and (max-width: 480px), (min-width: 1367px)" />
                                    <img src="${post.image.replace('WIDTH', 720)}">
                                </picture>
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="subtitle card-title">${post.title}</p>
                            <p>${post.first}</p>
                        </div>
                    </div>
                `
                return root
            })
            const postColumns = document.getElementById('post-columns')
            postColumns.replaceChildren.apply(postColumns, postEls)
        })

    // load the content-spec asynchronously
    ;(async () => {
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