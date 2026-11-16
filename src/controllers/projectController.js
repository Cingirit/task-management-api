
const { readData, writeData } = require("../utils/fileHelper");
const parsePositiveId = value => /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) > 0 ? Number(value) : null;
const hasText = value => typeof value === "string" && value.trim().length > 0;

// GET - Tüm projeleri getir
function getAllProjects(req, res) {
    try {
        const projects = readData("projects.json");

        res.status(200).json(projects);
    } catch (error) {
        console.error("Get projects error:", error.message);

        res.status(500).json({
            error: "Failed to retrieve projects"
        });
    }
}

// GET - ID ile proje getir
function getProjectById(req, res) {
    try {
        const projectId = parsePositiveId(req.params.id);

        if (!projectId) {
            return res.status(400).json({
                error: "Invalid project ID"
            });
        }

        const projects = readData("projects.json");

        const project = projects.find(
            project => project.id === projectId
        );

        if (!project) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        res.status(200).json(project);
    } catch (error) {
        console.error("Get project error:", error.message);

        res.status(500).json({
            error: "Failed to retrieve project"
        });
    }
}

// POST - Yeni proje oluştur
function createProject(req, res) {
    try {
        const newProject = req.body;

        if (
            !newProject || !hasText(newProject.name) || !hasText(newProject.description) || !hasText(newProject.status) || !hasText(newProject.startDate)
        ) {
            return res.status(400).json({
                error: "Name, description, status and start date are required"
            });
        }

        const validStatuses = ["planned", "active", "completed"];

        if (!validStatuses.includes(newProject.status)) {
            return res.status(400).json({
                error: "Invalid project status"
            });
        }

        const projects = readData("projects.json");

        const maxId = projects.length > 0
            ? Math.max(...projects.map(project => project.id))
            : 0;

        newProject.id = maxId + 1;

        if (newProject.endDate === undefined) {
            newProject.endDate = null;
        }

        projects.push(newProject);

        writeData("projects.json", projects);

        res.status(201).json(newProject);
    } catch (error) {
        console.error("Create project error:", error.message);

        res.status(500).json({
            error: "Failed to create project"
        });
    }
}

// PUT - Projeyi güncelle
function updateProject(req, res) {
    try {
        const projectId = parsePositiveId(req.params.id);

        if (!projectId) {
            return res.status(400).json({
                error: "Invalid project ID"
            });
        }

        const projects = readData("projects.json");

        const projectIndex = projects.findIndex(
            project => project.id === projectId
        );

        if (projectIndex === -1) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        const updatedData = req.body;

        if (
            !updatedData || !hasText(updatedData.name) || !hasText(updatedData.description) || !hasText(updatedData.status) || !hasText(updatedData.startDate)
        ) {
            return res.status(400).json({
                error: "All project fields are required except endDate"
            });
        }

        const validStatuses = ["planned", "active", "completed"];

        if (!validStatuses.includes(updatedData.status)) {
            return res.status(400).json({
                error: "Invalid project status"
            });
        }

        const updatedProject = {
            ...projects[projectIndex],
            ...updatedData,
            id: projectId
        };

        projects[projectIndex] = updatedProject;

        writeData("projects.json", projects);

        res.status(200).json(updatedProject);
    } catch (error) {
        console.error("Update project error:", error.message);

        res.status(500).json({
            error: "Failed to update project"
        });
    }
}

// DELETE - Projeyi sil
function deleteProject(req, res) {
    try {
        const projectId = parsePositiveId(req.params.id);

        if (!projectId) {
            return res.status(400).json({
                error: "Invalid project ID"
            });
        }

        const projects = readData("projects.json");

        const projectIndex = projects.findIndex(
            project => project.id === projectId
        );

        if (projectIndex === -1) {
            return res.status(404).json({
                error: "Project not found"
            });
        }

        const tasks = readData("tasks.json");
        if (tasks.some(task => task.projectId === projectId)) {
            return res.status(400).json({ error: "Project cannot be deleted while tasks are assigned to it" });
        }

        projects.splice(projectIndex, 1);

        writeData("projects.json", projects);

        res.status(200).json({
            message: "Project deleted successfully"
        });
    } catch (error) {
        console.error("Delete project error:", error.message);

        res.status(500).json({
            error: "Failed to delete project"
        });
    }
}

module.exports = {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject
};
