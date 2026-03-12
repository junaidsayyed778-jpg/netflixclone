import axios from "axios";

const api = axios.create({
  baseURL: "https://netflixclone-backend-v626.onrender.com/api/auth",
  withCredentials: true
});

// send otp to user 
export async function sendOTP (email) {
  try{
    const response = await api.post("/send-otp", { email});
    return response.data
  }catch(err){
    console.log("send OTP error", err)
  }
}

//verify OTP entered by user
export async function verifyOTP(email, otp) {
  try{
    const response = await api.post("/verify-otp", { email, otp})
    return response.data
  }catch(err){
    console.error("verify OTP error", err)
  }
}
  //resend OTP if expired or not recieved
  export async function resendOTP(email){
    try{
      const response = await api.post("/resend-otp", {email})
      return response.data
    }catch(err){
      console.error("Resend OTP error", err)
    }
  }
export async function regsiter({ username, email, password }) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password
    });

    return response.data;

  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/login", {
      email,
      password
    });

    return response.data;

  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function logout() {
  try {
    const response = await api.post("/logout");
    return response.data;

  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/me");
    return response.data;

  } catch (err) {
    console.log(err);
    throw err;
  }
}