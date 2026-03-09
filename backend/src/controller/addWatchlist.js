const userModel = require("../models/userModels");

const addToWatchlist = async (req, res) => {
  try {

    const { movieId, title, poster } = req.body;

  const user = await userModel.findById(req.user.userId);

    console.log("REQ USER:", req.user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist.push({ movieId, title, poster });

    await user.save();

    res.json({
      message: "Added",
      watchlist: user.watchlist
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getWatchlist = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      watchlist: user.watchlist || []
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

async function removeWatchlist(req, res){
try {
    const userId = req.user.userId;
    const { movieId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.watchlist = user.watchlist.filter(
      (movie) => movie.movieId !== movieId
    );

    await user.save();

    res.json({ message: "Removed from watchlist" });

  } catch (error) {
     console.error("Remove watchlist error:", error); 
    res.status(500).json({ message: "Server error" });
  }
}

module.exports ={
    addToWatchlist,
    getWatchlist,
    removeWatchlist
}