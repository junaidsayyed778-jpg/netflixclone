// src/components/SkeletonRow.jsx

const SkeletonRow = ({ title = "Loading..." }) => {
  return (
    <div className="row">
      <h2 className="row__title row__title--skeleton">
        <span className="skeleton__text skeleton__text--title" />
      </h2>
      
      <div className="row__posters">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="movieCard movieCard--skeleton">
            <div className="skeleton__poster" />
            <div className="skeleton__meta">
              <span className="skeleton__text skeleton__text--small" />
              <span className="skeleton__text skeleton__text--tiny" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonRow;