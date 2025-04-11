# backend/app.py
from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # 允许跨域请求

IMAGE_DIR = r'D:\image'

@app.route('/api/hello')
def hello():
    return jsonify(message="Hello from Flask!")


# 获取某个子文件夹下的所有图片 URL
@app.route('/api/images')
def list_images():
    folder = request.args.get('folder')
    if not folder:
        return jsonify({"error": "Missing folder parameter"}), 400

    target_dir = os.path.join(BASE_IMAGE_DIR, folder)

    if not os.path.exists(target_dir) or not os.path.isdir(target_dir):
        return jsonify({"error": "Folder not found"}), 404

    # 获取图片文件名列表
    files = [f for f in os.listdir(target_dir)
             if f.lower().endswith(('.png', '.jpg', '.jpeg', '.gif'))]

    # 构造图片 URL
    urls = [f"http://localhost:5000/images/{folder}/{file}" for file in files]

    return jsonify(urls)

@app.route('/api/folder-structure', methods=['GET'])
def folder_structure():
    root = request.args.get('path', 'd:/image')  # 默认读取根目录
    if not os.path.exists(root):
        return jsonify({"error": "路径不存在"}), 400

    structure = []
    try:
        for name in os.listdir(root):
            full_path = os.path.join(root, name)
            item = {
                "id": full_path,
                "label": name,
                "isDir": os.path.isdir(full_path)
            }
            structure.append(item)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify(structure)

# 提供图片访问接口（支持子目录）
@app.route('/images/<path:subpath>/<path:filename>')
def get_image(subpath, filename):
    full_dir = os.path.join(BASE_IMAGE_DIR, subpath)
    return send_from_directory(full_dir, filename)

if __name__ == '__main__':
    app.run(debug=True)
