import os

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, request
from openai import OpenAI

load_dotenv()

endpoint = os.getenv("AZURE_OPENAI_ENDPOINT")
api_key = os.getenv("AZURE_OPENAI_API_KEY")
deployment_name = os.getenv("AZURE_OPENAI_DEPLOYMENT")

app = Flask(__name__)


def get_client():
    missing = [
        name
        for name, value in (
            ("AZURE_OPENAI_ENDPOINT", endpoint),
            ("AZURE_OPENAI_API_KEY", api_key),
            ("AZURE_OPENAI_DEPLOYMENT", deployment_name),
        )
        if not value
    ]
    if missing:
        raise RuntimeError(f"Faltan variables de entorno: {', '.join(missing)}")

    return OpenAI(base_url=endpoint, api_key=api_key)


def build_input(messages):
    if not isinstance(messages, list) or not messages:
        raise ValueError("Envía al menos un mensaje.")

    clean_messages = []
    for message in messages[-20:]:
        if not isinstance(message, dict):
            continue
        role = message.get("role")
        content = message.get("content")
        if role in {"user", "assistant"} and isinstance(content, str) and content.strip():
            clean_messages.append({"role": role, "content": content.strip()})

    if not clean_messages or clean_messages[-1]["role"] != "user":
        raise ValueError("El último mensaje debe ser del usuario.")

    return clean_messages


@app.get("/")
def index():
    return render_template("index.html")


@app.post("/api/chat")
def chat():
    try:
        payload = request.get_json(silent=True) or {}
        messages = build_input(payload.get("messages"))
        response = get_client().responses.create(
            model=deployment_name,
            input=messages,
        )
        return jsonify({"reply": response.output_text})
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    except Exception:
        app.logger.exception("Error al consultar Azure OpenAI")
        return jsonify({"error": "No se pudo completar la consulta. Revisa la configuración del servidor."}), 500


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
