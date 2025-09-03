export type Tienda = {
    id: number;
    nombre: string;
    descripcion: string;
    logo: string;
    url: string;
    categoria: string;
};

const TIENDAS: Tienda[] = [
    {
        id: 1,
        nombre: "Falabella",
        descripcion: "La tienda departamental líder en Chile con moda, tecnología, hogar y más.",
        logo: "/api/placeholder/200/120", // placeholder - reemplaza con tu logo real
        url: "https://www.falabella.com",
        categoria: "Retail General"
      },
      {
        id: 2,
        nombre: "Ripley",
        descripcion: "Gran variedad en moda, electrónica, hogar y deportes con las mejores marcas.",
        logo: "/api/placeholder/200/120",
        url: "https://www.ripley.cl",
        categoria: "Retail General"
      },
      {
        id: 3,
        nombre: "Paris",
        descripcion: "Tienda departamental con productos de moda, belleza, hogar y tecnología.",
        logo: "/api/placeholder/200/120",
        url: "https://www.paris.cl",
        categoria: "Retail General"
      },
      {
        id: 4,
        nombre: "La Polar",
        descripcion: "Productos para el hogar, moda y tecnología con facilidades de pago.",
        logo: "/api/placeholder/200/120",
        url: "https://www.lapolar.cl",
        categoria: "Retail General"
      },
      {
        id: 5,
        nombre: "Lider",
        descripcion: "Supermercado líder con productos de alimentación, hogar y más.",
        logo: "/api/placeholder/200/120",
        url: "https://www.lider.cl",
        categoria: "Supermercado"
      },
      {
        id: 6,
        nombre: "Jumbo",
        descripcion: "Hipermercado con gran variedad de productos alimentarios y para el hogar.",
        logo: "/api/placeholder/200/120",
        url: "https://www.jumbo.cl",
        categoria: "Supermercado"
      },
      {
        id: 7,
        nombre: "PC Factory",
        descripcion: "Especialistas en tecnología, computadores, componentes y gaming.",
        logo: "/api/placeholder/200/120",
        url: "https://www.pcfactory.cl",
        categoria: "Tecnología"
      },
      {
        id: 8,
        nombre: "Hites",
        descripcion: "Tienda con productos de moda, hogar, deportes y tecnología.",
        logo: "/api/placeholder/200/120",
        url: "https://www.hites.com",
        categoria: "Retail General"
      },
      {
        id: 9,
        nombre: "Decathlon",
        descripcion: "Tienda con productos de Deporte, Ropa",
        logo: "/api/placeholder/200/120",
        url: "https://www.decathlon.cl",
        categoria: "Retail Deportivo"
      },
      {
        id: 10,
        nombre: "Ikea",
        descripcion: "Tienda de muebles y decoración para el hogar.",
        logo: "/api/placeholder/200/120",
        url: "https://www.ikea.cl",
        categoria: "Home Depot"
      },
      {
        id: 11,
        nombre: "Sodimac",
        descripcion: "Tienda de construcción y mejoramiento del hogar.",
        logo: "/api/placeholder/200/120",
        url: "https://www.sodimac.cl",
        categoria: "Home Depot"
      }
    ];

export const totalTiendas = () => TIENDAS.length;


export function getTiendas(limit?: number): Tienda[] {
if (typeof limit === "number" && Number.isFinite(limit)) {
    const n = Math.max(0, Math.min(TIENDAS.length, Math.floor(limit)));
    return TIENDAS.slice(0, n);
}
return TIENDAS;
}