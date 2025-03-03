import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { createProduct } from "../../managers/productManager";

export const CreateProduct = () => {
  const navigate = useNavigate();
  const [newProduct, setNewProduct] = useState({
    name: "",
    pack: 0,
    ingredients: "",
    image: "",
    price: 0,
  });
  const [errors, setErrors] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = parseFloat(newProduct.price).toFixed(2);
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      price: price,
    }));

    createProduct(newProduct).then((res) => {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        navigate("/products");
      }
    });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value)) {
      setNewProduct((prevProduct) => ({
        ...prevProduct,
        price: value,
      }));
    }
  };

  return (
    <Container>
      <Card>
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <Row>
            <FormGroup>
              <Label>Name</Label>
              <Input
                type="text"
                value={newProduct.name}
                onChange={(e) => {
                  const productCopy = { ...newProduct };
                  productCopy.name = e.target.value;
                  setNewProduct(productCopy);
                }}
                placeholder="Enter name"
              />
            </FormGroup>
            <FormGroup>
              <Label>Price</Label>
              <Input
                type="text"
                value={newProduct.price}
                onChange={handlePriceChange}
                placeholder="Enter price (e.g., 19.99)"
              />
            </FormGroup>
            <FormGroup>
              <Label>Pack</Label>
              <Input
                type="text"
                value={newProduct.pack}
                onChange={(e) => {
                  const productCopy = { ...newProduct };
                  productCopy.pack = e.target.value;
                  setNewProduct(productCopy);
                }}
                placeholder="Enter pack size"
              />
            </FormGroup>
            <FormGroup>
              <Label>Ingredients</Label>
              <Input
                type="text"
                value={newProduct.ingredients}
                onChange={(e) => {
                  const productCopy = { ...newProduct };
                  productCopy.ingredients = e.target.value;
                  setNewProduct(productCopy);
                }}
                placeholder="Enter ingredients"
              />
            </FormGroup>
            <FormGroup>
              <Label>Ingredients</Label>
              <Input
                type="text"
                value={newProduct.image}
                onChange={(e) => {
                  const productCopy = { ...newProduct };
                  productCopy.image = e.target.value;
                  setNewProduct(productCopy);
                }}
                placeholder="Upload image"
              />
            </FormGroup>
          </Row>
          <Button type="submit" color="primary">
            Submit
          </Button>
          <div style={{ color: "red" }}>
            {Object.keys(errors).map((key) => (
              <p key={key}>
                {key}: {errors[key].join(",")}
              </p>
            ))}
          </div>
        </form>
      </Card>
    </Container>
  );
};
