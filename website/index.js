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
                        <img :src="neu.img.replace('-W{!}', '')">
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
                            <img 
                                :src="post.image.replace('-W{!}', '')" 
                                :srcset="\`\${post.image.replace('-W{!}', '-W512')} 512w, \${post.image.replace('-W{!}', '-W256')} 256w\`" 
                                sizes="(max-width: 864px) 256px, 512px"
                                alt="Abstrakcyjna sztuka"
                            >
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
})