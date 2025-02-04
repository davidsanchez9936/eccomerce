import "./Sub.css";

import {
  getProductsByCount,
  fetchProductsByFilter,
} from "../functions/Product.jsx";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { ProductCard } from "../components/cards/ProductCard.jsx";
import { useState, useEffect } from "react";
import { Menu, Slider, Tooltip, Checkbox, Radio } from "antd";
import { getCategories } from "../functions/Category.jsx";
import { getSubs } from "../functions/sub.jsx";
import {
  DollarCircleOutlined,
  DownSquareOutlined,
  StarOutlined,
} from "@ant-design/icons";
import { Star } from "../components/forms/Star.jsx";
import { StyledMenu } from "./ShopStyled.js";

export function Shop() {
  const [currentFilter, setCurrentFilter] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [price, setPrice] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(0);
  const [categories, setCategories] = useState([]);
  const [checkedCategories, setCheckedCategories] = useState([]);
  const [categoryIds, setCategoryIds] = useState([]);
  const [star, setStar] = useState("");
  const [subs, setSubs] = useState([]);
  const [sub, setSub] = useState("");
  const [selectedSub, setSelectedSub] = useState(null);
  const [brands, setBrands] = useState([
    "Apple",
    "Samsung",
    "Microsoft",
    "Lenovo",
    "ASUS",
  ]);
  const [brand, setBrand] = useState("");
  const [colors, setColors] = useState([
    "Black",
    "Brown",
    "Silver",
    "White",
    "Blue",
  ]);

  const [color, setColor] = useState("");
  const [shipping, setShipping] = useState("");

  const handleClick = (e) => {
    console.log("click ", e);
    setCurrentFilter(e.key);
  };

  const dispatch = useDispatch();

  const { search } = useSelector((state) => ({ ...state }), shallowEqual);
  const { text } = search;

  useEffect(() => {
    loadAllProducts();
    setPrice([0, maxPrice]);
    /* fetchCategories */
    getCategories()
      .then((res) => res.json())
      .then((resData) => {
        setCategories(resData);
      });
    /* fetchSubCategories */
    getSubs()
      .then((res) => res.json())
      .then((data) => {
        setSubs(data);
        console.log(data);
      });
  }, [maxPrice]);

  useEffect(() => {
    const filters = {
      query: text,
      price,
      category: categoryIds,
      stars: star,
      sub,
      brand,
      color,
      shipping,
    };
    fetchProducts(filters);
  }, [text, price, categoryIds, star, sub, brand, color, shipping]);

  const fetchProducts = async (filters) => {
    console.log(filters);
    setLoading(true);
    if (categoryIds.length > 0 && filters.query.length > 0) {
      setCategoryIds([]);
      setCheckedCategories([]);
      /* setSub("");
      setBrand("");
      setStar("");
      setColor("");
      setShipping(""); */
    } else if (filters.query) {
      setColor("");
      setSub("");
      setBrand("");
      setStar("");
      setShipping("");
    }
    try {
      const response = await fetchProductsByFilter(filters);
      const newData = await response.json();
      if (JSON.stringify(newData) !== JSON.stringify(products)) {
        setProducts(newData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllProducts = () => {
    getProductsByCount(12)
      .then((res) => res.json())
      .then((p) => {
        setProducts(p);
        const maxPriceFromProducts = Math.max(
          ...p.map((product) => product.price)
        );
        setMaxPrice(maxPriceFromProducts);
      });
  };

  const formatter = (value) => `$${value}`;

  const handleSlider = (value) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setCheckedCategories([]);
    setCategoryIds([]);
    setPrice(value);
    setSub("");
    setBrand("");
    setStar("");
    setColor("");
    setShipping("");
  };

  const handleCheck = async (e) => {
    const categoryId = e.target.value;
    if (e.target.checked) {
      setCheckedCategories([...checkedCategories, categoryId]);
    } else {
      setCheckedCategories(checkedCategories.filter((id) => id !== categoryId));
    }

    let inTheState = [...categoryIds];
    let justChecked = e.target.value;
    let foundInTheState = inTheState.indexOf(justChecked);

    if (foundInTheState === -1) {
      inTheState.push(justChecked);
    } else {
      inTheState.splice(foundInTheState, 1);
    }

    if (inTheState.length > 0) {
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPrice([0, maxPrice]);
      setSub("");
      setBrand("");
      setColor("");
      setShipping("");
    } else {
      setCategoryIds([]);
      setCheckedCategories([]);
      setStar("");
      return;
    }

    setCategoryIds(inTheState);
    await fetchProducts({ category: inTheState });
  };

  const showCategories = () => {
    return categories.map((c) => (
      <div key={c._id}>
        <Checkbox
          onChange={handleCheck}
          value={c._id}
          checked={checkedCategories.includes(c._id)}
          name="category"
        >
          {c.name}
        </Checkbox>
        <br />
      </div>
    ));
  };

  const handleStarClick = async (num) => {
    dispatch({
      type: "SEARCH_QUERY",
      payload: { text: "" },
    });
    setPrice([0, maxPrice]);
    setCategoryIds([]);
    setCheckedCategories([]);
    setSub("");
    setBrand("");

    setColor("");
    setShipping("");
    setStar(num);
    try {
      await fetchProducts({ stars: num });
    } catch (error) {
      console.error("Error fetching products by star rating:", error);
    }
  };

  const ShowStars = () => {
    return (
      <div className="pr-4 pl-4 pb-2">
        <Star starClick={handleStarClick} numberOfStars={5} />
        <Star starClick={handleStarClick} numberOfStars={4} />
        <Star starClick={handleStarClick} numberOfStars={3} />
        <Star starClick={handleStarClick} numberOfStars={2} />
        <Star starClick={handleStarClick} numberOfStars={1} />
      </div>
    );
  };

  /* 6. show products by sub category */
  const showSubs = () => {
    return (
      <div className="sub-categories">
        {subs.map((s) => (
          <div
            key={s._id}
            onClick={() => handleSub(s)}
            className={`sub-category-item ${
              selectedSub === s ? "selected" : ""
            }`}
          >
            {s.name}
          </div>
        ))}
      </div>
    );
  };

  const handleSub = async (sub) => {
    console.log(sub);
    if (sub) {
      setSub(sub._id); // Establecer el ID de la subcategoría seleccionada
      setSelectedSub(sub);
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPrice([0, 0]);
      setCategoryIds([]);
      setCheckedCategories([]);
      setStar("");
      setBrand("");
      setColor("");
      setShipping("");
      fetchProducts({ sub });
    }
  };

  /* 7. show products based on brand name */
  const showBrands = () => {
    return (
      <div className="brand-container">
        {brands.map((b) => (
          <Radio
            key={b}
            value={b}
            name={b}
            checked={b === brand}
            className="brand-radio"
            onChange={handleBrand}
          >
            {b}
          </Radio>
        ))}
      </div>
    );
  };

  const handleBrand = (e) => {
    if (e.target.value) {
      setSub(""); // Establecer el ID de la subcategoría seleccionada
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPrice([0, 0]);
      setCategoryIds([]);
      setCheckedCategories([]);
      setStar("");
      setColor("");
      setBrand(e.target.value);
      setShipping("");
      fetchProducts({ brand: e.target.value });
    }
  };

  /* 8. show products based on color */
  const showColors = () => {
    return (
      <div className="brand-container">
        {colors.map((c) => (
          <Radio
            key={c}
            value={c}
            name={c}
            checked={c === color}
            className="brand-radio"
            onChange={handleColor}
          >
            {c}
          </Radio>
        ))}
      </div>
    );
  };

  const handleColor = (e) => {
    if (e.target.value) {
      setSub(""); // Establecer el ID de la subcategoría seleccionada
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPrice([0, 0]);
      setCategoryIds([]);
      setCheckedCategories([]);
      setStar("");
      setBrand("");
      setColor(e.target.value);
      setShipping("");
      fetchProducts({ color: e.target.value });
    }
  };

  //9. show products based on shipping yes/no
  const showShipping = () => {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        className="shipping-options"
      >
        <Checkbox
          className="shipping-option"
          onChange={handleShippingChange}
          value="Yes"
          checked={shipping === "Yes"}
        >
          Yes
        </Checkbox>
        <Checkbox
          className="shipping-option"
          onChange={handleShippingChange}
          value="No"
          checked={shipping === "No"}
        >
          No
        </Checkbox>
      </div>
    );
  };

  const handleShippingChange = (e) => {
    if (e.target.value) {
      setSub(""); // Establecer el ID de la subcategoría seleccionada
      dispatch({
        type: "SEARCH_QUERY",
        payload: { text: "" },
      });
      setPrice([0, 0]);
      setCategoryIds([]);
      setCheckedCategories([]);
      setStar("");
      setBrand("");
      setColor("");
      setShipping(e.target.value);
      fetchProducts({ shipping: e.target.value });
    }
  };

  const items = [
    /* price */
    {
      label: (
        <span className="h6">
          <DollarCircleOutlined />
          <span>Price</span>
        </span>
      ),
      key: "1",
      children: [
        {
          label: (
            <div
              style={{ backgroundColor: "white", width: "18vw" }}
              title="price"
            >
              <Tooltip placement="top" overlayInnerStyle={{ fontSize: "12px" }}>
                <Slider
                  className="ml-4 mr-4"
                  range
                  value={price}
                  onChange={handleSlider}
                  style={{ backgroundColor: "white", width: "18vw" }}
                  max={maxPrice}
                  tooltip={{ formatter }}
                  defaultValue={[0, maxPrice]}
                />
              </Tooltip>
            </div>
          ),
          key: "range",
        },
      ],
    },
    /* category */
    {
      label: (
        <div className="h6">
          <DownSquareOutlined />
          <span>Categories</span>
        </div>
      ),
      key: "2",
      children: [
        {
          label: (
            <div
              style={{
                overflowY: "auto",
                width: "18vw",
                height: "150px",
              }}
            >
              {showCategories()}
            </div>
          ),
          key: "categories",
        },
      ],
    },
    /* stars */
    {
      label: (
        <div className="h6">
          <StarOutlined />
          <span>Stars</span>
        </div>
      ),
      key: "3",
      children: [
        {
          label: (
            <div style={{ overflowY: "auto", width: "18vw", height: "150px" }}>
              {ShowStars()}
            </div>
          ),
          key: "ratings",
        },
      ],
    },
    /* sub category */
    {
      label: (
        <div className="h6">
          <DownSquareOutlined />
          <span>Sub Categories</span>
        </div>
      ),
      key: "4",
      children: [
        {
          label: (
            <div style={{ overflowY: "auto", width: "18vw", height: "150px" }}>
              {showSubs()}
            </div>
          ),
          key: "sub-category",
        },
      ],
    },
    /* brands */
    {
      label: (
        <div className="h6">
          <StarOutlined />
          <span>Brands</span>
        </div>
      ),
      key: "5",
      children: [
        {
          label: (
            <div style={{ overflowY: "auto", width: "18vw", height: "150px" }}>
              {showBrands()}
            </div>
          ),
          key: "brand",
        },
      ],
    },
    /* colors */
    {
      label: (
        <div className="h6">
          <StarOutlined />
          <span>Colors</span>
        </div>
      ),
      key: "6",
      children: [
        {
          label: (
            <div style={{ overflowY: "auto", width: "18vw", height: "150px" }}>
              {showColors()}
            </div>
          ),
          key: "color",
        },
      ],
    },
    /* shipping */
    {
      label: (
        <div className="h6">
          <StarOutlined />
          <span>Shippings</span>
        </div>
      ),
      key: "7",
      children: [
        {
          label: (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                width: "18vw",
                height: "150px",
              }}
            >
              {showShipping()}
            </div>
          ),
          key: "shipping",
        },
      ],
    },
  ];

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3" style={{ paddingTop: "3vh" }}>
          <h4>Search/Filter</h4>
          <StyledMenu
            selectedKeys={[currentFilter]}
            onClick={handleClick}
            defaultOpenKeys={["1", "2", "3", "4", "5", "6", "7"]}
            mode="inline"
            items={items}
            style={{ width: "23vw", height: "100vh" }}
          />
        </div>
        <div className="col-md-9">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4 className="text-danger">Products</h4>
          )}
          {products.length < 1 && <p>No products found</p>}
          <div className="row pb-5">
            {products.map((p) => (
              <div key={p._id} className="col-md-4 mt-3">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
