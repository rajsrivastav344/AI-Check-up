from flask import Flask, render_template, request, redirect, url_for, flash, send_file, g
from werkzeug.utils import secure_filename
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = "your_secret_key_here"

# Folder to store uploaded reports
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 2 * 1024 * 1024  # 2 MB limit

# =========================
# Custom Jinja Filters
# =========================
def filesize_filter(value):
    if value is None:
        return "0 B"
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if value < 1024:
            return f"{value:.2f} {unit}"
        value /= 1024
    return f"{value:.2f} PB"

app.jinja_env.filters['filesize'] = filesize_filter

# =========================
# User Context
# =========================
# Example: dummy user for testing
@app.before_request
def load_user():
    g.user = {"id": 1, "username": "Raj"}  # Replace with real user logic
    # This allows templates to access `user` as `g.user`
    
@app.context_processor
def inject_user():
    return dict(user=g.user)

# =========================
# Routes
# =========================
@app.route('/')
def home():
    return render_template('home.html')

@app.route('/predict')
def predict():
    return render_template('predict.html')

@app.route('/ai_predict')
def ai_predict():
    return render_template('ai_predict.html')

@app.route('/chatbot')
def chatbot_page():
    history = []  # load chat history here if needed
    return render_template('chatbot.html', history=history)

@app.route('/dashboard')
def dashboard():
    # Example: Load uploaded reports from folder
    reports = []
    for fname in os.listdir(app.config['UPLOAD_FOLDER']):
        fpath = os.path.join(app.config['UPLOAD_FOLDER'], fname)
        reports.append({
            "id": fname,
            "original_name": fname,
            "size": os.path.getsize(fpath),
            "uploaded_at": datetime.fromtimestamp(os.path.getmtime(fpath))
        })
    return render_template('dashboard.html', reports=reports)

# =========================
# Upload Route
# =========================
@app.route('/upload', methods=['POST'])
def upload():
    file = request.files.get('report')
    if not file:
        flash("No file selected", "danger")
        return redirect(url_for('dashboard'))

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(filepath)
    flash(f"Uploaded {filename} successfully!", "success")
    return redirect(url_for('dashboard'))

# =========================
# Download Route
# =========================
@app.route('/download/<report_id>')
def download(report_id):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], report_id)
    if os.path.exists(filepath):
        return send_file(filepath, as_attachment=True)
    flash("File not found", "danger")
    return redirect(url_for('dashboard'))

# =========================
# Delete Route
# =========================
@app.route('/delete/<report_id>', methods=['POST'])
def delete_file(report_id):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], report_id)
    if os.path.exists(filepath):
        os.remove(filepath)
        flash(f"Deleted {report_id} successfully!", "success")
    else:
        flash("File not found", "danger")
    return redirect(url_for('dashboard'))

# =========================
# Chat Clear Endpoint
# =========================
@app.route('/clear_chat')
def clear_chat():
    # Implement your logic to clear chat history
    flash("Chat cleared!", "success")
    return redirect(url_for('chatbot_page'))

# =========================
# Run Server
# =========================
if __name__ == '__main__':
    app.run(debug=True)
