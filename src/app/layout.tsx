import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Jes Bank | El dinero, sin límites',
  description: 'Banca digital para el mundo moderno. Abre una cuenta en minutos y maneja tus divisas sin comisiones ocultas.',
};

export default function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
