import { useEffect, useState } from "react";
import { AdminNav } from "../../../components/nav/AdminNav.jsx";
import { toast } from "react-toastify";
import { useSelector, shallowEqual } from "react-redux";
import { updateCategory, getCategory } from "../../../functions/Category.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { CategoryForm } from "../../../components/forms/CategoryForm.jsx";

export function CategoryUpdate() {
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let { slug } = useParams();



  useEffect(() => {
    loadCategory();
  }, [slug]);

  const loadCategory = () => {
    getCategory(slug) // Pasar el slug como argumento
      .then((response) => response.json())
      .then((c) => {
        setName(c.name);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Datos enviados:", { name }, user.token);
    updateCategory(slug, { name }, user.token) // Pasar el slug como argumento
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setName("");
        toast.success(`${data.name} is updated`);
        navigate("/admin/category");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data);
        } else {
          toast.error("An error occurred while updating the category.");
        }
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading</h4>
          ) : (
            <h4>Update category</h4>
          )}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            loading={loading}
            setName={setName}
          />
          <hr />
        </div>
      </div>
    </div>
  );
}
