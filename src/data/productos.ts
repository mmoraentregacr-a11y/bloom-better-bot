export type Categoria = "Ramos" | "Regalos" | "Perfumes";
export type SubCategoria = 
  | "Ramos Grandes" 
  | "Ramos pequeños" 
  | "Cajas y Jarrones" 
  | "Boda" 
  | "Dulces" 
  | "Peluches" 
  | "Globos"
  | "Hombres" 
  | "Mujeres";

export interface Producto {
  id: string;
  name: string;
  price: number;
  image: string;
  categoria: Categoria;
  subcategoria: SubCategoria;
  tag?: string;
  description?: string;
  hasCarousel?: boolean;
  images?: string[];
}

export const productos: Producto[] = [
  {

    /*INICIO BOX*/ 
    "id": "prod-1",
    "name": "Caja 12 Rosas + chocolates",
    "price": 24000,
    "hasCarousel": true,
    "images": [
      "/productos/cajas/boxRed1.mp4",
    ],
    "image": "/productos/cajas/boxRed1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Cajas y Jarrones",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-2",
    "name": "Centro de mesa Primaveral grande",
    "price": 35000,
    "hasCarousel": true,
    "images": [
      "/productos/cajas/centroBig2.jpeg",
      "/productos/cajas/centroBig1.mp4",
    ],
    "image": "/productos/cajas/centroBig1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Cajas y Jarrones",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-232",
    "name": "Centro de mesa Primaveral pequeño",
    "price": 10000,
    "hasCarousel": true,
    "images": [
      "/productos/cajas/centroPeq2.jpeg",
      "/productos/cajas/centroPeq1.mp4",
    ],
    "image": "/productos/cajas/centroPeq1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Cajas y Jarrones",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-233",
    "name": "Centro de mesa Primaveral Combo",
    "price": 50000,
    "image": "/productos/cajas/centroMesaCompleto1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Cajas y Jarrones",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-293",
    "name": "Base Primaveral mediana",
    "price": 12000,
    "hasCarousel": true,
    "images": [
      "/productos/cajas/centroPeq4.jpeg",
    ],
    "image": "/productos/cajas/centroPeq3.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Cajas y Jarrones",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-293",
    "name": "Caja de dulces Grande",
    "price": 22000,
    "hasCarousel": true,
    "images": [
      "/productos/cajas/cajaBigChoco1.mp4",
    ],
    "image": "/productos/cajas/cajaBigChoco1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Cajas y Jarrones",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-293",
    "name": "Caja de dulces mediana",
    "price": 16500,
    "hasCarousel": true,
    "image": "/productos/cajas/cajaMedChoco1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Cajas y Jarrones",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-293",
    "name": "Caja grande decorada + globo con helio + 5 chocolates grandes premium *No se inlcuye precio de peluche ya que varia según elección.",
    "price": 19000,
    "hasCarousel": true,
    "image": "/productos/cajas/cajaPeluche1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Cajas y Jarrones",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-293",
    "name": "Caja grande decorada + globo con helio + 4 chocolates grandes premium + tarjeta personalizada *No se inlcuye precio de peluche ya que varia según elección.",
    "price": 16500,
    "hasCarousel": true,
    "image": "/productos/cajas/cajaPeluche2.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Cajas y Jarrones",
    "description": "Hermoso detalle para regalar."
  },
  /*{
    "id": "prod-3",
    "name": "Caja 12 Rosas",
    "price": 7500,
    "hasCarousel": true,
    "images": [
      "/productos/cajas/jar1Gerbera2.jpeg",
    ],
    "image": "/productos/cajas/jar1Gerbera1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Cajas y Jarrones",
    "description": "Hermoso detalle para regalar."
  },*/
  /*FINAL BOX*/ 
  /*INICIO DULCES*/

  /*CHOCOLATES*/
  {
    "id": "prod-5",
    "name": "Caja Ferrero Rocher 12 und",
    "price": 6900,
    "image": "/productos/dulces/CajaFerreroRocher150g.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-11",
    "name": "Ferrero Rocher 8 und",
    "price": 5500,
    "image": "/productos/dulces/ferreroRocher8u.png",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-10",
    "name": "Ferrero Rocher 4 und",
    "price": 3500,
    "image": "/productos/dulces/ferreroRocher4u.png",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-9",
    "name": "Ferrero Rocher 3 und",
    "price": 2500,
    "image": "/productos/dulces/ferreroRocher3u.png",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-6",
    "name": "Caja Chocolate Vizzio 120g",
    "price": 3500,
    "image": "/productos/dulces/cajaVizzio.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-18",
    "name": "Hershey’s Giant Cokies & Cream",
    "price": 3500,
    "image": "/productos/dulces/hersheysCnC184g.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-17",
    "name": "Hershey’s Giant Almendras",
    "price": 3500,
    "image": "/productos/dulces/hersheysAlmendra192g.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-16",
    "name": "Hershey’s Giant",
    "price": 3500,
    "image": "/productos/dulces/hersheys198g.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-20",
    "name": "M&M’s Maní 92g",
    "price": 1900,
    "image": "/productos/dulces/m&msAmarillo92g.png",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-22",
    "name": "M&M’s Original 92g",
    "price": 1900,
    "image": "/productos/dulces/m&msCafe92g.png",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-39",
    "name": "Snickers Original",
    "price": 1300,
    "image": "/productos/dulces/snickers.png",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-42",
    "name": "Snickers con Maní",
    "price": 1000,
    "image": "/productos/dulces/snickersMani.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-40",
    "name": "Snickers con Almendra",
    "price": 1300,
    "image": "/productos/dulces/snickersAlmond.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-41",
    "name": "Snickers Chocolate Blanco",
    "price": 1300,
    "image": "/productos/dulces/snickersBlanco.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-43",
    "name": "Snickers Pequeño Unidad",
    "price": 200,
    "image": "/productos/dulces/snickersPeq.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-44",
    "name": "Chocolate Tutto con Arandano",
    "price": 1600,
    "image": "/productos/dulces/tuttoArandano.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-46",
    "name": "Chocolate Tutto con Crocante Belga",
    "price": 3000,
    "image": "/productos/dulces/tuttoCrocante.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-45",
    "name": "Chocolate Blanco Tutto Mix Nueces",
    "price": 1600,
    "image": "/productos/dulces/tuttoBlanco.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-47",
    "name": "Chocolate Tutto Mix Nueces",
    "price": 1600,
    "image": "/productos/dulces/tuttoMix.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-48",
    "name": "Chocolate Tutto Sin Azúcar",
    "price": 15000,
    "image": "/productos/dulces/tuttoSinAzucar.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-32",
    "name": "Chocolate Milka Leche",
    "price": 3200,
    "image": "/productos/dulces/milkaLeche.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-31",
    "name": "Chocolate Blanco Milka",
    "price": 1200,
    "image": "/productos/dulces/milkaBlanco.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-30",
    "name": "Chocolate Milka Arroz Inflado",
    "price": 15000,
    "image": "/productos/dulces/milkaArroz.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  /*{
    "id": "prod-33",
    "name": "Milka Oreo",
    "price": 15000,
    "image": "/productos/dulces/milkaOreo.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },*/
  {
    "id": "prod-34",
    "name": "Chocolate MilkyWay",
    "price": 1200,
    "image": "/productos/dulces/milkyWay.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-7",
    "name": "Chocolate Choys Arroz Inflado",
    "price": 600,
    "image": "/productos/dulces/choysArroz.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-8",
    "name": "Chocolate Choys Mani",
    "price": 600,
    "image": "/productos/dulces/choysMani.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  /*{
    "id": "prod-19",
    "name": "Hersheys Cn C43g",
    "price": 15000,
    "image": "/productos/dulces/hersheysCnC43g.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  
  {
    "id": "prod-21",
    "name": "M&ms Cafe",
    "price": 15000,
    "image": "/productos/dulces/m&msCafe.png",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },*/
  
/*CARAMELOS Y GOMITAS*/  
{
    "id": "prod-37",
    "name": "Skittles Original",
    "price": 1300,
    "image": "/productos/dulces/skittlesOriginal.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-38",
    "name": "Skittles Wild Berry",
    "price": 1300,
    "image": "/productos/dulces/skittlesWild.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-36",
    "name": "Gomitas Perlitas",
    "price": 800,
    "image": "/productos/dulces/perlitas.png",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-14",
    "name": "Gomitas Gusanos",
    "price": 850,
    "image": "/productos/dulces/gusanos.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-15",
    "name": "Gomitas Gusanos Acidos",
    "price": 850,
    "image": "/productos/dulces/gusanosAcidos.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-13",
    "name": "Gomita Fresitas",
    "price": 850,
    "image": "/productos/dulces/gomitaFresa.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-12",
    "name": "Gomitas Aros",
    "price": 850,
    "image": "/productos/dulces/gomitaAro.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  
  /*MANI*/
  {
    "id": "prod-23",
    "name": "Maní con Chocolate",
    "price": 1900,
    "image": "/productos/dulces/maniChocolate.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-35",
    "name": "Pasas Chocolate",
    "price": 2000,
    "image": "/productos/dulces/pasasChocolate.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-26",
    "name": "Maní Limón y Sal",
    "price": 1000,
    "image": "/productos/dulces/maniLimonSal.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-24",
    "name": "Maní Garapinado",
    "price": 1000,
    "image": "/productos/dulces/maniGarapinado.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-25",
    "name": "Maní Japonés",
    "price": 1000,
    "image": "/productos/dulces/maniJapones.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-28",
    "name": "Maní Salado",
    "price": 1000,
    "image": "/productos/dulces/maniSalado.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-27",
    "name": "Maní Pasas",
    "price": 1000,
    "image": "/productos/dulces/maniPasas.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  
  {
    "id": "prod-29",
    "name": "Semillas Mixtas",
    "price": 1500,
    "image": "/productos/dulces/maniSemillas.jpg",
    "categoria": "Regalos",
    "subcategoria": "Dulces",
    "description": "Hermoso detalle para regalar."
  },
  /*FINAL DULCES*/ 
  /*INICIO PELUCHES*/ 
  {
    "id": "prod-53",
    "name": "Snoopy",
    "price": 4500,
    "image": "/productos/peluches/snoopy.png",
    "categoria": "Regalos",
    "subcategoria": "Peluches",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-52",
    "name": "Chimuelo",
    "price": 10000,
    "image": "/productos/peluches/Chimuelo.jpeg",
    "categoria": "Regalos",
    "subcategoria": "Peluches",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-49",
    "name": "Amor1",
    "price": 5000,
    "image": "/productos/peluches/amor1.png",
    "categoria": "Regalos",
    "subcategoria": "Peluches",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-50",
    "name": "Amor2",
    "price": 5000,
    "image": "/productos/peluches/amor2.png",
    "categoria": "Regalos",
    "subcategoria": "Peluches",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-54",
    "name": "Stitch",
    "price": 8000,
    "image": "/productos/peluches/stitch.jpg",
    "categoria": "Regalos",
    "subcategoria": "Peluches",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-51",
    "name": "Angel",
    "price": 5000,
    "image": "/productos/peluches/angel.jpg",
    "categoria": "Regalos",
    "subcategoria": "Peluches",
    "description": "Hermoso detalle para regalar."
  },
  /*FINAL PELUCHES*/
  /*INICIO GLOBOS*/
  { "id":"globo-dia-madre-1", "name":"Globo Feliz Día Mamá 1", "price":1500, "image":"/productos/globos/15Agosto1.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para celebrar a mamá." },
  { "id":"globo-dia-madre-2", "name":"Globo Feliz Día Mamá 2", "price":1500, "image":"/productos/globos/15Agosto2.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para celebrar a mamá." },
  { "id":"globo-dia-madre-3", "name":"Globo Feliz Día Mamá 3", "price":1500, "image":"/productos/globos/15Agosto3.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para celebrar a mamá." },
  { "id":"globo-dia-madre-4", "name":"Globo Feliz Día Mamá 4", "price":1500, "image":"/productos/globos/15Agosto4.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para celebrar a mamá." },
  { "id":"globo-dia-madre-5", "name":"Globo Feliz Día Mamá 5", "price":1500, "image":"/productos/globos/15Agosto5.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para celebrar a mamá." },
  { "id":"globo-graduacion-1", "name":"Globo de Graduación 1", "price":1500, "image":"/productos/globos/grad1.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para celebrar una graduación." },
  { "id":"globo-graduacion-2", "name":"Globo de Graduación 2", "price":1500, "image":"/productos/globos/grad2.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para celebrar una graduación." },
  { "id":"globo-graduacion-3", "name":"Globo de Graduación 3", "price":1500, "image":"/productos/globos/grad3.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para celebrar una graduación." },
  { "id":"globo-graduacion-4", "name":"Globo de Graduación 4", "price":1500, "image":"/productos/globos/grad4.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para celebrar una graduación." },
  { "id":"globo-graduacion-5", "name":"Globo de Graduación 5", "price":1500, "image":"/productos/globos/grad5.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para celebrar una graduación." },
  { "id":"globo-cumpleanos-1", "name":"Globo Feliz Cumpleaños 1", "price":1500, "image":"/productos/globos/hb1.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para cumpleaños." },
  { "id":"globo-cumpleanos-2", "name":"Globo Feliz Cumpleaños 2", "price":1500, "image":"/productos/globos/hb2.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para cumpleaños." },
  { "id":"globo-cumpleanos-3", "name":"Globo Feliz Cumpleaños 3", "price":1500, "image":"/productos/globos/hb3.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para cumpleaños." },
  { "id":"globo-cumpleanos-4", "name":"Globo Feliz Cumpleaños 4", "price":1500, "image":"/productos/globos/hb4.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para cumpleaños." },
  { "id":"globo-cumpleanos-5", "name":"Globo Feliz Cumpleaños 5", "price":1500, "image":"/productos/globos/hb5.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para cumpleaños." },
  { "id":"globo-cumpleanos-6", "name":"Globo Feliz Cumpleaños 6", "price":1500, "image":"/productos/globos/hb6.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para cumpleaños." },
  { "id":"globo-amor-1", "name":"Globo de Amor 1", "price":1500, "image":"/productos/globos/love1.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para expresar amor." },
  { "id":"globo-amor-2", "name":"Globo de Amor 2", "price":1500, "image":"/productos/globos/love2.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para expresar amor." },
  { "id":"globo-amor-3", "name":"Globo de Amor 3", "price":1500, "image":"/productos/globos/love3.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para expresar amor." },
  { "id":"globo-amor-4", "name":"Globo de Amor 4", "price":1500, "image":"/productos/globos/love4.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para expresar amor." },
  { "id":"globo-amor-5", "name":"Globo de Amor 5", "price":1500, "image":"/productos/globos/love5.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para expresar amor." },
  { "id":"globo-amor-6", "name":"Globo de Amor 6", "price":1500, "image":"/productos/globos/love6.jpg", "categoria":"Regalos", "subcategoria":"Globos", "description":"Globo decorativo para expresar amor." },
  /*FINAL GLOBOS*/
  
  
  
  /*INICIO PERFUMES CABALLERO*/ 
  /*{
    "id": "prod-61",
    "name": "Chanel Allure Sport",
    "price": 75000,
    "image": "/productos/perfumes/caballero/AllureSport.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },

  {
    "id": "prod-55",
    "name": "212Heroes1",
    "price": 60000,
    "image": "/productos/perfumes/caballero/212Heroes1.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-56",
    "name": "212Heroes2",
    "price": 60000,
    "image": "/productos/perfumes/caballero/212Heroes2.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-57",
    "name": "212Men",
    "price": 60000,
    "image": "/productos/perfumes/caballero/212Men.jpg",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-58",
    "name": "212Sexy",
    "price": 60000,
    "image": "/productos/perfumes/caballero/212Sexy.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-59",
    "name": "212Vip",
    "price": 60000,
    "image": "/productos/perfumes/caballero/212Vip.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-60",
    "name": "212VIPBlack",
    "price": 60000,
    "image": "/productos/perfumes/caballero/212VIPBlack.png",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  
  {
    "id": "prod-62",
    "name": "Bvlgari Terrae1",
    "price": 60000,
    "image": "/productos/perfumes/caballero/BvlgariTerrae1.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-63",
    "name": "Chanel Bleu",
    "price": 60000,
    "image": "/productos/perfumes/caballero/ChanelBleu.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-64",
    "name": "CHBad Boy",
    "price": 60000,
    "image": "/productos/perfumes/caballero/CHBadBoy.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-65",
    "name": "DGK",
    "price": 60000,
    "image": "/productos/perfumes/caballero/DGK.jpg",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-66",
    "name": "DGThe One Grey",
    "price": 60000,
    "image": "/productos/perfumes/caballero/DGTheOneGrey.jpg",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-67",
    "name": "Dior Sauvage",
    "price": 60000,
    "image": "/productos/perfumes/caballero/DiorSauvage.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-68",
    "name": "EDT",
    "price": 60000,
    "image": "/productos/perfumes/caballero/EDT.jpg",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-69",
    "name": "GCPour Homme",
    "price": 60000,
    "image": "/productos/perfumes/caballero/GCPourHomme.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-70",
    "name": "Moschino Toy Boy",
    "price": 60000,
    "image": "/productos/perfumes/caballero/MoschinoToyBoy.jpg",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-71",
    "name": "PR1Million",
    "price": 60000,
    "image": "/productos/perfumes/caballero/PR1Million.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-72",
    "name": "PRInvictus",
    "price": 60000,
    "image": "/productos/perfumes/caballero/PRInvictus.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-73",
    "name": "PRPhanton",
    "price": 60000,
    "image": "/productos/perfumes/caballero/PRPhanton.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-74",
    "name": "PRPhanton Elixir",
    "price": 60000,
    "image": "/productos/perfumes/caballero/PRPhantonElixir.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-75",
    "name": "Pure XS",
    "price": 60000,
    "image": "/productos/perfumes/caballero/PureXS.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-76",
    "name": "Pure XSEdt",
    "price": 60000,
    "image": "/productos/perfumes/caballero/PureXSEdt.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-77",
    "name": "Versace Eros Flame",
    "price": 60000,
    "image": "/productos/perfumes/caballero/VersaceErosFlame.webp",
    "categoria": "Perfumes",
    "subcategoria": "Hombres",
    "description": "Hermoso detalle para regalar."
  },
  /*FINAL PERFUMES CABALLERO*/ 
  /*INICIO PERFUMES DAMA*/ /*
  {
    "id": "prod-78",
    "name": "AGCloud",
    "price": 60000,
    "image": "/productos/perfumes/dama/AGCloud.webp",
    "categoria": "Perfumes",
    "subcategoria": "Mujeres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-79",
    "name": "CHCH1",
    "price": 60000,
    "image": "/productos/perfumes/dama/CHCH1.webp",
    "categoria": "Perfumes",
    "subcategoria": "Mujeres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-80",
    "name": "DGLight Blue",
    "price": 60000,
    "image": "/productos/perfumes/dama/DGLightBlue.jpg",
    "categoria": "Perfumes",
    "subcategoria": "Mujeres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-81",
    "name": "Lancome La Vie Est Belle",
    "price": 60000,
    "image": "/productos/perfumes/dama/LancomeLaVieEstBelle.webp",
    "categoria": "Perfumes",
    "subcategoria": "Mujeres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-82",
    "name": "Moschino Funny",
    "price": 60000,
    "image": "/productos/perfumes/dama/MoschinoFunny.jpg",
    "categoria": "Perfumes",
    "subcategoria": "Mujeres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-83",
    "name": "PRLady Million",
    "price": 60000,
    "image": "/productos/perfumes/dama/PRLadyMillion.webp",
    "categoria": "Perfumes",
    "subcategoria": "Mujeres",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-84",
    "name": "Versace Yellow Diamond",
    "price": 60000,
    "image": "/productos/perfumes/dama/VersaceYellowDiamond.webp",
    "categoria": "Perfumes",
    "subcategoria": "Mujeres",
    "description": "Hermoso detalle para regalar."
  },
  /*FINAL PERFUMES DAMA*/ 
  /*INICIO BODA*/ 
  /*RAMO*/ 
  {
    "id": "prod-85",
    "name": "Ramo Girasol/Rosa",
    "price": 20000,
    "image": "/productos/ramos/boda/bouquet1.png",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-86",
    "name": "Ramo Rosa",
    "price": 20000,
    "image": "/productos/ramos/boda/bouquet2.png",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-87",
    "name": "Ramo Rosa/Eucalipto",
    "price": 20000,
    "image": "/productos/ramos/boda/bouquet3.png",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-88",
    "name": "Ramo Rosa/Eucalipto",
    "price": 20000,
    "image": "/productos/ramos/boda/bouquet4.png",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-89",
    "name": "Ramo Rosa/Eucalipto",
    "price": 20000,
    "image": "/productos/ramos/boda/bouquet5.png",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-90",
    "name": "Ramo Rosa/Lirio",
    "price": 20000,
    "image": "/productos/ramos/boda/bouquet6.png",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-91",
    "name": "Ramo Girasol/Margarita",
    "price": 20000,
    "image": "/productos/ramos/boda/bouquet7.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  /*BOUTONNIERE*/ 
  {
    "id": "prod-92",
    "name": "Boutonniere Girasol",
    "price": 7000,
    "image": "/productos/ramos/boda/Boutonniere1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-93",
    "name": "Boutonniere Rosa",
    "price": 7000,
    "image": "/productos/ramos/boda/Boutonniere2.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-94",
    "name": "Boutonniere Rosa",
    "price": 7000,
    "image": "/productos/ramos/boda/Boutonniere3.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-95",
    "name": "Boutonniere Rosa",
    "price": 7000,
    "image": "/productos/ramos/boda/Boutonniere4.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-96",
    "name": "Boutonniere Rosa",
    "price": 7000,
    "image": "/productos/ramos/boda/Boutonniere5.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-97",
    "name": "Boutonniere Rosa",
    "price": 7000,
    "image": "/productos/ramos/boda/Boutonniere6.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-98",
    "name": "Boutonniere Gypsophila",
    "price": 7000,
    "image": "/productos/ramos/boda/Boutonniere7.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-99",
    "name": "Boutonniere Rosa",
    "price": 7000,
    "image": "/productos/ramos/boda/Boutonniere8.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Boda",
    "description": "Hermoso detalle para regalar."
  },
  /*FINAL BODA*/ 
  /*INICO RAMOS GRANDES*/ 
  {
    "id": "prod-200",
    "name": "Ramo 72 rosas",
    "price": 60000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramoBig721.jpg",
    ],
    "image": "/productos/ramos/grandes/ramoBig722.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-200",
    "name": "Ramo Gerberas con Chocolates",
    "price": 35000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramoBig12Gerbera1.mp4",
    ],
    "image": "/productos/ramos/grandes/ramoBig12Gerbera1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-200",
    "name": "Ramo 20 rosas",
    "price": 30000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ram20BigRosas2.jpeg",
    ],
    "image": "/productos/ramos/grandes/ram20BigRosas1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },

  
  {
    "id": "prod-201",
    "name": "Ramo Primaveral",
    "price": 24000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramoBigGerbera1.jpeg",
      "/productos/ramos/grandes/ramoBigGerbera1.mp4",
    ],
    "image": "/productos/ramos/grandes/ramoBigGerbera2.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-202",
    "name": "Ramo de chocolates",
    "price": 20000,
    "image": "/productos/ramos/grandes/ramBigChoco1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-203",
    "name": "Ramo 20 rosas",
    "price": 30000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramBigRosa2.jpeg",
      "/productos/ramos/grandes/ramBigRosa1.mp4",
    ],
    "image": "/productos/ramos/grandes/ramBigRosa1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },

  {
    "id": "prod-203",
    "name": "Ramo 20 rosas",
    "price": 30000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ram18BigRosas4.mp4",
    ],
    "image": "/productos/ramos/grandes/ram18BigRosas4.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },

  {
    "id": "prod-203",
    "name": "Ramo 20 rosas",
    "price": 30000,
    "hasCarousel": true,
    "image": "/productos/ramos/grandes/ram18BigRosas3.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },

  {
    "id": "prod-203",
    "name": "Ramo 15 rosas",
    "price": 30000,
    "hasCarousel": true,
    "image": "/productos/ramos/grandes/ram15BigRosas3.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },

  {
    "id": "prod-204",
    "name": "Ramo Primaveral",
    "price": 22000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ram12BigRosas2.jpeg",
      "/productos/ramos/grandes/ram12BigRosas1.mp4",
    ],
    "image": "/productos/ramos/grandes/ram12BigRosas1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-204",
    "name": "Ramo Primaveral",
    "price": 12000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ram7Mix2.jpeg",
      "/productos/ramos/grandes/ram7Mix3.jpeg",
    ],
    "image": "/productos/ramos/grandes/ram7Mix1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  }, 
  {
    "id": "prod-204",
    "name": "Ramo Primaveral",
    "price": 12000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ram6BigMix1.mp4",
    ],
    "image": "/productos/ramos/grandes/ram6BigMix1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },  

  
  {
    "id": "prod-204",
    "name": "Ramo Primaveral",
    "price": 12000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ram6BigRosas1.jpeg",
    ],
    "image": "/productos/ramos/grandes/ram6BigRosas2.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },  
  {
    "id": "prod-204",
    "name": "Ramo Primaveral",
    "price": 12000,
    "hasCarousel": true,
    "image": "/productos/ramos/grandes/ram6BigGirasol1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  }, 
  {
    "id": "prod-204",
    "name": "Ramo Primaveral",
    "price": 12000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ram5BigRosas1.mp4",
    ],
    "image": "/productos/ramos/grandes/ram5BigRosas1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },   

  

  
{
    "id": "prod-204",
    "name": "Ramo Primaveral",
    "price": 22000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramBigPrimaveral2.jpeg",
    ],
    "image": "/productos/ramos/grandes/ramBigPrimaveral1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-205",
    "name": "Ramo Primaveral",
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramBigPrimaveral5.jpeg",
      "/productos/ramos/grandes/ramBigPrimaveral6.jpeg",
    ],
    "price": 22000,
    "image": "/productos/ramos/grandes/ramBigPrimaveral4.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-206",
    "name": "Ramo 12 girasoles con astromelias",
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramBigGirasol2.jpeg",
      "/productos/ramos/grandes/ramBigGirasol1.mp4",
    ],
    "price": 25000,
    "image": "/productos/ramos/grandes/ramBigGirasol1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-207",
    "name": "Ramo Primaveral pequeño",
    "price": 15000,
    "hasCarousel": true,
    "images": [
      
      
      "/productos/ramos/grandes/ramBigPrimaveral11.jpeg",
      "/productos/ramos/grandes/ramBigPrimaveral9.mp4",
    ],
    "image": "/productos/ramos/grandes/ramBigPrimaveral9.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-208",
    "name": "Ramo Primaveral",
    "price": 22000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramBigPrimaveral8.jpeg",
    ],
    "image": "/productos/ramos/grandes/ramBigPrimaveral7.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-209",
    "name": "Ramo Primaveral",
    "price": 20000,
    "image": "/productos/ramos/grandes/ramBigPrimaveral3.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-210",
    "name": "Ramo Margaritas",
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramBigMarg2.jpeg",
      "/productos/ramos/grandes/ramBigMarg1.mp4",
    ],
    "price": 15000,
    "image": "/productos/ramos/grandes/ramBigMarg1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-211",
    "name": "Ramo 20 Tulipanes 2 colores",
    "price": 36000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ram16BigTuli2.png",
    ],
    "image": "/productos/ramos/grandes/ram16BigTuli1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },/*
  {
    "id": "prod-100",
    "name": "Ramo Primaveral",
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ram12BigPrima2.jpg",
    ],
    "price": 20000,
    "image": "/productos/ramos/grandes/ram12BigPrima1.jpg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },*/
  {
    "id": "prod-212",
    "name": "Ramo Primaveral + 5 chocolates",
    "price": 30000,
    "image": "/productos/ramos/grandes/ram12BigPrima3.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-213",
    "name": "Ramo Rosa",
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramoPreRosa2.png",
    ],
    "price": 12000,
    "image": "/productos/ramos/grandes/ramoPreRosa1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  /*{
    "id": "prod-134",
    "name": "Ramo Rosado2",
    "price": 45000,
    "image": "/productos/ramos/grandes/RamoRosado2.jpg",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },*/
  {
    "id": "prod-214",
    "name": "Ramo de 20 rosas y claveles",
    "price": 30000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/ramoPreRoja2.png",
    ],
    "image": "/productos/ramos/grandes/ramoPreRoja1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-215",
    "name": "Ramo 12 rosas con eucalipto",
    "price": 25000,
    "image": "/productos/ramos/grandes/ramoPre3.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-216",
    "name": "Ramo Rosa/Liria",
    "price": 28000,
    "image": "/productos/ramos/grandes/ramoPre4.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-217",
    "name": "Ramo de 20 rosas con follaje",
    "price": 30000,
    "image": "/productos/ramos/grandes/ramoPre5.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-218",
    "name": "Ramo Clavel",
    "price": 12000,
    "image": "/productos/ramos/grandes/ramoClavel1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-219",
    "name": "Ramo Girasol",
    "price": 15000,
    "image": "/productos/ramos/grandes/ramoGirasol1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-220",
    "name": "Ramo Girasol",
    "price": 15000,
    "hasCarousel": true,
    "image":"/productos/ramos/grandes/ramoGirasol2.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  
  
  
  /*{
    "id": "prod-119",
    "name": "Ramo Gierbera1",
    "price": 45000,
    "hasCarousel": true,
    "images": [
      "/productos/ramos/grandes/RamoGierbera2.png"
    ],
    "image": "/productos/ramos/grandes/RamoGierbera1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-133",
    "name": "Ramo Rosado1",
    "price": 45000,
    "image": "/productos/ramos/grandes/RamoRosado1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos Grandes",
    "description": "Hermoso detalle para regalar."
  },*/
  
  /*FINAL RAMOS GRANDES*/ 
  /*INICO RAMOS PEQUENOS*/ 
  {
    "id": "prod-154",
    "name": "4 Girasoles",
    "price": 7500,
    "image": "/productos/ramos/peque/ramPeqGirasol2.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-155",
    "name": "4 Girasoles",
    "price": 7500,
    "image": "/productos/ramos/peque/ramPeqGirasol3.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },

  {
    "id": "prod-156",
    "name": "4 Rosas",
    "price": 7500,
    "image": "/productos/ramos/peque/ramPeq4Rosa1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-157",
    "name": "4 Gerberas",
    "price": 7500,
    "image": "/productos/ramos/peque/ramPeq4Gerbera1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-158",
    "name": "3 Rosas con Globo",
    "price": 7500,
    "image": "/productos/ramos/peque/ramPeq3Rosa.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-159",
    "name": "2 Gerberas 1 Girasol con Globo",
    "price": 7500,
    "image": "/productos/ramos/peque/ramPeq3Mix2.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },

  {
    "id": "prod-160",
    "name": "2 Gerberas/1 Rosa",
    "price": 5500,
    "image": "/productos/ramos/peque/ramPeq3Mix1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-161",
    "name": "3 Girasoles",
    "price": 5500,
    "image": "/productos/ramos/peque/ramPeqGirasol1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-162",
    "name": "3 Girasoles",
    "price": 5500,
    "image": "/productos/ramos/peque/ram3Girasol1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-163",
    "name": "Rosa/Girasol/Gerbera",
    "price": 5500,
    "image": "/productos/ramos/peque/ram3PeqGirarsolGierberaRosa1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-164",
    "name": "2 Rosas/1Gerbera",
    "price": 5500,
    "image": "/productos/ramos/peque/ram3PeqRosaGierbera1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
 /*{
    "id": "prod-145",
    "name": "Girasol/Gerbera",
    "price": 25000,
    "image": "/productos/ramos/peque/ram2PeqGirasolGierbera1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },*/
  {
    "id": "prod-165",
    "name": "3 Gerberas",
    "price": 5500,
    "image": "/productos/ramos/peque/ram2PeGierbera1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  /*{
    "id": "prod-144",
    "name": "2 Gerberas",
    "price": 6000,
    "image": "/productos/ramos/peque/ram2PeGierbera3.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },*/
  {
    "id": "prod-166",
    "name": "2 Rosas",
    "price": 4500,
    "image": "/productos/ramos/peque/ramPeq2Rosa.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-167",
    "name": "2 Rosas",
    "price": 4500,
    "image": "/productos/ramos/peque/ram2PeqRosa1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  
  {
    "id": "prod-168",
    "name": "Girasol con eucalipto y gipsofilia",
    "price": 3500,
    "image": "/productos/ramos/peque/ramPeq1Girasol2.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-169",
    "name": "Girasol con eucalipto y gipsofilia",
    "price": 3500,
    "image": "/productos/ramos/peque/uniGirasol4.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  /*{
    "id": "prod-150",
    "name": "2 Lirios/1Rosa/1Clavel",
    "price": 9000,
    "image": "/productos/ramos/peque/ram4PeLirioRosaClavel1.png",
    hasCarousel: true,
    images: [
      "/productos/ramos/peque/ram4PeLirioRosaClavel2.png",
    ],
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },*/
  /*{
    "id": "prod-143",
    "name": "2 Gerberas",
    "price": 6000,
    "image": "/productos/ramos/peque/ram2PeGierbera2.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },*/

  {
    "id": "prod-170",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ramPeq1Gierbera1.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },{
    "id": "prod-171",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ramPeq1Gierbera2.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },{
    "id": "prod-172",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ramPeq1Gierbera3.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },{
    "id": "prod-173",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ramPeq1Gierbera4.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },{
    "id": "prod-174",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ramPeq1Gierbera5.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },{
    "id": "prod-175",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ramPeq1Gierbera6.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },{
    "id": "prod-176",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ramPeq1Gierbera9.png",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },{
    "id": "prod-177",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ramPeq1Gierbera10.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },{
    "id": "prod-178",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ramPeq1Gierbera11.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-179",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ram1PeGierbera1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-180",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ram1PeGierbera2.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-181",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ram1PeGierbera3.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-182",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ram1PeGierbera4.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-183",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ram1PeGierbera5.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-184",
    "name": "Gerbera",
    "price": 3500,
    "image": "/productos/ramos/peque/ram1PeGierbera6.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  {
    "id": "prod-185",
    "name": "Tulipán",
    "price": 5000,
    "image": "/productos/ramos/peque/ram1PeTuli1.jpeg",
    "categoria": "Ramos",
    "subcategoria": "Ramos pequeños",
    "description": "Hermoso detalle para regalar."
  },
  /*FINAL RAMOS PEQUENOS*/ 
];
