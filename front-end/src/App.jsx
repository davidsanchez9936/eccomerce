// App.jsx
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import { Login } from "./pages/auth/Login.jsx";
import { SideDrawer } from "./components/drawer/SideDrawer.jsx";
import { Register } from "./pages/auth/Register.jsx";
import { Home } from "./pages/Home.jsx";
import { Header } from "./components/nav/Header.jsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { RegisterComplete } from "./pages/auth/RegisterComplete.jsx";
import { auth } from "./firebase.js";
import { useDispatch } from "react-redux";
import { ForgotPassword } from "./pages/auth/ForgotPassword.jsx";
import { currentUser } from "./functions/auth.js";
import { History } from "./pages/user/History.jsx";
import { UserRoute } from "./components/routes/UserRoute.jsx";
import { AdminRoute } from "./components/routes/AdminRoute.jsx";
import { Password } from "./pages/user/Password.jsx";
import { Wishlist } from "./pages/user/Wishlist.jsx";
import { AdminDashboard } from "./pages/admin/AdminDashboard.jsx";
import { CategoryCreate } from "./pages/admin/category/CategoryCreate.jsx";
import { CategoryUpdate } from "./pages/admin/category/CategoryUpdate.jsx";
import { SubCreate } from "./pages/admin/sub/SubCreate.jsx";
import { SubUpdate } from "./pages/admin/sub/SubUpdate.jsx";
import { ProductCreate } from "./pages/admin/product/ProductCreate.jsx";
import { AllProducts } from "./pages/admin/product/AllProducts.jsx";
import { ProductUpdate } from "./pages/admin/product/ProductUpdate.jsx";
import { Product } from "./pages/Product.jsx";
import { CategoryHome } from "./pages/category/CategoryHome.jsx";
import { SubHome } from "./pages/sub/SubHome.jsx";
import { Shop } from "./pages/Shop.jsx";
import { Cart } from "./pages/Cart.jsx";
import { Checkout } from "./pages/Checkout.jsx";
import { CreateCouponPage } from "./pages/admin/coupon/CreateCouponPage.jsx";
import { Payment } from "./pages/Payment.jsx";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.accessToken;
        console.log("user", user);
        currentUser(idTokenResult)
          .then((res) => res.json())
          .then((data) => {
            console.log("Respuesta de createOrUpdateUser:", data);
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: data.name,
                email: data.email,
                token: idTokenResult,
                role: data.role,
                _id: data._id,
              },
            });
          })
          .catch((err) => console.log(err));
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <Header />
      <SideDrawer />
      <ToastContainer />
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/complete" element={<RegisterComplete />} />
          <Route path="/forgot/password" element={<ForgotPassword />} />
          <Route
            path="/user/history/*"
            element={
              <UserRoute>
                <History />
              </UserRoute>
            }
          />
          <Route
            path="/user/password/*"
            element={
              <UserRoute>
                <Password />
              </UserRoute>
            }
          />
          <Route
            path="/user/wishlist/*"
            element={
              <UserRoute>
                <Wishlist />
              </UserRoute>
            }
          />

          <Route
            path="/admin/dashboard/*"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/category/*"
            element={
              <AdminRoute>
                <CategoryCreate />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/category/:slug"
            element={
              <AdminRoute>
                <CategoryUpdate />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/sub"
            element={
              <AdminRoute>
                <SubCreate />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/sub/:slug"
            element={
              <AdminRoute>
                <SubUpdate />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/product"
            element={
              <AdminRoute>
                <ProductCreate />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AllProducts />
              </AdminRoute>
            }
          />

          <Route
            path="/admin/product/:slug"
            element={
              <AdminRoute>
                <ProductUpdate />
              </AdminRoute>
            }
          />

          <Route exact path="/product/:slug" element={<Product />} />

          <Route exact path="/category/:slug" element={<CategoryHome />} />
          <Route exact path="/sub/:slug" element={<SubHome />} />
          <Route exact path="/shop" element={<Shop />} />
          <Route exact path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <UserRoute>
                <Checkout />
              </UserRoute>
            }
          />

          <Route
            path="/admin/coupon"
            element={
              <AdminRoute>
                <CreateCouponPage />
              </AdminRoute>
            }
          />

          <Route
            path="/payment"
            element={
              <UserRoute>
                <Payment />
              </UserRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
