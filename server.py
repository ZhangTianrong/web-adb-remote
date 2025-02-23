from flask import Flask, request, jsonify, send_from_directory
import subprocess
import os

app = Flask(__name__)

def execute_adb_command(command):
    try:
        result = subprocess.run(command.split(), capture_output=True, text=True)
        if result.returncode != 0:
            raise Exception(result.stderr)
        return result.stdout
    except Exception as e:
        print(f"Error: {str(e)}")
        raise

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/adb', methods=['POST'])
def adb_command():
    try:
        command = request.json.get('command')
        result = execute_adb_command(command)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=15425)
