import Employee from "../model/employeeModel.js";
import Department from "../model/departmentModel.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const totalDepartments = await Department.countDocuments();

    const employeesByDepartment = await Employee.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    res.json({
      totalEmployees,
      totalDepartments,
      employeesByDepartment,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
