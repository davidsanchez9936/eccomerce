import { Select } from "antd";

export function ProductCreateForm({
  handleChange,
  handleSubmit,
  values,
  handleCategoryChange,
  subOptions,
  setValues,
  showSub,
}) {
  const { Option } = Select;

  // destructure
  const {
    title,
    description,
    price,
    categories,
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
        <select name="color" className="form-control" onChange={handleChange}>
          <option>Please select</option>
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
        <select name="brand" className="form-control" onChange={handleChange}>
          <option>Please select</option>
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
      
      <hr />

      {showSub && subOptions && (
        <div>
          <label>Sub Category</label>
          <hr />
          <Select
            mode="multiple"
            style={{ width: "100vw" }}
            placeholder="Please select"
            value={subs}
            name="subs"
            onChange={(value) => setValues({ ...values, subs: value })}
          >
            {subOptions.length > 0 &&
              subOptions.map((s) => (
                <Select.Option key={s._id} value={s._id}>
                  {s.name}
                </Select.Option>
              ))}
          </Select>
        </div>
      )}
      <hr />
      <button className="btn btn-outlined-info">Save</button>
    </form>
  );
}
