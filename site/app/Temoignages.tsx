import TestimonialCard from '@components/cards/TestimonialCard';
import CardsSection from '@components/sections/CardsSection';
import Slideshow from '@components/slideshow/Slideshow';
import {Temoignage} from './types';

type TemoignagesProps = {
  titre: string;
  description?: string;
  contenu: Temoignage[];
};

const Temoignages = ({titre, description, contenu}: TemoignagesProps) => {
  return contenu.length > 1 ? (
    <CardsSection
      title={titre}
      description={description}
      cardsList={
        <Slideshow
          className="my-6 xl:mx-auto xl:w-5/6"
          autoSlide
          slides={contenu.map(t => (
            <TestimonialCard
              key={t.id}
              content={t.contenu}
              author={t.auteur}
              role={t.description}
              image={t.image}
            />
          ))}
        />
      }
    />
  ) : null;
};

export default Temoignages;
