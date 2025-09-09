import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Employees() {
  const { serverUrl } = useContext(AuthContext);

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formEmployee, setFormEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    jobTitle: "",
    department: "",
    supervisor: "",
    country: "",
    state: "",
    city: ""
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5; 

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverUrl}/api/employee/get`);
      let filtered = res.data.employees || res.data;

      if (search.trim()) {
        filtered = filtered.filter(emp =>
          emp.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setTotalPages(Math.ceil(filtered.length / limit));
      const start = (currentPage - 1) * limit;
      setEmployees(filtered.slice(start, start + limit));
    } catch (err) {
      console.error("Error fetching employees:", err);
      toast.error("Failed to fetch employees");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/department/get`);
      setDepartments(res.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      toast.error("Failed to fetch departments");
    }
  };

  const fetchCountries = async () => {
    try {
      const res = await axios.get("https://countriesnow.space/api/v0.1/countries");
      setCountries(res.data.data.map(c => c.country).sort());
    } catch (err) {
      console.error("Error fetching countries:", err);
      toast.error("Failed to fetch countries");
    }
  };

  const fetchStates = async (country) => {
    if (!country) return;
    setStates([]); setCities([]);
    try {
      const res = await axios.post("https://countriesnow.space/api/v0.1/countries/states", { country });
      setStates(res.data.data?.states?.map(s => s.name) || []);
    } catch (err) {
      toast.error("Failed to fetch states");
    }
  };

  const fetchCities = async (country, state) => {
    if (!country || !state) return;
    setCities([]);
    try {
      const res = await axios.post("https://countriesnow.space/api/v0.1/countries/state/cities", { country, state });
      setCities(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch cities");
    }
  };


  useEffect(() => {
    Promise.all([fetchEmployees(), fetchDepartments(), fetchCountries()]);
  }, [serverUrl, search, currentPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formEmployee };
      payload.department = payload.department || undefined;
      payload.supervisor = payload.supervisor || undefined;

      if (editingId) {
        const res = await axios.put(`${serverUrl}/api/employee/update/${editingId}`, payload);
        toast.success("Employee updated successfully");
      } else {
        await axios.post(`${serverUrl}/api/employee/create`, payload);
        toast.success("Employee added successfully");
      }

      setFormEmployee({ name: "", email: "", phone: "", jobTitle: "", department: "", supervisor: "", country: "", state: "", city: "" });
      setStates([]); setCities([]); setEditingId(null); setShowForm(false);
      setCurrentPage(1); 
      fetchEmployees();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/employee/delete/${id}`);
      toast.success("Employee deleted");
      fetchEmployees();
    } catch (err) {
      toast.error("Failed to delete employee");
    }
  };

  const handleEditClick = (emp) => {
    setEditingId(emp._id);
    setFormEmployee({
      name: emp.name || "",
      email: emp.email || "",
      phone: emp.phone || "",
      jobTitle: emp.jobTitle || "",
      department: emp.department?._id || "",
      supervisor: emp.supervisor?._id || "",
      country: emp.country || "",
      state: emp.state || "",
      city: emp.city || ""
    });
    if (emp.country) fetchStates(emp.country);
    if (emp.country && emp.state) fetchCities(emp.country, emp.state);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={2000} />

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-2 md:space-y-0">
        <h1 className="text-2xl font-bold">Employees</h1>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="border p-2 rounded w-full md:w-64"
          />
          <button
            onClick={() => { setEditingId(null); setFormEmployee({ name: "", email: "", phone: "", jobTitle: "", department: "", supervisor: "", country: "", state: "", city: "" }); setStates([]); setCities([]); setShowForm(true); }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
          >
            Add Employee
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingId ? "Edit Employee" : "Add Employee"}</h2>
            <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
              <input type="text" placeholder="Name" value={formEmployee.name} onChange={e => setFormEmployee({ ...formEmployee, name: e.target.value })} required className="border p-2 rounded"/>
              <input type="email" placeholder="Email" value={formEmployee.email} onChange={e => setFormEmployee({ ...formEmployee, email: e.target.value })} required className="border p-2 rounded"/>
              <input type="text" placeholder="Phone" value={formEmployee.phone} onChange={e => setFormEmployee({ ...formEmployee, phone: e.target.value })} className="border p-2 rounded"/>
              <input type="text" placeholder="Job Title" value={formEmployee.jobTitle} onChange={e => setFormEmployee({ ...formEmployee, jobTitle: e.target.value })} className="border p-2 rounded"/>
              <select value={formEmployee.department} onChange={e => setFormEmployee({ ...formEmployee, department: e.target.value })} required className="border p-2 rounded">
                <option value="">Select Department</option>
                {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
              </select>
              <select value={formEmployee.supervisor} onChange={e => setFormEmployee({ ...formEmployee, supervisor: e.target.value })} className="border p-2 rounded">
                <option value="">Select Supervisor</option>
                {employees.map(emp => <option key={emp._id} value={emp._id}>{emp.name}</option>)}
              </select>
              <select value={formEmployee.country} onChange={e => { setFormEmployee({ ...formEmployee, country: e.target.value, state: "", city: "" }); fetchStates(e.target.value); }} className="border p-2 rounded">
                <option value="">Select Country</option>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={formEmployee.state} onChange={e => { setFormEmployee({ ...formEmployee, state: e.target.value, city: "" }); fetchCities(formEmployee.country, e.target.value); }} className="border p-2 rounded">
                <option value="">Select State</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <select value={formEmployee.city} onChange={e => setFormEmployee({ ...formEmployee, city: e.target.value })} className="border p-2 rounded">
                <option value="">Select City</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <div className="flex justify-end space-x-2 mt-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">{editingId ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {!showForm && ( 
        <div>
          {loading ? <p>Loading...</p> :
            <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-b px-4 py-2 text-left">Name</th>
                    <th className="border-b px-4 py-2 text-left">Email</th>
                    <th className="border-b px-4 py-2 text-left">Job Title</th>
                    <th className="border-b px-4 py-2 text-left">Department</th>
                    <th className="border-b px-4 py-2 text-left">Supervisor</th>
                    <th className="border-b px-4 py-2 text-left">Country</th>
                    <th className="border-b px-4 py-2 text-left">State</th>
                    <th className="border-b px-4 py-2 text-left">City</th>
                    <th className="border-b px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => (
                    <tr key={emp._id} className="hover:bg-gray-100">
                      <td className="border-b px-4 py-2">{emp.name}</td>
                      <td className="border-b px-4 py-2">{emp.email}</td>
                      <td className="border-b px-4 py-2">{emp.jobTitle}</td>
                      <td className="border-b px-4 py-2">{emp.department?.name || "-"}</td>
                      <td className="border-b px-4 py-2">{emp.supervisor?.name || "-"}</td>
                      <td className="border-b px-4 py-2">{emp.country || "-"}</td>
                      <td className="border-b px-4 py-2">{emp.state || "-"}</td>
                      <td className="border-b px-4 py-2">{emp.city || "-"}</td>
                      <td className="border-b px-4 py-2 flex space-x-2">
                        <FiEdit className="cursor-pointer text-blue-600" onClick={() => handleEditClick(emp)} />
                        <FiTrash2 className="cursor-pointer text-red-600" onClick={() => handleDelete(emp._id)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Prev
                </button>
                <span className="px-3 py-1">Page {currentPage} of {totalPages}</span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          }
        </div>
      )}
    </div>
  );
}

export default Employees;
