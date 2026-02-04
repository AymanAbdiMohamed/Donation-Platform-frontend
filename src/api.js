import axios from "axios";

// Create a reusable Axios instance known as 'api'.
// This allows us to set a base URL (where our backend is) and default headers
// so we don't have to repeat them for every single request.
const api = axios.create({
  baseURL: "http://127.0.0.1:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors are like "middlemen" that sit between the app and the server.
// Here, we use a request interceptor to automatically add the user's authentication token
// to every outgoing request if they are logged in.
// This saves us from manually adding the "Authorization" header in every single API call.
api.interceptors.request.use((config) => {
  // Retrieve the access token from the browser's local storage
  const token = localStorage.getItem("access_token");
  
  // If a token exists, add it to the request headers
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Function to log in a user.
// It takes email and password, sends them to the backend, and returns the response data.
// 'async/await' is used because network requests take time to complete.
export const loginUser = async ({ email, password }) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data; // The backend returns user info and the access token here
};

// Function to register a new user.
// It sends email, password, and the selected role (donor or charity) to the backend.
export const registerUser = async ({ email, password, role }) => {
  const response = await api.post("/auth/register", { email, password, role });
  return response.data; // expect { user, access_token }
};

// Function to get the currently logged-in user's details.
// Since the token is automatically attached by the interceptor (see above),
// the backend knows who is asking for this information.
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data; // expect { user }
};

// Function to submit a charity application form.
// This function handles file uploads, so the data is sent as 'FormData' instead of simple JSON.
// Axios is smart enough to detect FormData and set the correct 'Content-Type' header automatically.
export const submitCharityApplication = async (formData) => {
  const response = await api.post("/charity/application", formData);
  return response.data;
};


export { api };
export default api;
