import { Link } from "react-router-dom";
import { getSubs } from "../../functions/sub.jsx";
import { useEffect, useState } from "react";
import "../category/CategoryList.css";

export function SubList() {
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getSubs()
      .then((s) => s.json())
      .then((data) => {
        setSubs(data);
        console.log(data);
        setLoading(false);
      });
  }, []);

  const showSubs = () => {
    return subs.map((s) => (
      <div key={s._id} className="category-item">
        <Link to={`/sub/${s.slug}`} className="category-link">
          {s.name}
        </Link>
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-center">Loading...</h4>
        ) : (
          <div className="category-grid">{showSubs()}</div>
        )}
      </div>
    </div>
  );
}
