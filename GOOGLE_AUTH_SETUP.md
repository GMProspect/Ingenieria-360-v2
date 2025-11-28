# Configuración de Google Auth en Supabase

Para que el botón "Iniciar con Google" funcione, necesitas configurar el proveedor en Supabase.

## 1. Obtener Credenciales de Google
1. Ve a [Google Cloud Console](https://console.cloud.google.com/).
2. Selecciona tu proyecto en la parte superior.
3. Si ves una pantalla que dice "Google Auth Platform not configured yet", haz clic en **Get started**.
4. Rellena la información básica:
    - **App name**: "Ingeniería 360" (o lo que prefieras).
    - **User support email**: Tu correo.
    - Dale a **Next**.
5. En **Audience**, selecciona **External** (esto permite que cualquiera con una cuenta de Google entre). Dale a **Next**.
6. En **Contact Information**, pon tu email de nuevo. Dale a **Finish** (o Create).
7. Ahora ve al menú de la izquierda y entra en **Clients** (o Credentials).
8. Haz clic en **Create Client** (o Create Credentials > OAuth client ID).
    - **Application type**: Web application.
    - **Name**: "Supabase Login" (opcional).
    - **Authorized JavaScript origins**: `https://<tu-proyecto>.supabase.co` (Copia esto de tu Supabase URL).
    - **Authorized redirect URIs**: `https://<tu-proyecto>.supabase.co/auth/v1/callback`.
9. Dale a **Create** y copia el **Client ID** y el **Client Secret**.

## 2. Configurar Supabase
1. Ve a tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard).
2. En el menú de la izquierda, bajo **Configuration**, haz clic en **Sign In / Providers**.
3. Busca **Google** en la lista y ábrelo (haz clic en "Google").
4. Activa el switch **Enable Sign in with Google**.
5. Pega el **Client ID** y **Client Secret** que obtuviste en el paso anterior.
6. Dale a **Save**.

## 3. URL del Sitio (Importante para desarrollo local)
1. En Supabase, ve a **Authentication** > **URL Configuration**.
2. En **Site URL**, asegúrate de poner: `http://localhost:5173` (o el puerto donde corra tu Vite).
3. En **Redirect URLs**, añade también `http://localhost:5173/**`.

¡Listo! Ahora el botón de Google debería funcionar.
