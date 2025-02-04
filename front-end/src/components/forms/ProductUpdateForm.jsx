import { Select } from "antd";

export function ProductUpdateForm({
  handleChange,
  handleSubmit,
  values,
  setValues,
  handleCategoryChange,
  categories,
  subOptions,
  arrayOfSubs,
  setArrayOfSubs,
  selectedCategory,
}) {
  const { Option } = Select;
  // destructure
  const {
    title,
    description,
    price,
    category,
    subs,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <hr/>
        
        <hr/>
        <label>Title</label>
        <hr />
        <input
          type="text"
          name="title"
          className="form-control"
          value={title}
          onChange={handleChange}
        />
      </div>
      <hr />
      <div className="form-group">
        <label>Description</label>
        <hr />
        <input
          type="text"
          name="description"
          className="form-control"
          value={description}
          onChange={handleChange}
        />
      </div>
      <hr />
      <div className="form-group">
        <label>Price</label>
        <hr />
        <input
          type="number"
          name="price"
          className="form-control"
          value={price}
          onChange={handleChange}
        />
      </div>
      <hr />
      <div className="form-group">
        <label>Shipping</label>
        <hr />
        <select
          value={shipping || ""} // Asigna el valor de shipping o una cadena vacía si shipping es falsy
          name="shipping"
          className="form-control"
          onChange={handleChange}
        >
          <option value="">Please select</option>
          <option value="No">No</option>
          <option value="Yes">Yes</option>
        </select>
      </div>
      <hr />
      <div className="form-group">
        <label>Quantity</label>
        <hr />
        <input
          type="number"
          name="quantity"
          className="form-control"
          value={quantity}
          onChange={handleChange}
        />
      </div>
      <hr />
      <div className="form-group">
        <label>Color</label>
        <hr />
        <select
          name="color"
          className="form-control"
          value={color || ""} // Asigna el valor de color o una cadena vacía si color es falsy
          onChange={handleChange}
        >
          <option value="">Please select</option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <div className="form-group">
        <label>Brand</label>
        <hr />
        <select
          name="brand"
          className="form-control"
          value={brand || ""} // Asigna el valor de brand o una cadena vacía si brand es falsy
          onChange={handleChange}
        >
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>
      <hr />
      <div className="form-group">
        <label>Category</label>
        <hr />
        <select
          name="category"
          className="form-control"
          onChange={handleCategoryChange}
          value={selectedCategory ? selectedCategory : category._id}
        >
          {categories &&
            categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
      <hr />

      <div>
        <label>Sub Category</label>
        <hr />
        <Select
          mode="multiple"
          style={{ width: "100vw" }}
          placeholder="Please select"
          value={arrayOfSubs}
          name="subs"
          onChange={(value) => setArrayOfSubs(value)}
        >
          {subOptions &&
            subOptions.length &&
            subOptions.map((s) => (
              <Select.Option key={s._id} value={s._id}>
                {s.name}
              </Select.Option>
            ))}
        </Select>
      </div>
      <hr />
      <button className="btn btn-outlined-info">Save</button>
    </form>
  );
}
