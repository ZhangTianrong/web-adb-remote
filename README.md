# ADB Remote Control (Python Version)

A web interface for controlling Android devices through ADB commands.

## Requirements

- Python 3.6 or higher
- ADB (Android Debug Bridge) installed and in system PATH
- An Android device with USB debugging enabled

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python server.py
```

3. Open your browser and navigate to:
```
http://127.0.0.1:15425
```

## Usage

1. Enable USB debugging on your Android device
2. Connect your device to ADB (either via USB or wireless)
3. Enter the device IP and port in the web interface
4. Click "Connect" to establish connection
5. Use the remote control buttons to send commands to your device

## Features

- Fast touch response using FastClick
- Support for basic Android navigation keys
- Responsive design that works on both desktop and mobile
- Visual feedback for button presses
- Connection status indicator
