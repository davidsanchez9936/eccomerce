import { useEffect, useState } from "react";
import { AdminNav } from "../../components/nav/AdminNav.jsx";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import { getOrders, changeStatus } from "../../functions/Admin.jsx";
import {Orders} from "../../components/order/Orders.jsx"

export function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    getOrders(user.token)
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data, null, 4));
        setOrders(data);
      });
  };

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(orderId, orderStatus, user.token)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        toast.success("Status updated");
        loadOrders();
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 mt-3">
          <AdminNav />
        </div>
        <div style={{ position: "relative", left: "10vw", bottom: "30vh" }}>
          <div className="col-md-10">
            <h4>Admin Dashboard</h4>
            <Orders orders={orders} handleStatusChange={handleStatusChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
