import { useEffect, useState } from "react";
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
import { createCustomer } from "../../managers/customerManager";
import {
  getAgeGroups,
  getGenders,
  getLocations,
  getRaces,
} from "../../managers/demoManager";

export const CreateCustomer = () => {
  const navigate = useNavigate();
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    address: "",
    ageGroupId: 0,
    genderId: 0,
    raceId: 0,
    locationId: 0,
  });
  const [ageGroups, setAgeGroups] = useState([]);
  const [genders, setGenders] = useState([]);
  const [races, setRaces] = useState([]);
  const [locations, setLocations] = useState([]);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    getAgeGroups().then(setAgeGroups);
  }, []);

  useEffect(() => {
    getGenders().then(setGenders);
  }, []);

  useEffect(() => {
    getRaces().then(setRaces);
  }, []);

  useEffect(() => {
    getLocations().then(setLocations);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await createCustomer(newCustomer);

    if (res.errors) {
      setErrors(res.errors);
    } else {
      // Use the `id` returned from the backend
      const createdCustomerId = res.id; // Adjust this to match your backend response format
      navigate(`/customers/${createdCustomerId}`);
    }
  };

  return (
    <Container className="w-100 mt-5">
      <Card className="w-100">
        <h2 className="fw-bold text-center mt-4">Add Customer</h2>
        <form onSubmit={handleSubmit} className="p-4">
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={newCustomer.name}
                  onChange={(e) => {
                    const customerCopy = { ...newCustomer };
                    customerCopy.name = e.target.value;
                    setNewCustomer(customerCopy);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => {
                    const customerCopy = { ...newCustomer };
                    customerCopy.email = e.target.value;
                    setNewCustomer(customerCopy);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="text"
                  value={newCustomer.address}
                  onChange={(e) => {
                    const customerCopy = { ...newCustomer };
                    customerCopy.address = e.target.value;
                    setNewCustomer(customerCopy);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Age Group</Label>
                <Input
                  type="select"
                  value={newCustomer.ageGroupId}
                  onChange={(e) => {
                    const customerCopy = { ...newCustomer };
                    customerCopy.ageGroupId = parseInt(e.target.value);
                    setNewCustomer(customerCopy);
                  }}
                >
                  <option value={0}>Choose an age group</option>
                  {ageGroups.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.group}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Gender</Label>
                <Input
                  type="select"
                  value={newCustomer.genderId}
                  onChange={(e) => {
                    const customerCopy = { ...newCustomer };
                    customerCopy.genderId = parseInt(e.target.value);
                    setNewCustomer(customerCopy);
                  }}
                >
                  <option value={0}>Choose a gender</option>
                  {genders.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.genderValue}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Race</Label>
                <Input
                  type="select"
                  value={newCustomer.raceId}
                  onChange={(e) => {
                    const customerCopy = { ...newCustomer };
                    customerCopy.raceId = parseInt(e.target.value);
                    setNewCustomer(customerCopy);
                  }}
                >
                  <option value={0}>Choose a race</option>
                  {races.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.raceValue}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Location</Label>
                <Input
                  type="select"
                  value={newCustomer.locationId}
                  onChange={(e) => {
                    const customerCopy = { ...newCustomer };
                    customerCopy.locationId = parseInt(e.target.value);
                    setNewCustomer(customerCopy);
                  }}
                >
                  <option value={0}>Choose a location</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.locationValue}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <div className="text-center mt-4">
            <Button type="submit" color="primary" className="px-4">
              Submit
            </Button>
          </div>
          {errors && (
            <div style={{ color: "red", marginTop: "20px" }}>
              {Object.keys(errors).map((key) => (
                <p key={key}>
                  {key}: {errors[key].join(",")}
                </p>
              ))}
            </div>
          )}
        </form>
      </Card>
    </Container>
  );
};
