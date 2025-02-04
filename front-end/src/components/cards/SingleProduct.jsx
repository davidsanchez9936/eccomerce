import {
  HeartOutlined,
  ShoppingCartOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { Card, Tabs, Tooltip } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import imagen from "../../images/imagen.png";
import { ProductListItems } from "./ProductListItems.jsx";
import StarRating from "react-star-ratings";
import { RatingModal } from "../modal/RatingModal.jsx";
import { showAverage } from "../../functions/rating.jsx";
import _ from "lodash";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { useEffect, useState } from "react";
import { addToWishlist } from "../../functions/user.jsx";
import { toast } from "react-toastify";


export function SingleProduct({ product, onStarClick, star }) {
  const { title, images, description, _id } = product;
  const [tooltip, setTooltip] = useState("Click to add");

  const { user, cart } = useSelector((state) => ({ ...state }), shallowEqual);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAddToCard = () => {
    // create cart arrey
    let cart = [];
    if (typeof window !== "undefined") {
      /*  if cart is in the local storage GET it  */
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // remove duplicate
      let unique = _.uniqWith(cart, _.isEqual);
      // save to local storage
      // console.log("unique", unique)
      localStorage.setItem("cart", JSON.stringify(unique));
      // show tooltip
      setTooltip("Added");

      //add to redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
      // show cart items in side drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };

  const tabItems = [
    {
      label: <span>Description </span>,
      key: "1",
      children: <span>{description && description}</span>,
    },
    {
      label: <span>More</span>,
      key: "2",
      children: (
        <span> Call use on xxxx xxx xxx to learn more about this product</span>
      ),
    },
  ];

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token)
      .then((res) => res.json())
      .then((data) => {
        console.log("ADDED TO WISHLIST",data);
        toast.success("Added to wishlist")
       /*  navigate("/user/wishlist") */

      });
  };

  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel autoPlay infiniteLoop showArrows={true}>
            {images.map((i, index) => (
              <div key={index}>
                <img
                  style={{ objectFit: "contain", maxHeight: "40vh" }}
                  src={i.url}
                  alt={title}
                />
              </div>
            ))}
          </Carousel>
        ) : (
          <Card
            cover={
              <img
                src={imagen}
                style={{ height: "30vh", width: "20vw", objectFit: "contain" }}
                className="mb-3 card-image"
              />
            }
          ></Card>
        )}
        <Tabs items={tabItems} type="card" />
      </div>
      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>

        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">No rating yet</div>
        )}

        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={handleAddToCard}>
                <ShoppingCartOutlined className="text-danger" /> <br /> Add to
                Cart
              </a>
            </Tooltip>,
            <a onClick={handleAddToWishlist}>
              <HeartOutlined className="text-info" />
              <br /> Add to Wishlist
            </a>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
}
