// const asyncHandler = require("express-async-handler");
import asyncHandler from "express-async-handler";
// const Project = require("../Models/Project");
// const Task = require("../Models/Task");
import Project from "../Models/Project.js";
import Task from "../Models/Task.js";

// const createTask = asyncHandler(async (req, res) => {
//   const { title, description } = req.body;
//   const { projectId } = req.params;

//   if (!title) {
//     res.status(400);
//     throw new Error("Title is required");
//   }

//   const project = await Project.findById(projectId);

//   if (!project) {
//     res.status(404);
//     throw new Error("Project not found");
//   }

//   // Check if a task with the same title already exists for this project
//   const existingTask = await Task.findOne({ title, projectId });

//   if (existingTask) {
//     res.status(400);
//     throw new Error("Task already created");
//   }

//   const task = await Task.create({
//     title,
//     description,
//     createdBy: req.user._id,
//     projectId,
//   });

//   res.status(201).json(task);
// });
const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { projectId } = req.params;

  if (!title) {
    res.status(400);
    throw new Error("Title is required");
  }

  const project = await Project.findById(projectId);

  if (!project) {
    res.status(404);
    throw new Error("Project not found");
  }

  // Check if a task with the same title already exists for this project
  const existingTask = await Task.findOne({ title, projectId });

  if (existingTask) {
    res.status(400).json({ message: "Task already created" });
    return;
  }

  const task = await Task.create({
    title,
    description,
    createdBy: req.user._id,
    projectId,
  });

  res.status(201).json(task);
});

const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const tasks = await Task.find({
    projectId,
    createdBy: req.user._id,
  });

  res.json(tasks);
});

// const updateTask = asyncHandler(async (req, res) => {
//   const { status } = req.body;
//   const { taskId } = req.params;

//   const task = await Task.findById(taskId);

//   if (!task) {
//     res.status(404);
//     throw new Error("Task not found");
//   }

//   if (task.createdBy.toString() !== req.user._id.toString()) {
//     res.status(401);
//     throw new Error("Not authorized");
//   }

//   task.status = status;

//   if (status === "Completed") {
//     task.completedAt = Date.now();
//   } else {
//     task.completedAt = null;
//   }

//   const updatedTask = await task.save();

//   res.json(updatedTask);
// });
const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  // Check if user is the owner of the task
  if (task.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this task");
  }

  if (title) task.title = title;
  if (description) task.description = description;
  if (status) {
    task.status = status;
    if (status === "Completed") {
      task.completedAt = Date.now();
    } else {
      task.completedAt = null;
    }
  }

  const updatedTask = await task.save();

  res.json(updatedTask);
});

const deleteTask = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  const task = await Task.findById(taskId);

  if (!task) {
    res.status(404);
    throw new Error("Task not found");
  }

  if (task.createdBy.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized");
  }

  await task.deleteOne();

  res.json({ message: "Task removed" });
});

export { createTask, getTasksByProject, updateTask, deleteTask };
