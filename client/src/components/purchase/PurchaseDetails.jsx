/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Spinner,
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import {
  getPurchaseById,
  deletePurchase,
} from "../../managers/purchaseManager";

export const PurchaseDetails = ({ loggedInUser }) => {
  const [purchase, setPurchase] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getPurchaseById(id).then((data) => {
      setPurchase(data);
    });
  }, [id]);

  const handleDelete = () => {
    deletePurchase(id).then(() => {
      navigate("/purchases");
    });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!purchase) {
    return (
      <div className="text-center mt-5">
        <Spinner color="primary" />
        <p>Loading purchase details...</p>
      </div>
    );
  }

  return (
    <Container className="p-3">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
        <div className="text-start w-100">
          <p className="m-0">Purchase Details</p>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <h1 className="purchase-name fw-bold display-4">{purchase.id}</h1>
          </div>
          <div className="d-flex flex-wrap gap-3">
            <p>Customer:</p>
            <p className="total-sales m-0">{purchase.customer.name}</p>
            <p>Ambassador:</p>
            <p className="total-sales m-0">
              {purchase.userProfile.firstName} {purchase.userProfile.lastName}
            </p>
          </div>
        </div>

        {/* Dropdown for Edit/Delete */}
        {(loggedInUser.id == purchase.userProfileId ||
          loggedInUser?.roles?.includes("Admin")) && (
          <div className="mt-3 mt-md-0">
            <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
              <DropdownToggle
                tag="button"
                className="btn btn-light btn-sm p-0 border-0"
              >
                <i className="bi bi-three-dots"></i>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem tag={Link} to={"edit"} className="text-warning">
                  Edit
                </DropdownItem>
                <DropdownItem onClick={handleDelete} className="text-danger">
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        )}
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
                <h3 className="fw-bold text-start">Purchase</h3>
              </div>
              <div
                style={{
                  maxHeight: "400px",
                  overflowY: "auto",
                  minHeight: "400px",
                }}
              >
                {purchase.purchaseProducts?.length > 0 ? (
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
                      <tr key={purchase.id} style={{ paddingBottom: "1rem" }}>
                        <td style={{ padding: "1rem 0" }}>{purchase.id}</td>
                        <td style={{ padding: "1rem 0" }}>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </td>
                        <td
                          className="d-none d-md-table-cell"
                          style={{ padding: "1rem 0" }}
                        >
                          <div>
                            {purchase.purchaseProducts.map((pp) => (
                              <p key={pp.id} className="m-0">
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
                    </tbody>
                  </table>
                ) : (
                  <p>No products found.</p>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
