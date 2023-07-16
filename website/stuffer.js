const arrr = Array(1_000_000).fill(0).map((v, i) => Math.sin(i)*Math.cos(i))

document.addEventListener('DOMContentLoaded', ev => {
    document.getElementById('luma-receiver').replaceChildren(
        ... Array(25).fill(0).map((v, i) => {
            const e = document.createElement('div')
            const luma = (i+1) * 10;
            e.classList.add("luma-bg", "fix-text")
            e.style.setProperty('--luma', luma)
            e.innerText = luma
            return e
        })
    )

    document.getElementById('grid-receiver').replaceChildren(
        ... Array(100).fill(0).map((_, row) => {
            const rowElement = document.createElement('div')
            rowElement.style.display = 'flex';
            rowElement.replaceChildren(
                ... Array(100).fill(0).map((_, col) => {
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