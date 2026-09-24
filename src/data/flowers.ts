export const flowers = [
  { sku: "FLR-ROSA-ROJA", label: "Rosa roja", image: "/productos/flores/rosa-roja.png" },
  { sku: "FLR-ROSA-ROSA", label: "Rosa rosa", image: "/productos/flores/rosa-rosa.png" },
  { sku: "FLR-ROSA-BLANCA", label: "Rosa blanca", image: "/productos/flores/rosa-blanca.png" },
  { sku: "FLR-ROSA-AMARILLA", label: "Rosa amarilla", image: "/productos/flores/rosa-amarilla.png" },
  { sku: "FLR-GERBERA-ROSA", label: "Gerbera rosa", image: "/productos/flores/gerbera-rosa.png" },
  { sku: "FLR-GERBERA-BLANCA", label: "Gerbera blanca", image: "/productos/flores/gerbera-blanca.png" },
  { sku: "FLR-GERBERA-AMARILLA", label: "Gerbera amarilla", image: "/productos/flores/gerbera-amarilla.png" },
  { sku: "FLR-CLAVEL-ROJO", label: "Clavel rojo", image: "/productos/flores/clavel-rojo.png" },
  { sku: "FLR-CLAVEL-BLANCO", label: "Clavel blanco", image: "/productos/flores/clavel-blanco.png" },
  { sku: "FLR-CLAVEL-ROSA", label: "Clavel rosa", image: "/productos/flores/clavel-rosa.png" },
  { sku: "FLR-GIRASOL-AMARILLO", label: "Girasol amarillo", image: "/productos/flores/girasol-amarillo.png" },
];

export const flowerBySku = new Map(flowers.map(flower => [flower.sku, flower]));
