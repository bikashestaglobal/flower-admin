const hostname = window.location.hostname;
export default {
  SERVER_URL:
    hostname == "localhost"
      ? "http://localhost:5000/api/v1"
      : "http://54.188.68.221/server/api/v1",
};
