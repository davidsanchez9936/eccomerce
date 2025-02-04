import { Link } from "react-router-dom";
import { getCategories } from "../../functions/Category.jsx";
import { useEffect, useState } from "react";
import "./CategoryList.css";

export function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories()
      .then((c) => c.json())
      .then((data) => {
        setCategories(data);
        console.log(data);
        setLoading(false);
      });
  }, []);

  const showCategories = () => {
    return categories.map((c) => (
      <div key={c._id} className="category-item">
        <Link to={`/category/${c.slug}`} className="category-link">
          {c.name}
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
          <div className="category-grid">{showCategories()}</div>
        )}
      </div>
    </div>
  );
}