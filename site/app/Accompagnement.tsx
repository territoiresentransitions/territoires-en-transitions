import Card from '@components/cards/Card';
import CardsWrapper from '@components/cards/CardsWrapper';
import CardsSection from '@components/sections/CardsSection';
import {StrapiImage} from '@components/strapiImage/StrapiImage';
import {AccompagnementContent} from './types';

type AccompagnementProps = {
  titre: string;
  description?: string;
  contenu: AccompagnementContent[];
};

const Accompagnement = ({titre, description, contenu}: AccompagnementProps) => {
  return (
    <CardsSection
      title={titre}
      description={description}
      cardsList={
        <CardsWrapper cols={2}>
          {contenu.map((c, index) => (
            <Card
              key={index}
              title={c.titre}
              description={c.description}
              button={{title: c.button.titre, href: c.button.href}}
              image={
                <StrapiImage
                  data={c.image}
                  className="max-h-[200px]"
                  containerClassName="w-full h-full flex justify-center items-start"
                  displayCaption={false}
                />
              }
            />
          ))}
        </CardsWrapper>
      }
    />
  );
};

export default Accompagnement;
