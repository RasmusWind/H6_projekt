import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

// class SessionAuth {
//   constructor(url) {
//     this.request = axios.create({
//       baseURL: url,
//     });
//   }

//   get(path) {
//     return this.request.get(path);
//   }
//   post(path, data) {
//     return this.request.post(path, data);
//   }
// }

// const session_request = SessionAuth("http://localhost:8000");
const sessionAuth = axios.create({
  baseURL: "http://172.16.12.10:8000",
});

export { sessionAuth };
