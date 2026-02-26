// Import models
const Department = require("../model/Department");

/**
 * GET ALL DEPARTMENTS - Lấy danh sách tất cả khoa
 * - Public endpoint (không cần authentication)
 * - Có thể filter theo status
 */
exports.getAllDepartments = async (req, res) => {
  try {
    // Lấy danh sách tất cả khoa có status = "active"
    const departments = await Department.find({ status: "active" }).sort({
      createdAt: -1,
    });

    res.json({
      message: "Departments retrieved successfully",
      departments,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * GET DEPARTMENT BY ID - Lấy thông tin chi tiết khoa
 * - Public endpoint (không cần authentication)
 */
exports.getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm khoa theo ID
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({
      message: "Department retrieved successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * CREATE DEPARTMENT - Tạo khoa mới (Admin only)
 * - Cần admin token
 * - Tạo khoa với code duy nhất
 */
exports.createDepartment = async (req, res) => {
  try {
    const { code, name, description } = req.body;

    // Kiểm tra code đã tồn tại không
    const existingDept = await Department.findOne({ code: code.toUpperCase() });
    if (existingDept) {
      return res
        .status(400)
        .json({ message: "Department code already exists" });
    }

    // Tạo khoa mới
    const department = new Department({
      code: code.toUpperCase(),
      name,
      description,
      status: "active",
    });

    await department.save();

    res.status(201).json({
      message: "Department created successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * UPDATE DEPARTMENT - Cập nhật thông tin khoa (Admin only)
 * - Cần admin token
 */
exports.updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, description, status } = req.body;

    // Tìm khoa theo ID
    const department = await Department.findById(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    // Cập nhật thông tin
    if (code) department.code = code.toUpperCase();
    if (name) department.name = name;
    if (description) department.description = description;
    if (status) department.status = status;

    await department.save();

    res.json({
      message: "Department updated successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * DELETE DEPARTMENT - Xóa khoa (Admin only)
 * - Cần admin token
 * - Xóa vĩnh viễn
 */
exports.deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm và xóa khoa
    const department = await Department.findByIdAndDelete(id);
    if (!department) {
      return res.status(404).json({ message: "Department not found" });
    }

    res.json({
      message: "Department deleted successfully",
      department,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
