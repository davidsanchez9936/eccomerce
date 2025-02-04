// AdminProductCard.jsx
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export function AdminProductCard({ product, handleRemove }) {
  const { title, description, images, slug } = product;
  const { Meta } = Card;

  const handleDelete = (slug) => {
    handleRemove(slug);
  };

  return (
    <Card
      style={{ width: "20vw" }}
      className="mt-3"
      cover={
        <img
          src={images && images.length ? images[0].url : ""}
          style={{ height: "30vh", width: "20vw", objectFit: "contain" }}
          className="p-1"
        />
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          <EditOutlined className="text-warning" />
        </Link>,
        <DeleteOutlined className="text-danger" onClick={() => handleDelete(slug)} />,
      ]}
    >
      <Meta title={title} description={`${description && description.substring(0, 40)}...`} />
    </Card>
  );
}