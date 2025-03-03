import React, { useEffect, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Legend,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { getAgeGroups, getGenders } from "../../managers/demoManager";

ChartJS.register(
  ArcElement,
  Legend,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement
);

export const CustomerDemographics = () => {
  const [genders, setGenders] = useState([]);
  const [maleCustomers, setMaleCustomers] = useState(0);
  const [femaleCustomers, setFemaleCustomers] = useState(0);
  const [nonBinaryCustomers, setNonBinaryCustomers] = useState(0);

  const [ageGroups, setAgeGroups] = useState([]);
  const [maleCounts, setMaleCounts] = useState([]);
  const [femaleCounts, setFemaleCounts] = useState([]);
  const [nonBinaryCounts, setNonBinaryCounts] = useState([]);

  useEffect(() => {
    // Fetch gender data
    getGenders().then((data) => {
      if (data && data.length > 0) {
        setGenders(data.map((item) => item.genderValue));
        const maleCount =
          data.find((item) => item.genderValue === "Male")?.customers.length ||
          0;
        const femaleCount =
          data.find((item) => item.genderValue === "Female")?.customers
            .length || 0;
        const nonBinaryCount =
          data.find((item) => item.genderValue === "Non-binary")?.customers
            .length || 0;

        setMaleCustomers(maleCount);
        setFemaleCustomers(femaleCount);
        setNonBinaryCustomers(nonBinaryCount);
      }
    });

    // Fetch age group data
    getAgeGroups().then((data) => {
      if (data && data.length > 0) {
        setAgeGroups(data.map((group) => group.group));

        // Count customers by gender for each age group
        const maleData = data.map(
          (group) =>
            group.customers.filter((cust) => cust.genderId === 1).length
        );
        const femaleData = data.map(
          (group) =>
            group.customers.filter((cust) => cust.genderId === 2).length
        );
        const nonBinaryData = data.map(
          (group) =>
            group.customers.filter((cust) => cust.genderId === 3).length
        );

        setMaleCounts(maleData);
        setFemaleCounts(femaleData);
        setNonBinaryCounts(nonBinaryData);
      }
    });
  }, []);

  // Data for Doughnut Chart
  const genderData = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        label: "Customer Demographics",
        data: [maleCustomers, femaleCustomers, nonBinaryCustomers],
        backgroundColor: ["#1724b3", "#b31762", "white"],
        borderColor: ["#000", "#000", "#000"],
        borderWidth: 1,
      },
    ],
  };

  const genderOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
        labels: {
          boxWidth: 20, // Adjust the width of the colored box
          boxHeight: 20, // Optional: Adjust the height of the box (Chart.js 3.7+)
          color: "white", // Optional: Text color
          font: {
            size: 14, // Optional: Font size
          },
        },
      },
    },
    cutout: "75%",
  };

  // Data for Stacked Bar Chart
  const ageData = {
    labels: ageGroups, // Dynamically populated
    datasets: [
      {
        label: "Male",
        data: maleCounts, // Male counts per age group
        backgroundColor: "#1724b3",
        barThickness: 35,
      },
      {
        label: "Female",
        data: femaleCounts, // Female counts per age group
        backgroundColor: "#b31762",
        barThickness: 35,
      },
      {
        label: "Non-binary",
        data: nonBinaryCounts, // Non-binary counts per age group
        backgroundColor: "white",
        barThickness: 35,
      },
    ],
  };

  const ageOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Show legend
        position: "bottom",
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Age Groups",
          color: "white",
        },
        ticks: {
          color: "white",
        },
        stacked: true, // Enable stacking
      },
      y: {
        title: {
          display: true,
          text: "Number of Customers",
          color: "white",
        },
        ticks: {
          color: "white",
        },
        beginAtZero: true,
        stacked: true, // Enable stacking
      },
    },
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1 className="text-start">Customer Demographics</h1>
      <hr
        style={{
          borderTop: "1px solid #ccc",
          marginTop: "1rem",
          marginBottom: "3rem",
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        {/* Doughnut Chart */}
        <div
          style={{
            width: "30%",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <h3>Customer's Gender</h3>
          <Doughnut data={genderData} options={genderOptions} />
        </div>

        {/* Stacked Bar Chart */}
        <div style={{ width: "45%" }}>
          <h3 className="mb-5">Customer's Age</h3>
          <Bar data={ageData} options={ageOptions} />
        </div>
      </div>
    </div>
  );
};
