export const balloons = [
  ...Array.from({ length: 5 }, (_, index) => ({ code: `MAMA-${index + 1}`, label: `Feliz Día Mamá ${index + 1}`, image: `https://grupoentregafotos.blob.core.windows.net/productos/globos/15Agosto${index + 1}.jpg` })),
  ...Array.from({ length: 5 }, (_, index) => ({ code: `GRAD-${index + 1}`, label: `Graduación ${index + 1}`, image: `https://grupoentregafotos.blob.core.windows.net/productos/globos/grad${index + 1}.jpg` })),
  ...Array.from({ length: 6 }, (_, index) => ({ code: `CUMPLE-${index + 1}`, label: `Feliz Cumpleaños ${index + 1}`, image: `https://grupoentregafotos.blob.core.windows.net/productos/globos/hb${index + 1}.jpg` })),
  ...Array.from({ length: 6 }, (_, index) => ({ code: `AMOR-${index + 1}`, label: `Amor ${index + 1}`, image: `https://grupoentregafotos.blob.core.windows.net/productos/globos/love${index + 1}.jpg` })),
  
  { code: "SB-1", label: "Estrella Rosa Claro", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sb1.jpg" },
  { code: "SB-2", label: "Estrella Fucsia", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sb2.jpg" },
  { code: "SB-3", label: "Estrella Fucsia Holográfica", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sb3.jpg" },
  { code: "SG-1", label: "Estrella Oro Rosa", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sg1.jpg" },
  { code: "SG-2", label: "Estrella Morada", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sg2.jpg" },
  { code: "SG-3", label: "Estrella Morada Holográfica", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sg3.jpg" },
  { code: "SP-1", label: "Estrella Champán", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sp1.jpg" },
  { code: "SP-2", label: "Estrella Plateada", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sp2.jpg" },
  { code: "SP-3", label: "Estrella Dorada Holográfica", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sp3.jpg" },
  { code: "SP-4", label: "Estrella Dorada", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sp4.jpg" },
  { code: "SP-5", label: "Estrella Roja", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sp5.jpg" },
  { code: "SP-6", label: "Estrella Turquesa", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sp6.jpg" },
  { code: "SP-7", label: "Estrella Azul", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sp7.jpg" },
  { code: "SR-1", label: "Estrella Verde", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/sr1.jpg" },
  { code: "SS-1", label: "Estrella Negra", image: "https://grupoentregafotos.blob.core.windows.net/productos/globos/ss1.jpg" },
].map(balloon => ({ ...balloon, sku: `ADD-GLOBO-${balloon.code}` }));

export const balloonBySku = new Map(balloons.map(balloon => [balloon.sku, balloon]));
