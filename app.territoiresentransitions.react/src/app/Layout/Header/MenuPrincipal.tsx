import {useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {useId} from '@floating-ui/react';
import classNames from 'classnames';
import {HeaderPropsWithModalState, TNavDropdown, TNavItem} from './types';
import {makeNavItems} from './makeNavItems';
import {SelectCollectivite} from './SelectCollectivite';

/**
 * Affiche la nvaigation principale et le sélecteur de collectivité
 */
export const MenuPrincipal = (props: HeaderPropsWithModalState) => {
  const {currentCollectivite, ownedCollectivites, modalOpened, setOpenedId} =
    props;

  // enregistre un écouter d'événemens pour fermer un éventuel sous-menu ouvert
  // quand on clique en dehors
  useEffect(() => {
    const onClickOutside = (evt: globalThis.MouseEvent) => {
      // referme le menu ouvert quand on a cliqué en dehors d'un item de navigation
      const className = (evt.target as HTMLElement)?.className;
      if (typeof className === 'string' && !className.startsWith('fr-nav_'))
        setOpenedId(null);
    };
    document.body.addEventListener('mousedown', onClickOutside, {
      capture: true,
    });
    return () => document.body.removeEventListener('mousedown', onClickOutside);
  }, []);

  if (!currentCollectivite) {
    return null;
  }

  // récupère la liste des items à afficher dans le menu
  const items = makeNavItems(currentCollectivite);

  return (
    <nav
      className={classNames('fr-nav flex !justify-between', {
        'flex-col': modalOpened,
      })}
      role="navigation"
      aria-label="Menu principal"
    >
      <ul className="fr-nav__list">
        {items.map((item, i) =>
          item.hasOwnProperty('to') ? (
            <NavItem key={i} item={item as TNavItem} {...props} />
          ) : (
            <NavDropdown key={i} item={item as TNavDropdown} {...props} />
          )
        )}
      </ul>
      {ownedCollectivites ? <SelectCollectivite {...props} /> : null}
    </nav>
  );
};

/** Affiche un item de menu */
const NavItem = (props: HeaderPropsWithModalState & {item: TNavItem}) => {
  const {item, setModalOpened} = props;
  const {to, label} = item;
  // vérifie si l'item correspond au chemin courant
  const {pathname} = useLocation();
  const current = pathname.startsWith(to) ? 'page' : undefined;

  return (
    <li className="fr-nav__item">
      <Link
        to={to}
        target="_self"
        className="fr-nav__link"
        aria-controls="modal-header__menu"
        aria-current={current}
        onClick={() => setModalOpened(false)}
      >
        {label}
      </Link>
    </li>
  );
};

/** Affiche un menu déroulant contenant plusieurs items */
const NavDropdown = (
  props: HeaderPropsWithModalState & {
    item: TNavDropdown;
  }
) => {
  const {item, openedId, setOpenedId} = props;
  const {title, items, urlPrefix} = item;

  const id = useId(); // utilise le générateur d'id de floater
  const opened = openedId === id; // vérifie si le menu est ouvert

  // vérifie si le menu contient un item correspondant au chemin courant
  const {pathname} = useLocation();
  const current =
    (urlPrefix && urlPrefix.find(url => pathname.startsWith(url))) ||
    items.findIndex(({to}) => pathname.startsWith(to)) !== -1
      ? 'true'
      : undefined;

  return (
    <li className="fr-nav__item">
      <button
        className="fr-nav__btn"
        aria-controls={id}
        aria-expanded={opened}
        aria-current={current}
        onClick={() => setOpenedId(opened ? null : id)}
      >
        {title}
      </button>
      <div className={classNames('fr-menu', {'fr-collapse': !opened})} id={id}>
        <ul className="fr-menu__list" onClickCapture={() => setOpenedId(null)}>
          {items.map(item => (
            <NavItem key={item.to} {...props} item={item} />
          ))}
        </ul>
      </div>
    </li>
  );
};
