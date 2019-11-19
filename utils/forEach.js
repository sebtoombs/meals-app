export default function forEach(object, callback) {
  for (let key in object) {
    if (object.hasOwnProperty(key)) {
      callback.call(object, key, object[key]);
    }
  }
}
