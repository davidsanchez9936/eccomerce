import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { ShowPaymentInfo } from "../cards/ShowPaymentInfo.jsx";

export function Orders({ orders, handleStatusChange }) {
  const showOrderInTable = (order) => {
    return (
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Precio</th>
            <th>Marca</th>
            <th>Color</th>
            <th>Cantidad</th>
            <th>Envío</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p, i) => {
            const product = p.product || {};
            return (
              <tr key={i}>
                <td>{product.title || "N/A"}</td>
                <td>{product.price || "N/A"}</td>
                <td>{product.brand || "N/A"}</td>
                <td>{product.color || "N/A"}</td>
                <td>{p.count || 0}</td>
                <td>
                  {product.shipping === "Yes" ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  return (
    <>
      {orders && orders.length > 0 ? (
        orders.map((order) => (
          <div key={order._id} className="row pb-5">
            <div className="btn btn-block bg-light">
              <ShowPaymentInfo order={order} showStatus={false} />
              <div className="row">
                <div className="col-md-4">Delivery Status</div>
                <div className="col-me-8">
                  <select
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="form-control"
                    defaultValue={order.orderStatus}
                    name="status"
                  >
                    <option value="Not Processed">Not Processed</option>
                    <option value="Cash On Delivery">Cash On Delivery</option>
                    <option value="Processing">Processing</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
            {showOrderInTable(order)}
          </div>
        ))
      ) : (
        <p>No se encontraron órdenes</p>
      )}
    </>
  );
}
