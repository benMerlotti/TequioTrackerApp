import { useEffect, useState } from "react";
import { deleteProduct, getProducts } from "../../managers/productManager";
import { Link } from "react-router-dom";
import { Button, Row, Col, Card, CardBody, Container } from "reactstrap";

export const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  // const handleDelete = (id) => {
  //   deleteProduct(id).then(() => {
  //     getProducts().then(setProducts);
  //   });
  // };

  return (
    <Container className="mt-5">
      <Card>
        <CardBody>
          <Row className="mb-4">
            <Col>
              <h2 className="fw-bold">Products</h2>
              <p>
                Manage your product inventory. Add new products or view product
                details below.
              </p>
            </Col>
            <Col className="text-end">
              <Link to="add-product">
                <Button color="primary" className="px-4">
                  + Add Product
                </Button>
              </Link>
            </Col>
          </Row>
          <Row>
            {products.map((product) => (
              <Col md="4" sm="6" xs="12" key={product.id} className="mb-4">
                <div className="d-flex flex-column align-items-center">
                  {/* Product Card */}
                  <Card
                    className="product-card h-100 p-0"
                    style={{
                      border: "1px solid white",
                      cursor: "pointer",
                      textDecoration: "none",
                      transition:
                        "transform 0.2s ease-in-out, background-color 0.2s ease-in-out",
                      width: "100%",
                    }}
                    tag={Link}
                    to={`${product.id}`}
                  >
                    <CardBody
                      style={{ color: "inherit", textDecoration: "none" }}
                      className="text-center"
                    >
                      <img
                        src={product.image}
                        alt="product-image"
                        style={{
                          marginLeft: "0px",
                          maxWidth: "100%",
                          height: "auto",
                        }}
                      />
                      <p className="mb-0">{product.name}</p>
                      <p className="mb-0">{product.pack} Pack</p>
                    </CardBody>
                  </Card>
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </Container>
  );
};
