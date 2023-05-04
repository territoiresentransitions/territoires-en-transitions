import {useState} from 'react';
import classNames from 'classnames';
import ActionDiscussionsHeader from './ActionDiscussionsHeader';
import ActionDiscussionsFeed from './ActionDiscussionsFeed';
import ActionDiscussionNouvelleDiscussion from './ActionDiscussionNouvelleDiscussion';
import {useActionDiscussionFeed} from './data/useActionDiscussionFeed';
import {TActionDiscussion, TActionDiscussionStatut} from './data/types';
import {setRightPanelContent} from 'app/Layout/Layout';

export type ActionDiscussionsPanelProps = {
  actionId: string;
  vue: TActionDiscussionStatut;
  changeVue: (vue: TActionDiscussionStatut) => void;
  discussions: TActionDiscussion[];
};

/** Panneau de discussion d'une action */
export const ActionDiscussionsPanel = ({
  actionId,
  vue,
  changeVue,
  discussions,
}: ActionDiscussionsPanelProps) => {
  /** Gère l'affichage du panneau de discussions */
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/** bouton d'ouverture/fermeture du panneau */}
      <div
        data-test="ActionDiscussionsButton"
        className="hidden lg:block absolute top-6 right-6 border border-gray-200"
      >
        <button
          className={classNames('p-2 text-bf500', {
            'fr-icon-quote-line': !isOpen,
            'fr-icon-quote-fill bg-gray-200': isOpen,
          })}
          onClick={() => setIsOpen(!isOpen)}
        />
      </div>
      {/** contenu du panneau */}
      {isOpen
        ? setRightPanelContent(
            <ActionDiscussionPanelContent
              onClose={() => setIsOpen(false)}
              vue={vue}
              changeVue={changeVue}
              actionId={actionId}
              discussions={discussions}
            />
          )
        : null}
    </>
  );
};

/** Affiche le contenu du panneau de discussion d'une action */
export const ActionDiscussionPanelContent = ({
  onClose,
  vue,
  changeVue,
  actionId,
  discussions,
}: ActionDiscussionsPanelProps & {onClose: () => void}) => {
  return (
    <div data-test="ActionDiscussionsPanel" className="w-[28rem]">
      <ActionDiscussionsHeader
        closeActionDiscussions={onClose}
        vue={vue}
        changeVue={changeVue}
      />
      <ActionDiscussionNouvelleDiscussion actionId={actionId} />
      <ActionDiscussionsFeed vue={vue} discussions={discussions} />
    </div>
  );
};

type ActionDiscussionConnectedProps = {
  action_id: string;
};

const ActionDiscussionConnected = ({
  action_id,
}: ActionDiscussionConnectedProps) => {
  /** Gère la vue discussions "ouvertes" ou "fermées" */
  const [vue, setVue] = useState<TActionDiscussionStatut>('ouvert');
  const changeVue = (vue: TActionDiscussionStatut) => setVue(vue);

  /** Charge les discussions de l'action */
  const discussions = useActionDiscussionFeed({
    action_id,
    statut: vue,
  });

  return (
    <ActionDiscussionsPanel
      actionId={action_id}
      vue={vue}
      changeVue={changeVue}
      discussions={discussions}
    />
  );
};

export default ActionDiscussionConnected;
