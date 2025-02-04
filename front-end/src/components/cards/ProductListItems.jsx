import { Link } from "react-router-dom";

export function ProductListItems({ product }) {
  const { price, category, subs, shipping, color, brand, quantity, sold } = product;
  const styles = {
    listItem: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      border: "none",
    },
  };
  return (
    <ul className="list-group">
      <li className="list-group-item" style={styles.listItem}>
        Price
        <span>$ {price}</span>
      </li>

      {category && (
        <li
          className="list-group-item"
          style={styles.listItem}
        >
          Category
          <Link  to={`/category/${category.slug}`}>{category.name}</Link>
        </li>
      )}

      {subs && (
        <li className="list-group-item" style={styles.listItem}>
          Sub Categories
          {subs.map((s) => (
            <Link key={s._id} to={`/sub/${s.slug}`}>
              $ {s.name}
            </Link>
          ))}
        </li>
      )}

      <li className="list-group-item" style={styles.listItem}>
        Shipping
        <span>{shipping}</span>
      </li>

      <li className="list-group-item" style={styles.listItem}>
        Color
        <span>{color}</span>
      </li>

      <li className="list-group-item" style={styles.listItem}>
        Brand
        <span>{brand}</span>
      </li>

      <li className="list-group-item" style={styles.listItem}>
        Available
        <span>$ {quantity}</span>
      </li>

      <li className="list-group-item" style={styles.listItem}>
        Sold
        <span>{sold}</span>
      </li>

    </ul>
  );
}
