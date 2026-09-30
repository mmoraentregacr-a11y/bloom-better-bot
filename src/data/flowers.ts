export const flowers = [
  { sku: "FLR-ROSA-ROJA", label: "Rosa roja", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/rosa-roja.png" },
  { sku: "FLR-ROSA-ROSA", label: "Rosa rosa", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/rosa-rosa.png" },
  { sku: "FLR-ROSA-BLANCA", label: "Rosa blanca", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/rosa-blanca.png" },
  { sku: "FLR-ROSA-AMARILLA", label: "Rosa amarilla", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/rosa-amarilla.png" },
  { sku: "FLR-GERBERA-ROSA", label: "Gerbera rosa", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/gerbera-rosa.png" },
  { sku: "FLR-GERBERA-BLANCA", label: "Gerbera blanca", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/gerbera-blanca.png" },
  { sku: "FLR-GERBERA-AMARILLA", label: "Gerbera amarilla", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/gerbera-amarilla.png" },
  { sku: "FLR-CLAVEL-ROJO", label: "Clavel rojo", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/clavel-rojo.png" },
  { sku: "FLR-CLAVEL-BLANCO", label: "Clavel blanco", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/clavel-blanco.png" },
  { sku: "FLR-CLAVEL-ROSA", label: "Clavel rosa", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/clavel-rosa.png" },
  { sku: "FLR-GIRASOL-AMARILLO", label: "Girasol amarillo", image: "https://grupoentregafotos.blob.core.windows.net/productos/flores/girasol-amarillo.png" },
];

export const flowerBySku = new Map(flowers.map(flower => [flower.sku, flower]));
