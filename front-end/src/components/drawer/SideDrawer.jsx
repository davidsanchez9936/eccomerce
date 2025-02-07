import { Drawer, Button } from "antd";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Link } from "react-router-dom";
/* import imagen from "../../images/laptop.png"; */

export function SideDrawer() {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }), shallowEqual);

  const imageStyle = {
    width: "100%",
    height: "50%",
    objectFit: "contain",
  };

  return (
    <Drawer
      className="text-center"
      title={`Cart / ${cart.length} Product`}
      placement="right"
      closable={false}
      onClose={() => {
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        });
      }}
      visible={drawer}
    >
      {cart.map((p) => (
        <div key={p._id} className="row">
          <div className="col">
            {p.images[0] ? (
              <>
                <img src={p.images[0].url} style={imageStyle} />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}
                </p>
              </>
            ) : (
              <div>
                <img src={p.images[0].url} style={imageStyle} />
                <p className="text-center bg-secondary text-light">
                  {p.title} x {p.count}
                </p>
              </div>
            )}
          </div>
        </div>
      ))}

      <Link to="/cart">
        <Button
          onClick={() =>
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            })
          }
          className="text-center btn btn-primary btn-raised btn-block"
        >
          Go To Cart
        </Button>
      </Link>
    </Drawer>
  );
}
