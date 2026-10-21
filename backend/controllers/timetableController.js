
const db = require("../config/db");

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const validId = (value) =>
  Number.isSafeInteger(Number(value)) && Number(value) > 0;

const normalizeDay = (value) => {
  if (typeof value !== "string") return null;
  return DAYS.find((day) => day.toLowerCase() === value.trim().toLowerCase()) || null;
};

const validTime = (value) =>
  typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(value);

const handleError = (res, error, operation) => {
  console.error(`${operation} ERROR:`, error);
  return res.status(500).json({
    success: false,
    message: "An unexpected database error occurred.",
  });
};

const timetableSelect = `
  SELECT
    t.id,
    t.course_id,
    c.name AS course_name,
    t.subject_id,
    s.name AS subject_name,
    t.teacher_id,
    f.name AS teacher_name,
    f.employee_code,
    t.classroom_id,
    cl.room_number,
    cl.building,
    t.day_of_week,
    TIME_FORMAT(t.start_time, '%H:%i') AS start_time,
    TIME_FORMAT(t.end_time, '%H:%i') AS end_time,
    t.created_at
  FROM timetables t
  JOIN courses c ON c.id = t.course_id
  JOIN subjects s ON s.id = t.subject_id
  JOIN faculty f ON f.id = t.teacher_id
  LEFT JOIN classrooms cl ON cl.id = t.classroom_id
`;

exports.getOptions = async (req, res) => {
  try {
    const [[courses], [subjects], [faculty], [classrooms]] = await Promise.all([
      db.query("SELECT id, name FROM courses ORDER BY name"),
      db.query("SELECT id, course_id, name FROM subjects ORDER BY name"),
      db.query(
        "SELECT id, name, employee_code, department, designation FROM faculty WHERE status = 'active' ORDER BY name"
      ),
      db.query(
        "SELECT id, room_number, building, capacity FROM classrooms ORDER BY room_number"
      ),
    ]);

    return res.json({
      success: true,
      data: { courses, subjects, faculty, classrooms, days: DAYS },
    });
  } catch (error) {
    return handleError(res, error, "GET TIMETABLE OPTIONS");
  }
};

exports.getTimetables = async (req, res) => {
  try {
    const [rows] = await db.query(
      `${timetableSelect} ORDER BY
        FIELD(t.day_of_week, 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
        t.start_time, c.name`
    );

    return res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    return handleError(res, error, "GET TIMETABLES");
  }
};

async function validateEntry(body, res, excludeId = null) {
  const courseId = Number(body.course_id);
  const subjectId = Number(body.subject_id);
  const teacherId = Number(body.teacher_id);
  const classroomId =
    body.classroom_id === "" || body.classroom_id === null ||
    body.classroom_id === undefined
      ? null
      : Number(body.classroom_id);

  const day = normalizeDay(body.day_of_week);
  const start = body.start_time;
  const end = body.end_time;

  if (!validId(courseId) || !validId(subjectId) || !validId(teacherId)) {
    res.status(400).json({
      success: false,
      message: "Choose a valid course, subject, and faculty member.",
    });
    return null;
  }

  if (classroomId !== null && !validId(classroomId)) {
    res.status(400).json({
      success: false,
      message: "Choose a valid classroom.",
    });
    return null;
  }

  if (!day || !validTime(start) || !validTime(end) || start >= end) {
    res.status(400).json({
      success: false,
      message: "Choose a valid day and time range. End time must be after start time.",
    });
    return null;
  }

  const [courseRows] = await db.query(
    "SELECT id FROM courses WHERE id = ?",
    [courseId]
  );

  if (!courseRows.length) {
    res.status(400).json({ success: false, message: "Course not found." });
    return null;
  }

  const [subjectRows] = await db.query(
    "SELECT id FROM subjects WHERE id = ? AND course_id = ?",
    [subjectId, courseId]
  );

  if (!subjectRows.length) {
    res.status(400).json({
      success: false,
      message: "The selected subject does not belong to this course.",
    });
    return null;
  }

  const [facultyRows] = await db.query(
    "SELECT id FROM faculty WHERE id = ? AND status = 'active'",
    [teacherId]
  );

  if (!facultyRows.length) {
    res.status(400).json({
      success: false,
      message: "The selected faculty member is not active or does not exist.",
    });
    return null;
  }

  if (classroomId !== null) {
    const [roomRows] = await db.query(
      "SELECT id FROM classrooms WHERE id = ?",
      [classroomId]
    );

    if (!roomRows.length) {
      res.status(400).json({ success: false, message: "Classroom not found." });
      return null;
    }
  }

  const params = [day, end, start, teacherId];
  let exclusion = "";

  if (excludeId !== null) {
    exclusion = " AND id <> ?";
    params.push(excludeId);
  }

  const [teacherConflicts] = await db.query(
    `SELECT id FROM timetables
     WHERE day_of_week = ?
       AND start_time < ?
       AND end_time > ?
       AND teacher_id = ?${exclusion}
     LIMIT 1`,
    params
  );

  if (teacherConflicts.length) {
    res.status(409).json({
      success: false,
      message: "This faculty member already has a class during that time.",
      conflict: "faculty",
    });
    return null;
  }

  if (classroomId !== null) {
    const roomParams = [day, end, start, classroomId];
    const roomExclusion = excludeId !== null ? " AND id <> ?" : "";
    if (excludeId !== null) roomParams.push(excludeId);

    const [roomConflicts] = await db.query(
      `SELECT id FROM timetables
       WHERE day_of_week = ?
         AND start_time < ?
         AND end_time > ?
         AND classroom_id = ?${roomExclusion}
       LIMIT 1`,
      roomParams
    );

    if (roomConflicts.length) {
      res.status(409).json({
        success: false,
        message: "This classroom is already booked during that time.",
        conflict: "classroom",
      });
      return null;
    }
  }

  const courseParams = [day, end, start, courseId];
  const courseExclusion = excludeId !== null ? " AND id <> ?" : "";
  if (excludeId !== null) courseParams.push(excludeId);

  const [courseConflicts] = await db.query(
    `SELECT id FROM timetables
     WHERE day_of_week = ?
       AND start_time < ?
       AND end_time > ?
       AND course_id = ?${courseExclusion}
     LIMIT 1`,
    courseParams
  );

  if (courseConflicts.length) {
    res.status(409).json({
      success: false,
      message: "This course already has a scheduled class during that time.",
      conflict: "course",
    });
    return null;
  }

  return {
    courseId,
    subjectId,
    teacherId,
    classroomId,
    day,
    start,
    end,
  };
}

exports.addTimetable = async (req, res) => {
  try {
    const entry = await validateEntry(req.body, res);
    if (!entry) return;

    const [result] = await db.query(
      `INSERT INTO timetables
        (course_id, subject_id, teacher_id, classroom_id,
         day_of_week, start_time, end_time)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.courseId,
        entry.subjectId,
        entry.teacherId,
        entry.classroomId,
        entry.day,
        entry.start,
        entry.end,
      ]
    );

    const [rows] = await db.query(
      `${timetableSelect} WHERE t.id = ?`,
      [result.insertId]
    );

    return res.status(201).json({
      success: true,
      message: "Timetable entry created successfully.",
      data: rows[0],
    });
  } catch (error) {
    return handleError(res, error, "ADD TIMETABLE");
  }
};

exports.updateTimetable = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "A valid timetable ID is required.",
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM timetables WHERE id = ?",
      [id]
    );

    if (!existing.length) {
      return res.status(404).json({
        success: false,
        message: "Timetable entry not found.",
      });
    }

    const entry = await validateEntry(req.body, res, id);
    if (!entry) return;

    await db.query(
      `UPDATE timetables
       SET course_id = ?, subject_id = ?, teacher_id = ?, classroom_id = ?,
           day_of_week = ?, start_time = ?, end_time = ?
       WHERE id = ?`,
      [
        entry.courseId,
        entry.subjectId,
        entry.teacherId,
        entry.classroomId,
        entry.day,
        entry.start,
        entry.end,
        id,
      ]
    );

    const [rows] = await db.query(
      `${timetableSelect} WHERE t.id = ?`,
      [id]
    );

    return res.json({
      success: true,
      message: "Timetable entry updated successfully.",
      data: rows[0],
    });
  } catch (error) {
    return handleError(res, error, "UPDATE TIMETABLE");
  }
};

exports.deleteTimetable = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "A valid timetable ID is required.",
      });
    }

    const [result] = await db.query(
      "DELETE FROM timetables WHERE id = ?",
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        success: false,
        message: "Timetable entry not found.",
      });
    }

    return res.json({
      success: true,
      message: "Timetable entry deleted successfully.",
    });
  } catch (error) {
    return handleError(res, error, "DELETE TIMETABLE");
  }
};

exports.addSubject = async (req, res) => {
  try {
    const courseId = Number(req.body.course_id);
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";

    if (!validId(courseId) || !name || name.length > 255) {
      return res.status(400).json({
        success: false,
        message: "Choose a valid course and provide a subject name (max 255 characters).",
      });
    }

    const [courses] = await db.query("SELECT id FROM courses WHERE id = ?", [courseId]);
    if (!courses.length) {
      return res.status(400).json({ success: false, message: "Course not found." });
    }

    const [result] = await db.query(
      "INSERT INTO subjects (course_id, name) VALUES (?, ?)",
      [courseId, name]
    );

    return res.status(201).json({
      success: true,
      message: "Subject added successfully.",
      data: { id: result.insertId, course_id: courseId, name },
    });
  } catch (error) {
    return handleError(res, error, "ADD SUBJECT");
  }
};

exports.addClassroom = async (req, res) => {
  try {
    const roomNumber =
      typeof req.body.room_number === "string" ? req.body.room_number.trim() : "";
    const building =
      typeof req.body.building === "string" ? req.body.building.trim() : null;
    const capacity = Number(req.body.capacity);

    if (!roomNumber || roomNumber.length > 50 || !Number.isSafeInteger(capacity) || capacity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Provide a room number (max 50 characters) and a positive whole-number capacity.",
      });
    }

    if (building && building.length > 100) {
      return res.status(400).json({
        success: false,
        message: "Building name must not exceed 100 characters.",
      });
    }

    const [existing] = await db.query(
      "SELECT id FROM classrooms WHERE room_number = ?",
      [roomNumber]
    );

    if (existing.length) {
      return res.status(409).json({
        success: false,
        message: "A classroom with this room number already exists.",
      });
    }

    const [result] = await db.query(
      "INSERT INTO classrooms (room_number, building, capacity) VALUES (?, ?, ?)",
      [roomNumber, building || null, capacity]
    );

    return res.status(201).json({
      success: true,
      message: "Classroom added successfully.",
      data: { id: result.insertId, room_number: roomNumber, building, capacity },
    });
  } catch (error) {
    return handleError(res, error, "ADD CLASSROOM");
  }
};
