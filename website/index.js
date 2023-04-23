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
    document.getElementById("top-carousel").append(
        createCarouselElement("/public/img/1.png", 
            "Ryby w oceanie zaczynają mówić po angielsku - czy to koniec ciszy pod wodą?", 
            "Ostatnie doniesienia z oceanu wstrząsnęły światem nauki i przyrodników. Okazuje się, że ryby, które dotychczas komunikowały się za pomocą dźwięków i ruchów, zaczęły używać ludzkiego języka - angielskiego! To prawda, nie jest to żaden żart czy efekt szalonych eksperymentów, lecz obserwacje i analizy z renomowanych ośrodków badawczych na całym świecie."
        ),
        createCarouselElement(
            "/public/img/2.png",
            "Króliki zaczynają gryźć ludzi na ulicach miasta - nowe zagrożenie czy zwykła głodna pandemia?",
            "W ostatnich tygodniach miastem wstrząsnęła seria niecodziennych ataków. Króliki, te z pozoru niewinne i miłe stworzenia, nagle zaczęły gryźć ludzi na ulicach, pozostawiając ich z zakrwawionymi rękoma i przerażonym wyrazem twarzy. Czy to nowe zagrożenie czy zwykła głodna pandemia?"
        ),
        createCarouselElement(
            "/public/img/3.png",
            "Wszyscy ludzie na świecie nagle przestają śnić - co za kosmiczna niespodzianka!",
            "Sny, te tajemnicze podróże przez niesamowite światy wyobraźni, od zawsze fascynowały ludzkość. Ale co się stanie, gdy nagle wszyscy ludzie na świecie przestaną śnić? To pytanie stało się aktualne, gdy naukowcy z całego świata ogłosili niezwykłe odkrycie - ludzie przestali śnić!"
        )
    );

    $('#top-carousel').slick({dots: true, speed: 1000})
})