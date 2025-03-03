import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, FormGroup, Input, Label } from "reactstrap";
import { editEmployee, getEmployeeById } from "../../managers/abassadorManager";

export const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
  });
  const [errors, setErrors] = useState("");

  useEffect(() => {
    getEmployeeById(id).then(setEmployee);
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    editEmployee(id, employee).then((res) => {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        navigate("/employees");
      }
    });
  };
  return (
    <Container>
      <h2>Edit Ambassador</h2>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label>First Name</Label>
          <Input
            type="text"
            value={employee.firstName}
            onChange={(e) => {
              const employeeCopy = { ...employee };
              employeeCopy.firstName = e.target.value;
              setEmployee(employeeCopy);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Last Name</Label>
          <Input
            type="text"
            value={employee.lastName}
            onChange={(e) => {
              const employeeCopy = { ...employee };
              employeeCopy.lastName = e.target.value;
              setEmployee(employeeCopy);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Email</Label>
          <Input
            type="text"
            value={employee.email}
            onChange={(e) => {
              const employeeCopy = { ...employee };
              employeeCopy.email = e.target.value;
              setEmployee(employeeCopy);
            }}
          />
        </FormGroup>
        <FormGroup>
          <Label>Address</Label>
          <Input
            type="text"
            value={employee.address}
            onChange={(e) => {
              const employeeCopy = { ...employee };
              employeeCopy.address = e.target.value;
              setEmployee(employeeCopy);
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
    </Container>
  );
};
