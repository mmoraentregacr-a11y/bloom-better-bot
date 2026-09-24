import CollectionPage from "@/components/CollectionPage";
import { productos } from "@/data/productos";
import heroImage from "@/assets/collection-grandes.jpg";

const yellowFlowerArrangements = productos
  .filter(product => product.categoria === "Ramos" && /girasol/i.test(product.name))
  .sort((a, b) => b.price - a.price);

const Septiembre21 = () => (
  <CollectionPage
    eyebrow="21 Septiembre"
    title="Flores amarillas"
    description="Arreglos con flores amarillas para celebrar este 21 de septiembre."
    heroImage={heroImage}
    products={yellowFlowerArrangements}
  />
);

export default Septiembre21;
