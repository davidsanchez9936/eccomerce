import { StarOutlined } from "@ant-design/icons";
import { Card, Modal } from "antd";
import { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

export function RatingModal({ children }) {
  const params = useParams();
  const { slug } = params;
  const { user } = useSelector((state) => ({ ...state }), shallowEqual);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleModal = () => {
    if (user && user.token) {
      setModalOpen(true);
    } else {
      navigate("/login", { state: { from: `/product/${slug}` } });
    }
  };

  return (
    <>
      <div onClick={handleModal}>
        <StarOutlined className="text-danger" />
        <br />
        {user ? "Leave rating" : "Login to leave rating"}
      </div>
      <Modal
        title="Leave your rating"
        centered
        open={modalOpen}
        onOk={() => {
          setModalOpen(false);
          toast.success("Thank for your review. It will apper soon");
        }}
        onCancel={() => setModalOpen(false)}
      >
        {children}
      </Modal>
    </>
  );
}
