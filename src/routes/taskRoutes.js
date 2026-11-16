
const express = require("express");
const router = express.Router();

const {
    getAllTasks,
    getTaskStats,
    searchTasks,
    getTasksByAssignee,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

router.get("/stats", getTaskStats);
router.get("/search", searchTasks);
router.get("/assignee/:name", getTasksByAssignee);
router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
