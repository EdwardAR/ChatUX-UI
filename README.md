# Chat Azure OpenAI

Interfaz web local conectada al mismo despliegue usado en `ejm.ipynb`.

<img width="1920" height="1020" alt="image" src="https://github.com/user-attachments/assets/efebfc9f-0efa-4ac7-a6e3-1d605e417ef9" />


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
