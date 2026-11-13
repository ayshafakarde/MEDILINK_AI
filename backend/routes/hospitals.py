"""Hospital API routes for MediLink."""

from flask import Blueprint, jsonify, request

import models

hospitals_bp = Blueprint("hospitals", __name__)


def success_response(data, message="Success", status=200):
    """Standard JSON success envelope for mobile-friendly clients."""
    return jsonify({"success": True, "message": message, "data": data, "count": len(data) if isinstance(data, list) else 1}), status


def error_response(message, status=400):
    """Standard JSON error envelope."""
    return jsonify({"success": False, "message": message, "data": None}), status


def parse_bool(value):
    """Parse query string boolean values."""
    if value is None:
        return None
    return value.lower() in ("true", "1", "yes")


def parse_sort_flag():
    """Read sort=rating from query params."""
    sort = request.args.get("sort", "").lower()
    return sort == "rating"


@hospitals_bp.route("/hospitals", methods=["GET"])
def get_all_hospitals():
    """GET /api/hospitals — Return all hospitals."""
    sort_by_rating = parse_sort_flag()
    hospitals = models.get_all_hospitals(sort_by_rating=sort_by_rating)
    return success_response(hospitals, "Hospitals retrieved successfully")


@hospitals_bp.route("/hospital/<int:hospital_id>", methods=["GET"])
def get_hospital(hospital_id):
    """GET /api/hospital/<id> — Return specific hospital details."""
    hospital = models.get_hospital_by_id(hospital_id)
    if not hospital:
        return error_response(f"Hospital with id {hospital_id} not found", 404)
    return jsonify({"success": True, "message": "Hospital found", "data": hospital}), 200


@hospitals_bp.route("/filter", methods=["GET"])
def filter_hospitals():
    """
    GET /api/filter — Filter hospitals by city, specialization,
    emergency_service, min_rating, and min_beds.
    """
    city = request.args.get("city")
    specialization = request.args.get("specialization")
    emergency_service = parse_bool(request.args.get("emergency_service"))
    sort_by_rating = parse_sort_flag()

    min_rating = request.args.get("min_rating") or request.args.get("minimum_rating")
    min_beds = request.args.get("min_beds") or request.args.get("bed_availability")

    try:
        min_rating_val = float(min_rating) if min_rating else None
    except ValueError:
        return error_response("min_rating must be a valid number")

    try:
        min_beds_val = int(min_beds) if min_beds else None
    except ValueError:
        return error_response("min_beds must be a valid integer")

    hospitals = models.filter_hospitals(
        city=city,
        specialization=specialization,
        emergency_service=emergency_service,
        min_rating=min_rating_val,
        min_beds=min_beds_val,
        sort_by_rating=sort_by_rating,
    )
    return success_response(hospitals, "Filtered hospitals retrieved successfully")


@hospitals_bp.route("/emergency", methods=["GET"])
def emergency_hospitals():
    """GET /api/emergency — Return hospitals with emergency_service enabled."""
    sort_by_rating = parse_sort_flag() or True
    hospitals = models.get_emergency_hospitals(sort_by_rating=sort_by_rating)
    return success_response(hospitals, "Emergency hospitals retrieved successfully")


@hospitals_bp.route("/search", methods=["GET"])
def search_hospitals():
    """GET /api/search?name= — Search hospitals by name."""
    name = request.args.get("name", "").strip()
    if not name:
        return error_response("Query parameter 'name' is required")
    hospitals = models.search_hospitals_by_name(name)
    return success_response(hospitals, f"Search results for '{name}'")


@hospitals_bp.route("/nearby", methods=["GET"])
def nearby_hospitals():
    """GET /api/nearby?lat=&lng= — Return nearby hospitals sorted by distance."""
    lat = request.args.get("lat") or request.args.get("latitude")
    lng = request.args.get("lng") or request.args.get("longitude")

    if not lat or not lng:
        return error_response("Query parameters 'lat' and 'lng' are required")

    try:
        latitude = float(lat)
        longitude = float(lng)
    except ValueError:
        return error_response("lat and lng must be valid numbers")

    limit = request.args.get("limit", "10")
    radius = request.args.get("radius")

    try:
        limit_val = max(1, min(int(limit), 50))
    except ValueError:
        return error_response("limit must be a valid integer")

    max_radius = None
    if radius:
        try:
            max_radius = float(radius)
        except ValueError:
            return error_response("radius must be a valid number in kilometers")

    hospitals = models.get_nearby_hospitals(
        latitude, longitude, limit=limit_val, max_radius_km=max_radius
    )
    return success_response(hospitals, "Nearby hospitals retrieved successfully")


@hospitals_bp.route("/hospital", methods=["POST"])
def add_hospital():
    """POST /api/hospital — Add a new hospital."""
    payload = request.get_json(silent=True)
    if not payload:
        return error_response("Invalid or missing JSON body")

    normalized, error = models.validate_hospital_payload(payload)
    if error:
        return error_response(error)

    hospital = models.create_hospital(normalized)
    return jsonify({"success": True, "message": "Hospital created successfully", "data": hospital}), 201


@hospitals_bp.route("/hospital/<int:hospital_id>", methods=["PUT"])
def edit_hospital(hospital_id):
    """PUT /api/hospital/<id> — Update an existing hospital."""
    payload = request.get_json(silent=True)
    if not payload:
        return error_response("Invalid or missing JSON body")

    normalized, error = models.validate_hospital_payload(payload, partial=True)
    if error:
        return error_response(error)

    hospital = models.update_hospital(hospital_id, normalized)
    if not hospital:
        return error_response(f"Hospital with id {hospital_id} not found", 404)

    return jsonify({"success": True, "message": "Hospital updated successfully", "data": hospital}), 200


@hospitals_bp.route("/hospital/<int:hospital_id>", methods=["DELETE"])
def remove_hospital(hospital_id):
    """DELETE /api/hospital/<id> — Delete a hospital."""
    deleted = models.delete_hospital(hospital_id)
    if not deleted:
        return error_response(f"Hospital with id {hospital_id} not found", 404)
    return jsonify({"success": True, "message": "Hospital deleted successfully", "data": None}), 200
