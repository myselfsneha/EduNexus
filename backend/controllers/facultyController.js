
const db = require("../config/db");

const allowedStatuses = ["active", "inactive"];

const normalizeOptional = (value) => {
  if (value === undefined || value === null) {
    return null;
  }

  const normalized = String(value).trim();
  return normalized || null;
};

const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const handleDatabaseError = (res, error, operation) => {
  console.error(`${operation} ERROR:`, error);

  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      success: false,
      message:
        "A faculty member with this email, employee code, or user ID already exists.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected database error occurred.",
  });
};

// GET /faculty
// Supports ?search=, ?department=, and ?status=.
exports.getFaculty = async (req, res) => {
  try {
    const { search, department, status } = req.query;
    const conditions = [];
    const params = [];

    if (search && String(search).trim()) {
      const term = `%${String(search).trim()}%`;

      conditions.push(
        "(name LIKE ? OR email LIKE ? OR employee_code LIKE ? " +
          "OR department LIKE ? OR designation LIKE ?)"
      );

      params.push(term, term, term, term, term);
    }

    if (department && String(department).trim()) {
      conditions.push("department = ?");
      params.push(String(department).trim());
    }

    if (status) {
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Status must be active or inactive.",
        });
      }

      conditions.push("status = ?");
      params.push(status);
    }

    const whereClause = conditions.length
      ? `WHERE ${conditions.join(" AND ")}`
      : "";

    const [rows] = await db.query(
      `SELECT id, user_id, employee_code, name, email, phone,
              department, designation, status, created_at, updated_at
       FROM faculty
       ${whereClause}
       ORDER BY name ASC`,
      params
    );

    return res.json({
      success: true,
      count: rows.length,
      data: rows,
    });
  } catch (error) {
    return handleDatabaseError(res, error, "GET FACULTY");
  }
};

// GET /faculty/:id
exports.getFacultyById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid faculty ID is required.",
      });
    }

    const [rows] = await db.query(
      `SELECT id, user_id, employee_code, name, email, phone,
              department, designation, status, created_at, updated_at
       FROM faculty
       WHERE id = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found.",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    return handleDatabaseError(res, error, "GET FACULTY BY ID");
  }
};

// POST /faculty
exports.addFaculty = async (req, res) => {
  try {
    const {
      name,
      email,
      user_id,
      employee_code,
      phone,
      department,
      designation,
      status = "active",
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Name is required and must not exceed 100 characters.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    if (
      normalizedEmail.length > 100 ||
      !isValidEmail(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or inactive.",
      });
    }

    const normalizedCode = normalizeOptional(employee_code);
    const normalizedPhone = normalizeOptional(phone);
    const normalizedDepartment = normalizeOptional(department);
    const normalizedDesignation = normalizeOptional(designation);

    if (normalizedCode && normalizedCode.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Employee code must not exceed 50 characters.",
      });
    }

    if (normalizedPhone && normalizedPhone.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Phone must not exceed 20 characters.",
      });
    }

    if (
      normalizedDepartment &&
      normalizedDepartment.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Department must not exceed 100 characters.",
      });
    }

    if (
      normalizedDesignation &&
      normalizedDesignation.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Designation must not exceed 100 characters.",
      });
    }

    let normalizedUserId = null;

    if (user_id !== undefined && user_id !== null && user_id !== "") {
      normalizedUserId = Number(user_id);

      if (
        !Number.isSafeInteger(normalizedUserId) ||
        normalizedUserId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "User ID must be a positive integer.",
        });
      }
    }

    const [result] = await db.query(
      `INSERT INTO faculty
        (user_id, employee_code, name, email, phone,
         department, designation, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        normalizedUserId,
        normalizedCode,
        name.trim(),
        normalizedEmail,
        normalizedPhone,
        normalizedDepartment,
        normalizedDesignation,
        status,
      ]
    );

    const [rows] = await db.query(
      `SELECT id, user_id, employee_code, name, email, phone,
              department, designation, status, created_at, updated_at
       FROM faculty
       WHERE id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Faculty member added successfully.",
      data: rows[0],
    });
  } catch (error) {
    return handleDatabaseError(res, error, "ADD FACULTY");
  }
};

// PUT /faculty/:id
exports.updateFaculty = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid faculty ID is required.",
      });
    }

    const {
      name,
      email,
      user_id,
      employee_code,
      phone,
      department,
      designation,
      status,
    } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Name is required and must not exceed 100 characters.",
      });
    }

    const normalizedEmail = normalizeEmail(email);

    if (
      normalizedEmail.length > 100 ||
      !isValidEmail(normalizedEmail)
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be active or inactive.",
      });
    }

    const normalizedCode = normalizeOptional(employee_code);
    const normalizedPhone = normalizeOptional(phone);
    const normalizedDepartment = normalizeOptional(department);
    const normalizedDesignation = normalizeOptional(designation);

    if (normalizedCode && normalizedCode.length > 50) {
      return res.status(400).json({
        success: false,
        message: "Employee code must not exceed 50 characters.",
      });
    }

    if (normalizedPhone && normalizedPhone.length > 20) {
      return res.status(400).json({
        success: false,
        message: "Phone must not exceed 20 characters.",
      });
    }

    if (
      normalizedDepartment &&
      normalizedDepartment.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Department must not exceed 100 characters.",
      });
    }

    if (
      normalizedDesignation &&
      normalizedDesignation.length > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Designation must not exceed 100 characters.",
      });
    }

    let normalizedUserId = null;

    if (user_id !== undefined && user_id !== null && user_id !== "") {
      normalizedUserId = Number(user_id);

      if (
        !Number.isSafeInteger(normalizedUserId) ||
        normalizedUserId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "User ID must be a positive integer.",
        });
      }
    }

    const [existing] = await db.query(
      "SELECT id FROM faculty WHERE id = ?",
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found.",
      });
    }

    const [result] = await db.query(
      `UPDATE faculty
       SET user_id = ?,
           employee_code = ?,
           name = ?,
           email = ?,
           phone = ?,
           department = ?,
           designation = ?,
           status = ?
       WHERE id = ?`,
      [
        normalizedUserId,
        normalizedCode,
        name.trim(),
        normalizedEmail,
        normalizedPhone,
        normalizedDepartment,
        normalizedDesignation,
        status,
        id,
      ]
    );

    const [rows] = await db.query(
      `SELECT id, user_id, employee_code, name, email, phone,
              department, designation, status, created_at, updated_at
       FROM faculty
       WHERE id = ?`,
      [id]
    );

    return res.json({
      success: true,
      message: "Faculty member updated successfully.",
      data: rows[0],
      changed: result.affectedRows > 0,
    });
  } catch (error) {
    return handleDatabaseError(res, error, "UPDATE FACULTY");
  }
};

// DELETE /faculty/:id
exports.deleteFaculty = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return res.status(400).json({
        success: false,
        message: "A valid faculty ID is required.",
      });
    }

    const [result] = await db.query(
      "DELETE FROM faculty WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Faculty member not found.",
      });
    }

    return res.json({
      success: true,
      message: "Faculty member deleted successfully.",
    });
  } catch (error) {
    return handleDatabaseError(res, error, "DELETE FACULTY");
  }
};
