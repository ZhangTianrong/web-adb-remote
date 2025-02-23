// Initialize FastClick
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

// Prevent double-tap zoom on iOS
document.documentElement.addEventListener('dblclick', e => {
    e.preventDefault();
    e.stopPropagation();
}, true);

// Prevent zoom gestures
document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', function(e) {
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });

// Main app initialization
document.addEventListener('DOMContentLoaded', () => {
    const ipInput = document.getElementById('ip');
    const portInput = document.getElementById('port');
    const connectButton = document.getElementById('connect');
    const statusElement = document.getElementById('status');
    const keys = document.querySelectorAll('.key');

    let deviceAddress = null;

    // Helper function to update status
    function updateStatus(message, type = 'normal') {
        statusElement.textContent = message;
        statusElement.className = 'status ' + type;
    }

    // Helper function to execute ADB command
    async function executeAdbCommand(command) {
        try {
            const response = await fetch('/adb', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ command })
            });

            if (!response.ok) {
                throw new Error('ADB command failed');
            }

            return await response.text();
        } catch (error) {
            console.error('Error executing ADB command:', error);
            throw error;
        }
    }

    // Connect to device
    connectButton.addEventListener('click', async () => {
        const ip = ipInput.value.trim();
        const port = portInput.value.trim();

        if (!ip || !port) {
            updateStatus('Please enter IP and port', 'error');
            return;
        }

        deviceAddress = `${ip}:${port}`;
        updateStatus('Connecting...', 'normal');

        try {
            // Try to connect to the device
            await executeAdbCommand(`adb connect ${deviceAddress}`);
            updateStatus('Connected', 'connected');
        } catch (error) {
            updateStatus('Connection failed', 'error');
            deviceAddress = null;
        }
    });

    // Handle key presses
    keys.forEach(key => {
        key.addEventListener('click', async () => {
            if (!deviceAddress) {
                updateStatus('Not connected', 'error');
                return;
            }

            const keycode = key.dataset.keycode;

            try {
                await executeAdbCommand(`adb -s ${deviceAddress} shell input keyevent ${keycode}`);
                key.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    key.style.transform = 'scale(1)';
                }, 100);
            } catch (error) {
                updateStatus('Failed to send keyevent', 'error');
            }
        });
    });
});
