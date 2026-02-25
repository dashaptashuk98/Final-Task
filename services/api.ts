import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_GRAPHQL_URL,
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjgsImVtYWlsIjoiZGFzaGFsaUBleGFtcGxlLmNvbSIsInJvbGUiOiJFbXBsb3llZSIsImlhdCI6MTc3MjA0ODMxNSwiZXhwIjoxNzcyMDQ4OTE1fQ.phsj4KoCKX2kigV3n5YoPflohPveXv6lzaAg4YuGz6I",
  },
});

export default api;
