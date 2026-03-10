import axios from "axios"

const api = axios.create({
    baseURL: "https://netflixclone-backend-v626.onrender.com/api/watchlist",
    withCredentials: true
})

export const addToWatchlist = (movie)=>{
    return api.post("/add", movie)
}

export const getWatchlist = ()=>{
    return api.get("/")
}

export const removeWatchlist = (movieId) => {
    return api.delete(`/${movieId}`)
}