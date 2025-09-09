import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext.jsx";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Departments() {
  const { serverUrl } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [formDept, setFormDept] = useState({ name: "", description: "" });
  const [editingDeptId, setEditingDeptId] = useState(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  // Fetch departments
  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${serverUrl}/api/department/get`);
      let filtered = res.data;

      if (search.trim()) {
        filtered = filtered.filter((d) =>
          d.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setTotalPages(Math.ceil(filtered.length / limit));
      setDepartments(filtered.slice((page - 1) * limit, page * limit));
    } catch (err) {
      toast.error("Failed to fetch departments!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [serverUrl, search, page]);

  // Add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDeptId) {
        const res = await axios.put(
          `${serverUrl}/api/department/update/${editingDeptId}`,
          formDept
        );
        toast.success("Department updated!");
      } else {
        const res = await axios.post(
          `${serverUrl}/api/department/create`,
          formDept
        );
        toast.success("Department created!");
      }
      setFormDept({ name: "", description: "" });
      setEditingDeptId(null);
      setShowForm(false);
      fetchDepartments();
    } catch (err) {
      toast.error("Operation failed!");
      console.error(err);
    }
  };

  // Delete department
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/department/delete/${id}`);
      toast.success("Department deleted!");
      fetchDepartments();
    } catch (err) {
      toast.error("Failed to delete!");
      console.error(err);
    }
  };

  const handleEditClick = (dept) => {
    setEditingDeptId(dept._id);
    setFormDept({ name: dept.name, description: dept.description });
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <ToastContainer position="top-right" autoClose={2000} />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-2 md:space-y-0">
        <h1 className="text-2xl md:text-3xl font-bold">Departments</h1>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border p-2 rounded w-full md:w-64"
          />
          <button
            onClick={() => {
              setEditingDeptId(null);
              setFormDept({ name: "", description: "" });
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full md:w-auto"
          >
            Add Department
          </button>
        </div>
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingDeptId ? "Edit Department" : "Add Department"}
            </h2>
            <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Department Name"
                value={formDept.name}
                onChange={(e) =>
                  setFormDept({ ...formDept, name: e.target.value })
                }
                required
                className="border p-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={formDept.description}
                onChange={(e) =>
                  setFormDept({ ...formDept, description: e.target.value })
                }
                className="border p-2 rounded w-full"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                >
                  {editingDeptId ? "Update" : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2 text-left">Name</th>
                <th className="border-b px-4 py-2 text-left">Description</th>
                <th className="border-b px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept._id} className="hover:bg-gray-100">
                  <td className="border-b px-4 py-2">{dept.name}</td>
                  <td className="border-b px-4 py-2">{dept.description || "-"}</td>
                  <td className="border-b px-4 py-2 flex space-x-2">
                    <FiEdit
                      className="cursor-pointer text-blue-600"
                      onClick={() => handleEditClick(dept)}
                    />
                    <FiTrash2
                      className="cursor-pointer text-red-600"
                      onClick={() => handleDelete(dept._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Prev
            </button>
            <span className="px-3 py-1">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Departments;
