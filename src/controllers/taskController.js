
const { readData, writeData } = require("../utils/fileHelper");

// GET - Tüm görevleri getir
// İstenirse status ve priority değerlerine göre filtreleme yapar.
function getAllTasks(req, res) {
    try {
        let tasks = readData("tasks.json");

        // Duruma göre filtreleme
        if (req.query.status) {
            tasks = tasks.filter(task => task.status === req.query.status);
        }

        // Önceliğe göre filtreleme
        if (req.query.priority) {
            tasks = tasks.filter(task => task.priority === req.query.priority);
        }

        res.status(200).json(tasks);
    } catch (error) {
        console.error("Get tasks error:", error.message);

        res.status(500).json({
            message: "Görevler getirilirken bir hata oluştu."
        });
    }
}

// GET - ID değerine göre görev getir
function getTaskById(req, res) {
    try {
        const tasks = readData("tasks.json");
        const id = Number(req.params.id);

        const task = tasks.find(task => task.id === id);

        if (!task) {
            return res.status(404).json({
                message: "Görev bulunamadı."
            });
        }

        res.status(200).json(task);
    } catch (error) {
        console.error("Get task error:", error.message);

        res.status(500).json({
            message: "Görev getirilirken bir hata oluştu."
        });
    }
}

// POST - Yeni görev oluştur
function createTask(req, res) {
    try {
        const tasks = readData("tasks.json");

        const {
            title,
            description,
            employeeId,
            projectId,
            status,
            priority,
            dueDate
        } = req.body;

        // Zorunlu alanları kontrol et
        if (
            !title ||
            !description ||
            !employeeId ||
            !projectId ||
            !status ||
            !priority ||
            !dueDate
        ) {
            return res.status(400).json({
                message: "Lütfen tüm görev alanlarını doldurun."
            });
        }

        // Görev için çalışan kontrolü
        const employees = readData("employees.json");
        const employee = employees.find(item => item.id === Number(employeeId));

        if (!employee) {
            return res.status(404).json({
                message: "Çalışan bulunamadı."
            });
        }

        // Görev için proje kontrolü
        const projects = readData("projects.json");
        const project = projects.find(item => item.id === Number(projectId));

        if (!project) {
            return res.status(404).json({
                message: "Proje bulunamadı."
            });
        }

        // Yeni görev ID'si oluştur
        const newId = tasks.length > 0
            ? Math.max(...tasks.map(task => task.id)) + 1
            : 1;

        const newTask = {
            id: newId,
            title,
            description,
            employeeId: Number(employeeId),
            projectId: Number(projectId),
            status,
            priority,
            dueDate,
            createdAt: new Date().toISOString()
        };

        tasks.push(newTask);

        writeData("tasks.json", tasks);

        res.status(201).json(newTask);
    } catch (error) {
        console.error("Create task error:", error.message);

        res.status(500).json({
            message: "Görev oluşturulurken bir hata oluştu."
        });
    }
}

// PUT - Görevi güncelle
function updateTask(req, res) {
    try {
        const tasks = readData("tasks.json");
        const id = Number(req.params.id);

        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({
                message: "Görev bulunamadı."
            });
        }

        const {
            title,
            description,
            employeeId,
            projectId,
            status,
            priority,
            dueDate
        } = req.body;

        if (
            !title ||
            !description ||
            !employeeId ||
            !projectId ||
            !status ||
            !priority ||
            !dueDate
        ) {
            return res.status(400).json({
                message: "Lütfen tüm görev alanlarını doldurun."
            });
        }

        // Çalışanın var olup olmadığını kontrol et
        const employees = readData("employees.json");
        const employee = employees.find(item => item.id === Number(employeeId));

        if (!employee) {
            return res.status(404).json({
                message: "Çalışan bulunamadı."
            });
        }

        // Projenin var olup olmadığını kontrol et
        const projects = readData("projects.json");
        const project = projects.find(item => item.id === Number(projectId));

        if (!project) {
            return res.status(404).json({
                message: "Proje bulunamadı."
            });
        }

        const updatedTask = {
            id,
            title,
            description,
            employeeId: Number(employeeId),
            projectId: Number(projectId),
            status,
            priority,
            dueDate,
            createdAt: tasks[taskIndex].createdAt
        };

        tasks[taskIndex] = updatedTask;

        writeData("tasks.json", tasks);

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Update task error:", error.message);

        res.status(500).json({
            message: "Görev güncellenirken bir hata oluştu."
        });
    }
}

// DELETE - Görevi sil
function deleteTask(req, res) {
    try {
        const tasks = readData("tasks.json");
        const id = Number(req.params.id);

        const taskIndex = tasks.findIndex(task => task.id === id);

        if (taskIndex === -1) {
            return res.status(404).json({
                message: "Görev bulunamadı."
            });
        }

        tasks.splice(taskIndex, 1);

        writeData("tasks.json", tasks);

        res.status(200).json({
            message: "Görev başarıyla silindi."
        });
    } catch (error) {
        console.error("Delete task error:", error.message);

        res.status(500).json({
            message: "Görev silinirken bir hata oluştu."
        });
    }
}

// GET - Görevlerde arama yap
function searchTasks(req, res) {
    try {
        const tasks = readData("tasks.json");
        const keyword = req.query.keyword;

        if (!keyword || !keyword.trim()) {
            return res.status(400).json({
                message: "Arama için keyword parametresi gereklidir."
            });
        }

        const result = tasks.filter(task =>
            task.title.toLowerCase().includes(keyword.toLowerCase()) ||
            task.description.toLowerCase().includes(keyword.toLowerCase())
        );

        res.status(200).json(result);
    } catch (error) {
        console.error("Search tasks error:", error.message);

        res.status(500).json({
            message: "Görevler aranırken bir hata oluştu."
        });
    }
}

// GET - Çalışana atanmış görevleri getir
function getTasksByAssignee(req, res) {
    try {
        const tasks = readData("tasks.json");
        const employees = readData("employees.json");

        const name = req.params.name.toLowerCase();

        const employee = employees.find(item =>
            `${item.firstName} ${item.lastName}`.toLowerCase() === name
        );

        if (!employee) {
            return res.status(404).json({
                message: "Çalışan bulunamadı."
            });
        }

        const employeeTasks = tasks.filter(task =>
            task.employeeId === employee.id
        );

        res.status(200).json(employeeTasks);
    } catch (error) {
        console.error("Get employee tasks error:", error.message);

        res.status(500).json({
            message: "Çalışan görevleri getirilirken bir hata oluştu."
        });
    }
}

// GET - Görev istatistiklerini getir
function getTaskStats(req, res) {
    try {
        const tasks = readData("tasks.json");

        const stats = {
            totalTasks: tasks.length,

            pendingTasks: tasks.filter(task =>
                task.status === "pending"
            ).length,

            inProgressTasks: tasks.filter(task =>
                task.status === "in-progress"
            ).length,

            completedTasks: tasks.filter(task =>
                task.status === "completed"
            ).length,

            highPriorityTasks: tasks.filter(task =>
                task.priority === "high"
            ).length,

            mediumPriorityTasks: tasks.filter(task =>
                task.priority === "medium"
            ).length,

            lowPriorityTasks: tasks.filter(task =>
                task.priority === "low"
            ).length
        };

        res.status(200).json(stats);
    } catch (error) {
        console.error("Get task stats error:", error.message);

        res.status(500).json({
            message: "Görev istatistikleri getirilirken bir hata oluştu."
        });
    }
}

module.exports = {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    searchTasks,
    getTasksByAssignee,
    getTaskStats
};
