import { useParams } from "react-router-dom";
import CollectionPage from "@/components/CollectionPage";
import { productos, SubCategoria } from "@/data/productos";
import heroImg from "@/assets/collection-grandes.jpg";
import NotFound from "./NotFound";

const Categoria = () => {
  const { subcategoria } = useParams();
  
  const slugToSubCategoria: Record<string, SubCategoria> = {
    "ramos-grandes": "Ramos Grandes",
    "ramos-pequenos": "Ramos pequeños",
    "cajas-y-jarrones": "Cajas y Jarrones",
    "boda": "Boda",
    "dulces": "Dulces",
    "peluches": "Peluches",
    "globos": "Globos",
    "hombres": "Hombres",
    "mujeres": "Mujeres",
  };

  const actualSubCategoria = subcategoria ? slugToSubCategoria[subcategoria] : undefined;

  if (!actualSubCategoria) {
    return <NotFound />;
  }

  const categoryProducts = productos.filter((p) => p.subcategoria === actualSubCategoria);
  
  return (
    <CollectionPage
      eyebrow="Colección"
      title={actualSubCategoria}
      description={`Explora nuestra selección de ${actualSubCategoria.toLowerCase()}.`}
      heroImage={heroImg}
      products={categoryProducts}
      catalog={{ subcategory: subcategoria }}
    />
  );
};

export default Categoria;
