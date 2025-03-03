import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Spinner,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  getCustomerById,
  deleteCustomer,
} from "../../managers/customerManager";

export const CustomerDetails = () => {
  const [customer, setCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMore, setShowMore] = useState(false); // State for toggling "more" content

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getCustomerById(id).then((data) => {
      setCustomer(data);
      setFilteredPurchases(data.purchases);
    });
  }, [id]);

  const handleDelete = () => {
    deleteCustomer(id).then(() => {
      navigate("/customers");
    });
  };

  const handleEdit = () => {
    navigate("edit");
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (customer) {
      const filtered = customer.purchases.filter((purchase) =>
        new Date(purchase.purchaseDate).toLocaleDateString().includes(term)
      );
      setFilteredPurchases(filtered);
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  if (!customer) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
        <p>Loading customer details...</p>
      </div>
    );
  }

  return (
    <Container className="p-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
        <div className="text-start w-100">
          <p className="m-0">Customer Details</p>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <h1 className="customer-name fw-bold display-4">{customer.name}</h1>
          </div>
          <div className="d-flex flex-wrap gap-3">
            <p className="m-0">Purchases:</p>
            <p className="total-sales">{customer.purchases.length}</p>
            <p>Last Purchase:</p>
            <p className="total-sales m-0">
              {customer.purchases.length > 0
                ? new Date(
                    Math.max(
                      ...customer.purchases.map((p) => new Date(p.purchaseDate))
                    )
                  ).toLocaleDateString()
                : "No purchases yet"}
            </p>
          </div>
          <div className="d-flex flex-wrap gap-3">
            <p className="m-0">Email:</p>
            <p className="total-sales">{customer.email}</p>
            <p className="m-0">Address:</p>
            <p className="total-sales">{customer.address}</p>
            <p
              onClick={toggleShowMore}
              className="fw-bold"
              style={{ cursor: "pointer" }}
            >
              {showMore ? "Show Less" : "...more"}
            </p>
          </div>
        </div>

        {/* Dropdown for three dots */}
        <div className="mt-3 mt-md-0">
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle
              tag="button"
              className="btn btn-light btn-sm p-0 border-0"
            >
              <i className="bi bi-three-dots"></i>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem onClick={handleEdit} className="text-warning">
                Edit
              </DropdownItem>
              <DropdownItem onClick={handleDelete} className="text-danger">
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* More Content */}
      <div
        className={`fade-in-content ${showMore ? "visible" : ""}`}
        style={{
          opacity: showMore ? 1 : 0,
          transform: showMore ? "translateY(0)" : "translateY(-10px)",
          transition: "opacity .9s ease, transform .9s ease",
        }}
      >
        <div className="d-flex flex-wrap gap-2">
          <p className="fw-bold m-0">Demographics: </p>
          <p>
            {customer.ageGroup?.group}, {customer.gender?.genderValue},{" "}
            {customer.race?.raceValue}
          </p>
        </div>
      </div>

      <hr
        style={{
          borderTop: "1px solid #ccc",
          marginTop: ".1rem",
          marginBottom: "3rem",
        }}
      />

      <Row>
        {/* Purchases Table */}
        <Col md={12}>
          <Card className="p-0">
            <CardBody className="p-0">
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "center",
                  marginBottom: "3rem",
                }}
              >
                <h3 className="fw-bold text-start">Purchases</h3>
                <i className="bi bi-search search-icon"></i>
                <Input
                  type="text"
                  placeholder="Search by Date (e.g., MM/DD/YYYY)"
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ maxWidth: "300px" }}
                />
              </div>
              {filteredPurchases.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th className="col-1">#</th>
                      <th>Purchase Date</th>
                      <th className="d-none d-md-table-cell">Products</th>
                      <th>Total Price</th>
                    </tr>
                  </thead>
                  <tbody className="text-start">
                    {filteredPurchases.map((purchase, index) => (
                      <tr key={purchase.id} style={{ paddingBottom: "1rem" }}>
                        <td style={{ padding: "1rem 0" }}>{index + 1}</td>
                        <td style={{ padding: "1rem 0" }}>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </td>
                        <td
                          className="d-none d-md-table-cell"
                          style={{ padding: "1rem 0" }}
                        >
                          <div>
                            {purchase.purchaseProducts.map((pp) => (
                              <p key={pp.product.id} className="m-0">
                                {pp.product.name} ({pp.product.pack}), Qty:{" "}
                                {pp.quantity}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "1rem 0" }}>
                          ${purchase.totalPrice.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No purchases found.</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
