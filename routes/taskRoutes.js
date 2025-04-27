const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} = require("../Controllers/taskController");
router.post("/:projectId", protect, createTask);

router.get("/:projectId", protect, getTasksByProject);

// Update Task status
router.put("/:taskId", protect, updateTask);

// Delete Task
router.delete("/:taskId", protect, deleteTask);
module.exports = router;
