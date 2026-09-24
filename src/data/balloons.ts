export const balloons = [
  ...Array.from({ length: 5 }, (_, index) => ({ code: `MAMA-${index + 1}`, label: `Feliz Día Mamá ${index + 1}`, image: `/productos/globos/15Agosto${index + 1}.jpg` })),
  ...Array.from({ length: 5 }, (_, index) => ({ code: `GRAD-${index + 1}`, label: `Graduación ${index + 1}`, image: `/productos/globos/grad${index + 1}.jpg` })),
  ...Array.from({ length: 6 }, (_, index) => ({ code: `CUMPLE-${index + 1}`, label: `Feliz Cumpleaños ${index + 1}`, image: `/productos/globos/hb${index + 1}.jpg` })),
  ...Array.from({ length: 6 }, (_, index) => ({ code: `AMOR-${index + 1}`, label: `Amor ${index + 1}`, image: `/productos/globos/love${index + 1}.jpg` })),
].map(balloon => ({ ...balloon, sku: `ADD-GLOBO-${balloon.code}` }));

export const balloonBySku = new Map(balloons.map(balloon => [balloon.sku, balloon]));
