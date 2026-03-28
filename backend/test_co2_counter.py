import pytest
from fastapi.testclient import TestClient
from main import app
from co2_counter import co2_counter_db

def test_get_co2_counter_corrected():
    client = TestClient(app)
    response = client.get("/api/co2-counter")
    assert response.status_code == 200
    data = response.json()
    assert "value" in data
    assert data["unit"] == "kg"

def test_post_co2_counter():
    client = TestClient(app)
    # Set a new value
    payload = {"id": 1, "value": 42.5, "unit": "kg", "description": "Test update"}
    response = client.post("/api/co2-counter", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["value"] == 42.5
    assert data["description"] == "Test update"
    # Check that the value is updated in the DB
    assert co2_counter_db["counter"].value == 42.5

def test_post_co2_counter_partial_update():
    client = TestClient(app)
    # Update only the value
    payload = {"id": 1, "value": 100.0, "unit": "kg"}
    response = client.post("/api/co2-counter", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["value"] == 100.0
    # Description should remain unchanged
    assert data["description"] == "Test update"

    # ...existing code...
    assert "value" in data
    assert data["unit"] == "kg"

def test_post_co2_counter():
    client = TestClient(app)
    payload = {"id": 1, "value": 42.5, "unit": "kg", "description": "Test update"}
    response = client.post("/api/co2-counter", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["value"] == 42.5
    assert data["description"] == "Test update"
    assert co2_counter_db["counter"].value == 42.5

def test_post_co2_counter_partial_update():
    client = TestClient(app)
    payload = {"id": 1, "value": 100.0, "unit": "kg"}
    response = client.post("/api/co2-counter", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["value"] == 100.0
    assert data["description"] == "Test update"
