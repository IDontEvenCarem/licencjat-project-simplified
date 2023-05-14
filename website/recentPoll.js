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