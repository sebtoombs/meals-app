import fetch from "isomorphic-unfetch";
import buildRequestURI from "./buildRequestURI";
import { format } from "date-fns";
//import FormData from "form-data";

//-----------------
// HELPERS
//-----------------

/**
 * Check response status and throw error if its an error status
 * @param {*} response
 */
function checkStatus(response) {
  if (response.ok) {
    return response;
  } else {
    var error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
  }
}

/**
 * Wrapper around fetch for API specific things inc error handling & json
 */
function apiFetch(endpoint, options) {
  options = typeof options === "undefined" ? {} : options;

  let fetchOpts = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    ...options
  };

  //if(typeof options.headers !== "undefined") fetchOpts.headers = {...fetchOpts.headers, ...options.headers}

  if (typeof options.body !== "undefined")
    fetchOpts.body = JSON.stringify(fetchOpts.body);

  console.log("Fetching", fetchOpts);

  return fetch(buildRequestURI(endpoint), fetchOpts)
    .then(checkStatus)
    .then(r => {
      console.log(r.headers);
      return r;
    })
    .then(r => r.json());
}
export { apiFetch };

const uploadImage = file => {
  console.log("Uploading: ", file);
  const requestURI = buildRequestURI("api/image");
  const formData = new FormData();
  formData.append("image", file);

  console.log(formData.entries());

  return fetch(requestURI, {
    method: "POST",
    body: formData
    /*headers: {
      "Content-Type": "multipart/form-data"
    }*/
  });
};
export { uploadImage };

const fetchCalendar = async () => {
  const pageRequest = buildRequestURI(
    "api/calendar?filter.date.gte=today&limit=14"
  );
  const res = await fetch(pageRequest);
  const json = await res.json();
  return json;
};
export { fetchCalendar };

const addToCalendar = async (meal_id, day) => {
  const requestURI = buildRequestURI("api/calendar/add");
  let date = format(day, "yyyy-MM-dd");
  const res = await fetch(requestURI, {
    method: "POST",
    body: JSON.stringify({ meal_id, date }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  const json = await res.json();
  //console.log("Add to calendar: ", json);
};
export { addToCalendar };

const removeFromCalendar = async entry_id => {
  const requestURI = buildRequestURI("api/calendar/remove");
  const res = await fetch(requestURI, {
    method: "POST",
    body: JSON.stringify({ id: entry_id }),
    headers: {
      "Content-Type": "application/json"
    }
  });
  const json = await res.json();
};
export { removeFromCalendar };

const fetchMeals = async () => {
  const pageRequest = buildRequestURI("api/meals");
  const res = await fetch(pageRequest);
  const json = await res.json();
  return json;
};
export { fetchMeals };

const addMeal = async mealData => {
  const requestURI = buildRequestURI("api/meals");
  const res = await fetch(requestURI, {
    method: "POST",
    body: JSON.stringify(mealData),
    headers: {
      "Content-Type": "application/json"
    }
  });
  const json = await res.json();
  return json;
};
export { addMeal };
