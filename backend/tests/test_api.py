def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200


def test_create_student(client):
    response = client.post(
        "/api/v1/students/",
        json={
            "name": "Test Student",
            "email": "test@example.com"
        }
    )

    assert response.status_code in (200, 201)
    assert response.json()["success"] is True


def test_duplicate_student_email(client):
    student_data = {
        "name": "Test Student",
        "email": "duplicate@example.com"
    }

    first = client.post(
        "/api/v1/students/",
        json=student_data
    )

    second = client.post(
        "/api/v1/students/",
        json=student_data
    )

    assert first.status_code in (200, 201)
    assert second.status_code == 409


def test_dashboard_student_not_found(client):
    response = client.get(
        "/api/v1/students/99999/dashboard/"
    )

    assert response.status_code == 404

def test_dashboard_error_format(client):
    response = client.get(
        "/api/v1/students/99999/dashboard/"
    )

    assert response.status_code == 404

    data = response.json()
    assert data["success"] is False
    assert data["message"] == "Request failed"


def test_invalid_student_data(client):
    response = client.post(
        "/api/v1/students/",
        json={}
    )

    assert response.status_code == 422

    data = response.json()
    assert data["success"] is False
    assert data["message"] == "Invalid request data"