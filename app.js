/* ==========================================================================
   LESSONS DATABASE
   ========================================================================== */
const lessons = [
    {
        id: 0,
        badge: "Bloque 1 • Lección 1",
        title: "La Carretilla Elevadora: Cruce de Datos (Pandas Merge)",
        desc: "Aprende a cruzar un reporte físico y uno de SAP por el código SKU en un segundo.",
        analogyText: `
            <p>Imagina que tienes dos estantes en tu almacén. El <strong>Estante SAP</strong> tiene la lista de stock registrada en el sistema. El <strong>Estante Físico</strong> contiene la lista de lo que tus operarios contaron en los pasillos.</p>
            <p>Hacer esto en Excel con un <code>BUSCARV</code> (VLOOKUP) es lento y a menudo se congela la hoja si tienes 10,000 SKUs. Con Python, traemos un <strong>montacargas (Pandas)</strong> que toma ambos estantes y los acopla perfectamente por la etiqueta SKU usando el comando <code>pd.merge</code>. ¡Es instantáneo y limpio!</p>
        `,
        visualHtml: `
            <div class="forklift-animation">
                <div class="shelf-box" id="shelf-sap">SAP</div>
                <div class="forklift-icon"><i class="fa-solid fa-truck-ramp-box"></i></div>
                <div class="shelf-box" id="shelf-fisico">FÍSICO</div>
                <div class="shelf-box processed" id="shelf-result" style="opacity: 0; transform: scale(0.5); transition: all 1s ease;">MATCH</div>
            </div>
        `,
        code: `import pandas as pd

# Cargar los reportes (los estantes del almacén)
df_sap = pd.read_csv("stock_sap.csv")
df_fisico = pd.read_csv("stock_fisico.csv")

# Cruzar ambos estantes por SKU (buscando la etiqueta en común)
df_discrepancias = pd.merge(df_sap, df_fisico, on="SKU", suffixes=("_sap", "_fisico"))

# Calcular la diferencia (Físico vs Sistema)
df_discrepancias["Diferencia"] = df_discrepancias["Cantidad_fisico"] - df_discrepancias["Cantidad_sap"]

# Filtrar solo donde hay descuadres (Diferencia diferente de 0)
df_descuadres = df_discrepancias[df_discrepancias["Diferencia"] != 0]

# Imprimir los descuadres encontrados en pantalla
print(df_descuadres[["SKU", "Diferencia"]])`,
        explanation: [
            "<code>import pandas as pd</code>: Trae la librería <strong>Pandas</strong> al script y le asigna el apodo <code>pd</code> para escribir menos.",
            "<code>pd.read_csv(...)</code>: Abre un archivo de texto plano con formato de datos. Equivale a hacer clic en 'Abrir archivo' en Excel.",
            "<code>pd.merge(..., on='SKU')</code>: Esta es la carretilla elevadora. Une dos tablas usando la columna común 'SKU'. Une el stock SAP y el Físico en un solo registro por SKU.",
            "<code>df_discrepancias['Diferencia'] = ...</code>: Crea una nueva columna restando ambas cantidades para calcular la discrepancia.",
            "<code>df_discrepancias[df_discrepancias['Diferencia'] != 0]</code>: Filtra la tabla y quédate únicamente con las filas que tengan descuadres. Ignora lo que está perfecto."
        ],
        simLogs: [
            { type: 'info', text: 'Iniciando script python...' },
            { type: 'info', text: 'Importando librería pandas con éxito.' },
            { type: 'info', text: 'Leyendo stock_sap.csv... (5,241 filas encontradas)' },
            { type: 'info', text: 'Leyendo stock_fisico.csv... (5,238 filas encontradas)' },
            { type: 'info', text: 'Cruzando tablas por SKU mediante pandas.merge...' },
            { type: 'success', text: 'Cruce completado. 5,230 coincidencias de SKU encontradas.' },
            { type: 'info', text: 'Calculando diferencias de stock físico vs SAP...' },
            { type: 'success', text: '¡Ejecución terminada! Discrepancias detectadas:' },
            { type: 'normal', text: 'SKU        Diferencia\nSKU-10022      -5\nSKU-10045      +12\nSKU-20199      -1\nSKU-30911      -20' }
        ],
        simAction: function() {
            const resultBox = document.getElementById('shelf-result');
            const forklift = document.querySelector('.forklift-icon');
            if (resultBox && forklift) {
                forklift.style.transform = 'translateX(30px)';
                setTimeout(() => {
                    forklift.style.transform = 'translateX(-30px)';
                }, 1000);
                setTimeout(() => {
                    forklift.style.transform = 'translateX(0)';
                    resultBox.style.opacity = '1';
                    resultBox.style.transform = 'scale(1.1)';
                    resultBox.style.boxShadow = '0 0 15px var(--cyan)';
                }, 2000);
            }
        }
    },
    {
        id: 1,
        badge: "Bloque 1 • Lección 2",
        title: "Limpieza de Estanterías: Nulos y Errores (Pandas Clean)",
        desc: "Aprende a eliminar registros incompletos y rellenar celdas vacías sin esfuerzo.",
        analogyText: `
            <p>Imagina que estás auditando un pasillo y encuentras cajas rotas, artículos sin etiqueta (SKU nulo) o hojas de conteo donde el operario olvidó escribir la cantidad (celda vacía).</p>
            <p>En el almacén de datos, estos problemas se conocen como valores <code>NaN</code> o nulos. Con Python, barremos el pasillo completo rápidamente. Borramos filas inservibles con <code>dropna()</code> y rellenamos los datos faltantes con <code>fillna(0)</code> para que las matemáticas del inventario cuadren a la perfección.</p>
        `,
        visualHtml: `
            <div class="spider-container">
                <div class="web-browser-mock">
                    <span id="clean-item-1" style="color: var(--red); text-decoration: line-through;">[SKU: NULL - Stock: 10]</span><br>
                    <span id="clean-item-2">[SKU: SKU002 - Stock: <span id="val-null" style="color: var(--amber);">NaN</span>]</span><br>
                    <span id="clean-item-3">[SKU: SKU003 - Stock: 45]</span>
                </div>
            </div>
        `,
        code: `import pandas as pd

# Cargar el reporte de stock sucio
df = pd.read_csv("reporte_sucio.csv")

# 1. Eliminar filas donde el SKU esté vacío (cajas sin etiqueta)
df_limpio = df.dropna(subset=["SKU"])

# 2. Rellenar cantidades vacías con 0 (si no hay dato, asumimos stock cero)
df_limpio["Cantidad"] = df_limpio["Cantidad"].fillna(0)

# 3. Exportar el reporte limpio a un nuevo archivo CSV
df_limpio.to_csv("reporte_limpio.csv", index=False)
print("¡Limpieza completada con éxito!")`,
        explanation: [
            "<code>df.dropna(subset=['SKU'])</code>: Identifica los registros donde la columna SKU está vacía y los borra por completo de la tabla, ya que no se pueden auditar.",
            "<code>df['Cantidad'].fillna(0)</code>: Busca celdas vacías en la columna Cantidad y escribe un '0' en ellas, evitando errores matemáticos en las sumas totales.",
            "<code>to_csv(..., index=False)</code>: Guarda la tabla limpia en tu computadora como un archivo CSV nuevo sin agregar una columna de índices innecesaria."
        ],
        simLogs: [
            { type: 'info', text: 'Iniciando script de limpieza...' },
            { type: 'info', text: 'Abriendo reporte_sucio.csv...' },
            { type: 'info', text: 'Detectadas 45 filas con SKU nulo. Eliminando...' },
            { type: 'info', text: 'Detectadas 12 filas con stock vacío. Rellenando con 0...' },
            { type: 'success', text: 'Exportando datos limpios a reporte_limpio.csv...' },
            { type: 'success', text: '¡Limpieza completada! Registros listos para auditoría.' }
        ],
        simAction: function() {
            setTimeout(() => {
                const item1 = document.getElementById('clean-item-1');
                if (item1) item1.style.display = 'none';
            }, 1000);
            setTimeout(() => {
                const valNull = document.getElementById('val-null');
                if (valNull) {
                    valNull.textContent = '0';
                    valNull.style.color = 'var(--emerald)';
                    valNull.style.fontWeight = 'bold';
                }
            }, 2000);
        }
    },
    {
        id: 2,
        badge: "Bloque 2 • Lección 3",
        title: "El Filtro de Recepción: Leer CSVs/TXTs de SAP",
        desc: "Aprende a procesar descargas gigantes de SAP (MB52) y reducir su peso en segundos.",
        analogyText: `
            <p>SAP suele descargar archivos masivos con extensiones de texto plano (.txt) separados por tabuladores o barras verticales. Si intentas abrirlos en Excel de escritorio, tu PC se congela y tardas minutos valiosos filtrando filas.</p>
            <p>En Python, usamos un delimitador personalizado en el lector de Pandas (<code>sep='\\t'</code>). Es como instalar un filtro en la puerta de recepción del almacén: solo dejas entrar los camiones (columnas) que realmente necesitas, descartando el resto antes de llenar tu espacio físico.</p>
        `,
        visualHtml: `
            <div style="width:100%; display:flex; justify-content:space-around; align-items:center;">
                <div style="font-size: 24px; color: var(--text-muted);"><i class="fa-solid fa-server"></i> SAP (500MB)</div>
                <div style="font-size: 20px; color: var(--cyan);"><i class="fa-solid fa-arrow-right-arrow-left"></i></div>
                <div style="font-size: 24px; color: var(--emerald);"><i class="fa-solid fa-file-excel"></i> Filtro (2MB)</div>
            </div>
        `,
        code: `import pandas as pd

# Leer archivo plano delimitado por tabuladores (\t) exportado de SAP (MB52)
df_sap = pd.read_csv("mb52_reporte.txt", sep="\t")

# Seleccionar únicamente las columnas críticas para inventarios
columnas_necesarias = ["Centro", "Almacén", "Material", "Libre utilización"]
df_filtrado = df_sap[columnas_necesarias]

# Guardar un reporte ultra liviano en CSV
df_filtrado.to_csv("sap_filtrado.csv", index=False)
print("Reporte SAP procesado.")`,
        explanation: [
            "<code>sep='\\t'</code>: Le indica a Pandas que el separador del archivo plano es un tabulador (común en exportaciones de SAP).",
            "<code>df_sap[columnas_necesarias]</code>: Filtra la tabla gigante de forma vertical, conservando solo las columnas especificadas en la lista, reduciendo el peso en un 95%.",
            "<code>sap_filtrado.csv</code>: El archivo resultante pesa tan poco que puedes enviarlo por correo o cargarlo en tu celular al instante."
        ],
        simLogs: [
            { type: 'info', text: 'Leyendo mb52_reporte.txt (Peso estimado: 154 MB)...' },
            { type: 'info', text: 'Procesando 852,901 registros en memoria...' },
            { type: 'success', text: 'Lectura de SAP completada en 1.4 segundos.' },
            { type: 'info', text: 'Filtrando columnas: Centro, Almacén, Material, Libre utilización...' },
            { type: 'info', text: 'Escribiendo sap_filtrado.csv...' },
            { type: 'success', text: '¡Guardado con éxito! Archivo reducido a 4.2 MB.' }
        ],
        simAction: function() {}
    },
    {
        id: 3,
        badge: "Bloque 2 • Lección 4",
        title: "El Montacargas a la Nube: Conexión con Supabase",
        desc: "Sincroniza tus reportes locales con la base de datos de tu AppSheet automáticamente.",
        analogyText: `
            <p>Supabase es un almacén moderno montado en la nube. Tu AppSheet de inventario lee los datos directamente de allí en tiempo real.</p>
            <p>En vez de registrarte en el navegador, descargar, copiar y subir archivos de stock a mano todos los días, Python actúa como un transportista automatizado. Se conecta de forma segura a Supabase y sube las tablas de diferencias de inventario con un solo script.</p>
        `,
        visualHtml: `
            <div style="position:relative; width:100%; height:100px; display:flex; justify-content:center; align-items:center;">
                <div style="text-align:center;"><i class="fa-solid fa-laptop" style="font-size:28px;"></i><br><span style="font-size:10px;">Local</span></div>
                <div id="sync-cloud-arrow" style="margin: 0 30px; font-size:24px; color: var(--emerald); animation: pulse 1s infinite;"><i class="fa-solid fa-cloud-arrow-up"></i></div>
                <div style="text-align:center; color: var(--emerald);"><i class="fa-solid fa-cloud" style="font-size:28px;"></i><br><span style="font-size:10px;">Supabase</span></div>
            </div>
        `,
        code: `from supabase import create_client
import pandas as pd

# 1. Configurar credenciales de tu proyecto en la nube
SUPABASE_URL = "https://tu-proyecto.supabase.co"
SUPABASE_KEY = "tu-api-key-secreta"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# 2. Cargar reporte local de diferencias
df_diff = pd.read_csv("discrepancias.csv")

# 3. Convertir la tabla a formato de registros JSON (lo que entiende la web)
datos_json = df_diff.to_dict(orient="records")

# 4. Insertar los datos en la tabla de Supabase
resultado = supabase.table("auditoria").insert(datos_json).execute()
print("Sincronización en la nube exitosa.")`,
        explanation: [
            "<code>from supabase import create_client</code>: Trae el conector oficial que permite a Python interactuar con Supabase.",
            "<code>create_client(...)</code>: Establece una conexión encriptada y segura entre tu computadora y la base de datos en la nube.",
            "<code>df_diff.to_dict(orient='records')</code>: Convierte la tabla de Pandas a una lista de registros clave-valor, lista para ser transmitida por internet.",
            "<code>supabase.table('auditoria').insert(...)</code>: Le ordena a Supabase que inserte la lista de discrepancias directamente en la tabla llamada 'auditoria'."
        ],
        simLogs: [
            { type: 'info', text: 'Conectando con Supabase API...' },
            { type: 'info', text: 'Autenticación con API Key aprobada.' },
            { type: 'info', text: 'Cargando registros de discrepancias.csv...' },
            { type: 'info', text: 'Enviando petición POST a la tabla /auditoria...' },
            { type: 'success', text: 'Respuesta de Supabase: 201 Created (12 filas insertadas).' },
            { type: 'success', text: 'Sincronización en la nube exitosa. AppSheet actualizada.' }
        ],
        simAction: function() {
            const arrow = document.getElementById('sync-cloud-arrow');
            if (arrow) {
                arrow.style.transform = 'translateY(-15px)';
                setTimeout(() => { arrow.style.transform = 'translateY(0)'; }, 500);
            }
        }
    },
    {
        id: 4,
        badge: "Bloque 3 • Lección 5",
        title: "El Inspector de Precios: Web Scraping de Proveedores",
        desc: "Crea un robot que entre a la web de tu proveedor y extraiga precios de SKU de forma automática.",
        analogyText: `
            <p>Imagina que envías a un operario a la tienda de tu proveedor todas las mañanas para que lea los precios de los productos y los anote en un papel.</p>
            <p>Un script de <strong>Web Scraping</strong> hace exactamente eso de manera digital. Abre la página web de tu proveedor en milisegundos, analiza la estructura HTML del catálogo, copia el precio de cada SKU y lo guarda en un Excel comparativo.</p>
        `,
        visualHtml: `
            <div class="spider-container">
                <div class="web-browser-mock">
                    <div class="spider-bot"><i class="fa-solid fa-spider"></i></div>
                    <div style="margin-top:10px; font-weight:600;">HTML Catálogo</div>
                    <div style="font-size:9px; color:var(--text-muted);">&lt;span class="price"&gt;$45.00&lt;/span&gt;</div>
                </div>
            </div>
        `,
        code: `import requests
from bs4 import BeautifulSoup
import pandas as pd

# 1. Descargar el código HTML de la tienda del proveedor
url = "https://ejemplo-proveedor.com/repuestos"
headers = {"User-Agent": "Mozilla/5.0"}
respuesta = requests.get(url, headers=headers)

# 2. Convertir el código HTML en un formato legible por Python
soup = BeautifulSoup(respuesta.text, "html.parser")
productos = []

# 3. Buscar las tarjetas de productos en el código
for tarjeta in soup.find_all("div", class_="product-card"):
    nombre = tarjeta.find("h3", class_="product-title").text.strip()
    precio = tarjeta.find("span", class_="price").text.strip()
    productos.append({"SKU": nombre, "Precio": precio})

# 4. Guardar la lista de precios a Excel
pd.DataFrame(productos).to_excel("precios_proveedor.xlsx", index=False)
print("Lista de precios actualizada.")`,
        explanation: [
            "<code>import requests</code>: Carga la librería que permite a Python navegar e interactuar con páginas web por internet.",
            "<code>BeautifulSoup(...)</code>: Analiza y parsea la maraña de código HTML de la web, convirtiéndola en un árbol ordenado de etiquetas.",
            "<code>soup.find_all(...)</code>: Busca en la estructura de la página todas las etiquetas que contengan los productos del catálogo.",
            "<code>tarjeta.find(...).text.strip()</code>: Extrae el texto limpio (removiendo espacios vacíos) dentro de la etiqueta que contiene el precio o el nombre."
        ],
        simLogs: [
            { type: 'info', text: 'Conectando con https://ejemplo-proveedor.com/repuestos...' },
            { type: 'info', text: 'Código de respuesta: 200 OK (Página descargada)' },
            { type: 'info', text: 'Analizando estructura HTML con BeautifulSoup...' },
            { type: 'info', text: 'Buscando elementos con clase CSS "product-card"...' },
            { type: 'success', text: 'Encontrados 25 productos en el catálogo web.' },
            { type: 'success', text: 'Guardando reporte de precios en precios_proveedor.xlsx...' }
        ],
        simAction: function() {
            const spider = document.querySelector('.spider-bot');
            if (spider) {
                spider.style.animation = 'spiderClimb 0.5s infinite alternate';
                setTimeout(() => {
                    spider.style.animation = 'spiderClimb 2s infinite ease-in-out';
                }, 2000);
            }
        }
    },
    {
        id: 5,
        badge: "Bloque 3 • Lección 6",
        title: "Sifón Multimedia: Descargador de Videos",
        desc: "Crea tu propia herramienta offline para descargar videos de capacitación sin publicidad molesta.",
        analogyText: `
            <p>Las páginas web para descargar videos están plagadas de botones trampa, virus y publicidad molesta. En Python, puedes saltear todo el intermediario.</p>
            <p>Usamos la librería <code>yt-dlp</code>, que funciona como un sifón directo conectado al servidor de video. Extrae el archivo multimedia de manera quirúrgica y lo descarga directamente en tu carpeta en la máxima calidad disponible.</p>
        `,
        visualHtml: `
            <div style="width:100%; display:flex; justify-content:center; align-items:center; gap:20px;">
                <div style="font-size:26px; color:var(--red);"><i class="fa-brands fa-youtube"></i></div>
                <div style="font-size:20px; color:var(--text-muted);"><i class="fa-solid fa-cloud-arrow-down"></i></div>
                <div style="font-size:26px; color:white;"><i class="fa-solid fa-file-video"></i></div>
            </div>
        `,
        code: `import yt_dlp

# Enlace del video de capacitación
url_video = "https://www.youtube.com/watch?v=ejemplo_inventario"

# Configurar las especificaciones de la descarga
opciones = {
    'format': 'best', # Descargar la mejor calidad disponible
    'outtmpl': 'descargas/%(title)s.%(ext)s', # Guardar con el nombre original del video
}

# Iniciar la descarga del video
with yt_dlp.YoutubeDL(opciones) as ydl:
    ydl.download([url_video])

print("¡Descarga de video finalizada con éxito!")`,
        explanation: [
            "<code>import yt_dlp</code>: Carga el motor de descarga de videos más poderoso de la comunidad de Python, compatible con cientos de sitios web.",
            "<code>'format': 'best'</code>: Le indica a la librería que busque y descargue la resolución de video más alta que ofrezca el servidor.",
            "<code>'outtmpl': 'descargas/...'</code>: Define la carpeta destino y cómo se va a renombrar el archivo descargado de forma automática.",
            "<code>ydl.download([url_video])</code>: Ejecuta el protocolo de descarga descargando el video en pedazos de forma rápida y segura."
        ],
        simLogs: [
            { type: 'info', text: 'Inicializando motor de descarga yt-dlp...' },
            { type: 'info', text: 'Obteniendo metadatos de: https://youtube.com/watch?v=ejemplo_inventario...' },
            { type: 'info', text: 'Video detectado: "Capacitación_Toma_Fisica_Inventarios.mp4"' },
            { type: 'info', text: 'Descargando flujo de video (Calidad: 1080p, Peso: 45MB)...' },
            { type: 'success', text: '[Descarga] 100% de 45.00MiB en 4.5s' },
            { type: 'success', text: '¡Guardado correctamente en la carpeta /descargas!' }
        ],
        simAction: function() {}
    }
];

/* ==========================================================================
   GLOBAL APP STATE
   ========================================================================== */
let currentLessonId = 0;
let currentLessonTab = 'analogia';
let lessonsCompleted = new Set();

/* ==========================================================================
   INITIALIZATION & NAVIGATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // Populate lessons list
    renderLessonsList();
    // Load initial lesson data
    loadLessonDetail(0);
    // Initialize completed counts
    updateProgressCounter();
});

function switchTab(tabId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    // Show selected section
    const targetSection = document.getElementById(`section-${tabId}`);
    if (targetSection) targetSection.classList.add('active');

    // Update navbar active states
    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.classList.remove('active');
    });
    const targetNavItem = document.getElementById(`nav-${tabId}`);
    if (targetNavItem) targetNavItem.classList.add('active');

    // Scroll back to top of container
    document.querySelector('.app-content').scrollTop = 0;
}

/* ==========================================================================
   LESSONS LOGIC
   ========================================================================== */
function renderLessonsList() {
    const listContainer = document.getElementById('lesson-list');
    if (!listContainer) return;
    
    listContainer.innerHTML = '';
    
    lessons.forEach(les => {
        const isCompleted = lessonsCompleted.has(les.id);
        const isActive = currentLessonId === les.id;
        
        const item = document.createElement('div');
        item.className = `lesson-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`;
        item.onclick = () => selectLesson(les.id);
        
        item.innerHTML = `
            <div class="lesson-info">
                <span class="lbl">${les.badge}</span>
                <span class="title">${les.title}</span>
            </div>
            <div class="lesson-status">
                <i class="fa-solid ${isCompleted ? 'fa-check' : 'fa-play'}"></i>
            </div>
        `;
        listContainer.appendChild(item);
    });
}

function selectLesson(id) {
    currentLessonId = id;
    loadLessonDetail(id);
    renderLessonsList();
    toggleSidebar(false); // Hide sidebar and show detail on mobile
}

function toggleSidebar(show) {
    const sidebar = document.getElementById('lessons-sidebar');
    const detail = document.getElementById('lesson-detail-container');
    if (window.innerWidth < 768) {
        if (show) {
            sidebar.style.display = 'block';
            detail.style.display = 'none';
        } else {
            sidebar.style.display = 'none';
            detail.style.display = 'block';
        }
    } else {
        sidebar.style.display = 'block';
        detail.style.display = 'block';
    }
}

// Adjust view when resizing window
window.addEventListener('resize', () => {
    const sidebar = document.getElementById('lessons-sidebar');
    const detail = document.getElementById('lesson-detail-container');
    if (window.innerWidth >= 768) {
        sidebar.style.display = 'block';
        detail.style.display = 'block';
    } else {
        // Default on mobile
        sidebar.style.display = 'block';
        detail.style.display = 'none';
    }
});

// Setup initial state on mobile
setTimeout(() => {
    toggleSidebar(true);
}, 100);

function loadLessonDetail(id) {
    const les = lessons.find(l => l.id === id);
    if (!les) return;
    
    document.getElementById('lesson-detail-badge').textContent = les.badge;
    document.getElementById('lesson-detail-title').textContent = les.title;
    document.getElementById('lesson-detail-desc').textContent = les.desc;
    document.getElementById('lesson-detail-analogy-text').innerHTML = les.analogyText;
    document.getElementById('lesson-detail-visual').innerHTML = les.visualHtml;
    document.getElementById('lesson-detail-code').textContent = les.code;
    
    // Clear console output
    const consoleOutput = document.getElementById('console-output');
    consoleOutput.innerHTML = '<span class="console-placeholder">Esperando ejecución...</span>';
    
    // Clear sim visual
    document.getElementById('sim-visual-output-container').innerHTML = '';
    
    // Populate explanation lines
    const explUl = document.getElementById('lesson-detail-explanation');
    explUl.innerHTML = '';
    les.explanation.forEach(exp => {
        const li = document.createElement('li');
        li.innerHTML = exp;
        explUl.appendChild(li);
    });

    // Handle next/prev buttons state
    document.getElementById('prev-lesson-btn').disabled = id === 0;
    document.getElementById('next-lesson-btn').disabled = id === lessons.length - 1;
    
    // Force switch back to analogy tab in lesson view
    switchLessonTab('analogia');
}

function switchLessonTab(tabName) {
    currentLessonTab = tabName;
    
    // Toggle active state of tab buttons
    document.querySelectorAll('.lesson-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Find active tab button based on tag content/index
    const tabIndex = tabName === 'analogia' ? 0 : tabName === 'codigo' ? 1 : 2;
    document.querySelectorAll('.lesson-tab-btn')[tabIndex].classList.add('active');
    
    // Toggle content
    document.querySelectorAll('.lesson-tab-content').forEach(cont => {
        cont.classList.remove('active');
    });
    document.getElementById(`lesson-tab-${tabName}`).classList.add('active');
}

function navigateLesson(dir) {
    const nextId = currentLessonId + dir;
    if (nextId >= 0 && nextId < lessons.length) {
        selectLesson(nextId);
    }
}

function copyLessonCode() {
    const code = document.getElementById('lesson-detail-code').textContent;
    navigator.clipboard.writeText(code).then(() => {
        showToast('Código copiado con éxito');
    }).catch(err => {
        console.error('Error copying text: ', err);
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

function updateProgressCounter() {
    const counter = document.getElementById('lessons-progress');
    if (counter) {
        counter.textContent = `${lessonsCompleted.size}/${lessons.length}`;
    }
}

/* ==========================================================================
   CONSOLE SIMULATION ENGINE
   ========================================================================== */
function runSimulation() {
    const consoleOutput = document.getElementById('console-output');
    const runBtn = document.getElementById('run-simulation-btn');
    const les = lessons.find(l => l.id === currentLessonId);
    if (!les || !consoleOutput) return;

    // Disable button during execution
    runBtn.disabled = true;
    runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Ejecutando...';
    
    consoleOutput.innerHTML = '';
    
    let logIndex = 0;
    
    // Trigger custom visual animation in lesson description if any
    if (les.simAction) {
        les.simAction();
    }
    
    const interval = setInterval(() => {
        if (logIndex < les.simLogs.length) {
            const log = les.simLogs[logIndex];
            const logLine = document.createElement('div');
            
            if (log.type === 'info') {
                logLine.className = 'log-info';
                logLine.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${log.text}`;
            } else if (log.type === 'success') {
                logLine.className = 'log-success';
                logLine.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${log.text}`;
            } else {
                logLine.innerHTML = log.text.replace(/\n/g, '<br>');
            }
            
            consoleOutput.appendChild(logLine);
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
            logIndex++;
        } else {
            clearInterval(interval);
            runBtn.disabled = false;
            runBtn.innerHTML = '<i class="fa-solid fa-rotate-left"></i> Volver a Ejecutar';
            
            // Mark lesson as completed
            if (!lessonsCompleted.has(les.id)) {
                lessonsCompleted.add(les.id);
                renderLessonsList();
                updateProgressCounter();
                showToast('¡Felicidades! Lección completada.');
            }
        }
    }, 800);
}

/* ==========================================================================
   UTILITIES ENGINE (REAL CLIENT-SIDE JS PROCESSING)
   ========================================================================== */
function switchUtility(utilName) {
    document.querySelectorAll('.util-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Map buttons to activate
    const buttons = document.querySelectorAll('.util-tab-btn');
    if (utilName === 'cruce') buttons[0].classList.add('active');
    else if (utilName === 'limpiador') buttons[1].classList.add('active');
    else if (utilName === 'supabase') buttons[2].classList.add('active');
    
    document.querySelectorAll('.util-content').forEach(cont => {
        cont.classList.remove('active');
    });
    document.getElementById(`util-${utilName}`).classList.add('active');
}

// Global variables to hold processed utility results for download
let mergeResultsCsvString = '';
let cleanResultsCsvString = '';

/* CRUCE DE INVENTARIOS LOGIC */
function loadMockCsvData() {
    const mockSap = `SKU,Cantidad_sap\nSKU-10022,100\nSKU-10045,50\nSKU-20199,400\nSKU-30911,15\nSKU-50001,80\nSKU-60098,34`;
    const mockFisico = `SKU,Cantidad_fisico\nSKU-10022,95\nSKU-10045,62\nSKU-20199,399\nSKU-30911,15\nSKU-50001,80\nSKU-60098,14`;
    
    document.getElementById('csv-sap-input').value = mockSap;
    document.getElementById('csv-fisico-input').value = mockFisico;
    showToast('Datos de prueba cargados');
}

function parseCSV(text) {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];
    
    for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.trim());
        if (cols.length === headers.length) {
            const row = {};
            headers.forEach((h, index) => {
                row[h] = cols[index];
            });
            data.push(row);
        }
    }
    return data;
}

function processInventoryMerge() {
    const sapText = document.getElementById('csv-sap-input').value;
    const fisicoText = document.getElementById('csv-fisico-input').value;
    
    const sapData = parseCSV(sapText);
    const fisicoData = parseCSV(fisicoText);
    
    if (sapData.length === 0 || fisicoData.length === 0) {
        alert("Por favor, asegúrate de ingresar datos de prueba o cargar archivos CSV válidos en ambas secciones.");
        return;
    }
    
    const resultsTableBody = document.querySelector('#merge-results-table tbody');
    resultsTableBody.innerHTML = '';
    
    const discrepancies = [];
    mergeResultsCsvString = 'SKU,Cantidad_sap,Cantidad_fisico,Diferencia,Estado\n';
    
    // Cross data by SKU
    sapData.forEach(sapItem => {
        const sku = sapItem.SKU || sapItem.sku;
        const qtySap = parseInt(sapItem.Cantidad_sap || sapItem.cantidad_sap || 0);
        
        // Find matching item in physical
        const phyItem = fisicoData.find(f => (f.SKU || f.sku) === sku);
        const qtyPhy = phyItem ? parseInt(phyItem.Cantidad_fisico || phyItem.cantidad_fisico || 0) : 0;
        
        const diff = qtyPhy - qtySap;
        let estado = 'OK';
        let badgeClass = 'badge-success';
        
        if (diff < 0) {
            estado = 'Faltante';
            badgeClass = 'badge-danger';
        } else if (diff > 0) {
            estado = 'Sobrante';
            badgeClass = 'badge-warning';
        }
        
        discrepancies.push({ sku, qtySap, qtyPhy, diff, estado, badgeClass });
        mergeResultsCsvString += `${sku},${qtySap},${qtyPhy},${diff},${estado}\n`;
    });
    
    // Append to table HTML
    discrepancies.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${row.sku}</strong></td>
            <td>${row.qtySap} u</td>
            <td>${row.qtyPhy} u</td>
            <td class="${row.diff !== 0 ? 'text-red' : 'text-emerald'}" style="font-weight: 600;">
                ${row.diff > 0 ? '+' : ''}${row.diff}
            </td>
            <td><span class="badge ${row.badgeClass}">${row.estado}</span></td>
        `;
        resultsTableBody.appendChild(tr);
    });
    
    document.getElementById('merge-results-container').style.display = 'block';
    showToast('Cruce de stock finalizado');
}

function downloadMergeResults() {
    if (!mergeResultsCsvString) return;
    const blob = new Blob([mergeResultsCsvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "discrepancias_inventario.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* LIMPIADOR DE REGISTROS LOGIC */
function loadMockDirtyData() {
    const dirtyData = `SKU,Cantidad,Ubicacion\n,120,Rack A-1\nSKU-10022,,Rack A-2\n  sku-30042  ,45,\nSKU-49110,0,Rack C-3\n,10,Rack D-1\nsku-89012,23,Rack B-5`;
    document.getElementById('csv-dirty-input').value = dirtyData;
    showToast('Reporte sucio cargado');
}

function processCleanData() {
    const dirtyText = document.getElementById('csv-dirty-input').value;
    const rawData = parseCSV(dirtyText);
    
    if (rawData.length === 0) {
        alert("Por favor, introduce registros de reporte válidos.");
        return;
    }
    
    const resultsTableBody = document.querySelector('#clean-results-table tbody');
    resultsTableBody.innerHTML = '';
    
    const cleanData = [];
    cleanResultsCsvString = 'SKU,Cantidad,Ubicacion\n';
    
    rawData.forEach(row => {
        let sku = row.SKU || row.sku || '';
        let qty = row.Cantidad || row.cantidad || '';
        let ubi = row.Ubicacion || row.ubicacion || 'Sin Ubicación';
        
        // Clean SKU: Remove spaces and force uppercase
        sku = sku.trim().toUpperCase();
        
        // RULE 1: Drop empty SKU rows
        if (!sku) return;
        
        // RULE 2: Fill null quantity with 0
        if (qty === '' || isNaN(qty)) {
            qty = 0;
        } else {
            qty = parseInt(qty);
        }
        
        cleanData.push({ sku, qty, ubi });
        cleanResultsCsvString += `${sku},${qty},${ubi}\n`;
    });
    
    cleanData.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${row.sku}</strong></td>
            <td>${row.qty} u</td>
            <td>${row.ubi}</td>
        `;
        resultsTableBody.appendChild(tr);
    });
    
    document.getElementById('clean-results-container').style.display = 'block';
    showToast('Reporte limpio exitosamente');
}

function downloadCleanResults() {
    if (!cleanResultsCsvString) return;
    const blob = new Blob([cleanResultsCsvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "reporte_limpio.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/* SUPABASE SYNC LOGIC */
function syncWithSupabase() {
    const url = document.getElementById('sb-url').value.trim();
    const key = document.getElementById('sb-key').value.trim();
    const logBox = document.getElementById('sb-log');
    const logOutput = document.getElementById('sb-log-output');
    
    logBox.style.display = 'block';
    logOutput.textContent = 'Iniciando sincronización...\n';
    
    if (!url || !key) {
        logOutput.textContent += '[MOCK] Usando conexión simulada local (Sin URL ni API Key).\n';
        logOutput.textContent += '[MOCK] Conectando a base de datos de auditorías...\n';
        setTimeout(() => {
            logOutput.textContent += '[MOCK] Sincronizando tabla: "auditoria_inventario"\n';
        }, 800);
        setTimeout(() => {
            logOutput.textContent += `[MOCK] Registros cargados: 6 discrepancias insertadas.\n`;
            logOutput.textContent += '[SUCCESS] Sincronización exitosa con la nube. AppSheet puede consumir los cambios.';
            showToast('Sincronización simulada exitosa');
        }, 1600);
        return;
    }
    
    // Real Supabase Connection via REST API if provided
    logOutput.textContent += `[API] Conectando a Supabase en: ${url}\n`;
    logOutput.textContent += `[API] Creando cabeceras de autorización...\n`;
    
    // Prepare dummy payload (using current merge results or fallback data)
    let payload = [];
    if (mergeResultsCsvString) {
        const rows = parseCSV(mergeResultsCsvString);
        payload = rows.map(r => ({
            sku: r.SKU,
            cantidad_sap: parseInt(r.Cantidad_sap || 0),
            cantidad_fisico: parseInt(r.Cantidad_fisico || 0),
            diferencia: parseInt(r.Diferencia || 0)
        }));
    } else {
        payload = [{ sku: 'SKU-TEST', cantidad_sap: 100, cantidad_fisico: 95, diferencia: -5 }];
    }
    
    logOutput.textContent += `[API] Enviando payload (${payload.length} filas) a la tabla "inventario_discrepancias"...\n`;
    
    // We make a real call to supabase via REST API!
    // Endpoint: url + /rest/v1/inventario_discrepancias
    fetch(`${url}/rest/v1/inventario_discrepancias`, {
        method: 'POST',
        headers: {
            'apikey': key,
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (res.status === 201 || res.status === 200) {
            return res.json().then(data => {
                logOutput.textContent += `[SUCCESS] Datos subidos. Código de estado: ${res.status}\n`;
                logOutput.textContent += `[API] Supabase retornó: ${JSON.stringify(data)}\n`;
                showToast('¡Datos subidos a Supabase real!');
            });
        } else {
            return res.text().then(errText => {
                throw new Error(`Código ${res.status}: ${errText}`);
            });
        }
    })
    .catch(err => {
        logOutput.textContent += `[ERROR] Error en conexión: ${err.message}\n`;
        logOutput.textContent += `[TIP] Asegúrate de que la tabla "inventario_discrepancias" existe en Supabase y tiene las columnas adecuadas (sku, cantidad_sap, cantidad_fisico, diferencia).\n`;
    });
}

/* ==========================================================================
   GUIDES ENGINE
   ========================================================================== */
function switchGuide(guideName) {
    document.querySelectorAll('.mob-tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const buttons = document.querySelectorAll('.mob-tab-btn');
    if (guideName === 'android') buttons[0].classList.add('active');
    else if (guideName === 'ios') buttons[1].classList.add('active');
    
    document.querySelectorAll('.guide-content').forEach(cont => {
        cont.classList.remove('active');
    });
    document.getElementById(`guide-${guideName}`).classList.add('active');
}
