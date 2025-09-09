import React, { useEffect, useState, useContext } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";

function Dashboard() {
  const { serverUrl } = useContext(AuthContext); // backend URL
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    employeesByDepartment: [],
  });

  // Fetch stats from backend
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/dashboard/stats`, {
          withCredentials: true,
        });
        console.log("Dashboard stats fetched:", response.data);
        setStats(response.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      }
    };
    loadStats();
  }, [serverUrl]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD"];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-700 font-bold text-lg">Total Employees</h2>
            <p className="text-3xl font-extrabold mt-4">{stats.totalEmployees}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-700 font-bold text-lg">Total Departments</h2>
            <p className="text-3xl font-extrabold mt-4">{stats.totalDepartments}</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-700 font-bold text-lg">Employees by Department</h2>
            {stats.employeesByDepartment.length ? (
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={stats.employeesByDepartment.map(d => ({
                      name: d._id || "Unknown",
                      value: d.count,
                    }))}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={50}
                    fill="#8884d8"
                    label
                  >
                    {stats.employeesByDepartment.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">No data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
