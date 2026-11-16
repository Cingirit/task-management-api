const fs = require("fs");
const path = require("path");

const getFilePath = (fileName) => {
    return path.join(__dirname, "../../data", fileName);
};
const readData = (fileName) => {
    try {
        const filePath = getFilePath(fileName);

        const data = fs.readFileSync(filePath, "utf-8");

        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${fileName}:`, error.message);
        throw error;
    }
};
const writeData = (fileName, data) => {
    try {
        const filePath = getFilePath(fileName);

        const jsonData = JSON.stringify(data, null, 2);

        fs.writeFileSync(filePath, jsonData, "utf-8");
    } catch (error) {
        console.error(`Error writing ${fileName}:`, error.message);
        throw error;
    }
};

module.exports = {
    readData,
    writeData
};