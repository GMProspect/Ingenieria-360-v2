# 🏗️ Ingeniería 360 v2

**Entorno Técnico Inteligente para Ingenieros de Campo**

> *Una suite de herramientas de ingeniería moderna, rápida y segura.*

![Ingeniería 360 Banner](https://via.placeholder.com/1200x400?text=Ingenieria+360+v2)

## 📋 Descripción

**Ingeniería 360 v2** es una aplicación web progresiva (PWA) y móvil diseñada para asistir a ingenieros y técnicos en sus tareas diarias. Combina calculadoras técnicas precisas, simuladores interactivos y una gestión de inventario robusta, todo bajo una interfaz moderna estilo *Cyberpunk* que prioriza la usabilidad y la estética.

Esta versión **v2** ha sido reescrita desde cero utilizando tecnologías web modernas para garantizar escalabilidad, rendimiento y una experiencia de usuario premium.

## ✨ Características Principales

### 🛠️ Herramientas de Cálculo y Simulación
*   **⚡ Ley de Ohm Interactiva**: Calculadora visual triangular para voltaje, corriente y resistencia.
*   **📡 Transmisor 4-20mA**: Conversión y escalado bidireccional de señales de instrumentación (PV ↔ mA).
*   **〰️ Análisis de Vibración**: Conversión de voltaje de GAP a distancia (Mils/Micras) según norma API 670.
*   **🌡️ Sensores de Temperatura**: Simulación de RTD (Pt100) y Termopares.
*   **🔧 Conversor de Llaves**: Herramienta visual para equivalencias entre milímetros y pulgadas, con guía de seguridad y ajuste.
*   **📈 Curvas de Saturación**: Graficador interactivo para análisis de excitación en generadores.
*   **🎛️ Modelos PSS**: Diagramas de bloques interactivos para sistemas de potencia (PSS1A, PSS4B).

### 📦 Gestión y Utilidades
*   **🔐 Autenticación Segura**: Inicio de sesión exclusivo con **Google OAuth** (vía Supabase).
*   **🎒 Inventario Personal**: Base de datos de equipos con especificaciones técnicas, fotos y etiquetas.
*   **💾 Historial en la Nube**: Todos los cálculos se guardan automáticamente, aislados por usuario.
*   **🌍 Multi-idioma**: Soporte internacional (Español/Inglés) con detección automática.
*   **📱 Soporte Móvil**: Diseño 100% responsivo y compilación nativa para Android.

## 🛠️ Stack Tecnológico

Este proyecto ha sido construido con las mejores herramientas del ecosistema moderno:

### Frontend & Core
*   **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Lenguaje**: JavaScript (ESNext)
*   **Estilos**: [Tailwind CSS](https://tailwindcss.com/) (Diseño responsivo, Grid/Flexbox, Dark Mode)
*   **Iconos**: [Lucide React](https://lucide.dev/)
*   **Gráficos**: [Recharts](https://recharts.org/) (Visualización de datos)
*   **Internacionalización**: [i18next](https://www.i18next.com/)

### Backend & Servicios
*   **BaaS**: [Supabase](https://supabase.com/)
    *   **Auth**: Google OAuth 2.0
    *   **Database**: PostgreSQL con Row Level Security (RLS)
    *   **Storage**: Almacenamiento de imágenes de inventario
*   **Monetización**: Google AdSense

### Móvil & Despliegue
*   **Móvil**: [Capacitor](https://capacitorjs.com/) (Runtime nativo para Android)
*   **Hosting**: Vercel (CI/CD automático)

## 🚀 Instalación y Despliegue

### Requisitos Previos
*   Node.js (v18+)
*   Cuenta en Supabase (para las variables de entorno)
*   Android Studio (opcional, para compilar APK)

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

5.  Compilar para Android (requiere configuración de Capacitor):
    ```bash
    npx cap sync
    npx cap open android
    ```

## ⚖️ Legal

*   **Política de Privacidad**: Consultar `/privacy-policy` en la aplicación.
*   **Términos de Servicio**: Consultar `/terms-of-service` en la aplicación.

## 👤 Autor

**Gustavo Matheus**
*   Ingeniero de Proyecto & Desarrollador Full Stack

---
© 2025 Ingeniería 360. Todos los derechos reservados.
