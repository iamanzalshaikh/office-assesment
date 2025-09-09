import Employee from "../model/employeeModel.js";

//  Create Employee
export const createEmployee = async (req, res) => {
  try {
    const emp = new Employee(req.body);
    await emp.save();

    // Populate before sending
    const populatedEmp = await Employee.findById(emp._id)
      .populate("department", "name")
      .populate("supervisor", "name");

    res.status(201).json(populatedEmp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// employees with Pagination, Search, Filter
export const getEmployees = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, department, jobTitle } = req.query;
    const query = {};

    if (search) query.name = { $regex: search, $options: "i" };
    if (department) query.department = department;
    if (jobTitle) query.jobTitle = jobTitle;

    const employees = await Employee.find(query)
      .populate("department", "name")
      .populate("supervisor", "name")
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Employee.countDocuments(query);

    res.json({
      employees,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Update Employee
export const updateEmployee = async (req, res) => {
  try {
    const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!emp) return res.status(404).json({ message: "Employee not found" });

    // Populate before sending
    const populatedEmp = await Employee.findById(emp._id)
      .populate("department", "name")
      .populate("supervisor", "name");

    res.json(populatedEmp);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

  //  Delete Employee
export const deleteEmployee = async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: "Employee deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};



