/* eslint-disable no-undef */

/* ======== GET ====== */
function retrieve(url, cb) {
  return fetch(url, {
    accept: "application/json"
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(cb);
}

function loadData(url, cb) {
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
  const error = new Error(`HTTP Error ${response.statusText}`);
  error.status = response.statusText;
  error.response = response;
  console.log(error); // eslint-disable-line no-console
  throw error;
}

function parseJSON(response) {
  return response.json();
}

/* ========= POST ======== */
function postData(url, data) {
  return fetch(url, {
      method: 'POST'
  })
  .then(checkStatus)
  .then(alert("Your files have been uploaded."))
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

const Client = { retrieve, loadData, postData, deleteData };
export default Client;