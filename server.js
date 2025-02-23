const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 15424;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Execute ADB command
function executeAdbCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error}`);
                reject(error);
                return;
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            resolve(stdout);
        });
    });
}

// Handle ADB commands
app.post('/adb', async (req, res) => {
    try {
        const { command } = req.body;
        const result = await executeAdbCommand(command);
        res.send(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, '127.0.0.1', () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});
