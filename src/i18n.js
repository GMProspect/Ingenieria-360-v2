import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Traducciones - Español (base)
const es = {
    // Navegación
    home: 'Inicio',
    inventory: 'Inventario',
    history: 'Historial',
    tools: 'Herramientas',
    logout: 'Cerrar Sesión',

    // Herramientas
    ohmsLaw: 'Ley de Ohm',
    vibrationProbe: 'Sonda de Vibración',
    transmitter: 'Transmisor 4-20mA',
    converter: 'Conversor Universal',
    wrenchConverter: 'Referencia de Llaves',

    // Común
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    clear: 'Limpiar',
    reset: 'Reiniciar',
    label: 'Etiqueta',
    description: 'Descripción',

    // Footer
    dedication: 'Dedicado a todos los ingenieros y técnicos que día a día arriesgan su seguridad y esfuerzo para mantener el mundo en movimiento.'
};

// Traducciones - Inglés
const en = {
    // Navigation
    home: 'Home',
    inventory: 'Inventory',
    history: 'History',
    tools: 'Tools',
    logout: 'Logout',

    // Tools
    ohmsLaw: "Ohm's Law",
    vibrationProbe: 'Vibration Probe',
    transmitter: '4-20mA Transmitter',
    converter: 'Universal Converter',
    wrenchConverter: 'Wrench Reference',

    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    clear: 'Clear',
    reset: 'Reset',
    label: 'Label',
    description: 'Description',

    // Footer
    dedication: 'Dedicated to all engineers and technicians who risk their safety and effort daily to keep the world moving.'
};

// Traducciones - Portugués
const pt = {
    home: 'Início',
    inventory: 'Inventário',
    history: 'Histórico',
    tools: 'Ferramentas',
    logout: 'Sair',
    ohmsLaw: 'Lei de Ohm',
    vibrationProbe: 'Sonda de Vibração',
    transmitter: 'Transmissor 4-20mA',
    converter: 'Conversor Universal',
    wrenchConverter: 'Referência de Chaves',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    clear: 'Limpar',
    reset: 'Reiniciar',
    label: 'Etiqueta',
    description: 'Descrição',
    dedication: 'Dedicado a todos os engenheiros e técnicos que arriscam sua segurança e esforço diariamente para manter o mundo em movimento.'
};

i18n
    .use(initReactI18next)
    .init({
        resources: {
            es: { translation: es },
            en: { translation: en },
            pt: { translation: pt }
        },
        lng: 'es', // idioma por defecto
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
