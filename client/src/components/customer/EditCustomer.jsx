import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getAgeGroups,
  getGenders,
  getLocations,
  getRaces,
} from "../../managers/demoManager";
import { editCustomer, getCustomerById } from "../../managers/customerManager";
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

export const EditCustomer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
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
    getCustomerById(id).then(setCustomer);
  }, [id]);

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
    try {
      const res = await editCustomer(id, customer);

      if (res.errors) {
        setErrors(res.errors);
      } else {
        navigate("/customers");
      }
    } catch (err) {
      console.error("Failed to edit customer:", err);
      setErrors(err);
    }
  };

  return (
    <Container>
      <Card>
        <h2>Edit Customer</h2>
        <form onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Name</Label>
                <Input
                  type="text"
                  value={customer.name}
                  onChange={(e) => {
                    const customerCopy = { ...customer };
                    customerCopy.name = e.target.value;
                    setCustomer(customerCopy);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="text"
                  value={customer.email}
                  onChange={(e) => {
                    const customerCopy = { ...customer };
                    customerCopy.email = e.target.value;
                    setCustomer(customerCopy);
                  }}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Address</Label>
                <Input
                  type="text"
                  value={customer.address}
                  onChange={(e) => {
                    const customerCopy = { ...customer };
                    customerCopy.address = e.target.value;
                    setCustomer(customerCopy);
                  }}
                />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Age Group</Label>
                <Input
                  type="select"
                  value={customer.ageGroupId}
                  onChange={(e) => {
                    const customerCopy = { ...customer };
                    customerCopy.ageGroupId = parseInt(e.target.value);
                    setCustomer(customerCopy);
                  }}
                >
                  <option value={0}>Choose an age group</option>
                  {ageGroups.map((a) => (
                    <option key={a.id} value={a.id}>{`${a.group}`}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Gender</Label>
                <Input
                  type="select"
                  value={customer.genderId}
                  onChange={(e) => {
                    const customerCopy = { ...customer };
                    customerCopy.genderId = parseInt(e.target.value);
                    setCustomer(customerCopy);
                  }}
                >
                  <option value={0}>Choose a gender</option>
                  {genders.map((a) => (
                    <option
                      key={a.id}
                      value={a.id}
                    >{`${a.genderValue}`}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label>Race</Label>
                <Input
                  type="select"
                  value={customer.raceId}
                  onChange={(e) => {
                    const customerCopy = { ...customer };
                    customerCopy.raceId = parseInt(e.target.value);
                    setCustomer(customerCopy);
                  }}
                >
                  <option value={0}>Choose a race</option>
                  {races.map((r) => (
                    <option key={r.id} value={r.id}>{`${r.raceValue}`}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md={6}>
              <FormGroup>
                <Label>Location</Label>
                <Input
                  type="select"
                  value={customer.locationId}
                  onChange={(e) => {
                    const customerCopy = { ...customer };
                    customerCopy.locationId = parseInt(e.target.value);
                    setCustomer(customerCopy);
                  }}
                >
                  <option value={0}>Choose a location</option>
                  {locations.map((l) => (
                    <option
                      key={l.id}
                      value={l.id}
                    >{`${l.locationValue}`}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>

          <Button type="submit" color="primary" className="mt-3">
            Submit
          </Button>

          <div style={{ color: "red", marginTop: "10px" }}>
            {Object.keys(errors).map((key) => (
              <p key={key}>
                {key}:{" "}
                {Array.isArray(errors[key])
                  ? errors[key].join(", ")
                  : errors[key]}
              </p>
            ))}
          </div>
        </form>
      </Card>
    </Container>
  );
};
