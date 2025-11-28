# 🏗️ Ingeniería 360 v2

**Entorno Técnico Inteligente para Ingenieros de Campo**

> *Una suite de herramientas de ingeniería moderna, rápida y segura.*

![Ingeniería 360 Banner](https://via.placeholder.com/1200x400?text=Ingenieria+360+v2)

## 📋 Descripción

**Ingeniería 360 v2** es una aplicación web progresiva (PWA) diseñada para asistir a ingenieros y técnicos en sus tareas diarias. Combina calculadoras técnicas precisas con una gestión de inventario robusta, todo bajo una interfaz moderna estilo *Cyberpunk* que prioriza la usabilidad y la estética.

Esta versión **v2** ha sido reescrita desde cero utilizando tecnologías web modernas para garantizar escalabilidad, rendimiento y una experiencia de usuario premium.

## ✨ Características Principales

*   **🔐 Autenticación Segura**: Inicio de sesión exclusivo con **Google OAuth** (vía Supabase).
*   **📦 Gestión de Inventario**: Base de datos de equipos con especificaciones técnicas y fotos.
*   **⚡ Ley de Ohm Interactiva**: Calculadora visual triangular para voltaje, corriente y resistencia.
*   **📡 Transmisor 4-20mA**: Conversión y escalado de señales de instrumentación (PV ↔ mA).
*   **〰️ Análisis de Vibración**: Conversión de voltaje de GAP a distancia (Mils/Micras) según norma API 670.
*   **🔄 Conversor Universal**: Herramienta todo en uno para presión, temperatura, longitud y peso.
*   **💾 Historial en la Nube**: Todos los cálculos se guardan automáticamente en la nube, aislados por usuario.

## 🛠️ Stack Tecnológico

Este proyecto ha sido construido con las mejores herramientas del ecosistema React:

*   **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Estilos**: [Tailwind CSS](https://tailwindcss.com/) (Diseño responsivo y tema oscuro)
*   **Iconos**: [Lucide React](https://lucide.dev/) + SVG Customizados
*   **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
*   **Navegación**: React Router v6

## 🚀 Instalación y Despliegue

### Requisitos Previos
*   Node.js (v18+)
*   Cuenta en Supabase (para las variables de entorno)

### Pasos
1.  Clonar el repositorio:
    ```bash
    git clone https://github.com/GMProspect/Ingenieria-360-v2.git
    cd Ingenieria-360-v2
    ```

2.  Instalar dependencias:
    ```bash
    npm install
    ```

3.  Configurar variables de entorno (`.env`):
    ```env
    VITE_SUPABASE_URL=tu_url_de_supabase
    VITE_SUPABASE_ANON_KEY=tu_clave_anonima
    ```

4.  Iniciar servidor de desarrollo:
    ```bash
    npm run dev
    ```

## 👤 Autor

**Gustavo Matheus**
*   Ingeniero de Proyecto & Desarrollador Full Stack

---
© 2025 Ingeniería 360. Todos los derechos reservados.
