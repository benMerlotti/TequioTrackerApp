import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";
import { getPurchases } from "../../managers/purchaseManager";

export const AmbassadorDashboard = ({ loggedInUser }) => {
  const [purchases, setPurchases] = useState([]);
  const [metrics, setMetrics] = useState({
    recentPurchases: [],
    totalSales: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    getPurchases().then((data) => {
      setPurchases(data);

      const totalSales = data.filter(
        (d) => d.userProfileId === loggedInUser.id
      ).length;
      const totalRevenue = data
        .filter((d) => d.userProfileId === loggedInUser.id)
        .reduce((sum, purchase) => sum + purchase.totalPrice, 0);

      const recentPurchases = data
        .filter((d) => d.userProfileId === loggedInUser.id)
        .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate))
        .slice(0, 5);

      setMetrics({
        recentPurchases,
        totalSales,
        totalRevenue,
      });
    });
  }, []);

  return (
    <Container className="mt-5">
      <h2 className="fw-bold display-4 mb-4 text-start">
        Welcome, {loggedInUser?.firstName}
      </h2>

      {/* Metrics Overview */}
      <Row className="mb-4">
        <Col md="6">
          <Card
            style={{ borderColor: "white" }}
            className="text-center rounded"
          >
            {" "}
            {/* Apply the 'rounded' class */}
            <CardBody>
              <h5>Total Sales</h5>
              <p className="display-5">{metrics.totalSales}</p>
            </CardBody>
          </Card>
        </Col>
        <Col md="6">
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

      <Row>
        {/* Recent Purchases */}
        <Col md="12">
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
