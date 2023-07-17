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

const arrr = Array(1_000_000).fill(0).map((v, i) => Math.sin(i)*Math.cos(i))

document.addEventListener('DOMContentLoaded', ev => {
    const lumaReceiver = document.getElementById('luma-receiver')
    lumaReceiver.replaceChildren.apply(lumaReceiver, Array(25).fill(0).map((v, i) => {
            const e = document.createElement('div')
            const luma = (i+1) * 10;
            e.classList.add("luma-bg", "fix-text")
            e.style.setProperty('--luma', luma)
            e.innerText = luma
            return e
        })
    )

    const gridReceiver = document.getElementById('grid-receiver')
    gridReceiver.replaceChildren.apply(gridReceiver,
        Array(100).fill(0).map((_, row) => {
            const rowElement = document.createElement('div')
            rowElement.style.display = 'flex';
            rowElement.replaceChildren.apply(rowElement,
                Array(100).fill(0).map((_, col) => {
                    const cellElem = document.createElement('div')
                    cellElem.classList.add('grid-element', 'col-'+col, 'row-'+row)
                    cellElem.style.setProperty('--col', col)
                    cellElem.style.setProperty('--row', row)
                    cellElem.innerText = `${row.toString().padStart(2, '0')} ${col.toString().padStart(2, '0')}`
                    return cellElem
                })
            )
            return rowElement
        })
    )
})