const BASE_URL = 'https://422f339b97ce.ngrok-free.app';

window.addEventListener('DOMContentLoaded', () => {
    // --- LÓGICA DE NAVEGACIÓN (TABS) ---
    const navLinks = document.querySelectorAll('.nav-link');
    const modules = document.querySelectorAll('.tool-module');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.dataset.target;

            // Actualiza el link activo
            navLinks.forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');

            // Muestra el módulo correcto
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

    // Activa el primer módulo por defecto
    const activeModule = document.querySelector('.tool-module.active-module');
    if (!activeModule && modules.length > 0) {
        modules[0].style.display = 'block';
        modules[0].classList.add('active-module');
        if (navLinks.length > 0) {
            navLinks[0].classList.add('active');
        }
    }
});

// --- LÓGICA MÓDULO 1: SLOGANS ---
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
        } catch (error) { console.error(error); alert('Ocurrió un error (Slogans).');
        } finally { spinnerSlogan.style.display = 'none'; botonGenerarSlogan.disabled = false; }
    });
})();

// ... (El resto del código de los módulos permanece igual)
