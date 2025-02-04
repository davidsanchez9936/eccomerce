import "./CategoryCreate.css"
import { useEffect, useState } from "react";
import { AdminNav } from "../../../components/nav/AdminNav.jsx";
import { toast } from "react-toastify";
import { useSelector, shallowEqual } from "react-redux";
import {
  createCategory,
  getCategories,
  removeCategory,
} from "../../../functions/Category.jsx";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { CategoryForm } from "../../../components/forms/CategoryForm.jsx";
import { LocalSearch } from "../../../components/forms/LocalSearch.jsx";

export function CategoryCreate() {
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword] = useState("");
  

  useEffect(() => {
    loadCategories();
  }, []);

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

  const handleRemove = async (slug) => {
    const answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      setLoading(true);
      removeCategory(slug, user.token)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          toast.success(`${data.name} deleted successfully`);
          loadCategories();
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Failed to delete category");
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Datos enviados:", { name }, user.token);
    createCategory({ name }, user.token)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setName("");
        toast.success(`${data.name} is created`);
        loadCategories();
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data);
        } else {
          toast.error("An error occurred while creating the category.");
        }
      });
  };

  const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword);

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
            <h4>Create category</h4>
          )}
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            loading={loading}
            setName={setName}
          />
          <hr />
          {/* step 2 and step 3 */}
          <LocalSearch setKeyword={setKeyword} keyword={keyword} />

          {categories.filter(searched(keyword)).map((c) => (
            <div className="alert alert-secondary-primary" key={c._id}>
              {c.name}
              <Link to={`/admin/category/${c.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
              <span
                onClick={() => handleRemove(c.slug)}
                className="btn btn-sm float-right"
              >
                <DeleteOutlined className="text-danger" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
