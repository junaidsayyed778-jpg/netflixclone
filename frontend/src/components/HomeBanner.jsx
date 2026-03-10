import Row from "./Row";

const HomeBanner = () => {
  return (
    <div className="home">

      <Row title="Trending" type="trending" />
      <Row title="Popular" type="popular" />
      <Row title="Top Rated" type="top_rated" />
      <Row title="Upcoming" type="upcoming" />

    </div>
  );
};

export default HomeBanner;