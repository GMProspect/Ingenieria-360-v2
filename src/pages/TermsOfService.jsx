import React from 'react';
import BackButton from '../components/BackButton';

const TermsOfService = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <BackButton />

            <div className="bg-slate-900/50 p-8 rounded-2xl border border-white/5 backdrop-blur-sm shadow-xl">
                <h1 className="text-3xl font-bold text-cyan-400 mb-6">Términos de Servicio</h1>
                <p className="text-slate-400 text-sm mb-8">Última actualización: 28 de noviembre de 2024</p>

                <div className="space-y-6 text-slate-300">
                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">1. Aceptación de los Términos</h2>
                        <p>Al acceder y utilizar Ingeniería 360, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestra aplicación.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">2. Descripción del Servicio</h2>
                        <p>Ingeniería 360 es una plataforma web que proporciona herramientas y calculadoras para profesionales de ingeniería, incluyendo:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                            <li>Calculadoras de ingeniería (Ley de Ohm, Transmisores 4-20mA, Vibración API 670, Convertidor de unidades, etc.)</li>
                            <li>Gestión de inventario de equipos</li>
                            <li>Historial de cálculos guardados</li>
                            <li>Herramientas de conversión de medidas</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">3. Registro y Cuenta</h2>
                        <p className="mb-2">Para utilizar ciertas funciones de la aplicación, debes:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Registrarte utilizando Google OAuth.</li>
                            <li>Proporcionar información precisa y actualizada.</li>
                            <li>Mantener la seguridad de tu cuenta y no compartir tus credenciales.</li>
                            <li>Notificarnos inmediatamente si sospechas de un uso no autorizado de tu cuenta.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">4. Uso Aceptable</h2>
                        <p className="mb-2">Al utilizar Ingeniería 360, te comprometes a:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Utilizar la aplicación solo para fines legales y profesionales.</li>
                            <li>No intentar acceder, modificar o comprometer la seguridad del sistema.</li>
                            <li>No utilizar la aplicación para distribuir malware o contenido dañino.</li>
                            <li>No sobrecargar intencionalmente nuestros servidores.</li>
                            <li>No intentar acceder a datos de otros usuarios.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">5. Precisión de los Cálculos</h2>
                        <p className="mb-2"><strong>IMPORTANTE:</strong> Las calculadoras y herramientas proporcionadas son para fines informativos y educativos.</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                            <li>No garantizamos la precisión absoluta de todos los cálculos.</li>
                            <li>Los resultados deben ser verificados por profesionales calificados antes de su aplicación en proyectos críticos.</li>
                            <li>No somos responsables de decisiones tomadas basándose únicamente en nuestros cálculos.</li>
                            <li>Recomendamos siempre consultar con ingenieros certificados para aplicaciones críticas.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">6. Propiedad Intelectual</h2>
                        <p>Todo el contenido de Ingeniería 360, incluyendo diseño, código, logos, y herramientas, es propiedad de Ingeniería 360 y está protegido por leyes de propiedad intelectual. No puedes:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                            <li>Copiar, modificar o distribuir nuestro código sin permiso.</li>
                            <li>Utilizar nuestro nombre, logo o marca para otros proyectos.</li>
                            <li>Realizar ingeniería inversa de la aplicación.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">7. Contenido del Usuario</h2>
                        <p>Al guardar cálculos, inventario o cualquier dato en la aplicación:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                            <li>Conservas la propiedad de tu información.</li>
                            <li>Nos otorgas permiso para almacenar y procesar tus datos según nuestra Política de Privacidad.</li>
                            <li>Eres responsable del contenido que guardas.</li>
                            <li>No debes almacenar información sensible de seguridad nacional o datos clasificados.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">8. Publicidad</h2>
                        <p>La aplicación muestra anuncios mediante Google AdSense para mantener el servicio gratuito. Al utilizar la aplicación, aceptas la visualización de estos anuncios.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">9. Limitación de Responsabilidad</h2>
                        <p className="mb-2">Ingeniería 360 se proporciona "tal cual" y "según disponibilidad". No garantizamos:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Disponibilidad ininterrumpida del servicio.</li>
                            <li>Ausencia de errores en los cálculos.</li>
                            <li>Compatibilidad con todos los dispositivos y navegadores.</li>
                        </ul>
                        <p className="mt-3"><strong>NO SOMOS RESPONSABLES</strong> por daños directos, indirectos, incidentales o consecuentes derivados del uso de la aplicación.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">10. Modificaciones del Servicio</h2>
                        <p>Nos reservamos el derecho de:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                            <li>Modificar, suspender o discontinuar la aplicación en cualquier momento.</li>
                            <li>Cambiar estos Términos de Servicio con previo aviso.</li>
                            <li>Agregar o eliminar funcionalidades.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">11. Terminación</h2>
                        <p>Podemos suspender o terminar tu acceso a la aplicación si:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                            <li>Violas estos Términos de Servicio.</li>
                            <li>Realizas actividades fraudulentas o ilegales.</li>
                            <li>Intentas comprometer la seguridad del sistema.</li>
                        </ul>
                        <p className="mt-2">Puedes eliminar tu cuenta en cualquier momento a través de la configuración de la aplicación.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">12. Ley Aplicable</h2>
                        <p>Estos términos se rigen por las leyes aplicables en tu jurisdicción. Cualquier disputa se resolverá mediante arbitraje o en los tribunales competentes.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-white mb-3">13. Contacto</h2>
                        <p>Si tienes preguntas sobre estos Términos de Servicio, contáctanos a través del formulario de feedback en la aplicación.</p>
                    </section>

                    <section className="mt-8 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl">
                        <p className="text-sm text-slate-400">
                            <strong className="text-cyan-400">Nota:</strong> Al utilizar Ingeniería 360, reconoces que has leído, entendido y aceptado estos Términos de Servicio y nuestra Política de Privacidad.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
