"""
MediLink — Healthcare Emergency Hospital Finder API
Flask application entry point.
"""

import os

from flask import Flask, jsonify
from flask_cors import CORS

import models
from routes.hospitals import hospitals_bp

app = Flask(__name__)

# CORS for React (3000) and Vite (5173) frontends
CORS(
    app,
    resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:5173"]}},
    supports_credentials=True,
)

app.register_blueprint(hospitals_bp, url_prefix="/api")


@app.route("/")
def health_check():
    """Root health check for hackathon demos."""
    return jsonify(
        {
            "success": True,
            "message": "MediLink API is running",
            "version": "1.0.0",
            "endpoints": {
                "hospitals": "GET /api/hospitals",
                "hospital_detail": "GET /api/hospital/<id>",
                "filter": "GET /api/filter",
                "emergency": "GET /api/emergency",
                "search": "GET /api/search?name=",
                "nearby": "GET /api/nearby?lat=&lng=",
                "create": "POST /api/hospital",
                "update": "PUT /api/hospital/<id>",
                "delete": "DELETE /api/hospital/<id>",
            },
        }
    ), 200


@app.errorhandler(404)
def not_found(error):
    return jsonify({"success": False, "message": "Endpoint not found", "data": None}), 404


@app.errorhandler(405)
def method_not_allowed(error):
    return jsonify({"success": False, "message": "Method not allowed", "data": None}), 405


@app.errorhandler(500)
def internal_error(error):
    return jsonify({"success": False, "message": "Internal server error", "data": None}), 500


def create_app():
    """Application factory — initialize DB on startup."""
    models.init_db()
    db_exists = os.path.exists(models.DB_PATH)
    if not db_exists or os.path.getsize(models.DB_PATH) == 0:
        from seed import seed_database

        seed_database()
    return app


if __name__ == "__main__":
    create_app()
    app.run(debug=True, host="0.0.0.0", port=5000)
