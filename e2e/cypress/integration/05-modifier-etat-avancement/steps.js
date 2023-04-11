import {defineStep} from '@badeball/cypress-cucumber-preprocessor';
import {LocalSelectors} from './selectors';

// enregistre les définitions locales
beforeEach(() => {
  cy.wrap(LocalSelectors).as('LocalSelectors', {type: 'static'});
});

defineStep("aucun score n'est affiché", () => {
  cy.get('[data-test^=score-]').should('not.exist');
});

/*
defineStep('tous les scores sont à 0', () => {
  cy.get('[data-test^=score-]').each((el) =>
    cy.wrap(el).should('have.text', '0 %')
  );
});
*/

defineStep(
  'les scores sont affichés avec les valeurs suivantes :',
  dataTable => {
    cy.wrap(dataTable.rows()).each(([action, score]) => {
      cy.get(`[data-test="score-${action}"]`).should('contain.text', score);
    });
  }
);

defineStep(
  /j'assigne la valeur "([^"]+)" à l'état d'avancement de la tâche "([^"]+)"/,
  (avancement, tache) => {
    // le composant ne doit pas être désactivé
    cy.get(`[data-test="task-${tache}"] .MuiInput-root`).should(
      'not.have.class',
      'Mui-disabled'
    );
    // ouvre le composant Select
    cy.get(`[data-test="task-${tache}"]`).click();
    // la liste déroulante doit être visible
    cy.get('.MuiPaper-root').should('be.visible');
    // et sélectionne l'option voulue
    cy.get(
      `.MuiPaper-root [role=option][data-value="${avancementToValue[avancement]}"]`
    ).click();
  }
);

defineStep("l'état d'avancement des tâches n'est pas éditable", () => {
  // tous les Select sont désactivés
  cy.get(`[data-test^="task-"] .MuiInput-root`).should(
    'have.class',
    'Mui-disabled'
  );
});

defineStep("l'état d'avancement des tâches est éditable", () => {
  // tous les Select sont activés
  cy.get(`[data-test^="task-"] .MuiInput-root`).should(
    'not.have.class',
    'Mui-disabled'
  );
});

const avancementToValue = {
  'Non renseigné': -1,
  Fait: 1,
  Programmé: 2,
  'Pas fait': 3,
  Détaillé: 4,
  'Non concerné': 5,
};

defineStep(
  /je saisi "([^"]+)" dans le champ "Précisions" de la tâche "([^"]+)"/,
  (commentaire, tache) => {
    cy.get(`[data-test="comm-${tache}"]`)
      .type('{selectall}{backspace}' + commentaire)
      .blur();
  }
);

defineStep("aucun historique n'est affiché", () => {
  cy.get('[data-test^=action-statut-]').should('not.exist');
  cy.get('[data-test=empty_history]').should('be.visible');
});

defineStep(/l'historique contient (\d+) entrées?/, count => {
  cy.get('[data-test=empty_history]').should('not.exist');
  cy.get('[data-test=Historique] [data-test=item]').should(
    'have.length',
    count
  );
});

defineStep(
  /l'entrée (\d+) de l'historique est affichée avec les valeurs suivantes/,
  (num, dataTable) => {
    cy.get(`[data-test=Historique] [data-test=item]:nth(${num - 1})`)
      .should('exist')
      .within(() => {
        const lines = dataTable.raw();
        cy.wrap(lines).each(line =>
          cy.get('[data-test=desc]').should('contain.text', line[0])
        );
      });
  }
);

defineStep(
  /le détail de l'entrée (\d+) de l'historique n'est pas affiché/,
  num => {
    cy.get(
      `[data-test=Historique] [data-test=item]:nth(${
        num - 1
      }) [data-test=detail-on]`
    ).should('not.exist');
  }
);

defineStep(
  /le détail de l'entrée (\d+) est affiché avec les valeurs suivantes/,
  (num, dataTable) => {
    cy.get(
      `[data-test=Historique] [data-test=item]:nth(${
        num - 1
      }) [data-test=detail-on]`
    )
      .should('be.visible')
      .within(() => {
        const [precedente, courante] = dataTable.raw();
        if (precedente[1]) {
          cy.get('[data-test=prev]').should('contain.text', precedente[1]);
        } else {
          cy.get('[data-test=prev]').should('not.exist');
        }
        cy.get('[data-test=new]').should('contain.text', courante[1]);
      });
  }
);

defineStep(
  /je clique sur le bouton "Afficher le détail" de l'entrée (\d+)/,
  num => {
    cy.get(
      `[data-test=Historique] [data-test=item]:nth(${
        num - 1
      }) [data-test=detail-off] button`
    ).click();
  }
);

defineStep(
  /je clique sur le bouton "Masquer le détail" de l'entrée (\d+)/,
  num => {
    cy.get(
      `[data-test=Historique] [data-test=item]:nth(${
        num - 1
      }) [data-test=detail-on] button`
    ).click();
  }
);

defineStep(
  /je filtre l'historique avec le filtre "([^"]+)" par l'option "([^"]+)"/,
  (filtre, option) => {
    cy.get(`[data-test=filtre-${filtre}]`).click();
    cy.root()
      .get(`[data-test=filtre-${filtre}-options]`)
      .contains(option)
      .click();
    cy.get(`[data-test=filtre-${filtre}]`).click();
  }
);

defineStep(/je filtre l'historique avec comme date de fin "([^"]+)"/, date => {
  cy.get('[data-test=filtre-end-date]').type(date);
});

defineStep('je désactive tous les filtres', () => {
  cy.get('[data-test=desactiver-les-filtres]').click();
});
