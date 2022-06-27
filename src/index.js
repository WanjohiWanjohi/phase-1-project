const ocrURL = "https://api.ocr.space/parse/image"

const init = () => {
    const table = document.querySelector('table');    
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
function getFileBytes(event) {
    event.preventDefault();
    let photo = document.getElementById("filename").files[0];
    if (photo) {
        var reader = new FileReader();
        reader.onloadend = function () {
            uploadFile(reader.result)
        }
        reader.readAsDataURL(photo);
    }
}

function uploadFile(blobFile) {
    var myHeaders = new Headers();
    myHeaders.append("apikey", "");

    var formdata = new FormData();
    formdata.append("language", "eng");
    formdata.append("isOverlayRequired", "false");
    formdata.append("base64Image", blobFile);
    formdata.append("iscreatesearchablepdf", "false");
    formdata.append("scale", "true");
    formdata.append("isTable", "true");
    formdata.append("issearchablepdfhidetextlayer", "false");
    formdata.append("OCREngine", "3");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch("https://api.ocr.space/parse/image", requestOptions)
        .then(response => response.json())
        .then(result => parseReceipt(result))
        .catch(error => console.log('error', error));
}
function parseReceipt(receiptObject) {
    const receiptDetails = receiptObject.ParsedResults[0]
    const receiptLines = receiptDetails.TextOverlay.Lines
    parseReceiptText(receiptDetails.ParsedText)
}
function parseReceiptText(receiptText) {
    // extremely reliant on this one receipt
    let receiptContent = receiptText.split("\t\r\n").map(element => {

        return element.toLowerCase().replace('\t', ' ');
    });
    
    const receiptTotal = receiptContent[21].replace(/\D/g, '');
    const subTotal = receiptContent[receiptContent.findIndex(v => v.includes("subtotal"))].replace(/\D/g, '')
    const VAT = receiptContent[20].replace(/\D/g, '');
    const receipt = {
        store: receiptContent[0].split('\t')[1],
        date: receiptContent[6].split(" ")[0],
        subtotal: subTotal.substring(0, subTotal.length - 2) + "." + subTotal.substring(subTotal.length - 2),
        total: receiptTotal.substring(0, receiptTotal.length - 2) + "." + receiptTotal.substring(receiptTotal.length - 2),
        vat: VAT.substring(0, VAT.length - 2) + "." + VAT.substring(VAT.length - 2),
    }
    

    console.log(receiptContent)
    fetch("http://localhost:3000/receipts" ,{ method: "POST",
    headers:
    {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(receipt)})

    console.log(receipt)
}
const form = document.querySelector("form")
form.addEventListener("submit", getFileBytes)
document.addEventListener("DOMContentLoaded", init)