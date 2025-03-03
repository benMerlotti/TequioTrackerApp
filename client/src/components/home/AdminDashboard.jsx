import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { getEmployeesWithRoles } from "../../managers/abassadorManager";
import { getCustomers } from "../../managers/customerManager";
import { getPurchases } from "../../managers/purchaseManager";
import { getTopLocations } from "../../managers/locationManager";

export const AdminDashboard = ({ loggedInUser }) => {
  const [metrics, setMetrics] = useState({
    totalAmbassadors: 0,
    activeAmbassadors: 0,
    totalCustomers: 0,
    recentPurchases: [],
    totalRevenue: 0,
    topLocations: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      const [employees, customers, purchases, locations] = await Promise.all([
        getEmployeesWithRoles(),
        getCustomers(),
        getPurchases(),
        getTopLocations(),
      ]);

      const totalAmbassadors = employees.length;
      const activeAmbassadors = employees.filter((emp) => emp.isActive).length;
      const totalCustomers = customers.length;

      // Calculate total revenue, round down, and format with commas
      const totalRevenue = Math.floor(
        purchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0)
      ).toLocaleString();

      // Sort purchases by date and limit to 5
      const recentPurchases = purchases
        .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
        .slice(0, 5);

      const topLocations = locations.map((loc) => ({
        location: loc.location.locationValue,
        count: loc.count,
      }));

      setMetrics({
        totalAmbassadors,
        activeAmbassadors,
        totalCustomers,
        recentPurchases,
        totalRevenue, // Set formatted total revenue
        topLocations,
      });
    };

    fetchData();
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="fw-bold display-4 mb-4 text-start">
        Welcome, {loggedInUser?.firstName}
      </h2>

      {/* Metrics Overview */}
      <Row className="mb-4">
        <Col md="4">
          <Card
            style={{ borderColor: "white" }}
            className="text-center rounded"
          >
            {" "}
            {/* Apply the 'rounded' class */}
            <CardBody>
              <h5>Active Ambassadors</h5>
              <p className="display-5">{metrics.activeAmbassadors}</p>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card
            style={{ borderColor: "white" }}
            className="text-center rounded"
          >
            {" "}
            {/* Apply the 'rounded' class */}
            <CardBody>
              <h5>Total Customers</h5>
              <p className="display-5">{metrics.totalCustomers}</p>
            </CardBody>
          </Card>
        </Col>
        <Col md="4">
          <Card
            style={{ borderColor: "white" }}
            className="text-center rounded"
          >
            {" "}
            {/* Apply the 'rounded' class */}
            <CardBody>
              <h5>Total Revenue</h5>
              <p className="display-5">${metrics.totalRevenue}</p>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Top Locations */}
      <Row>
        <Col md="4">
          <Card style={{ borderColor: "white" }}>
            <CardBody className="p-0">
              <h5>Top Locations</h5>
              <ListGroup>
                {metrics.topLocations.length > 0 ? (
                  metrics.topLocations.map((loc, index) => (
                    <ListGroupItem
                      key={index}
                      className="d-flex justify-content-between"
                    >
                      <span>
                        {index + 1}. {loc.location}
                      </span>
                      <span>{loc.count} sales</span>
                    </ListGroupItem>
                  ))
                ) : (
                  <p>No location data available.</p>
                )}
              </ListGroup>
            </CardBody>
          </Card>
        </Col>

        {/* Recent Purchases */}
        <Col md="8">
          <Card style={{ borderColor: "white" }}>
            <CardBody>
              <h5>Recent Purchases</h5>
              {metrics.recentPurchases.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Customer</th>
                      <th>Ambassador</th>
                      <th>Purchase Date</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.recentPurchases.map((purchase, index) => (
                      <tr key={purchase.id}>
                        <td>{index + 1}</td>
                        <td>{purchase.customer?.name || "Unknown"}</td>
                        <td>
                          {purchase.userProfile?.firstName}{" "}
                          {purchase.userProfile?.lastName}
                        </td>
                        <td>
                          {new Date(purchase.purchaseDate).toLocaleDateString()}
                        </td>
                        <td>${purchase.totalPrice.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No recent purchases available.</p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
