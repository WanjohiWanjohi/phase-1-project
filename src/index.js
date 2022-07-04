const ocrURL = "https://api.ocr.space/parse/image"

const init = () => {
    let fileupload = document.getElementById("filename")
    fileupload.value = ''
    loadReceiptsToTable()

}
function loadReceiptsToTable() {
    const table = document.querySelector('table');
    const allReceipts = getReceipts()
    allReceipts.then((response) => {
        console.log(response)
        response.forEach(receipt => {
            var new_row = table.insertRow();
            var cell0 = new_row.insertCell(0);
            var cell1 = new_row.insertCell(1);
            var cell2 = new_row.insertCell(2);
            var cell3 = new_row.insertCell(3);
            var cell4 = new_row.insertCell(4);
            var cell5 = new_row.insertCell(5);

            cell0.innerHTML = receipt.date;
            cell1.innerHTML = receipt.store;
            cell2.innerHTML = receipt.subtotal;
            cell3.innerHTML = receipt.vat;
            cell4.innerHTML = receipt.total;
            let delBtn = document.createElement("button");
            delBtn.innerText = "Delete"
            delBtn.setAttribute("id", "delete")
            delBtn.setAttribute("class", "px-8 py-3 font-semibold rounded dark:bg-gray-100 dark:text-gray-800")
            cell5.appendChild(delBtn)
            table.appendChild(new_row);
            delBtn.addEventListener("click", () => {
                new_row.remove()
            })

        })
    })
}

function getReceipts() {
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
    // INSERT API KEY HERE
    myHeaders.append("apikey", "K89818477488957");

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
    console.log(receiptObject)
    console.log(typeof (receiptObject))
    if (typeof (receiptObject) === 'object') {
        const receiptDetails = receiptObject.ParsedResults[0]
        const receiptLines = receiptDetails.TextOverlay.Lines
        parseReceiptText(receiptDetails.ParsedText)
    }
    else if (typeof (receiptObject) == 'string') {
        window.alert(receiptObject)
    }
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

    fetch("http://localhost:3000/receipts", {
        method: "POST",
        headers:
        {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(receipt)
    })
    loadReceiptsToTable()

    console.log(receipt)
}
const form = document.querySelector("form")
form.addEventListener("submit", getFileBytes)
document.addEventListener("DOMContentLoaded", init)
