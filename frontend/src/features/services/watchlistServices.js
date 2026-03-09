import axios from "axios"

const api = axios.create({
    baseURL: "http://localhost:3000/api/watchlist",
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