import "./Home.css";
import { Jumbotron } from "../components/cards/Jumbotron.jsx";
import { NewArrivals } from "../components/home/NewArrivals.jsx";
import { BestSellers } from "../components/home/BestSellers.jsx";
import { CategoryList } from "../components/category/CategoryList.jsx";
import { SubList } from "../components/sub/SubList.jsx";

export function Home() {
  return (
    <>
      <div
        className="jumbotron display-3  text-danger h1 font-weight-bold text-center container1"
        style={{ height: "25vh", width: "100vw", backgroundColor: "#C0CCD0" }}
      >
        <Jumbotron text={["Latest Product", "New Arrivals", "Best Sellers"]} />
      </div>
      <br />
      <div
        className="text-center p-3 mt-4 display-3  jumbotron"
        style={{ width: "100vw", backgroundColor: "#C0CCD0" }}
      >
        New Arrivals
      </div>

      <div className="container mt-5">
        <NewArrivals />
      </div>

      <div
        className="text-center p-3 mt-5 display-3  jumbotron"
        style={{ width: "100vw", backgroundColor: "#C0CCD0" }}
      >
        Best Sellers
      </div>
      <div className="container mt-5">
        <BestSellers />
      </div>
      <div
        className="text-center p-3 mt-5 display-3  jumbotron"
        style={{ width: "100vw", backgroundColor: "#C0CCD0" }}
      >
        Categories
      </div>
      <div className="container mt-5">
        <CategoryList />
      </div>

      <div
        className="text-center p-3 mt-5 display-3  jumbotron"
        style={{ width: "100vw", backgroundColor: "#C0CCD0" }}
      >
        Sub Categories
      </div>
      <div className="container mt-5">
        <SubList />
      </div>
    </>
  );
}
