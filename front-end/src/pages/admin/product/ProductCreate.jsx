import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSelector, shallowEqual } from "react-redux";
import { createProduct } from "../../../functions/Product.jsx";
import { AdminNav } from "../../../components/nav/AdminNav.jsx";
import { ProductCreateForm } from "../../../components/forms/ProductCreateForm.jsx";
import {
  getCategories,
  getCategorySubs,
} from "../../../functions/Category.jsx";
import { FileUpload } from "../../../components/forms/FileUpload.jsx";
import { LoadingOutlined } from "@ant-design/icons";

export function ProductCreate() {
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);
  const { token } = user || {}; // Extraer el token del objeto user

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = () => {
    getCategories()
      .then((response) => response.json())
      .then((c) => {
        setValues({ ...values, categories: c });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const initialState = {
    title: "",
    description: "",
    price: "",
    categories: [],
    category: "",
    subs: [],
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    color: "",
    brand: "",
  };

  const [values, setValues] = useState(initialState);
  const [subOptions, setSubOptions] = useState([]);
  const [showSub, setShowSub] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(user);
    createProduct(values, token)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data && data.title) {
          window.alert(`${data.title} is created`);
          window.location.reload();
        } else {
          window.alert("Product is not created");
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(err);
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data);
        } else {
          toast.error("An error occurred while creating the category.");
        }
      });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("CLICKED CATEGORY", e.target.value);
    setValues({ ...values, subs: [], category: e.target.value });
    getCategorySubs(e.target.value)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSubOptions(data);
        setShowSub(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <LoadingOutlined className="text-danger h1" />
          ) : (
            <h4>Product create</h4>
          )}
          {/* {JSON.stringify(values)} */}
          <hr />

         {/*  {JSON.stringify(values.images)} */}
          <hr />  
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>
          <hr />
          <ProductCreateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCategoryChange={handleCategoryChange}
            subOptions={subOptions}
            showSub={showSub}
          />
        </div>
      </div>
    </div>
  );
}
