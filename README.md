# Portal Móvil: Python para Inventarios

¡Bienvenido a tu aplicación de aprendizaje y panel de herramientas para la automatización de inventarios! 

Esta aplicación web responsiva (Mobile-first) ha sido diseñada específicamente para ti, un **Supervisor de Inventarios**. Te servirá para estudiar el temario personalizado de Python, simular la ejecución de tus scripts y realizar cruces de reportes de diferencias o limpieza de SKU directamente en tu teléfono móvil.

---

## Cómo Ejecutar el Portal en tu Computadora y tu Móvil

### Opción 1: Abrir Directamente en PC
1. Navega a esta carpeta en el explorador de archivos:
   `C:\Users\usuniaga\.gemini\antigravity\scratch\inventario-python-curso`
2. Haz doble clic en el archivo `index.html`. Se abrirá en tu navegador web.
3. Para verlo con formato móvil, presiona `F12` en el navegador (Chrome, Edge, Firefox) y activa el **Modo Dispositivo Móvil** (ícono de teléfono/tablet).

### Opción 2: Abrir desde tu Celular (Mismo Wi-Fi)
Para poder usar la aplicación en tu celular físico en tiempo real, puedes levantar un servidor web local super simple desde tu PC:

1. **Abre la terminal en esta carpeta:**
   Abre PowerShell o Símbolo del Sistema en esta ruta:
   `C:\Users\usuniaga\.gemini\antigravity\scratch\inventario-python-curso`
   
2. **Corre un servidor web rápido con Python:**
   Dado que ya tienes Python (o lo vas a usar), ejecuta este comando simple en tu consola:
   ```bash
   python -m http.server 8000
   ```
   *(Esto levantará un servidor local en el puerto 8000).*

3. **Busca la IP local de tu PC:**
   En Windows, abre otra terminal y escribe:
   ```bash
   ipconfig
   ```
   Busca la dirección IPv4 (usualmente se ve como `192.168.1.XX` o `192.168.0.XX`).

4. **Entra desde tu Móvil:**
   Asegúrate de que tu celular esté conectado a la **misma red Wi-Fi** que tu computadora. Abre el navegador de tu celular (Safari, Chrome) y entra a:
   `http://[TU-IP-LOCAL]:8000`
   
   *Ejemplo:* `http://192.168.1.15:8000`
   
   ¡Listo! Verás la aplicación corriendo de forma nativa en tu celular con un rendimiento del 100%.

---

## Uso de las Utilidades Reales

En la pestaña **Herramientas** del menú inferior del portal móvil, tendrás acceso a:

1. **Cruce de Reportes (Físico vs SAP):**
   * Presiona el botón "Cargar datos de prueba de almacén".
   * Haz clic en **Cruzar Inventarios**.
   * Verás la tabla con diferencias y estados (Faltante / Sobrante). Puedes presionar "Descargar CSV" para exportar el resultado limpio.
2. **Limpiador de SKU y Nulos:**
   * Carga el reporte sucio de prueba y presiona **Limpiar Reporte**. Filtrará filas vacías y formateará los códigos.
3. **Supabase Sync:**
   * Si quieres probar una conexión real, crea un proyecto gratuito en Supabase, crea una tabla llamada `inventario_discrepancias` con las columnas `sku` (text), `cantidad_sap` (int), `cantidad_fisico` (int), y `diferencia` (int).
   * Coloca tu URL y API Key en el panel del portal, ¡y presiona sincronizar! Verás cómo los datos se suben a tu Supabase en tiempo real.
