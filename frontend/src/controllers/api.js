import axios from "axios";

export default axios.create({
  baseURL: `https://app.baretag.co:8000/`,
});
