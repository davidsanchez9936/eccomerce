import { useEffect, useState } from "react";
import { AdminNav } from "../../../components/nav/AdminNav.jsx";
import { toast } from "react-toastify";
import { useSelector, shallowEqual } from "react-redux";
import { getCategories } from "../../../functions/Category.jsx";
import { getSub, updateSub } from "../../../functions/sub.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CategoryForm } from "../../../components/forms/CategoryForm.jsx";

export function SubUpdate() {
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [parent, setParent] = useState("");
  let { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadSub();
  }, [slug]);

  const loadCategories = () => {
    getCategories(slug)
      .then((response) => response.json())
      .then((c) => {
        setCategories(c);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadSub = () => {
    getSub(slug)
      .then((response) => response.json())
      .then((s) => {
        setName(s.name);
        setParent(s.parent);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Datos enviados:", { name }, user.token);
    updateSub(slug, { name, parent }, user.token)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setName("");
        toast.success(`${data.name} is updated`);
        navigate("/admin/sub");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 400) {
          toast.error(err.response.data);
        } else {
          toast.error("An error occurred while creating the sub.");
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
            <h4>Update sub category</h4>
          )}
          <div className="form-group">
            <label>Parent category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setParent(e.target.value)}
              value={parent}
            >
              <option value="">Please select</option>
              {categories.length > 0 &&
                categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            loading={loading}
            setName={setName}
          />
        </div>
      </div>
    </div>
  );
}
