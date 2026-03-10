import movieModel from "../models/movie";

export const searchMovies = async (req, res) => {
    try{
        const { query } = req.query;

        const movies = await movieModel.find({
            title: { $regex: query, $options: "i"} // case insentitive search
        });
        res.status(200).json(movies);

    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}