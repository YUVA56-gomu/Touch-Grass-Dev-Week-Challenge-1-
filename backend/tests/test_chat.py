from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_chat_valid_prompt():
    payload = {
        "session_id": "test_session_1",
        "message": "Hello Sprout! Tell me a forest story.",
        "user_context": {
            "friend_name": "Sprout",
            "time_of_day": "afternoon"
        }
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply_text" in data
    assert len(data["reply_text"]) > 0
    assert "expression" in data
    assert isinstance(data["suggested_prompts"], list)
    assert "is_mock" in data


def test_chat_with_history():
    payload = {
        "session_id": "test_session_2",
        "message": "How can I relax right now?",
        "history": [
            {"role": "user", "text": "Hello!"},
            {"role": "assistant", "text": "Hello friend! Welcome to the forest."}
        ],
        "user_context": {
            "friend_name": "Sprout"
        }
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "reply_text" in data


def test_chat_empty_prompt_rejection():
    payload = {
        "message": ""
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 422  # Unprocessable Entity


def test_chat_whitespace_prompt_rejection():
    payload = {
        "message": "     "
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 422


def test_chat_oversized_prompt_rejection():
    payload = {
        "message": "a" * 1001
    }
    response = client.post("/api/v1/ai/chat", json=payload)
    assert response.status_code == 422


def test_chat_cors_headers():
    response = client.options(
        "/api/v1/ai/chat",
        headers={
            "Origin": "http://localhost:5173",
            "Access-Control-Request-Method": "POST",
        }
    )
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
