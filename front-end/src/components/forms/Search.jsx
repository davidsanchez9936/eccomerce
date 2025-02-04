import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";

export function Search() {
  let dispatch = useDispatch();
  const { search } = useSelector((state) => ({ ...state }), shallowEqual);
  const { text } = search;
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: e.target.value },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?${text}`);
  };

  return (
    <div
      className="search-input-container"
      style={{ border: "none", outlined: "none" }}
    >
      <input
        onChange={handleChange}
        type="search"
        value={text}
        className=" mr-sm-2"
        placeholder="Search"
        style={{ border: "none", width: "10vw", outlined: "none" }}
      />
      <SearchOutlined onClick={handleSubmit} style={{ cursor: "pointer" }} />
    </div>
  );
}
