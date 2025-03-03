import { useEffect, useState } from "react";
import { deleteCustomer, getCustomers } from "../../managers/customerManager";
import {
  Button,
  Row,
  Col,
  Card,
  CardBody,
  Container,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/styles/customerList.css";

export const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getCustomers().then((data) => {
      setCustomers(data);
      setFilteredCustomers(data);
    });
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    const filtered = customers.filter((customer) =>
      customer.name.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleRowClick = (id) => {
    navigate(`/customers/${id}`);
  };

  const toggleDropdown = (id) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  const handleDelete = (id, event) => {
    event.stopPropagation(); // Prevent row click event
    deleteCustomer(id).then(() => {
      getCustomers().then((data) => {
        setCustomers(data);
        setFilteredCustomers(data);
      });
    });
  };

  return (
    <Container className="mt-5">
      <Card className="p-1">
        <CardBody className="mx-0">
          <Row className="mb-4 d-flex align-items-center">
            {/* Left-aligned "Customers" */}
            <Col xs="auto">
              <h2 className="fw-bold display-4">Customers</h2>
            </Col>

            {/* Center-aligned search input */}
            <Col xs="auto">
              <div className="d-flex align-items-center mb-0">
                <div className="search-container d-flex align-items-center">
                  <i className="bi bi-search search-icon"></i>
                  <Input
                    type="text"
                    placeholder="Search Customers"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
              </div>
            </Col>

            {/* Right-aligned "Add Customer" button */}
            <Col xs="auto" className="text-end">
              <Link to="add-customer">
                <Button
                  color="primary"
                  className="px-3 d-flex align-items-center"
                >
                  <i className="bi bi-person-plus me-2"></i>
                  Add Customer
                </Button>
              </Link>
            </Col>
          </Row>

          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              minHeight: "400px",
            }}
          >
            <table>
              <thead>
                <tr>
                  <th className="col-7 col-md-2">Name</th>
                  <th className="d-none d-lg-table-cell">Address</th>
                  <th className="d-none d-lg-table-cell">Email</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((c) => (
                  <tr
                    key={c.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(c.id)}
                  >
                    <td className="col-7 col-md-2">{c.name}</td>
                    <td className="d-none d-lg-table-cell">{c.address}</td>
                    <td className="d-none d-lg-table-cell">{c.email}</td>
                    <td className="col-1 text-end">
                      <Dropdown
                        isOpen={dropdownOpen === c.id}
                        toggle={(event) => {
                          event.stopPropagation(); // Prevent row click event
                          toggleDropdown(c.id);
                        }}
                        className="d-inline-block"
                      >
                        <DropdownToggle
                          tag="button"
                          className="btn btn-light btn-sm p-0 border-0"
                        >
                          <i className="bi bi-three-dots"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            className="text-white"
                            tag={Link}
                            to={`${c.id}`}
                            onClick={(event) => event.stopPropagation()} // Prevent row click
                          >
                            Details
                          </DropdownItem>
                          <DropdownItem
                            onClick={(event) => handleDelete(c.id, event)}
                            className="text-danger"
                          >
                            Delete
                          </DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </Container>
  );
};
