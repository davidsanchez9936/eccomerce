import { useEffect, useState } from "react";
import { getProducts, getProductsCount } from "../../functions/Product.jsx";
import { ProductCard } from "../cards/ProductCard.jsx";
import { LoadingCard } from "../cards/LoadingCard.jsx";
import { Pagination } from "antd";

export function BestSellers() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);
  const perPage = 3;

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount()
      .then((res) => res.json())
      .then((data) => {
        setProductsCount(data);
      })
      .catch((error) => {
        console.error("Error fetching products count:", error);
      });
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    const totalPages = Math.ceil(productsCount / perPage);
    // Si la página actual es mayor que el total de páginas, establecer la página en el último número de página
    if (page > totalPages) {
      setPage(totalPages);
      return;
    }
    getProducts("sold", "desc", page)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div className="container mt-5">
        {loading ? (
          <LoadingCard count={3} />
        ) : (
          <div className="row">
            <hr />
            {products.map((product) => (
              <div className="col-md-4" key={product._id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="row">
        <nav className="col-md-4 offset-md-4 text-center pt-5 p-3">
          <Pagination
            current={page}
            total={productsCount}
            pageSize={perPage}
            onChange={(value) => setPage(value)}
          />
        </nav>
      </div>
    </>
  );
}
