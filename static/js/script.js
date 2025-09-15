const BASE_URL = 'http://127.0.0.1:5050';

// --- LÓGICA DE NAVEGACIÓN (TABS) (Sin cambios) ---
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
        navLinks[0].classList.add('active');
    }
});

// --- LÓGICA MÓDULO 1: SLOGANS (Sin cambios) ---
(() => {
    const botonGenerarSlogan = document.getElementById('btn-crear-slogan');
    if (!botonGenerarSlogan) return;
    const inputNombre = document.getElementById('nombre_negocio');
    const inputActividad = document.getElementById('actividad_negocio');
    const areaResultadosSlogan = document.getElementById('resultados-slogan');
    const listaSlogansUI = document.getElementById('lista-slogans');
    const spinnerSlogan = document.getElementById('spinner-slogan');
    botonGenerarSlogan.addEventListener('click', async () => {
        const nombre = inputNombre.value; const actividad = inputActividad.value;
        if (!nombre || !actividad) { alert('Por favor, llena ambos campos de Slogan.'); return; }
        spinnerSlogan.style.display = 'inline-block'; botonGenerarSlogan.disabled = true;
        listaSlogansUI.innerHTML = ''; areaResultadosSlogan.style.display = 'none';
        try {
            const response = await fetch(`${BASE_URL}/generar-slogans`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nombre: nombre, actividad: actividad }) });
            if (!response.ok) throw new Error(`Error Slogan: ${response.statusText}`);
            const data = await response.json();
            areaResultadosSlogan.style.display = 'block';
            data.slogans.forEach((slogan, index) => {
                const li = document.createElement('li');
                li.textContent = slogan.replace(/^- /, '');
                li.style.animationDelay = `${index * 0.1}s`;
                listaSlogansUI.appendChild(li);
            });
        } catch (error) {
            console.error(error); alert('Ocurrió un error (Slogans).');
        } finally { spinnerSlogan.style.display = 'none'; botonGenerarSlogan.disabled = false; }
    });
})();

// --- LÓGICA MÓDULO 2: GUIONES (Sin cambios) ---
(() => {
    const botonGenerarGuion = document.getElementById('btn-crear-guion');
    if (!botonGenerarGuion) return;
    const inputTemaVideo = document.getElementById('tema_video');
    const areaResultadosGuion = document.getElementById('resultados-guion-area');
    const preResultadoGuion = document.getElementById('resultado-guion');
    const spinnerGuion = document.getElementById('spinner-guion');
    botonGenerarGuion.addEventListener('click', async () => {
        const tema = inputTemaVideo.value;
        if (!tema) { alert('Por favor, describe el tema del video.'); return; }
        spinnerGuion.style.display = 'inline-block'; botonGenerarGuion.disabled = true;
        preResultadoGuion.textContent = ''; areaResultadosGuion.style.display = 'none';
        try {
            const response = await fetch(`${BASE_URL}/generar-guion`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tema: tema }) });
            if (!response.ok) throw new Error(`Error Guion: ${response.statusText}`);
            const data = await response.json();
            areaResultadosGuion.style.display = 'block';
            preResultadoGuion.textContent = data.guion;
        } catch (error) {
            console.error(error); alert('Ocurrió un error (Guion).');
        } finally { spinnerGuion.style.display = 'none'; botonGenerarGuion.disabled = false; }
    });
})();


// --- LÓGICA MÓDULO 3: TRADUCTOR DE TONO (Sin cambios funcionales) ---
(() => {
    const botonesTono = document.querySelectorAll('.btn-tono');
    if (botonesTono.length === 0) return;

    const textareaOriginal = document.getElementById('texto_original');
    const areaResultadosTono = document.getElementById('resultados-tono-area');
    const spinnerTono = document.getElementById('spinner-tono');
    const tarjetasContainer = document.getElementById('tarjetas-tono-container');

    const llamarApiTono = async (texto, tono) => {
        areaResultadosTono.style.display = 'block';
        spinnerTono.style.display = 'block';
        tarjetasContainer.innerHTML = '';
        botonesTono.forEach(b => b.disabled = true);
        try {
            const response = await fetch(`${BASE_URL}/traducir-tono`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto: texto, tono: tono })
            });
            if (!response.ok) throw new Error(`Error Tono: ${response.statusText}`);
            const data = await response.json();
            data.variaciones.forEach((textoVariacion, index) => {
                const card = document.createElement('div');
                card.className = 'card-tono-result';
                card.textContent = textoVariacion;
                card.style.animationDelay = `${index * 0.15}s`;
                tarjetasContainer.appendChild(card);
            });
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error (Tono).');
        } finally {
            spinnerTono.style.display = 'none';
            botonesTono.forEach(b => b.disabled = false);
        }
    };

    botonesTono.forEach(boton => {
        boton.addEventListener('click', () => {
            const texto = textareaOriginal.value; const tono = boton.dataset.tono;
            if (!texto) { alert('Por favor, escribe el texto base primero.'); return; }
            llamarApiTono(texto, tono);
        });
    });
})();

// --- LÓGICA MÓDULO 4: DESCRIPTOR DE FOTO (Sin cambios) ---
(() => {
    const inputFotoProd = document.getElementById('input_foto_producto');
    if (!inputFotoProd) return;
    const previewContainerProd = document.getElementById('preview-container-producto');
    const previewImgProd = document.getElementById('preview-foto-img-producto');
    const botonDescribirProd = document.getElementById('btn-describir-foto');
    const areaResultadoFotoProd = document.getElementById('resultados-foto-area');
    const preResultadoDescProd = document.getElementById('resultado-descripcion');
    const spinnerDescFotoProd = document.getElementById('spinner-foto-desc');
    let imagenEnBase64_Prod = null;
    inputFotoProd.addEventListener('change', (event) => {
        const file = event.target.files[0]; if (!file) { return; }
        const reader = new FileReader();
        reader.onload = (e) => {
            imagenEnBase64_Prod = e.target.result;
            previewImgProd.src = imagenEnBase64_Prod;
            previewContainerProd.style.display = 'block';
            botonDescribirProd.disabled = false;
        };
        reader.readAsDataURL(file);
    });
    botonDescribirProd.addEventListener('click', async () => {
        if (!imagenEnBase64_Prod) { alert('Por favor, selecciona una imagen primero.'); return; }
        areaResultadoFotoProd.style.display = 'block';
        spinnerDescFotoProd.style.display = 'block';
        botonDescribirProd.disabled = true;
        preResultadoDescProd.textContent = '';
        try {
            const response = await fetch(`${BASE_URL}/describir-producto`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imagen: imagenEnBase64_Prod }) });
            if (!response.ok) throw new Error(`Error Describir Foto: ${response.statusText}`);
            const data = await response.json();
            preResultadoDescProd.textContent = data.descripcion;
        } catch (error) {
            console.error(error); alert('Ocurrió un error (Foto Desc).');
        } finally { spinnerDescFotoProd.style.display = 'none'; botonDescribirProd.disabled = false; }
    });
})();

// --- LÓGICA MÓDULO 5: ANALIZADOR DE SITUACIÓN (Sin cambios) ---
(() => {
    const inputFotoSit = document.getElementById('input_foto_situacion');
    if (!inputFotoSit) return;
    const previewContainerSit = document.getElementById('preview-container-situacion');
    const previewImgSit = document.getElementById('preview-foto-img-situacion');
    const botonAnalizarSit = document.getElementById('btn-analizar-situacion');
    const areaResultadoSit = document.getElementById('resultados-situacion-area');
    const preResultadoIdeas = document.getElementById('resultado-ideas');
    const spinnerIdeaFoto = document.getElementById('spinner-idea-foto');
    let imagenEnBase64_Sit = null;
    inputFotoSit.addEventListener('change', (event) => {
        const file = event.target.files[0]; if (!file) { return; }
        const reader = new FileReader();
        reader.onload = (e) => {
            imagenEnBase64_Sit = e.target.result;
            previewImgSit.src = imagenEnBase64_Sit;
            previewContainerSit.style.display = 'block';
            botonAnalizarSit.disabled = false;
        };
        reader.readAsDataURL(file);
    });
    botonAnalizarSit.addEventListener('click', async () => {
        if (!imagenEnBase64_Sit) { alert('Por favor, selecciona una imagen de la situación.'); return; }
        areaResultadoSit.style.display = 'block';
        spinnerIdeaFoto.style.display = 'block';
        botonAnalizarSit.disabled = true;
        preResultadoIdeas.textContent = '';
        try {
            const response = await fetch(`${BASE_URL}/analizar-situacion`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ imagen: imagenEnBase64_Sit }) });
            if (!response.ok) throw new Error(`Error Analizar Situación: ${response.statusText}`);
            const data = await response.json();
            preResultadoIdeas.textContent = data.ideas;
        } catch (error) {
            console.error(error); alert('Ocurrió un error (Foto Ideas).');
        } finally { spinnerIdeaFoto.style.display = 'none'; botonAnalizarSit.disabled = false; }
    });
})(); 