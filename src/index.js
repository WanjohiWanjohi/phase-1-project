const ocrURL = "K89818477488957"

const init = () => {
    document.querySelector('#filename').value = '';
}
function getFileBytes(event) {
    event.preventDefault();
    let photo = document.getElementById("filename").files[0];
    const result = event.target.filename;
    const reader = new FileReader();
    const file =  reader.readAsBinaryString(photo)
    let fileContent = ""
    reader.addEventListener('load', (e) => {
        fileContent = e.target.result;
    })
    return fileContent;
}
function uploadFile(fileBytes){

}
const form = document.querySelector("form")
form.addEventListener("submit", getFileBytes)
document.addEventListener("DOMContentLoaded", init)