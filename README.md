# Proyecto Alma Local

Este proyecto es una aplicación web Flask que proporciona un conjunto de herramientas de marketing y gestión para pequeñas empresas, utilizando inteligencia artificial para generar contenido y análisis.

## Requisitos

- Python 3.9 o superior
- `pip` para instalar dependencias

## Instalación

1.  **Clona el repositorio:**
    ```bash
    git clone <URL-del-repositorio>
    cd proyecto-vercion-final
    ```

2.  **Crea y activa un entorno virtual:**
    - En macOS/Linux:
      ```bash
      python3 -m venv .venv
      source .venv/bin/activate
      ```
    - En Windows:
      ```bash
      python -m venv .venv
      .venv\Scripts\activate
      ```

3.  **Instala las dependencias:**
    ```bash
    pip install -r requirements.txt
    ```

## Ejecución de la Aplicación

Este proyecto contiene dos archivos de servidor diferentes:

### Opción 1: `app.py` (Conexión a Google Cloud Vertex AI)

Este servidor se conecta directamente a la API de Vertex AI de Google Cloud para procesar las solicitudes.

1.  **Configura tus credenciales de Google Cloud:**
    - Asegúrate de tener tu archivo de credenciales JSON en la raíz del proyecto.
    - El archivo `app.py` espera que se llame `alma-local-471815-b0dd89785e7a.json`. Si tu archivo tiene otro nombre, actualiza la línea correspondiente en `app.py`.

2.  **Ejecuta el servidor:**
    ```bash
    python app.py
    ```
    La aplicación estará disponible en `http://127.0.0.1:5000`.

### Opción 2: `app1.py` (Conexión a un Servidor de API Local)

Este servidor actúa como un intermediario, reenviando las solicitudes a una API que tú mismo has desarrollado y alojado en otro lugar (por ejemplo, en un servidor en casa).

1.  **Establece la variable de entorno:**
    - Debes definir la variable de entorno `API_URL` con la URL base de tu servidor de API local.
    - En macOS/Linux:
      ```bash
      export API_URL="http://tu-servidor-local:8080/api"
      ```
    - En Windows (Command Prompt):
      ```bash
      set API_URL="http://tu-servidor-local:8080/api"
      ```
    - En Windows (PowerShell):
      ```bash
      $env:API_URL="http://tu-servidor-local:8080/api"
      ```
    > **Nota:** `app1.py` se ejecutará en el puerto 5001 para evitar conflictos si `app.py` también está en ejecución.

2.  **Ejecuta el servidor:**
    ```bash
    python app1.py
    ```
    La aplicación estará disponible en `http://127.0.0.1:5001`.
