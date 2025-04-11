# backend/app.py
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # 允许跨域请求

IMAGE_DIR = r"D:\image"


@app.route("/api/hello")
def hello():
    return jsonify(message="Hello from Flask!")

@app.route('/api/delete_image', methods=['POST'])
def delete_image():
    data = request.get_json()
    file_path = data.get('path')

    if not file_path:
        return jsonify({'error': 'Missing file path'}), 400

    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return jsonify({'success': True})
        else:
            return jsonify({'error': 'File does not exist'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route("/images")
def serve_image():
    dir_path = request.args.get("path")
    file_name = request.args.get("file")

    if not dir_path or not file_name:
        return "Missing parameters", 400

    return send_from_directory(dir_path, file_name)


# 列出目录下所有图片，并生成 URL 列表
@app.route("/api/images")
def list_images():
    dir_path = request.args.get("path", "D:/image")
    if not os.path.exists(dir_path):
        return jsonify({"error": "Path does not exist"}), 400

    files = [
        f
        for f in os.listdir(dir_path)
        if os.path.isfile(os.path.join(dir_path, f))
        and f.lower().endswith((".png", ".jpg", ".jpeg", ".gif"))
    ]

    urls = [
        f"http://127.0.0.1:5000/images?path={dir_path}&file={file}" for file in files
    ]
    return jsonify(urls)


@app.route("/api/subdirs", methods=["GET"])
def get_subdirs():
    dir_path = request.args.get("path", "D:/")  # 默认路径为 D:/，可通过参数调整
    if not os.path.exists(dir_path) or not os.path.isdir(dir_path):
        return jsonify({"error": "无效的目录路径"}), 400

    try:
        # 获取指定路径下的一级子目录（不递归）
        subdirs = [
            {"id": os.path.join(dir_path, name), "label": name}
            for name in os.listdir(dir_path)
            if os.path.isdir(os.path.join(dir_path, name))
        ]
        return jsonify({"path": dir_path, "subdirectories": subdirs})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
