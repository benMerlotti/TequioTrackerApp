import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Container,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";
import { createEmployee } from "../../managers/abassadorManager";

export const CreateEmployee = () => {
  const navigate = useNavigate();
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    createEmployee(newEmployee).then((res) => {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        navigate("/employees");
      }
    });
  };
  return (
    <Container>
      <Card>
        <h2>Add Ambassador</h2>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={newEmployee.name}
                  onChange={(e) => {
                    const employeeCopy = { ...newEmployee };
                    employeeCopy.name = e.target.value;
                    setNewEmployee(employeeCopy);
                  }}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="text"
                  value={newEmployee.email}
                  onChange={(e) => {
                    const employeeCopy = { ...newEmployee };
                    employeeCopy.email = e.target.value;
                    setNewEmployee(employeeCopy);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label>Address</Label>
            <Input
              type="text"
              value={newEmployee.address}
              onChange={(e) => {
                const employeeCopy = { ...newEmployee };
                employeeCopy.address = e.target.value;
                setNewEmployee(employeeCopy);
              }}
            />
          </FormGroup>
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
