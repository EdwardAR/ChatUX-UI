# Chat Azure OpenAI

Interfaz web local conectada al mismo despliegue usado en `ejm.ipynb`.

## Configuración

1. Instala las dependencias:

   ```powershell
   python -m pip install -r requirements.txt
   ```

2. Verifica que `.env` tenga estas variables:

   ```text
   AZURE_OPENAI_ENDPOINT=...
   AZURE_OPENAI_API_KEY=...
   AZURE_OPENAI_DEPLOYMENT=...
   ```

3. Inicia el servidor:

   ```powershell
   python app.py
   ```

4. Abre `http://127.0.0.1:5000`.

La clave nunca se envía al navegador; el servidor procesa las consultas y conserva los últimos 20 mensajes de la conversación.
