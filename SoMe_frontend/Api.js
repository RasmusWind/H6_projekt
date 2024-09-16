import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const server_url = "http://192.168.1.2:8000";

const sessionAuth = axios.create({
  baseURL: server_url,
});

export { sessionAuth, server_url };
