import("https://cdn.jsdelivr.net/npm/chart.js").then(() => {
    // recent poll
    fetch('/api/lastPoll')
        .then(res => res.json())
        .then(json => {
            const chartEl = document.getElementById('recentPollChart')

            document.getElementById('recentPollTitle').innerText = json.temat
    
            new Chart(chartEl, {
                type: 'bar',
                data: {
                    labels: json.opcje_odpowiedzi,
                    datasets: [{
                        label: "Ilość odpowiedzi",
                        data: Object.values(json.wyniki),
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
