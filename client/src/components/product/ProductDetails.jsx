import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Spinner,
  Container,
  CardBody,
  Card,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
} from "reactstrap";
import { deleteProduct, getProductById } from "../../managers/productManager";

export const ProductDetails = () => {
  const [product, setProduct] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getProductById(id).then(setProduct);
  }, [id]);

  const handleDelete = (id) => {
    deleteProduct(id).then(() => {
      navigate("/products");
    });
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  if (!product || !product.image) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      {/* Product Card */}
      <div
        className="mx-auto"
        style={{
          maxWidth: "500px", // Matches card width
        }}
      >
        <Card
          className="product-details-card position-relative"
          style={{
            border: "1px solid white",
            textDecoration: "none",
            maxHeight: "auto",
            maxWidth: "500px",
          }}
        >
          {/* Product Name and Pack */}
          <Row className=" align-items-center" style={{ display: "flex" }}>
            <h2 className="fs-4 mb-0">{product.name}</h2>
            <h2 className="fs-6 mb-0">{product.pack} Pack</h2>
          </Row>
          {/* Dropdown for three dots */}
          <Dropdown
            isOpen={dropdownOpen === product.id}
            toggle={() => toggleDropdown(product.id)}
            className="position-absolute"
            style={{ top: "10px", right: "10px" }}
          >
            <DropdownToggle
              tag="button"
              className="btn btn-light btn-sm p-0 border-0"
            >
              <i className="bi bi-three-dots me-3"></i>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem className="text-warning" tag={Link} to={`edit`}>
                Edit
              </DropdownItem>
              <DropdownItem
                onClick={() => handleDelete(product.id)}
                className="text-danger"
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>

          {/* Card Content */}
          <CardBody className="text-center">
            <img
              className="mb-2"
              src={product.image}
              alt={product.name}
              style={{ maxWidth: "75%", height: "auto" }}
            />
            <p className="fs-4 mb-4">${product.price}</p>
            <p
              className="mb-0 text-center"
              style={{
                maxWidth: "350px",
                margin: "0 auto",
              }}
            >
              {product.ingredients}
            </p>
          </CardBody>
        </Card>
      </div>
    </Container>
  );
};
