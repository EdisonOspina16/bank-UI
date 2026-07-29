export type FeatureId =
  | 'prestamos'
  | 'tarjetas'
  | 'tmr'
  | 'condiciones'
  | 'virtual'
  | 'simulacion';

export interface FeatureItem {
  id: FeatureId;
  title: string;
  shortTitle: string;
  desc: string;
  shortDesc: string;
  image: string;
}

/** Shared feature catalog used by landing + /simulator */
export const FEATURES: FeatureItem[] = [
  {
    id: 'prestamos',
    title: 'PRÉSTAMOS',
    shortTitle: 'Préstamos',
    desc: 'Obtén el respaldo que necesitas con opciones claras, flexibles y pensadas para tus proyectos.',
    shortDesc: 'Respaldo flexible y claro',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'tarjetas',
    title: 'TARJETAS DE CRÉDITO',
    shortTitle: 'Tarjetas de crédito',
    desc: 'Compra lo que necesitas con una tarjeta diseñada para acompañar tu día a día.',
    shortDesc: 'Límites y seguridad',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'tmr',
    title: 'TRM DEL DÍA SI COMPRO EN DÓLARES',
    shortTitle: 'TMR del día',
    desc: 'Consulta el tipo de cambio del día y conoce cuánto pagarás cuando compres en dólares.',
    shortDesc: 'Tasa representativa oficial',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'condiciones',
    title: 'TARJETA DE CRÉDITO CONDICIONES ESPECÍFICAS',
    shortTitle: 'Condiciones',
    desc: 'Encuentra una opción que se ajuste a tus necesidades, con condiciones transparentes desde el inicio.',
    shortDesc: 'Términos del producto',
    image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'virtual',
    title: 'TARJETA VIRTUAL COMO SE REPRESENTA',
    shortTitle: 'Tarjeta virtual',
    desc: 'Visualiza y administra tu tarjeta virtual desde la app para comprar de forma rápida y segura.',
    shortDesc: 'CVV dinámico seguro',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=85',
  },
  {
    id: 'simulacion',
    title: 'SIMULADOR TRM',
    shortTitle: 'Simulador TRM',
    desc: 'Calcula el costo real de tus compras en dólares antes de pagar con tu tarjeta Jes Bank.',
    shortDesc: 'Calcula compras en dólares',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=85',
  },
];

export const LANDING_FEATURES = FEATURES.filter((f) => f.id !== 'simulacion');
