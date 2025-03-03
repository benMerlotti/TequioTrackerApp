import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { CustomerList } from "./CustomerList"; // Assuming this is imported correctly
import { CustomerDemographics } from "./CustomerDemographics";

export const CustomerMain = () => {
  const [selectedTab, setSelectedTab] = useState("");

  useEffect(() => {
    setSelectedTab("All Customers");
  }, []);

  const getTabClass = (tab) => {
    return selectedTab === tab
      ? "customer-options active-tab"
      : "customer-options";
  };

  return (
    <Container>
      <div className="text-start d-flex gap-3 ms-4">
        <p
          onClick={() => setSelectedTab("All Customers")}
          className={getTabClass("All Customers")}
        >
          All Customers
        </p>
        <p
          onClick={() => setSelectedTab("Demographics")}
          className={getTabClass("Demographics")}
        >
          Demographics
        </p>
        <p
          onClick={() => setSelectedTab("Locations")}
          className={getTabClass("Locations")}
        >
          Locations
        </p>
      </div>
      {selectedTab === "All Customers" && (
        <CustomerList selectedTab={selectedTab} />
      )}
      {selectedTab === "Demographics" && (
        <CustomerDemographics selectedTab={selectedTab} />
      )}
    </Container>
  );
};
