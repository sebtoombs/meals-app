import fetch from "isomorphic-unfetch";
import buildRequestURI from "./buildRequestURI";
import { format } from "date-fns";
//import FormData from "form-data";
import axios from "axios";

const uploadImage = file => {
  console.log("Uploading: ", file);
  const requestURI = buildRequestURI("image");
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
    "calendar?filter.date.gte=today&limit=14"
  );
  const res = await fetch(pageRequest);
  const json = await res.json();
  return json;
};
export { fetchCalendar };

const addToCalendar = async (meal_id, day) => {
  const requestURI = buildRequestURI("calendar/add");
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
  const requestURI = buildRequestURI("calendar/remove");
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
  const pageRequest = buildRequestURI("meals");
  const res = await fetch(pageRequest);
  const json = await res.json();
  return json;
};
export { fetchMeals };

const addMeal = async mealData => {
  const requestURI = buildRequestURI("meals");
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
