import Row from "./Row"
import "../style/index.scss"
const HomeBanner = () => {
  
   return (
    <div>

      <Row title="Trending" type="trending" />
      <Row title="Popular" type="popular" />
      <Row title="Top Rated" type="top_rated" />
      <Row title="Upcoming" type="upcoming" />

    </div>
  );
}

export default HomeBanner;