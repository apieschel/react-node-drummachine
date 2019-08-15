/* eslint-disable no-undef */

const FormData = require('form-data');

/* ======== GET ====== */
function retrieve(url, cb) {
  return fetch(url, {
    accept: "application/json"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  console.log(response);
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  console.log(response);
  return response.json();
}

/* ========= POST ======== */
function postData(url, data) {
  formData = new FormData();
  formData.append("data", data);
  
  // Default options are marked with *
    return fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'multipart/form-data',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: formData, // body data type must match "Content-Type" header
    })
    .then(checkStatus)
}

/* ========= DELETE ======== */
function deleteData() {
  
  // Default options are marked with *
    return fetch(`/music/delete`, {
        method: 'DELETE'
    })
    .then(checkStatus)
    .then(alert("All files deleted from the music directory."));
}

const inputs = querySelector('#currentFiles :input');

const Client = { retrieve, postData, deleteData };
export default Client;