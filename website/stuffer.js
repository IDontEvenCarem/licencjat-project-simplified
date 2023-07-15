const arrr = [...[...Array(1_000_000)].map((v,i) => Math.sin(i)*Math.cos(i))]

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
            rowElement.replaceChildren(
                ... Array(100).fill(0).map((_, col) => {
                    const cellElem = document.createElement('div')
                    cellElem.classList.add('col-'+col, 'row-'+row)
                    cellElem.innerText = `Row ${row}, Column ${col}`
                    return cellElem
                })
            )
            return rowElement
        })
    )
})