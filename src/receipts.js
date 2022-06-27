const init = () => {

    const table = document.querySelector('table');
    // fetch items as JSON
    // fill in table with content from fetched items
    // convert to JSON

    const allReceipts = getReceipts()
    allReceipts.then((response) => {
        console.log(response)
        response.forEach(receipt => {
            console.log(receipt)            
            var new_row = table.rows[1].cloneNode(true);
            var len = table.rows.length;
            new_row.cells[0].innerHTML = receipt.date;
            new_row.cells[1].innerHTML = receipt.store;
            new_row.cells[2].innerHTML = receipt.subtotal;
            new_row.cells[3].innerHTML = receipt.vat;
            new_row.cells[4].innerHTML = receipt.total;
            table.appendChild( new_row );
        })
    })
 
    
}
function getReceipts(){
    return fetch("http://localhost:3000/receipts").then(response => response.json())
}
function JSONtoCSV(items) {
    const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
    const header = Object.keys(items[0])
    const csv = [
        header.join(','), // header row first
        ...items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n')

    console.log(csv)
}

document.addEventListener("DOMContentLoaded", init)