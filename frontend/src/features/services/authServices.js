import axios from "axios";


const api = axios.create({
  baseURL: "http://localhost:3000/api/auth",
  withCredentials: true
})

export async function regsiter({ username, email, password }) {
  try {
    const response = await api.post(
      `/register`,
      {
        username,
        email,
        password,
      })

    return response.data;
  } catch (err) {
    console.log(err);
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post(
      `/login`,
      { email, password }
    );
    return response.data;
  } catch (err) {
    console.log(err);
  }
}