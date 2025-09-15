const BASE_URL = 'https://e042f5a3e640.ngrok-free.app';

// --- LÓGICA DE NAVEGACIÓN (TABS) ---
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    const modules = document.querySelectorAll('.tool-module');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;

            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            modules.forEach(mod => {
                mod.classList.remove('active-module');
                mod.style.display = 'none';
            });
            const targetModule = document.getElementById(targetId);
            if (targetModule) {
                targetModule.style.display = 'block';
                targetModule.classList.add('active-module');
            }
        });
    });

    const activeModule = document.querySelector('.tool-module.active-module');
    if (!activeModule && modules.length > 0) {
        modules[0].style.display = 'block';
        modules[0].classList.add('active-module');
        if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
        }
    }

    // Set initial status for all modules
    modules.forEach(module => {
        displayStatusMessage(module, 'initial', 'Visualizador de estado');
    });
});

/**
 * Performs a fetch request with a specified timeout.
 * @param {string} resource The resource to fetch.
 * @param {object} options The options for the fetch request.
 * @param {number} [timeout=30000] The timeout in milliseconds.
 * @returns {Promise<Response>} A promise that resolves with the response.
 */
function fetchWithTimeout(resource, options = {}, timeout = 30000) {
    const controller = new AbortController();
    const { signal } = controller;

    const timeoutPromise = new Promise((_, reject) => {
        const timer = setTimeout(() => {
            controller.abort();
            reject(new Error('timeout'));
        }, timeout);
    });

    const fetchPromise = fetch(resource, { ...options, signal });

    return Promise.race([fetchPromise, timeoutPromise]).finally(() => {
        clearTimeout(timeoutPromise.timer);
    });
}


function displayStatusMessage(moduleContainer, type, message, clear = false) {
    if (!moduleContainer) return;
    let statusBox = moduleContainer.querySelector('.status-message');
    if (!statusBox) {
        statusBox = document.createElement('div');
        statusBox.className = 'status-message';
        const resultsArea = moduleContainer.querySelector('.resultados-area');
        if (resultsArea) {
            resultsArea.before(statusBox);
        } else {
            const main = moduleContainer.querySelector('main');
            if (main) {
                main.appendChild(statusBox);
            }
        }
    }

    if (clear) {
        statusBox.style.display = 'none';
        statusBox.textContent = '';
        return;
    }

    statusBox.textContent = message;
    statusBox.className = `status-message ${type}`;
}


// --- LÓGICA MÓDULO 1: SLOGANS ---
(() => {
    const moduleContainer = document.getElementById('module-slogans');
    if (!moduleContainer) return;
    const botonGenerarSlogan = moduleContainer.querySelector('#btn-crear-slogan');
    const inputNombre = moduleContainer.querySelector('#nombre_negocio');
    const inputActividad = moduleContainer.querySelector('#actividad_negocio');
    const areaResultadosSlogan = moduleContainer.querySelector('#resultados-slogan');
    const listaSlogansUI = moduleContainer.querySelector('#lista-slogans');
    const spinnerSlogan = moduleContainer.querySelector('#spinner-slogan');

    botonGenerarSlogan.addEventListener('click', async () => {
        const nombre = inputNombre.value;
        const actividad = inputActividad.value;
        if (!nombre || !actividad) {
            alert('Por favor, llena ambos campos de Slogan.');
            return;
        }

        displayStatusMessage(moduleContainer, 'processing', 'Procesando tu solicitud...');
        spinnerSlogan.style.display = 'inline-block';
        botonGenerarSlogan.disabled = true;
        listaSlogansUI.innerHTML = '';

        try {
            const response = await fetchWithTimeout(`${BASE_URL}/generar-slogans`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, actividad })
            });

            if (!response.ok) throw new Error('api_error');

            const data = await response.json();
            areaResultadosSlogan.style.display = 'block';
            const title = document.createElement('p');
            title.textContent = 'Aquí tienes 5 opciones para tu eslogan ideal:';
            listaSlogansUI.appendChild(title);

            data.slogans.forEach((slogan, index) => {
                const li = document.createElement('li');
                li.textContent = slogan.replace(/^- /, '');
                li.style.animationDelay = `${index * 0.1}s`;
                li.style.marginLeft = '10px';
                listaSlogansUI.appendChild(li);
            });
            displayStatusMessage(moduleContainer, 'success', 'Completado');
        } catch (error) {
            if (error.message === 'api_error') {
                displayStatusMessage(moduleContainer, 'api-disabled', 'Servicio no disponible. Contacta al administrador.');
            } else if (error.message === 'timeout') {
                displayStatusMessage(moduleContainer, 'unstable-network', 'Red inestable. La respuesta tardó demasiado.');
            } else {
                if (!navigator.onLine) {
                    displayStatusMessage(moduleContainer, 'no-internet', 'Error de conexión. Revisa tu acceso a internet.');
                } else {
                    displayStatusMessage(moduleContainer, 'unstable-network', 'Error de red. Puede que sea inestable.');
                }
            }
            console.error(error);
        } finally {
            spinnerSlogan.style.display = 'none';
            botonGenerarSlogan.disabled = false;
        }
    });
})();

// --- LÓGICA MÓDULO 2: GUIONES ---
(() => {
    const moduleContainer = document.getElementById('module-reels');
    if (!moduleContainer) return;
    const botonGenerarGuion = moduleContainer.querySelector('#btn-crear-guion');
    const inputTemaVideo = moduleContainer.querySelector('#tema_video');
    const areaResultadosGuion = moduleContainer.querySelector('#resultados-guion-area');
    const preResultadoGuion = moduleContainer.querySelector('#resultado-guion');
    const spinnerGuion = moduleContainer.querySelector('#spinner-guion');

    botonGenerarGuion.addEventListener('click', async () => {
        const tema = inputTemaVideo.value;
        if (!tema) {
            alert('Por favor, describe el tema del video.');
            return;
        }

        displayStatusMessage(moduleContainer, 'processing', 'Procesando tu solicitud...');
        spinnerGuion.style.display = 'inline-block';
        botonGenerarGuion.disabled = true;
        preResultadoGuion.textContent = '';

        try {
            const response = await fetchWithTimeout(`${BASE_URL}/generar-guion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tema: `Crea un guion para un video corto (estilo Reel o TikTok) sobre: '${tema}'. El guion debe ser dinámico, atractivo y estar estructurado en escenas, sugiriendo qué mostrar en cámara y qué texto o diálogo usar.` })
            });

            if (!response.ok) throw new Error('api_error');

            const data = await response.json();
            areaResultadosGuion.style.display = 'block';
            preResultadoGuion.textContent = data.guion;
            document.getElementById('script-texto-wrapper').style.display = 'block';
            displayStatusMessage(moduleContainer, 'success', 'Completado');
        } catch (error) {
            if (error.message === 'api_error') {
                displayStatusMessage(moduleContainer, 'api-disabled', 'Servicio no disponible. Contacta al administrador.');
            } else if (error.message === 'timeout') {
                displayStatusMessage(moduleContainer, 'unstable-network', 'Red inestable. La respuesta tardó demasiado.');
            } else {
                if (!navigator.onLine) {
                    displayStatusMessage(moduleContainer, 'no-internet', 'Error de conexión. Revisa tu acceso a internet.');
                } else {
                    displayStatusMessage(moduleContainer, 'unstable-network', 'Error de red. Puede que sea inestable.');
                }
            }
            console.error(error);
        } finally {
            spinnerGuion.style.display = 'none';
            botonGenerarGuion.disabled = false;
        }
    });
})();


// --- LÓGICA MÓDULO 3: TRADUCTOR DE TONO ---
(() => {
    const moduleContainer = document.getElementById('module-tono');
    if (!moduleContainer) return;
    const botonesTono = moduleContainer.querySelectorAll('.btn-tono');
    const textareaOriginal = moduleContainer.querySelector('#texto_original');
    const areaResultadosTono = moduleContainer.querySelector('#resultados-tono-area');
    const spinnerTono = moduleContainer.querySelector('#spinner-tono');
    const tarjetasContainer = moduleContainer.querySelector('#tarjetas-tono-container');

    const llamarApiTono = async (texto, tono) => {
        displayStatusMessage(moduleContainer, 'processing', 'Procesando tu solicitud...');
        areaResultadosTono.style.display = 'block';
        spinnerTono.style.display = 'block';
        tarjetasContainer.innerHTML = '';
        botonesTono.forEach(b => b.disabled = true);

        try {
            const response = await fetchWithTimeout(`${BASE_URL}/traducir-tono`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto, tono })
            });

            if (!response.ok) throw new Error('api_error');

            const data = await response.json();
            data.variaciones.forEach((textoVariacion, index) => {
                const card = document.createElement('div');
                card.className = 'card-tono-result';
                card.textContent = textoVariacion;
                card.style.animationDelay = `${index * 0.15}s`;
                tarjetasContainer.appendChild(card);
            });
            displayStatusMessage(moduleContainer, 'success', 'Completado');
        } catch (error) {
            if (error.message === 'api_error') {
                displayStatusMessage(moduleContainer, 'api-disabled', 'Servicio no disponible. Contacta al administrador.');
            } else if (error.message === 'timeout') {
                displayStatusMessage(moduleContainer, 'unstable-network', 'Red inestable. La respuesta tardó demasiado.');
            } else {
                if (!navigator.onLine) {
                    displayStatusMessage(moduleContainer, 'no-internet', 'Error de conexión. Revisa tu acceso a internet.');
                } else {
                    displayStatusMessage(moduleContainer, 'unstable-network', 'Error de red. Puede que sea inestable.');
                }
            }
            console.error(error);
        } finally {
            spinnerTono.style.display = 'none';
            botonesTono.forEach(b => b.disabled = false);
        }
    };

    botonesTono.forEach(boton => {
        boton.addEventListener('click', () => {
            const texto = textareaOriginal.value;
            const tono = boton.dataset.tono;
            if (!texto) {
                alert('Por favor, escribe el texto base primero.');
                return;
            }
            llamarApiTono(texto, tono);
        });
    });
})();

// --- LÓGICA MÓDULO 4: DESCRIPTOR DE FOTO ---
(() => {
    const moduleContainer = document.getElementById('module-producto');
    if (!moduleContainer) return;
    const inputFotoProd = moduleContainer.querySelector('#input_foto_producto');
    const previewContainerProd = moduleContainer.querySelector('#preview-container-producto');
    const previewImgProd = moduleContainer.querySelector('#preview-foto-img-producto');
    const botonDescribirProd = moduleContainer.querySelector('#btn-describir-foto');
    const areaResultadoFotoProd = moduleContainer.querySelector('#resultados-foto-area');
    const preResultadoDescProd = moduleContainer.querySelector('#resultado-descripcion');
    const spinnerDescFotoProd = moduleContainer.querySelector('#spinner-foto-desc');
    let imagenEnBase64_Prod = null;

    inputFotoProd.addEventListener('change', (event) => {
        const file = event.target.files[0]; if (!file) { return; }
        const reader = new FileReader();
        reader.onload = (e) => {
            imagenEnBase64_Prod = e.target.result;
            previewImgProd.src = imagenEnBase64_Prod;
            previewContainerProd.style.display = 'flex';
            botonDescribirProd.disabled = false;
        };
        reader.readAsDataURL(file);
    });

    botonDescribirProd.addEventListener('click', async () => {
        if (!imagenEnBase64_Prod) {
            alert('Por favor, selecciona una imagen primero.');
            return;
        }
        displayStatusMessage(moduleContainer, 'processing', 'Procesando tu solicitud...');
        preResultadoDescProd.textContent = '';
        spinnerDescFotoProd.style.display = 'block';
        botonDescribirProd.disabled = true;

        try {
            const response = await fetchWithTimeout(`${BASE_URL}/describir-producto`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imagen: imagenEnBase64_Prod })
            });
            if (!response.ok) throw new Error('api_error');
            const data = await response.json();
            areaResultadoFotoProd.style.display = 'block';
            preResultadoDescProd.textContent = data.descripcion;
            displayStatusMessage(moduleContainer, 'success', 'Completado');
        } catch (error) {
            if (error.message === 'api_error') {
                displayStatusMessage(moduleContainer, 'api-disabled', 'Servicio no disponible. Contacta al administrador.');
            } else if (error.message === 'timeout') {
                displayStatusMessage(moduleContainer, 'unstable-network', 'Red inestable. La respuesta tardó demasiado.');
            } else {
                if (!navigator.onLine) {
                    displayStatusMessage(moduleContainer, 'no-internet', 'Error de conexión. Revisa tu acceso a internet.');
                } else {
                    displayStatusMessage(moduleContainer, 'unstable-network', 'Error de red. Puede que sea inestable.');
                }
            }
            console.error(error);
        } finally {
            spinnerDescFotoProd.style.display = 'none';
            botonDescribirProd.disabled = false;
        }
    });
})();

// --- LÓGICA MÓDULO 5: ANALIZADOR DE SITUACIÓN ---
(() => {
    const moduleContainer = document.getElementById('module-ideas');
    if (!moduleContainer) return;
    const inputFotoSit = moduleContainer.querySelector('#input_foto_situacion');
    const previewContainerSit = moduleContainer.querySelector('#preview-container-situacion');
    const previewImgSit = moduleContainer.querySelector('#preview-foto-img-situacion');
    const botonAnalizarSit = moduleContainer.querySelector('#btn-analizar-situacion');
    const areaResultadoSit = moduleContainer.querySelector('#resultados-situacion-area');
    const preResultadoIdeas = moduleContainer.querySelector('#resultado-ideas');
    const spinnerIdeaFoto = moduleContainer.querySelector('#spinner-idea-foto');
    let imagenEnBase64_Sit = null;

    inputFotoSit.addEventListener('change', (event) => {
        const file = event.target.files[0]; if (!file) { return; }
        const reader = new FileReader();
        reader.onload = (e) => {
            imagenEnBase64_Sit = e.target.result;
            previewImgSit.src = imagenEnBase64_Sit;
            previewContainerSit.style.display = 'flex';
            botonAnalizarSit.disabled = false;
        };
        reader.readAsDataURL(file);
    });

    botonAnalizarSit.addEventListener('click', async () => {
        if (!imagenEnBase64_Sit) {
            alert('Por favor, selecciona una imagen de la situación.');
            return;
        }
        displayStatusMessage(moduleContainer, 'processing', 'Procesando tu solicitud...');
        preResultadoIdeas.textContent = '';
        spinnerIdeaFoto.style.display = 'block';
        botonAnalizarSit.disabled = true;

        try {
            const response = await fetchWithTimeout(`${BASE_URL}/analizar-situacion`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ imagen: imagenEnBase64_Sit })
            });
            if (!response.ok) throw new Error('api_error');
            const data = await response.json();
            areaResultadoSit.style.display = 'block';
            preResultadoIdeas.textContent = data.ideas;
            displayStatusMessage(moduleContainer, 'success', 'Completado');
        } catch (error) {
            if (error.message === 'api_error') {
                displayStatusMessage(moduleContainer, 'api-disabled', 'Servicio no disponible. Contacta al administrador.');
            } else if (error.message === 'timeout') {
                displayStatusMessage(moduleContainer, 'unstable-network', 'Red inestable. La respuesta tardó demasiado.');
            } else {
                if (!navigator.onLine) {
                    displayStatusMessage(moduleContainer, 'no-internet', 'Error de conexión. Revisa tu acceso a internet.');
                } else {
                    displayStatusMessage(moduleContainer, 'unstable-network', 'Error de red. Puede que sea inestable.');
                }
            }
            console.error(error);
        } finally {
            spinnerIdeaFoto.style.display = 'none';
            botonAnalizarSit.disabled = false;
        }
    });
})(); 

// --- LÓGICA DE LOGOUT ---
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            window.location.href = '../pages/login.html';
        }
    });
}
