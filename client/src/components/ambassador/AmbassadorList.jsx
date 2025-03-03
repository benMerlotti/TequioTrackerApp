import { useContext, useEffect, useState } from "react";
import {
  deleteEmployee,
  getEmployeesWithRoles,
  getPendingActivations,
  toggleAmbassadorStatus,
} from "../../managers/abassadorManager";
import { Link, useNavigate } from "react-router-dom";
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
import { UserContext } from "../../App";

export const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const { setPendingUsers } = useContext(UserContext);

  const navigate = useNavigate();

  // Fetch and initialize data with sorting
  useEffect(() => {
    getEmployeesWithRoles().then((data) => {
      // Exclude users with the "Admin" role
      const nonAdminEmployees = data.filter(
        (employee) => !employee.roles.includes("Admin")
      );

      // Sort by active status
      const sortedData = nonAdminEmployees.sort(
        (a, b) => b.isActive - a.isActive
      );

      setEmployees(sortedData);
      setFilteredEmployees(sortedData);
    });
  }, []);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    applyFilters(employees, term, showActiveOnly);
  };

  const handleToggleFilter = () => {
    const newShowActiveOnly = !showActiveOnly;
    setShowActiveOnly(newShowActiveOnly);
    applyFilters(employees, searchTerm, newShowActiveOnly);
  };

  const applyFilters = (
    employeeList,
    term = searchTerm,
    activeOnly = showActiveOnly
  ) => {
    let filtered = employeeList;

    // Filter by search term
    if (term) {
      filtered = filtered.filter((employee) =>
        `${employee.firstName} ${employee.lastName}`
          .toLowerCase()
          .includes(term.toLowerCase())
      );
    }

    // Filter by active status
    if (activeOnly) {
      filtered = filtered.filter((employee) => employee.isActive);
    }

    // Sort by active status
    filtered.sort((a, b) => b.isActive - a.isActive);

    setFilteredEmployees(filtered);
  };

  const handleRowClick = (id) => {
    navigate(`/employees/${id}`);
  };

  const handleDelete = (id, event) => {
    event.stopPropagation(); // Prevent row click event
    deleteEmployee(id).then(() => {
      getEmployeesWithRoles().then((data) => {
        const sortedData = data.sort((a, b) => b.isActive - a.isActive);
        setEmployees(sortedData);
        applyFilters(sortedData);
      });
    });
  };

  const handleToggleActivation = (id, event) => {
    event.stopPropagation(); // Prevent row click event
    toggleAmbassadorStatus(id).then(() => {
      getPendingActivations().then(setPendingUsers);

      // Refresh the employee list
      getEmployeesWithRoles().then((data) => {
        const sortedData = data.sort((a, b) => b.isActive - a.isActive);
        setEmployees(sortedData);
        applyFilters(sortedData);
      });
    });
  };

  const toggleDropdown = (id, event) => {
    event.stopPropagation(); // Prevent row click event
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  return (
    <Container className="mt-5">
      <Card className="p-1">
        <CardBody className="mx-0">
          <Row className="mb-4 d-flex align-items-center">
            <Col xs="auto">
              <h2 className="fw-bold display-4">Ambassadors</h2>
            </Col>
            <Col xs="auto">
              <div className="d-flex align-items-center mb-0">
                <div className="search-container d-flex align-items-center">
                  <i className="bi bi-search search-icon"></i>
                  <Input
                    type="text"
                    placeholder="Search Ambassadors"
                    value={searchTerm}
                    onChange={handleSearch}
                    className="search-input"
                  />
                </div>
              </div>
            </Col>
            <Col xs="auto">
              <Button
                color={showActiveOnly ? "secondary" : "success"}
                onClick={handleToggleFilter}
              >
                {showActiveOnly ? "Show All" : "Show Active"}
              </Button>
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
                  <th>Name</th>
                  <th className="d-none d-lg-table-cell col-3">Address</th>
                  <th className="d-none d-lg-table-cell col-3">Email</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((e) => (
                  <tr
                    key={e.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRowClick(e.id)}
                  >
                    <td>{`${e.firstName} ${e.lastName}`}</td>
                    <td className="d-none d-lg-table-cell">{e.address}</td>
                    <td className="d-none d-lg-table-cell">{e.email}</td>
                    <td className="text-center">
                      {e.isActive ? (
                        <i className="bi bi-check-circle-fill text-success"></i> // Active icon
                      ) : (
                        <i className="bi bi-x-circle-fill text-danger"></i> // Inactive icon
                      )}
                    </td>
                    <td className="text-center">
                      <Dropdown
                        isOpen={dropdownOpen === e.id}
                        toggle={(event) => toggleDropdown(e.id, event)}
                      >
                        <DropdownToggle
                          tag="button"
                          className="btn btn-light btn-sm p-0 border-0"
                        >
                          <i className="bi bi-three-dots"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem
                            onClick={(event) =>
                              handleToggleActivation(e.id, event)
                            }
                            className={
                              e.isActive ? "text-warning" : "text-success"
                            }
                          >
                            {e.isActive ? "Deactivate" : "Activate"}
                          </DropdownItem>
                          <DropdownItem
                            className="text-white"
                            tag={Link}
                            to={`${e.id}`}
                            onClick={(event) => event.stopPropagation()}
                          >
                            Details
                          </DropdownItem>
                          <DropdownItem
                            onClick={(event) => handleDelete(e.id, event)}
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
