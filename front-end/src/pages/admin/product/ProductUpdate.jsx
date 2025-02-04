import { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { getProduct, updateProduct } from "../../../functions/Product.jsx";
import { AdminNav } from "../../../components/nav/AdminNav.jsx";
import { ProductCreateForm } from "../../../components/forms/ProductCreateForm.jsx";
import {
  getCategories,
  getCategorySubs,
} from "../../../functions/Category.jsx";
import { FileUpload } from "../../../components/forms/FileUpload.jsx";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import { ProductUpdateForm } from "../../../components/forms/ProductUpdateForm.jsx";
import { toast } from "react-toastify";

export function ProductUpdate() {
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);
  const { token } = user || {};
  const navigate = useNavigate();

  const params = useParams();

  const initialState = {
    title: "",
    description: "",
    price: "",
    category: "",
    subs: [],
    quantity: "",
    images: [],
    colors: ["Black", "Brown", "Silver", "White", "Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo", "ASUS"],
    color: "",
    brand: "",
    shipping: "", // Agregar la propiedad shipping
  };

  const [values, setValues] = useState(initialState);
  const [categories, setCategories] = useState([]);
  const [subOptions, setSubOptions] = useState([]);
  const [arrayOfSubs, setArrayOfSubs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const loadProduct = () => {
    getProduct(params.slug)
      .then((response) => response.json())
      .then((productData) => {
        setValues({
          ...values,
          ...productData,
        });
        console.log(productData);
        // Obtener las subcategorías después de cargar los datos del producto

        getCategorySubs(productData.category._id)
          .then((res) => res.json())
          .then((data) => {
            setSubOptions(data);
            console.log(data);
            let arr = [];

            productData.subs.map((s) => {
              arr.push(s._id);
            });

            console.log("ARR", arr);
            setArrayOfSubs(arr); // Asignar los IDs de las subcategorías al estado arrayOfSubs
          });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /*   if (values.category && values.category._id) {
      getCategorySubs(values.category._id).then((res) => {
        setSubOptions(res.data);
      });

      let arr = [];
      values.category._id.map((s) => {
        arr.push(s._id);
      });
      console.log("ARR", arr);
      setArrayOfSubIds((prev) => arr);
    } */
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    values.subs = arrayOfSubs;
    values.category = selectedCategory ? selectedCategory : values.category;

    updateProduct(params.slug, values, user.token)
      .then((data) => data.json())
      .then((res) => {
        console.log(res);
        setLoading(false);
        toast.success(`"${res.title}" is updated`);
        navigate("/admin/products")
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        toast.error(err.response.data.err);
      });
  };

  const loadCategories = () => {
    getCategories()
      .then((response) => response.json())
      .then((c) => {
        setCategories(c);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleCategoryChange = (e) => {
    e.preventDefault();
    console.log("CLICKED CATEGORY", e.target.value);
    setValues({ ...values, subs: [], category: e.target.value });
    setSelectedCategory(e.target.value);
    getCategorySubs(e.target.value)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSubOptions(data);
      });

    console.log("EXISTING CATEGORY values.category", values.category);
    /* if user clicks back to the original category show its sub categories in default */
    if (values._id === e.target.value) {
      loadProduct();
    }
    //clear old sub category ids
    setArrayOfSubs([]);
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
            <h4>Product update</h4>
          )}
          {JSON.stringify(values)}
          <hr />
          <div className="p-3">
            <FileUpload
              values={values}
              setValues={setValues}
              setLoading={setLoading}
            />
          </div>

          <hr />
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            setValues={setValues}
            values={values}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            subOptions={subOptions}
            arrayOfSubs={arrayOfSubs}
            setArrayOfSubs={setArrayOfSubs}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
}
