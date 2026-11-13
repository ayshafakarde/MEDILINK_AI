"""Database models and reusable data-access helpers for MediLink."""

import math
import os
import sqlite3
from contextlib import contextmanager
from typing import Any

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "hospitals.db")

HOSPITAL_FIELDS = (
    "id",
    "hospital_name",
    "city",
    "specialization",
    "available_beds",
    "emergency_service",
    "rating",
    "contact_number",
    "latitude",
    "longitude",
    "timings",
)

REQUIRED_CREATE_FIELDS = (
    "hospital_name",
    "city",
    "specialization",
    "available_beds",
    "emergency_service",
    "rating",
    "contact_number",
    "latitude",
    "longitude",
    "timings",
)


@contextmanager
def get_db():
    """Yield a SQLite connection with row factory enabled."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db():
    """Create hospitals table if it does not exist."""
    with get_db() as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS hospitals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                hospital_name TEXT NOT NULL,
                city TEXT NOT NULL,
                specialization TEXT NOT NULL,
                available_beds INTEGER NOT NULL DEFAULT 0,
                emergency_service INTEGER NOT NULL DEFAULT 0,
                rating REAL NOT NULL DEFAULT 0,
                contact_number TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                timings TEXT NOT NULL
            )
            """
        )


def row_to_dict(row: sqlite3.Row) -> dict[str, Any]:
    """Convert a database row to a JSON-friendly hospital dict."""
    data = dict(row)
    data["emergency_service"] = bool(data["emergency_service"])
    return data


def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate great-circle distance between two coordinates in kilometers."""
    radius_km = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    d_phi = math.radians(lat2 - lat1)
    d_lambda = math.radians(lon2 - lon1)

    a = (
        math.sin(d_phi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(d_lambda / 2) ** 2
    )
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(radius_km * c, 2)


def get_all_hospitals(sort_by_rating: bool = False) -> list[dict[str, Any]]:
    """Return all hospitals, optionally sorted by rating descending."""
    order = "ORDER BY rating DESC" if sort_by_rating else "ORDER BY id ASC"
    with get_db() as conn:
        rows = conn.execute(f"SELECT * FROM hospitals {order}").fetchall()
    return [row_to_dict(row) for row in rows]


def get_hospital_by_id(hospital_id: int) -> dict[str, Any] | None:
    """Return a single hospital by id or None if not found."""
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM hospitals WHERE id = ?", (hospital_id,)
        ).fetchone()
    return row_to_dict(row) if row else None


def filter_hospitals(
    city: str | None = None,
    specialization: str | None = None,
    emergency_service: bool | None = None,
    min_rating: float | None = None,
    min_beds: int | None = None,
    sort_by_rating: bool = False,
) -> list[dict[str, Any]]:
    """Apply multiple optional filters and return matching hospitals."""
    query = "SELECT * FROM hospitals WHERE 1=1"
    params: list[Any] = []

    if city:
        query += " AND LOWER(city) = LOWER(?)"
        params.append(city.strip())

    if specialization:
        query += " AND LOWER(specialization) LIKE LOWER(?)"
        params.append(f"%{specialization.strip()}%")

    if emergency_service is not None:
        query += " AND emergency_service = ?"
        params.append(1 if emergency_service else 0)

    if min_rating is not None:
        query += " AND rating >= ?"
        params.append(min_rating)

    if min_beds is not None:
        query += " AND available_beds >= ?"
        params.append(min_beds)

    query += " ORDER BY rating DESC" if sort_by_rating else " ORDER BY id ASC"

    with get_db() as conn:
        rows = conn.execute(query, params).fetchall()
    return [row_to_dict(row) for row in rows]


def get_emergency_hospitals(sort_by_rating: bool = True) -> list[dict[str, Any]]:
    """Return hospitals that offer emergency services."""
    return filter_hospitals(emergency_service=True, sort_by_rating=sort_by_rating)


def search_hospitals_by_name(name: str) -> list[dict[str, Any]]:
    """Search hospitals by partial name match (case-insensitive)."""
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT * FROM hospitals
            WHERE LOWER(hospital_name) LIKE LOWER(?)
            ORDER BY rating DESC
            """,
            (f"%{name.strip()}%",),
        ).fetchall()
    return [row_to_dict(row) for row in rows]


def get_nearby_hospitals(
    latitude: float,
    longitude: float,
    limit: int = 10,
    max_radius_km: float | None = None,
) -> list[dict[str, Any]]:
    """Return hospitals sorted by distance from the given coordinates."""
    hospitals = get_all_hospitals()
    for hospital in hospitals:
        hospital["distance_km"] = haversine_km(
            latitude, longitude, hospital["latitude"], hospital["longitude"]
        )

    hospitals.sort(key=lambda h: h["distance_km"])

    if max_radius_km is not None:
        hospitals = [h for h in hospitals if h["distance_km"] <= max_radius_km]

    return hospitals[:limit]


def create_hospital(data: dict[str, Any]) -> dict[str, Any]:
    """Insert a new hospital and return the created record."""
    with get_db() as conn:
        cursor = conn.execute(
            """
            INSERT INTO hospitals (
                hospital_name, city, specialization, available_beds,
                emergency_service, rating, contact_number,
                latitude, longitude, timings
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                data["hospital_name"],
                data["city"],
                data["specialization"],
                int(data["available_beds"]),
                1 if data["emergency_service"] else 0,
                float(data["rating"]),
                data["contact_number"],
                float(data["latitude"]),
                float(data["longitude"]),
                data["timings"],
            ),
        )
        new_id = cursor.lastrowid
    return get_hospital_by_id(new_id)  # type: ignore[return-value]


def update_hospital(hospital_id: int, data: dict[str, Any]) -> dict[str, Any] | None:
    """Update an existing hospital. Returns None if hospital does not exist."""
    existing = get_hospital_by_id(hospital_id)
    if not existing:
        return None

    merged = {**existing, **data, "id": hospital_id}

    with get_db() as conn:
        conn.execute(
            """
            UPDATE hospitals SET
                hospital_name = ?,
                city = ?,
                specialization = ?,
                available_beds = ?,
                emergency_service = ?,
                rating = ?,
                contact_number = ?,
                latitude = ?,
                longitude = ?,
                timings = ?
            WHERE id = ?
            """,
            (
                merged["hospital_name"],
                merged["city"],
                merged["specialization"],
                int(merged["available_beds"]),
                1 if merged["emergency_service"] else 0,
                float(merged["rating"]),
                merged["contact_number"],
                float(merged["latitude"]),
                float(merged["longitude"]),
                merged["timings"],
                hospital_id,
            ),
        )
    return get_hospital_by_id(hospital_id)


def delete_hospital(hospital_id: int) -> bool:
    """Delete a hospital by id. Returns True if a row was removed."""
    with get_db() as conn:
        cursor = conn.execute("DELETE FROM hospitals WHERE id = ?", (hospital_id,))
        return cursor.rowcount > 0


def validate_hospital_payload(
    payload: dict[str, Any], partial: bool = False
) -> tuple[dict[str, Any] | None, str | None]:
    """
    Validate and normalize hospital input.
    Returns (normalized_data, error_message).
    """
    if not payload and not partial:
        return None, "Request body is required"

    fields_to_check = REQUIRED_CREATE_FIELDS if not partial else payload.keys()
    normalized: dict[str, Any] = {}

    for field in fields_to_check:
        if field not in payload:
            if not partial:
                return None, f"Missing required field: {field}"
            continue

        value = payload[field]

        if field == "available_beds":
            try:
                beds = int(value)
                if beds < 0:
                    return None, "available_beds must be a non-negative integer"
                normalized[field] = beds
            except (TypeError, ValueError):
                return None, "available_beds must be a valid integer"

        elif field == "emergency_service":
            if isinstance(value, bool):
                normalized[field] = value
            elif isinstance(value, str):
                normalized[field] = value.lower() in ("true", "1", "yes")
            elif isinstance(value, int):
                normalized[field] = bool(value)
            else:
                return None, "emergency_service must be a boolean"

        elif field == "rating":
            try:
                rating = float(value)
                if not 0 <= rating <= 5:
                    return None, "rating must be between 0 and 5"
                normalized[field] = rating
            except (TypeError, ValueError):
                return None, "rating must be a valid number"

        elif field in ("latitude", "longitude"):
            try:
                coord = float(value)
                if field == "latitude" and not -90 <= coord <= 90:
                    return None, "latitude must be between -90 and 90"
                if field == "longitude" and not -180 <= coord <= 180:
                    return None, "longitude must be between -180 and 180"
                normalized[field] = coord
            except (TypeError, ValueError):
                return None, f"{field} must be a valid number"

        elif field in ("hospital_name", "city", "specialization", "contact_number", "timings"):
            if not str(value).strip():
                return None, f"{field} cannot be empty"
            normalized[field] = str(value).strip()

    return normalized, None
