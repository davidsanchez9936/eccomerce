import {  useParams } from "react-router-dom";
import { getCategory } from "../../functions/Category";
import { ProductCard } from "../../components/cards/ProductCard.jsx";
import { useEffect, useState } from "react";

export function CategoryHome() {
  const [category, setCategory] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);
    getCategory(slug)
      .then((res) => res.json())
      .then((c) => {
        console.log(JSON.stringify(c, null, 4));
        setCategory(c);
        setProducts(c.products);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col">
          {loading ? (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              Loading...
            </h4>
          ) : category.category && category.category.name ? (
            <h4
              className="text-center p-3 mt-5 mb-5 display-4 jumbotron"
              style={{ width: "100%", backgroundColor: "#C0CCD0" }}
            >
              {products.length} Products in "{category.category.name}" category
            </h4>
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              No category found
            </h4>
          )}
        </div>
      </div>
      <div className="row">
        {products.map((p) => (
          <div className="col-md-4" key={p._id}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
