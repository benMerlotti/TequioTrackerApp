/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Card,
  CardBody,
  Container,
  FormGroup,
  InputGroup,
  InputGroupText,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { deletePurchase, getPurchases } from "../../managers/purchaseManager";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const MyPurchaseList = ({ loggedInUser }) => {
  const [purchases, setPurchases] = useState([]);
  const [filteredByDate, setFilteredByDate] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    getPurchases().then((data) => {
      const userPurchases = data
        .filter((purchase) => purchase.userProfileId === loggedInUser.id)
        .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
      setPurchases(userPurchases);
      setFilteredByDate(userPurchases);
    });
  }, [loggedInUser.id]);

  const handleRowClick = (id) => {
    navigate(`/purchases/${id}`);
  };

  const handleDelete = (id, event) => {
    event.stopPropagation(); // Prevent row click event
    deletePurchase(id).then(() => {
      getPurchases().then((data) => {
        const userPurchases = data.filter(
          (purchase) => purchase.userProfileId === loggedInUser.id
        );
        setPurchases(userPurchases);
        setFilteredByDate(userPurchases);
      });
    });
  };

  const handleDateFilter = () => {
    if (startDate && endDate) {
      const filtered = purchases.filter((purchase) => {
        const purchaseDate = new Date(purchase.purchaseDate);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return purchaseDate >= start && purchaseDate <= end;
      });
      setFilteredByDate(filtered);
    } else {
      setFilteredByDate(purchases);
    }
  };

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    setFilteredByDate(purchases);
  };

  const toggleDropdown = (id, event) => {
    event.stopPropagation(); // Prevent row click event
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <Container className="mt-5">
      <Card className="p-1">
        <CardBody className="mx-0">
          <Row className="mb-4">
            <Col>
              <h2 className="fw-bold">Your Sales</h2>
              <p>
                View your purchase records. You can add new purchases or check
                details for each transaction.
              </p>
            </Col>
            <Col className="text-end">
              <Link to="/new-purchase">
                <button className="btn btn-primary px-4">+ New Purchase</button>
              </Link>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col md="4">
              <FormGroup>
                <InputGroup>
                  <InputGroupText>Start</InputGroupText>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    placeholderText="Start Date"
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md="4">
              <FormGroup>
                <InputGroup>
                  <InputGroupText>End</InputGroupText>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    placeholderText="End Date"
                    dateFormat="yyyy-MM-dd"
                    className="form-control"
                  />
                </InputGroup>
              </FormGroup>
            </Col>
            <Col md="4">
              <button
                className="btn btn-primary me-3"
                onClick={handleDateFilter}
              >
                Filter
              </button>
              <button className="btn btn-secondary" onClick={handleClearFilter}>
                Clear Filter
              </button>
            </Col>
          </Row>
          <div
            style={{
              maxHeight: "400px",
              overflowY: "auto",
              minHeight: "400px",
            }}
          >
            <table style={{ tableLayout: "fixed", width: "100%" }}>
              <thead>
                <tr>
                  <th className="col-2 col-md-1">Id</th>
                  <th className="d-none d-md-table-cell">Buyer</th>
                  <th className="d-none d-md-table-cell">Price</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredByDate.map((p) => (
                  <tr
                    key={p.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(p.id)}
                  >
                    <td className="col-2 col-md-1">{p.id}</td>
                    <td className="d-none d-md-table-cell">
                      <Link
                        to={`/customers/${p.customer?.id}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        {p.customer?.name}
                      </Link>
                    </td>
                    <td className="d-none d-md-table-cell">
                      ${p.totalPrice.toFixed(2)}
                    </td>
                    <td>{new Date(p.purchaseDate).toLocaleDateString()}</td>
                    <td className="text-end">
                      <Dropdown
                        isOpen={dropdownOpen === p.id}
                        toggle={(event) => toggleDropdown(p.id, event)}
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
                            to={`/purchases/${p.id}`}
                            onClick={(event) => event.stopPropagation()}
                          >
                            Details
                          </DropdownItem>
                          <DropdownItem
                            onClick={(event) => handleDelete(p.id, event)}
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
