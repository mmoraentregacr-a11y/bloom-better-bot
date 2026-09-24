type KoreanPaper = { photo: number; color: string; swatch: string; accent?: string; pattern?: "geometric" | "border" | "dots" };

export const koreanPapers: KoreanPaper[] = [
  { photo: 4161, color: "Verde menta", swatch: "#b5c6ae" },
  { photo: 4163, color: "Verde petróleo", swatch: "#526b69" },
  { photo: 4164, color: "Verde menta y dorado", swatch: "#b7cbb0", accent: "#bc963d" },
  { photo: 4165, color: "Lila geométrico dorado", swatch: "#c4acc7", accent: "#bc963d", pattern: "geometric" },
  { photo: 4166, color: "Lila claro", swatch: "#d4cbd8" },
  { photo: 4167, color: "Blanco geométrico dorado", swatch: "#faf8ed", accent: "#bc963d", pattern: "geometric" },
  { photo: 4168, color: "Morado y fucsia", swatch: "#582c55", accent: "#d31571" },
  { photo: 4169, color: "Fucsia y rosa", swatch: "#ce478c", accent: "#f3b6cb" },
  { photo: 4170, color: "Rosa y crema", swatch: "#dc9da9", accent: "#f4dfb7" },
  { photo: 4171, color: "Celeste claro", swatch: "#c7dbe0" },
  { photo: 4172, color: "Blanco geométrico negro", swatch: "#f5f5f2", accent: "#282828", pattern: "geometric" },
  { photo: 4173, color: "Azul grisáceo y plata", swatch: "#67788b", accent: "#d3d5d4" },
  { photo: 4174, color: "Negro y blanco", swatch: "#1b1b1b", accent: "#f6f6f3" },
  { photo: 4175, color: "Negro y rosa claro", swatch: "#292a2d", accent: "#e7c8ce" },
  { photo: 4176, color: "Negro geométrico dorado", swatch: "#252525", accent: "#bc963d", pattern: "geometric" },
  { photo: 4177, color: "Negro con borde dorado", swatch: "#262626", accent: "#bc963d", pattern: "border" },
  { photo: 4178, color: "Rosa geométrico dorado", swatch: "#d998af", accent: "#bc963d", pattern: "geometric" },
  { photo: 4179, color: "Rosa liso", swatch: "#dba3ba" },
  { photo: 4180, color: "Rosa con puntos dorados", swatch: "#e7adc0", accent: "#bc963d", pattern: "dots" },
  { photo: 4181, color: "Morado y blanco", swatch: "#59355a", accent: "#f6f6f3" },
  { photo: 4182, color: "Negro y fucsia", swatch: "#242424", accent: "#d31571" },
  { photo: 4183, color: "Blanco con borde dorado", swatch: "#faf9f5", accent: "#bc963d", pattern: "border" },
  { photo: 4184, color: "Blanco con puntos dorados", swatch: "#faf9f5", accent: "#bc963d", pattern: "dots" },
];

export const koreanPaperSku = (photo: number) => `WRP-KOR-IMG-${photo}`;
