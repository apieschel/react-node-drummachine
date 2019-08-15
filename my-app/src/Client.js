/* eslint-disable no-undef */

/* ======== GET ====== */
function retrieve(query, cb) {
  return fetch(`/music`, {
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
  //formData = new FormData();
  //formData.append("data", data);
  
  // Default options are marked with *
    return fetch(`/api/fileanalyse`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: data, // body data type must match "Content-Type" header
    })
    .then(checkStatus)
    .then(parseJSON)
}

const Client = { retrieve, postData };
export default Client;