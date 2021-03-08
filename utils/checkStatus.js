/**
 * Check response status and throw error if its an error status
 * @param {*} response
 */
export default function checkStatus(response) {
  if (response.ok) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
  }
}
