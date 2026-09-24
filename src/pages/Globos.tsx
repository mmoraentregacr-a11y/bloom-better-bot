import { productos } from "@/data/productos";
import CollectionPage from "@/components/CollectionPage";
import img from "@/assets/collection-regalos.jpg";

const products = productos.filter(product => product.subcategoria === "Globos");

const Globos = () => (
  <CollectionPage
    eyebrow="Regalos"
    title="Globos"
    description="Globos para celebrar cumpleaños, graduaciones y momentos especiales."
    heroImage={img}
    products={products}
    catalog={{ subcategory: "globos" }}
  />
);

export default Globos;
