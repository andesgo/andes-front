import Image from "next/image";

export default function Footer() {
  return (
    <footer id="contacto" className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/andes_logo.png"
                alt="AndesGO Logo"
                width={60}
                height={60}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold">AndesGO</span>
            </div>
            <p className="text-gray-400">
              Tu servicio de casilla personal en Chile.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Servicios</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Personal Shopping</li>
              <li>Logística Completa</li>
              <li>Entrega en Hotel</li>
              <li>Retiro en Oficina</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Soporte</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Centro de Ayuda</li>
              <li>Política de Devoluciones</li>
              <li>Términos y Condiciones</li>
              <li>Privacidad</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>andesgoshopping@gmail.com</li>
              <li>+56 9 8287 6757</li>
              <li>Santiago, Chile</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 AndesGO. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
