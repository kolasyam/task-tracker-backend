const express = require("express");
const router = express.Router();
const { protect } = require("../Middleware/authMiddleware");
const {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
} = require("../Controllers/projectController");
router.post("/create", protect, createProject);
router.get("/getprojects", protect, getProjects);
router
  .route("/:id")
  .get(protect, getProjectById)
  .delete(protect, deleteProject);
module.exports = router;
