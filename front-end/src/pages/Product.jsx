import "./Product.css";
import { useEffect, useState } from "react";
import { getProduct, getRelated, productStar } from "../functions/Product.jsx";
import { useParams } from "react-router-dom";
import { SingleProduct } from "../components/cards/SingleProduct.jsx";
import { useSelector, shallowEqual } from "react-redux";
import { ProductCard } from "../components/cards/ProductCard.jsx";

export function Product() {
  const [product, setProduct] = useState({});
  const [star, setStar] = useState(0);
  const [related, setRelated] = useState([]);
  const params = useParams();

  const { user } = useSelector((state) => ({ user: state.user }), shallowEqual);

  useEffect(() => {
    loadSingleProduct();
  }, [params]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star); //currentUser star
    }
  }, []);

  const loadSingleProduct = () => {
    getProduct(params.slug)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        console.log(data._id);
        // Llamar a getRelated() con el _id del producto
        getRelated(data._id)
          .then((resData) => resData.json())
          .then((response) => {
            console.log(response);
            setRelated(response);
          });
      });
  };

  const onStarClick = (newRating, productId) => {
    console.log(user);
    setStar(newRating);
    console.log(newRating, productId);
    productStar(productId, newRating, user.token)
      .then((res) => res.json())
      .then((data) => {
        console.log("rating clicked", data);
        loadSingleProduct();
      });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4
            style={{
              backgroundColor: "#C0CCD0",
              height: "15vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Related Products
          </h4>
          <hr />
        </div>
      </div>
      <div className="row pb-5" style={{display:"flex", justifyContent:"center"}}>
        {related.length ? (
          related.map((r) => (
            <div key={r._id} className="col-md-4" style={{width:"30vw"}}>
              <ProductCard product={r} />
            </div>
          ))
        ) : (
          <div className="text-center col">No Products Found </div>
        )}
      </div>
    </div>
  );
}
