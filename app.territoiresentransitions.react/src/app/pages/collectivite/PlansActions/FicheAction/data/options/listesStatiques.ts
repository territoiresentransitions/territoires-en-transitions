import {
    TFicheActionCibles,
    TFicheActionNiveauxPriorite,
    TFicheActionResultatsAttendus,
    TFicheActionStatuts,
} from 'types/alias';

type Options<T extends string> = {value: T; label: T}[];

export const ficheActionResultatsAttendusOptions: Options<TFicheActionResultatsAttendus> =
    [
        {
            value: 'Adaptation au changement climatique',
            label: 'Adaptation au changement climatique',
        },
        {
            value: 'Allongement de la durée d’usage',
            label: 'Allongement de la durée d’usage',
        },
        {
            value: 'Amélioration de la qualité de vie',
            label: 'Amélioration de la qualité de vie',
        },
        {
            value: 'Développement des énergies renouvelables',
            label: 'Développement des énergies renouvelables',
        },
        {value: 'Efficacité énergétique', label: 'Efficacité énergétique'},
        {
            value: 'Préservation de la biodiversité',
            label: 'Préservation de la biodiversité',
        },
        {
            value: 'Réduction des consommations énergétiques',
            label: 'Réduction des consommations énergétiques',
        },
        {value: 'Réduction des déchets', label: 'Réduction des déchets'},
        {
            value: 'Réduction des polluants atmosphériques',
            label: 'Réduction des polluants atmosphériques',
        },
        {
            value: 'Réduction des émissions de gaz à effet de serre',
            label: 'Réduction des émissions de gaz à effet de serre',
        },
        {value: 'Sobriété énergétique', label: 'Sobriété énergétique'},
    ];

export const ficheActionCiblesOptions: Options<TFicheActionCibles> = [
    {
        value: 'Grand public et associations',
        label: 'Grand public et associations'
    },
    {
        value: 'Public Scolaire',
        label: 'Public Scolaire'
    },
    {
        value: 'Acteurs économiques',
        label: 'Acteurs économiques'
    },
    {
        value: 'Acteurs économiques du secteur primaire',
        label: 'Acteurs économiques du secteur primaire'
    },
    {
        value: 'Acteurs économiques du secteur secondaire',
        label: 'Acteurs économiques du secteur secondaire'
    },
    {
        value: 'Acteurs économiques du secteur tertiaire',
        label: 'Acteurs économiques du secteur tertiaire'
    },
    {
        value: 'Partenaires',
        label: 'Partenaires'
    },
    {
        value: 'Autres collectivités du territoire',
        label: 'Autres collectivités du territoire'
    },
    {
        value: 'Collectivité elle-même',
        label: 'Collectivité elle-même'
    },
    {
        value: 'Elus locaux',
        label: 'Elus locaux'
    },
    {
        value: 'Agents',
        label: 'Agents'
    }
];

export const ficheActionStatutOptions: Options<TFicheActionStatuts> = [
    {value: 'À venir', label: 'À venir'},
    {value: 'En cours', label: 'En cours'},
    {value: 'Réalisé', label: 'Réalisé'},
    {value: 'En pause', label: 'En pause'},
    {value: 'Abandonné', label: 'Abandonné'},
];

export const ficheActionNiveauPrioriteOptions: Options<TFicheActionNiveauxPriorite> =
    [
        {value: 'Élevé', label: 'Élevé'},
        {value: 'Moyen', label: 'Moyen'},
        {value: 'Bas', label: 'Bas'},
    ];
