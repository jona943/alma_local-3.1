# Proyecto Alma Local

Este proyecto es una aplicación web estática diseñada para funcionar como un conjunto de herramientas de marketing y gestión para pequeñas empresas. La interfaz está construida con HTML, CSS y JavaScript, y se conecta a una API externa para la funcionalidad de inteligencia artificial.

## Arquitectura

La arquitectura de este proyecto es simple y desacoplada:

-   **Frontend:** Una aplicación de una sola página (SPA) construida con HTML, CSS y JavaScript.
    -   `index.html`: Página de inicio.
    -   `pages/login.html`: Página de inicio de sesión.
    -   `pages/herramientas.html`: Página principal de herramientas.
    -   `static/`: Contiene todos los recursos estáticos (CSS, JavaScript, imágenes).
-   **Backend (API Externa):** El frontend se comunica con una API externa que tú debes proporcionar. Esta API es responsable de toda la lógica de negocio y la integración con servicios de inteligencia artificial.

## Configuración

1.  **Clona el repositorio:**
    ```bash
    git clone <URL-del-repositorio>
    cd alma_local-3.1
    ```

2.  **Configura la URL de la API:**
    Dentro del archivo `static/js/script.js`, debes actualizar la variable que contiene la URL de tu API para que el frontend pueda conectarse correctamente. Busca una variable de configuración de API y modifícala con tu propia URL.

    ```javascript
    // Ejemplo en static/js/script.js
    const apiUrl = 'URL_DE_TU_API_AQUI';
    ```

3.  **Ejecuta la aplicación:**
    Abre el archivo `index.html` en tu navegador web para empezar a usar la aplicación. No se requiere un servidor de backend local.