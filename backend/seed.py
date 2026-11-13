"""Seed the MediLink SQLite database from hospitals.json."""

import json
import os
import sqlite3

import models

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, "data", "hospitals.json")


def load_json_hospitals() -> list[dict]:
    """Load hospital records from the JSON seed file."""
    with open(JSON_PATH, encoding="utf-8") as file:
        return json.load(file)


def seed_database(force: bool = False) -> int:
    """
    Populate hospitals table from JSON.
    If force=True, clears existing rows before seeding.
    Returns number of hospitals inserted.
    """
    models.init_db()
    hospitals = load_json_hospitals()

    with models.get_db() as conn:
        count = conn.execute("SELECT COUNT(*) FROM hospitals").fetchone()[0]
        if count > 0 and not force:
            print(f"Database already has {count} hospitals. Use force=True to re-seed.")
            return 0

        if force:
            conn.execute("DELETE FROM hospitals")

        for hospital in hospitals:
            conn.execute(
                """
                INSERT INTO hospitals (
                    id, hospital_name, city, specialization, available_beds,
                    emergency_service, rating, contact_number,
                    latitude, longitude, timings
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    hospital["id"],
                    hospital["hospital_name"],
                    hospital["city"],
                    hospital["specialization"],
                    hospital["available_beds"],
                    1 if hospital["emergency_service"] else 0,
                    hospital["rating"],
                    hospital["contact_number"],
                    hospital["latitude"],
                    hospital["longitude"],
                    hospital["timings"],
                ),
            )

    print(f"Seeded {len(hospitals)} hospitals into {models.DB_PATH}")
    return len(hospitals)


if __name__ == "__main__":
    import sys

    force_seed = "--force" in sys.argv
    seed_database(force=force_seed)
