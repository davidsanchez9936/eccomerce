
// AllProducts.jsx
import { useEffect, useState } from "react";
import { AdminNav } from "../../../components/nav/AdminNav.jsx";
import { AdminProductCard } from "../../../components/cards/AdminProductCard.jsx";
import { getProductsByCount, removeProduct } from "../../../functions/Product.jsx";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";

export function AllProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    getProductsByCount(100)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const handleImageRemove = (public_id) => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_APP_API}/removeimage/${public_id}`, {
      method: "DELETE",
      headers: {
        authtoken: user ? user.token : "",
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        toast.success("Image removed successfully");
      })
      .catch((error) => {
        setLoading(false);
        toast.error("An error occurred while removing the image.");
        console.error("There has been a problem with your fetch operation:", error);
      });
  };

  const handleRemove = (slug) => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que quieres eliminar este producto y todas sus imágenes asociadas?"
    );

    if (confirmDelete) {
      setLoading(true);
      removeProduct(slug, user.token)
        .then((res) => res.json())
        .then((data) => {
          // Eliminar imágenes del producto
          if (data.images && data.images.length > 0) {
            data.images.forEach((image) => {
              handleImageRemove(image.public_id);
            });
          }
          loadAllProducts();
          setLoading(false);
          toast.success(`${data.title} deleted successfully`);
        })
        .catch((err) => {
          setLoading(false);
          if (err.response && err.response.status === 400) {
            toast.error(err.response.data);
          } else {
            toast.error("An error occurred while deleting the product.");
          }
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 mt-3">
          <AdminNav />
        </div>
        <div style={{ position: "relative", left: "10vw", bottom: "30vh" }}>
          <div className="col mt-3">
            <div className="row">
              {loading ? <h4 className="text-danger">Loading...</h4> : <h4>All Products</h4>}
              {products.map((product) => (
                <div key={product._id} className="col-md-4 pb-3">
                  <AdminProductCard product={product} handleRemove={handleRemove} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}