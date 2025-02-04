import { useParams } from "react-router-dom";
import { getSub } from "../../functions/sub.jsx";
import { ProductCard } from "../../components/cards/ProductCard.jsx";
import { useEffect, useState } from "react";

export function SubHome() {
  const [sub, setSub] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    setLoading(true);
    getSub(slug)
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data, null, 4));
        setSub(data.sub);
        setProducts(data.products);
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
          ) : sub.name ? (
            <h4
              className="text-center p-3 mt-5 mb-5 display-4 jumbotron"
              style={{ width: "100%", backgroundColor: "#C0CCD0" }}
            >
              {products.length} Products in "{sub.name}" sub category
            </h4>
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
              No sub category found
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