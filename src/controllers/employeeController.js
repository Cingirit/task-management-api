const { readData, writeData } = require('../utils/fileHelper');

const parsePositiveId = (value) => /^\d+$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) > 0
    ? Number(value)
    : null;
const hasText = (value) => typeof value === "string" && value.trim().length > 0;

function getAllEmployees(req, res) {
    try {
        const employees = readData('employees.json');
        res.status(200).json(employees);
    } catch (error) {
        console.error("Get employees error:", error.message);

        res.status(500).json({
            error: "Failed to retrieve employees"
        })
    }
}


function createEmployee(req, res) {

    try {
        const newEmployee = req.body;

        if (!newEmployee || !hasText(newEmployee.firstName) || !hasText(newEmployee.lastName) || !hasText(newEmployee.email) || !hasText(newEmployee.position) || !hasText(newEmployee.department)) {
            return res.status(400).json({
                error: "All employee fields are required"
            });
        }

        const employees = readData("employees.json");

        const maxId = employees.length > 0
            ? Math.max(...employees.map(employee => employee.id))
            : 0;

        newEmployee.id = maxId + 1;
        employees.push(newEmployee);
        writeData('employees.json', employees);

        res.status(201).json(newEmployee);
    } catch (error) {
        console.error("Create employee error:", error.message);
        res.status(500).json({
            error: "Failed to create employee"
        });
    }
}

function getEmployeeById(req, res) {
    try {
        const employeeId = parsePositiveId(req.params.id);
        if (!employeeId) {
            return res.status(400).json({
                error: "Invalid employee ID"
            });
        }
        const employees = readData('employees.json');
        const employee = employees.find(emp => emp.id === employeeId);

        if (!employee) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        res.status(200).json(employee);
    } catch (error) {
        console.error("Get employee by ID error:", error.message);
        res.status(500).json({
            error: "Failed to retrieve employee"
        });
    }
}


function updateEmployee(req, res) {
    try {
        const employeeId = parsePositiveId(req.params.id);

        if (!employeeId) {
            return res.status(400).json({
                error: "Invalid employee ID"
            });
        }

        const employees = readData("employees.json");

        const employeeIndex = employees.findIndex(
            emp => emp.id === employeeId
        );

        if (employeeIndex === -1) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        if (
            !req.body || !hasText(req.body.firstName) || !hasText(req.body.lastName) || !hasText(req.body.email) || !hasText(req.body.position) || !hasText(req.body.department)
        ) {
            return res.status(400).json({
                error: "All employee fields are required"
            });
        }

        const updatedEmployee = {
            ...employees[employeeIndex],
            ...req.body,
            id: employeeId
        };

        employees[employeeIndex] = updatedEmployee;

        writeData("employees.json", employees);

        res.status(200).json(updatedEmployee);

    } catch (error) {
        console.error("Update employee error:", error.message);

        res.status(500).json({
            error: "Failed to update employee"
        });
    }
}


function deleteEmployee(req, res) {
    try {
        const employeeId = parsePositiveId(req.params.id);

        if (!employeeId) {
            return res.status(400).json({
                error: "Invalid employee ID"
            });
        }

        const employees = readData("employees.json");

        const employeeIndex = employees.findIndex(
            emp => emp.id === employeeId
        );

        if (employeeIndex === -1) {
            return res.status(404).json({
                error: "Employee not found"
            });
        }

        const tasks = readData("tasks.json");
        if (tasks.some(task => task.employeeId === employeeId)) {
            return res.status(400).json({ error: "Employee cannot be deleted while tasks are assigned to them" });
        }

        employees.splice(employeeIndex, 1);

        writeData("employees.json", employees);

        res.status(200).json({
            message: "Employee deleted successfully"
        });

    } catch (error) {
        console.error("Delete employee error:", error.message);

        res.status(500).json({
            error: "Failed to delete employee"
        });
    }
}


module.exports = {
    getAllEmployees,
    createEmployee,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
