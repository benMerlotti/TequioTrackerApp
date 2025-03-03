import { useContext, useEffect, useState } from "react";
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
  getEmployeeById,
  deleteEmployee,
  toggleAmbassadorStatus,
  getPendingActivations,
} from "../../managers/abassadorManager";
import { UserContext } from "../../App";

export const EmployeeDetails = () => {
  const [employee, setEmployee] = useState(null);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setPendingUsers } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getEmployeeById(id).then((data) => {
      setEmployee(data);
      setFilteredPurchases(data.purchases);
    });
  }, [id]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (employee) {
      const filtered = employee.purchases.filter((purchase) =>
        new Date(purchase.purchaseDate).toLocaleDateString().includes(term)
      );
      setFilteredPurchases(filtered);
    }
  };

  const handleDelete = () => {
    deleteEmployee(id).then(() => {
      navigate("/employees");
    });
  };

  const handleEdit = () => {
    navigate("edit");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const totalPrice = () => {
    let total = 0;
    filteredPurchases.forEach((purchase) => {
      total += purchase.totalPrice;
    });
    return total;
  };

  const handleToggleActivation = (id, event) => {
    event.stopPropagation(); // Prevent row click event
    toggleAmbassadorStatus(id).then(() => {
      getPendingActivations().then(setPendingUsers);

      getEmployeeById(id).then((data) => {
        setEmployee(data);
      });
    });
  };

  if (!employee) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
        <p>Loading employee details...</p>
      </div>
    );
  }

  return (
    <Container className="p-3">
      <div className="d-flex justify-content-between align-items-center">
        <div className="text-start">
          <p className="m-0">Ambassador Details</p>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <h1 className="employee-name fw-bold display-1">
              {employee.firstName} {employee.lastName}
            </h1>
            {employee.isActive ? (
              <i className="bi bi-check-circle-fill text-success"></i> // Active icon
            ) : (
              <i className="bi bi-x-circle-fill text-danger"></i> // Inactive icon
            )}
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <p>Sales:</p>
            <p className="total-sales m-0">${Math.floor(totalPrice())}</p>
            <p>Last Sale:</p>
            <p className="last-sale m-0">
              {employee.purchases.length > 0
                ? new Date(
                    Math.max(
                      ...employee.purchases.map((p) => new Date(p.purchaseDate))
                    )
                  ).toLocaleDateString()
                : "No sales yet"}
            </p>
          </div>
        </div>

        {/* Dropdown for three dots */}
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle
            tag="button"
            className="btn btn-light btn-sm p-0 border-0"
          >
            <i className="bi bi-three-dots"></i>
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem
              onClick={(event) => handleToggleActivation(employee.id, event)}
              className={employee.isActive ? "text-warning" : "text-success"}
            >
              {employee.isActive ? "Deactivate" : "Activate"}
            </DropdownItem>
            <DropdownItem onClick={handleEdit} className="text-white">
              Edit
            </DropdownItem>
            <DropdownItem onClick={handleDelete} className="text-danger">
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      <hr style={{ borderTop: "1px solid #ccc", margin: "2rem 0" }} />

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
                  marginBottom: "1rem",
                }}
              >
                <h3 className="fw-bold text-start">Sales</h3>
                <i className="bi bi-search search-icon"></i>
                <Input
                  type="text"
                  placeholder="Search by Date (e.g., MM/DD/YYYY)"
                  value={searchTerm}
                  onChange={handleSearch}
                  style={{ maxWidth: "300px" }}
                />
              </div>
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  minHeight: "400px",
                }}
              >
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
                            {new Date(
                              purchase.purchaseDate
                            ).toLocaleDateString()}
                          </td>
                          <td
                            className="d-none d-md-table-cell"
                            style={{ padding: "1rem 0" }}
                          >
                            <div>
                              {purchase.purchaseProducts.map((pp) => (
                                <p key={pp.product?.id} className="m-0">
                                  {pp.product?.name} ({pp.product?.pack}), Qty:{" "}
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
                  <p>No sales found.</p>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
