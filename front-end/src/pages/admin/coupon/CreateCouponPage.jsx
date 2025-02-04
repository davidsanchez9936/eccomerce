import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  createCoupon,
  getCoupons,
  removeCoupon,
} from "../../../functions/coupon.jsx";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteOutlined } from "@ant-design/icons";
import { AdminNav } from "../../../components/nav/AdminNav.jsx";
import { useEffect, useState } from "react";

export function CreateCouponPage() {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState(null); // Inicializar expiry como null
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState("");
  const [coupons, setCoupons] = useState([]);

  const { user } = useSelector((state) => ({ ...state }), shallowEqual);

  useEffect(() => {
    loadAllCoupons();
    /*   getCoupons()
      .then((res) => res.json())
      .then((data) => setCoupons(data)); */
  }, []);

  const loadAllCoupons = () => {
    getCoupons()
      .then((res) => res.json())
      .then((data) => setCoupons(data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setName("");
        loadAllCoupons()
        setDiscount("");
        setExpiry("");
        toast.success(`"${data.name}" is created`);
      })
      .catch((err) => {
        setLoading(false);
        console.log("create coupon err", err);
      });
  };

  const handleRemove = (couponId) => {
    if (window.confirm("Delete")) {
      setLoading(true);
      removeCoupon(couponId, user.token)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          getCoupons()
            .then((res) => res.json())
            loadAllCoupons()
          setLoading(false);
          toast.error(`Coupon "${data.name}" deleted`);
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10 mt-3">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Coupon</h4>
          )}
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control mt-3"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </div>
            <hr />
            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control mt-3"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                autoFocus
                required
              />
            </div>
            <hr />
            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <br />
              <DatePicker
                className="form-control"
                selected={expiry}
                value={expiry}
                onChange={(date) => setExpiry(date)}
                required
              />
            </div>
            <button className="brn btn-outlined-primary">Save</button>
          </form>
          <br />

          <h4>{coupons.length} Coupons</h4>

          <table className="table table-bordered/">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{new Date(c.expiry).toLocaleDateString()}</td>
                  <td>{c.discount}%</td>
                  <td>
                    <DeleteOutlined
                      onClick={() => handleRemove(c._id)}
                      className="text-danger pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
