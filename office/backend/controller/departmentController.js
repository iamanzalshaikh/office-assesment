import Department from "../model/departmentModel.js";

// Create Department
export const createDepartment = async (req, res) => {
  try {
    const dept = new Department(req.body);
    await dept.save();
    res.status(201).json(dept);
  } catch (err) {
    return res.status(400).json({ message: `Failed to create department: ${err.message}` });
  }
};

// Get All Departments
export const getDepartments = async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (err) {
    return res.status(500).json({ message: `Failed to fetch departments: ${err.message}` });
  }
};

// Update Department
export const updateDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!dept) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json(dept);
  } catch (err) {
    return res.status(400).json({ message: `Failed to update department: ${err.message}` });
  }
};

// Delete Department
export const deleteDepartment = async (req, res) => {
  try {
    const dept = await Department.findByIdAndDelete(req.params.id);
    if (!dept) {
      return res.status(404).json({ message: "Department not found" });
    }
    res.json({ message: "Department deleted successfully" });
  } catch (err) {
    return res.status(400).json({ message: `Failed to delete department: ${err.message}` });
  }
};
