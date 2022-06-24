const ocrURL = "https://api.ocr.space/parse/image"

const init = () => {
    document.querySelector('#filename').value = '';
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
    
    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow'
    };
    
    fetch("https://api.ocr.space/parse/image", requestOptions)
      .then(response => response.json())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}
const form = document.querySelector("form")
form.addEventListener("submit", getFileBytes)
document.addEventListener("DOMContentLoaded", init)