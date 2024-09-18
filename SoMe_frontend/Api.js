import axios from "axios";

axios.defaults.xsrfCookieName = "csrftoken";
axios.defaults.xsrfHeaderName = "X-CSRFToken";
axios.defaults.withCredentials = true;

const port = 8000;
const ip = "192.168.1.2";
const websocket_url = `ws://${ip}:${port}/ws/socket-server/`;
const server_url = `http://${ip}:${port}`;

const sessionAuth = axios.create({
  baseURL: server_url,
});

export { sessionAuth, server_url, websocket_url };
