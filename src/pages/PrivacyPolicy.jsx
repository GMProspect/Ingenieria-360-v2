import React from 'react';
import BackButton from '../components/BackButton';

const PrivacyPolicy = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <BackButton />

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
                <h1 className="text-3xl font-bold text-cyan-400 mb-6">Política de Privacidad</h1>
                <p className="text-slate-400 text-sm mb-8">Última actualización: 28 de noviembre de 2024</p>

                <div className="space-y-6 text-slate-300">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Información que Recopilamos</h2>
                        <p className="mb-2">En Ingeniería 360, recopilamos la siguiente información:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li><strong>Información de cuenta:</strong> Email y nombre proporcionados al registrarte con Google OAuth.</li>
                            <li><strong>Datos de uso:</strong> Cálculos guardados, inventario de equipos, y preferencias de la aplicación.</li>
                            <li><strong>Información técnica:</strong> Dirección IP, tipo de navegador, y datos de uso anónimos para mejorar el servicio.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Cómo Usamos tu Información</h2>
                        <p className="mb-2">Utilizamos tus datos para:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Proveer y mejorar nuestros servicios de calculadoras de ingeniería.</li>
                            <li>Guardar tu inventario de equipos y historial de cálculos de forma segura.</li>
                            <li>Personalizar tu experiencia en la aplicación.</li>
                            <li>Enviar notificaciones importantes sobre cambios en el servicio (solo cuando sea necesario).</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Compartir Información</h2>
                        <p>No vendemos ni compartimos tu información personal con terceros, excepto:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                            <li><strong>Proveedores de servicios:</strong> Supabase (base de datos), Vercel (hosting).</li>
                            <li><strong>Publicidad:</strong> Google AdSense muestra anuncios personalizados basados en cookies.</li>
                            <li><strong>Requisitos legales:</strong> Si la ley lo requiere.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Seguridad de Datos</h2>
                        <p>Implementamos medidas de seguridad para proteger tu información:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                            <li>Autenticación mediante Google OAuth (seguro y confiable).</li>
                            <li>Row Level Security (RLS) en Supabase para aislar datos de usuarios.</li>
                            <li>Cifrado SSL/TLS en todas las comunicaciones.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Cookies y Tecnologías Similares</h2>
                        <p>Utilizamos cookies para:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                            <li>Mantener tu sesión activa.</li>
                            <li>Recordar tus preferencias (idioma, tema, etc.).</li>
                            <li>Google AdSense utiliza cookies para mostrar anuncios relevantes.</li>
                        </ul>
                        <p className="mt-2">Puedes desactivar las cookies en tu navegador, pero esto puede afectar la funcionalidad de la aplicación.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Tus Derechos</h2>
                        <p className="mb-2">Tienes derecho a:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Acceder, actualizar o eliminar tu información personal.</li>
                            <li>Exportar tus datos guardados (inventario, historial).</li>
                            <li>Revocar el acceso de Google OAuth en cualquier momento.</li>
                            <li>Solicitar la eliminación completa de tu cuenta y datos asociados.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Google AdSense</h2>
                        <p>Esta aplicación utiliza Google AdSense para mostrar anuncios. Google puede utilizar cookies para personalizar los anuncios según tu historial de navegación. Puedes gestionar tus preferencias de anuncios en <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Configuración de Anuncios de Google</a>.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Cambios a esta Política</h2>
                        <p>Podemos actualizar esta Política de Privacidad ocasionalmente. Te notificaremos de cambios importantes mediante un aviso en la aplicación. La fecha de "Última actualización" se modificará para reflejar los cambios.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">9. Contacto</h2>
                        <p>Si tienes preguntas sobre esta Política de Privacidad, contáctanos a través del formulario de feedback en la aplicación.</p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
