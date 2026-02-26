import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.VITE_GRAPHQL_URL,
  headers: {
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjksImVtYWlsIjoiZGFzaGFsaUxvQGV4YW1wbGUuY29tIiwicm9sZSI6IkVtcGxveWVlIiwiaWF0IjoxNzcyMDg1OTk1LCJleHAiOjE3NzIwODY1OTV9.Ka_mD9yljf4727OBJzYtAAg4D2ZuMrlvjVwUfRFALz8",
  },
});

export default api;
