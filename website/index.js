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
                        <img :src="neu.img">
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
        template: `
            <div v-for="post in posts" class="column is-one-third">
                <div class="card has-shadow post-column">
                    <div class="card-image">
                        <figure class="image is-square">
                            <img :src="post.image" alt="Abstrakcyjna sztuka">
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

    // recent poll
    axios.get('/api/lastPoll').then(response => {
        const chartEl = document.getElementById('recentPollChart')

        document.getElementById('recentPollTitle').innerText = response.data.temat

        new Chart(chartEl, {
            type: 'bar',
            data: {
                labels: response.data.opcje_odpowiedzi,
                datasets: [{
                    label: "Ilość odpowiedzi",
                    data: Object.values(response.data.wyniki),
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    })
})