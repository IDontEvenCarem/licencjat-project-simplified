function createCarouselElement (img, title, text) {
    const wrapper = document.createElement('div')
    const topElement = document.createElement('div')
    topElement.classList.add("slider-article")
    const imgWrapper = document.createElement('figure')
    imgWrapper.classList.add("slider-article--image", "is-square", "image", "256x256")
    const imageElement = document.createElement("img")
    imageElement.src = img
    imgWrapper.appendChild(imageElement)
    const titleElement = document.createElement('p')
    titleElement.classList.add('slider-article--title')
    titleElement.innerText = title
    const textElement = document.createElement('p')
    textElement.classList.add("slider-article--text")
    textElement.innerText = text
    wrapper.appendChild(topElement)
    topElement.append(imgWrapper, titleElement, textElement)
    return wrapper
}

document.addEventListener("DOMContentLoaded", ev => {
    const carousel = document.getElementById("top-carousel")
    axios.get('/api/top-news')
        .then(response => {
            response.data.forEach(({img, title, text}) => {
                carousel.append(createCarouselElement(img, title, text))
            })
            $('#top-carousel').slick({dots: true, speed: 1000})
        })

    const posts = document.getElementById('post-columns')
    axios.get("/api/newsHeaders")
        .then(response => {
            _.chunk(response.data, 3).forEach(elems => {
                const innerText = elems.map(v => `<div class="column is-one-third">
                    <div class="card has-shadow">
                        <div class="card-image">
                            <figure class="image is-square">
                                <img src="/public/img/1.png" alt="Abstrakcyjna sztuka">
                            </figure>
                        </div>
                        <div class="card-content">
                            <p class="subtitle">${v.title}</p>
                            <p>${v.first}</p>
                        </div>
                    </div>
                </div>`).join('')
                posts.innerHTML += `<div class="columns">${innerText}</div>`
            })
        })
})