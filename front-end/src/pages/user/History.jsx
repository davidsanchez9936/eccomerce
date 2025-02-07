import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { UserNav } from "../../components/nav/UserNav.jsx";
import { getUserOrders } from "../../functions/user.jsx";
import { useEffect, useState } from "react";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { ShowPaymentInfo } from "../../components/cards/ShowPaymentInfo.jsx";
/* import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  PDFViewer,
} from "@react-pdf/renderer"; */
/* import { Invoice } from "../../components/order/Invoice.jsx"; */

export function History() {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);

  useEffect(() => {
    loadUserOrders();
  }, []);

  const loadUserOrders = () => {
    getUserOrders(user.token)
      .then((res) => res.json())
      .then((data) => {
        console.log(JSON.stringify(data, null, 4));
        setOrders(data);
      });
  };

  const showOrderInTable = (order) => {
    return (
      <table className="table table-bordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Shipping</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((p, i) => (
            <tr key={i}>
              {console.log(p)}
              <td>
                <b>{p.product.title}</b>
              </td>
              <td>{p.product.price}</td>
              <td>{p.product.brand}</td>
              <td>{p.product.color}</td>
              <td>{p.count}</td>
              <td>
                {p.product.shipping === "Yes" ? (
                  <CheckCircleOutlined style={{ color: "green" }} />
                ) : (
                  <CloseCircleOutlined style={{ color: "red" }} />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  /* const showDownloadLink = (order) => {
    return (
      <PDFDownloadLink
        document={<Invoice order={order} />}
        fileName="invoiced.pdf"
        className="btn btn-sm btn-block btn-outlined-primary"
      >
        Download PDF
      </PDFDownloadLink>
    );
  }; */
  /* <Document>
            <Page size="A4">
              <View>
                <Text>Section #1</Text>
                <Text>Section #2</Text>
              </View>
            </Page>
          </Document> */

  const showEachOrders = () => {
    return orders.reverse().map((order, i) => (
      <div key={i} className="m-5 p-3 card">
        <ShowPaymentInfo order={order} />
        {console.log(order)}
        {showOrderInTable(order)}
        <div className="row">
  {/*         <div className="col">{showDownloadLink(order)}</div> */}
        </div>
      </div>
    ));
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <UserNav />
        </div>
        <div className="col text-center">
          <h4>
            {orders.length > 0 ? "User purchase orders" : "No purchase orders"}
          </h4>
          {showEachOrders()}
        </div>
      </div>
    </div>
  );
}
