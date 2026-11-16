const express = require("express");
const logger = require("./middlewares/logger");
const employeeRoutes = require("./routes/employeeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

const app = express();
app.use(logger);
// Gelen JSON verilerini okuyabilmek için
app.use(express.json());

// Routes
app.use("/api/employees", employeeRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
// Test endpoint'i
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Task Management API is running!"
    });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
