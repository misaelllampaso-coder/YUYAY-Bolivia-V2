// ============================================================
// YUYAY BOLIVIA
// ===========================================================

// ============================================================
// 1. REPRODUCTOR PRINCIPAL
// ============================================================
const player = document.getElementById("audioPlayer");
let currentSong = null;
// ============================================================
// 2. MOSTRAR SECCIÓN
// ============================================================
function mostrarSeccion(id) {
    const pantallas=document.querySelectorAll(".pantalla");
    pantallas.forEach(function(pantalla) {
        pantalla.classList.remove("activa");
    });
    const pantalla = document.getElementById(id);
    if (pantalla) {
        pantalla.classList.add("activa");
    }
    const musicMenu =
        document.getElementById("musicMenu");
    if (musicMenu) {
        musicMenu.classList.remove("mostrar");
    }
}
// ============================================================
// 3. MENÚ DE MÚSICA
// ============================================================
function toggleMusicMenu() {
    const menu = document.getElementById("musicMenu");
    if (menu) {
        menu.classList.toggle("mostrar");
    }
}
// ============================================================
// 4. REPRODUCIR MÚSICA
// ============================================================
function playMusic(file) {
    if (!player) {
        return;
    }
    if (
        currentSong === file && !player.paused
    ) {
        player.pause();
        return;
    }
    player.src = file;
    currentSong = file;
    player.play().catch(function(error) {
        console.log(
            "No se pudo reproducir la música:",
            error
        );
    });
}
// ============================================================
// 5. PLAY / PAUSA
// ============================================================
function togglePlay() {
    if (!player) {
        return;
    }
    if (!player.src) {
        alert("Primero selecciona una canción.");
        return;
    }
    if (player.paused) {
        player.play();
    }
    else {
        player.pause();
    }
}
// ============================================================
// 6. SILENCIAR
// ============================================================
function toggleMute() {
    if (!player) {
        return;
    }
    player.muted =
        !player.muted;
}
// ============================================================
// 7. CARGAR MÚSICA DEL USUARIO
// ============================================================
function loadUserMusic() {
    const fileInput=document.getElementById("userMusic");
    if (!fileInput) {
        return;
    }
    const file=fileInput.files[0];
    if (!file) {
        return;
    }
    const musicURL = URL.createObjectURL(file);
    player.src = musicURL;
    currentSong = musicURL;
    player.play().catch(function(error) {
        console.log("No se pudo reproducir la música:",error);
    });
}
// ============================================================
// 8. VENTANAS
// ============================================================
function cerrarVentanas() {
    const ventanas = ["buscar","ajustes","creditos","ayuda","secreto"];
    ventanas.forEach(function(id) {
        const ventana = document.getElementById(id);
        if (ventana) {
            ventana.classList.remove("mostrar");
        }
    });
}
// ============================================================
// BUSCAR
// ============================================================
function abrirBuscar() {
    cerrarVentanas();
    const ventana = document.getElementById("buscar");
    if (!ventana) {
        return;
    }
    ventana.classList.add("mostrar");
    const buscador=document.getElementById("buscador");
    const resultados =document.getElementById("resultadosBusqueda");
    if (buscador) {
        buscador.value = "";
        setTimeout(function() {
            buscador.focus();
        }, 100);
    }
    if (resultados) {
        resultados.innerHTML = "";
    }
}
// ============================================================
// AJUSTES
// ============================================================
function abrirAjustes() {
    cerrarVentanas();
    const ventana =
        document.getElementById("ajustes");
    if (ventana) {
        ventana.classList.add("mostrar");
    }
}
// ============================================================
// CRÉDITOS
// ============================================================
function abrirCreditos() {
    cerrarVentanas();
    const ventana = document.getElementById("creditos");
    if (ventana) {
        ventana.classList.add("mostrar");
    }
}
// ============================================================
// AYUDA
// ============================================================
function abrirAyuda() {
    cerrarVentanas();
    const ventana=document.getElementById("ayuda");
    if (ventana) {
        ventana.classList.add("mostrar");
    }
}
// ============================================================
// AUDIO DE AYUDA
// ============================================================
let audioAyudaActual = null;
function reproducirAyuda(archivo) {
    const audio=document.getElementById("audioAyuda");
    if (!audio) {
        return;
    }
    // Si ya estaba reproduciendo
    // detenemos el audio anterior
    audio.pause();
    audio.currentTime = 0;
    // Cambiar archivo
    audio.src = archivo;
    audioAyudaActual = archivo;
    // Reproducir
    audio.play().catch(function(error) {
        console.log("No se pudo reproducir el audio de ayuda:",error);
    });
}
// ============================================================
// 9. TAMAÑO DEL TEXTO
// ============================================================
function cambiarTexto(tamano) {
    document.body.classList.remove("texto-grande","muy-grande");
    if (tamano === "grande") {
        document.body.classList.add("texto-grande");
    }
    if (tamano === "muy-grande") {
        document.body.classList.add("muy-grande");
    }
}
// ============================================================
// 10. OBTENER CATEGORÍA
// ============================================================
function obtenerCategoria(nombre) {
    const categorias = {
        presidentes:Array.isArray(window.presidentes)? window.presidentes: [],
        departamentos:Array.isArray(window.departamentos)? window.departamentos: [],
        personajes:Array.isArray(window.personajes)? window.personajes: [],
        acontecimientos:Array.isArray(window.acontecimientos)? window.acontecimientos: [],
        culturas:Array.isArray(window.culturas)? window.culturas: [],
        himnos:Array.isArray(window.himnosCanciones)? window.himnosCanciones: []
    };
    return categorias[nombre] || [];
}
//============================================================
//Añadido
//============================================================

/* ============================================================
   BUSCADOR INTELIGENTE
   TOLERA TILDES, ERRORES Y PALABRAS INCOMPLETAS
   ============================================================ */

// 1. Normalizar el texto: quita tildes y diferencias de mayúsculas
function normalizarTexto(texto) {
    return String(texto || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// 2. Medir cuántas letras hay que cambiar para comparar dos palabras
function distanciaPalabras(a, b) {
    const tabla = Array.from(
        { length: a.length + 1 },
        () => []
    );

    for (let i = 0; i <= a.length; i++) {
        tabla[i][0] = i;
    }

    for (let j = 0; j <= b.length; j++) {
        tabla[0][j] = j;
    }

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const costo = a[i - 1] === b[j - 1] ? 0 : 1;

            tabla[i][j] = Math.min(
                tabla[i - 1][j] + 1,
                tabla[i][j - 1] + 1,
                tabla[i - 1][j - 1] + costo
            );
        }
    }

    return tabla[a.length][b.length];
}


function puntuarBusqueda(item, consulta) {
    const busqueda = normalizarTexto(consulta);

    if (!busqueda) return 0;

    const nombre = normalizarTexto(item.nombre || "");
    const palabras = busqueda.split(" ").filter(Boolean);
    const palabrasNombre = nombre.split(" ");

    const informacion = normalizarTexto(
        Object.entries(item)
            .filter(([clave]) => clave !== "audio")
            .map(([, valor]) =>
                typeof valor === "object"
                    ? JSON.stringify(valor)
                    : String(valor ?? "")
            )
            .join(" ")
    );

    // 1. El título exacto siempre tiene máxima prioridad
    if (nombre === busqueda) {
        return 100000;
    }

    // 2. El título empieza con la búsqueda
    if (nombre.startsWith(busqueda)) {
        return 80000;
    }

    // 3. El título contiene la frase completa
    if (nombre.includes(busqueda)) {
        return 60000;
    }

    // 4. Todas las palabras aparecen en el título
    const coincidenciasNombre = palabras.filter(palabra =>
        palabrasNombre.some(nombrePalabra =>
            nombrePalabra.includes(palabra) ||
            (
                palabra.length >= 4 &&
                nombrePalabra.length >= 4 &&
                distanciaPalabras(palabra, nombrePalabra) <=
                    (palabra.length >= 8 ? 2 : 1)
            )
        )
    ).length;

    if (coincidenciasNombre === palabras.length) {
        return 40000 + coincidenciasNombre * 100;
    }

    // 5. Coincidencia de alguna palabra del título
    if (coincidenciasNombre > 0) {
        return 10000 + coincidenciasNombre * 100;
    }

    // 6. La frase aparece en la información adicional
    if (informacion.includes(busqueda)) {
        return 5000;
    }

    // 7. Coincidencias parciales en el contenido
    const palabrasInfo = informacion.split(" ");
    let puntos = 0;

    palabras.forEach(palabra => {
        if (
            palabrasInfo.some(texto =>
                texto.includes(palabra) ||
                (
                    palabra.length >= 4 &&
                    texto.length >= 4 &&
                    distanciaPalabras(palabra, texto) <=
                        (palabra.length >= 8 ? 2 : 1)
                )
            )
        ) {
            puntos += 100;
        }
    });

    return puntos;
}

// 3. Comprobar si una palabra se parece a otra
function palabrasParecidas(busqueda, palabra) {
    if (busqueda === palabra) return true;

    // Aceptar palabras incompletas desde 3 letras
    if (
        busqueda.length >= 3 &&
        palabra.startsWith(busqueda)
    ) {
        return true;
    }

    // Tolerar errores pequeños de escritura
    const limite = busqueda.length >= 8 ? 2 : 1;

    return (
        busqueda.length >= 4 &&
        palabra.length >= 4 &&
        distanciaPalabras(busqueda, palabra) <= limite
    );
}

// 4. Puntuar cada resultado: el nombre tiene prioridad
function puntuarCoincidencia(item, consulta) {
    const busqueda = normalizarTexto(consulta);

    if (!busqueda) return 0;

    const nombre = normalizarTexto(item.nombre || "");
    const palabrasBuscadas = busqueda.split(" ");
    const palabrasNombre = nombre.split(" ");

    let puntos = 0;

    // Coincidencia del nombre completo
    if (nombre.includes(busqueda)) {
        puntos += 1000;
    }

    // Comparar cada palabra con el nombre
    let palabrasEncontradas = 0;

    palabrasBuscadas.forEach(function(busquedaPalabra) {
        const coincidencia = palabrasNombre.some(
            palabra => palabrasParecidas(busquedaPalabra, palabra)
        );

        if (coincidencia) {
            palabrasEncontradas++;
            puntos += 100;
        }
    });

    // Gran prioridad si todas las palabras aparecen en el nombre
    if (palabrasEncontradas === palabrasBuscadas.length) {
        puntos += 1000;
    }

    // Buscar también en biografías y demás información
    const informacion = normalizarTexto(
        JSON.stringify(item)
    );

    if (informacion.includes(busqueda)) {
        puntos += 50;
    } else {
        // Coincidencias aproximadas dentro de los demás datos
        const palabrasInformacion = informacion.split(" ");

        palabrasBuscadas.forEach(function(palabraBuscada) {
            if (
                !palabrasInformacion.some(palabra =>
                    palabrasParecidas(palabraBuscada, palabra)
                )
            ) {
                return;
            }

            puntos += 10;
        });
    }

    return puntos;
}

// ============================================================
// 11. BUSCADOR GENERAL
// ============================================================
function realizarBusqueda() {
    const buscador = document.getElementById("buscador");
    const resultados = document.getElementById("resultadosBusqueda");
    if (!buscador || !resultados) {
        return;
    }
    const texto = buscador.value.toLowerCase().trim();
    resultados.innerHTML = "";
    if (texto === "") {
        return;
    }
    const categorias = [
        {   nombre: "Presidentes de Bolivia",
            seccion: "presidentes",
            datos: obtenerCategoria("presidentes")
        },
        {   nombre: "Departamentos de Bolivia",
            seccion: "departamentos",
            datos: obtenerCategoria("departamentos")
        },
        {   nombre: "Personajes históricos",
            seccion: "personajes",
            datos: obtenerCategoria("personajes")
        },
        {   nombre: "Acontecimientos históricos",
            seccion: "acontecimientos",
            datos: obtenerCategoria("acontecimientos")
        },
        {   nombre: "Culturas de Bolivia",
            seccion: "culturas",
            datos: obtenerCategoria("culturas")
        },
        {   nombre: "Himnos y canciones",
            seccion: "himnos",
            datos: obtenerCategoria("himnos")
        }
    ];
    
let encontrados = [];

categorias.forEach(function(categoria) {
    categoria.datos.forEach(function(item) {
        const puntuacion = puntuarBusqueda(item, texto);

        if (puntuacion > 0) {
            encontrados.push({
                item: item,
                categoria: categoria.nombre,
                seccion: categoria.seccion,
                puntuacion: puntuacion
            });
        }
    });
});

// Mostrar primero las coincidencias más relevantes
encontrados.sort(function(a, b) {
    return b.puntuacion - a.puntuacion;
});

    if (encontrados.length === 0) {
        resultados.innerHTML = `
            <div class="sin-resultados">
                ❌ No se encontraron resultados para:
                <strong>${texto}</strong>
            </div>
        `;
        return;
    }
    encontrados.forEach(function(resultado) {
        const elemento = document.createElement("div");
        elemento.className = "resultado-busqueda";
        const nombre = resultado.item.nombre ||"Sin nombre";
        elemento.innerHTML = `
            <strong>${nombre}</strong>
            <span>📚 ${resultado.categoria}</span>
        `;
        elemento.onclick = function() {
            mostrarSeccion(resultado.seccion);
            cerrarVentanas();
            if (resultado.seccion === "presidentes") {
                mostrarPresidente(resultado.item.nombre);
            }
        };
        resultados.appendChild(elemento);
    });
}
// ============================================================
// 12. FUNCIÓN GENERAL PARA BUSCAR
// ============================================================
function buscarEnCategoria(categoria,inputId,resultadosId,icono,mensaje) {
    const input = document.getElementById(inputId);
    const resultados = document.getElementById(resultadosId);
    if (!input || !resultados) {
        return;
    }
    const texto =  input.value.toLowerCase().trim();
    resultados.innerHTML = "";
    const datos = obtenerCategoria(categoria);
    if (texto === "") {
        resultados.innerHTML = `
            <p class="mensaje-seccion">
                ${icono}
                ${mensaje}
            </p>
        `;
        return;
    }
    const encontrados = datos
    .map(function(item, indice) {
        return {
            item: item,
            indice: indice,
            puntuacion: puntuarBusqueda(item, texto)
        };
    })
    .filter(function(resultado) {
        return resultado.puntuacion > 0;
    })
    .sort(function(a, b) {
        return b.puntuacion - a.puntuacion ||
            a.indice - b.indice;
    })
    .map(function(resultado) {
        return resultado.item;
    });
    if (encontrados.length === 0) {
        resultados.innerHTML = `
            <p class="sin-resultados">
                ❌ No se encontraron resultados.
            </p>
        `;
        return;
    }
    encontrados.forEach(function(item) {
        const tarjeta = document.createElement("div");
        tarjeta.className = "tarjeta-informacion";
        tarjeta.innerHTML = `
            <h2>${icono} ${item.nombre || "Sin nombre"}</h2>
            <p>${item.descripcion || ""}</p>

                ${item.importancia ? `
            <p>
        <strong>⭐ Importancia:</strong>
        ${item.importancia}
    </p>
` : ""}
            ${  item.periodo
                ?
                `
                <p><strong>📅 Período:</strong>${item.periodo}</p>
                `
                :
                ""}
            ${  item.fecha
                ?
                `
                <p><strong>📅 Fecha:</strong>${item.fecha}</p>
                `
                :
                ""
            }
            <button
                onclick="mostrarDetalle(
                    '${categoria}',
                    '${escapeHtml(
                        item.nombre || ""
                    )}'
                )"
            >📖 Ver información</button>
        `;
        resultados.appendChild(tarjeta);
    });
}
// ============================================================
// 13. BUSCADORES INDIVIDUALES
// ============================================================
function buscarPresidentes() {
    buscarEnCategoria("presidentes","buscarPresidentes","resultadosPresidentes","👑",
    "Escribe el nombre de un presidente para comenzar.");
}
function buscarDepartamentos() {
    buscarEnCategoria("departamentos","buscarDepartamentos","resultadosDepartamentos","🗺️","Escribe el nombre de un departamento para comenzar.");
}
function buscarPersonajes() {
    buscarEnCategoria("personajes","buscarPersonajes","resultadosPersonajes","👤","Escribe el nombre de un personaje para comenzar.");
}
function buscarAcontecimientos() {
    buscarEnCategoria("acontecimientos","buscarAcontecimientos","resultadosAcontecimientos","⚔️","Escribe algo para comenzar.");
}
function buscarCulturas() {
    buscarEnCategoria("culturas","buscarCulturas","resultadosCulturas","🏺","Escribe el nombre de una cultura para comenzar.");
}
// ============================================================
// 14. MOSTRAR PRESIDENTE
// ============================================================
function mostrarPresidente(nombre) {
    const lista = obtenerCategoria("presidentes");
    const presidente = lista.find(function(item) {
            return item.nombre === nombre;
        });
    if (!presidente) {
        return;
    }
    const resultados=document.getElementById("resultadosPresidentes");
    if (!resultados) {
        return;
    }
    resultados.innerHTML = crearFicha(presidente,"👑","Presidentes");
}
// ============================================================
// 15. MOSTRAR DETALLE
// ============================================================
function mostrarDetalle(seccion, nombre) {
    const datos = obtenerCategoria(seccion);
    const elemento = datos.find(function(item) {
        return item.nombre === nombre;
    });
    if (!elemento) {
        console.error("No se encontró:", nombre);
        return;
    }
    let icono = "📖";
    if (seccion === "presidentes") {
        icono = "👑";
    }
    else if (seccion === "departamentos") {
        icono = "🗺️";
    }
    else if (seccion === "personajes") {
        icono = "👤";
    }
    else if (seccion === "acontecimientos") {
        icono = "⚔️";
    }
    else if (seccion === "culturas") {
        icono = "🏺";
    }
    else if (seccion === "himnos") {
        icono = "🎵";
    }

    /*
     * Cada sección tiene su propio contenedor
     */
    const contenedores = {
        presidentes: "resultadosPresidentes",
        departamentos: "resultadosDepartamentos",
        personajes: "resultadosPersonajes",
        acontecimientos: "resultadosAcontecimientos",
        culturas: "resultadosCulturas",
        himnos: "resultadosHimnos"
    };
    const idContenedor = contenedores[seccion];
    const contenedor = document.getElementById(idContenedor);
    if (!contenedor) {
        console.error("No existe el contenedor:",idContenedor);
        return;
    }
    contenedor.innerHTML = crearFicha(elemento,icono,seccion);
}
// ============================================================
// 16. CREAR FICHA
// ============================================================


function crearFicha(item, icono, titulo) {
    if (!item || typeof item !== "object") {
        return "<div class='ficha-informacion'>No hay información disponible.</div>";
    }

    let html = `
        <div class="ficha-informacion">
            <button class="boton-volver"
                onclick="location.reload()">
                ⬅️ Volver
            </button>

            <h2>${icono} ${item.nombre || "Sin nombre"}</h2>
            <hr>
    `;

    // Campos que ya se han mostrado en la ficha
    const camposMostrados = new Set(["nombre"]);

    // Nombres más claros para los campos de tus archivos
    const etiquetas = {
        descripcion: "📖 Descripción",
        importancia: "⭐ Importancia histórica",
        periodo: "📅 Período",
        periodoHistorico: "📅 Período histórico",
        fecha: "📅 Fecha",
        causas: "🔎 Causas",
        consecuencias: "📌 Consecuencias",
        desarrollo: "📜 Desarrollo",
        ubicacion: "📍 Ubicación",
        capital: "🏛️ Capital",
        region: "🌎 Región",
        poblacion: "👥 Población",
        ciudadesImportantes: "🏙️ Ciudades importantes",
        fiestaPrincipal: "🎉 Fiesta principal",
        nacimiento: "🎂 Nacimiento",
        fallecimiento: "🕊️ Fallecimiento",
        biografia: "👤 Biografía",
        biografiaAmpliada: "👤 Biografía ampliada",
        informacion: "📚 Información",
        gobierno: "🏛️ Gobierno",
        acontecimientos: "⚔️ Acontecimientos",
        hitos: "📜 Hitos históricos",
        obrasYDocumentos: "📜 Obras y documentos",
        vision: "💡 Visión",
        intervencion: "🤝 Intervención",
        detalle: "🔎 Detalles históricos",
        legado: "📜 Legado",
        legadoInstitucional: "📜 Legado institucional",
        simbolismo: "🇧🇴 Simbolismo",
        trascendencia: "🌟 Trascendencia",
        autor: "✍️ Autor",
        categoria: "📂 Categoría",
        letra: "🎵 Letra",
        audio: "🔊 Audio"
    };

    // Convertir nombres técnicos a títulos legibles
    function obtenerEtiqueta(clave) {
        if (etiquetas[clave]) {
            return etiquetas[clave];
        }

        return "📌 " + clave
            .replace(/([a-záéíóúñ])([A-ZÁÉÍÓÚÑ])/g, "$1 $2")
            .replace(/^./, letra => letra.toUpperCase());
    }

    // Mostrar cualquier valor como texto
    function convertirTexto(valor) {
        if (Array.isArray(valor)) {
            return valor.map(convertirTexto).join(", ");
        }

        if (valor && typeof valor === "object") {
            return Object.entries(valor)
                .map(([clave, dato]) =>
                    clave + ": " + convertirTexto(dato)
                )
                .join(" | ");
        }

        return String(valor);
    }

    // Mostrar un campo conocido usando sus nombres alternativos
    function mostrarCampo(etiqueta, ...propiedades) {
        const clave = propiedades.find(propiedad =>
            item[propiedad] !== undefined &&
            item[propiedad] !== null &&
            item[propiedad] !== ""
        );

        if (!clave) {
            return;
        }

        camposMostrados.add(clave);

        html += `
            <h3>${etiqueta}</h3>
            <p>${convertirTexto(item[clave])}</p>
        `;
    }

    // Campos habituales de Yuyay Bolivia
    mostrarCampo("📖 Descripción", "descripcion");
    mostrarCampo("⭐ Importancia histórica", "importancia");
    mostrarCampo("📅 Período", "periodoHistorico", "periodo");
    mostrarCampo("📅 Fecha", "fecha");
    mostrarCampo("🔎 Causas", "causas");
    mostrarCampo("📌 Consecuencias", "consecuencias");
    mostrarCampo("📜 Desarrollo", "desarrollo");
    mostrarCampo("📍 Ubicación", "ubicacion");
    mostrarCampo("🏛️ Capital", "capital");
    mostrarCampo("🌎 Región", "region");
    mostrarCampo("👥 Población", "poblacion");
    mostrarCampo("🏙️ Ciudades importantes", "ciudadesImportantes");
    mostrarCampo("🎉 Fiesta principal", "fiestaPrincipal");

    mostrarCampo("🎂 Nacimiento", "nacimiento");
    mostrarCampo("🕊️ Fallecimiento", "fallecimiento");
    mostrarCampo("👤 Biografía", "biografiaAmpliada", "biografia");
    mostrarCampo("📚 Información", "informacion");
    mostrarCampo("🏛️ Gobierno", "gobierno");
    mostrarCampo("⚔️ Acontecimientos", "acontecimientos", "hitos");

    mostrarCampo("📜 Obras y documentos", "obrasYDocumentos");
    mostrarCampo("💡 Visión", "vision");
    mostrarCampo("🤝 Intervención", "intervencion");
    mostrarCampo("🔎 Detalles históricos", "detalle");
    mostrarCampo("📜 Legado", "legadoInstitucional", "legado");
    mostrarCampo("🇧🇴 Simbolismo", "simbolismo");
    mostrarCampo("🌟 Trascendencia", "trascendencia");

    // Mostrar automáticamente TODOS los campos adicionales
    Object.entries(item).forEach(([clave, valor]) => {
        if (
            camposMostrados.has(clave) ||
            clave === "nombre" ||
            clave === "audio" ||
            clave === "letra" ||
            valor === null ||
            valor === undefined ||
            valor === ""
        ) {
            return;
        }

        html += `
            <h3>${obtenerEtiqueta(clave)}</h3>
            <p>${convertirTexto(valor)}</p>
        `;
    });

    // Mostrar la letra completa de himnos y canciones
    if (item.letra) {
        html += `
            <h3>🎵 Letra completa</h3>
            <div class="letra-himno"
                style="white-space: pre-line; text-align: left;
                line-height: 1.7; margin-top: 10px;">
                ${item.letra}
            </div>
        `;
    }

    // Reproductor de audio
    if (item.audio) {
        html += `
            <h3>🔊 Audio</h3>
            <audio controls preload="none"
                src="${item.audio}"></audio>
        `;
    }

    html += "</div>";

    return html;
}


// ============================================================
// 17. PROTEGER TEXTO PARA ATRIBUTOS HTML
// ============================================================
function escapeHtml(texto) {
    return String(texto)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'")
        .replace(/"/g, "&quot;");
}
// ============================================================
// 18. AUDIO DE CONSULTAS
// ============================================================

let audioConsultasActivado = true;


function cambiarAudioConsultas(valor) {

    if (valor === "activado") {

        audioConsultasActivado = true;

    }
    else {

        audioConsultasActivado = false;

        speechSynthesis.cancel();

    }

}


function leerConsulta(texto) {

    if (!audioConsultasActivado) {
        return;
    }

    speechSynthesis.cancel();

    const voz =
        new SpeechSynthesisUtterance(texto);

    voz.lang = "es-ES";
    voz.rate = 1;
    voz.pitch = 1;
    voz.volume = 1;

    speechSynthesis.speak(voz);

}


// ============================================================
// 19. HIMNOS Y CANCIONES
// ============================================================

function buscarHimno() {

    const input =
        document.getElementById("buscarHimno");

    const resultados =
        document.getElementById("resultadosHimnos");


    if (!input || !resultados) {
        return;
    }


    const texto =
        input.value
            .toLowerCase()
            .trim();


    resultados.innerHTML = "";


    const lista =
        obtenerCategoria("himnos");


    // ========================================================
    // BUSCADOR VACÍO
    // ========================================================

    if (texto === "") {

        resultados.innerHTML = `

            <p class="mensaje-himnos">
                🔎 Escribe algo para comenzar a buscar.
            </p>

        `;

        return;
    }


    // ========================================================
    // BUSCAR
    // ========================================================

    const encontrados = lista
    .map(function(himno, indice) {
        return {
            himno: himno,
            indice: indice,
            puntuacion: puntuarBusqueda(himno, texto)
        };
    })
    .filter(function(resultado) {
        return resultado.puntuacion > 0;
    })
    .sort(function(a, b) {
        return b.puntuacion - a.puntuacion ||
            a.indice - b.indice;
    })
    .map(function(resultado) {
        return resultado.himno;
    });


    // ========================================================
    // SIN RESULTADOS
    // ========================================================

    if (encontrados.length === 0) {

        resultados.innerHTML = `

            <p class="sin-himnos">
                ❌ No se encontró ningún himno o canción.
            </p>

        `;

        return;
    }


    // ========================================================
    // MOSTRAR RESULTADOS
    // ========================================================

    encontrados.forEach(function(himno) {

        const tarjeta =
            document.createElement("div");


        tarjeta.className =
            "tarjeta-himno";


        tarjeta.innerHTML = `

            <span class="categoria-himno">
                🎵 ${himno.categoria || "Canción"}
            </span>


            <h2>
                ${himno.nombre || "Sin nombre"}
            </h2>


            <p>
                ${himno.descripcion || ""}
            </p>


            <p>
                <strong>✍️ Autor:</strong>
                ${himno.autor || "No disponible"}
            </p>


            ${
                himno.audio
                ?
                `
                <div class="audio-himno">

                    <audio
                        controls
                        src="${himno.audio}"
                    ></audio>

                </div>
                `
                :
                ""
            }


            <!-- =================================================
                 BOTÓN MOSTRAR MÁS
            ================================================= -->

            <button
                onclick="mostrarDetalle(
                    'himnos',
                    '${escapeHtml(
                        himno.nombre || ""
                    )}'
                )"
            >
                📖 Mostrar más
            </button>

        `;


        resultados.appendChild(tarjeta);

    });

}


// ============================================================
// 20. REPRODUCTOR DE HIMNOS
// ============================================================

function reproducirHimno(archivo) {

    const audio =
        document.getElementById("audioHimno");

    if (!audio) {
        return;
    }

    audio.src = archivo;

    audio.play().catch(function(error) {

        console.log(
            "No se pudo reproducir el audio:",
            error
        );

    });

}


function pausarHimno() {

    const audio =
        document.getElementById("audioHimno");

    if (audio) {
        audio.pause();
    }

}


function detenerHimno() {

    const audio =
        document.getElementById("audioHimno");

    if (!audio) {
        return;
    }

    audio.pause();

    audio.currentTime = 0;

}


function silenciarHimno() {

    const audio =
        document.getElementById("audioHimno");

    if (audio) {

        audio.muted =
            !audio.muted;

    }

}
// ============================================================
// ARCHIVO SECRETO
// ============================================================

function abrirSecreto() {

    cerrarVentanas();

    const ventana =
        document.getElementById("secreto");

    if (!ventana) {
        return;
    }

    ventana.classList.add("mostrar");

    const clave =
        document.getElementById("claveSecreta");

    const mensaje =
        document.getElementById("mensajeSecreto");

    if (clave) {
        clave.value = "";
    }

    if (mensaje) {
        mensaje.textContent = "";
    }

}


// ============================================================
// VERIFICAR CONTRASEÑA
// ============================================================

function verificarSecreto() {
    const clave = document.getElementById("claveSecreta");
    const mensaje = document.getElementById("mensajeSecreto");

    if (!clave || !mensaje) {
        return;
    }

    const contraseña = clave.value.trim();

    // ==========================================
    // CÓDIGOS SECRETOS Y SUS PÁGINAS
    // ==========================================

    const codigosSecretos = {
        "101": {
            pagina: "PaginasUtilizadas/Secreto/Secreto.html",
            nombre: "..."
        },

        "707": {
            pagina: "PaginasUtilizadas/Troll/Troll.html",
            nombre: "..."
        },

        "122": {
            pagina: "PaginasUtilizadas/Leyendas/Leyendas.html",
            nombre: "..."
        },
        "013020005": {
            pagina: "PaginasUtilizadas/MatematicasSinEstres/Matematica.html",
            nombre: "..."
        }
    };

    // ==========================================
    // COMPROBAR EL CÓDIGO
    // ==========================================

    const destino = codigosSecretos[contraseña];

    if (destino) {
        mensaje.textContent = "🔓 Acceso concedido: " + destino.nombre;

        window.location.href = destino.pagina;
    } else {
        mensaje.textContent = "❌ Código incorrecto. Inténtalo otra vez.";

        clave.value = "";
        clave.focus();
    }
}

