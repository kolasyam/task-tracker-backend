const asyncHandler = require("express-async-handler");
const Project = require("../Models/Project");

// const createProject = asyncHandler(async (req, res) => {
//   const { title, description } = req.body;

//   if (!req.user) {
//     res.status(401);
//     throw new Error("Unauthorized: Admin not logged in");
//   }
//   const projectCount = await Project.countDocuments({
//     createdBy: req.user._id,
//   });
//   console.log("id", req.user._id);

//   if (projectCount >= 4) {
//     res.status(400);
//     throw new Error("Project limit is over");
//     return;
//   }
//   const projectExists = await Project.findOne({
//     title,
//     createdBy: req.user._id,
//   });

//   if (projectExists) {
//     res.status(400);
//     throw new Error("Project already exists");
//   }

//   const project = await Project.create({
//     title,
//     description,
//     createdBy: req.user._id, // Associate agent with the logged-in admin
//   });

//   if (project) {
//     res.status(201).json({
//       _id: project._id,
//       title: project.title,
//       description: project.description,
//       createdBy: project.createdBy, // Return the admin who created it
//     });
//     console.log(project);
//   } else {
//     res.status(400);
//     throw new Error("Invalid agent data");
//   }
// });
const createProject = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized: Admin not logged in");
  }

  const projectCount = await Project.countDocuments({
    createdBy: req.user._id,
  });

  if (projectCount >= 4) {
    res.status(400).json({ message: "Project limit is over" }); // Send a structured response
    return;
  }

  const projectExists = await Project.findOne({
    title,
    createdBy: req.user._id,
  });

  if (projectExists) {
    res.status(400).json({ message: "Project already exists" }); // Ensure a structured error message
    return;
  }

  const project = await Project.create({
    title,
    description,
    createdBy: req.user._id, // Associate project with logged-in user
  });

  if (project) {
    res.status(201).json({
      _id: project._id,
      title: project.title,
      description: project.description,
      createdBy: project.createdBy,
    });
  } else {
    res.status(400).json({ message: "Invalid project data" });
  }
});

const getProjects = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Unauthorized: Admin not logged in");
  }

  const projects = await Project.find({ createdBy: req.user._id });

  res.status(200).json(projects);
});

const getProjectById = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (project) {
    res.json(project);
  } else {
    res.status(404);
    throw new Error("Agent not found");
  }
});

// const deleteProject = asyncHandler(async (req, res) => {
//   const project = await Project.findById(req.params.id);

//   if (project) {
//     await project.remove();
//     res.json({ message: "Project removed" });
//   } else {
//     res.status(404);
//     throw new Error("Project not found");
//   }
// });
const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Optional: Only allow user to delete their own project
  if (project.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this project");
  }

  await project.deleteOne(); // safer than `remove()`, use `deleteOne()`

  res.status(200).json({ message: "Project deleted successfully" });
});

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  deleteProject,
};
