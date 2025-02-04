import { useEffect, useState } from "react";
import { AdminNav } from "../../../components/nav/AdminNav.jsx";
import { toast } from "react-toastify";
import { useSelector, shallowEqual } from "react-redux";
import { getCategories } from "../../../functions/Category.jsx";
import {
  createSub,
  getSubs,
  removeSub,
  getSub,
} from "../../../functions/sub.jsx";
import { Link } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { CategoryForm } from "../../../components/forms/CategoryForm.jsx";
import { LocalSearch } from "../../../components/forms/LocalSearch.jsx";

export function SubCreate() {
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [subs, setSubs] = useState([]);
  /* step 1 */
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    loadCategories();
    loadSubs();
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

  const loadSubs = () => {
    getSubs()
      .then((response) => response.json())
      .then((c) => {
        setSubs(c);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRemove = async (slug) => {
    const answer = window.confirm("Are you sure you want to delete?");
    if (answer) {
      setLoading(true);
      removeSub(slug, user.token)
        .then((res) => res.json())
        .then((data) => {
          setLoading(false);
          toast.success(`${data.name} deleted successfully`);
          loadSubs();
        })
        .catch((err) => {
          setLoading(false);
          toast.error("Failed to delete subcategory");
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Datos enviados:", { name }, user.token);
    createSub({ name, parent: category }, user.token)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setName("");
        toast.success(`${data.name} is created`);
        loadSubs();
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
            <h4>Create sub category</h4>
          )}
          <div className="form-group">
            <label>Parent category</label>
            <select
              name="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
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
          <hr />
          {/* step 2 and step 3 */}
          <LocalSearch setKeyword={setKeyword} keyword={keyword} />
          {/* step 5 */}
          {subs.filter(searched(keyword)).map((s) => (
            <div className="alert alert-secondary-primary" key={s._id}>
              {s.name}
              <Link to={`/admin/sub/${s.slug}`}>
                <span className="btn btn-sm float-right">
                  <EditOutlined className="text-warning" />
                </span>
              </Link>
              <span
                onClick={() => handleRemove(s.slug)}
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
