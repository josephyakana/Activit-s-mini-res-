import React, { useState, useEffect, useCallback, useRef, useContext, createContext } from "react";
import {
  Pickaxe,
  MapPin,
  Map as MapIcon,
  CalendarClock,
  Trash2,
  FileText,
  Upload,
  Droplet,
  Mountain,
  ShieldCheck,
  Phone,
  Mail,
  ClipboardList,
  Users,
  CreditCard,
  QrCode,
  LogOut,
  Lock,
  Plus,
  X,
  CheckCircle2,
  AlertTriangle,
  Search,
  Printer,
  Stamp,
  Star,
  Eye,
  EyeOff,
  Menu,
  ChevronRight,
  Pencil,
  Home as HomeIcon,
  LayoutDashboard,
  HelpCircle,
  Bell,
  Info,
  Settings,
  History,
  BarChart3,
  Building2,
} from "lucide-react";

/* ---------------------------------------------------------------
   Design tokens
   bg-cream var(--bg-page) · ink var(--text-strong) · navy var(--text)
   gold #C9962C · clay #A8542E · olive #4A5D3A
--------------------------------------------------------------- */

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

/* Variables de thème (clair / sombre). Les documents imprimés (fiche de déclaration, carte)
   n'utilisent jamais ces variables : ils restent toujours clairs, pour une impression correcte. */
const THEME_VARS = `
  [data-theme="clair"] {
    --bg-page: #F1EBDD;
    --text: #1C2B39;
    --text-muted: #5B5346;
    --border: #DCD1B8;
    --text-faint: #A99B7F;
    --text-strong: #2A2622;
    --border-light: #E3DAC6;
    --bg-subtle: #EDE6D4;
  }
  [data-theme="sombre"] {
    --bg-page: #1C2320;
    --text: #F1EBDD;
    --text-muted: #C9BFA9;
    --border: #3A4440;
    --text-faint: #8C9A90;
    --text-strong: #F5F0E4;
    --border-light: #333D38;
    --bg-subtle: #263029;
  }
`;

/* ---- Langue (FR/EN) — infrastructure de traduction ----
   Portée actuelle : navigation principale (menu, onglets, accueil, boutons courants).
   Les documents officiels imprimés (fiche de déclaration, carte) restent toujours en
   français, car ce sont des documents administratifs officiels de la République du Cameroun. */
const LangueContext = createContext("fr");

const TRANSLATIONS = {
  fr: {
    accueil: "Accueil", tableauDeBord: "Tableau de bord", profil: "Mon profil",
    notifications: "Notifications", historique: "Historique récent", arrondissement: "Arrondissement",
    aideFaq: "Aide / FAQ", contactAssistance: "Contact / Assistance", aPropos: "À propos",
    choixSectionLabel: "Choix de la section", sectionMiniereLabel: "Section minière", secteurIndustrielLabel: "Secteur industriel",
    parametres: "Paramètres", deconnexion: "Déconnexion", espaceInspecteurs: "Espace inspecteurs",
    statistiques: "Statistiques", artisans: "Artisans", ficheDeclaration: "Fiche de déclaration",
    cartes: "Cartes", inspecteurs: "Inspecteurs",
    enregistrer: "Enregistrer", annuler: "Annuler", fermer: "Fermer", modifier: "Modifier",
    supprimer: "Supprimer", telechargerPdf: "Télécharger en PDF", rechercher: "Rechercher",
    bienvenue: "Bienvenue", suivezEtControlez: "Suivi et contrôle des activités minières artisanales",
    // Fiche de déclaration (document imprimé)
    ficheTitre: "Fiche de déclaration", identificationExploitation: "1. Identification de l'exploitation",
    nomRaisonSociale: "Nom ou raison sociale", adresseTelDoc: "Adresse / Tél", numeroContribuable: "N° de contribuable",
    referenceTitreMinier: "Référence titre minier", titreMinierDoc: "Titre minier", localisationSite: "Localisation du site",
    departementDoc: "Département", arrondissementDoc: "Arrondissement", communeDoc: "Commune",
    quantiteEtTaxe: "2. Quantité produite et taxe ad valorem", designation: "Désignation",
    quantiteDeclaree: "Quantité déclarée", tauxApplicable: "Taux applicable", montantTaxe: "Montant de la taxe",
    repartition: "3. Répartition", beneficiaire: "Bénéficiaire", montant: "Montant", compteAffectation: "Compte d'affectation",
    tresorPublic: "Trésor public", documentsPresentes: "4. Documents présentés",
    autorisationExploitation: "Autorisation d'exploitation artisanale", registreProduction: "Registre de production",
    quittancePaiement: "Quittance de paiement des taxes", aucunDocumentCoche: "Aucun document coché",
    observationsLabel: "5. Observations", signatureExploitant: "Signature de l'exploitant",
    visaDelegue: "Visa du délégué départemental", ficheCreeePar: "Fiche créée par", leMot: "le",
    derniereModifPar: "Dernière modification par",
    // Carte d'artisan (document imprimé)
    carteTitre: "Carte d'artisan minier", nomDoc: "Nom", prenomDoc: "Prénom", dateNaissanceDoc: "Date de naissance",
    lieuNaissanceDoc: "Lieu de naissance", numeroCni: "N° CNI", numeroCarteLabel: "N° de carte", telephoneDoc: "Téléphone",
    siteExploitation: "Site d'exploitation", coordonneesGps: "Coordonnées GPS", substanceDoc: "Substance",
    zoneProspectionDoc: "Zone de prospection", dateDelivranceDoc: "Date de délivrance", dateExpirationDoc: "Date d'expiration",
    mentionLegaleCarte: "NB : «la présente carte ne peut être ni accordée, ni cédée, ni transférée à une tierce autre personne en faute de quoi le contrevenant expose aux sanctions prévues par la loi ».",
    numeroCniCarte: "NUMERO CNI", zoneProspectionCarte: "ZONE DE PROSPECTION", substanceExploitee: "SUBSTANCE EXPLOITEE",
    numeroCarteCourt: "N°CARTE", leMaireDe: "Le maire de", signatureTitulaire: "Signature du titulaire",
    dateDelivranceCarte: "Date de délivrance", dateExpirationCarte: "Date d'expiration",
    loiTitreCarte: "(ARTICLE 114, TITRE VI PORTANT CODE MINIER)",
    verificationQr: "Ce QR code permet de vérifier l'authenticité de la carte et les informations du titulaire auprès de la commune de",
    // Accueil
    ministereNom: "Ministère des Mines, de l'Industrie et du Développement Technologique",
    delegationBenoue: "Délégation départementale de la Bénoué", controleActivites: "Contrôle des activités minières artisanales",
    heroTexte: "Registre des artisans miniers, fiches de déclaration de terrain et délivrance des cartes professionnelles pour les sites aurifères dans le département de la Bénoué.",
    connecteAccedez: "Connecté — accédez au tableau de bord via le menu ☰",
    carteFichesTitle: "Fiches de déclaration", carteFichesTexte: "Constats de terrain consignés par les inspecteurs assermentés.",
    carteRegistreTitle: "Registre des artisans", carteRegistreTexte: "Suivi des opérateurs et des quantités déclarées, site par site.",
    carteCartesTitle: "Cartes professionnelles", carteCartesTexte: "Délivrance de la carte d'artisan minier après vérification.",
    carteExploitantsTitle: "Exploitants des eaux et carrières", carteExploitantsTexte: "Enregistrement des structures d'exploitation des eaux et des produits de carrières.",
    carteTaxeForfaitaireTitle: "Déclarations forfaitaires", carteTaxeForfaitaireTexte: "Taxe forfaitaire par unité physique pour les eaux et les produits de carrières.",
    carteControleTitle: "Contrôle technique et surveillance administrative", carteControleTexte: "Fiches de contrôle et de surveillance conformes aux exigences du MINMIDT.",
    // Registre des artisans (formulaire, liste, profil)
    registreTitre: "Registre des artisans miniers", listeArtisanBtn: "Liste d'artisan", ajouterArtisanBtn: "Ajouter un artisan",
    aucunArtisanEnregistre: "Aucun artisan enregistré.", aucunArtisanMoment: "Aucun artisan enregistré pour le moment.",
    photoArtisan: "Photo de l'artisan", champsObligatoiresPhoto: "Veuillez renseigner tous les champs obligatoires (*), y compris la photo.",
    typeSubstanceExploiter: "Type de substance à exploiter", substancePrecise: "Substance précise", statutLabel: "Statut",
    enRegleOpt: "En règle", nonRegleOpt: "Non en règle", dateDelivranceCarte2: "Date de délivrance de la carte",
    dateExpirationCarte2: "Date d'expiration de la carte",
    carteValableInfo: "La carte est valable 2 ans à partir de la date de délivrance. Le numéro de carte (format CAM-Année-Commune-N°) est généré automatiquement à l'enregistrement.",
    rechercherArtisanSite: "Rechercher un artisan ou un site...", tousStatuts: "Tous les statuts",
    supprimerArtisanConfirm: "Supprimer cet artisan du registre ?", siteNonPreciseTexte: "site non précisé",
    modifierProfilTitre: "Modifier le profil", profilArtisanTitre: "Profil de l'artisan",
    infosIdentiteNote: "Les informations d'identité (nom, prénom, date de naissance, CNI, n° de carte) ne sont pas modifiables ici.",
    categorieSubstanceLabel: "Catégorie de substance", substanceExploiteeLabel: "Substance exploitée",
    creePar2: "Créé par", derniereModifPar2: "Dernière modification par",
    voulezVousModifier: "Voulez-vous apporter des modifications ?", oui: "Oui", non: "Non",
    ouvrirGoogleMaps: "Ouvrir dans Google Maps",
    // Assistant de déclaration
    ficheDeclarationTerrain: "Fiche de déclaration de terrain", declarationsMensuellesArtisan: "Déclarations mensuelles consignées par artisan",
    enregistrerFicheBtn: "Enregistrer une fiche de déclaration", declarationBtn: "Déclaration", exporterCsvBtn: "Exporter en CSV",
    consulterDeclaration: "Consulter une déclaration", artisanLabel: "Artisan", choisirOpt: "— Choisir —",
    anneeLabel: "Année", moisLabelForm: "Mois", aucuneDeclarationInstant: "Aucune déclaration enregistrée pour l'instant.",
    nouvelleDeclarationSelection: "Nouvelle déclaration — sélection", artisanEnregistreLabel: "Artisan enregistré",
    validerBtn: "Valider", registreVideMessage: "Le registre est vide — ajoutez d'abord un artisan dans l'onglet Artisans.",
    nomRaisonSocialeExploitant: "Nom ou raison sociale de l'exploitant", numeroContribuableLabel: "Numéro de contribuable",
    referenceTitreLabel: "Référence du titre minier", localisationSiteLabel: "Localisation du site",
    designationSubstance: "Désignation de la substance", quantiteProduite: "Quantité produite",
    tauxApplicableLabel2: "Taux applicable", valeurMonetaire: "Valeur monétaire", prixMarche: "Prix sur le marché",
    montantTaxeUnite: "Montant de la taxe (par unité)", montantTotalTaxe: "Montant total de la taxe",
    beneficiaireLabel2: "Bénéficiaire", ctdCommuneOpt: "CTD (Commune)", appuiSuiviControle: "Appui suivi et contrôle des activités minières",
    tresorPublicOpt2: "Trésor public", structureLabel: "Structure", montantReparti: "Montant réparti",
    enregistrerDeclarationBtn: "Enregistrer la déclaration",
    historiqueDeclarationTitre: "Historique de déclaration", aucuneDeclarationEnreg: "Aucune déclaration enregistrée.",
    creeeParTexte: "Créée par", modifieeParTexte: "modifiée par", voirFicheTitle: "Voir la fiche", supprimerTitle: "Supprimer",
    confirmerSuppressionFiche: "Supprimer définitivement cette fiche de déclaration ?",
    // Onglet Cartes
    carteArtisanMinierTitre: "Carte d'artisan minier", genererCarteRectoVerso: "Générer la carte recto / verso d'un artisan enregistré",
    genererUneCarte: "Générer une carte", carteBtn: "Carte", choisirUnArtisan: "Choisir un artisan",
    aucuneCarteInstant: "Aucune carte enregistrée pour l'instant.", genereeParTexte: "Générée par",
    genererBtn: "Générer", sauvegarderBtn: "Sauvegarder",
    // Statistiques
    vueEnsemble: "Vue d'ensemble du registre et des déclarations", artisansEnregistres: "Artisans enregistrés",
    ficheDeclarationLabel: "Fiches de déclaration", cartesATraiterPriorite: "Cartes à traiter en priorité",
    expireeDepuis: "expirée depuis", dansJours: "dans", jTexte: "j",
    artisansParCommune: "Artisans par commune", aucuneCommuneArtisans: "Aucune commune avec artisans enregistrés et déclarés pour l'instant.",
    conformiteRegistre: "Conformité du registre", artisansEnRegleLabel: "Artisans en règle", artisansNonRegleLabel: "Artisans non en règle",
    taxeTotaleDeclaree: "Taxe totale déclarée", quantitesTotalesCommune: "Quantités totales déclarées par commune",
    sitesPlusActifs: "Sites les plus actifs", communeNonPrecisee: "Commune non précisée", siteNonPreciseStat: "Site non précisé",
    // Inspecteurs
    inspecteursTitre: "Inspecteurs", equipeDelegation: "Équipe de la délégation", chargementInspecteurs: "Chargement...",
    aucunInspecteur: "Aucun inspecteur enregistré.", confirmerSuppressionInspecteur: "Supprimer ce compte inspecteur ?",
    suppressionImpossible: "Suppression impossible :", carteExpireeLabel: "Cartes expirées", aRenouvelerLabel: "À renouveler",
    inspecteursAutorises: "Inspecteurs autorisés", nouveauxComptesInfo: "Les nouveaux comptes se créent depuis l'écran de connexion, via «Créer un compte»",
    vousTexte: "(vous)", administrateurRole: "Administrateur", inspecteurRole: "Inspecteur",
    confirmerSuppressionInspecteur2: "Supprimer ce compte inspecteur ? (le compte de connexion restera actif, seul le profil sera retiré)",
    suppressionImpossibleMoment: "Suppression impossible pour le moment.",
    // Mot de passe / verrouillage
    ancienMdpLabel: "Ancien mot de passe", nouveauMdpLabel: "Nouveau mot de passe", confirmerNouveauMdp: "Confirmer le nouveau mot de passe",
    veuillezAncienMdp: "Veuillez saisir votre ancien mot de passe.", mdpDoitEtreFort: "Le nouveau mot de passe doit atteindre le niveau «Fort».",
    confirmationNeCorrespondPas: "La confirmation ne correspond pas au nouveau mot de passe.",
    ancienMdpIncorrect: "L'ancien mot de passe saisi est incorrect.", erreurReessayer: "Une erreur est survenue. Réessayez.",
    validation: "Validation...", validerBtn2: "Valider",
    profilVerrouille: "Profil verrouillé", protegerInfosTexte: "Pour protéger vos informations personnelles, ressaisissez votre mot de passe pour continuer.",
    mdpPlaceholder: "Mot de passe", veuillezMdp: "Veuillez saisir votre mot de passe.", mdpIncorrect: "Mot de passe incorrect.",
    verification: "Vérification...", deverrouillerBtn: "Déverrouiller",
    // Profil inspecteur
    monProfilTitre: "Mon profil", modifierMonProfil: "Modifier mes informations", enregistrerModifications: "Enregistrer les modifications",
    changerMdpBtn: "Changer le mot de passe", verrouillerBtn: "Verrouiller", seDeconnecterBtn: "Se déconnecter",
    matriculeLabel: "Matricule", emailLabel: "Email", roleLabel: "Rôle",
    mdpChangeSucces: "Mot de passe modifié avec succès.", champsObligatoires2: "Veuillez renseigner tous les champs obligatoires (*).",
    echecEnregistrement: "Échec de l'enregistrement :",
    // Connexion / inscription
    espaceInspecteursTitre: "Espace inspecteurs", connexionSousTitre: "Connectez-vous pour accéder au tableau de bord",
    emailInspecteur: "Email", motDePasseLabel: "Mot de passe", seConnecterBtn: "Se connecter", connexion: "Connexion...",
    identifiantsIncorrects: "Identifiants incorrects.", pasEncoreDeCompte: "Pas encore de compte ?", creerUnCompte: "Créer un compte",
    compteCreeConnectezVous: "Compte créé avec succès — vous pouvez maintenant vous connecter.",
    creationCompteTitre: "Créer un compte", creationCompteSousTitre: "Renseignez vos informations pour rejoindre l'équipe",
    nomComplet: "Nom", champsRequis: "Veuillez renseigner tous les champs obligatoires (*).",
    dejaUnCompte: "Déjà un compte ?", seConnecterLien: "Se connecter", creerLeCompte: "Créer le compte",
    creationEnCours: "Création...",
    photoFacultatif: "Photo (facultatif)", motDePasseTitre: "Mot de passe", nouveauMdpDefini: "Nouveau mot de passe défini ✓",
    modifierMdpBtn: "Modifier le mot de passe", identifiantLabel: "Identifiant", profilMisAJour: "Profil mis à jour.",
    retourBtn: "Retour", voulezVousModifierMdp: "Voulez-vous modifier le mot de passe ?",
    impossibleEnregistrerMoment: "Impossible d'enregistrer les modifications pour le moment.", verrouillerMaintenant: "Verrouiller le profil maintenant",
    accesReserve: "Accès réservé", motDePasseOublie: "Mot de passe oublié ?", adresseEmailLabel: "Adresse email",
    compteCreeSucces: "Compte créé avec succès. Connectez-vous avec votre email et votre mot de passe.",
    mdpMisAJourConnectez: "Mot de passe mis à jour. Connectez-vous avec votre nouveau mot de passe.",
    aucunProfilAssocie: "Aucun profil inspecteur associé à ce compte.",
    emailNonConfirme: "Adresse e-mail non confirmée. Vérifiez votre boîte mail et cliquez sur le lien reçu avant de vous connecter.",
    retourAuSite: "Retour au site",
    mdpOublieTitre: "Mot de passe oublié", mdpOublieTexte: "Saisissez votre adresse email pour recevoir un mot de passe temporaire.",
    veuillezAdresseEmail: "Veuillez saisir votre adresse email.", genererMdpBtn: "Générer un mot de passe", generation: "Génération...",
    aucunCompteEmail: "Aucun compte inspecteur n'est associé à cette adresse email.",
    mdpParDefautTitre: "Mot de passe par défaut", mdpTempUsageUnique: "Utilisez ce mot de passe pour vous connecter une seule fois. Il vous sera ensuite demandé d'en créer un nouveau.",
    copieTexte: "Copié !", copierBtn: "Copier",
    creerNouveauMdp: "Créer un nouveau mot de passe", mdpTempUneFois: "Ce mot de passe temporaire ne peut être utilisé qu'une seule fois. Vous devez en créer un nouveau pour accéder au tableau de bord.",
    creerBtn: "Créer", nouveauMdpTitre: "Nouveau mot de passe", confirmerMdpLabel: "Confirmer le mot de passe",
    mdpDoitEtreFort2: "Le mot de passe doit atteindre le niveau «Fort».", confirmationNeCorrespond: "La confirmation ne correspond pas.",
    enregistrementEnCours: "Enregistrement...", impossibleMajMdp: "Impossible de mettre à jour le mot de passe. Réessayez.",
    confirmezAdresse: "Confirmez votre adresse", emailConfirmationEnvoye: "Un e-mail de confirmation a été envoyé à :",
    cliquezLienActiver: "Cliquez sur le lien qu'il contient pour activer votre compte, puis revenez ici pour vous connecter.",
    retourConnexion: "Retour à la connexion", verificationTitre: "Vérification", codeEnvoyeA: "Un code a été envoyé à votre adresse mail :",
    veuillezSaisirCode: "Veuillez le saisir ci-dessous.", nouvelleTentative: "Nouvelle tentative...",
    reessayerBtn: "Réessayer", genererCode: "Générer un code", revenirFormulaire: "Revenir au formulaire",
    nouveauCompteInspecteur: "Nouveau compte inspecteur", creerUnCompteTitre: "Créer un compte", photoLabel: "Photo",
    exMatricule: "Ex : BEN/2026/014", mdpConditions: "8 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.",
    envoiDuCode: "Envoi du code...", validerCreationCompte: "Valider la création du compte", dejaUnCompte2: "J'ai déjà un compte",
    impossibleEnvoyerCode: "Impossible d'envoyer le code pour le moment. Réessayez dans un instant.",
    mdpFortAvantContinuer: "Le mot de passe doit atteindre le niveau «Fort» (barre verte) avant de continuer.",
    contactLabel: "Contact", delegationBenoueVirgule: "Délégation départementale, Bénoué",
    aProposTexte: "Ce site appuie la délégation départementale du MINMIDT dans le suivi et le contrôle des activités minières artisanales, des exploitations d'eaux et des produits de carrières du département de la Bénoué : registre des artisans et des exploitants, fiches de déclaration de terrain, déclarations forfaitaires, fiches de contrôle technique et de surveillance administrative, et délivrance des cartes professionnelles, conformément à la réglementation en vigueur au Cameroun.",
    rechercherArtisanFiche: "Rechercher un artisan, une fiche...", aucunResultat: "Aucun résultat.",
    voirModifierProfil: "Voir / modifier le profil", rienASignaler: "Rien à signaler.",
    carteExpireeDepuisJ: "carte expirée depuis", carteARenouvelerDansJ: "carte à renouveler dans", nonEnRegleTexte: "non en règle",
    ficheNonConforme: "Fiche non conforme", aucuneFicheVous: "Aucune fiche enregistrée par vous pour l'instant.",
    actuelTexte: "actuel", artisanTexte: "Artisan",
    aideAjouterArtisan: "Ajouter un artisan", aideAjouterArtisanTexte: "onglet Artisans → « Ajouter un artisan ».",
    aideRemplirFiche: "Remplir une fiche", aideRemplirFicheTexte: "onglet Fiche de déclaration, formulaire en bas de page.",
    aideGenererCarte: "Générer une carte", aideGenererCarteTexte: "onglet Cartes → choisir l'artisan.",
    aideMdpOublie: "Mot de passe oublié", aideMdpOublieTexte: "contactez un administrateur de la délégation.",
    aideExploitant: "Enregistrer un exploitant (eaux/carrières)", aideExploitantTexte: "onglet Exploitants → choisir le type → « Ajouter un exploitant ».",
    aideControleTechnique: "Fiche de contrôle technique", aideControleTechniqueTexte: "onglet Contrôle technique et surveillance administrative → choisir le type et la structure.",
    textesDocsTitre: "Textes de loi et documents (PDF)", chargement: "Chargement...", aucunDocumentInstant: "Aucun document pour l'instant.",
    impossibleChargerDocs: "Impossible de charger les documents.", seulsFichiersPdf: "Seuls les fichiers PDF sont acceptés.",
    fichierDepasseTaille: "Le fichier dépasse la taille maximale autorisée (8 Mo).", echecEnvoiDocument: "Échec de l'envoi du document.",
    impossibleLireFichier: "Impossible de lire le fichier.", impossibleOuvrirDocument: "Impossible d'ouvrir ce document.",
    suppressionImpossibleTexte: "Suppression impossible.", confirmerSuppressionDoc: "Supprimer «", envoiTexte: "Envoi...",
    ajouterDocumentPdf: "Ajouter un document PDF",
    menuLabel: "Menu", langueLabel: "Langue", themeLabel: "Thème", clairOpt: "Clair", sombreOpt: "Sombre",
    langueTraductionNote: "Menu, onglets et boutons courants sont traduits. Les documents officiels imprimés (fiche de déclaration, carte) restent toujours en français.",
    reglagePropreAppareil: "Réglage propre à cet appareil.", seuilAlerteLabel: "Seuil d'alerte de renouvellement des cartes",
    joursAvantExpirationOpt: "jours avant expiration", reglageAppliqueTous: "Ce réglage s'applique à tous les inspecteurs de la délégation.",
    coordonneesAffichees: "Coordonnées affichées dans « Contact / Assistance »", telephonePlaceholder: "Téléphone",
    emailPlaceholder: "Email", adressePlaceholder: "Adresse", enregistreCoche: "Enregistré ✓",
    visibleTousInspecteurs: "Visible par tous les inspecteurs de la délégation.", notifsAAfficher: "Notifications à afficher (sur cet appareil)",
    cartesARenouvelerExpirees: "Cartes à renouveler / expirées", artisansNonEnRegle: "Artisans non en règle", fichesNonConformes: "Fiches non conformes",
    // Exploitants (eaux / carrières)
    exploitantsTabLabel: "Exploitants", typeExploitantBtn: "Type d'exploitant",
    artisanMinierOpt: "Artisans minier", exploitantsEauxOpt: "Exploitants des eaux", exploitantsCarrieresOpt: "Exploitants des produits de carrières",
    registreExploitantsEaux: "Registre des exploitants des eaux", registreExploitantsCarrieres: "Registre des exploitants des produits de carrières",
    genererCarteRectoVersoStruct: "Suivi des structures d'exploitation enregistrées",
    ajouterExploitantBtn: "Ajouter un exploitant", listeExploitantBtn: "Liste des exploitants",
    nomStructureLabel: "Nom de la structure / raison sociale", responsableLabel: "Nom du responsable",
    responsableTelLabel: "Téléphone du responsable", typeRessourceEauLabel: "Type de ressource en eau",
    typeRessourceCarriereLabel: "Type de matériau extrait", numeroAutorisationLabel: "N° d'autorisation d'exploitation",
    localisationStructure: "Localisation du site", aucunExploitantEnregistre: "Aucun exploitant enregistré.",
    aucunExploitantMoment: "Aucun exploitant enregistré pour le moment.", rechercherStructureSite: "Rechercher une structure ou un site...",
    confirmerSuppressionExploitant: "Supprimer cet exploitant du registre ?", champsObligatoiresStructure: "Veuillez renseigner tous les champs obligatoires (*).",
    fermerListe: "Fermer",
    dateDelivrancePermisLabel: "Date de délivrance permis d'exploitation (valable 5 ans)",
    dateExpirationPermisLabel: "Date d'expiration permis d'exploitation",
    dateDelivranceConditionnementLabel: "Date de délivrance autorisation de conditionnement (valable 5 ans)",
    dateExpirationConditionnementLabel: "Date d'expiration autorisation de conditionnement",
    dateDelivranceAutorisationLabel: "Date de délivrance autorisation d'exploitation (2 ans)",
    dateExpirationAutorisationLabel: "Date d'expiration autorisation d'exploitation",
    taxeForfaitaireParUnite: "Taxe forfaitaire par unité physique", ficheDeclarationExploitantBtn: "Fiche de déclaration",
    structureLabel2: "Structure", quantiteExtraite: "Quantité extraite", quantitePrelevee: "Quantité prélevée",
    materiauExtrait: "Matériau extrait", montantTaxeTotal: "Montant total de la taxe",
    nouvelleDeclarationExploitant: "Nouvelle déclaration — sélection", ficheDeclarationEaux: "Fiche de déclaration — Exploitation des eaux",
    ficheDeclarationCarrieres: "Fiche de déclaration — Produits de carrières", aucuneStructureEnregistree: "Aucune structure enregistrée — ajoutez d'abord un exploitant.",
    historiqueDeclarationsStructures: "Historique des déclarations",
    niuLabel: "Numéro d'identifiant unique (NIU)", rccmLabel: "Registre de commerce (RCCM)",
    siegeSocialLabel: "Siège social", statutJuridiqueLabel: "Statut juridique",
    capitalSocialLabel: "Capital social", nombreEmployesLabel: "Nombre d'employés",
    nombreEquipementsLabel: "Nombre d'équipements", typeEquipementLabel: "Type d'équipement",
    fonctionEquipementLabel: "Fonction de l'équipement", nomExploitantLabel: "Exploitant",
    telephoneExploitantLabel: "Téléphone de l'exploitant", adresseCompleteLabel: "Adresse complète",
    adresseCompleteTelephoneOpt: "Numéro de téléphone", adresseCompleteEmailOpt: "Adresse mail",
    adresseCompleteBoitePostaleOpt: "Boîte postale", adresseCompleteTousOpt: "Les trois",
    boitePostaleLabel: "Boîte postale", adresseMailLabel: "Adresse mail",
    numeroAutorisationConditionnementLabel: "N° autorisation de conditionnement",
    numeroAutorisationExploitationLabel: "N° autorisation d'exploitation",
    equipementsSelectionnesLabel: "sélectionné(s)", statutJuridiqueAutrePrecisez: "Précisez le statut juridique",
    photoStructureLabel: "Logo / photo de la structure", champsObligatoiresPhotoStructure: "Merci de remplir tous les champs obligatoires et d'ajouter la photo de la structure.",
    // Contrôle technique et surveillance administrative
    controleTechniqueTab: "Contrôle technique et surveillance administrative", controleTechniqueTitre: "Contrôle technique et surveillance administrative",
    controleTechniqueSousTitreEaux: "Surveillance administrative et contrôle technique des eaux",
    controleTechniqueSousTitreCarrieres: "Contrôle technique et surveillance administrative des carrières",
    remplirFicheControleBtn: "Remplir la fiche de contrôle", ficheControleTitre: "Fiche de contrôle technique et de surveillance administrative",
    dateControleLabel: "Date du contrôle", inspecteurLabel: "Inspecteur responsable",
    sectionControleTechnique: "I. Contrôle technique", sectionSurveillanceAdmin: "II. Surveillance administrative",
    sectionResultat: "III. Résultat global", sectionObservationsControle: "IV. Observations et recommandations",
    conformeLabel: "Conforme", resultatConforme: "Conforme", resultatNonConforme: "Non conforme", resultatReserves: "Conforme avec réserves",
    signatureInspecteur: "Signature de l'inspecteur", signatureResponsable: "Signature du responsable de la structure",
    // Items — contrôle technique eaux
    ct_installationsCaptage: "Conformité des installations de captage / forage",
    ct_equipementsConditionnement: "État des équipements de conditionnement",
    ct_debitAutorise: "Respect du débit / volume autorisé",
    ct_qualiteEau: "Qualité de l'eau conforme aux normes",
    ct_systemeTraitement: "Système de traitement fonctionnel",
    ct_hygieneSite: "Hygiène et salubrité du site",
    // Items — contrôle technique carrières
    ct_conformitePlans: "Conformité du site aux plans autorisés",
    ct_perimetreExploitation: "Respect du périmètre d'exploitation",
    ct_equipementsExtraction: "État des équipements d'extraction",
    ct_mesuresSecurite: "Mesures de sécurité (signalisation, EPI)",
    ct_gestionDechets: "Gestion des déchets et stériles",
    ct_rehabilitationSite: "État de réhabilitation du site",
    // Items — surveillance administrative
    sa_autorisationJour: "Autorisation / permis d'exploitation à jour",
    sa_conditionnementJour: "Autorisation de conditionnement à jour",
    sa_taxesJour: "Déclarations et taxes à jour",
    sa_registreProductionTenu: "Registre de production tenu",
    sa_engagementsEnv: "Respect des engagements environnementaux",
    sa_autresDocuments: "Autres documents administratifs en règle",
    ficheControleCreeePar: "Fiche créée par", aucuneFicheControleEnreg: "Aucune fiche de contrôle enregistrée.",
    historiqueControles: "Historique des contrôles",
  },
  en: {
    accueil: "Home", tableauDeBord: "Dashboard", profil: "My profile",
    notifications: "Notifications", historique: "Recent history", arrondissement: "District",
    aideFaq: "Help / FAQ", contactAssistance: "Contact / Support", aPropos: "About",
    choixSectionLabel: "Section choice", sectionMiniereLabel: "Mining section", secteurIndustrielLabel: "Industrial sector",
    parametres: "Settings", deconnexion: "Log out", espaceInspecteurs: "Inspector area",
    statistiques: "Statistics", artisans: "Artisans", ficheDeclaration: "Declaration form",
    cartes: "Cards", inspecteurs: "Inspectors",
    enregistrer: "Save", annuler: "Cancel", fermer: "Close", modifier: "Edit",
    supprimer: "Delete", telechargerPdf: "Download PDF", rechercher: "Search",
    bienvenue: "Welcome", suivezEtControlez: "Monitoring and control of artisanal mining activities",
    ficheTitre: "Declaration form", identificationExploitation: "1. Operator identification",
    nomRaisonSociale: "Name or company name", adresseTelDoc: "Address / Phone", numeroContribuable: "Taxpayer number",
    referenceTitreMinier: "Mining title reference", titreMinierDoc: "Mining title", localisationSite: "Site location",
    departementDoc: "Division", arrondissementDoc: "Subdivision", communeDoc: "Municipality",
    quantiteEtTaxe: "2. Quantity produced and ad valorem tax", designation: "Description",
    quantiteDeclaree: "Declared quantity", tauxApplicable: "Applicable rate", montantTaxe: "Tax amount",
    repartition: "3. Distribution", beneficiaire: "Beneficiary", montant: "Amount", compteAffectation: "Allocation account",
    tresorPublic: "Public Treasury", documentsPresentes: "4. Documents submitted",
    autorisationExploitation: "Artisanal mining authorization", registreProduction: "Production register",
    quittancePaiement: "Tax payment receipt", aucunDocumentCoche: "No document checked",
    observationsLabel: "5. Remarks", signatureExploitant: "Operator's signature",
    visaDelegue: "Divisional delegate's visa", ficheCreeePar: "Form created by", leMot: "on",
    derniereModifPar: "Last modified by",
    carteTitre: "Artisanal miner card", nomDoc: "Last name", prenomDoc: "First name", dateNaissanceDoc: "Date of birth",
    lieuNaissanceDoc: "Place of birth", numeroCni: "ID card N°", numeroCarteLabel: "Card N°", telephoneDoc: "Phone",
    siteExploitation: "Mining site", coordonneesGps: "GPS coordinates", substanceDoc: "Substance",
    zoneProspectionDoc: "Prospecting zone", dateDelivranceDoc: "Issue date", dateExpirationDoc: "Expiry date",
    mentionLegaleCarte: "NB: \"this card may not be granted, transferred or assigned to any third party, under penalty of the sanctions provided for by law\".",
    numeroCniCarte: "ID CARD N°", zoneProspectionCarte: "PROSPECTING ZONE", substanceExploitee: "SUBSTANCE MINED",
    numeroCarteCourt: "CARD N°", leMaireDe: "The Mayor of", signatureTitulaire: "Holder's signature",
    dateDelivranceCarte: "Issue date", dateExpirationCarte: "Expiry date",
    loiTitreCarte: "(ARTICLE 114, TITLE VI ON THE MINING CODE)",
    verificationQr: "This QR code verifies the card's authenticity and the holder's information with the municipality of",
    ministereNom: "Ministry of Mines, Industry and Technological Development",
    delegationBenoue: "Bénoué Divisional Delegation", controleActivites: "Artisanal mining activity control",
    heroTexte: "Register of artisanal miners, field declaration forms and issuance of professional cards for gold sites in the Bénoué division.",
    connecteAccedez: "Signed in — access the dashboard via the ☰ menu",
    carteFichesTitle: "Declaration forms", carteFichesTexte: "Field findings recorded by sworn inspectors.",
    carteRegistreTitle: "Artisan register", carteRegistreTexte: "Tracking of operators and declared quantities, site by site.",
    carteCartesTitle: "Professional cards", carteCartesTexte: "Issuance of the artisanal miner card after verification.",
    carteExploitantsTitle: "Water and quarry operators", carteExploitantsTexte: "Registration of water operations and quarry product structures.",
    carteTaxeForfaitaireTitle: "Flat-rate declarations", carteTaxeForfaitaireTexte: "Flat tax per physical unit for water and quarry products.",
    carteControleTitle: "Technical control and administrative surveillance", carteControleTexte: "Control and surveillance forms compliant with MINMIDT requirements.",
    registreTitre: "Artisanal miners register", listeArtisanBtn: "Artisan list", ajouterArtisanBtn: "Add an artisan",
    aucunArtisanEnregistre: "No artisan registered.", aucunArtisanMoment: "No artisan registered yet.",
    photoArtisan: "Artisan's photo", champsObligatoiresPhoto: "Please fill in all required fields (*), including the photo.",
    typeSubstanceExploiter: "Type of substance to be mined", substancePrecise: "Specific substance", statutLabel: "Status",
    enRegleOpt: "In good standing", nonRegleOpt: "Not in good standing", dateDelivranceCarte2: "Card issue date",
    dateExpirationCarte2: "Card expiry date",
    carteValableInfo: "The card is valid for 2 years from the issue date. The card number (format CAM-Year-Municipality-N°) is generated automatically upon registration.",
    rechercherArtisanSite: "Search for an artisan or a site...", tousStatuts: "All statuses",
    supprimerArtisanConfirm: "Delete this artisan from the register?", siteNonPreciseTexte: "site not specified",
    modifierProfilTitre: "Edit profile", profilArtisanTitre: "Artisan's profile",
    infosIdentiteNote: "Identity information (last name, first name, date of birth, ID card, card N°) cannot be changed here.",
    categorieSubstanceLabel: "Substance category", substanceExploiteeLabel: "Substance mined",
    creePar2: "Created by", derniereModifPar2: "Last modified by",
    voulezVousModifier: "Do you want to make changes?", oui: "Yes", non: "No",
    ouvrirGoogleMaps: "Open in Google Maps",
    ficheDeclarationTerrain: "Field declaration form", declarationsMensuellesArtisan: "Monthly declarations recorded per artisan",
    enregistrerFicheBtn: "Record a declaration form", declarationBtn: "Declaration", exporterCsvBtn: "Export as CSV",
    consulterDeclaration: "View a declaration", artisanLabel: "Artisan", choisirOpt: "— Choose —",
    anneeLabel: "Year", moisLabelForm: "Month", aucuneDeclarationInstant: "No declaration registered yet.",
    nouvelleDeclarationSelection: "New declaration — selection", artisanEnregistreLabel: "Registered artisan",
    validerBtn: "Confirm", registreVideMessage: "The register is empty — first add an artisan in the Artisans tab.",
    nomRaisonSocialeExploitant: "Operator's name or company name", numeroContribuableLabel: "Taxpayer number",
    referenceTitreLabel: "Mining title reference", localisationSiteLabel: "Site location",
    designationSubstance: "Substance description", quantiteProduite: "Quantity produced",
    tauxApplicableLabel2: "Applicable rate", valeurMonetaire: "Monetary value", prixMarche: "Market price",
    montantTaxeUnite: "Tax amount (per unit)", montantTotalTaxe: "Total tax amount",
    beneficiaireLabel2: "Beneficiary", ctdCommuneOpt: "CTD (Municipality)", appuiSuiviControle: "Support for mining activity monitoring and control",
    tresorPublicOpt2: "Public Treasury", structureLabel: "Structure", montantReparti: "Distributed amount",
    enregistrerDeclarationBtn: "Save the declaration",
    historiqueDeclarationTitre: "Declaration history", aucuneDeclarationEnreg: "No declaration registered.",
    creeeParTexte: "Created by", modifieeParTexte: "modified by", voirFicheTitle: "View form", supprimerTitle: "Delete",
    confirmerSuppressionFiche: "Permanently delete this declaration form?",
    carteArtisanMinierTitre: "Artisanal miner card", genererCarteRectoVerso: "Generate the front / back card of a registered artisan",
    genererUneCarte: "Generate a card", carteBtn: "Card", choisirUnArtisan: "Choose an artisan",
    aucuneCarteInstant: "No card registered yet.", genereeParTexte: "Generated by",
    genererBtn: "Generate", sauvegarderBtn: "Save",
    vueEnsemble: "Overview of the register and declarations", artisansEnregistres: "Registered artisans",
    ficheDeclarationLabel: "Declaration forms", cartesATraiterPriorite: "Cards to process as a priority",
    expireeDepuis: "expired for", dansJours: "in", jTexte: "d",
    artisansParCommune: "Artisans by municipality", aucuneCommuneArtisans: "No municipality with registered and declared artisans yet.",
    conformiteRegistre: "Register compliance", artisansEnRegleLabel: "Artisans in good standing", artisansNonRegleLabel: "Artisans not in good standing",
    taxeTotaleDeclaree: "Total declared tax", quantitesTotalesCommune: "Total quantities declared by municipality",
    sitesPlusActifs: "Most active sites", communeNonPrecisee: "Municipality not specified", siteNonPreciseStat: "Site not specified",
    inspecteursTitre: "Inspectors", equipeDelegation: "Delegation team", chargementInspecteurs: "Loading...",
    aucunInspecteur: "No inspector registered.", confirmerSuppressionInspecteur: "Delete this inspector account?",
    suppressionImpossible: "Deletion failed:", carteExpireeLabel: "Expired cards", aRenouvelerLabel: "To renew",
    inspecteursAutorises: "Authorized inspectors", nouveauxComptesInfo: "New accounts are created from the sign-in screen, via \"Create an account\"",
    vousTexte: "(you)", administrateurRole: "Administrator", inspecteurRole: "Inspector",
    confirmerSuppressionInspecteur2: "Delete this inspector account? (the login account will remain active, only the profile will be removed)",
    suppressionImpossibleMoment: "Deletion is not possible at the moment.",
    ancienMdpLabel: "Current password", nouveauMdpLabel: "New password", confirmerNouveauMdp: "Confirm new password",
    veuillezAncienMdp: "Please enter your current password.", mdpDoitEtreFort: "The new password must reach the «Strong» level.",
    confirmationNeCorrespondPas: "The confirmation does not match the new password.",
    ancienMdpIncorrect: "The current password entered is incorrect.", erreurReessayer: "An error occurred. Please try again.",
    validation: "Validating...", validerBtn2: "Confirm",
    profilVerrouille: "Profile locked", protegerInfosTexte: "To protect your personal information, re-enter your password to continue.",
    mdpPlaceholder: "Password", veuillezMdp: "Please enter your password.", mdpIncorrect: "Incorrect password.",
    verification: "Verifying...", deverrouillerBtn: "Unlock",
    monProfilTitre: "My profile", modifierMonProfil: "Edit my information", enregistrerModifications: "Save changes",
    changerMdpBtn: "Change password", verrouillerBtn: "Lock", seDeconnecterBtn: "Log out",
    matriculeLabel: "Staff number", emailLabel: "Email", roleLabel: "Role",
    mdpChangeSucces: "Password changed successfully.", champsObligatoires2: "Please fill in all required fields (*).",
    echecEnregistrement: "Save failed:",
    espaceInspecteursTitre: "Inspector area", connexionSousTitre: "Sign in to access the dashboard",
    emailInspecteur: "Email", motDePasseLabel: "Password", seConnecterBtn: "Sign in", connexion: "Signing in...",
    identifiantsIncorrects: "Incorrect credentials.", pasEncoreDeCompte: "Don't have an account yet?", creerUnCompte: "Create an account",
    compteCreeConnectezVous: "Account created successfully — you can now sign in.",
    creationCompteTitre: "Create an account", creationCompteSousTitre: "Fill in your information to join the team",
    nomComplet: "Last name", champsRequis: "Please fill in all required fields (*).",
    dejaUnCompte: "Already have an account?", seConnecterLien: "Sign in", creerLeCompte: "Create account",
    creationEnCours: "Creating...",
    photoFacultatif: "Photo (optional)", motDePasseTitre: "Password", nouveauMdpDefini: "New password set ✓",
    modifierMdpBtn: "Change password", identifiantLabel: "Username", profilMisAJour: "Profile updated.",
    retourBtn: "Back", voulezVousModifierMdp: "Do you want to change the password?",
    impossibleEnregistrerMoment: "Unable to save changes at the moment.", verrouillerMaintenant: "Lock the profile now",
    accesReserve: "Restricted access", motDePasseOublie: "Forgot password?", adresseEmailLabel: "Email address",
    compteCreeSucces: "Account created successfully. Sign in with your email and password.",
    mdpMisAJourConnectez: "Password updated. Sign in with your new password.",
    aucunProfilAssocie: "No inspector profile associated with this account.",
    emailNonConfirme: "Email address not confirmed. Check your inbox and click the link received before signing in.",
    retourAuSite: "Back to site",
    mdpOublieTitre: "Forgot password", mdpOublieTexte: "Enter your email address to receive a temporary password.",
    veuillezAdresseEmail: "Please enter your email address.", genererMdpBtn: "Generate a password", generation: "Generating...",
    aucunCompteEmail: "No inspector account is associated with this email address.",
    mdpParDefautTitre: "Default password", mdpTempUsageUnique: "Use this password to sign in once. You will then be asked to create a new one.",
    copieTexte: "Copied!", copierBtn: "Copy",
    creerNouveauMdp: "Create a new password", mdpTempUneFois: "This temporary password can only be used once. You must create a new one to access the dashboard.",
    creerBtn: "Create", nouveauMdpTitre: "New password", confirmerMdpLabel: "Confirm password",
    mdpDoitEtreFort2: "The password must reach the «Strong» level.", confirmationNeCorrespond: "The confirmation does not match.",
    enregistrementEnCours: "Saving...", impossibleMajMdp: "Unable to update the password. Please try again.",
    confirmezAdresse: "Confirm your address", emailConfirmationEnvoye: "A confirmation email has been sent to:",
    cliquezLienActiver: "Click the link it contains to activate your account, then come back here to sign in.",
    retourConnexion: "Back to sign in", verificationTitre: "Verification", codeEnvoyeA: "A code has been sent to your email address:",
    veuillezSaisirCode: "Please enter it below.", nouvelleTentative: "Retrying...",
    reessayerBtn: "Try again", genererCode: "Generate a code", revenirFormulaire: "Back to the form",
    nouveauCompteInspecteur: "New inspector account", creerUnCompteTitre: "Create an account", photoLabel: "Photo",
    exMatricule: "E.g.: BEN/2026/014", mdpConditions: "At least 8 characters, with uppercase, lowercase, digit and special character.",
    envoiDuCode: "Sending code...", validerCreationCompte: "Confirm account creation", dejaUnCompte2: "I already have an account",
    impossibleEnvoyerCode: "Unable to send the code at the moment. Please try again shortly.",
    mdpFortAvantContinuer: "The password must reach the «Strong» level (green bar) before continuing.",
    contactLabel: "Contact", delegationBenoueVirgule: "Bénoué Divisional Delegation",
    aProposTexte: "This site supports the MINMIDT divisional delegation in monitoring and controlling artisanal mining activities, water operations, and quarry products in the Bénoué division: artisan and operator register, field declaration forms, flat-rate declarations, technical control and administrative surveillance forms, and issuance of professional cards, in accordance with regulations in force in Cameroon.",
    rechercherArtisanFiche: "Search for an artisan, a form...", aucunResultat: "No results.",
    voirModifierProfil: "View / edit profile", rienASignaler: "Nothing to report.",
    carteExpireeDepuisJ: "card expired for", carteARenouvelerDansJ: "card to renew in", nonEnRegleTexte: "not in good standing",
    ficheNonConforme: "Non-compliant form", aucuneFicheVous: "No form registered by you yet.",
    actuelTexte: "current", artisanTexte: "Artisan",
    aideAjouterArtisan: "Add an artisan", aideAjouterArtisanTexte: "Artisans tab → \"Add an artisan\".",
    aideRemplirFiche: "Fill in a form", aideRemplirFicheTexte: "Declaration form tab, form at the bottom of the page.",
    aideGenererCarte: "Generate a card", aideGenererCarteTexte: "Cards tab → choose the artisan.",
    aideMdpOublie: "Forgot password", aideMdpOublieTexte: "contact a delegation administrator.",
    aideExploitant: "Register an operator (water/quarry)", aideExploitantTexte: "Operators tab → choose the type → \"Add an operator\".",
    aideControleTechnique: "Technical control form", aideControleTechniqueTexte: "Technical control and administrative surveillance tab → choose type and structure.",
    textesDocsTitre: "Legal texts and documents (PDF)", chargement: "Loading...", aucunDocumentInstant: "No document yet.",
    impossibleChargerDocs: "Unable to load documents.", seulsFichiersPdf: "Only PDF files are accepted.",
    fichierDepasseTaille: "The file exceeds the maximum allowed size (8 MB).", echecEnvoiDocument: "Failed to upload the document.",
    impossibleLireFichier: "Unable to read the file.", impossibleOuvrirDocument: "Unable to open this document.",
    suppressionImpossibleTexte: "Deletion failed.", confirmerSuppressionDoc: "Delete \"", envoiTexte: "Uploading...",
    ajouterDocumentPdf: "Add a PDF document",
    menuLabel: "Menu", langueLabel: "Language", themeLabel: "Theme", clairOpt: "Light", sombreOpt: "Dark",
    langueTraductionNote: "Menu, tabs and common buttons are translated. Official printed documents (declaration form, card) always remain in French.",
    reglagePropreAppareil: "Setting specific to this device.", seuilAlerteLabel: "Card renewal alert threshold",
    joursAvantExpirationOpt: "days before expiry", reglageAppliqueTous: "This setting applies to all delegation inspectors.",
    coordonneesAffichees: "Contact details shown in \"Contact / Support\"", telephonePlaceholder: "Phone",
    emailPlaceholder: "Email", adressePlaceholder: "Address", enregistreCoche: "Saved ✓",
    visibleTousInspecteurs: "Visible to all delegation inspectors.", notifsAAfficher: "Notifications to display (on this device)",
    cartesARenouvelerExpirees: "Cards to renew / expired", artisansNonEnRegle: "Artisans not in good standing", fichesNonConformes: "Non-compliant forms",
    exploitantsTabLabel: "Operators", typeExploitantBtn: "Operator type",
    artisanMinierOpt: "Mining artisans", exploitantsEauxOpt: "Water operators", exploitantsCarrieresOpt: "Quarry product operators",
    registreExploitantsEaux: "Water operators register", registreExploitantsCarrieres: "Quarry product operators register",
    genererCarteRectoVersoStruct: "Tracking of registered operating structures",
    ajouterExploitantBtn: "Add an operator", listeExploitantBtn: "Operators list",
    nomStructureLabel: "Structure name / company name", responsableLabel: "Manager's name",
    responsableTelLabel: "Manager's phone", typeRessourceEauLabel: "Type of water resource",
    typeRessourceCarriereLabel: "Type of material extracted", numeroAutorisationLabel: "Operating authorization N°",
    localisationStructure: "Site location", aucunExploitantEnregistre: "No operator registered.",
    aucunExploitantMoment: "No operator registered yet.", rechercherStructureSite: "Search for a structure or a site...",
    confirmerSuppressionExploitant: "Delete this operator from the register?", champsObligatoiresStructure: "Please fill in all required fields (*).",
    fermerListe: "Close",
    dateDelivrancePermisLabel: "Operating permit issue date (valid 5 years)",
    dateExpirationPermisLabel: "Operating permit expiry date",
    dateDelivranceConditionnementLabel: "Packaging authorization issue date (valid 5 years)",
    dateExpirationConditionnementLabel: "Packaging authorization expiry date",
    dateDelivranceAutorisationLabel: "Operating authorization issue date (2 years)",
    dateExpirationAutorisationLabel: "Operating authorization expiry date",
    taxeForfaitaireParUnite: "Flat tax per physical unit", ficheDeclarationExploitantBtn: "Declaration form",
    structureLabel2: "Structure", quantiteExtraite: "Quantity extracted", quantitePrelevee: "Quantity withdrawn",
    materiauExtrait: "Material extracted", montantTaxeTotal: "Total tax amount",
    niuLabel: "Unique identification number (NIU)", rccmLabel: "Trade register (RCCM)",
    siegeSocialLabel: "Head office", statutJuridiqueLabel: "Legal status",
    capitalSocialLabel: "Share capital", nombreEmployesLabel: "Number of employees",
    nombreEquipementsLabel: "Number of equipment items", typeEquipementLabel: "Equipment type",
    fonctionEquipementLabel: "Equipment function", nomExploitantLabel: "Operator",
    telephoneExploitantLabel: "Operator phone", adresseCompleteLabel: "Full address",
    adresseCompleteTelephoneOpt: "Phone number", adresseCompleteEmailOpt: "Email address",
    adresseCompleteBoitePostaleOpt: "PO box", adresseCompleteTousOpt: "All three",
    boitePostaleLabel: "PO box", adresseMailLabel: "Email address",
    numeroAutorisationConditionnementLabel: "Packaging authorization N°",
    numeroAutorisationExploitationLabel: "Operating authorization N°",
    equipementsSelectionnesLabel: "selected", statutJuridiqueAutrePrecisez: "Specify legal status",
    photoStructureLabel: "Structure logo / photo", champsObligatoiresPhotoStructure: "Please fill in all required fields and add the structure photo.",
    nouvelleDeclarationExploitant: "New declaration — selection", ficheDeclarationEaux: "Declaration form — Water operations",
    ficheDeclarationCarrieres: "Declaration form — Quarry products", aucuneStructureEnregistree: "No structure registered — add an operator first.",
    historiqueDeclarationsStructures: "Declaration history",
    controleTechniqueTab: "Technical control and administrative surveillance", controleTechniqueTitre: "Technical control and administrative surveillance",
    controleTechniqueSousTitreEaux: "Administrative surveillance and technical control of water operations",
    controleTechniqueSousTitreCarrieres: "Technical control and administrative surveillance of quarries",
    remplirFicheControleBtn: "Fill in the control form", ficheControleTitre: "Technical control and administrative surveillance form",
    dateControleLabel: "Control date", inspecteurLabel: "Inspector in charge",
    sectionControleTechnique: "I. Technical control", sectionSurveillanceAdmin: "II. Administrative surveillance",
    sectionResultat: "III. Overall result", sectionObservationsControle: "IV. Remarks and recommendations",
    conformeLabel: "Compliant", resultatConforme: "Compliant", resultatNonConforme: "Non-compliant", resultatReserves: "Compliant with reservations",
    signatureInspecteur: "Inspector's signature", signatureResponsable: "Structure manager's signature",
    ct_installationsCaptage: "Compliance of catchment / borehole facilities",
    ct_equipementsConditionnement: "Condition of packaging equipment",
    ct_debitAutorise: "Compliance with authorized flow / volume",
    ct_qualiteEau: "Water quality meets standards",
    ct_systemeTraitement: "Treatment system functional",
    ct_hygieneSite: "Site hygiene and cleanliness",
    ct_conformitePlans: "Site compliance with authorized plans",
    ct_perimetreExploitation: "Compliance with operating perimeter",
    ct_equipementsExtraction: "Condition of extraction equipment",
    ct_mesuresSecurite: "Safety measures (signage, PPE)",
    ct_gestionDechets: "Management of waste and tailings",
    ct_rehabilitationSite: "Site rehabilitation status",
    sa_autorisationJour: "Operating permit / authorization up to date",
    sa_conditionnementJour: "Packaging authorization up to date",
    sa_taxesJour: "Declarations and taxes up to date",
    sa_registreProductionTenu: "Production register kept",
    sa_engagementsEnv: "Compliance with environmental commitments",
    sa_autresDocuments: "Other administrative documents in order",
    ficheControleCreeePar: "Form created by", aucuneFicheControleEnreg: "No control form registered.",
    historiqueControles: "Control history",
  },
};

function useT() {
  const langue = useContext(LangueContext);
  return (key) => (TRANSLATIONS[langue] && TRANSLATIONS[langue][key]) || TRANSLATIONS.fr[key] || key;
}

const LOGO_BIBEMI = "data:image/png;base64,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";
const LOGO_CAMEROUN = "data:image/png;base64,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";
const LOGO_BASCHEO = "data:image/png;base64,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";
const LOGO_GAROUA2 = "data:image/png;base64,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";
const LOGO_GAROUA1 = "data:image/png;base64,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";
const LOGO_DEMSA = "data:image/png;base64,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";
const LOGO_PITOA = "data:image/png;base64,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";
const LOGO_GAROUA3 = "data:image/png;base64,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";
const LOGO_TCHEBOUA = "data:image/png;base64,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Pvroa4ui8Muy3GfatGmNoiiqHkNFkqT18+bNm3zttdceMmbMmD8SQhqC7TS3V3ssNFQaMmTIG6tWrVLGjRu3aPDgwUu7urrUZrPZf5PGv9fWLElSU3i8ylFHHfXLRYsWHTBlypSrOzo6QAi4MW3atAYAtBEymI4cOfL1M844wzRNs++zzz6rn3POOVePHDnywrIs6bRp05q7khNVVbVt5cqVW2QVkHO+wxotAuRqmqaDGWPTTdP8fOVAIGIbY2ya7/t/iOP49jAMv9HbiUDEfogoS5IEZVke4nn1xypj2YrdvbVTZJ+XMsbetm17LmPsTdM0V7ynvZsho0dg8Zosy8bpug6u635aVdXToig6vnLfhT1RDcO4LcuyBznnV3LO2wGgLcuykUVR3JKmabELEFIT/H2SruvvafTO7tT48eMbkiR167p+jm3bS5YvX/4nxlibwNGuefPmpXPmzDnlmGOO+TcA+HQURftPnTq1KWIdeNZZZ107bty41wcPHnztgw8+OOKVV14+cuLEid9wHEdBxObWWocRUVJVdeOqVavWvvTSSwOWLVt26JAhQ9a++eabH3nPViCINShhGK5ZvXp1/d577x04cODAtfPnz78NAK5ftWrViS1usSxJUrdlWcuXL18+ZtasWXeNHz++CwC6Xn755VcAgAPAkZzz/jNnzmzAbvYgyh0dG+HZZ5/d4SxEWZZHTJw48btr1qz5XEdHx98AQDYMo9ma3AzDUDvvvPPW7rXXXsuee+45q1V469atu+ORRx7Ze82aNV956KGHpg0bNmzq3Xfffc1XvvKVbxJCFERsVI2QABJUf7vPPvu8vX79+iEjRoy4b8CAAa8vWrRoZaPRAHEKQJKkRrPZbO63336rzz///LH77LPPR1euXHnrkiVLBnV0dHQPHjwYDj/88GsREdI0RQBoyLIM++yzz+Xr169v6rp+RhiGQ5IkOWTGjBny0qVL1wLAcePHj1dgF9qYu7u75T59+jShpYYMgyBw3491pGmqiJroBx3H+UwURYRzvvfW6jpEJllK0/QGADioNYAuWod/6DhOp6IoqGkael79P0XO8mIBI52tbENVVfR9f4lt2495Xv0ez6svMwxjdUUFATbBhWVZmCTJkcJzXCRJUpe0yf3viOP44l6JU0n0pvRnjL1UFMXrlmXZZVkewTnfvyzL/86ybGGW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";
const LOGO_MAYOHOURNA = "data:image/png;base64,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";
const LOGO_LAGDO = "data:image/png;base64,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";
const LOGO_DEMBO = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABbCAYAAADz9JKnAAA+J0lEQVR42t29d3xb1d0//rnnXl1JV9uWl2xJlmTJQ9hOUBTixOAkZjgQiBMIyEBoWWWUUaDYBVr6UDoeh9VCFxRoKSNhhySQAAmJSUKGcRJbtpN4SJaHPOQh2bLmHb8/cpUK4wxDn36f53deL71sS7pnfM7n8/7Mc4zBf75hAID4n3TyBxVLK6S9Pb1FDMuUYBiWz7KsDsOwNJqmZQRBEACA0TQdAQA2FosJSJIEHMcFAMAAQIRhGB+O4x4AOEbgxJH8ggLn9u3bQjPGxvnvc//pRf8nx8KTietw1IgOHTq4iKbpCo7jSgBAiRAKA0C/UCjsIASCLoVM3pORmTEQiUTZzz77dOKnDz+c1dLckrZ9+7aW2ro60Z133hF99JHHFP39fZpAIGCIRqOWeCxewLCMHgDEHMcNAcABkiQ/c7vdbSzLJobHeWKz/38hdIKDGQAAl9tFXFx58WU0Ta8BAAuO8ABBEAelMsnO9z/44IDRYDy1cIQQmIymbADIsZ5ndXd3d1sHBwdXAYBZpVT93bZgwZ6DBw6UYAgLicTivpUrV/avr68/9XxtXZ142yefLAtOBatYjp0Xj8cjBEHsUigUbzmdTk9iGP4n+3+V0N8gcGlJae74xPgPGYZZRhDEOCWmtsybP/+DjRs3+AEAKpdXSno8PeUcx9kxDMtDGFIBAIfjeBhDWFCvz30mGJzKOHL48K5wJIKZjKba1VeveXHzpo8eBoB0DGEyOk5LeC4NAEA7hrB9XV1de1mWBYQQ2Gw2+9jY2Lp4PG5nGMYll8lf6ujsaOC5/H+Uw/+nCE0kIKIgvyB/cmryQRzHSwUCwW6NRvPi3r173fxn58Xp+CoAmIcwROI43icgBS0kSbYrFUrX317523CeKY9JiLvDUZNy8MCBP0VjUUyv07+w/8D+fcnc39Xdhe6+68eZPt+IJRaLlcRj8VKGYdJZjh0FgC/s9oXvbty4IYIQAovZcksoHLqJ47hpCSV5vqOz41N+HOJ/AsP/3YRG/AS5skVl2f0D/b9gGKZUQkk2ffr5p88YDUa6qmqFyuXq/gHDMBchDIUB4EulSnng7XfedibDxow+EQCwDkdNmk6vIwAg0nHiBGXJzx9YX1+fLPrfet7hqJE1Nx+dR8fpMgBYwnLsoIAQvHb8xPH9CCHIzc1dE4/H72MYZiI1NfW/nE5ncxKGM/C/sBEJztLpdLUajeaIIdfwuMvtwgEACgsLzSaT6QVDrmGrOc/8C7vdbkQIgcvtEs3oA0+ySr7Vv0ajWafRaP6Y/N5skFWxtIIAAJLHakHZorLLa+vqZIWFhZebTKYNer3+ncLCwurEnPV6/S0ajeaIXq9/zuV2kWfo//9ZS1gTMH/+vFKNRvOlRqN5q2JpRSb/nt6Qa3hRp9N9XJBfcEttXZ2Yx+TsyuWV71VVrWitqlrxsxmKabaGI4RAq9W+rlarO2vr6gRnkEgs8dn8+fMqi4uLny2yWu8vLSl9rnJ5pYmHrTJDruGfhlzDpiKrdSm/IaROp/uTRqM5XJBfsDRpTtj/a+hAAMAihECv09dGY9EfCEnhf7l73O+63C7s4sqLn4zH42UCgeD1HTt3vGY0GDneXs6MRWLPKpRKkVKplPlGRiI2+4Lq9fX1DD8nbpZ5csXFxRmTk5NPIgzFAWCzu8f96SwijgMAgxCC4vOKfxJn6BQBTjzb3NLsV6vV8qysrF8gDHU3tzT/FQDAYrEsj0Qi9+MIHzMajQ/v/GLnmNForJycnPw9SZKbhoaGfsFjN/o+ihJ9DyLjAMDW1tWRmZmZ708Fpyqys7Mvcve43y0sLLxs2dJlX9I0DUuWlF/hcrn+YTQYOYejJru2rg5naOYnpIik4rHYCb/f30OzdP/BgwcSm86dZp5YIBC4JB6PtwqFwlcBoHoWZsEBgJk/f56moLDw2ThDj7S3tT3e3NLsr1haIVqwwF6y4vLLH48zdLTIan3OZrNldXR0fNHf37+K5diDnV2dWywWyzqXy7XzlltvtcdisaLMzMzPHY4aOU9k/D9NaBwAGLvdnvPqK6/sB4Djo6OjVzQ1NY1ptdqnA4HAQ6SAvKe3t/fnACCpXF75JACgwSFv5cGDB+4BgGICEW0AEI/HYiRDM66G3Q20w1FzpoVwOMIrJJTk4CfbPzkcjUWzyhaVyXjr5pTHV1pSelE0Fn8UAF5rb2t7i8dqIBBREwxOUU2NX69rb2v7O47QO6FQ6JdFVutilmXB4/G8qFKq1obD4at0Ot0rd955R2x0dPRqAPhyx47PDxQXF+fzkkP8pwhNAABTZLWWut3uHSRJPuf1eh8rslo1mZmZnzIMQw8NDV3a2dXZnKTYqLJFZfMBYEEsErtcKpU5Q6FQLBqLcqFQiI5Go8GqqhXLToOHGAAwVVUr1AzLpAiE5BGjwcgJBIKu0dHRS5Lt9SKr9dY4Q6+QUNSj7W1tzUVWK9mwu4GuqlpRnpaeHv/qq68+A4Bhm8222ul07icF5OMszawuslpvAABobmkeGBgYWIthWHvFRRU7LBZLgdfrfZIkyccHBwc/tlgsS/iNJb4LZ87ZPjbnmReOjY2+TZLknV6vd7NOp1scCoX+QRDEC/39/c9zHIcqllbgnh4PJ5PK2JTUFDtBCCpCwWksFo8NIRzrY2hGghBiBKRAz7FcAY7QW1u2bB5PMhG/MUcCJ1aFI2HW5XLtBACQy+URALja7/dvttlshEwmewzDsMix9vZ6r9cbBQBUWXkx19rayuXlmfOnJifNNE3XYxho09Mzv+7q6uoeHh6eHh0b/VylUlWmqdOW3nLbrV/t3bsXCwQCX6lUqt5IJPInmUzW6/V6t+Tk5DSOj4+/mZGe0eb3+7t4WrD/ExyNAwBtMpnOn/BPvCWTytZ5vd5der1+NU3TzysUitt6e3vf4yfANexuoAGAHRsfk4hEYiYeiylohg6KxeJAaDrE0gw9zdAME4vEggqlcldaenqotq7udAqHi9PxpVKp9LPEvJcsKd/Pcmx6VdUKdSgU+m+hULj32LFjf02SCnbjxg0MACClUrmTZukQTdN6hPAAAIQrllasqFhacUN5eXlWR0fH71mOdW3ZvHl9xdIKCgAwj8ezK02ddh0A/Fyj0azr6OjYDwArp4JTfzGZTMvmytn4XKyLIqs1b3xs7B2SJH/Y19d3QK1W12AY9tOsrKxVLS0t3cleVdmisotzc3OVer1eODE+QUxOTVoInAgjhDzT09NpEolkIh6P50ilUkEsHtVFQuGuN954vX8GdGC8o5IyMNB/nUKheH5wcJADALy1tZVWKpXWUGhaQhBEH0mSisHBwVZekpI3i2ttbUWeHs/BnJycr2iGWUKJxZ0sx3bHIrExsUh8qU6vO3q46bAzLS0tHJwK/lSryzk8NDQ0NTw87K+srHxvbGzsKalUKh4aGvpErVbvDAaDr6vV6q8CgcBAkuv+vTkaAwCuYmmFcmR4+G2JRPKQ1+s9oNPpasRi8f0LFy68vKmpaTBhhQAAV15efgVFUWk4gd8wMDDwAwDojUVjPgDwR6NRIUmSEYZmqEgkwgEAKxZRfpt9wZHTWRtNX3+9NB6PH2tqaoonjQMEQWyKxWJXOp3O98KRSLHNZrtkFqWKAQBTsbRCqlQoNRKK6rLZFxy94IJFk29ueLOdZmlBVqYGAQBx7NixPUKh8IVwKPJEkdVqAQDYtGnT9DVr165gGGaVOc98d29vb7tEIrk5FAq9YbfbtTxjoe9LaIx3FLjOjs73SJL8s8fj2a7RaFbQNH2vzWa7YtOmTWNJi2erqlaohaRwcSgU4mKR2NTU5JQ0LT09QFFUFkVR/TQdTxeLxV4AyBaJREMCkhyOx2L71tfXxxyOGjQLd3Asx14sEop2zHC1sc93fH6YZViqbFGZPi1N/Xg4Eqm22+35CchIDscyNFNNUZRKLpOPfPj+B49s3LBh14MPPGgWi6iBwSGvHQDoIquVbG5pbpPJZb+i4/EHi4uLzwcAdn19fezGdetWR6KRNRqN5lqPx7OfoqhfuN3uD2rr6oTJDtJ3JTSOEKKzs7P/BADNXq/3Fb1ePw8AfpWdnX1tEpEZnkgQj8UupFnamJGZ8TFFUQtUKtXLvpGRYpzA6WgsGicIAcvQjJxm6CCBExDw+3NlctkeAOA2btzAzeREh6NGwXFcukBI7k9ASWJuRoORY1jm4IhvZGXD7gYaR+h3kUjkocrllQoA4HjM5/x+vx4AmJ1f7HzVH/BrlSqlLxQKpQwMDFwLAAqxiBpyOGrw9ra2OADgjY2Nfdoc7WMMy96l1WoXAACzvr4+ajFbrgaA+w25hot6e3vfF4vFW994/fV/IISYs8EwOpvys5gtNQzDFHi93ofmz5+XFo/H/6pQKH7U2NjYn+yVDQ55MQCAyanJslgk9o9nn3s2OOIb6d9/YP+RUCh0NU7gB8LhsCk1Vd1DM3SaUChMBYA8hVIZHhgY+FWR1WriuRklz62trXUpx3Ld7W1tsRmLYQAARCLRZpZhL0QIgdPp7EcYenlweOiXCCHu4MEDCcU4KCSFaoejZqXH41k9MjJitp5nfSk7O3tvPBY7vn37tm5eCrgEFOz8YudYVkbmTzEMcxQXF18IAOzOL3YGUlNT10Vj0acsFothYGDgCQCQ6nX6H/PKEZ+rMkQAAGWLyjQjvpEXlSrVWp/PN4kQekMkEr3a2dn5eZLiAwAAT4+HAwAoKSkldu/etb2pqalaJBIdMOeZA4FA4BaVKmX3ZCCQLRIKhwGD3LGxMTojM/N1AJCGwyEPKRAUer3eA0nmHQ4ArEwmu4PjuE/9fr9rFvccTUxM+JQK5TV5eXktXq93fHh4eCAzMzMlPT39ikOHDu0BAGLN1Vezg15voUQiGcMRXjg5NXmed8Crtljy/zExMT7PnGdeZDQY83V6Xaenx5MgOHK73ZHsnJyvmDj9I5VKNTk+Pj40MjIynpaW1heNRn+bl5e3EWFoWygc+lNBQcFOr9c7Oot5ekaOxhBCbP9A/x9FItHT7W1tfXq9/jEcx3tcLtcGABDMzPfxnWPbt2/bVrG0QhWNRs/fu3fv3oGBgbVxhj4Y8PtNarW6fXJq8lIAmErPSH/K5eq+fXh48CNKQqnkMrlghgtOOxw1EgDQZ2Zm7kvm4uT583GIfYFAYDUAcHq9XuR0OjcAABQXFzsAgF5fXx8XkOQnfr+/ICMz4y+OmpoLACDoGxm595+v/3Obzb7gTQFJ0mIRVZIEOazNZhO0t7UFMYRtYVjmVpfbxRZZraTL5foUw7A9Pp/vt8dPHB8jCOJnQ0NDf0EIcafDanQ699pittwAAJjL5XrNaDQuiMfjy2uuv742Oag/S+wXAQCEpkNXT4dCXwAACEhBcVZGZicAUACgng6FpHv37v0lANySmpLaeOTI0c5YJJZGs/Q038epaGCLs2UJwlDP/gP7w6exWRneedlC0/QCl9uFeTyeWMXSCqKtra2eYVl7aUnpIgBgt2/fNrh9+7Y/btq0acv6+no/SZJ/P3b82Pyr16z5a0tzS6FSqTwGABkAAL2eXgwA8KampnhxcfFVBEGs1uq0tUaDEeNxnOjv73+S47hCi8VS2dvbuxUAvAaD4T5+TvjZCI0BAFddXS2bDk0/oFQqH6yuriYYhvmtWCx+eH19PZ0w4WYj9MaNG1iHo0ZA03HL1q1bjlYurzQpFIo4AOA0Q6dGY1Fpe1ubw+V2YQAgm5iY2AIAWCweCzE0szPRR4Ir6Hj8EoZldpwh2MQBAN7c0tyDYVhs9arV8wCAzcrUcCzLYhKKeiLO0LfY7fYcPmpI8KYffuO6dZtisRje19e/JuD33wgAaTyBMF7fMMXFxT9iWNaekppS27C7wZ9IagAAy7IsyOTyn0QikcdtNhuVk53zUCwWu6VyeWV6QrrPhNE4n8p/nOO4rs7OzvcZmnmAYZmg2+3+50xcnm2TUtWpOoZhF6xdu/bIa6/9Y4FMKkMjvpGVAFz30mXLnn79jdfpRx95rKzX40nb+vHWz4QiEWY0Grs3bNjQndQXW1tXJz5+/Pitaeq05/v7+2NnUdqcOlWtoBn6grGxsd2tra04AIDX643k5GQfj8XitYsXL97x6fZP2dbWVhYAsH379tFKpXKIElM6U57pZd+oTwcst8Xtdsc8PR62yGr9OcdxbHtb2+94/ZOsHzgAIHw+36hCociMRqLLna3OLakpqbLRsdHqQCDw8UxHBs30wgy5hox4PH5xUZF1fXFxcUYkGlmpydI8OYfUDk3ghPqvf32RIgiBxB/wz4+EIy3vf/DB472eXuOjjzxmPXHiWFU8Fm80Gozc+vp6bH19vXvm5m/75JPFNE0P7D+wfyrh1p9mPAYAOKVKuZWm6Xm1dXWJebIAgB85crQTAN7v6Oz8RZJYMzxXfxaNRQNOpxNr2N3w951f7JyuWFohLSwsfAYAutrb2v6QxIzcLOPiixcveZZhmSU2m810waJFf+A4zlZaUmrhx0ezcTQBACxFUY8jhBoPH27aLaEkv0UIfe5sdR44x8A38vR4JlNTUu9gWWbc7XKnc8AxJzpO/KzV2bpMIpFo+vv7CsbGxqSabM3rnh5PwgGZGVNmU1QpdxICYu/o6OiJ0yQDvsHVXq83qFQoK3t7PeMjIyOepPkSIyMj3Wq12qBOVdtHx0YbExu3b98+Nisrqy0UCr3V3NL8x927dmdNBYO/FQnJ95wtzo/PIsEAAKi1tZVOUaVMh8Phm/fu3fNhRnoGEZwOXhcIBD5KtkBQsnNgs9nUBEFcaDQZXywtKTUAgGXtddf+I7ls4Bwah3Dsv0+cOLGmdF5pKD8//9Py8vL/CoVCDk9PT+XY2FixVCJ9sWF3AzNDFE9xisNRI2AYxiSVSnfOoQQAIwji01AodOUMaaV59/oVlmOzCwsLL06KYWMdHR0tUqn0qrXXrC2PxWOPCnDimSNHjjacSenP5GpPr+c9ANAUWa2FcoX8FQAomj9/nj6ZiVAyzo2Ojt5OEERDw+6GoD/gvx9D2BtJ6aVzbnKFYooUkCeefe7Zd6Ymp64KBAJX0QzNBqeDTqlU+khzS/PAacQRAQDX1tZaBgC+xsbGyXMM2rA8fHzGcVy+w1EjmkEkBgBwmUz2a47lriosLDTzjHUyoYyhzMnA5JUEQfy8uaW5Y2ZF1dkay7KAIezl8HTogaampjiO8K2jo2M/SvIHThGaqa2rIziOuzQjPeOPNptNjTBUoNVp308yq/BzeGEAQASngq44Q3tWXbXqrvGJsQmr9bwLGxsb73I6nS/yxCP4sWc+LwAALBqNXoohbOccNpgDAILv29PW1rocAPAiq5XkrQxUsbQCa2pqYoVCYT3DMA/abDZFU1NTvCC/4D4MYReuvnpNndPp9NtsNgFvZs6Y2yLcCnocYNE33nc4aqBiaQWxcOEFWwFAN3/+PI06Tf0XDMMuqqpaQfGbjJ3CaUOu4VKj0fguAIA5z/wzc575ge9d5IEQIITm/Iw5z/x22aKylDkmkHEAgCKr9TJznvn5M32xyGrNM+eZH7JYLD8255mv+XeVAxhyDbeaTKZfAADo9fo3dDrd1Ym5EUkLWUsKyLf57HWZIdfw+HRouirg9wcBQCimKNkcC0oQAMSTUk3nEo5l5HJ5EY7jwf0H9o+fI04mwwNWUlzS0Nh46KH58+ddwzJcZMZGcQBAIBybBgADjhAiSbKttKS0OrG2OEODAD8pxCzHAsLQqZ+JFmdOTkmAExBnaCQWicbpOC1QpihH+/v6V7vcLuzyqss3TIemHQDw/qnUVFXVCurE8eN5V1Wvumf1qtV2HOEBm31BV0dnxxoxRT0ul8vfA4AvGYZRIwx9y2FhWAYwDPvGZFjupP7iuJNfxTAMOI4DDMO+9X7ScyyOcCSTy55NEH6uXLVx44ZIkdX6THBqehHLsQwAoMRYSXFXhCHMhSOcC4VCSxGGWJZjT80pkjTfb4Yy8VPrBQAUAWBIATk5Pjb+u6nglFyZoqxhGbbv8qrLL/xk+yefLlu6rJaHqECC5S82mUxv8rCx3mKxrEt0Xl5efr5Wq31Pp9Pd8J+uzOFjDueMPUme33+saTSaJ/R6/fN8SQJYLJbrTSbTswAARqPxTUOu4cpTypBhmaUCQrCH/92SmpK6k+9HsHfv3sM2m+1mHOEXa7Xa94qLizN4DBLxEvFvfyUU0sGDB+6pWFqxJkk5nZbAAIAxNHPr4JD3WgDAzXlm4f/QvIT8+ss0Gs1uCSXx9/X13bdx44ZJAECpKak7OI7LQwgBKSB3sBx7Ia97EABAoUql2m7OM2cDQOTgoYPeJIzFN23aNOXucd8soSRb/H7/+4Zcw2UejyfCm1UMj6P/tldTUxPN12KkEoigauvqEB9/wGY4WTgAIJ9vFAEAJ5XK0sUiKgcAGNuCBfS/eV4cn0qLarXaB1iW/U1qauqDnV2dz7Esm7C44OChgyM4wqfz8/P1GVkZnwNAAQAAKj6vOB3DMMHBQwd7GJapxBF+PKkECpLME+L4ieOv5WTn3Ewz9INarfZJhE7h9b9TXDE+76iLxqI+AIitr69n+aw6x5uiQoejRpxwtdvb2mLl5eVZweBUNBicCjscNTgfnPp3FnAydrtdrtFo3iRwoqjm+utXOJ3Ow/DNMl/EsizgON4WCoUq93y5px8ABAX5BVnEhH+iBEf4GMuyGADMFwjJXbM4E1zCw9p/YH8nQuiynJycp7Ozszenp6ffwSdn52IhnLY5HDVo48YNDEMzdgDwRiEqLC8vXyWVyjqDwSmYng4u3dPwpZpm6LSC/IJQnI5PUhSlUqvVjQMDAyemJqfMe/fuZU4XgP8Om44AgLZYLEuGhobqxWLxP7q7u19eX1+fYEZ6huMEGMKaCIJYybLs3wFgJBwJlyIAKCEIooOfVLZCJm9PfmhmwIjfNdTb2/tTCSX5p8/n+8CcZ16Z+Oz7Fk46N351ciCGHh/xjVz+1VdfbcAJnInHYnnhcHhlcGra/uaGN3/99jtv35+dnV2alZWFRaPR/uPHji9wu90PiynR/PLy8iuKrFbie84lsVGMXq9/KBwOPyGhJHd2d3e/zDMVNguNOACA1NTUNj62zZECspvjuBKEI9yM4/hxl9uF4QgnL6y4qO9cvE4AEBw/cfw9lVJVE4lG7jHkGn7z74CSNvAwAIBMprx94XA4XavVPrjnyz1bd+3etTkciWykKCrj7rt+fPtN6266OS09/U6pVNZevXr1hsmpyaBcLldnZGQNRKPRnwGA9HtUzBJ8PYlCq9W+CQDmmuuvv/z4ieOtSXGf08XH4Z+v/3MAAMjaujoCx/FWjuPMiOXYLIlU0nX1mjUZOI6Hn37qqegZxC5ReY8nFGVzS3PPwMBAFcMyQq1Wu5mvi/7OxYAJ4mzcuCG2cOHCH8fj8SfFItFgZmZmt4SinszSaLYDQG80Gm2LRMLF27dv+wAAsm9ct+5tHOF9g15vNBaN3dfe1jZ+DlG/WcsrAIAuyC9Y9NVX+7YSOPGFx+O5c319fYy3cNCMJPK3PNQ8Ux6DMDS56cMPtTK5rAMhlImnqFLuKCktfcnlchkxhFlHR0e3JhepzJgAW15efhVJkr/KyMxAZYsWt7e2tnIcx0EgEPgsRZXCjI2NPZedne0ZHR3t+o6cjRBCrNlsvqu/v/+HUol0pyo1xUMKyJ6qFSvuz8jMOHb0yJFnhELhVefbbM8vKS8PP/3UUwNSqUw/GQjYiktK7t+5c8fAd6hnRgDAIYQ4o9F4TyQSuUskFP2k29W9LWFeyqSyK9Vq9ZMqpYrr7+9vO836cI7jWLVafREAjFit5x3v6+tdhysUitv27//qL0qlcgGBE+rRsdEdMyZ5agILFixYPD09fbeAEISHR0YKdu364r3y8vJynU53SW9v7xG/39+Wo9U2BKemfqdSqXKmpqa+5L2rc1VMOEKI1ev0L3Icp5s3b97mxeVLtomEomaRWJze2upsD04Fs2UyWbNIJNo2PDxcFo1Gu5xOZ7Srq8ubnpmRMjwyfInP59szR04m+IpVKhaLvUjTtNpqPW/doUMHB2w22025+tz07du3dUkl0sekMhk7MT5uz8nJ6R8eHu6ZZX0IANg0ddpCmqHj+/btbVQpVbdjhlzDHk+v50KL2XILhjDNsWPHfp1kQSRMLdX0dPCmcChynoAUxLKzcwIBv99MUdRX/oBfTQrI4wAwvf/A/g8AAFxuF1a+pPxPOI6rbDbbjzZt2jR1DlYJziue/8ZxnOzp6XnQarU+4Pf7rSRJ9g0NDl4vpqiBQ42HKgEAGQ1Gprq6WmPJz+cOHjwwQSBijc2+wL1169bLAWAyLU39t4bdDYEz5BtnVsjOi0QjTxM48Y67x/0SAIDdbl/FsqwCAPKUCuXo5NSkTS6TD4/4RshIOKKUK+QtCKG3Ghsbh5JgKtHfPdFYlOvv7/+TXqffh1iO5QAApkPTIgyhEI9Dp5SI3W63jE9MPBaJRHdIpJJDUol0x8BA/9GWlubK5pbmG+k4raIoajwSDeeWLSq7AADAaDAir9d7N0Los0OHDm02Go0LzlJ9iQCAKcgvWMRx3Pk9PT0PsiyLO53O5ySU5PVwOJwppqgRAFDnmfI4o8EIDkcNvmnTJu/6+vrBWCS2OBqLGja89dbd7W1tv8ARuik0HVrL1wyeqXYFAwBaq9XeHIlGniJJspYnMla2qKyEZVlzWlq6DwBSm1uar29va1vR1993QiqRfixXyBvpOL01Fo3V2e32eYmELE87kCvkjEgkUvBxHxaxLMuwLAvhcJjzT0wEAQD6evswPs6RGYlEHhOLRE8eO3asbXBwcM3Q0FDF4ODgbeFIRDU6Onq+s9V5V1d3111yhWKMZuildrs9NWGVeDyev0soyQORSKReq9XeliQlaLZsfDQa/YFEIvlz0jFidPzE8Qav13uXOc98XzgUyk04URs3bmB4NxsoihKp1eo3EEJfVVWtuEuhULwPAGoAgKxMDXca6WFdbhem1WqfB4AKo8m4uru7+7DNZhOULSqTxuKxFUqFcryzs+PuI0eO3D06OnpBOBJJGx8fv310dPTikZGRNc5WZ0eWRvOzWDT2UNmiMhMAQHAqiAEAjIyM+IPBIMuyLLAsSyMMw07FjHEcxwAAXC4XBwDY3r17R0Qi0fsAcAMAgFwm37L2umufIEmyPTMz82FDruH2lJSUT0Z9vstGhkdul8vkQpZlHUnpJ6Kzq/NoSUnplQBQodFo/uhyuxLm4TfKuxBCICAFGXp9biMAYLV1dRyfDTc4HDVZF1Zc1CamqGaxSLSpYmmFubauTtbt6o46HDVWm33BsEgkxuRy+eTAQL9u1Deqpel4Px/NmxWPDbmG3PIl5ZsInOgZGBj4YcPuhqDNZhPwbvZ1UpmUGPGN3DA0OHi5WCT6XK/X352bm3s/SZLO1VeveUKpVH7CsiyMjY3WIBzbRIpIDwBgTU1NLACASCjCcRzHEEIgEAgIJBAIcL4IBWRyuTwJOlgAYBsbGzeHQqGB4uLiGpVKFd71xRdCpUo1NjQ09LS7x/3y+Pj4FQWFhedHwpHj/oB/ASkgj87wJtH27dtCAwMD6wQCQU/FRRVbCvILcpMzDwnXlabp+KDXmw0A3NatWwkAgI4TJ0jfyIh9fX19zHqe9UoxRWV+faix408vvNCckpLy7pbNH32x4a237tPpdYAw5EIYYhiGiYmE4vdmyXUiAKB1Ot2V0Vj0JbFY/Iy7x/1sIlbR1NSUmJMzOBW8IDgV7NFosueHI5FLPR7PX1wu1/NKlWp4544dCqlEOlpktV4Ti8ZiR44cfZ/PgbIVSyswHjpkEkrC8mFZDEwm0x4+q3F9QX7B40m7nhwZA7vdfnWR1fo3h6NGyn8P8akn/Bxq+U4Fg8x55ou1Wu3H5jzzoiQYwQEAM+Qalmm12p3V1dVSAACbzSaoWFpBlC0qe6DIal3icrtIl9ulklDUF0nFLJyEoiY1Gs1ftVrtS4Zcw4e1dXXkLM4KAgBMq9XeqdVqN5aWlKbPXOuMUIAgKTuE4OThULzIan28YmmFsrSk9PmyRWU3JdMouT+LxXK/Tqf7EUIIjEbjfkTTdPynDz9MAoAPAOQzB+SDOchkyvtYSAoOnThxLJXl2GhSnXIiroDOUJSdqNIUdnZ17iBw4iAAFCVV9DAAgLl73LsA4G+HDx/+wJxnvqSpqSnesLuBJkXk3wU4sWzVVatuXHvN2srsnJz1CCEGIQQajeal7Jycv+E4fl56evoL7h73at65+FZBJP/3AqlU+lxzS/MIwCLBaSwhtHHjhjjLsijJ1GUAgOFYNuDzjapJIXlUoVRuAQCM5+Zv4pNAkEqJqYmu7i4Bx3I0QhgKNzV+rYnFY30sx6bMYg5hAMAODnlzRELxZDQWVyIMhWZxydkzxEgSLVaxtEJEM7RFrVa/O+P7LADgfX19G1NTU37CsMx1RqPxZYvFsqBhd4O/uaX51wqFYjoWi5XIZLJMsUiEZWdn36XX6bdFIpFMm822oqmpyZkUh+Bmc49JknwjEo5cd/KtA+wZQgwz15XIzkyzNKMmcGI04Pdnz1b+BQAQj8ZUcTo+cPPNN6eyHDuNWI71jfhGTLmG3B6O5aS8uMz0CiE0HVICwDhLMymIwCe/g8eHAwA36B1cjBAaPE0FEsNXF7W7XK7bJBLJawzDPGQymX4FALB4yZLt2dk52wYHBx8UU9THVut5272D3hv7+/tv4G31RDSNO11OUSgSfcWwjKZiaYVyhp441zbGWzQBAEjhM0Hf2CSEEGAIS5HLZZ3jY+MmjuPGEcdxPdFotKBhd0OE5Vj80ksvUyfvEl/dCUKhMJUUkX6WY9PoeHzkuwYxaJq+giCIT87A/Qn4wZ1O5x63213DB9tfWl9fH9i+fdv+WCzWJBaL/97d1XWjXC5/Jum+jbO53Dhf0N7q7feumEPi+JREIAL3MQyTghP4BAAok6pPT0n/tddeJ+JYTtLc3OKLRqNWAPAgDMOaOZYr5L80Puj15s8W9WJoRkkgIsAwjAphaOQcPK5vZbjLy8tVNE1nKZXKvacJMyaLLsNbI3h3d/dvJJSkzZBreBYAoLSk9G852Tk+lmPT29ra9s+hLpAFABAIBJtomr4kSaGeM6GFpMBHCAiVkBQGZtNpAADd3V1GlmMjLMtiDMMUAkAroijqKMMyGjh520t7NBqdf5qSXpmAJKeEIpFEIpX45khoxFd3VmEY1pJ0uupcCMPwIdk/YAgLmUymu3d+sfOr4ZHhVTiOb09ybuAc+0Pd3d2tLMeSfNkbOxf4kEik4xhCFM3S0ziBUzNsdXTSyw6VsgzbDQAcy7C5AoHgKPr4k497AAA5HDUqQiDYxTBMSTIRkzoh+Uy8kBSQE3MkNMdj/3KJVLr5HJTmbAkHoqen5+cIQ6bCwsK/YRgW7+rq+mSOdYGniIHj+J5QKFR9FrP0Wxydk6MNcCyLEYiIMzRDzKADxitCO4awvbV1dSIAENrtCzuQ0WDkOJZzHz1yZNnWrVuaASDD4aiRJikKlicSFo/FWADAL6y4aHqOMV7WZrMZOZYj29va2r9DCJMDAIZlWdTZ1fkQRVFPut3uR3nza665wZOHjMTij2iaXuRyu+ayUdjGjRtiAIDRLI3xAbTkOTD838aFCy/4csvmzeUA0L9x44Y44oMee+J0vJI/TjbQ4mxZAgBY4tzftddeJwAAZnJqkmBpJs7fxHWuSgQHAPBP+K8CgD2ngaVzzd2xVVUr0liWmZ8kFXNNMHC8UhwCgInVq1aXnSWQ/y1pIAiCjkViQpzA448+8hiVbKdfd+11pSzHhjZu3DBNx+mVALDv1IPp6ekNNE2bXW4XhmHYR9FIpApOnvvDAAD8fr8MJ/AoTceFAlIQm2OKiHG5XYjl2IViCbU1mavmmrsrLCy8pqPjxEuBwORlep3+7dKSUuv3yFViBEF8HAqF1pzr5jscNYlfQzRDSwAg6Pf7E14sDgAwNTm1UkAIGgAAYvFYEUEQOxKd442NjWMcx3lXrrxy6dXXXLMTAEx2u11+qh4tFlPgBB6iaUYGAMEZg56VSKuuWrWQZVg/z0X4HLA9kbuTGo3GPwaDwZU0Td/tcrnuphn6hQn/xHpznvm+75CrZAAA1Gr1DoZl9NXV1bK5ZPAJAp+k6bgMAILxWEwOANDU1MS43C4Up+O2XIPhnSKrdR7C0HS3q3sAAHD0r4eJjyLh8I3r6+tphCGnf8K/JokgSgAIMCwrB4CJ00TFTitqkXBkFYaw7XPguoTrS5vzzBX79u19h6bpI319fT/s7e0dBABBX1/f3sWLl6yORCNavU7/Fn8giEnyDM8KafsP7A9zLHe8o7Pz8lmKc2ar6zuJVww3xjKcDAAmo7GoMgFJV1x+xTIAGN++fdtENBK5BQC28FYRlgBybOHCC7ZzLJdbtqgshRAQLzEscxV/egoAQMXQjF8sEqUQBO6fg8VBOxw1FIawPJVKteMcYQPnFTCr0+l+HolG7hUJRff39va+Av+qwY7z8YhYX1/fwxjCXh8YGHjZZDJdm+QZng0KWN4R+4COx1ec43pOOi04Ng4AKpzAJ3ECPxW2iEajNwpFolccjhoRTdOlulzdB6fCwAmR27hxQxgAvhjxjdxx7NgxD47wscurLr8CALBoLJqCE7ifjtMKhPCJOShBrK2t9dJ4LH6iqakpdBaOweBft9uYsrOz3+c4DgYGBq7p7OrshG9f/JfQ9ITL5dqm1+mvj8fjK7Ra7fMVSytE56AoWQBAHZ0dh2maFpWXl+eeg0vOnfRumXEAkADAFEMzKgDATCZTCcMwsva2tn1NX3/9Q47jvuaPzBEAwH2j7CszM/NllmGrqqpWCKUyyXPRaPQ2vnMxgYgJUkhKEEJzsaG5aDRaBQAfncV2Tmw4rdPpbvBPTPyRJMkX+vr6fs1XUKEzYCjNw8B4b2/vzQKBoM3tcm8y5BougH+dzz4d8U6WcCH8y/GJiavP1aYmTsZ6FGIR5YeTB1W5WCx2P8LQiy63C8XiseukMtmfk71flEQ0tP/A/mGGZb46cfz4HUeOHG3HEDag1+svF5JCzB/wS4PBoJKm41Pn6nJXVa3I4lhOtnPXzq/P4HITfMBcpNVqX+A4bll2dvZ13d3du5OCTuw5KDcMAHCXy/WiQqF4mGbox/R6/QNJUoCfTiniOP5hJBxeeA42NQcAEA5FpgAgJXDS4iBNJpNVIBCkuHvcn69ceeUPAKCjva2tO9lfQDNFKS0t7RmWY6+tWFqhJAXkrwHgRwDQyrLMvSKRkL7k0svGz6F8AAcA6O3rvRIADvH33eFnKFZZ0OPu+Ygkyba+vr7bkg4JzaWWLxHzJpxOp7Pm+utXIwxptFrtm0VW6+mKejgAwI+fOD6IYZh/7TVrz8WmRp9s/yTIcuxYKBR6QCqVfcYy7KMyqew3FUsriODU1M0pKaqnzla8gwMAmEymhwy5hqcBAAryC27ny73mch4FIYTAYrG8UWS1Gk6T7QAAAJ1Od69Wq/24yGotTcZ2+H7tlF1tMplWG3INO41G44qZnyWPZ84zX1mQX/DMmbIuMxaYuB70JnOe+WkAAEOuodaQa6ifDYLQLKKEX33NNb9nOdZWXFxsO37i+N8AIDc3N7cyKRx5tkWy8+fPL2YYJtLe1uaeYTsTAMDa7Xa5Tqf7O45wc83111e3t7U1w7/vptuEXU10d3d/mJmZeVM8Hr9Fp9P9ehabmwEAMOXlfcYwTK7DUaNIytbDGbAd5ebm6gDgRrlC/rg5z6xjWKbaaDT+9lxDDIjn5EWGXMPnDkcNPn/+PI1er99ms9nUcPZrbRI5s8fNeeaaJIhIzhsu0uv1nxtyDTecYdMTVf5oBvfhp3HPsTNJKZ+7e9yQa/iwuLg4ZwbnEjxHPlGQX+A4B6VI8Ny8kb/DFDfnmd8w5BrWziFI9a8vmvPM9SaT6Qn+90sNuYa3ePg4k1OAORw1pDnP/G7ZojLVzIHNeea7dTrdJ0VWa1HSIme7VPAbiVKHo0Yw2xxPxyin2QwoLCxcodfrd5hMplVJ308cnSs1mUyvnqV/AQCAXq9/zJBr+GliE2vr6tRzDE38ayEIIXA4akpq6+oUCCEw5BpuM+Qa/vsMOJa4wrjSnGd+jieskE/3CPV6/Ys6ne7PDkfNma4NRonJ22y21Xa7/VmbzfZiaUnpH4uLi58qLCysTOgKl9uFFeQX5M6fP89qs9lMM7LWp5U2u92eacg1vGsymX6XeMZmswn4aoANfJx6NqIR/JquNhqNf+ZpcodarX7daDT+MHGF82zExs6Es8XFxZWu7u7fAYBNTFFbx8fHV+l1+kcxhMVdLtdT8O16upOXqlgsvxcKhR87nc4v4OSlrEX+icBzGMI+dLlcf00eY7ZxS0tKswkB8bhUJqVUStXRqcmpCZlcNhqJRIvGxkZzY9FYjBSSPpqO54iEYiUpIiEWiQ0FpiZldDz+RkdHxxdnyLqcuo1Xr9M/AQDnKVWKe48cOeoFALwgv+A2AJAfP3F85voIAKALCwsvmJ6efmB3w+7rF9oX/jocCv0MAHoBQC+mqC2HGg9dbTQYmZlrw0/nPNhstvM7Ozr2AYBEnZb268lAYI1cLp/n9XoflEqlVyqVysJAIHAA/nV1JAYAbNmiMkU4HP5Baem851pbW+PmPLNjKhh8jBSQj3d3d29Kso1nvbq4bFFZoUAg+KXRZOqVSWWbaJo+rlAoJ4LB6ZBSqXRTlHg8K0vTlpKSQqnVaV0lpSVOlmGPKJXK/RkZGeOhUOgGuUzOjI6Ntp8mgMUBAMZxHPL7/bvS1GnTU8HgM9k5OcM+n6/TbDYPTU9P33bppZe9z9/tcYrIer2+MB6PP0rT9D0ff7yVGh4a2pyRmXn96OjobRkZGaqRkZGbPt76cdf4+PhRmHGl5qx4hhDiPB7Pr8KRyPiiRWWlHo/ntwql8lA4FLoSIQR9fX2P0DStNOeZaxNhysQB9omJiVUIQ1+/887bEb1e/3Q0Fl2lUqqu6ezqPJDEIbMRGWw2W0ZwOnjbhRUXfaDT63YAwDQAoEgkHIvHYqi7u4sCgEEAGNHpdfsA4Eivp7cjEgn3+f1+EgA8y5Yvf1mlUl2t0WjmnaXOJFGy9rFUJrspODV1pznP/MuDhw4OAMDw0SNHygGAK7JaSTh5J16RWCT+lVgkvnVoaMiXn18YAwCIRCIVAADjY2M/EYtEwQn/xMLTKr2ZHI1hGCcWi+8Bjpva9un2p4Uikbijo8OVlZnVYC2yigicWLJr967X3nj9jdKMjIwrx8fHd3q9XrZiaQURCoXWyWSyzwiC+A3CkNfj8dw3PDwcOYcEKiaVSBElocoJnMgIBAJBv98fCofCwlg0FgEABBhASkrqFACIAoEAAwBsJBJmIpGoQCQScgQhQAqlAtPn6nuGh4eu1Wq1B7xeb/gMEMkCAO7z+fyBQGCjTCa7Qi6Xr1ar1Z/H4/HFo6OjX/p8Ptputy+a9AfuX2C3/9g76K0iSfIPkUj4SCgcHvb5fA+lpKTkSSSSC6KRyHKdTlc3MjLSM9NhwU4XPSuyWss8bvdnAECIKerI+Ph4mVarfWTU5/stAICYosYMBsNC/4S/DACWKVXKumXLl0+/9+67TRzLeQDgL+4e95akMoCz2cYYz0EpYpHoHalM2qJSqtqnJqcGQqGQEgDCNENzqanqhHkpB4DRYHAqgBM4iEWUKB6LSaKxqDInR7vMNzJCd3V33ePxeGLnYNMm+mR5E+0eDGHKnp6eUovZspJhmNWaHE1dZ0fnjQG//1EACIspauhQ46GqhfaFD4ZDoZ8AQEydlvZwX1/fq7Ol2LCzLLpwZHj4OrFYfEStTo02N7dsS0lJ2bxggf3+PV82PCemqHnj4+OGnJyc84WksIamafFUcCpHq825m1cucz0Sh8PJezRsCKGnU1PVfgA4AQDT4UjITyACQqFQFk7gFEMzNM3Qo3KZnE1LT2d9IyPT/oA/W6lQmmiWpiYDgfuOHDnqmWN+MqHw9D6f72W5XD5EEISzq6trvdVqvcLV3b01MyvrvnA4rAn4/T8DAF9JSek1F1ZcdPDOO+9gjAYjfTrX+0yGNfL5fL5QKLR7cnLyBE3TjwPH6aampuZ3dnb6FQrFZeFQqPz4ieO/bfiyQXHxJZdscjpbqtRq9dHLqlbs2Ldv33fx7jgAQIODg97s7OwDAb/fHJyaKsQwyCIJsnByajKLZuj0qWAQZxlGzTCMGQAU8VgsLxQKFUSjUXUkGnaPjPgeOXbsmBfmdljo1IZotTkSUkDmRWPRoyUlJa8Fg8HfrV6z5s3GQ4dyfaOjDzM0rb7woopLT5w4cXc4HE7//PPP3/zDH/6AnWlTsXMYnHQ4auIHDxy4f2Rk+JmU1FQ7wzCLh4aG/pCSkrLenGd+vaWl2SmmqI3j4+M1Wq12FSkgrxCJRe86nc7Pk+Houyy6yGo1CUmBRa5QpIamQ2PToVDHypUr+w8ePCD2j/sXxRm6SIATApZj/QzLHm5va2s8g/l4JgeH5a9/WAcA54sp0XPNzS2elJSUQ+Pj4/aUlJS/hkOhuwDACSev1dgQDoV+UlBYeElTU1MiOvm9/m8LBgDI5XYhjUbzDwlFcfzrXZfbJZZQVCf/9wDvIVEOR01qYWHhIxaL5emC/ILzZkgQmgOxse84X+wcYerUXIqs1uUF+QUvFBYW3uFw1KQYjcabXW4XplarX1Cr1REJRXFqtfra2ro6mYSighKKYm02W9m5JnbntBCEEFyw8IJ5ACA4eOhgo1gkehEAblAolSMEQWyQymQ7PW73+wCw78qrVt3gGxlRj46O3sJybIxh2Xfa29qOzVS658DlKFH/x+ftuCS7Pfnq4uTPzrZ5pzjPYrEsIQSCaiEp6Lvk0ss2PP3UU76UlJQj4+Pj88Qi0Y4iq/Vtt9tdS5Jk29DQULVepy9UqhQkQQgijY2NHXCO5Whz5Zhkkb7K43Z/ZDSZ7nR1dz+oUCqnYrFYXjgUUgCA/8f33mt79+13rpTKpO8rFArj9HTwqnAoEsMQtv3YsWNfzoiNIJ5Ic6mFmwt3f4O4pSWlklg8djGG0IUCnBgtLCraePhwU874+PgfzXnmBzy9noKA3/9nhVLpDvj9WQAQLygsvMbj8bxAUdTm3t7eh+cIT3MXzYqlFUTD7gbOZrMVTAenLwQAT0dnxydikahZbzDs87jdd1vyLUtZhlM6W52bxCJRfzgS0QIAXHvtdfmdnR2XxWIxPcJQBwDs4m/l+hZUORw1oNPruPX19TMP/59uDViC8/lsNTMzEtjd3TU/EolchDCUQgpJZ3Z29g5Lfn7sTy+88AYAXJSenvH7/IKCNz/77NMusUh0TExRg+pU9Qd9fb0viCnqV7fceuuzABBZX18fP0tq7vsTemYzGo2VkUikZuHChb///LPPdoopan84FKoWU5QbADThUKgdAOYDwAYxRZEGg+GRt995u/f2W29f7A/4L6LjNEkIiAGEkJPAiRP7D+wf/newssvtwm5ad5M+HA5bWJYpAAANQQhGsrOzdwHAZEtLi16lUvnefe/djmLreeNiimqSSCS7p6enf3So8ZB27TVrc48fO9aRkpr6E71e3zQ+MTHd3tZ25PuI1vdSkkkBmh9NBaeevuXWW7Pf3rjx6lGf75WMzMw9k5OTEZIkOwJ+/73hSATy8vKuCAaDRQCgGhoaeuynDz+sbGluKRwbGy0BgBSajksRwicBYFgsFvcDwAhDMwFSRE6rlKpoX19fxGy2QGdnB2i1WtHw0LCYoihZKBRKhZMXuWpi8VgaABCkgAzgBO4FAM/iJUucAEC9+sorT4dDoSoxRSnDoZAoIzPzhwRBTHd1db0rFolOzD///Nui0ahSLpMf7ezqvBXDsJjH4/ldsn/xnyb0TKuEffSRxzJ/+7vf+Iqt5wUUSuX7ADAW8Pt/IqaoEwDAhEMhEgDMfLXT4R/fe++yV1955TmxWMw0fNlQe/utt9vS0tN7+vv7NFKpTB7w+/MAgMQJnAyHw4RYLJaMT0wgjmVBJBJiIqGYoBl6gpJQQYZmIgzNxEkROZ6VqemNRMKorbUtj2GZEZfLtZeHD82WzR8NiClqw6HGQ3cUW8/7AAAqnG2tOcXW8w7xUjgAADdkZWXd3NbW9o//xD+V/E6ttq5OUFpSuq62rs6iVqubEEK91dXVl0goKqLRaH4wf/68EglFceY885UutwuTUFRcrVa/VlhYeIOEojiTyfQDPs77UlXVirTK5ZULzHnmtYWFhdVli8oqauvqBA5HDe5yu5DDUZNVXl5epdfrbzHnma9zuV0EQgjUanWjhKJ8arW602Kx1PLZbRIhBBKK+kBCUSMIITCZTIslFMVVLq8sNueZf8ibcJ/Y7fb5SQkOHP4Xtm9ISJHVelV1dbVJo9G8KqEozuV24RKKelFCUVMIISjILziPX+hFarV6PUKIk1DUnqqqFeUSiuKqq6tL1Gr1YQlF0Wq1ukWtVu/lb9NFvH5IEKdFQlFhCUX11tbVZUgoalStVn9RXl6+tiC/4CY+JUbwhS6rJBTF2e32arVa/aqEouIOR02Ww1EjLi8vL0lKHmDwf6B9wxkoyC+oMBqN1/Pc9icJRXGlJaXVEor6UEJRDO/4HNFqtU4JRQ0V5Bdsk1DUhMvtUkoo6oRarT5ss9luqlxeeWFyOkmj0VRJKIp2OGpyq6pWmCUUxRUXF9+sVqtfRQixEorq0Wq1f+GJh3j4kEkoaorfoOPmPPOlifrv7+BU/e8kOABg1dXVSrVa/ZqEoiISigrr9fq7a+vqJBKK4mw22w1qtfoD3tM84nK7JBKKGpJQVJ+EolrMeeZf8v0I+ZTSQglFcUVW6xIeFhhDruEXOp3upxKKYhyOmotKS0pvKMgvuD45tlOQX3CDxWJZPgv3/p8j8GyODp7sYTocNXKHoyaFz+Gdp1arOyqXVxqKrNarEEKcWq3+0OV2UTznvVG5vHJ5eXn5Iv7SwcTNC/kIIU6v1/9VrVa/LKEobv78efbi4uKV/Gb5JRQ1oNFofs0Tdbaakf/zxD0TjuMzk8Aut4usratDtXV1YqPR+MuC/IK1tXV1aWq1ukNCUX61Ws2p1eq+pAQoVFWtyFGr1UMSivJJKKrFkGu4CSEEZYvKMouLi1ck/q/taSQN/0/i8P8H7hOfVLp8xksAAAAASUVORK5CYII=";
const LOGO_TOUROUA = "data:image/png;base64,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";
const ARRONDISSEMENTS = [
  { id: "bibemi", label: "Bibémi", commune: "Commune de Bibémi", code: "BIB" },
  { id: "lagdo", label: "Lagdo", commune: "Commune de Lagdo", code: "LAG" },
  { id: "tcheboua", label: "Tchéboua", commune: "Commune de Ngong", code: "TCH" },
  { id: "bascheo", label: "Bascheo", commune: "Commune de Bascheo", code: "BAS" },
  { id: "garoua1", label: "Garoua 1er", commune: "Commune de Garoua 1er", code: "GA1" },
  { id: "garoua2", label: "Garoua 2e", commune: "Commune de Garoua 2e", code: "GA2" },
  { id: "garoua3", label: "Garoua 3e", commune: "Commune de Garoua 3e", code: "GA3" },
  { id: "demsa", label: "Demsa", commune: "Commune de Gachiga", code: "DEM" },
  { id: "touroua", label: "Touroua", commune: "Commune de Touroua", code: "TOU" },
  { id: "mayohourna", label: "Mayo Hourna", commune: "Commune de Barndaké", code: "MAY" },
  { id: "pitoa", label: "Pitoa", commune: "Commune de Pitoa", code: "PIT" },
  { id: "dembo", label: "Dembo", commune: "Commune de Dembo", code: "DBO" },
];

const BG_TERRAIN = "data:image/jpeg;base64,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";

const STORAGE_KEYS = {
  artisans: "artisans",
  controles: "declarations",
  cartes: "cartes",
  parametres: "parametres",
  exploitants: "exploitants",
  etablissements: "etablissements_industriels",
  plannings: "plannings_inspection",
  rapports: "rapports_inspection",
};

const SUPABASE_URL = "https://gieaceydtgbxczotcmvq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdpZWFjZXlkdGdieGN6b3RjbXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMTU5ODgsImV4cCI6MjEwMDg5MTk4OH0.h7TXf52NktASTce70n9B8t3w7HllHnTe-z_hzdad_cg";

/* Interrupteur de méthode de vérification à l'inscription :
   - false = lien de confirmation natif de Supabase (par défaut, sans domaine requis)
   - true  = code à 4 chiffres envoyé via Resend (à réactiver une fois un domaine vérifié) */
const USE_CUSTOM_OTP = false;

/* Correspondance camelCase (app) <-> snake_case (base de données) */
const FIELD_MAPS = {
  artisans: {
    dateNaissance: "date_naissance",
    lieuNaissance: "lieu_naissance",
    gpsSite: "gps_site",
    substanceCategorie: "substance_categorie",
    zoneProspection: "zone_prospection",
    arrondissementId: "arrondissement_id",
    numeroCarte: "numero_carte",
    dateDelivrance: "date_delivrance",
    dateExpiration: "date_expiration",
    creePar: "cree_par",
    creeLe: "cree_le",
    modifiePar: "modifie_par",
    modifieLe: "modifie_le",
  },
  etablissements_industriels: {
    nomRaisonSociale: "nom_raison_sociale",
    statutJuridique: "statut_juridique",
    statutJuridiqueAutre: "statut_juridique_autre",
    dateCreation: "date_creation",
    nomExploitant: "nom_exploitant",
    filiation: "filiation",
    telephoneExploitant: "telephone_exploitant",
    responsableNom: "responsable_nom",
    responsableTelephone: "responsable_telephone",
    niu: "niu",
    rccm: "rccm",
    secteurActivite: "secteur_activite",
    natureActivite: "nature_activite",
    siegeSocial: "siege_social",
    siegeAdresseType: "siege_adresse_type",
    siegeTelephone: "siege_telephone",
    siegeEmail: "siege_email",
    siegeBoitePostale: "siege_boite_postale",
    arrondissementId: "arrondissement_id",
    quartier: "quartier",
    adresseCompleteType: "adresse_complete_type",
    adresseTelephone: "adresse_telephone",
    adresseEmail: "adresse_email",
    adresseBoitePostale: "adresse_boite_postale",
    nombreEmployes: "nombre_employes",
    volumeActivite: "volume_activite",
    typeEquipement: "type_equipement",
    gpsSite: "gps_site",
    superficieType: "superficie_type",
    superficieBatie: "superficie_batie",
    superficieNonBatie: "superficie_non_batie",
    classe: "classe",
    referenceNomenclature: "reference_nomenclature",
    statut: "statut",
    creePar: "cree_par",
    creeLe: "cree_le",
    modifiePar: "modifie_par",
    modifieLe: "modifie_le",
  },
  plannings_inspection: {
    annee: "annee",
    semestre: "semestre",
    dateDebut: "date_debut",
    data: "data",
    creePar: "cree_par",
    creeLe: "cree_le",
    modifiePar: "modifie_par",
    modifieLe: "modifie_le",
  },
  rapports_inspection: {
    etablissementId: "etablissement_id",
    operateur: "operateur",
    dateInspection: "date_inspection",
    numeroLettre: "numero_lettre",
    dossierNumero: "dossier_numero",
    data: "data",
    creePar: "cree_par",
    creeLe: "cree_le",
    modifiePar: "modifie_par",
    modifieLe: "modifie_le",
  },
  declarations: {
    artisanId: "artisan_id",
    exploitantId: "exploitant_id",
    sousType: "sous_type",
    moisNom: "mois_nom",
    anneeDecl: "annee_decl",
    adresseTel: "adresse_tel",
    numeroContribuable: "numero_contribuable",
    referenceTitre: "reference_titre",
    titreMinier: "titre_minier",
    substanceCategorie: "substance_categorie",
    taxeUnitaire: "taxe_unitaire",
    taxeTotale: "taxe_totale",
    tauxRepartition: "taux_repartition",
    tauxForfaitaire: "taux_forfaitaire",
    tauxUnite: "taux_unite",
    numeroAutorisation: "numero_autorisation",
    numeroAutorisationConditionnement: "numero_autorisation_conditionnement",
    dateControle: "date_controle",
    controleTechnique: "controle_technique",
    surveillanceAdmin: "surveillance_admin",
    resultatGlobal: "resultat_global",
    identification: "identification",
    equipe: "equipe",
    checklist: "checklist",
    qualiteParams: "qualite_params",
    synthese: "synthese",
    infractions: "infractions",
    compteAffectation: "compte_affectation",
    montantRepartition: "montant_repartition",
    responsableNom: "responsable_nom",
    responsableTelephone: "responsable_telephone",
    niu: "niu",
    modifiePar: "modifie_par",
    modifieLe: "modifie_le",
  },
  cartes: {
    artisanId: "artisan_id",
    creePar: "cree_par",
    creeLe: "cree_le",
  },
  agents: {
    dateNaissance: "date_naissance",
    authUserId: "auth_user_id",
    mustChangePassword: "must_change_password",
  },
  parametres: {
    seuilRenouvellement: "seuil_renouvellement",
  },
  documents: {
    nomFichier: "nom_fichier",
    creePar: "cree_par",
    creeLe: "cree_le",
  },
  exploitants: {
    nomStructure: "nom_structure",
    responsableNom: "responsable_nom",
    responsableTelephone: "responsable_telephone",
    typeRessource: "type_ressource",
    gpsSite: "gps_site",
    arrondissementId: "arrondissement_id",
    numeroAutorisation: "numero_autorisation",
    numeroAutorisationConditionnement: "numero_autorisation_conditionnement",
    dateDelivrancePermis: "date_delivrance_permis",
    dateExpirationPermis: "date_expiration_permis",
    dateDelivranceConditionnement: "date_delivrance_conditionnement",
    dateExpirationConditionnement: "date_expiration_conditionnement",
    dateDelivranceAutorisation: "date_delivrance_autorisation",
    dateExpirationAutorisation: "date_expiration_autorisation",
    nomExploitant: "nom_exploitant",
    telephoneExploitant: "telephone_exploitant",
    niu: "niu",
    rccm: "rccm",
    siegeSocial: "siege_social",
    statutJuridique: "statut_juridique",
    statutJuridiqueAutre: "statut_juridique_autre",
    capitalSocial: "capital_social",
    nombreEmployes: "nombre_employes",
    nombreEquipements: "nombre_equipements",
    equipements: "equipements",
    photo: "photo",
    adresseCompleteType: "adresse_complete_type",
    adresseTelephone: "adresse_telephone",
    adresseEmail: "adresse_email",
    adresseBoitePostale: "adresse_boite_postale",
    creePar: "cree_par",
    creeLe: "cree_le",
    modifiePar: "modifie_par",
    modifieLe: "modifie_le",
  },
};

function toDb(table, obj) {
  const map = FIELD_MAPS[table] || {};
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    // La table "declarations" (fiches artisan / eaux / carrières) ne possède pas de colonne
    // "type" dédiée : le discriminant y est reconstruit à la lecture (voir fromDb) à partir des
    // champs réellement stockés. En revanche, la table "exploitants" EXIGE bien une colonne
    // "type" (eaux / carrières) : ne jamais l'omettre pour cette table sous peine d'échec total
    // de l'enregistrement (contrainte NOT NULL).
    if (k === "type" && table === "declarations") continue;
    out[map[k] || k] = v;
  }
  return out;
}
function fromDb(table, row) {
  const map = FIELD_MAPS[table] || {};
  const reverse = {};
  for (const [k, v] of Object.entries(map)) reverse[v] = k;
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[reverse[k] || k] = v;
  }
  if (table === "declarations") {
    // Reconstruction fiable du discriminant "type" à partir des champs réellement persistés,
    // puisque la colonne "type" elle-même n'est pas stockée pour cette table.
    if (out.checklist || out.identification || out.equipe || out.controleTechnique || out.surveillanceAdmin) {
      out.type = "controle_technique";
    } else if (out.exploitantId) {
      out.type = "declaration_exploitant";
    } else {
      out.type = "declaration";
    }
  }
  return out;
}

/* Appel générique vers l'API REST Supabase (PostgREST) */
async function supaFetch(path, options = {}, accessToken) {
  const headers = {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${accessToken || SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  const res = await fetch(`${SUPABASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase (${res.status}) : ${text}`);
  }
  if (res.status === 204) return null;
  const ct = res.headers.get("content-type") || "";
  return ct.includes("application/json") ? res.json() : null;
}

/* Appels vers l'API d'authentification Supabase (GoTrue) */
async function supaAuth(path, body) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Erreur d'authentification");
  return data; // { access_token, refresh_token, user, ... }
}

const signUpAuth = (email, password) => supaAuth("/signup", { email, password });
const signInAuth = (email, password) => supaAuth("/token?grant_type=password", { email, password });

/* Charger toutes les lignes d'une table (nécessite un token d'inspecteur connecté) */
async function loadKey(table, fallback, accessToken) {
  if (!accessToken) return fallback;
  try {
    let rows;
    try {
      rows = await supaFetch(`/rest/v1/${table}?select=*&order=created_at.asc`, {}, accessToken);
    } catch (orderErr) {
      // Si la table ne possède pas (encore) de colonne "created_at" selon la migration exécutée,
      // le tri fait échouer toute la requête et les données semblent "disparaître" à la reconnexion.
      // On retente alors sans tri plutôt que de perdre l'affichage des données déjà enregistrées.
      console.warn(`loadKey: tri par created_at indisponible pour "${table}", nouvelle tentative sans tri.`, orderErr);
      rows = await supaFetch(`/rest/v1/${table}?select=*`, {}, accessToken);
    }
    return (rows || []).map((r) => fromDb(table, r));
  } catch (e) {
    console.error("loadKey error", table, e);
    return fallback;
  }
}

/* Enregistrer le contenu d'une table de façon sûre : on écrit d'abord les lignes (upsert),
   et on ne supprime qu'ensuite les lignes désormais absentes localement. Ainsi, si l'écriture
   échoue (ex. colonne manquante côté base), les données déjà enregistrées ne sont jamais perdues —
   contrairement à un "tout supprimer puis tout réinsérer", qui effaçait tout au moindre échec. */
async function saveKey(table, value, accessToken) {
  if (!accessToken) return;
  try {
    if (value.length > 0) {
      const rows = value.map((item) => toDb(table, item));
      // PostgREST (erreur PGRST102 « All object keys must match ») exige que toutes les lignes
      // d'un même envoi groupé aient EXACTEMENT les mêmes colonnes. Or nos enregistrements ne se
      // ressemblent pas tous (un exploitant eaux n'a pas les mêmes champs qu'un exploitant
      // carrières, une déclaration n'a pas les mêmes champs qu'une fiche de contrôle...). On
      // complète donc chaque ligne avec toutes les clés rencontrées dans le lot, à null si absente.
      const allKeys = new Set();
      rows.forEach((r) => Object.keys(r).forEach((k) => allKeys.add(k)));
      const normalizedRows = rows.map((r) => {
        const full = {};
        allKeys.forEach((k) => {
          // Certains champs sont volontairement laissés à `undefined` dans le code (ex. un champ
          // propre aux eaux, absent pour une carrière). Or JSON.stringify SUPPRIME silencieusement
          // toute clé de valeur `undefined`, ce qui recrée le désalignement de colonnes même après
          // cette normalisation si on ne le convertit pas explicitement en `null`.
          const val = Object.prototype.hasOwnProperty.call(r, k) ? r[k] : null;
          full[k] = val === undefined ? null : val;
        });
        return full;
      });
      await supaFetch(
        `/rest/v1/${table}?on_conflict=id`,
        {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify(normalizedRows),
        },
        accessToken
      );
    }
    const ids = value.map((item) => item.id).filter(Boolean);
    if (ids.length > 0) {
      await supaFetch(`/rest/v1/${table}?id=not.in.(${ids.join(",")})`, { method: "DELETE" }, accessToken);
    } else {
      await supaFetch(`/rest/v1/${table}?id=not.is.null`, { method: "DELETE" }, accessToken);
    }
  } catch (e) {
    console.error("saveKey error", table, e);
    try {
      window.dispatchEvent(new CustomEvent("supabase-save-error", { detail: { table, message: e?.message || String(e) } }));
    } catch {}
  }
}

/* Génère un identifiant au format UUID v4, requis par les colonnes "uuid" de Supabase */
const uid = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/* Liseré institutionnel — couleurs nationales, discret, en tête de chaque écran */
function NationalStripe() {
  return (
    <div style={{ display: "flex", height: 11, position: "relative" }}>
      <div style={{ flex: 1, background: "#007A5E" }} />
      <div style={{ flex: 1, background: "#CE1126", position: "relative" }}>
        <Star
          size={9}
          color="#FCD116"
          fill="#FCD116"
          strokeWidth={0}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>
      <div style={{ flex: 1, background: "#FCD116" }} />
    </div>
  );
}

/* Sceau — motif signature du site, rappelle un cachet officiel */
function Seal({ size = 64 }) {
  const s = size;
  return (
    <div
      style={{
        width: s,
        height: s,
        borderRadius: "50%",
        border: "1.5px solid #C9962C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 5,
          borderRadius: "50%",
          border: "1px solid rgba(201,150,44,0.45)",
        }}
      />
      <Pickaxe size={s * 0.34} color="#C9962C" strokeWidth={1.6} />
    </div>
  );
}

/* Logo de commune — image réelle pour Bibémi, insigne générique sinon */
const COMMUNE_LOGOS = {
  bibemi: LOGO_BIBEMI,
  bascheo: LOGO_BASCHEO,
  garoua2: LOGO_GAROUA2,
  garoua1: LOGO_GAROUA1,
  demsa: LOGO_DEMSA,
  pitoa: LOGO_PITOA,
  garoua3: LOGO_GAROUA3,
  tcheboua: LOGO_TCHEBOUA,
  mayohourna: LOGO_MAYOHOURNA,
  lagdo: LOGO_LAGDO,
  dembo: LOGO_DEMBO,
  touroua: LOGO_TOUROUA,
};

function CommuneLogo({ id, size = 54 }) {
  if (COMMUNE_LOGOS[id]) {
    const info = ARRONDISSEMENTS.find((a) => a.id === id);
    return <img src={COMMUNE_LOGOS[id]} alt={`Logo de la ${info?.commune || "commune"}`} style={{ width: size, height: size, objectFit: "contain", flexShrink: 0 }} />;
  }
  const info = ARRONDISSEMENTS.find((a) => a.id === id) || ARRONDISSEMENTS[0];
  const initials = info.commune.replace("Commune de ", "").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: "1.5px solid #C9962C",
        background: "var(--bg-page)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Fraunces', serif",
        fontWeight: 600,
        fontSize: size * 0.36,
        color: "var(--text)",
        flexShrink: 0,
      }}
    >
      {initials}
    </div>
  );
}


function MenuButton({ onClick, dark }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Ouvrir le menu"
      style={{
        width: 38,
        height: 38,
        borderRadius: 6,
        border: dark ? "1px solid rgba(241,235,221,0.25)" : "1px solid var(--border)",
        background: dark ? "rgba(241,235,221,0.06)" : "#fff",
        color: dark ? "var(--bg-page)" : "var(--text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <Menu size={19} />
    </button>
  );
}

/* Tiroir latéral — menu principal du site */
/* Section dépliable réutilisable du menu */
function MenuSection({ icon, label, badge, open, onToggle, children }) {
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <button
        type="button"
        onClick={onToggle}
        style={{ ...menuRowStyle, borderBottom: "none", justifyContent: "space-between" }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {icon}
          <span style={{ fontSize: 14, color: "var(--text)" }}>{label}</span>
          {!!badge && (
            <span style={{ background: "#A8542E", color: "#fff", fontSize: 10.5, fontWeight: 600, borderRadius: 10, padding: "1px 7px", lineHeight: 1.5 }}>
              {badge}
            </span>
          )}
        </span>
        <ChevronRight size={16} color="var(--text-faint)" style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s", flexShrink: 0 }} />
      </button>
      {open && <div style={{ padding: "0 20px 16px" }}>{children}</div>}
    </div>
  );
}

/* Bibliothèque de documents PDF (textes de loi, etc.), consultable depuis « À propos » */
function DocumentsBiblio({ accessToken, agent }) {
  const t = useT();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await supaFetch(
          "/rest/v1/documents?select=id,titre,nom_fichier,taille,cree_par,cree_le&order=cree_le.desc",
          {},
          accessToken
        );
        if (!cancelled) setDocuments((rows || []).map((r) => fromDb("documents", r)));
      } catch (e) {
        if (!cancelled) setError(t("impossibleChargerDocs"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [accessToken]);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf") {
      setError(t("seulsFichiersPdf"));
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError(t("fichierDepasseTaille"));
      return;
    }
    setError("");
    setUploading(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const row = toDb("documents", {
          titre: file.name.replace(/\.pdf$/i, ""),
          nomFichier: file.name,
          taille: file.size,
          contenu: reader.result,
          creePar: fullName(agent),
          creeLe: new Date().toISOString(),
        });
        const inserted = await supaFetch(
          "/rest/v1/documents",
          { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify([row]) },
          accessToken
        );
        const nouveau = inserted && inserted[0] && fromDb("documents", inserted[0]);
        if (nouveau) {
          const { contenu, ...meta } = nouveau;
          setDocuments((docs) => [meta, ...docs]);
        }
      } catch (err) {
        setError(t("echecEnvoiDocument"));
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => { setError(t("impossibleLireFichier")); setUploading(false); };
    reader.readAsDataURL(file);
  };

  const consulter = async (doc) => {
    setError("");
    try {
      const rows = await supaFetch(`/rest/v1/documents?id=eq.${doc.id}&select=contenu`, {}, accessToken);
      const contenu = rows && rows[0] && rows[0].contenu;
      if (!contenu) throw new Error("vide");
      const w = window.open("", "_blank");
      if (w) {
        w.document.write(`<iframe src="${contenu}" title="${doc.titre}" style="border:0;position:fixed;inset:0;width:100%;height:100%;"></iframe>`);
      }
    } catch (err) {
      setError(t("impossibleOuvrirDocument"));
    }
  };

  const supprimer = async (doc) => {
    if (!window.confirm(`${t("confirmerSuppressionDoc")} ${doc.titre} » ?`)) return;
    try {
      await supaFetch(`/rest/v1/documents?id=eq.${doc.id}`, { method: "DELETE" }, accessToken);
      setDocuments((docs) => docs.filter((d) => d.id !== doc.id));
    } catch (err) {
      setError(t("suppressionImpossibleTexte"));
    }
  };

  return (
    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed var(--border)" }}>
      <div style={{ fontWeight: 600, fontSize: 12.5, color: "var(--text)", marginBottom: 8 }}>
        {t("textesDocsTitre")}
      </div>
      {loading && <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{t("chargement")}</div>}
      {!loading && documents.length === 0 && (
        <div style={{ fontSize: 12, color: "var(--text-faint)", marginBottom: 8 }}>{t("aucunDocumentInstant")}</div>
      )}
      <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
        {documents.map((d) => (
          <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, background: "#fff", border: "1px solid var(--border-light)", borderRadius: 4, padding: "7px 10px" }}>
            <button type="button" onClick={() => consulter(d)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", textAlign: "left", flex: 1, minWidth: 0 }}>
              <FileText size={15} color="#C9962C" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 12.5, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.titre}</span>
            </button>
            <button type="button" onClick={() => supprimer(d)} title={t("supprimer")} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8542E", flexShrink: 0 }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <label style={{ ...ghostBtn, display: "inline-flex", cursor: uploading ? "wait" : "pointer", opacity: uploading ? 0.6 : 1 }}>
        <Upload size={14} /> {uploading ? t("envoiTexte") : t("ajouterDocumentPdf")}
        <input type="file" accept="application/pdf" onChange={handleUpload} disabled={uploading} style={{ display: "none" }} />
      </label>
      {error && <div style={{ color: "#A8542E", fontSize: 11.5, marginTop: 6 }}>{error}</div>}
    </div>
  );
}

function MenuDrawer({
  open,
  onClose,
  agent,
  artisans,
  exploitants,
  controles,
  onLogout,
  onOpenProfile,
  onOpenLogin,
  onGoHome,
  onGoDashboard,
  onJumpToTab,
  arrondissement,
  setArrondissement,
  parametres,
  setParametres,
  accessToken,
  theme,
  changeTheme,
  langue,
  changeLangue,
  siteSection,
  setSiteSection,
}) {
  const t = useT();
  const [section, setSection] = useState(null); // 'arr' | 'notif' | 'histo' | 'aide' | 'contact' | 'apropos' | 'parametres' | null
  const [search, setSearch] = useState("");
  const [notifPrefs, setNotifPrefs] = useState(() => {
    try {
      const raw = localStorage.getItem("notifPrefs");
      return raw ? JSON.parse(raw) : { cartes: true, nonRegle: true, nonConforme: true };
    } catch {
      return { cartes: true, nonRegle: true, nonConforme: true };
    }
  });
  const [contactDraft, setContactDraft] = useState({
    telephone: parametres.telephone || "",
    email: parametres.email || "",
    adresse: parametres.adresse || "",
  });
  const [contactSaved, setContactSaved] = useState(false);

  useEffect(() => {
    setContactDraft({
      telephone: parametres.telephone || "",
      email: parametres.email || "",
      adresse: parametres.adresse || "",
    });
  }, [parametres.telephone, parametres.email, parametres.adresse]);

  if (!open) return null;
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement);
  const toggle = (id) => setSection((s) => (s === id ? null : id));

  const updateNotifPref = (key, val) => {
    const next = { ...notifPrefs, [key]: val };
    setNotifPrefs(next);
    try { localStorage.setItem("notifPrefs", JSON.stringify(next)); } catch {}
  };

  const persistParametres = (patch) => {
    const next = { ...parametres, ...patch };
    setParametres(next);
    saveKey(STORAGE_KEYS.parametres, [{ id: "global", ...next }], accessToken);
  };

  const saveContact = () => {
    persistParametres(contactDraft);
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 2000);
  };

  const nonRegle = agent && notifPrefs.nonRegle ? artisans.filter((a) => a.statut === "non_regle") : [];
  const exploitantsNonRegle = agent && notifPrefs.nonRegle ? exploitants.filter((e) => e.statut === "non_regle") : [];
  const nonConforme = agent && notifPrefs.nonConforme ? controles.filter((c) => c.resultat === "non_conforme") : [];
  const cartesAExpirer = agent && notifPrefs.cartes
    ? artisans
        .filter((a) => statutExpiration(a.dateExpiration, parametres.seuilRenouvellement))
        .sort((a, b) => joursAvantExpiration(a.dateExpiration) - joursAvantExpiration(b.dateExpiration))
    : [];
  const notifCount = nonRegle.length + exploitantsNonRegle.length + nonConforme.length + cartesAExpirer.length;

  const mesFiches = agent
    ? controles.filter((c) => (c.agent === agent.nom) || (c.type === "controle_technique" && c.inspecteur === fullName(agent))).slice(0, 5)
    : [];

  const q = search.trim().toLowerCase();
  const searchResults = q
    ? [
        ...artisans.filter((a) => a.nom.toLowerCase().includes(q)).slice(0, 4).map((a) => ({
          key: "a-" + a.id, label: a.nom, sub: a.site || t("artisanTexte"), tab: "operateurs",
        })),
        ...exploitants.filter((e) => e.nomStructure.toLowerCase().includes(q)).slice(0, 4).map((e) => ({
          key: "e-" + e.id, label: e.nomStructure, sub: e.type === "eaux" ? t("exploitantsEauxOpt") : t("exploitantsCarrieresOpt"), tab: "operateurs",
        })),
        ...controles.filter((c) => c.operateur.toLowerCase().includes(q)).slice(0, 4).map((c) => ({
          key: "c-" + c.id,
          label: c.operateur,
          sub: c.type === "controle_technique" ? `${t("controleTechniqueTab")} · ${c.dateControle}` : `${t("ficheDeclaration")} · ${c.date}`,
          tab: c.type === "controle_technique" ? "controleTechnique" : "controle",
        })),
      ]
    : [];

  const jump = (tab) => {
    onJumpToTab(tab);
    onGoDashboard();
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex" }}>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(28,43,57,0.55)" }}
      />
      <div
        style={{
          position: "relative",
          width: "50%",
          minWidth: 260,
          maxWidth: 420,
          height: "100%",
          background: "var(--bg-page)",
          boxShadow: "4px 0 24px rgba(0,0,0,0.25)",
          display: "flex",
          flexDirection: "column",
          fontFamily: "'IBM Plex Sans', sans-serif",
          overflowY: "auto",
        }}
      >
        <NationalStripe />
        <div style={{ padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Seal size={34} />
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 16, color: "var(--text)" }}>{t("menuLabel")}</div>
          </div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={20} />
          </button>
        </div>

        {/* Recherche globale */}
        <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: 10, top: 10, color: "var(--text-faint)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("rechercherArtisanFiche")}
              style={{ ...inputStyle, paddingLeft: 32, fontSize: 13 }}
            />
          </div>
          {q && (
            <div style={{ marginTop: 8, display: "grid", gap: 4 }}>
              {searchResults.length === 0 && (
                <div style={{ fontSize: 12.5, color: "var(--text-faint)", padding: "6px 2px" }}>{t("aucunResultat")}</div>
              )}
              {searchResults.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => jump(r.tab)}
                  style={{ textAlign: "left", background: "#fff", border: "1px solid var(--border-light)", borderRadius: 4, padding: "7px 10px", cursor: "pointer" }}
                >
                  <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{r.label}</div>
                  <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{r.sub}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <button type="button" onClick={onGoHome} style={menuRowStyle}>
          <HomeIcon size={18} color="var(--text-muted)" />
          <span style={{ flex: 1, fontSize: 14, color: "var(--text)" }}>{t("accueil")}</span>
          <ChevronRight size={16} color="var(--text-faint)" />
        </button>

        {agent && (
          <button type="button" onClick={onGoDashboard} style={menuRowStyle}>
            <LayoutDashboard size={18} color="var(--text-muted)" />
            <span style={{ flex: 1, fontSize: 14, color: "var(--text)" }}>{t("tableauDeBord")}</span>
            <ChevronRight size={16} color="var(--text-faint)" />
          </button>
        )}

        {agent && (
          <button
            type="button"
            onClick={onOpenProfile}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", background: "none", border: "none", borderBottom: "1px solid var(--border)", cursor: "pointer", textAlign: "left" }}
          >
            <div
              style={{
                width: 44, height: 44, borderRadius: "50%",
                background: agent.photo ? `url(${agent.photo}) center/cover` : "var(--border)",
                border: "1px solid #C9B98E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              {!agent.photo && <Users size={19} color="var(--text-muted)" />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--text)" }}>
                {agent.prenom ? `${agent.prenom} ${agent.nom}` : agent.nom}
              </div>
              <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{t("voirModifierProfil")}</div>
            </div>
            <ChevronRight size={16} color="var(--text-faint)" />
          </button>
        )}

        {agent && (
          <MenuSection
            icon={<Bell size={18} color="var(--text-muted)" />}
            label={t("notifications")}
            badge={notifCount}
            open={section === "notif"}
            onToggle={() => toggle("notif")}
          >
            {notifCount === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)", padding: "6px 0" }}>{t("rienASignaler")}</div>}
            <div style={{ display: "grid", gap: 6 }}>
              {cartesAExpirer.slice(0, 3).map((a) => {
                const expiree = statutExpiration(a.dateExpiration) === "expiree";
                const jours = joursAvantExpiration(a.dateExpiration);
                return (
                  <button key={"exp-" + a.id} type="button" onClick={() => jump("operateurs")} style={notifItemStyle}>
                    <CalendarClock size={14} color={expiree ? "#A8542E" : "#8A6416"} />
                    <span style={{ fontSize: 12.5, color: "var(--text)" }}>
                      {a.prenom ? `${a.prenom} ${a.nom}` : a.nom} — {expiree ? `${t("carteExpireeDepuisJ")} ${Math.abs(jours)} j` : `${t("carteARenouvelerDansJ")} ${jours} j`}
                    </span>
                  </button>
                );
              })}
              {nonRegle.slice(0, 3).map((a) => (
                <button key={a.id} type="button" onClick={() => jump("operateurs")} style={notifItemStyle}>
                  <AlertTriangle size={14} color="#A8542E" />
                  <span style={{ fontSize: 12.5, color: "var(--text)" }}>{a.nom} — {t("nonEnRegleTexte")}</span>
                </button>
              ))}
              {exploitantsNonRegle.slice(0, 3).map((e) => (
                <button key={"exploitant-" + e.id} type="button" onClick={() => jump("operateurs")} style={notifItemStyle}>
                  <AlertTriangle size={14} color="#A8542E" />
                  <span style={{ fontSize: 12.5, color: "var(--text)" }}>{e.nomStructure} — {t("nonEnRegleTexte")}</span>
                </button>
              ))}
              {nonConforme.slice(0, 3).map((c) => (
                <button key={c.id} type="button" onClick={() => jump("controle")} style={notifItemStyle}>
                  <AlertTriangle size={14} color="#A8542E" />
                  <span style={{ fontSize: 12.5, color: "var(--text)" }}>{t("ficheNonConforme")} — {c.operateur}</span>
                </button>
              ))}
            </div>
          </MenuSection>
        )}

        {agent && (
          <MenuSection
            icon={<History size={18} color="var(--text-muted)" />}
            label={t("historique")}
            open={section === "histo"}
            onToggle={() => toggle("histo")}
          >
            {mesFiches.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)", padding: "6px 0" }}>{t("aucuneFicheVous")}</div>}
            <div style={{ display: "grid", gap: 6 }}>
              {mesFiches.map((c) => {
                const cible = c.type === "controle_technique" ? "controleTechnique" : c.type === "declaration_exploitant" ? "operateurs" : "controle";
                const dateAffichee = c.type === "controle_technique" ? formatDateFR(c.dateControle) : c.date;
                return (
                  <button key={c.id} type="button" onClick={() => jump(cible)} style={notifItemStyle}>
                    {c.type === "controle_technique" ? <ShieldCheck size={14} color="var(--text-muted)" /> : <ClipboardList size={14} color="var(--text-muted)" />}
                    <span style={{ fontSize: 12.5, color: "var(--text)" }}>{dateAffichee} · {c.operateur}</span>
                  </button>
                );
              })}
            </div>
          </MenuSection>
        )}

        <MenuSection
          icon={<LayoutDashboard size={18} color="var(--text-muted)" />}
          label={`${t("choixSectionLabel")} · ${siteSection === "industriel" ? t("secteurIndustrielLabel") : t("sectionMiniereLabel")}`}
          open={section === "site"}
          onToggle={() => toggle("site")}
        >
          <div style={{ display: "grid", gap: 6 }}>
            <button
              type="button"
              onClick={() => { setSiteSection("miniere"); setSection(null); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "8px 12px", borderRadius: 4,
                border: siteSection === "miniere" ? "1px solid #C9962C" : "1px solid transparent",
                background: siteSection === "miniere" ? "#fff" : "transparent",
                color: "var(--text)", fontSize: 14, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              <Pickaxe size={18} color="#C9962C" />
              <span>
                {t("sectionMiniereLabel")}
                {siteSection === "miniere" && <span style={{ color: "#C9962C", fontSize: 11.5, marginLeft: 6 }}>· {t("actuelTexte")}</span>}
              </span>
            </button>
            <button
              type="button"
              onClick={() => { setSiteSection("industriel"); setSection(null); onClose(); }}
              style={{
                display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "8px 12px", borderRadius: 4,
                border: siteSection === "industriel" ? "1px solid #C9962C" : "1px solid transparent",
                background: siteSection === "industriel" ? "#fff" : "transparent",
                color: "var(--text)", fontSize: 14, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
              }}
            >
              <Settings size={18} color="#4A5D3A" />
              <span>
                {t("secteurIndustrielLabel")}
                {siteSection === "industriel" && <span style={{ color: "#C9962C", fontSize: 11.5, marginLeft: 6 }}>· {t("actuelTexte")}</span>}
              </span>
            </button>
          </div>
        </MenuSection>

        <MenuSection
          icon={<MapPin size={18} color="var(--text-muted)" />}
          label={`${t("arrondissement")} · ${current?.label || ""}`}
          open={section === "arr"}
          onToggle={() => toggle("arr")}
        >
          <div style={{ display: "grid", gap: 6 }}>
            {ARRONDISSEMENTS.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => { setArrondissement(a.id); setSection(null); onClose(); }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, textAlign: "left", padding: "8px 12px", borderRadius: 4,
                  border: a.id === arrondissement ? "1px solid #C9962C" : "1px solid transparent",
                  background: a.id === arrondissement ? "#fff" : "transparent",
                  color: "var(--text)", fontSize: 14, cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
                }}
              >
                <CommuneLogo id={a.id} size={26} />
                <span>
                  {a.label}
                  {a.id === arrondissement && <span style={{ color: "#C9962C", fontSize: 11.5, marginLeft: 6 }}>· {t("actuelTexte")}</span>}
                </span>
              </button>
            ))}
          </div>
        </MenuSection>

        <MenuSection
          icon={<HelpCircle size={18} color="var(--text-muted)" />}
          label={t("aideFaq")}
          open={section === "aide"}
          onToggle={() => toggle("aide")}
        >
          <div style={{ display: "grid", gap: 10, fontSize: 12.5, color: "var(--text-strong)", lineHeight: 1.5 }}>
            <div><b>{t("aideAjouterArtisan")} :</b> {t("aideAjouterArtisanTexte")}</div>
            <div><b>{t("aideExploitant")} :</b> {t("aideExploitantTexte")}</div>
            <div><b>{t("aideRemplirFiche")} :</b> {t("aideRemplirFicheTexte")}</div>
            <div><b>{t("aideControleTechnique")} :</b> {t("aideControleTechniqueTexte")}</div>
            <div><b>{t("aideGenererCarte")} :</b> {t("aideGenererCarteTexte")}</div>
            <div><b>{t("aideMdpOublie")} :</b> {t("aideMdpOublieTexte")}</div>
          </div>
        </MenuSection>

        <MenuSection
          icon={<Phone size={18} color="var(--text-muted)" />}
          label={t("contactAssistance")}
          open={section === "contact"}
          onToggle={() => toggle("contact")}
        >
          <div style={{ display: "grid", gap: 8, fontSize: 13, color: "var(--text-strong)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><MapPin size={14} color="#C9962C" /> {parametres.adresse || t("delegationBenoueVirgule")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Phone size={14} color="#C9962C" /> {parametres.telephone || "+237 6XX XXX XXX"}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Mail size={14} color="#C9962C" /> {parametres.email || "contact@delegation-benoue.cm"}</div>
          </div>
        </MenuSection>

        <MenuSection
          icon={<Info size={18} color="var(--text-muted)" />}
          label={t("aPropos")}
          open={section === "apropos"}
          onToggle={() => toggle("apropos")}
        >
          <div style={{ fontSize: 12.5, color: "var(--text-strong)", lineHeight: 1.6 }}>
            {t("aProposTexte")}
          </div>
          <DocumentsBiblio accessToken={accessToken} agent={agent} />
        </MenuSection>

        <MenuSection
          icon={<Settings size={18} color="var(--text-muted)" />}
          label={t("parametres")}
          open={section === "parametres"}
          onToggle={() => toggle("parametres")}
        >
          <div style={{ display: "grid", gap: 20, fontSize: 13, color: "var(--text-strong)" }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{t("langueLabel")}</div>
              <select style={inputStyle} value={langue} onChange={(e) => changeLangue(e.target.value)}>
                <option value="fr">Français</option>
                <option value="en">English</option>
              </select>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                {t("langueTraductionNote")}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{t("themeLabel")}</div>
              <select style={inputStyle} value={theme} onChange={(e) => changeTheme(e.target.value)}>
                <option value="clair">{t("clairOpt")}</option>
                <option value="sombre">{t("sombreOpt")}</option>
              </select>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                {t("reglagePropreAppareil")}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{t("seuilAlerteLabel")}</div>
              <select
                style={inputStyle}
                value={parametres.seuilRenouvellement}
                onChange={(e) => persistParametres({ seuilRenouvellement: Number(e.target.value) })}
              >
                <option value={30}>30 {t("joursAvantExpirationOpt")}</option>
                <option value={60}>60 {t("joursAvantExpirationOpt")}</option>
                <option value={90}>90 {t("joursAvantExpirationOpt")}</option>
              </select>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                {t("reglageAppliqueTous")}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{t("coordonneesAffichees")}</div>
              <div style={{ display: "grid", gap: 8 }}>
                <input
                  style={inputStyle}
                  placeholder={t("telephonePlaceholder")}
                  value={contactDraft.telephone}
                  onChange={(e) => setContactDraft({ ...contactDraft, telephone: e.target.value })}
                />
                <input
                  style={inputStyle}
                  placeholder={t("emailPlaceholder")}
                  value={contactDraft.email}
                  onChange={(e) => setContactDraft({ ...contactDraft, email: e.target.value })}
                />
                <input
                  style={inputStyle}
                  placeholder={t("adressePlaceholder")}
                  value={contactDraft.adresse}
                  onChange={(e) => setContactDraft({ ...contactDraft, adresse: e.target.value })}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button type="button" onClick={saveContact} style={{ ...primaryBtn, padding: "7px 16px" }}>
                    {t("enregistrer")}
                  </button>
                  {contactSaved && <span style={{ fontSize: 11.5, color: "#4A5D3A" }}>{t("enregistreCoche")}</span>}
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 4 }}>
                {t("visibleTousInspecteurs")}
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{t("notifsAAfficher")}</div>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={notifPrefs.cartes} onChange={(e) => updateNotifPref("cartes", e.target.checked)} />
                  {t("cartesARenouvelerExpirees")}
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={notifPrefs.nonRegle} onChange={(e) => updateNotifPref("nonRegle", e.target.checked)} />
                  {t("artisansNonEnRegle")}
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={notifPrefs.nonConforme} onChange={(e) => updateNotifPref("nonConforme", e.target.checked)} />
                  {t("fichesNonConformes")}
                </label>
              </div>
            </div>
          </div>
        </MenuSection>

        <div style={{ padding: "18px 20px", borderTop: "1px solid var(--border)", marginTop: "auto" }}>
          {agent ? (
            <button type="button" onClick={onLogout} style={{ ...ghostBtn, width: "100%", justifyContent: "center", color: "#A8542E", borderColor: "#E3C7B8" }}>
              <LogOut size={15} /> {t("deconnexion")}
            </button>
          ) : (
            <button type="button" onClick={onOpenLogin} style={{ ...primaryBtn, width: "100%", justifyContent: "center" }}>
              <Lock size={15} /> {t("espaceInspecteurs")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* Sous-écran : changement de mot de passe (ancien + nouveau + confirmation) */
function PasswordChangeForm({ accessToken, onDone, onCancel }) {
  const t = useT();
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strong = passwordScore(newPwd) === 5;

  const submit = async () => {
    setError("");
    if (!oldPwd) { setError(t("veuillezAncienMdp")); return; }
    if (!strong) { setError(t("mdpDoitEtreFort")); return; }
    if (newPwd !== confirm) { setError(t("confirmationNeCorrespondPas")); return; }
    setLoading(true);
    try {
      const result = await supaFetch(
        "/rest/v1/rpc/change_own_password",
        { method: "POST", body: JSON.stringify({ p_current_password: oldPwd, p_new_password: newPwd }) },
        accessToken
      );
      const status = typeof result === "string" ? result : result?.change_own_password;
      if (status === "incorrect") {
        setError(t("ancienMdpIncorrect"));
      } else if (status === "success") {
        onDone();
      } else {
        setError(t("erreurReessayer"));
      }
    } catch (err) {
      setError(t("erreurReessayer"));
    }
    setLoading(false);
  };

  return (
    <div style={{ marginTop: 6 }}>
      <label style={labelStyle}>{t("ancienMdpLabel")}<RequiredMark /></label>
      <PasswordInput value={oldPwd} onChange={(e) => setOldPwd(e.target.value)} />

      <label style={{ ...labelStyle, marginTop: 14 }}>{t("nouveauMdpLabel")}<RequiredMark /></label>
      <PasswordInput value={newPwd} onChange={(e) => setNewPwd(e.target.value)} />
      <PasswordStrengthBar password={newPwd} />

      <label style={{ ...labelStyle, marginTop: 14 }}>{t("confirmerNouveauMdp")}<RequiredMark /></label>
      <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} />

      {error && <div style={{ color: "#A8542E", fontSize: 12.5, marginTop: 12 }}>{error}</div>}

      <button type="button" onClick={submit} disabled={loading} style={{ ...primaryBtn, width: "100%", marginTop: 18, justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
        {loading ? t("validation") : t("validerBtn2")}
      </button>
      <button type="button" onClick={onCancel} style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "var(--text-muted)", fontSize: 12.5, cursor: "pointer" }}>
        {t("annuler")}
      </button>
    </div>
  );
}

/* Écran de verrouillage — ressaisie du mot de passe avant d'afficher le profil */
function ProfileLockScreen({ agent, onUnlock, onCancel }) {
  const t = useT();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    if (!password) {
      setError(t("veuillezMdp"));
      return;
    }
    setLoading(true);
    try {
      await signInAuth(agent.email, password);
      onUnlock();
    } catch (err) {
      setError(t("mdpIncorrect"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 115,
        background: "rgba(28,43,57,0.92)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      <div style={{ background: "var(--bg-page)", width: "100%", maxWidth: 340, padding: "32px 26px", borderRadius: 6, textAlign: "center" }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: "50%", background: "#fff", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px",
          }}
        >
          <Lock size={20} color="#C9962C" />
        </div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: "var(--text)", marginBottom: 6 }}>
          {t("profilVerrouille")}
        </div>
        <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginBottom: 20, lineHeight: 1.5 }}>
          {t("protegerInfosTexte")}
        </div>

        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(e); }}
          placeholder={t("mdpPlaceholder")}
        />

        {error && <div style={{ color: "#A8542E", fontSize: 12.5, marginTop: 10 }}>{error}</div>}

        <button
          type="button"
          onClick={submit}
          disabled={loading}
          style={{ ...primaryBtn, width: "100%", marginTop: 18, justifyContent: "center", opacity: loading ? 0.6 : 1 }}
        >
          <Lock size={14} /> {loading ? t("verification") : t("deverrouillerBtn")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "var(--text-muted)", fontSize: 12.5, cursor: "pointer" }}
        >
          ← {t("annuler")}
        </button>
      </div>
    </div>
  );
}

/* Édition du profil inspecteur */
function ProfileEdit({ agent, accessToken, setAgent, onClose, onLogoutToLogin, onLockNow }) {
  const t = useT();
  const [form, setForm] = useState({
    nom: agent.nom || "",
    prenom: agent.prenom || "",
    dateNaissance: agent.dateNaissance || "",
    matricule: agent.matricule || "",
    email: agent.email || "",
    photo: agent.photo || "",
  });
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [pwdConfirm, setPwdConfirm] = useState(false); // "voulez-vous modifier le mot de passe ?"
  const [pwdForm, setPwdForm] = useState(false); // formulaire à 3 champs
  const [pwdJustChanged, setPwdJustChanged] = useState(false);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const submit = async () => {
    setError("");
    if (!form.nom.trim() || !form.prenom.trim() || !form.dateNaissance || !form.matricule.trim() || !form.email.trim()) {
      setError(t("champsObligatoires2"));
      return;
    }
    const updated = { ...agent, ...form };
    try {
      await supaFetch(
        `/rest/v1/agents?id=eq.${agent.id}`,
        { method: "PATCH", body: JSON.stringify(toDb("agents", form)) },
        accessToken
      );
      setAgent(updated);
      if (pwdJustChanged) {
        // Le mot de passe a été modifié pendant cette session d'édition :
        // on déconnecte pour forcer une reconnexion avec le nouveau mot de passe
        onLogoutToLogin();
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(t("impossibleEnregistrerMoment"));
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 110, background: "var(--text)", overflowY: "auto", padding: "32px 16px 60px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ background: "var(--bg-page)", width: "100%", maxWidth: 460, margin: "0 auto", padding: "30px 26px", borderRadius: 6, position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#C9962C" }}>
            <Pencil size={17} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {t("monProfilTitre")}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              type="button"
              onClick={onLockNow || onClose}
              title={t("verrouillerMaintenant")}
              style={{ display: "flex", alignItems: "center", gap: 5, background: "none", border: "1px solid var(--border)", borderRadius: 3, padding: "5px 9px", cursor: "pointer", color: "var(--text-muted)", fontSize: 11.5 }}
            >
              <Lock size={13} /> {t("verrouillerBtn")}
            </button>
            <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
              <X size={20} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "center" }}>
          <div
            style={{
              width: 68, height: 68, borderRadius: 6,
              background: form.photo ? `url(${form.photo}) center/cover` : "#fff",
              border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}
          >
            {!form.photo && <Users size={22} color="var(--text-faint)" />}
          </div>
          <div>
            <label style={labelStyle}>{t("photoFacultatif")}</label>
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 12.5 }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
          <div>
            <label style={labelStyle}>{t("nomDoc")}<RequiredMark /></label>
            <input style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>{t("prenomDoc")}<RequiredMark /></label>
            <input style={inputStyle} value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>{t("dateNaissanceDoc")}<RequiredMark /></label>
            <DateNaissancePicker value={form.dateNaissance} onChange={(v) => setForm({ ...form, dateNaissance: v })} />
          </div>
          <div>
            <label style={labelStyle}>{t("matriculeLabel")}<RequiredMark /></label>
            <input style={inputStyle} value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>{t("emailLabel")}<RequiredMark /></label>
            <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <label style={{ ...labelStyle, marginBottom: 2 }}>{t("motDePasseTitre")}</label>
              <div style={{ fontSize: 11.5, color: "var(--text-faint)" }}>
                {pwdJustChanged ? t("nouveauMdpDefini") : "••••••••"}
              </div>
            </div>
            {!pwdForm && (
              <button
                type="button"
                onClick={() => setPwdConfirm(true)}
                style={{ ...ghostBtn, padding: "7px 12px", fontSize: 12.5 }}
              >
                <Pencil size={12} /> {t("modifierMdpBtn")}
              </button>
            )}
          </div>

          {pwdForm && (
            <PasswordChangeForm
              accessToken={accessToken}
              onCancel={() => setPwdForm(false)}
              onDone={() => { setPwdForm(false); setPwdJustChanged(true); }}
            />
          )}
        </div>

        <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--text-faint)" }}>
          {t("identifiantLabel")} : <b style={{ color: "var(--text-muted)" }}>{agent.login}</b>
        </div>

        {error && <div style={{ color: "#A8542E", fontSize: 12.5, marginTop: 14 }}>{error}</div>}
        {saved && <div style={{ color: "#4A5D3A", fontSize: 12.5, marginTop: 14 }}>{t("profilMisAJour")}</div>}

        <button type="button" onClick={submit} style={{ ...primaryBtn, width: "100%", marginTop: 20, justifyContent: "center" }}>
          {t("enregistrerModifications")}
        </button>
        <button
          type="button"
          onClick={onClose}
          style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "var(--text-muted)", fontSize: 12.5, cursor: "pointer" }}
        >
          ← {t("retourBtn")}
        </button>

        {pwdConfirm && (
          <div style={{ position: "absolute", inset: 0, background: "rgba(28,43,57,0.7)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <div style={{ background: "#fff", borderRadius: 6, padding: "22px 20px", maxWidth: 300, textAlign: "center" }}>
              <div style={{ fontSize: 14.5, color: "var(--text)", fontWeight: 600, marginBottom: 18 }}>
                {t("voulezVousModifierMdp")}
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
                <button
                  type="button"
                  onClick={() => { setPwdConfirm(false); setPwdForm(true); }}
                  style={{ ...primaryBtn, minWidth: 70, justifyContent: "center" }}
                >
                  {t("oui")}
                </button>
                <button
                  type="button"
                  onClick={() => setPwdConfirm(false)}
                  style={{ ...ghostBtn, minWidth: 70, justifyContent: "center" }}
                >
                  {t("non")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
/* ---------------------------------------------------------------
   Page d'accueil publique
--------------------------------------------------------------- */
function Home({ onEnter, arrondissement, onOpenMenu, agent, parametres }) {
  const t = useT();
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)" }}>
      <NationalStripe />
      <header
        style={{
          background: "var(--text)",
          color: "var(--bg-page)",
          padding: "52px 24px 68px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: 16, left: 16, zIndex: 2 }}>
          <MenuButton onClick={onOpenMenu} dark />
        </div>
        {/* motif cadastral — grille topographique discrète, rappel du levé de terrain */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(201,150,44,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(201,150,44,0.08) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
            maskImage: "linear-gradient(to bottom, black, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
          }}
        />
        <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              marginBottom: 30,
              textAlign: "center",
            }}
          >
            <img
              src={LOGO_CAMEROUN}
              alt="Armoiries de la République du Cameroun"
              style={{ width: 56, height: "auto", objectFit: "contain", flexShrink: 0 }}
            />
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11.5,
                letterSpacing: "0.12em",
                color: "#C9962C",
                textTransform: "uppercase",
                lineHeight: 1.7,
              }}
            >
              République du Cameroun
              <br />
              {t("ministereNom")}
            </div>
          </div>
          <h1
            style={{
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: "clamp(34px, 6.4vw, 56px)",
              lineHeight: 1.06,
              margin: "0 auto",
              maxWidth: 640,
              color: "#FFFFFF",
              letterSpacing: "-0.01em",
              textAlign: "center",
            }}
          >
            {t("delegationBenoue")}
            <span
              style={{
                display: "block",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#C9962C",
                fontSize: "0.62em",
                marginTop: 10,
              }}
            >
              {t("controleActivites")}
            </span>
          </h1>
          <p
            style={{
              fontFamily: "'IBM Plex Sans', sans-serif",
              fontSize: 16,
              color: "#D8CFBE",
              maxWidth: 520,
              marginTop: 18,
              lineHeight: 1.6,
            }}
          >
            {t("heroTexte")}
          </p>
          {agent ? (
            <div
              style={{
                marginTop: 30,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontSize: 13,
                color: "#D8CFBE",
              }}
            >
              <CheckCircle2 size={15} color="#C9962C" /> {t("connecteAccedez")}
            </div>
          ) : (
            <button
              onClick={onEnter}
              style={{
                marginTop: 30,
                background: "#C9962C",
                color: "var(--text)",
                border: "none",
                padding: "13px 26px",
                fontFamily: "'IBM Plex Sans', sans-serif",
                fontWeight: 600,
                fontSize: 14,
                borderRadius: 3,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Lock size={15} /> {t("espaceInspecteurs")}
            </button>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 760, margin: "0 auto", padding: "44px 24px 80px" }}>
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 18,
            marginBottom: 48,
          }}
        >
          {[
            {
              icon: <ClipboardList size={20} />,
              title: t("carteFichesTitle"),
              text: t("carteFichesTexte"),
            },
            {
              icon: <Users size={20} />,
              title: t("carteRegistreTitle"),
              text: t("carteRegistreTexte"),
            },
            {
              icon: <CreditCard size={20} />,
              title: t("carteCartesTitle"),
              text: t("carteCartesTexte"),
            },
            {
              icon: <Droplet size={20} />,
              title: t("carteExploitantsTitle"),
              text: t("carteExploitantsTexte"),
            },
            {
              icon: <Mountain size={20} />,
              title: t("carteTaxeForfaitaireTitle"),
              text: t("carteTaxeForfaitaireTexte"),
            },
            {
              icon: <ShieldCheck size={20} />,
              title: t("carteControleTitle"),
              text: t("carteControleTexte"),
            },
          ].map((c) => (
            <div
              key={c.title}
              style={{
                background: "#fff",
                border: "1px solid var(--border-light)",
                borderRadius: 4,
                padding: "20px 18px",
              }}
            >
              <div style={{ color: "var(--text)", marginBottom: 10 }}>{c.icon}</div>
              <div
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontWeight: 600,
                  fontSize: 14.5,
                  color: "var(--text)",
                  marginBottom: 6,
                }}
              >
                {c.title}
              </div>
              <div
                style={{
                  fontFamily: "'IBM Plex Sans', sans-serif",
                  fontSize: 13,
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {c.text}
              </div>
            </div>
          ))}
        </section>

        <section
          style={{
            borderTop: "1px solid var(--border)",
            paddingTop: 28,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
            gap: 18,
            fontFamily: "'IBM Plex Sans', sans-serif",
          }}
        >
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.1em", color: "#C9962C", textTransform: "uppercase", marginBottom: 8, fontFamily: "'IBM Plex Mono', monospace" }}>
              {t("contactLabel")}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-strong)", marginBottom: 6 }}>
              <MapPin size={15} color="#C9962C" /> {parametres?.adresse || t("delegationBenoueVirgule")}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-strong)", marginBottom: 6 }}>
              <Phone size={15} color="#C9962C" /> {parametres?.telephone || "+237 6XX XXX XXX"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-strong)" }}>
              <Mail size={15} color="#C9962C" /> {parametres?.email || "contact@delegation-benoue.cm"}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

/* ---------------------------------------------------------------
   Login gate
--------------------------------------------------------------- */
/* ---- Utilitaires compte inspecteur ---- */
function slugifyLogin(nom, prenom, existingLogins) {
  const clean = (s) =>
    (s || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z]/g, "");
  let base = clean(nom);
  if (!base) base = "inspecteur";
  let login = base;
  let i = 1;
  while (existingLogins.includes(login)) {
    login = base + i;
    i++;
  }
  return login;
}

function passwordScore(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

function passwordLevel(score) {
  if (score <= 2) return { label: "Faible", color: "#A8542E", pct: 33 };
  if (score <= 4) return { label: "Moyen", color: "#C9962C", pct: 66 };
  return { label: "Fort", color: "#4A5D3A", pct: 100 };
}

function RequiredMark() {
  return <span style={{ color: "#A8542E" }}> *</span>;
}

function PasswordInput({ value, onChange, onKeyDown, placeholder }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        style={{ ...inputStyle, paddingRight: 38 }}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={{ position: "absolute", right: 6, top: 0, bottom: 0, background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", display: "flex", alignItems: "center" }}
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

const MONTHS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function daysInMonthGeneric(monthIndex) {
  if (monthIndex === 1) return 29;
  if ([3, 5, 8, 10].includes(monthIndex)) return 30;
  return 31;
}

const pickerBtnStyle = {
  padding: "7px 4px",
  fontSize: 11.5,
  border: "1px solid var(--border-light)",
  borderRadius: 3,
  background: "var(--bg-page)",
  cursor: "pointer",
  color: "var(--text)",
  fontFamily: "'IBM Plex Sans', sans-serif",
};

function DateNaissancePicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("mois");
  const [selMonth, setSelMonth] = useState(null);

  const displayValue = value ? `${value.slice(8, 10)}/${value.slice(5, 7)}/${value.slice(0, 4)}` : "";

  const openPicker = () => {
    setStep("mois");
    setSelMonth(null);
    setOpen((o) => !o);
  };

  const pickMonth = (m) => { setSelMonth(m); setStep("jour"); };
  const pickDay = (d) => {
    const mm = String(selMonth + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    // année provisoire ; sera complétée à l'étape suivante
    onChange(`XXXX-${mm}-${dd}`);
    setStep("annee");
  };
  const pickYear = (y) => {
    const parts = value.split("-");
    onChange(`${y}-${parts[1]}-${parts[2]}`);
    setOpen(false);
  };

  const years = [];
  for (let y = 2026; y >= 1960; y--) years.push(y);

  return (
    <div style={{ position: "relative" }}>
      <button
        type="button"
        onClick={openPicker}
        style={{
          ...inputStyle,
          border: "1px solid var(--border)",
          textAlign: "left",
          cursor: "pointer",
          color: value && !value.startsWith("XXXX") ? "var(--text-strong)" : "var(--text-faint)",
        }}
      >
        {(value && !value.startsWith("XXXX")) ? displayValue : "JJ/MM/AAAA"}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            zIndex: 20,
            top: "calc(100% + 4px)",
            left: 0,
            background: "#fff",
            border: "1px solid var(--border)",
            borderRadius: 4,
            padding: 12,
            width: 260,
            maxHeight: 240,
            overflowY: "auto",
            boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
              {step === "mois" && "1. Choisir le mois"}
              {step === "jour" && "2. Choisir le jour"}
              {step === "annee" && "3. Choisir l'année"}
            </span>
            <button type="button" onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)" }}>
              <X size={14} />
            </button>
          </div>

          {step === "mois" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {MONTHS.map((m, i) => (
                <button key={m} type="button" onClick={() => pickMonth(i)} style={pickerBtnStyle}>
                  {m.slice(0, 3)}
                </button>
              ))}
            </div>
          )}

          {step === "jour" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 5 }}>
              {Array.from({ length: daysInMonthGeneric(selMonth) }, (_, i) => i + 1).map((d) => (
                <button key={d} type="button" onClick={() => pickDay(d)} style={pickerBtnStyle}>
                  {d}
                </button>
              ))}
            </div>
          )}

          {step === "annee" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 5 }}>
              {years.map((y) => (
                <button key={y} type="button" onClick={() => pickYear(y)} style={pickerBtnStyle}>
                  {y}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PasswordStrengthBar({ password }) {
  const score = passwordScore(password);
  const level = passwordLevel(score);
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ height: 5, background: "var(--border-light)", borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${password ? level.pct : 0}%`, background: level.color, transition: "width 0.2s, background 0.2s" }} />
      </div>
      {password && (
        <div style={{ fontSize: 11, marginTop: 4, color: level.color, fontFamily: "'IBM Plex Mono', monospace" }}>
          Sécurité : {level.label}
        </div>
      )}
    </div>
  );
}

/* ---- Écran de connexion ---- */
function LoginScreen({ onLogin, onBack }) {
  const [mode, setMode] = useState("signin"); // signin | register
  const [justCreated, setJustCreated] = useState(false);

  if (mode === "register") {
    return (
      <Register
        onBack={() => setMode("signin")}
        onCreated={() => {
          setJustCreated(true);
          setMode("signin");
        }}
      />
    );
  }

  return (
    <SignIn
      onLogin={onLogin}
      onBack={onBack}
      onCreateAccount={() => { setJustCreated(false); setMode("register"); }}
      justCreated={justCreated}
    />
  );
}

function ForgotPasswordModal({ onClose }) {
  const t = useT();
  const [step, setStep] = useState("email"); // email | result
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const submitEmail = async () => {
    setError("");
    if (!email.trim()) { setError(t("veuillezAdresseEmail")); return; }
    setLoading(true);
    try {
      const pwd = await supaFetch("/rest/v1/rpc/admin_reset_password", {
        method: "POST",
        body: JSON.stringify({ p_email: email.trim().toLowerCase() }),
      });
      setGeneratedPassword(typeof pwd === "string" ? pwd : pwd?.admin_reset_password || "");
      setStep("result");
    } catch (err) {
      const msg = (err.message || "").toLowerCase();
      if (msg.includes("no_account")) {
        setError(t("aucunCompteEmail"));
      } else {
        setError(t("erreurReessayer"));
      }
    }
    setLoading(false);
  };

  const copyPassword = async () => {
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      setCopied(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(28,43,57,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "var(--bg-page)", width: "100%", maxWidth: 380, borderRadius: 6, padding: "26px 24px" }}>
        {step === "email" ? (
          <>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: "var(--text)", margin: "0 0 6px" }}>
              {t("mdpOublieTitre")}
            </h3>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "0 0 16px" }}>
              {t("mdpOublieTexte")}
            </p>
            <label style={{ display: "block", fontSize: 12.5, color: "var(--text-muted)", marginBottom: 5 }}>{t("adresseEmailLabel")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitEmail(); }}
              style={inputStyle}
            />
            {error && <div style={{ color: "#A8542E", fontSize: 12.5, marginTop: 10 }}>{error}</div>}
            <button type="button" onClick={submitEmail} disabled={loading} style={{ ...primaryBtn, width: "100%", marginTop: 18, justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
              {loading ? t("generation") : t("genererMdpBtn")}
            </button>
            <button type="button" onClick={onClose} style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "var(--text-muted)", fontSize: 12.5, cursor: "pointer" }}>
              {t("annuler")}
            </button>
          </>
        ) : (
          <>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: "var(--text)", margin: "0 0 6px" }}>
              {t("mdpParDefautTitre")}
            </h3>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "0 0 16px", lineHeight: 1.5 }}>
              {t("mdpTempUsageUnique")}
            </p>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 19,
                fontWeight: 700,
                color: "var(--text)",
                background: "#fff",
                border: "1.5px solid #C9962C",
                borderRadius: 4,
                padding: "14px 12px",
                textAlign: "center",
                letterSpacing: "0.06em",
                marginBottom: 6,
              }}
            >
              {generatedPassword}
            </div>
            {copied && <div style={{ color: "#4A5D3A", fontSize: 11.5, textAlign: "center", marginBottom: 10 }}>{t("copieTexte")}</div>}
            <div style={{ display: "flex", gap: 10, marginTop: copied ? 0 : 16 }}>
              <button type="button" onClick={copyPassword} style={{ ...ghostBtn, flex: 1, justifyContent: "center" }}>
                {t("copierBtn")}
              </button>
              <button type="button" onClick={onClose} style={{ ...primaryBtn, flex: 1, justifyContent: "center" }}>
                {t("fermer")}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ForceNewPasswordScreen({ email, accessToken, onDone }) {
  const t = useT();
  const [intro, setIntro] = useState(true);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strong = passwordScore(newPassword) === 5;

  const validate = async () => {
    setError("");
    if (!strong) { setError(t("mdpDoitEtreFort2")); return; }
    if (newPassword !== confirm) { setError(t("confirmationNeCorrespond")); return; }
    setLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
        method: "PUT",
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      });
      if (!res.ok) throw new Error("update_failed");
      await supaFetch(
        `/rest/v1/agents?auth_user_id=eq.${JSON.parse(atob(accessToken.split(".")[1])).sub}`,
        { method: "PATCH", body: JSON.stringify({ must_change_password: false }) },
        accessToken
      );
      onDone();
    } catch (err) {
      setError(t("impossibleMajMdp"));
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--text)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ background: "var(--bg-page)", width: "100%", maxWidth: 380, borderRadius: 6, padding: "30px 26px", textAlign: intro ? "center" : "left" }}>
        {intro ? (
          <>
            <Lock size={26} color="#C9962C" style={{ marginBottom: 12 }} />
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: "var(--text)", margin: "0 0 10px" }}>
              {t("creerNouveauMdp")}
            </h3>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", lineHeight: 1.6, marginBottom: 20 }}>
              {t("mdpTempUneFois")}
            </p>
            <button type="button" onClick={() => setIntro(false)} style={{ ...primaryBtn, width: "100%", justifyContent: "center" }}>
              {t("creerBtn")}
            </button>
          </>
        ) : (
          <>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: "var(--text)", margin: "0 0 18px" }}>
              {t("nouveauMdpTitre")}
            </h3>
            <label style={labelStyle}>{t("nouveauMdpLabel")}<RequiredMark /></label>
            <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            <PasswordStrengthBar password={newPassword} />
            <label style={{ ...labelStyle, marginTop: 14 }}>{t("confirmerMdpLabel")}<RequiredMark /></label>
            <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            {error && <div style={{ color: "#A8542E", fontSize: 12.5, marginTop: 12 }}>{error}</div>}
            <button type="button" onClick={validate} disabled={loading} style={{ ...primaryBtn, width: "100%", marginTop: 20, justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
              {loading ? t("enregistrementEnCours") : t("validerBtn2")}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function SignIn({ onLogin, onBack, onCreateAccount, justCreated }) {
  const t = useT();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forcePwdCtx, setForcePwdCtx] = useState(null); // { email, accessToken } | null
  const [justChangedPwd, setJustChangedPwd] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const authData = await signInAuth(email.trim(), password);
      const accessToken = authData.access_token;
      const rows = await supaFetch(
        `/rest/v1/agents?auth_user_id=eq.${authData.user.id}&select=*`,
        {},
        accessToken
      );
      if (!rows || rows.length === 0) {
        setError(t("aucunProfilAssocie"));
        setLoading(false);
        return;
      }
      const agentRow = fromDb("agents", rows[0]);
      if (agentRow.mustChangePassword) {
        setForcePwdCtx({ email: email.trim(), accessToken });
        setLoading(false);
        return;
      }
      onLogin(agentRow, accessToken);
    } catch (err) {
      const msg = (err.message || "").toLowerCase();
      if (msg.includes("confirm")) {
        setError(t("emailNonConfirme"));
      } else {
        setError(t("identifiantsIncorrects"));
      }
      setLoading(false);
    }
  };

  if (forcePwdCtx) {
    return (
      <ForceNewPasswordScreen
        email={forcePwdCtx.email}
        accessToken={forcePwdCtx.accessToken}
        onDone={() => {
          setForcePwdCtx(null);
          setPassword("");
          setJustChangedPwd(true);
        }}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--text)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: "'IBM Plex Sans', sans-serif",
      }}
    >
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      <div
        style={{
          background: "var(--bg-page)",
          width: "100%",
          maxWidth: 360,
          padding: "34px 28px",
          borderRadius: 4,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#C9962C", marginBottom: 4 }}>
          <Stamp size={18} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {t("accesReserve")}
          </span>
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--text)", margin: "6px 0 22px" }}>
          {t("espaceInspecteursTitre")}
        </h2>

        {justCreated && (
          <div style={{ background: "#EAF0E5", color: "#4A5D3A", fontSize: 12.5, padding: "8px 10px", borderRadius: 3, marginBottom: 16 }}>
            {t("compteCreeSucces")}
          </div>
        )}
        {justChangedPwd && (
          <div style={{ background: "#EAF0E5", color: "#4A5D3A", fontSize: 12.5, padding: "8px 10px", borderRadius: 3, marginBottom: 16 }}>
            {t("mdpMisAJourConnectez")}
          </div>
        )}

        <label style={{ display: "block", fontSize: 12.5, color: "var(--text-muted)", marginBottom: 5 }}>{t("adresseEmailLabel")}</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(e); }}
          style={inputStyle}
          placeholder="Ex : madamou@delegation-benoue.cm"
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 5px" }}>
          <label style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{t("motDePasseLabel")}</label>
          <button type="button" onClick={() => setShowForgot(true)} style={{ background: "none", border: "none", color: "#C9962C", fontSize: 11.5, cursor: "pointer", padding: 0 }}>
            {t("motDePasseOublie")}
          </button>
        </div>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") submit(e); }}
          placeholder={t("mdpPlaceholder")}
        />

        {error && (
          <div style={{ color: "#A8542E", fontSize: 12.5, marginTop: 10 }}>{error}</div>
        )}

        <button type="button" onClick={submit} disabled={loading} style={{ ...primaryBtn, width: "100%", marginTop: 22, justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
          {loading ? t("connexion") : t("seConnecterBtn")}
        </button>
        <button
          type="button"
          onClick={onCreateAccount}
          style={{ ...ghostBtn, width: "100%", marginTop: 10, justifyContent: "center" }}
        >
          {t("creerUnCompte")}
        </button>
        <button
          type="button"
          onClick={onBack}
          style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "var(--text-muted)", fontSize: 12.5, cursor: "pointer" }}
        >
          ← {t("retourAuSite")}
        </button>
      </div>
    </div>
  );
}

/* ---- Création de compte inspecteur ---- */
function OtpBoxes({ value, onChange, refs, disabled }) {
  const handleChange = (idx, raw) => {
    const digit = raw.replace(/[^0-9]/g, "").slice(-1);
    const next = [...value];
    next[idx] = digit;
    onChange(next);
    if (digit && idx < 3) refs[idx + 1].current?.focus();
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      refs[idx - 1].current?.focus();
    }
  };

  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", margin: "18px 0" }}>
      {[0, 1, 2, 3].map((idx) => (
        <input
          key={idx}
          ref={refs[idx]}
          type="tel"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[idx]}
          onChange={(e) => handleChange(idx, e.target.value)}
          onKeyDown={(e) => handleKeyDown(idx, e)}
          style={{
            width: 52,
            height: 58,
            textAlign: "center",
            fontSize: 24,
            fontFamily: "'IBM Plex Mono', monospace",
            border: "1.5px solid var(--border)",
            borderRadius: 4,
            background: disabled ? "var(--bg-subtle)" : "#fff",
            color: "var(--text)",
          }}
        />
      ))}
    </div>
  );
}

/* ---- Création de compte inspecteur (formulaire + vérification par code) ---- */
function Register({ onBack, onCreated }) {
  const t = useT();
  const [step, setStep] = useState("form"); // form | otp
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    matricule: "",
    email: "",
    photo: "",
  });
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRetryFinalize, setShowRetryFinalize] = useState(false);

  const score = passwordScore(password);
  const strong = score === 5;

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  /* --- Étape code de vérification --- */
  const [otp, setOtp] = useState(["", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [regenDisabled, setRegenDisabled] = useState(true);
  const [countdown, setCountdown] = useState(30);
  const timerRef = useRef(null);

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const startCooldown = () => {
    setRegenDisabled(true);
    setCountdown(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timerRef.current);
          setRegenDisabled(false);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const requestCode = async () => {
    setOtpError("");
    setOtp(["", "", "", ""]);
    setShowRetryFinalize(false);
    try {
      await supaFetch("/rest/v1/rpc/request_otp", {
        method: "POST",
        body: JSON.stringify({ p_email: form.email.trim().toLowerCase() }),
      });
      startCooldown();
      setTimeout(() => otpRefs[0].current?.focus(), 60);
      return true;
    } catch (err) {
      setOtpError(t("impossibleEnvoyerCode"));
      return false;
    }
  };

  const submitForm = async () => {
    setFormError("");
    const requiredOk =
      form.nom.trim() &&
      form.dateNaissance &&
      !form.dateNaissance.startsWith("XXXX") &&
      form.matricule.trim() &&
      form.email.trim() &&
      form.photo;
    if (!requiredOk) {
      setFormError(t("champsObligatoiresPhoto"));
      return;
    }
    if (!strong) {
      setFormError(t("mdpFortAvantContinuer"));
      return;
    }
    if (password !== confirm) {
      setFormError(t("confirmationNeCorrespond"));
      return;
    }
    setLoading(true);
    if (USE_CUSTOM_OTP) {
      await requestCode();
      setLoading(false);
      setStep("otp");
    } else {
      await submitWithEmailLink();
      setLoading(false);
    }
  };

  /* Chemin "lien de confirmation Supabase" : on met en attente le profil,
     puis on déclenche l'inscription Supabase (qui enverra elle-même l'e-mail) */
  const submitWithEmailLink = async () => {
    try {
      await supaFetch("/rest/v1/pending_agent_profiles", {
        method: "POST",
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          nom: form.nom.trim(),
          prenom: form.prenom.trim(),
          date_naissance: form.dateNaissance,
          matricule: form.matricule.trim(),
          photo: form.photo,
          login: slugifyLogin(form.nom, form.prenom, []),
        }),
      });
      await signUpAuth(form.email.trim(), password);
      setStep("confirmLink");
    } catch (err) {
      setFormError(err.message || "Erreur lors de la création du compte. Réessayez.");
    }
  };

  const finalizeAccountCreation = async () => {
    setOtpLoading(true);
    setOtpError("");
    try {
      let accessToken, userId;
      try {
        const authData = await signUpAuth(form.email.trim(), password);
        accessToken = authData.access_token;
        userId = authData.user?.id;
        if (!accessToken) {
          setOtpError("Compte vérifié, mais la connexion automatique a échoué. Essayez de vous connecter manuellement.");
          setOtpLoading(false);
          return;
        }
      } catch (signupErr) {
        const msg = (signupErr.message || "").toLowerCase();
        if (msg.includes("already") || msg.includes("existe") || msg.includes("registered")) {
          // Le compte a probablement été créé lors d'une tentative précédente interrompue : on se connecte directement
          const authData = await signInAuth(form.email.trim(), password);
          accessToken = authData.access_token;
          userId = authData.user?.id;
        } else {
          throw signupErr;
        }
      }

      // Évite un profil en double si une tentative précédente avait déjà réussi à créer la ligne
      const existing = await supaFetch(`/rest/v1/agents?auth_user_id=eq.${userId}&select=id`, {}, accessToken);
      if (!existing || existing.length === 0) {
        const newAgent = {
          id: uid(),
          nom: form.nom.trim(),
          prenom: form.prenom.trim(),
          dateNaissance: form.dateNaissance,
          matricule: form.matricule.trim(),
          email: form.email.trim(),
          photo: form.photo,
          login: slugifyLogin(form.nom, form.prenom, []),
          role: "agent",
          authUserId: userId,
        };
        await supaFetch("/rest/v1/agents", { method: "POST", body: JSON.stringify(toDb("agents", newAgent)) }, accessToken);
      }
      setShowRetryFinalize(false);
      onCreated();
    } catch (err) {
      setOtpError((err.message || "Erreur lors de la création du compte.") + " — Le code était correct, vous pouvez réessayer sans en redemander un nouveau.");
      setShowRetryFinalize(true);
    }
    setOtpLoading(false);
  };

  const verifyCode = async (codeStr) => {
    setOtpLoading(true);
    setOtpError("");
    try {
      const result = await supaFetch("/rest/v1/rpc/verify_otp", {
        method: "POST",
        body: JSON.stringify({ p_email: form.email.trim().toLowerCase(), p_code: codeStr }),
      });
      if (result.status === "ok") {
        await finalizeAccountCreation();
      } else if (result.status === "wrong") {
        const n = result.attempts_left;
        setOtpError(`Code incorrect, veuillez ressaisir. Il vous reste ${n} tentative${n > 1 ? "s" : ""}.`);
        setOtp(["", "", "", ""]);
        setRegenDisabled(true);
        if (timerRef.current) clearInterval(timerRef.current);
        otpRefs[0].current?.focus();
      } else if (result.status === "locked") {
        setOtpError("Trop de tentatives incorrectes. Cliquez sur « Générer un code » pour recevoir un nouveau code.");
        setOtp(["", "", "", ""]);
        setRegenDisabled(false);
        if (timerRef.current) clearInterval(timerRef.current);
      } else {
        setOtpError("Ce code a expiré. Cliquez sur « Générer un code » pour en recevoir un nouveau.");
        setOtp(["", "", "", ""]);
        setRegenDisabled(false);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    } catch (err) {
      setOtpError("Erreur de vérification. Réessayez.");
    }
    setOtpLoading(false);
  };

  const handleOtpChange = (next) => {
    setOtp(next);
    if (next.every((d) => d !== "")) verifyCode(next.join(""));
  };

  if (step === "confirmLink") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--text)", padding: "32px 16px 60px", fontFamily: "'IBM Plex Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "var(--bg-page)", width: "100%", maxWidth: 400, padding: "34px 28px", borderRadius: 6, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#C9962C", marginBottom: 14 }}>
            <Mail size={20} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {t("confirmezAdresse")}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-strong)", lineHeight: 1.6, margin: "0 0 6px" }}>
            {t("emailConfirmationEnvoye")}
          </p>
          <p style={{ fontSize: 14, color: "var(--text)", fontWeight: 700, margin: "0 0 16px" }}>{form.email}</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6, margin: "0 0 22px" }}>
            {t("cliquezLienActiver")}
          </p>
          <button type="button" onClick={onBack} style={{ ...primaryBtn, width: "100%", justifyContent: "center" }}>
            {t("retourConnexion")}
          </button>
        </div>
      </div>
    );
  }

  if (step === "otp") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--text)", padding: "32px 16px 60px", fontFamily: "'IBM Plex Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "var(--bg-page)", width: "100%", maxWidth: 400, padding: "30px 26px", borderRadius: 6, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#C9962C", marginBottom: 10 }}>
            <Mail size={18} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              {t("verificationTitre")}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "var(--text-strong)", lineHeight: 1.5, margin: "0 0 4px" }}>
            {t("codeEnvoyeA")}
          </p>
          <p style={{ fontSize: 14, color: "var(--text)", fontWeight: 700, margin: "0 0 10px" }}>{form.email}</p>
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: 0 }}>{t("veuillezSaisirCode")}</p>

          {!showRetryFinalize && (
            <OtpBoxes value={otp} onChange={handleOtpChange} refs={otpRefs} disabled={otpLoading} />
          )}

          {otpError && (
            <div style={{ color: "#A8542E", fontSize: 12.5, marginBottom: 14 }}>{otpError}</div>
          )}
          {otpLoading && (
            <div style={{ color: "var(--text-muted)", fontSize: 12.5, marginBottom: 14 }}>{showRetryFinalize ? t("nouvelleTentative") : t("verification")}</div>
          )}

          {showRetryFinalize ? (
            <button
              type="button"
              onClick={finalizeAccountCreation}
              disabled={otpLoading}
              style={{ ...primaryBtn, width: "100%", justifyContent: "center", opacity: otpLoading ? 0.6 : 1 }}
            >
              {otpLoading ? t("nouvelleTentative") : t("reessayerBtn")}
            </button>
          ) : (
            <button
              type="button"
              onClick={requestCode}
              disabled={regenDisabled}
              style={{ ...ghostBtn, width: "100%", justifyContent: "center", opacity: regenDisabled ? 0.5 : 1 }}
            >
              {regenDisabled ? `${t("genererCode")} (${countdown}s)` : t("genererCode")}
            </button>
          )}

          <button
            type="button"
            onClick={() => { setStep("form"); setShowRetryFinalize(false); if (timerRef.current) clearInterval(timerRef.current); }}
            style={{ width: "100%", marginTop: 14, background: "none", border: "none", color: "var(--text-muted)", fontSize: 12.5, cursor: "pointer" }}
          >
            ← {t("revenirFormulaire")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--text)", padding: "32px 16px 60px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <div style={{ background: "var(--bg-page)", width: "100%", maxWidth: 460, margin: "0 auto", padding: "30px 26px", borderRadius: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#C9962C", marginBottom: 4 }}>
          <Stamp size={18} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {t("nouveauCompteInspecteur")}
          </span>
        </div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "var(--text)", margin: "6px 0 22px" }}>
          {t("creerUnCompteTitre")}
        </h2>

        <div style={{ display: "flex", gap: 14, marginBottom: 16, alignItems: "center" }}>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 6,
              background: form.photo ? `url(${form.photo}) center/cover` : "#fff",
              border: form.photo ? "1px solid var(--border)" : "1.5px solid #A8542E",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {!form.photo && <Users size={22} color="var(--text-faint)" />}
          </div>
          <div>
            <label style={labelStyle}>{t("photoLabel")}<RequiredMark /></label>
            <input type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 12.5 }} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
          <div>
            <label style={labelStyle}>{t("nomDoc")}<RequiredMark /></label>
            <input style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>{t("prenomDoc")}</label>
            <input style={inputStyle} value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
          </div>
          <div>
            <label style={labelStyle}>{t("dateNaissanceDoc")}<RequiredMark /></label>
            <DateNaissancePicker value={form.dateNaissance} onChange={(v) => setForm({ ...form, dateNaissance: v })} />
          </div>
          <div>
            <label style={labelStyle}>{t("matriculeLabel")}<RequiredMark /></label>
            <input style={inputStyle} placeholder={t("exMatricule")} value={form.matricule} onChange={(e) => setForm({ ...form, matricule: e.target.value })} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>{t("emailLabel")}<RequiredMark /></label>
            <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
        </div>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
          <label style={labelStyle}>{t("motDePasseLabel")}<RequiredMark /></label>
          <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
          <PasswordStrengthBar password={password} />
          <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 5, lineHeight: 1.5 }}>
            {t("mdpConditions")}
          </div>

          <label style={{ ...labelStyle, marginTop: 14 }}>{t("confirmerMdpLabel")}<RequiredMark /></label>
          <PasswordInput value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>

        {formError && (
          <div style={{ color: "#A8542E", fontSize: 12.5, marginTop: 16 }}>{formError}</div>
        )}

        <button type="button" onClick={submitForm} disabled={loading} style={{ ...primaryBtn, width: "100%", marginTop: 20, justifyContent: "center", opacity: loading ? 0.6 : 1 }}>
          {loading ? t("envoiDuCode") : t("validerCreationCompte")}
        </button>
        <button
          type="button"
          onClick={onBack}
          style={{ width: "100%", marginTop: 10, background: "none", border: "none", color: "var(--text-muted)", fontSize: 12.5, cursor: "pointer" }}
        >
          ← {t("dejaUnCompte2")}
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "10px 12px",
  border: "1px solid var(--border)",
  borderRadius: 3,
  fontFamily: "'IBM Plex Sans', sans-serif",
  fontSize: 14,
  background: "#fff",
  color: "var(--text-strong)",
};

const menuRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  width: "100%",
  padding: "15px 20px",
  background: "none",
  border: "none",
  borderBottom: "1px solid var(--border)",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "'IBM Plex Sans', sans-serif",
};

const notifItemStyle = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  width: "100%",
  padding: "8px 10px",
  background: "#fff",
  border: "1px solid var(--border-light)",
  borderRadius: 4,
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "'IBM Plex Sans', sans-serif",
};

const primaryBtn = {
  background: "#C9962C",
  color: "var(--text)",
  border: "none",
  padding: "11px 20px",
  fontWeight: 600,
  fontSize: 13.5,
  borderRadius: 3,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  fontFamily: "'IBM Plex Sans', sans-serif",
  transition: "transform 0.12s ease, box-shadow 0.12s ease",
};

const ghostBtn = {
  background: "#fff",
  color: "var(--text)",
  border: "1px solid var(--border)",
  padding: "10px 16px",
  fontWeight: 500,
  fontSize: 13,
  borderRadius: 3,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 7,
  fontFamily: "'IBM Plex Sans', sans-serif",
  transition: "background 0.15s ease, border-color 0.15s ease",
};

/* ---------------------------------------------------------------
   Dashboard
--------------------------------------------------------------- */
function Dashboard({ agent, accessToken, artisans, setArtisans, exploitants, setExploitants, controles, setControles, cartes, setCartes, arrondissement, onOpenMenu, jumpTab, seuilRenouvellement }) {
  const tr = useT();
  const [tab, setTab] = useState("operateurs");
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];

  useEffect(() => {
    if (jumpTab) setTab(jumpTab);
  }, [jumpTab]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <NationalStripe />
      <div style={{ background: "var(--text)", color: "var(--bg-page)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px 20px", display: "grid", gridTemplateColumns: "40px 1fr 40px", alignItems: "center", gap: 10 }}>
          <MenuButton onClick={onOpenMenu} dark />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center" }}>
            <CommuneLogo id={current.id} size={32} />
            <div style={{ fontSize: 14, fontWeight: 600 }}>{current.commune}</div>
            <img src={LOGO_CAMEROUN} alt="Armoiries de la République du Cameroun" style={{ width: 26, height: "auto", objectFit: "contain" }} />
          </div>
          <div />
        </div>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px", display: "flex", gap: 4, overflowX: "auto" }}>
          {[
            { id: "stats", label: tr("statistiques"), icon: <BarChart3 size={14} /> },
            { id: "operateurs", label: tr("exploitantsTabLabel"), icon: <Users size={14} /> },
            { id: "controle", label: tr("ficheDeclaration"), icon: <ClipboardList size={14} /> },
            { id: "controleTechnique", label: tr("controleTechniqueTab"), icon: <ShieldCheck size={14} /> },
            { id: "cartes", label: tr("cartes"), icon: <CreditCard size={14} /> },
            { id: "qrcode", label: "QR code", icon: <QrCode size={14} /> },
            { id: "agents", label: tr("inspecteurs"), icon: <Lock size={14} /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "10px 14px",
                background: "transparent",
                border: "none",
                borderBottom: tab === t.id ? "2px solid #C9962C" : "2px solid transparent",
                color: tab === t.id ? "var(--bg-page)" : "#9AA4AD",
                fontSize: 13,
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "color 0.15s, border-color 0.2s",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 60px" }}>
        {tab === "stats" && <Statistiques artisans={artisans} exploitants={exploitants} controles={controles} seuilRenouvellement={seuilRenouvellement} />}
        {tab === "operateurs" && (
          <ExploitantsTab
            artisans={artisans}
            setArtisans={setArtisans}
            exploitants={exploitants}
            setExploitants={setExploitants}
            controles={controles}
            setControles={setControles}
            arrondissement={arrondissement}
            accessToken={accessToken}
            agent={agent}
            seuilRenouvellement={seuilRenouvellement}
          />
        )}
        {tab === "controle" && (
          <FicheDeclarationTab
            artisans={artisans}
            exploitants={exploitants}
            controles={controles}
            setControles={setControles}
            agent={agent}
            accessToken={accessToken}
            arrondissement={arrondissement}
          />
        )}
        {tab === "controleTechnique" && (
          <ControleTechniqueTab
            exploitants={exploitants}
            controles={controles}
            setControles={setControles}
            arrondissement={arrondissement}
            accessToken={accessToken}
            agent={agent}
          />
        )}
        {tab === "cartes" && <Cartes artisans={artisans} cartes={cartes} setCartes={setCartes} accessToken={accessToken} agent={agent} />}
        {tab === "qrcode" && <QrCodeTab />}
        {tab === "agents" && <Agents currentAgent={agent} accessToken={accessToken} />}
      </div>
    </div>
  );
}

/* =====================================================================================
   SECTEUR INDUSTRIEL — tableau de bord dédié (établissements classés)
===================================================================================== */
function DashboardIndustriel({ agent, accessToken, etablissements, setEtablissements, plannings, setPlannings, rapports, setRapports, arrondissement, onOpenMenu }) {
  const tr = useT();
  const [tab, setTab] = useState("stats");
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-page)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <NationalStripe />
      <div style={{ background: "var(--text)", color: "var(--bg-page)" }}>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "16px 20px", display: "grid", gridTemplateColumns: "40px 1fr 40px", alignItems: "center", gap: 10 }}>
          <MenuButton onClick={onOpenMenu} dark />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, textAlign: "center" }}>
            <Settings size={28} color="#4A5D3A" />
            <div style={{ fontSize: 14, fontWeight: 600 }}>Secteur industriel — {current.commune}</div>
            <img src={LOGO_CAMEROUN} alt="Armoiries de la République du Cameroun" style={{ width: 26, height: "auto", objectFit: "contain" }} />
          </div>
          <div />
        </div>
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 20px", display: "flex", gap: 4, overflowX: "auto" }}>
          {[
            { id: "stats", label: tr("statistiques"), icon: <BarChart3 size={14} /> },
            { id: "registre", label: "Établissements classés", icon: <Users size={14} /> },
            { id: "inspection", label: "Inspection", icon: <ClipboardList size={14} /> },
            { id: "rapport", label: "Rapport d'inspection", icon: <FileText size={14} /> },
            { id: "sommesDues", label: "État des sommes dues", icon: <CreditCard size={14} /> },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "10px 14px", background: "transparent", border: "none",
                borderBottom: tab === t.id ? "2px solid #4A5D3A" : "2px solid transparent",
                color: tab === t.id ? "var(--bg-page)" : "#9AA4AD", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap",
                transition: "color 0.15s, border-color 0.2s",
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "28px 20px 60px" }}>
        {tab === "stats" && <StatistiquesIndustrielles etablissements={etablissements} />}
        {tab === "registre" && (
          <EtablissementsIndustriels
            etablissements={etablissements}
            setEtablissements={setEtablissements}
            arrondissement={arrondissement}
            accessToken={accessToken}
            agent={agent}
          />
        )}
        {tab === "inspection" && (
          <PlanningInspectionTab
            etablissements={etablissements}
            plannings={plannings}
            setPlannings={setPlannings}
            arrondissement={arrondissement}
            accessToken={accessToken}
            agent={agent}
          />
        )}
        {tab === "rapport" && (
          <RapportInspectionTab
            etablissements={etablissements}
            rapports={rapports}
            setRapports={setRapports}
            arrondissement={arrondissement}
            accessToken={accessToken}
            agent={agent}
          />
        )}
        {tab === "sommesDues" && (
          <EtatSommesDuesTab etablissements={etablissements} agent={agent} arrondissement={arrondissement} />
        )}
      </div>
    </div>
  );
}

function ModuleAVenir({ titre }) {
  return (
    <div style={{ ...cardStyle, textAlign: "center", padding: "48px 24px" }}>
      <ClipboardList size={32} color="var(--text-faint)" style={{ marginBottom: 12 }} />
      <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "var(--text)", marginBottom: 6 }}>{titre}</div>
      <div style={{ fontSize: 13, color: "var(--text-muted)" }}>Ce module arrive dans une prochaine mise à jour.</div>
    </div>
  );
}

/* Montant total dû (bâti + non bâti) pour un établissement, via le barème en cascade */
function montantDuEtablissement(e) {
  const b = calculerFraisSuperficie(e.superficieBatie, BAREME_SUPERFICIE.batie).total;
  const nb = calculerFraisSuperficie(e.superficieNonBatie, BAREME_SUPERFICIE.nonBatie).total;
  return b + nb;
}
function fmtFCFA(n) {
  return `${Math.round(n).toLocaleString("fr-FR")} FCFA`;
}

function StatistiquesIndustrielles({ etablissements }) {
  const total = etablissements.length;
  const enRegle = etablissements.filter((e) => e.statut === "en_regle").length;
  const nonRegle = total - enRegle;
  const inspectes = etablissements.filter((e) => e.inspecte).length;
  const nonInspectes = total - inspectes;
  const payes = etablissements.filter((e) => e.statutPaiement === "paye").length;
  const nonPayes = total - payes;

  const montantEstimeTotal = etablissements.reduce((s, e) => s + montantDuEtablissement(e), 0);
  const montantDejaPaye = etablissements.filter((e) => e.statutPaiement === "paye").reduce((s, e) => s + montantDuEtablissement(e), 0);
  const montantRestant = montantEstimeTotal - montantDejaPaye;

  const parSecteur = {};
  etablissements.forEach((e) => {
    const s = e.secteurActivite || "Non précisé";
    parSecteur[s] = (parSecteur[s] || 0) + 1;
  });
  const secteursTries = Object.entries(parSecteur).sort((a, b) => b[1] - a[1]);
  const maxSecteur = secteursTries.length ? secteursTries[0][1] : 0;

  return (
    <div style={{ display: "grid", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
        <StatCard icon={<Users size={20} color="#4A5D3A" />} value={total} label="Établissements enregistrés" color="#4A5D3A" />
        <StatCard icon={<ShieldCheck size={20} color="#4A5D3A" />} value={inspectes} label="Inspectés" color="#4A5D3A" />
        <StatCard icon={<AlertTriangle size={20} color="#A8542E" />} value={nonInspectes} label="Non inspectés" color="#A8542E" />
        <StatCard icon={<CheckCircle2 size={20} color="#4A5D3A" />} value={enRegle} label="En règle" color="#4A5D3A" />
        <StatCard icon={<AlertTriangle size={20} color="#A8542E" />} value={nonRegle} label="Non en règle" color="#A8542E" />
        <StatCard icon={<CreditCard size={20} color="#4A5D3A" />} value={payes} label="Ont payé les sommes dues" color="#4A5D3A" />
        <StatCard icon={<CreditCard size={20} color="#A8542E" />} value={nonPayes} label="N'ont pas payé" color="#A8542E" />
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
          Frais d'inspection et de contrôle
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
          <div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 4 }}>Montant estimé si tous payaient</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "var(--text)" }}>{fmtFCFA(montantEstimeTotal)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 4 }}>Déjà encaissé</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#4A5D3A" }}>{fmtFCFA(montantDejaPaye)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginBottom: 4 }}>Restant à recouvrer</div>
            <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "#A8542E" }}>{fmtFCFA(montantRestant)}</div>
          </div>
        </div>
      </div>

      {secteursTries.length > 0 && (
        <div style={cardStyle}>
          <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
            Répartition par secteur d'activité
          </div>
          {secteursTries.map(([s, n]) => <StatBar key={s} label={s} value={n} total={maxSecteur} color="#4A5D3A" />)}
        </div>
      )}
    </div>
  );
}

/* =====================================================================================
   Registre des établissements classés (secteur industriel)
===================================================================================== */
function EtablissementsIndustriels({ etablissements, setEtablissements, arrondissement, accessToken, agent }) {
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];
  const [q, setQ] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [profilId, setProfilId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  const emptyForm = () => ({
    nomRaisonSociale: "", statutJuridique: STATUT_JURIDIQUE_OPTIONS[0], statutJuridiqueAutre: "",
    dateCreation: "", nomExploitant: "", filiation: "", telephoneExploitant: "",
    responsableNom: "", responsableTelephone: "", niu: "", rccm: "",
    secteurActivite: SECTEUR_INDUSTRIEL_KEYS[0], natureActivite: SECTEURS_INDUSTRIELS[SECTEUR_INDUSTRIEL_KEYS[0]][0],
    siegeSocial: "", siegeAdresseType: "telephone", siegeTelephone: "", siegeEmail: "", siegeBoitePostale: "",
    arrondissementId: current.id, quartier: "",
    adresseCompleteType: "telephone", adresseTelephone: "", adresseEmail: "", adresseBoitePostale: "",
    nombreEmployes: "", volumeActivite: "", typeEquipement: "", gpsSite: "",
    superficieType: "les_deux", superficieBatie: "", superficieNonBatie: "",
    classe: CLASSE_ETABLISSEMENT_OPTIONS[0], referenceNomenclature: "",
    statut: "en_regle", inspecte: false, statutPaiement: "non_paye",
  });
  const [form, setForm] = useState(emptyForm);

  const filtered = etablissements.filter((e) => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (e.nomRaisonSociale || "").toLowerCase().includes(s) || (e.quartier || "").toLowerCase().includes(s) || (e.secteurActivite || "").toLowerCase().includes(s);
  });

  const superficieTotale = (f) => {
    const b = f.superficieType !== "nonBatie" ? Number(f.superficieBatie) || 0 : 0;
    const nb = f.superficieType !== "batie" ? Number(f.superficieNonBatie) || 0 : 0;
    return b + nb;
  };

  const validerForm = () => {
    setError("");
    if (!form.nomRaisonSociale.trim() || !form.nomExploitant.trim() || !form.responsableNom.trim()) {
      setError("Merci de renseigner au moins la raison sociale, l'exploitant et le responsable.");
      return;
    }
    const horodatage = new Date().toISOString();
    const record = {
      id: editId || uid(),
      ...form,
      statutJuridique: form.statutJuridique === "Autre" ? (form.statutJuridiqueAutre.trim() || "Autre") : form.statutJuridique,
      creePar: editId ? etablissements.find((e) => e.id === editId)?.creePar || fullName(agent) : fullName(agent),
      creeLe: editId ? etablissements.find((e) => e.id === editId)?.creeLe || horodatage : horodatage,
      modifiePar: fullName(agent),
      modifieLe: horodatage,
    };
    const next = editId ? etablissements.map((e) => (e.id === editId ? record : e)) : [...etablissements, record];
    setEtablissements(next);
    saveKey(STORAGE_KEYS.etablissements, next, accessToken);
    setForm(emptyForm());
    setShowForm(false);
    setEditId(null);
  };

  const startEdit = (e) => {
    setForm({ ...emptyForm(), ...e });
    setEditId(e.id);
    setShowForm(true);
    setProfilId(null);
  };

  const removeEtablissement = (id) => {
    if (!window.confirm("Confirmer la suppression de cet établissement ?")) return;
    const next = etablissements.filter((e) => e.id !== id);
    setEtablissements(next);
    saveKey(STORAGE_KEYS.etablissements, next, accessToken);
    if (profilId === id) setProfilId(null);
  };

  const profil = etablissements.find((e) => e.id === profilId);

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0 !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 12mm; }
        }
      `}</style>

      <div className="no-print" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18, flexWrap: "wrap", gap: 10 }}>
        <div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 20, color: "var(--text)" }}>Registre des établissements classés</div>
          <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>{filtered.length} — {current.commune}</div>
        </div>
        <button
          type="button"
          onClick={() => { setForm(emptyForm()); setEditId(null); setShowForm((s) => !s); }}
          style={primaryBtn}
        >
          {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? "Fermer" : "Ajouter un établissement"}
        </button>
      </div>

      {!showForm && (
        <div className="no-print" style={{ marginBottom: 16 }}>
          <input style={inputStyle} placeholder="Rechercher un établissement, un quartier, un secteur…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      )}

      {showForm && (
        <div className="no-print" style={{ ...cardStyle, marginBottom: 18 }}>
          {error && (
            <div style={{ background: "#F5E4DC", color: "#A8542E", fontSize: 12.5, padding: "8px 12px", borderRadius: 4, marginBottom: 14 }}>{error}</div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Nom ou raison sociale<RequiredMark /></label>
              <input style={inputStyle} value={form.nomRaisonSociale} onChange={(e) => setForm({ ...form, nomRaisonSociale: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Statut juridique</label>
              <select style={inputStyle} value={form.statutJuridique} onChange={(e) => setForm({ ...form, statutJuridique: e.target.value })}>
                {STATUT_JURIDIQUE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {form.statutJuridique === "Autre" && (
                <input style={{ ...inputStyle, marginTop: 8 }} placeholder="Précisez le statut juridique" value={form.statutJuridiqueAutre} onChange={(e) => setForm({ ...form, statutJuridiqueAutre: e.target.value })} />
              )}
            </div>
            <div>
              <label style={labelStyle}>Date de création</label>
              <DateNaissancePicker value={form.dateCreation} onChange={(v) => setForm({ ...form, dateCreation: v })} />
            </div>
            <div>
              <label style={labelStyle}>Exploitant<RequiredMark /></label>
              <input style={inputStyle} value={form.nomExploitant} onChange={(e) => setForm({ ...form, nomExploitant: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Filiation / nationalité</label>
              <input style={inputStyle} value={form.filiation} onChange={(e) => setForm({ ...form, filiation: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Téléphone de l'exploitant</label>
              <input style={inputStyle} value={form.telephoneExploitant} onChange={(e) => setForm({ ...form, telephoneExploitant: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Responsable<RequiredMark /></label>
              <input style={inputStyle} value={form.responsableNom} onChange={(e) => setForm({ ...form, responsableNom: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Téléphone du responsable</label>
              <input style={inputStyle} value={form.responsableTelephone} onChange={(e) => setForm({ ...form, responsableTelephone: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Numéro d'identifiant unique (NIU)</label>
              <input style={inputStyle} value={form.niu} onChange={(e) => setForm({ ...form, niu: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Registre de commerce (RCCM)</label>
              <input style={inputStyle} value={form.rccm} onChange={(e) => setForm({ ...form, rccm: e.target.value })} />
            </div>

            <div style={{ gridColumn: "1 / -1", borderTop: "1px dashed var(--border)", paddingTop: 12, marginTop: 4 }}>
              <label style={labelStyle}>Secteur d'activité</label>
              <select
                style={inputStyle}
                value={form.secteurActivite}
                onChange={(e) => setForm({ ...form, secteurActivite: e.target.value, natureActivite: SECTEURS_INDUSTRIELS[e.target.value][0] })}
              >
                {SECTEUR_INDUSTRIEL_KEYS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Nature de l'activité</label>
              <select style={inputStyle} value={form.natureActivite} onChange={(e) => setForm({ ...form, natureActivite: e.target.value })}>
                {SECTEURS_INDUSTRIELS[form.secteurActivite].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Classe</label>
              <select style={inputStyle} value={form.classe} onChange={(e) => setForm({ ...form, classe: e.target.value })}>
                {CLASSE_ETABLISSEMENT_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Référence(s) de la nomenclature</label>
              <input style={inputStyle} placeholder="Ex : 2243, 2253" value={form.referenceNomenclature} onChange={(e) => setForm({ ...form, referenceNomenclature: e.target.value })} />
            </div>

            <div style={{ gridColumn: "1 / -1", borderTop: "1px dashed var(--border)", paddingTop: 12, marginTop: 4 }}>
              <label style={labelStyle}>Siège social</label>
              <input style={inputStyle} value={form.siegeSocial} onChange={(e) => setForm({ ...form, siegeSocial: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Adresse du siège social</label>
              <select style={{ ...inputStyle, maxWidth: 260, marginBottom: 8 }} value={form.siegeAdresseType} onChange={(e) => setForm({ ...form, siegeAdresseType: e.target.value })}>
                <option value="telephone">Numéro de téléphone</option>
                <option value="email">Adresse mail</option>
                <option value="boitePostale">Boîte postale</option>
                <option value="tous">Les trois</option>
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                {(form.siegeAdresseType === "telephone" || form.siegeAdresseType === "tous") && (
                  <div><label style={labelStyle}>Téléphone</label><input style={inputStyle} value={form.siegeTelephone} onChange={(e) => setForm({ ...form, siegeTelephone: e.target.value })} /></div>
                )}
                {(form.siegeAdresseType === "email" || form.siegeAdresseType === "tous") && (
                  <div><label style={labelStyle}>Adresse mail</label><input style={inputStyle} value={form.siegeEmail} onChange={(e) => setForm({ ...form, siegeEmail: e.target.value })} /></div>
                )}
                {(form.siegeAdresseType === "boitePostale" || form.siegeAdresseType === "tous") && (
                  <div><label style={labelStyle}>Boîte postale</label><input style={inputStyle} value={form.siegeBoitePostale} onChange={(e) => setForm({ ...form, siegeBoitePostale: e.target.value })} /></div>
                )}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Commune</label>
              <select style={inputStyle} value={form.arrondissementId} onChange={(e) => setForm({ ...form, arrondissementId: e.target.value })}>
                {ARRONDISSEMENTS.map((a) => <option key={a.id} value={a.id}>{a.commune}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Quartier</label>
              <input style={inputStyle} value={form.quartier} onChange={(e) => setForm({ ...form, quartier: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Adresse complète (site)</label>
              <select style={{ ...inputStyle, maxWidth: 260, marginBottom: 8 }} value={form.adresseCompleteType} onChange={(e) => setForm({ ...form, adresseCompleteType: e.target.value })}>
                <option value="telephone">Numéro de téléphone</option>
                <option value="email">Adresse mail</option>
                <option value="boitePostale">Boîte postale</option>
                <option value="tous">Les trois</option>
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                {(form.adresseCompleteType === "telephone" || form.adresseCompleteType === "tous") && (
                  <div><label style={labelStyle}>Téléphone</label><input style={inputStyle} value={form.adresseTelephone} onChange={(e) => setForm({ ...form, adresseTelephone: e.target.value })} /></div>
                )}
                {(form.adresseCompleteType === "email" || form.adresseCompleteType === "tous") && (
                  <div><label style={labelStyle}>Adresse mail</label><input style={inputStyle} value={form.adresseEmail} onChange={(e) => setForm({ ...form, adresseEmail: e.target.value })} /></div>
                )}
                {(form.adresseCompleteType === "boitePostale" || form.adresseCompleteType === "tous") && (
                  <div><label style={labelStyle}>Boîte postale</label><input style={inputStyle} value={form.adresseBoitePostale} onChange={(e) => setForm({ ...form, adresseBoitePostale: e.target.value })} /></div>
                )}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Coordonnées GPS du site</label>
              <GpsField value={form.gpsSite} onChange={(v) => setForm({ ...form, gpsSite: v })} />
            </div>

            <div style={{ gridColumn: "1 / -1", borderTop: "1px dashed var(--border)", paddingTop: 12, marginTop: 4 }}>
              <label style={labelStyle}>Nombre d'employés</label>
              <input style={inputStyle} value={form.nombreEmployes} onChange={(e) => setForm({ ...form, nombreEmployes: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Volume d'activité</label>
              <input style={inputStyle} placeholder="Ex : 07 sacs / jour" value={form.volumeActivite} onChange={(e) => setForm({ ...form, volumeActivite: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Type d'équipement</label>
              <input style={inputStyle} value={form.typeEquipement} onChange={(e) => setForm({ ...form, typeEquipement: e.target.value })} />
            </div>

            <div style={{ gridColumn: "1 / -1", borderTop: "1px dashed var(--border)", paddingTop: 12, marginTop: 4 }}>
              <label style={labelStyle}>Superficie</label>
              <select style={{ ...inputStyle, maxWidth: 260, marginBottom: 8 }} value={form.superficieType} onChange={(e) => setForm({ ...form, superficieType: e.target.value })}>
                <option value="batie">Bâtie</option>
                <option value="nonBatie">Non bâtie</option>
                <option value="les_deux">Bâtie et non bâtie</option>
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                {(form.superficieType === "batie" || form.superficieType === "les_deux") && (
                  <div><label style={labelStyle}>Superficie bâtie (m²)</label><input style={inputStyle} value={form.superficieBatie} onChange={(e) => setForm({ ...form, superficieBatie: e.target.value })} /></div>
                )}
                {(form.superficieType === "nonBatie" || form.superficieType === "les_deux") && (
                  <div><label style={labelStyle}>Superficie non bâtie (m²)</label><input style={inputStyle} value={form.superficieNonBatie} onChange={(e) => setForm({ ...form, superficieNonBatie: e.target.value })} /></div>
                )}
                <div>
                  <label style={labelStyle}>Superficie totale</label>
                  <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text)", fontWeight: 700 }} value={`${superficieTotale(form).toLocaleString("fr-FR")} m²`} readOnly />
                </div>
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1", borderTop: "1px dashed var(--border)", paddingTop: 12, marginTop: 4, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              <div>
                <label style={labelStyle}>Statut</label>
                <select style={inputStyle} value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                  <option value="en_regle">En règle</option>
                  <option value="non_regle">Non en règle</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Inspecté</label>
                <select style={inputStyle} value={form.inspecte ? "oui" : "non"} onChange={(e) => setForm({ ...form, inspecte: e.target.value === "oui" })}>
                  <option value="non">Non inspecté</option>
                  <option value="oui">Inspecté</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Paiement des sommes dues</label>
                <select style={inputStyle} value={form.statutPaiement} onChange={(e) => setForm({ ...form, statutPaiement: e.target.value })}>
                  <option value="non_paye">Non payé</option>
                  <option value="paye">Payé</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
            <button type="button" onClick={validerForm} style={primaryBtn}>{editId ? "Enregistrer les modifications" : "Valider"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} style={ghostBtn}>Annuler</button>
          </div>
        </div>
      )}

      {!showForm && (
        <div style={{ display: "grid", gap: 8 }}>
          {filtered.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Aucun établissement enregistré.</div>}
          {filtered.map((e) => (
            <div key={e.id} onClick={() => setProfilId(e.id)} style={{ ...cardStyle, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text)" }}>{e.nomRaisonSociale}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{e.natureActivite} · {ARRONDISSEMENTS.find((a) => a.id === e.arrondissementId)?.commune || ""}</div>
              </div>
              <StatutBadge statut={e.statut} />
            </div>
          ))}
        </div>
      )}

      {profil && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(28,43,57,0.5)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }} className="no-print">
          <div style={{ background: "var(--bg-page)", width: "100%", maxWidth: 460, maxHeight: "90vh", overflowY: "auto", borderRadius: 6, padding: "24px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "var(--text)" }}>{profil.nomRaisonSociale}</div>
              <button type="button" onClick={() => setProfilId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><X size={20} /></button>
            </div>
            <div style={{ display: "grid", gap: 8, fontSize: 13, marginBottom: 18 }}>
              <ProfileRow label="Statut juridique" value={profil.statutJuridique || "—"} />
              <ProfileRow label="Date de création" value={formatDateFR(profil.dateCreation) || "—"} />
              <ProfileRow label="Exploitant" value={profil.nomExploitant || "—"} />
              <ProfileRow label="Filiation / nationalité" value={profil.filiation || "—"} />
              <ProfileRow label="Téléphone exploitant" value={profil.telephoneExploitant || "—"} />
              <ProfileRow label="Responsable" value={profil.responsableNom || "—"} />
              <ProfileRow label="Téléphone responsable" value={profil.responsableTelephone || "—"} />
              <ProfileRow label="NIU" value={profil.niu || "—"} />
              <ProfileRow label="RCCM" value={profil.rccm || "—"} />
              <ProfileRow label="Secteur" value={profil.secteurActivite || "—"} />
              <ProfileRow label="Nature de l'activité" value={profil.natureActivite || "—"} />
              <ProfileRow label="Classe" value={profil.classe || "—"} />
              <ProfileRow label="Référence nomenclature" value={profil.referenceNomenclature || "—"} />
              <ProfileRow label="Siège social" value={profil.siegeSocial || "—"} />
              <ProfileRow label="Commune" value={ARRONDISSEMENTS.find((a) => a.id === profil.arrondissementId)?.commune || "—"} />
              <ProfileRow label="Quartier" value={profil.quartier || "—"} />
              <ProfileRow label="Nombre d'employés" value={profil.nombreEmployes || "—"} />
              <ProfileRow label="Volume d'activité" value={profil.volumeActivite || "—"} />
              <ProfileRow label="Type d'équipement" value={profil.typeEquipement || "—"} />
              <ProfileRow label="Superficie bâtie" value={profil.superficieBatie ? `${profil.superficieBatie} m²` : "—"} />
              <ProfileRow label="Superficie non bâtie" value={profil.superficieNonBatie ? `${profil.superficieNonBatie} m²` : "—"} />
              <ProfileRow label="Frais estimés (barème)" value={fmtFCFA(montantDuEtablissement(profil))} />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> Télécharger en PDF</button>
              <button type="button" onClick={() => startEdit(profil)} style={ghostBtn}><Pencil size={14} /> Modifier</button>
              <button type="button" onClick={() => removeEtablissement(profil.id)} style={{ ...ghostBtn, color: "#A8542E", borderColor: "#E3B8A8" }}><Trash2 size={14} /> Supprimer</button>
            </div>
            <div className="print-area" style={{ marginTop: 20 }}>
              <DeclarationLetterhead />
              <div style={{ fontWeight: 700, fontSize: 12, textAlign: "center", margin: "10px 0" }}>FICHE D'IDENTIFICATION D'ÉTABLISSEMENT CLASSÉ</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <tbody>
                  <ApercuRow label="Raison sociale" value={profil.nomRaisonSociale} />
                  <ApercuRow label="Statut juridique" value={profil.statutJuridique} />
                  <ApercuRow label="Exploitant" value={profil.nomExploitant} />
                  <ApercuRow label="Responsable" value={profil.responsableNom} />
                  <ApercuRow label="NIU" value={profil.niu} />
                  <ApercuRow label="RCCM" value={profil.rccm} />
                  <ApercuRow label="Secteur" value={profil.secteurActivite} />
                  <ApercuRow label="Nature de l'activité" value={profil.natureActivite} />
                  <ApercuRow label="Classe" value={profil.classe} />
                  <ApercuRow label="Commune" value={ARRONDISSEMENTS.find((a) => a.id === profil.arrondissementId)?.commune} />
                  <ApercuRow label="Quartier" value={profil.quartier} />
                  <ApercuRow label="Superficie bâtie" value={profil.superficieBatie ? `${profil.superficieBatie} m²` : "—"} />
                  <ApercuRow label="Superficie non bâtie" value={profil.superficieNonBatie ? `${profil.superficieNonBatie} m²` : "—"} />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================================================
   État des sommes dues — calcul en cascade (bâti + non bâti) et document imprimable
===================================================================================== */
function BaremeDetailTable({ titre, detail, total }) {
  const th = { border: "1px solid #DCD1B8", padding: "4px 6px", fontSize: 9.5, background: "#F1EBDD", fontWeight: 700, textAlign: "left" };
  const td = { border: "1px solid #DCD1B8", padding: "4px 6px", fontSize: 9.5 };
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
      <tbody>
        <tr><td colSpan={3} style={{ ...th, textAlign: "center", textTransform: "uppercase" }}>{titre}</td></tr>
        <tr><td style={th}>Tranche</td><td style={th}>Portion couverte</td><td style={th}>Montant</td></tr>
        {detail.map((d, i) => (
          <tr key={i}>
            <td style={td}>{d.min} m² à {d.max === Infinity ? "∞" : `${d.max} m²`} ({d.taux} F/m²)</td>
            <td style={td}>{d.portion.toLocaleString("fr-FR")} m²</td>
            <td style={td}>{d.montant.toLocaleString("fr-FR")} F</td>
          </tr>
        ))}
        <tr><td colSpan={2} style={{ ...td, fontWeight: 700 }}>TOTAL</td><td style={{ ...td, fontWeight: 700 }}>{total.toLocaleString("fr-FR")} F</td></tr>
      </tbody>
    </table>
  );
}

function EtatSommesDuesTab({ etablissements, agent, arrondissement }) {
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];
  const [selId, setSelId] = useState("");
  const [numeroDossier, setNumeroDossier] = useState("");
  const [dateInspection, setDateInspection] = useState(new Date().toISOString().slice(0, 10));
  const [genere, setGenere] = useState(false);

  const etab = etablissements.find((e) => e.id === selId);
  const batie = etab ? calculerFraisSuperficie(etab.superficieBatie, BAREME_SUPERFICIE.batie) : null;
  const nonBatie = etab ? calculerFraisSuperficie(etab.superficieNonBatie, BAREME_SUPERFICIE.nonBatie) : null;
  const totalGeneral = (batie?.total || 0) + (nonBatie?.total || 0);

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0 !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 12mm; }
        }
      `}</style>

      <div className="no-print" style={{ ...cardStyle, marginBottom: 18 }}>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "var(--text)", marginBottom: 14 }}>État des sommes dues</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          <div>
            <label style={labelStyle}>Établissement</label>
            <select style={inputStyle} value={selId} onChange={(e) => { setSelId(e.target.value); setGenere(false); }}>
              <option value="">Choisir…</option>
              {etablissements.map((e) => <option key={e.id} value={e.id}>{e.nomRaisonSociale}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>N° de dossier</label>
            <input style={inputStyle} placeholder="Ex : NO-208/4-A" value={numeroDossier} onChange={(e) => setNumeroDossier(e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Date de l'inspection</label>
            <DateNaissancePicker value={dateInspection} onChange={setDateInspection} />
          </div>
        </div>
        {etab && (
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="button" onClick={() => setGenere(true)} style={primaryBtn}>Valider / Aperçu</button>
            {genere && <button type="button" onClick={() => window.print()} style={ghostBtn}><Printer size={14} /> Télécharger en PDF</button>}
          </div>
        )}
      </div>

      {genere && etab && (
        <div className="print-area" style={{ ...cardStyle, maxWidth: 700, margin: "0 auto", fontFamily: "'IBM Plex Sans', sans-serif" }}>
          <DeclarationLetterhead />
          <div style={{ fontWeight: 700, fontSize: 12, textAlign: "center", margin: "10px 0 4px" }}>ÉTAT DES SOMMES DUES{numeroDossier ? ` N° ${numeroDossier}` : ""}</div>
          <div style={{ fontSize: 10.5, textAlign: "center", marginBottom: 14 }}>POUR FRAIS D'INSPECTION ET DE CONTRÔLE (loi n° 98/015 du 14 juillet 1998)</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5, marginBottom: 14 }}>
            <tbody>
              <ApercuRow label="Nom ou raison sociale" value={etab.nomRaisonSociale} />
              <ApercuRow label="Localisation" value={`${etab.quartier || ""}${etab.quartier ? ", " : ""}${ARRONDISSEMENTS.find((a) => a.id === etab.arrondissementId)?.commune || current.commune}`} />
              <ApercuRow label="Activités" value={etab.natureActivite} />
              <ApercuRow label="Situation administrative" value={etab.statut === "en_regle" ? "En règle" : "Non déclaré / non en règle"} />
              <ApercuRow label="Classe" value={etab.classe} />
              <ApercuRow label="Date de l'inspection" value={formatDateFR(dateInspection)} />
            </tbody>
          </table>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <BaremeDetailTable titre={`Surface bâtie : ${etab.superficieBatie || 0} m²`} detail={batie.detail} total={batie.total} />
            <BaremeDetailTable titre={`Surface non bâtie : ${etab.superficieNonBatie || 0} m²`} detail={nonBatie.detail} total={nonBatie.total} />
          </div>

          <div style={{ textAlign: "center", fontSize: 13, fontWeight: 700, padding: "10px 0", borderTop: "2px solid #1C2B39", borderBottom: "2px solid #1C2B39" }}>
            TOTAL SOMMES DUES = {totalGeneral.toLocaleString("fr-FR")} FRS CFA
          </div>
          <div style={{ fontSize: 10.5, marginTop: 10 }}>
            Arrêté le présent état à la somme de : <b>{totalGeneral.toLocaleString("fr-FR")} francs CFA</b>
          </div>
          <div style={{ fontSize: 10.5, marginTop: 14 }}>
            Payable auprès de l'Agent Intermédiaire des Recettes de la Délégation Départementale des Mines, de l'Industrie et du Développement Technologique de la Bénoué, par mandat ou chèque bancaire certifié.
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}>
            <div style={{ textAlign: "center", fontSize: 10.5 }}>
              <div>{current.commune}, le {formatDateFR(new Date().toISOString().slice(0, 10))}</div>
              <div style={{ marginTop: 34 }}>Les inspecteurs assermentés</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================================================
   Planning des inspections conjointes (secteur industriel)
   — regroupement par quartier, 2 équipes/jour, 4 structures/équipe/jour, week-ends sautés
===================================================================================== */
const MOIS_NOMS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const SEMESTRES_OPTIONS = [
  { id: "S1", label: "1er semestre (Janvier à Juin)", moisDebut: 1, moisFin: 6 },
  { id: "S2", label: "2nd semestre (Juillet à Décembre)", moisDebut: 7, moisFin: 12 },
];

/* Regroupe les établissements par quartier, les découpe en blocs de 4 (une équipe),
   puis répartit 2 blocs par jour ouvré à partir de la date de départ (samedi/dimanche sautés). */
function genererPlanningSeances(etablissementsSelectionnes, dateDebutISO) {
  const parQuartier = {};
  etablissementsSelectionnes.forEach((e) => {
    const q = (e.quartier || "Non précisé").trim() || "Non précisé";
    if (!parQuartier[q]) parQuartier[q] = [];
    parQuartier[q].push(e);
  });
  const listeOrdonnee = [];
  Object.keys(parQuartier).forEach((q) => listeOrdonnee.push(...parQuartier[q]));

  const blocs = [];
  for (let i = 0; i < listeOrdonnee.length; i += 4) blocs.push(listeOrdonnee.slice(i, i + 4));

  const dateCourante = new Date(dateDebutISO + "T00:00:00");
  while (dateCourante.getDay() === 0 || dateCourante.getDay() === 6) dateCourante.setDate(dateCourante.getDate() + 1);
  const avancerJourOuvre = () => {
    do { dateCourante.setDate(dateCourante.getDate() + 1); } while (dateCourante.getDay() === 0 || dateCourante.getDay() === 6);
  };

  const seances = [];
  for (let i = 0; i < blocs.length; i += 2) {
    const dateISO = dateCourante.toISOString().slice(0, 10);
    [blocs[i], blocs[i + 1]].forEach((bloc, idx) => {
      if (bloc) {
        seances.push({
          id: uid(), date: dateISO, equipe: idx + 1,
          inspecteurs: ["", ""],
          administrations: { minmidt: true, minepded: true, minee: false },
          etablissementIds: bloc.map((e) => e.id),
        });
      }
    });
    avancerJourOuvre();
  }
  return seances;
}

function PlanningInspectionApercu({ planning, etablissements }) {
  const semestreLabel = SEMESTRES_OPTIONS.find((s) => s.id === planning.semestre)?.label.split(" (")[0] || planning.semestre;
  const seancesParDate = {};
  (planning.data?.seances || []).forEach((s) => {
    if (!seancesParDate[s.date]) seancesParDate[s.date] = [];
    seancesParDate[s.date].push(s);
  });
  const th = { border: "1px solid #DCD1B8", padding: "4px 6px", fontSize: 8.5, background: "#F1EBDD", fontWeight: 700, textAlign: "left" };
  const td = { border: "1px solid #DCD1B8", padding: "4px 6px", fontSize: 8.5 };

  return (
    <div className="print-area" style={{ ...cardStyle, fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <DeclarationLetterhead />
      <div style={{ fontWeight: 700, fontSize: 12, textAlign: "center", margin: "10px 0 2px" }}>
        PLANNING DES INSPECTIONS CONJOINTES DU {semestreLabel.toUpperCase()} {planning.annee}
      </div>
      <div style={{ fontSize: 10.5, textAlign: "center", marginBottom: 14 }}>MINMIDT / NORD / DD / BÉNOUÉ</div>

      {Object.entries(seancesParDate).map(([date, seancesJour]) => (
        <table key={date} style={{ width: "100%", borderCollapse: "collapse", marginBottom: 12 }}>
          <tbody>
            <tr><td colSpan={6} style={{ ...th, textAlign: "center", fontSize: 9.5 }}>{formatDateFR(date)}</td></tr>
            <tr>
              <td style={th}>N°</td><td style={th}>Désignation ou raison sociale</td><td style={th}>Nature d'activité</td>
              <td style={th}>Localisation</td><td style={th}>Adresse et téléphone</td><td style={th}>Administrations et inspecteurs</td>
            </tr>
            {seancesJour.map((s) => {
              const admins = [s.administrations.minmidt && "DD/MINMIDT", s.administrations.minepded && "DD/MINEPDED", s.administrations.minee && "DD/MINEE"].filter(Boolean);
              const structs = s.etablissementIds.map((id) => etablissements.find((e) => e.id === id)).filter(Boolean);
              return structs.map((e, i) => (
                <tr key={e.id}>
                  <td style={{ ...td, textAlign: "center" }}>{i === 0 ? s.equipe : ""}</td>
                  <td style={td}>{e.nomRaisonSociale}</td>
                  <td style={td}>{e.natureActivite}</td>
                  <td style={td}>{e.quartier}</td>
                  <td style={td}>{[e.adresseTelephone, e.siegeBoitePostale].filter(Boolean).join(" / ") || "—"}</td>
                  <td style={td}>
                    {i === 0 && (
                      <>
                        {admins.join(", ")}
                        {s.inspecteurs.filter(Boolean).length > 0 && <div style={{ marginTop: 2 }}>{s.inspecteurs.filter(Boolean).join(", ")}</div>}
                      </>
                    )}
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      ))}

      <div style={{ textAlign: "right", fontSize: 10.5, marginTop: 20 }}>Fait à Garoua, le {formatDateFR(new Date().toISOString().slice(0, 10))}</div>
    </div>
  );
}

const DOCUMENTS_A_FOURNIR_INSPECTION = [
  "Une copie du récépissé de la déclaration ou autorisation d'implantation et d'exploitation de l'établissement classé délivré par le ministre en charge des établissements classés.",
  "Une copie du plan d'urgence (PU) réalisé conformément à la réglementation en vigueur.",
  "Une copie du dernier rapport de vérification des extincteurs assorti des certificats de visites dûment signés par l'inspecteur assermenté.",
  "Le registre de consignation des incidents et accidents.",
  "Une copie du rapport de la dernière simulation d'incident, d'accident et d'évacuation.",
  "Le registre de consignation des incidents et accidents.",
  "Une copie des certificats de visite et/ou d'épreuve des équipements sous pression et de levage.",
  "Une copie de l'attestation ou certificat de conformité environnementale.",
  "Le permis environnemental.",
  "Le rapport de mise en œuvre du PGES (Plan de Gestion Environnemental et Social).",
  "Les manifestes de traçabilité des déchets.",
  "Le registre de consignation des déchets.",
  "Le résultat des analyses des effluents liquides et gazeux.",
  "Une copie de la quittance de paiement des sommes dues de la dernière inspection.",
  "Certificats de conformité de produits / de l'établissement obtenus.",
];

function DocumentsAFournirApercu() {
  return (
    <div className="print-area" style={{ ...cardStyle, maxWidth: 700, margin: "0 auto", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <DeclarationLetterhead />
      <div style={{ fontWeight: 700, fontSize: 12, textAlign: "center", textDecoration: "underline", margin: "16px 0" }}>
        DOCUMENTS À PRÉSENTER LORS DE L'INSPECTION
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
        <tbody>
          {DOCUMENTS_A_FOURNIR_INSPECTION.map((txt, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #DCD1B8", padding: "6px 8px", width: 26, textAlign: "center", fontWeight: 700 }}>{i + 1}</td>
              <td style={{ border: "1px solid #DCD1B8", padding: "6px 8px" }}>{txt}</td>
              <td style={{ border: "1px solid #DCD1B8", padding: "6px 8px", width: 60 }}></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PlanningInspectionTab({ etablissements, plannings, setPlannings, arrondissement, accessToken, agent }) {
  const [showDocuments, setShowDocuments] = useState(false);
  const anneeActuelle = new Date().getFullYear();
  const [annee, setAnnee] = useState(anneeActuelle);
  const [semestre, setSemestre] = useState("S1");
  const semestreDef = SEMESTRES_OPTIONS.find((s) => s.id === semestre);
  const [jourDebut, setJourDebut] = useState(1);
  const [moisDebut, setMoisDebut] = useState(semestreDef.moisDebut);
  const [selection, setSelection] = useState(() => new Set(etablissements.map((e) => e.id)));
  const [planningCourant, setPlanningCourant] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [wizStep, setWizStep] = useState("config");

  const dateDebutISO = `${annee}-${String(moisDebut).padStart(2, "0")}-${String(jourDebut).padStart(2, "0")}`;

  const toggleSelection = (id) => setSelection((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const genererPlanning = () => {
    const etabs = etablissements.filter((e) => selection.has(e.id));
    if (etabs.length === 0) return;
    const seances = genererPlanningSeances(etabs, dateDebutISO);
    setPlanningCourant({
      id: editingId || uid(),
      annee, semestre, dateDebut: dateDebutISO,
      data: { seances },
    });
    setWizStep("resultat");
  };

  const setSeance = (id, patch) => {
    setPlanningCourant((p) => ({ ...p, data: { ...p.data, seances: p.data.seances.map((s) => (s.id === id ? { ...s, ...patch } : s)) } }));
  };
  const setInspecteur = (seanceId, idx, val) => {
    setPlanningCourant((p) => ({
      ...p,
      data: { ...p.data, seances: p.data.seances.map((s) => (s.id === seanceId ? { ...s, inspecteurs: s.inspecteurs.map((v, i) => (i === idx ? val : v)) } : s)) },
    }));
  };

  const validerPlanning = () => {
    if (!planningCourant) return;
    const horodatage = new Date().toISOString();
    const record = {
      ...planningCourant,
      creePar: editingId ? plannings.find((p) => p.id === editingId)?.creePar || fullName(agent) : fullName(agent),
      creeLe: editingId ? plannings.find((p) => p.id === editingId)?.creeLe || horodatage : horodatage,
      modifiePar: fullName(agent),
      modifieLe: horodatage,
    };
    const next = editingId ? plannings.map((p) => (p.id === editingId ? record : p)) : [...plannings, record];
    setPlannings(next);
    saveKey(STORAGE_KEYS.plannings, next, accessToken);
    setWizStep("apercu");
  };

  const startEdit = (p) => {
    setAnnee(p.annee);
    setSemestre(p.semestre);
    setPlanningCourant(p);
    setEditingId(p.id);
    setWizStep("resultat");
  };

  const removePlanning = (id) => {
    if (!window.confirm("Confirmer la suppression de ce planning ?")) return;
    const next = plannings.filter((p) => p.id !== id);
    setPlannings(next);
    saveKey(STORAGE_KEYS.plannings, next, accessToken);
    if (planningCourant?.id === id) { setPlanningCourant(null); setWizStep("config"); }
  };

  const recommencer = () => {
    setPlanningCourant(null);
    setEditingId(null);
    setWizStep("config");
  };

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0 !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>

      <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button type="button" onClick={() => setShowDocuments((s) => !s)} style={ghostBtn}>
          <FileText size={14} /> {showDocuments ? "Fermer" : "Documents à fournir"}
        </button>
      </div>
      {showDocuments && (
        <div className="no-print" style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
            <button type="button" onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> Télécharger en PDF</button>
          </div>
        </div>
      )}
      {showDocuments && <DocumentsAFournirApercu />}

      {!showDocuments && wizStep === "config" && (
        <div className="no-print" style={{ ...cardStyle, marginBottom: 18 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "var(--text)", marginBottom: 14 }}>Planning des inspections conjointes</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Année</label>
              <input type="number" style={inputStyle} value={annee} onChange={(e) => setAnnee(Number(e.target.value))} />
            </div>
            <div>
              <label style={labelStyle}>Semestre</label>
              <select style={inputStyle} value={semestre} onChange={(e) => { setSemestre(e.target.value); setMoisDebut(SEMESTRES_OPTIONS.find((s) => s.id === e.target.value).moisDebut); }}>
                {SEMESTRES_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Jour de départ</label>
              <select style={inputStyle} value={jourDebut} onChange={(e) => setJourDebut(Number(e.target.value))}>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((j) => <option key={j} value={j}>{j}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Mois de départ</label>
              <select style={inputStyle} value={moisDebut} onChange={(e) => setMoisDebut(Number(e.target.value))}>
                {Array.from({ length: semestreDef.moisFin - semestreDef.moisDebut + 1 }, (_, i) => semestreDef.moisDebut + i).map((m) => (
                  <option key={m} value={m}>{MOIS_NOMS[m - 1]}</option>
                ))}
              </select>
            </div>
          </div>

          <label style={labelStyle}>Établissements à inclure ({selection.size} / {etablissements.length})</label>
          <div style={{ maxHeight: 260, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 4, padding: 10, display: "grid", gap: 4 }}>
            {etablissements.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Aucun établissement enregistré — allez d'abord au registre.</div>}
            {etablissements.map((e) => (
              <label key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer" }}>
                <input type="checkbox" checked={selection.has(e.id)} onChange={() => toggleSelection(e.id)} />
                {e.nomRaisonSociale} <span style={{ color: "var(--text-faint)" }}>— {e.quartier || "quartier non précisé"}</span>
              </label>
            ))}
          </div>

          <button type="button" onClick={genererPlanning} style={{ ...primaryBtn, marginTop: 16 }} disabled={selection.size === 0}>
            Faire un planning d'inspection
          </button>
        </div>
      )}

      {!showDocuments && wizStep === "resultat" && planningCourant && (
        <div className="no-print" style={{ display: "grid", gap: 14 }}>
          {Object.entries(
            planningCourant.data.seances.reduce((acc, s) => { (acc[s.date] = acc[s.date] || []).push(s); return acc; }, {})
          ).map(([date, seancesJour]) => (
            <div key={date} style={cardStyle}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", fontFamily: "'IBM Plex Mono', monospace" }}>
                  {formatDateFR(date)}
                </span>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => seancesJour.forEach((s) => setSeance(s.id, { date: e.target.value }))}
                  style={{ ...inputStyle, maxWidth: 160, padding: "4px 8px", fontSize: 12 }}
                />
              </div>
              {seancesJour.map((s) => {
                const structs = s.etablissementIds.map((id) => etablissements.find((e) => e.id === id)).filter(Boolean);
                return (
                  <div key={s.id} style={{ border: "1px solid var(--border-light)", borderRadius: 4, padding: 10, marginBottom: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 12.5, marginBottom: 6 }}>Équipe {s.equipe}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8, marginBottom: 8 }}>
                      <input style={inputStyle} placeholder="Inspecteur 1" value={s.inspecteurs[0]} onChange={(e) => setInspecteur(s.id, 0, e.target.value)} />
                      <input style={inputStyle} placeholder="Inspecteur 2" value={s.inspecteurs[1]} onChange={(e) => setInspecteur(s.id, 1, e.target.value)} />
                    </div>
                    <div style={{ display: "flex", gap: 14, marginBottom: 8 }}>
                      {["minmidt", "minepded", "minee"].map((k) => (
                        <label key={k} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, cursor: "pointer" }}>
                          <input type="checkbox" checked={s.administrations[k]} onChange={(e) => setSeance(s.id, { administrations: { ...s.administrations, [k]: e.target.checked } })} />
                          {k.toUpperCase()}
                        </label>
                      ))}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>
                      {structs.map((e) => e.nomRaisonSociale).join(" · ")}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={validerPlanning} style={primaryBtn}>Valider</button>
            <button type="button" onClick={recommencer} style={ghostBtn}>Recommencer</button>
          </div>
        </div>
      )}

      {!showDocuments && wizStep === "apercu" && planningCourant && (
        <div className="no-print" style={{ ...cardStyle, marginBottom: 18, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> Télécharger en PDF</button>
          <button type="button" onClick={() => { setEditingId(planningCourant.id); setWizStep("resultat"); }} style={ghostBtn}><Pencil size={14} /> Modifier</button>
          <button type="button" onClick={() => removePlanning(planningCourant.id)} style={{ ...ghostBtn, color: "#A8542E", borderColor: "#E3B8A8" }}><Trash2 size={14} /> Supprimer</button>
          <button type="button" onClick={recommencer} style={ghostBtn}>Nouveau planning</button>
        </div>
      )}
      {!showDocuments && wizStep === "apercu" && planningCourant && <PlanningInspectionApercu planning={planningCourant} etablissements={etablissements} />}

      <div className="no-print" style={{ marginTop: 22, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 10 }}>
          Plannings enregistrés ({plannings.length})
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {plannings.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Aucun planning enregistré.</div>}
          {plannings.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--border-light)", borderRadius: 4, padding: "8px 10px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>
                {SEMESTRES_OPTIONS.find((s) => s.id === p.semestre)?.label} {p.annee}
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => { setPlanningCourant(p); setWizStep("apercu"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><Eye size={15} /></button>
                <button type="button" onClick={() => removePlanning(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8542E" }}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* =====================================================================================
   Rapport d'inspection (secteur industriel)
===================================================================================== */
const CONTROLES_ADMIN_INDUSTRIEL_ITEMS = [
  { key: "acteAutorisation", label: "Référence de l'acte d'autorisation / déclaration d'implantation et d'exploitation" },
  { key: "permisBatir", label: "Référence du permis de bâtir ou de l'acte attestant l'occupation du sol et la construction" },
  { key: "certifPlanUrgence", label: "Référence du certificat d'approbation du plan d'urgence" },
  { key: "numeroNomCommercial", label: "Référence du numéro d'enregistrement du nom commercial" },
  { key: "numeroIndicGeo", label: "Référence du numéro d'indication géographique" },
  { key: "carte10000", label: "Conformité de la carte à l'échelle 1/10 000e approuvée par géomètre assermenté" },
  { key: "carte50000", label: "Conformité de la carte à l'échelle 1/50 000e (plan de situation)" },
  { key: "planMasse", label: "Conformité du plan d'ensemble (plan de masse) à l'échelle 1/200e" },
  { key: "certifVisiteAppareils", label: "Référence des numéros des certificats de visite / épreuve des appareils à pression et engins de levage" },
  { key: "plansEquipements", label: "Conformité des plans, coupes et documentation technique des équipements" },
  { key: "suiviPrecedent", label: "Vérification de la mise en œuvre des prescriptions d'ordre administratif du rapport précédent" },
];

const CONTROLES_TECHNIQUES_INDUSTRIEL_ITEMS = [
  { key: "extinctionAuto", label: "Moyens automatiques d'extinction" },
  { key: "alerteAlarme", label: "Installation d'alerte et d'alarme" },
  { key: "detectionIncendie", label: "Installation de détection incendie" },
  { key: "desenfumage", label: "Installation de désenfumage" },
  { key: "eclairageSecurite", label: "Éclairage de sécurité" },
  { key: "electriciteBT", label: "Installation électrique basse tension" },
  { key: "electriciteMT", label: "Installation électrique moyenne tension" },
  { key: "organisationSecurite", label: "Organisation interne de la sécurité" },
  { key: "detectionGaz", label: "Installation de détection gaz" },
  { key: "chauffage", label: "Installation de chauffage à combustible solide ou liquide" },
  { key: "enginsLevage", label: "Engins de levage et de manutention" },
  { key: "machinesOutillage", label: "Machines et outillage" },
  { key: "cuvesPression", label: "Cuves sous pression et compresseurs" },
  { key: "groupeSecours", label: "Groupe électrogène de secours" },
  { key: "echellesEchafaudages", label: "Échelles mobiles et échafaudages" },
  { key: "securitePoste", label: "Sécurité au poste de travail" },
  { key: "signaletique", label: "Signalétique" },
  { key: "batimentBoutique", label: "Bâtiment / boutique" },
  { key: "moyensExtinction", label: "Moyens d'extinction (portatifs)" },
];

const REVUE_DOCUMENTAIRE_TEXTES = [
  "Loi n° 96/12 du 5 août 1996 portant loi-cadre relative à la gestion de l'environnement.",
  "Loi n° 98/015 du 14 juillet 1998 relative aux établissements classés dangereux, insalubres ou incommodes.",
  "Décret n° 99/818/PM du 9 novembre 1999 fixant les modalités d'application de la loi relative aux établissements classés dangereux, insalubres ou incommodes.",
  "Arrêté fixant la nomenclature des établissements classés dangereux, insalubres ou incommodes.",
  "Arrêté conjoint fixant les tarifs des frais de dossiers relatifs aux établissements classés.",
];

function emptyRapportData() {
  const todayISO = new Date().toISOString().slice(0, 10);
  return {
    numeroLettre: "", dateLettre: todayISO, dossierNumero: "",
    dateInspection: todayISO,
    equipeInspection: Array.from({ length: 4 }, () => ({ nom: "", administration: "" })),
    compositionCapital: "", domicile: "", interlocuteurPrincipal: "",
    dateDerniereInspection: "", equipeDerniereInspection: "",
    descriptionSite: "",
    installationsClassees: "", installationsNonClassees: "",
    equipements: Array.from({ length: 5 }, () => ({ nom: "", utilite: "", nombreUnites: "", typeEnergie: "", dispositifsSecurite: "" })),
    produits: Array.from({ length: 5 }, () => ({ designation: "", domaine: "", typesRole: "", marque: "" })),
    dechetsBanals: "", dechetsSpeciaux: "",
    risquesDangers: "",
    inventaireAccidents: "Aucun incident et/ou accident enregistré ces six (06) derniers mois.",
    observationSecurite: "",
    controlesAdmin: emptyOuiNonMap(CONTROLES_ADMIN_INDUSTRIEL_ITEMS),
    controlesTechniques: emptyOuiNonMap(CONTROLES_TECHNIQUES_INDUSTRIEL_ITEMS),
    pointsFortsAdmin: "", pointsFortsTechnique: "",
    pointsFaiblesAdmin: "", pointsFaiblesTechnique: "",
    recommandationsAdmin: "", recommandationsTechnique: "",
  };
}

function RapportInspectionApercu({ rapport, etab }) {
  const d = rapport.data;
  const lignes = (txt) => (txt || "").split("\n").filter((l) => l.trim());
  const sec = { fontWeight: 700, fontSize: 10.5, textTransform: "uppercase", textDecoration: "underline", margin: "14px 0 8px", color: "#1C2B39" };
  const label = { fontWeight: 700, fontSize: 10, color: "#1C2B39" };
  const val = { fontSize: 10, color: "#1C2B39" };
  const thS = { border: "1px solid #DCD1B8", padding: "3px 5px", fontSize: 8.5, background: "#F1EBDD", fontWeight: 700, textAlign: "left" };
  const tdS = { border: "1px solid #DCD1B8", padding: "3px 5px", fontSize: 8.5 };

  return (
    <div className="print-area" style={{ ...cardStyle, maxWidth: 800, margin: "0 auto", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <DeclarationLetterhead />
      <div style={{ fontSize: 10, textAlign: "right", marginTop: 8 }}>
        N° {rapport.numeroLettre || "….."}/{new Date(rapport.dateLettre || Date.now()).getFullYear().toString().slice(-2)}/L/RN/CRI GAROUA<br />
        Garoua, le {formatDateFR(rapport.dateLettre)}
      </div>
      <div style={{ fontWeight: 700, fontSize: 12, textAlign: "center", margin: "16px 0" }}>RAPPORT D'INSPECTION{rapport.dossierNumero ? ` — Dossier n° ${rapport.dossierNumero}` : ""}</div>

      <div style={sec}>I. Présentation générale</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
        <tbody>
          <ApercuRow label="Date de l'inspection" value={formatDateFR(d.dateInspection)} />
          <ApercuRow label="Dénomination ou raison sociale" value={etab.nomRaisonSociale} />
          <ApercuRow label="Date de création" value={formatDateFR(etab.dateCreation)} />
          <ApercuRow label="Statut juridique" value={etab.statutJuridique} />
          <ApercuRow label="Composition du capital" value={d.compositionCapital} />
          <ApercuRow label="Siège social" value={etab.siegeSocial} />
          <ApercuRow label="Registre de commerce (RCCM)" value={etab.rccm} />
          <ApercuRow label="NIU" value={etab.niu} />
          <ApercuRow label="Exploitant" value={etab.nomExploitant} />
          <ApercuRow label="Domicile" value={d.domicile} />
          <ApercuRow label="Filiation / nationalité" value={etab.filiation} />
          <ApercuRow label="Responsable et téléphone" value={`${etab.responsableNom || ""} ${etab.responsableTelephone ? `(${etab.responsableTelephone})` : ""}`} />
          <ApercuRow label="Nature de l'activité" value={etab.natureActivite} />
          <ApercuRow label="Volume d'activité" value={etab.volumeActivite} />
          <ApercuRow label="Nombre d'employés" value={etab.nombreEmployes} />
          <ApercuRow label="Interlocuteur principal" value={d.interlocuteurPrincipal} />
          <ApercuRow label="Localisation" value={`${etab.quartier || ""}, ${ARRONDISSEMENTS.find((a) => a.id === etab.arrondissementId)?.commune || ""}, Bénoué, Région du Nord, Cameroun`} />
          <ApercuRow label="Superficie bâtie / non bâtie" value={`${etab.superficieBatie || 0} m² / ${etab.superficieNonBatie || 0} m²`} />
          <ApercuRow label="Références nomenclature / classe" value={`${etab.referenceNomenclature || "—"} / ${etab.classe || "—"}`} />
          <ApercuRow label="Date de la dernière inspection" value={formatDateFR(d.dateDerniereInspection) || "—"} />
          <ApercuRow label="Équipe de la dernière inspection" value={d.equipeDerniereInspection || "—"} />
        </tbody>
      </table>

      <div style={sec}>II. Revue documentaire</div>
      <div style={{ fontSize: 9.5 }}>
        {REVUE_DOCUMENTAIRE_TEXTES.map((t, i) => <div key={i} style={{ marginBottom: 3 }}>— {t}</div>)}
      </div>

      <div style={sec}>III. Description du site, des installations, équipements, produits et déchets</div>
      <div style={{ ...val, whiteSpace: "pre-wrap", marginBottom: 6 }}>{d.descriptionSite || "—"}</div>
      <div style={label}>Installations classées</div>
      <div style={{ ...val, marginBottom: 6 }}>{lignes(d.installationsClassees).map((l, i) => <div key={i}>— {l}</div>)}</div>
      <div style={label}>Installations non classées</div>
      <div style={{ ...val, marginBottom: 6 }}>{lignes(d.installationsNonClassees).map((l, i) => <div key={i}>— {l}</div>)}</div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
        <tbody>
          <tr><td style={thS}>Équipement</td><td style={thS}>Utilité</td><td style={thS}>Nombre d'unités</td><td style={thS}>Type d'énergie</td><td style={thS}>Dispositifs de sécurité</td></tr>
          {d.equipements.filter((r) => r.nom).map((r, i) => (
            <tr key={i}><td style={tdS}>{r.nom}</td><td style={tdS}>{r.utilite}</td><td style={tdS}>{r.nombreUnites}</td><td style={tdS}>{r.typeEnergie}</td><td style={tdS}>{r.dispositifsSecurite}</td></tr>
          ))}
        </tbody>
      </table>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 8 }}>
        <tbody>
          <tr><td style={thS}>Produit</td><td style={thS}>Domaine d'utilisation</td><td style={thS}>Type / rôle</td><td style={thS}>Marque</td></tr>
          {d.produits.filter((r) => r.designation).map((r, i) => (
            <tr key={i}><td style={tdS}>{r.designation}</td><td style={tdS}>{r.domaine}</td><td style={tdS}>{r.typesRole}</td><td style={tdS}>{r.marque}</td></tr>
          ))}
        </tbody>
      </table>
      <div style={label}>Déchets banals</div>
      <div style={{ ...val, marginBottom: 6 }}>{lignes(d.dechetsBanals).map((l, i) => <div key={i}>— {l}</div>)}</div>
      <div style={label}>Déchets spéciaux</div>
      <div style={{ ...val, marginBottom: 6 }}>{lignes(d.dechetsSpeciaux).map((l, i) => <div key={i}>— {l}</div>)}</div>

      <div style={sec}>IV. Risques et dangers</div>
      <div style={{ ...val }}>{lignes(d.risquesDangers).map((l, i) => <div key={i}>— {l}</div>)}</div>

      <div style={sec}>V. Inventaire des accidents</div>
      <div style={{ ...val, whiteSpace: "pre-wrap" }}>{d.inventaireAccidents}</div>

      <div style={sec}>VI. Contrôles administratifs</div>
      {d.observationSecurite && <div style={{ ...val, marginBottom: 6, fontStyle: "italic" }}>{d.observationSecurite}</div>}
      <ChecklistPrintTable items={CONTROLES_ADMIN_INDUSTRIEL_ITEMS} values={d.controlesAdmin} colYes="Existant" colNo="Non existant" />

      <div style={sec}>VII. Contrôles techniques</div>
      <ChecklistPrintTable items={CONTROLES_TECHNIQUES_INDUSTRIEL_ITEMS} values={d.controlesTechniques} colYes="Existant" colNo="Non existant" showObservations={false} />

      <div style={sec}>VIII. État de mise en œuvre des recommandations</div>
      <div style={label}>Points forts — administratifs</div>
      <div style={{ ...val, marginBottom: 4 }}>{lignes(d.pointsFortsAdmin).map((l, i) => <div key={i}>— {l}</div>)}</div>
      <div style={label}>Points forts — techniques</div>
      <div style={{ ...val, marginBottom: 4 }}>{lignes(d.pointsFortsTechnique).map((l, i) => <div key={i}>— {l}</div>)}</div>
      <div style={label}>Points faibles — administratifs</div>
      <div style={{ ...val, marginBottom: 4 }}>{lignes(d.pointsFaiblesAdmin).map((l, i) => <div key={i}>— {l}</div>)}</div>
      <div style={label}>Points faibles — techniques</div>
      <div style={{ ...val, marginBottom: 4 }}>{lignes(d.pointsFaiblesTechnique).map((l, i) => <div key={i}>— {l}</div>)}</div>

      <div style={sec}>IX. Recommandations et consignes</div>
      <div style={label}>Sur le plan administratif</div>
      <div style={{ ...val, marginBottom: 4 }}>{lignes(d.recommandationsAdmin).map((l, i) => <div key={i}>— {l}</div>)}</div>
      <div style={label}>Sur le plan technique</div>
      <div style={{ ...val, marginBottom: 4 }}>{lignes(d.recommandationsTechnique).map((l, i) => <div key={i}>— {l}</div>)}</div>

      <div style={sec}>Équipe d'inspection</div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr><td style={thS}>Nom</td><td style={thS}>Administration</td></tr>
          {d.equipeInspection.filter((r) => r.nom).map((r, i) => <tr key={i}><td style={tdS}>{r.nom}</td><td style={tdS}>{r.administration}</td></tr>)}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 30 }}>
        <div style={{ textAlign: "center", fontSize: 10.5 }}>
          <div>Fait à Garoua, le {formatDateFR(new Date().toISOString().slice(0, 10))}</div>
          <div style={{ marginTop: 34 }}>Le chef de mission</div>
        </div>
      </div>
    </div>
  );
}

function RapportInspectionTab({ etablissements, rapports, setRapports, arrondissement, accessToken, agent }) {
  const [selId, setSelId] = useState("");
  const [wizStep, setWizStep] = useState(etablissements.length > 0 ? "select" : "vide");
  const [data, setData] = useState(emptyRapportData());
  const [savedRecord, setSavedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const etab = etablissements.find((e) => e.id === selId);
  const fiches = rapports.filter((r) => true);

  const validerSelection = () => {
    if (!etab) return;
    setData(emptyRapportData());
    setWizStep("form");
  };

  const setEquipe = (i, field, v) => setData((d) => ({ ...d, equipeInspection: d.equipeInspection.map((r, idx) => (idx === i ? { ...r, [field]: v } : r)) }));
  const setEquipement = (i, field, v) => setData((d) => ({ ...d, equipements: d.equipements.map((r, idx) => (idx === i ? { ...r, [field]: v } : r)) }));
  const setProduit = (i, field, v) => setData((d) => ({ ...d, produits: d.produits.map((r, idx) => (idx === i ? { ...r, [field]: v } : r)) }));

  const submitRapport = () => {
    if (!etab) return;
    const maintenant = new Date().toISOString();
    const record = {
      id: editingId || uid(),
      etablissementId: etab.id,
      operateur: etab.nomRaisonSociale,
      dateInspection: data.dateInspection,
      numeroLettre: data.numeroLettre,
      dossierNumero: data.dossierNumero,
      data,
      creePar: editingId ? (savedRecord?.creePar || fullName(agent)) : fullName(agent),
      creeLe: editingId ? (savedRecord?.creeLe || maintenant) : maintenant,
      modifiePar: fullName(agent),
      modifieLe: maintenant,
    };
    const next = editingId ? rapports.map((r) => (r.id === editingId ? record : r)) : [...rapports, record];
    setRapports(next);
    saveKey(STORAGE_KEYS.rapports, next, accessToken);
    setSavedRecord(record);
    setEditingId(null);
    setWizStep("apercu");
  };

  const startEdit = () => {
    if (!savedRecord) return;
    setSelId(savedRecord.etablissementId);
    setData(savedRecord.data);
    setEditingId(savedRecord.id);
    setWizStep("form");
  };

  const removeRapport = (id) => {
    if (!window.confirm("Confirmer la suppression de ce rapport ?")) return;
    const next = rapports.filter((r) => r.id !== id);
    setRapports(next);
    saveKey(STORAGE_KEYS.rapports, next, accessToken);
    if (savedRecord?.id === id) { setSavedRecord(null); setWizStep(etablissements.length > 0 ? "select" : "vide"); }
  };

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0 !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 12mm; }
        }
      `}</style>

      {wizStep === "vide" && <div style={{ fontSize: 12.5, color: "#A8542E" }}>Aucun établissement enregistré — ajoutez d'abord une structure au registre.</div>}

      {wizStep === "select" && (
        <div className="no-print" style={{ ...cardStyle, marginBottom: 18 }}>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 18, color: "var(--text)", marginBottom: 14 }}>Nouveau rapport d'inspection</div>
          <label style={labelStyle}>Établissement</label>
          <select style={inputStyle} value={selId} onChange={(e) => setSelId(e.target.value)}>
            <option value="">Choisir…</option>
            {etablissements.map((e) => <option key={e.id} value={e.id}>{e.nomRaisonSociale}</option>)}
          </select>
          <button type="button" onClick={validerSelection} style={{ ...primaryBtn, marginTop: 16 }} disabled={!selId}>Continuer</button>
        </div>
      )}

      {wizStep === "form" && etab && (
        <div className="no-print" style={{ display: "grid", gap: 14 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>Lettre de transmission</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
              <div><label style={labelStyle}>N° de lettre</label><input style={inputStyle} value={data.numeroLettre} onChange={(e) => setData({ ...data, numeroLettre: e.target.value })} /></div>
              <div><label style={labelStyle}>Date de la lettre</label><DateNaissancePicker value={data.dateLettre} onChange={(v) => setData({ ...data, dateLettre: v })} /></div>
              <div><label style={labelStyle}>N° de dossier</label><input style={inputStyle} value={data.dossierNumero} onChange={(e) => setData({ ...data, dossierNumero: e.target.value })} /></div>
              <div><label style={labelStyle}>Date de l'inspection</label><DateNaissancePicker value={data.dateInspection} onChange={(v) => setData({ ...data, dateInspection: v })} /></div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>I. Présentation générale (complément)</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 10 }}>
              Les informations de l'établissement (raison sociale, exploitant, NIU, RCCM, adresse, superficie…) sont reprises automatiquement depuis le registre.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
              <div><label style={labelStyle}>Composition du capital</label><input style={inputStyle} value={data.compositionCapital} onChange={(e) => setData({ ...data, compositionCapital: e.target.value })} /></div>
              <div><label style={labelStyle}>Domicile de l'exploitant</label><input style={inputStyle} value={data.domicile} onChange={(e) => setData({ ...data, domicile: e.target.value })} /></div>
              <div><label style={labelStyle}>Interlocuteur principal</label><input style={inputStyle} value={data.interlocuteurPrincipal} onChange={(e) => setData({ ...data, interlocuteurPrincipal: e.target.value })} /></div>
              <div><label style={labelStyle}>Date dernière inspection</label><DateNaissancePicker value={data.dateDerniereInspection} onChange={(v) => setData({ ...data, dateDerniereInspection: v })} /></div>
              <div><label style={labelStyle}>Équipe dernière inspection</label><input style={inputStyle} value={data.equipeDerniereInspection} onChange={(e) => setData({ ...data, equipeDerniereInspection: e.target.value })} /></div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>II. Revue documentaire</div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)" }}>
              {REVUE_DOCUMENTAIRE_TEXTES.map((t, i) => <div key={i} style={{ marginBottom: 4 }}>— {t}</div>)}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>III. Description du site, installations, équipements, produits, déchets</div>
            <label style={labelStyle}>Description du site</label>
            <textarea style={{ ...inputStyle, minHeight: 70, marginBottom: 10 }} value={data.descriptionSite} onChange={(e) => setData({ ...data, descriptionSite: e.target.value })} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div>
                <label style={labelStyle}>Installations classées (une par ligne)</label>
                <textarea style={{ ...inputStyle, minHeight: 70 }} value={data.installationsClassees} onChange={(e) => setData({ ...data, installationsClassees: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Installations non classées (une par ligne)</label>
                <textarea style={{ ...inputStyle, minHeight: 70 }} value={data.installationsNonClassees} onChange={(e) => setData({ ...data, installationsNonClassees: e.target.value })} />
              </div>
            </div>
            <label style={labelStyle}>Équipements</label>
            <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
              {data.equipements.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr 0.7fr 0.9fr 1.3fr", gap: 6 }}>
                  <input style={inputStyle} placeholder="Équipement" value={r.nom} onChange={(e) => setEquipement(i, "nom", e.target.value)} />
                  <input style={inputStyle} placeholder="Utilité" value={r.utilite} onChange={(e) => setEquipement(i, "utilite", e.target.value)} />
                  <input style={inputStyle} placeholder="Nb unités" value={r.nombreUnites} onChange={(e) => setEquipement(i, "nombreUnites", e.target.value)} />
                  <input style={inputStyle} placeholder="Type d'énergie" value={r.typeEnergie} onChange={(e) => setEquipement(i, "typeEnergie", e.target.value)} />
                  <input style={inputStyle} placeholder="Dispositifs de sécurité" value={r.dispositifsSecurite} onChange={(e) => setEquipement(i, "dispositifsSecurite", e.target.value)} />
                </div>
              ))}
            </div>
            <label style={labelStyle}>Produits</label>
            <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
              {data.produits.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1.3fr 1.3fr 1fr 1fr", gap: 6 }}>
                  <input style={inputStyle} placeholder="Désignation" value={r.designation} onChange={(e) => setProduit(i, "designation", e.target.value)} />
                  <input style={inputStyle} placeholder="Domaine d'utilisation" value={r.domaine} onChange={(e) => setProduit(i, "domaine", e.target.value)} />
                  <input style={inputStyle} placeholder="Type / rôle" value={r.typesRole} onChange={(e) => setProduit(i, "typesRole", e.target.value)} />
                  <input style={inputStyle} placeholder="Marque" value={r.marque} onChange={(e) => setProduit(i, "marque", e.target.value)} />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={labelStyle}>Déchets banals (un par ligne)</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.dechetsBanals} onChange={(e) => setData({ ...data, dechetsBanals: e.target.value })} /></div>
              <div><label style={labelStyle}>Déchets spéciaux (un par ligne)</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.dechetsSpeciaux} onChange={(e) => setData({ ...data, dechetsSpeciaux: e.target.value })} /></div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>IV. Risques et dangers</div>
            <textarea style={{ ...inputStyle, minHeight: 60 }} placeholder="Un risque par ligne" value={data.risquesDangers} onChange={(e) => setData({ ...data, risquesDangers: e.target.value })} />
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>V. Inventaire des accidents</div>
            <textarea style={{ ...inputStyle, minHeight: 60 }} value={data.inventaireAccidents} onChange={(e) => setData({ ...data, inventaireAccidents: e.target.value })} />
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>VI. Contrôles administratifs</div>
            <input style={{ ...inputStyle, marginBottom: 10 }} placeholder="Observation générale (facultatif)" value={data.observationSecurite} onChange={(e) => setData({ ...data, observationSecurite: e.target.value })} />
            <ChecklistFormSection items={CONTROLES_ADMIN_INDUSTRIEL_ITEMS} values={data.controlesAdmin} onChange={(v) => setData({ ...data, controlesAdmin: v })} colYes="Existant" colNo="Non existant" />
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>VII. Contrôles techniques</div>
            <ChecklistFormSection items={CONTROLES_TECHNIQUES_INDUSTRIEL_ITEMS} values={data.controlesTechniques} onChange={(v) => setData({ ...data, controlesTechniques: v })} colYes="Existant" colNo="Non existant" />
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>VIII. État de mise en œuvre des recommandations</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={labelStyle}>Points forts — administratifs</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.pointsFortsAdmin} onChange={(e) => setData({ ...data, pointsFortsAdmin: e.target.value })} /></div>
              <div><label style={labelStyle}>Points forts — techniques</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.pointsFortsTechnique} onChange={(e) => setData({ ...data, pointsFortsTechnique: e.target.value })} /></div>
              <div><label style={labelStyle}>Points faibles — administratifs</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.pointsFaiblesAdmin} onChange={(e) => setData({ ...data, pointsFaiblesAdmin: e.target.value })} /></div>
              <div><label style={labelStyle}>Points faibles — techniques</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.pointsFaiblesTechnique} onChange={(e) => setData({ ...data, pointsFaiblesTechnique: e.target.value })} /></div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>IX. Recommandations et consignes</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={labelStyle}>Sur le plan administratif</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.recommandationsAdmin} onChange={(e) => setData({ ...data, recommandationsAdmin: e.target.value })} /></div>
              <div><label style={labelStyle}>Sur le plan technique</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.recommandationsTechnique} onChange={(e) => setData({ ...data, recommandationsTechnique: e.target.value })} /></div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 12 }}>Équipe d'inspection</div>
            <div style={{ display: "grid", gap: 8 }}>
              {data.equipeInspection.map((r, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <input style={inputStyle} placeholder="Nom" value={r.nom} onChange={(e) => setEquipe(i, "nom", e.target.value)} />
                  <input style={inputStyle} placeholder="Administration (MINMIDT / MINEPDED / MINEE)" value={r.administration} onChange={(e) => setEquipe(i, "administration", e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={submitRapport} style={primaryBtn}>Enregistrer le rapport</button>
            <button type="button" onClick={() => setWizStep("select")} style={ghostBtn}>Annuler</button>
          </div>
        </div>
      )}

      {wizStep === "apercu" && savedRecord && (
        <div className="no-print" style={{ ...cardStyle, marginBottom: 18, display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> Télécharger en PDF</button>
          <button type="button" onClick={startEdit} style={ghostBtn}><Pencil size={14} /> Modifier</button>
          <button type="button" onClick={() => removeRapport(savedRecord.id)} style={{ ...ghostBtn, color: "#A8542E", borderColor: "#E3B8A8" }}><Trash2 size={14} /> Supprimer</button>
          <button type="button" onClick={() => { setSavedRecord(null); setWizStep("select"); setSelId(""); setData(emptyRapportData()); }} style={ghostBtn}>Fermer</button>
        </div>
      )}
      {wizStep === "apercu" && savedRecord && (
        <RapportInspectionApercu rapport={savedRecord} etab={etablissements.find((e) => e.id === savedRecord.etablissementId) || {}} />
      )}

      <div className="no-print" style={{ marginTop: 22, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#4A5D3A", marginBottom: 10 }}>
          Rapports enregistrés ({fiches.length})
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {fiches.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>Aucun rapport enregistré.</div>}
          {fiches.map((r) => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--border-light)", borderRadius: 4, padding: "8px 10px" }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{r.operateur} — {formatDateFR(r.dateInspection)}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => { setSavedRecord(r); setWizStep("apercu"); }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}><Eye size={15} /></button>
                <button type="button" onClick={() => removeRapport(r.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8542E" }}><Trash2 size={15} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


function StatBar({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--text-strong)", marginBottom: 4 }}>
        <span>{label}</span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", color: "var(--text-muted)" }}>{value} ({pct}%)</span>
      </div>
      <div style={{ height: 8, background: "var(--border-light)", borderRadius: 4, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, transition: "width 0.4s ease" }} />
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, color }) {
  return (
    <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 8, background: `${color}1A`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "var(--text)", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function Statistiques({ artisans, exploitants, controles, seuilRenouvellement }) {
  const t = useT();
  const totalArtisans = artisans.length;
  const enRegle = artisans.filter((a) => a.statut === "en_regle").length;
  const nonRegle = totalArtisans - enRegle;

  const cartesExpirees = artisans.filter((a) => statutExpiration(a.dateExpiration, seuilRenouvellement) === "expiree");
  const cartesARenouveler = artisans.filter((a) => statutExpiration(a.dateExpiration, seuilRenouvellement) === "bientot");
  const cartesAlerte = [...cartesExpirees, ...cartesARenouveler].sort(
    (a, b) => joursAvantExpiration(a.dateExpiration) - joursAvantExpiration(b.dateExpiration)
  );

  const declarations = controles.filter((c) => c.type === "declaration");
  const totalDeclarations = declarations.length;
  const taxeTotaleCollectee = declarations.reduce((sum, c) => sum + (Number(c.taxeTotale) || 0), 0);

  const toGrammes = (qty, unite) => {
    const n = parseFloat(qty) || 0;
    if (unite === "kg") return n * 1000;
    if (unite === "t") return n * 1000000;
    return n;
  };
  const formatQuantite = (g) => (g >= 1000 ? `${(g / 1000).toLocaleString("fr-FR")} kg` : `${g.toLocaleString("fr-FR")} g`);

  const quantiteParCommune = {};
  declarations.forEach((c) => {
    const commune = c.commune || t("communeNonPrecisee");
    quantiteParCommune[commune] = (quantiteParCommune[commune] || 0) + toGrammes(c.quantite, c.unite);
  });
  const communesDeclarees = Object.entries(quantiteParCommune).sort((a, b) => b[1] - a[1]);
  const quantiteTotaleDeclaree = communesDeclarees.reduce((sum, [, v]) => sum + v, 0);
  const maxQuantiteCommune = communesDeclarees.length ? communesDeclarees[0][1] : 0;

  const parSite = {};
  artisans.forEach((a) => {
    const site = a.site?.trim() || t("siteNonPreciseStat");
    parSite[site] = (parSite[site] || 0) + 1;
  });
  const topSites = Object.entries(parSite).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxSite = topSites.length ? topSites[0][1] : 0;

  const declaredCommuneNames = new Set(communesDeclarees.map(([name]) => name));
  const parCommune = ARRONDISSEMENTS.map((c) => ({
    ...c,
    total: artisans.filter((a) => a.arrondissementId === c.id).length,
    enRegle: artisans.filter((a) => a.arrondissementId === c.id && a.statut === "en_regle").length,
  }))
    .filter((c) => c.total > 0 && declaredCommuneNames.has(c.commune))
    .sort((a, b) => b.total - a.total);
  const maxCommune = parCommune.length ? Math.max(...parCommune.map((c) => c.total), 1) : 1;
  const derniereDevise = declarations[0]?.devise || "XAF";

  const exploitantsEaux = exploitants.filter((e) => e.type === "eaux");
  const exploitantsCarrieres = exploitants.filter((e) => e.type === "carrieres");
  const exploitantsEnRegle = exploitants.filter((e) => e.statut === "en_regle").length;
  const exploitantsNonRegle = exploitants.length - exploitantsEnRegle;

  const declarationsExploitants = controles.filter((c) => c.type === "declaration_exploitant");
  const taxeForfaitaireCollectee = declarationsExploitants.reduce((sum, c) => sum + (Number(c.taxeTotale) || 0), 0);

  const fichesControleTechnique = controles.filter((c) => c.type === "controle_technique");
  const controleEauxCount = fichesControleTechnique.filter((c) => c.sousType === "eaux").length;
  const controleCarrieresCount = fichesControleTechnique.filter((c) => c.sousType === "carrieres").length;

  return (
    <div>
      <SectionHeader title={t("statistiques")} subtitle={t("vueEnsemble")} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 22 }}>
        <StatCard icon={<Users size={18} color="var(--text)" />} value={totalArtisans} label={t("artisansEnregistres")} color="var(--text)" />
        <StatCard icon={<CheckCircle2 size={18} color="#4A5D3A" />} value={enRegle} label={t("enRegleOpt")} color="#4A5D3A" />
        <StatCard icon={<AlertTriangle size={18} color="#A8542E" />} value={nonRegle} label={t("nonRegleOpt")} color="#A8542E" />
        <StatCard icon={<ClipboardList size={18} color="#C9962C" />} value={totalDeclarations} label={t("ficheDeclarationLabel")} color="#C9962C" />
        <StatCard icon={<CalendarClock size={18} color="#A8542E" />} value={cartesExpirees.length} label={t("carteExpireeLabel")} color="#A8542E" />
        <StatCard icon={<CalendarClock size={18} color="#8A6416" />} value={cartesARenouveler.length} label={`${t("aRenouvelerLabel")} (${seuilRenouvellement} j)`} color="#8A6416" />
        <StatCard icon={<Droplet size={18} color="#2A6F8E" />} value={exploitantsEaux.length} label={t("exploitantsEauxOpt")} color="#2A6F8E" />
        <StatCard icon={<Mountain size={18} color="#6E5A3A" />} value={exploitantsCarrieres.length} label={t("exploitantsCarrieresOpt")} color="#6E5A3A" />
        <StatCard icon={<CheckCircle2 size={18} color="#4A5D3A" />} value={exploitantsEnRegle} label={t("enRegleOpt")} color="#4A5D3A" />
        <StatCard icon={<AlertTriangle size={18} color="#A8542E" />} value={exploitantsNonRegle} label={t("nonRegleOpt")} color="#A8542E" />
        <StatCard icon={<ClipboardList size={18} color="#C9962C" />} value={declarationsExploitants.length} label={t("historiqueDeclarationsStructures")} color="#C9962C" />
        <StatCard icon={<ShieldCheck size={18} color="#4A5D3A" />} value={fichesControleTechnique.length} label={t("controleTechniqueTab")} color="#4A5D3A" />
      </div>

      <div style={{ ...cardStyle, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>{t("taxeForfaitaireParUnite")} — {t("montantTaxeTotal")}</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--text)" }}>{taxeForfaitaireCollectee.toLocaleString("fr-FR")} XAF</div>
      </div>

      <div style={{ ...cardStyle, marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>{t("controleTechniqueTab")}</div>
        <StatBar label={t("exploitantsEauxOpt")} value={controleEauxCount} total={Math.max(fichesControleTechnique.length, 1)} color="#2A6F8E" />
        <StatBar label={t("exploitantsCarrieresOpt")} value={controleCarrieresCount} total={Math.max(fichesControleTechnique.length, 1)} color="#6E5A3A" />
      </div>

      {cartesAlerte.length > 0 && (
        <div style={{ ...cardStyle, marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>{t("cartesATraiterPriorite")}</div>
          <div style={{ display: "grid", gap: 8 }}>
            {cartesAlerte.slice(0, 8).map((a) => {
              const expiree = statutExpiration(a.dateExpiration) === "expiree";
              const jours = joursAvantExpiration(a.dateExpiration);
              return (
                <div key={a.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, fontSize: 12.5 }}>
                  <span style={{ color: "var(--text)" }}>{a.prenom ? `${a.prenom} ${a.nom}` : a.nom}</span>
                  <span style={{ color: expiree ? "#A8542E" : "#8A6416", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11.5, whiteSpace: "nowrap" }}>
                    {expiree ? `${t("expireeDepuis")} ${Math.abs(jours)} ${t("jTexte")}` : `${t("dansJours")} ${jours} ${t("jTexte")}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>{t("artisansParCommune")}</div>
        {parCommune.map((c) => (
          <StatBar
            key={c.id}
            label={c.label}
            value={c.total}
            total={maxCommune}
            color="var(--text)"
          />
        ))}
        {parCommune.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{t("aucuneCommuneArtisans")}</div>}
      </div>

      <div style={{ ...cardStyle, marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>{t("conformiteRegistre")}</div>
        <StatBar label={t("artisansEnRegleLabel")} value={enRegle} total={totalArtisans} color="#4A5D3A" />
        <StatBar label={t("artisansNonRegleLabel")} value={nonRegle} total={totalArtisans} color="#A8542E" />
        {totalArtisans === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{t("aucunArtisanPourInstant")}</div>}
      </div>

      <div style={{ ...cardStyle, marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>{t("taxeTotaleDeclaree")}</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, color: "var(--text)" }}>{taxeTotaleCollectee.toLocaleString("fr-FR")} {totalDeclarations > 0 ? derniereDevise : ""}</div>
      </div>

      <div style={{ ...cardStyle, marginTop: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>{t("quantitesTotalesCommune")}</div>
        <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, color: "var(--text)", marginBottom: 14 }}>{formatQuantite(quantiteTotaleDeclaree)}</div>
        {communesDeclarees.length === 0 ? (
          <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{t("aucuneDeclarationInstant")}</div>
        ) : (
          communesDeclarees.map(([commune, qte]) => (
            <StatBar key={commune} label={`${commune} — ${formatQuantite(qte)}`} value={qte} total={maxQuantiteCommune} color="#C9962C" />
          ))
        )}
      </div>

      {topSites.length > 0 && (
        <div style={{ ...cardStyle, marginTop: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 14 }}>{t("sitesPlusActifs")}</div>
          {topSites.map(([site, count]) => (
            <StatBar key={site} label={site} value={count} total={maxSite} color="#C9962C" />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---- Operateurs / artisans registry ---- */
function formatDateFR(iso) {
  if (!iso || iso.startsWith("XXXX")) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/* Nombre de jours restants avant l'expiration d'une carte (négatif si déjà expirée, null si pas de date) */
function joursAvantExpiration(dateExpirationISO) {
  if (!dateExpirationISO) return null;
  const exp = new Date(dateExpirationISO);
  if (Number.isNaN(exp.getTime())) return null;
  const msParJour = 1000 * 60 * 60 * 24;
  const aujourdHui = new Date(new Date().toDateString());
  exp.setHours(0, 0, 0, 0);
  return Math.round((exp.getTime() - aujourdHui.getTime()) / msParJour);
}

const SEUIL_RENOUVELLEMENT_JOURS = 60;

/* "expiree" | "bientot" | null (au-delà du seuil de renouvellement, ou pas de date renseignée) */
function statutExpiration(dateExpirationISO, seuil = SEUIL_RENOUVELLEMENT_JOURS) {
  const jours = joursAvantExpiration(dateExpirationISO);
  if (jours === null) return null;
  if (jours < 0) return "expiree";
  if (jours <= seuil) return "bientot";
  return null;
}

/* Formate un horodatage ISO complet (date + heure) pour l'affichage — utilisé par la traçabilité */
function formatDateTimeFR(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const jour = String(d.getDate()).padStart(2, "0");
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const heures = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${jour}/${mois}/${d.getFullYear()} à ${heures}h${minutes}`;
}

/* Nom complet d'un inspecteur, pour l'affichage et la traçabilité */
function fullName(p) {
  if (!p) return "";
  return p.prenom ? `${p.prenom} ${p.nom}` : p.nom;
}

/* Coordonnées approximatives de Garoua, utilisées comme point de repère par défaut sur la carte */
const GPS_DEFAUT = { lat: 9.3265, lng: 13.3958 };

/* Tente d'extraire une paire "latitude, longitude" depuis un texte collé
   (coordonnées brutes, ou lien Google Maps de type .../@lat,lng,zoom ou ?q=lat,lng) */
function extractLatLng(text) {
  if (!text) return null;
  const patterns = [
    /^\s*(-?\d{1,3}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)\s*$/,
    /@(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
    /[?&](?:q|query)=(-?\d{1,3}\.\d+),(-?\d{1,3}\.\d+)/,
  ];
  for (const re of patterns) {
    const m = text.match(re);
    if (m) {
      const lat = parseFloat(m[1]);
      const lng = parseFloat(m[2]);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) return { lat, lng };
    }
  }
  return null;
}

function formatLatLng({ lat, lng }) {
  return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
}

/* Ouvre Google Maps dans un nouvel onglet, centré sur la position existante,
   la position actuelle de l'inspecteur, ou à défaut Garoua */
function openGoogleMaps(currentValue) {
  const parsed = extractLatLng(currentValue);
  const goTo = ({ lat, lng }) => {
    window.open(`https://www.google.com/maps/@${lat},${lng},17z`, "_blank", "noopener");
  };
  if (parsed) {
    goTo(parsed);
    return;
  }
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => goTo({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => goTo(GPS_DEFAUT)
    );
  } else {
    goTo(GPS_DEFAUT);
  }
}

/* Champ de saisie des coordonnées GPS : géolocalisation immédiate, ouverture de Google Maps
   pour pointer précisément le site, et reconnaissance automatique d'un lien collé */
function GpsField({ value, onChange }) {
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const raw = e.target.value;
    const parsed = extractLatLng(raw);
    onChange(parsed ? formatLatLng(parsed) : raw);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setError("La géolocalisation n'est pas disponible sur cet appareil.");
      return;
    }
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => onChange(formatLatLng({ lat: pos.coords.latitude, lng: pos.coords.longitude })),
      () => setError("Impossible de récupérer la position actuelle.")
    );
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 6 }}>
        <input
          style={inputStyle}
          placeholder="Ex : 9.3265, 13.5928"
          value={value}
          onChange={handleChange}
        />
        <button
          type="button"
          title="Utiliser ma position actuelle"
          onClick={useMyLocation}
          style={{ ...ghostBtn, padding: "0 10px", flexShrink: 0 }}
        >
          <MapPin size={15} />
        </button>
        <button
          type="button"
          title="Pointer le site sur Google Maps"
          onClick={() => openGoogleMaps(value)}
          style={{ ...ghostBtn, padding: "0 10px", flexShrink: 0, whiteSpace: "nowrap" }}
        >
          <MapIcon size={15} /> Google Maps
        </button>
      </div>
      <div style={{ fontSize: 10.5, color: "var(--text-faint)", marginTop: 4, lineHeight: 1.4 }}>
        « Google Maps » ouvre la carte pour placer le repère précisément. Une fois le point choisi, copiez le lien ou les coordonnées affichées et collez-les ici — elles seront reconnues automatiquement.
      </div>
      {error && <div style={{ color: "#A8542E", fontSize: 11.5, marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function addYearsISO(iso, years) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${y + years}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

const SUBSTANCE_CATEGORIES = {
  "Pierres précieuses": ["Saphir", "Diamant", "Rubis", "Émeraude"],
  "Pierre de taille/ornementales": ["Marbre", "Granite", "Schiste"],
  "Métaux précieux": ["Or", "Argent", "Platine"],
  "Métaux de base et autres substances minérales": ["Fer", "Cuivre", "Cassitérite", "Wolframite"],
};
const SUBSTANCE_CATEGORIE_KEYS = Object.keys(SUBSTANCE_CATEGORIES);

/* Ressources exploitées selon le type d'exploitant (eaux / carrières) */
const RESSOURCES_EXPLOITANT = {
  eaux: ["Eau minérale", "Eau de source", "Eau de forage", "Eau thermale"],
  carrieres: ["Sable", "Gravier", "Pierre concassée", "Latérite", "Argile", "Calcaire", "Granite"],
};

/* Statuts juridiques proposés pour les structures (exploitants eaux / carrières) */
const STATUT_JURIDIQUE_OPTIONS = ["ÉTABLISSEMENTS (ETS)", "S.A.R.L", "S.A", "S.A.S", "S.N.C", "Autre"];
/* Options du menu déroulant « adresse complète » */
const ADRESSE_COMPLETE_OPTIONS = ["telephone", "email", "boitePostale", "tous"];

/* Catégories d'équipements et équipements spécifiques de chaque catégorie, selon le type d'exploitant */
const EQUIPEMENT_CATEGORIES_EAUX = {
  "Captage": ["Forage", "Pompe", "Crépine", "Débitmètre", "Vannes"],
  "Traitement": ["Filtres", "Chloration", "UV", "Osmose", "Cuves"],
  "Stockage": ["Réservoirs", "Cuves", "Capteurs de niveau"],
  "Conditionnement": ["Souffleuse", "Remplisseuse", "Boucheuse", "Étiqueteuse"],
  "Laboratoire": ["pH-mètre", "Conductimètre", "Turbidimètre", "Matériel microbiologique"],
  "Distribution": ["Pompes", "Tuyauteries", "Compteurs", "Vannes"],
  "Électricité": ["Tableau", "Groupe électrogène", "Mise à la terre", "Protections"],
  "Sécurité": ["Extincteurs", "EPI", "Signalisation", "Dispositifs d'urgence"],
};
const EQUIPEMENT_CATEGORIES_CARRIERES = {
  "Extraction": ["Pelle", "Excavatrice", "Bulldozer", "Tractopelle"],
  "Forage": ["Foreuse", "Compresseur", "Marteau perforateur"],
  "Abattage": ["Équipements et dispositifs autorisés de tir"],
  "Concassage": ["Concasseur à mâchoires", "Concasseur à percussion", "Concasseur à cône"],
  "Criblage": ["Crible vibrant", "Tamis", "Séparateurs"],
  "Transport": ["Camions-bennes", "Tombereaux", "Convoyeurs"],
  "Chargement": ["Chargeuse", "Pelle hydraulique"],
  "Stockage": ["Trémies", "Silos", "Aires de stockage"],
  "Pesage": ["Pont-bascule", "Balance"],
  "Arrosage": ["Camion-citerne", "Asperseurs", "Brumisateurs"],
  "Drainage": ["Caniveaux", "Fossés", "Bassins de décantation"],
  "Topographie": ["GPS", "Station totale", "Niveau"],
  "Énergie": ["Groupe électrogène", "Tableau électrique"],
  "Sécurité": ["EPI", "Extincteurs", "Signalisation"],
  "Environnement": ["Bassins", "Systèmes anti-poussière", "Équipements de réhabilitation"],
};

/* =====================================================================================
   SECTEUR INDUSTRIEL — établissements classés (nomenclature par secteur d'activité,
   d'après le planning prévisionnel des inspections conjointes MINMIDT/Bénoué)
===================================================================================== */

/* Secteurs d'activité → natures d'activité typiques rattachées (s'affichent automatiquement
   dans le formulaire dès que l'inspecteur choisit le secteur) */
const SECTEURS_INDUSTRIELS = {
  "Mélanges solides, liquides, gazeux, combustibles, corrosifs et inflammables / hydrocarbures liquides et gazeux": [
    "Réception, stockage et distribution des bouteilles de gaz GPL",
    "Centre de redistribution de gaz",
    "Transport de produit pétrolier",
    "Réception, stockage et distribution d'hydrocarbures",
    "Redistribution de gaz",
    "Station-service",
  ],
  "Aéroportuaire": ["Installations aéroportuaires"],
  "Agroalimentaire": [
    "Dépôt et distribution de boissons",
    "Dépôt de boisson",
    "Distribution des produits agroalimentaires",
    "Entrepôt de whisky en sachet",
  ],
  "Production d'eau de table ou minérale": [
    "Conditionnement de l'eau minérale",
    "Conditionnement de l'eau de table",
    "Conditionnement de l'eau minérale en sachet",
  ],
  "Bois, papier, carton, imprimerie": [
    "Papeterie, commerce général, prestations divers",
    "Imprimerie industrielle",
    "Menuiserie",
    "Scierie",
  ],
  "BTP": ["Base BTP", "BTP"],
  "Chimie, parachimie, caoutchouc et matières plastiques": [
    "Entrepôt d'intrant agricole",
    "Entrepôt produits phytosanitaires",
    "Entrepôt et vente de produits phytosanitaires",
  ],
  "Dépôts de traitement des déchets": [
    "Centre de tri et de prétraitement des déchets plastiques",
    "Assainissement",
    "Traitement des déchets ménagers et liquides",
  ],
  "Boulangeries et pâtisseries": [
    "Boulangerie",
    "Boulangerie-pâtisserie",
    "Fabrication de produits alimentaires à base de farine",
  ],
  "Agences de voyage": ["Agence de voyage et du tourisme"],
  "Divers / essai des moteurs": [
    "Visite technique automobile",
    "Mécanique",
    "Vente des pièces détachées des engins lourds",
    "Entretien des véhicules légers",
  ],
  "Quincailleries et entrepôts divers": [
    "Vente de matériaux électriques et mécaniques",
    "Vente de matériaux de construction",
    "Dépôt de carreaux",
    "Entrepôt divers produits",
    "Quincaillerie",
    "Quincaillerie générale",
    "Dépôt de ciment",
  ],
  "Blanchisserie": ["Pressing"],
};
const SECTEUR_INDUSTRIEL_KEYS = Object.keys(SECTEURS_INDUSTRIELS);

const CLASSE_ETABLISSEMENT_OPTIONS = ["1ère classe", "2ème classe"];

/* Barème officiel des frais d'inspection et de contrôle (loi n°98/015 du 14/07/1998),
   par tranche de superficie et par m², relevé sur un état des sommes dues réel.
   Le calcul est fait EN CASCADE : chaque tranche ne s'applique qu'à la portion de
   superficie qui s'y trouve, le reste étant reporté aux tranches suivantes. */
const BAREME_SUPERFICIE = {
  batie: [
    { min: 0, max: 10, taux: 1000 },
    { min: 10, max: 50, taux: 200 },
    { min: 50, max: 100, taux: 120 },
    { min: 100, max: 200, taux: 60 },
    { min: 200, max: 1000, taux: 40 },
    { min: 1000, max: Infinity, taux: 30 },
  ],
  nonBatie: [
    { min: 0, max: 10, taux: 500 },
    { min: 10, max: 50, taux: 100 },
    { min: 50, max: 100, taux: 60 },
    { min: 100, max: 200, taux: 30 },
    { min: 200, max: 1000, taux: 20 },
    { min: 1000, max: Infinity, taux: 15 },
  ],
};

/* Applique le barème en cascade à une superficie donnée : retourne le détail par tranche
   (portion couverte, taux, montant) et le total. */
function calculerFraisSuperficie(superficieTotale, bareme) {
  let reste = Math.max(0, Number(superficieTotale) || 0);
  const detail = [];
  let total = 0;
  for (const tranche of bareme) {
    const largeurTranche = tranche.max === Infinity ? reste : tranche.max - tranche.min;
    const portion = Math.min(reste, largeurTranche);
    const montant = portion * tranche.taux;
    detail.push({ ...tranche, portion, montant });
    total += montant;
    reste -= portion;
    if (reste <= 0) break;
  }
  return { detail, total };
}

/* Formate la sélection d'équipements { categorie: [items] } en texte lisible */
function formatEquipements(equipements) {
  if (!equipements || typeof equipements !== "object") return "";
  return Object.entries(equipements)
    .filter(([, items]) => items && items.length > 0)
    .map(([cat, items]) => `${cat} (${items.join(", ")})`)
    .join(" · ");
}

/* Sélecteur d'équipements en cascade : catégories, puis équipements spécifiques de chaque
   catégorie cochée. Plusieurs catégories et plusieurs équipements par catégorie sont sélectionnables.
   value : { [categorie]: string[] } — categories : { [nomCategorie]: string[] d'équipements } */
function EquipementSelector({ value, onChange, categories }) {
  const t = useT();
  const cats = categories || EQUIPEMENT_CATEGORIES_EAUX;
  const catKeys = Object.keys(cats);
  const selection = value || {};
  const [ouvertes, setOuvertes] = useState(() => new Set(Object.keys(selection)));

  const toggleCategorie = (cat) => {
    const estCochee = Object.prototype.hasOwnProperty.call(selection, cat);
    if (estCochee) {
      const next = { ...selection };
      delete next[cat];
      onChange(next);
      setOuvertes((s) => { const n = new Set(s); n.delete(cat); return n; });
    } else {
      onChange({ ...selection, [cat]: [] });
      setOuvertes((s) => new Set(s).add(cat));
    }
  };

  const toggleItem = (cat, item) => {
    const items = selection[cat] || [];
    const next = items.includes(item) ? items.filter((i) => i !== item) : [...items, item];
    onChange({ ...selection, [cat]: next });
  };

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 4, overflow: "hidden" }}>
      {catKeys.map((cat) => {
        const cochee = Object.prototype.hasOwnProperty.call(selection, cat);
        const estOuverte = ouvertes.has(cat) || cochee;
        const nbSel = (selection[cat] || []).length;
        return (
          <div key={cat} style={{ borderBottom: "1px solid var(--border-light)" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 10px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                color: "var(--text)",
                background: cochee ? "var(--bg-subtle)" : "transparent",
              }}
            >
              <input type="checkbox" checked={cochee} onChange={() => toggleCategorie(cat)} />
              {cat}
              {nbSel > 0 && (
                <span style={{ fontSize: 11, fontWeight: 400, color: "#C9962C", fontFamily: "'IBM Plex Mono', monospace" }}>
                  ({nbSel} {t("equipementsSelectionnesLabel")})
                </span>
              )}
            </label>
            {estOuverte && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", padding: "6px 14px 12px 30px" }}>
                {cats[cat].map((item) => (
                  <label key={item} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--text-muted)", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={(selection[cat] || []).includes(item)}
                      onChange={() => toggleItem(cat, item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function Operateurs({ artisans, setArtisans, arrondissement, accessToken, agent, seuilRenouvellement }) {
  const t = useT();
  const [showForm, setShowForm] = useState(false);
  const [q, setQ] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("tous");
  const todayISO = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    dateNaissance: "",
    lieuNaissance: "",
    site: "",
    gpsSite: "",
    cni: "",
    telephone: "",
    niu: "",
    statut: "en_regle",
    photo: "",
    substanceCategorie: "Métaux précieux",
    substance: "Or",
    dateDelivrance: todayISO,
  });
  const [error, setError] = useState("");
  const [profilArtisan, setProfilArtisan] = useState(null);
  const [showListe, setShowListe] = useState(false);

  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];

  const filtered = artisans.filter((a) => {
    const nomComplet = `${a.prenom || ""} ${a.nom}`.toLowerCase();
    const matchQ = nomComplet.includes(q.toLowerCase()) || (a.site || "").toLowerCase().includes(q.toLowerCase());
    const matchStatut = filtreStatut === "tous" || a.statut === filtreStatut;
    return matchQ && matchStatut;
  });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const addArtisan = (e) => {
    e.preventDefault();
    setError("");
    const requiredOk =
      form.nom.trim() &&
      form.dateNaissance &&
      !form.dateNaissance.startsWith("XXXX") &&
      form.cni.trim() &&
      form.dateDelivrance &&
      form.photo;
    if (!requiredOk) {
      setError(t("champsObligatoiresPhoto"));
      return;
    }
    const yearPart = form.dateDelivrance.slice(0, 4);
    const countForCommune = artisans.filter((a) => a.arrondissementId === current.id).length;
    const seq = String(countForCommune + 1).padStart(5, "0");
    const numeroCarte = `CAM${yearPart}${current.code}${seq}`;
    const dateExpiration = addYearsISO(form.dateDelivrance, 2);
    const horodatage = new Date().toISOString();

    const next = [
      ...artisans,
      {
        id: uid(),
        ...form,
        zoneProspection: "Bénoué",
        arrondissementId: current.id,
        numeroCarte,
        dateExpiration,
        creePar: fullName(agent),
        creeLe: horodatage,
        modifiePar: fullName(agent),
        modifieLe: horodatage,
      },
    ];
    setArtisans(next);
    saveKey(STORAGE_KEYS.artisans, next, accessToken);
    setForm({
      nom: "",
      prenom: "",
      dateNaissance: "",
      lieuNaissance: "",
      site: "",
      gpsSite: "",
      cni: "",
      telephone: "",
      niu: "",
      statut: "en_regle",
      photo: "",
      substanceCategorie: "Métaux précieux",
      substance: "Or",
      dateDelivrance: todayISO,
    });
    setShowForm(false);
  };

  const removeArtisan = (id) => {
    if (!window.confirm(t("supprimerArtisanConfirm"))) return;
    const next = artisans.filter((a) => a.id !== id);
    setArtisans(next);
    saveKey(STORAGE_KEYS.artisans, next, accessToken);
  };

  const exportCsv = () => {
    const header = "Numero carte;Nom;Prenom;Date naissance;Lieu naissance;CNI;Telephone;Site;GPS;Categorie substance;Substance;Zone de prospection;Statut;Date delivrance;Date expiration\n";
    const rows = artisans
      .map((a) =>
        [
          a.numeroCarte || "",
          a.nom,
          a.prenom || "",
          formatDateFR(a.dateNaissance),
          a.lieuNaissance || "",
          a.cni,
          a.telephone || "",
          a.site,
          a.gpsSite || "",
          a.substanceCategorie || "",
          a.substance || "",
          a.zoneProspection || "",
          a.statut === "en_regle" ? "En regle" : "Non en regle",
          formatDateFR(a.dateDelivrance),
          formatDateFR(a.dateExpiration),
        ].join(";")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "registre-artisans-benoue.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <SectionHeader
        title={t("registreTitre")}
        subtitle={`${artisans.length} artisan(s) enregistré(s) — commune actuelle : ${current.commune}`}
        action={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", position: "relative" }}>
            <button style={ghostBtn} onClick={() => setShowListe((s) => !s)}>
              <Users size={14} /> {t("listeArtisanBtn")}
              <ChevronRight size={14} style={{ transform: showListe ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }} />
            </button>
            <button style={primaryBtn} onClick={() => setShowForm((s) => !s)}>
              {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? t("fermer") : t("ajouterArtisanBtn")}
            </button>

            {showListe && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  width: 260,
                  maxHeight: 280,
                  overflowY: "auto",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  zIndex: 20,
                }}
              >
                {artisans.length === 0 && (
                  <div style={{ padding: 14, fontSize: 12.5, color: "var(--text-faint)" }}>{t("aucunArtisanEnregistre")}</div>
                )}
                {artisans.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => { setProfilArtisan(a); setShowListe(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 14px",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid var(--bg-page)",
                      cursor: "pointer",
                      fontSize: 13,
                      color: "var(--text)",
                      fontFamily: "'IBM Plex Sans', sans-serif",
                    }}
                  >
                    {a.prenom ? `${a.prenom} ${a.nom}` : a.nom}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />

      {showForm && (
        <div style={{ ...cardStyle, ...typeBgStyle("artisan") }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 6,
                background: form.photo ? `url(${form.photo}) center/cover` : "var(--bg-page)",
                border: form.photo ? "1px solid var(--border)" : "1.5px solid #A8542E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {!form.photo && <Users size={22} color="var(--text-faint)" />}
            </div>
            <div>
              <label style={labelStyle}>{t("photoArtisan")}<RequiredMark /></label>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 12.5, fontFamily: "'IBM Plex Sans', sans-serif" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
            <div>
              <label style={labelStyle}>{t("nomDoc")}<RequiredMark /></label>
              <input style={inputStyle} value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("prenomDoc")}</label>
              <input style={inputStyle} value={form.prenom} onChange={(e) => setForm({ ...form, prenom: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("dateNaissanceDoc")}<RequiredMark /></label>
              <DateNaissancePicker value={form.dateNaissance} onChange={(v) => setForm({ ...form, dateNaissance: v })} />
            </div>
            <div>
              <label style={labelStyle}>{t("lieuNaissanceDoc")}</label>
              <input style={inputStyle} value={form.lieuNaissance} onChange={(e) => setForm({ ...form, lieuNaissance: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("numeroCni")}<RequiredMark /></label>
              <input style={inputStyle} value={form.cni} onChange={(e) => setForm({ ...form, cni: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("telephoneDoc")}</label>
              <input style={inputStyle} value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("niuLabel")}</label>
              <input style={inputStyle} value={form.niu} onChange={(e) => setForm({ ...form, niu: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("siteExploitation")}</label>
              <input style={inputStyle} value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("coordonneesGps")}</label>
              <GpsField value={form.gpsSite} onChange={(v) => setForm({ ...form, gpsSite: v })} />
            </div>
            <div>
              <label style={labelStyle}>{t("zoneProspectionDoc")}</label>
              <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value="Bénoué" readOnly />
            </div>
            <div>
              <label style={labelStyle}>{t("typeSubstanceExploiter")}</label>
              <select
                style={inputStyle}
                value={form.substanceCategorie}
                onChange={(e) => {
                  const cat = e.target.value;
                  setForm({ ...form, substanceCategorie: cat, substance: SUBSTANCE_CATEGORIES[cat][0] });
                }}
              >
                {SUBSTANCE_CATEGORIE_KEYS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("substancePrecise")}</label>
              <select style={inputStyle} value={form.substance} onChange={(e) => setForm({ ...form, substance: e.target.value })}>
                {SUBSTANCE_CATEGORIES[form.substanceCategorie].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("statutLabel")}</label>
              <select style={inputStyle} value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                <option value="en_regle">{t("enRegleOpt")}</option>
                <option value="non_regle">{t("nonRegleOpt")}</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("dateDelivranceCarte2")}<RequiredMark /></label>
              <DateNaissancePicker value={form.dateDelivrance} onChange={(v) => setForm({ ...form, dateDelivrance: v })} />
            </div>
            <div>
              <label style={labelStyle}>{t("dateExpirationCarte2")}</label>
              <input
                style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }}
                value={form.dateDelivrance && !form.dateDelivrance.startsWith("XXXX") ? formatDateFR(addYearsISO(form.dateDelivrance, 2)) : "—"}
                readOnly
              />
            </div>
          </div>

          <div style={{ fontSize: 11, color: "var(--text-faint)", marginTop: 10 }}>
            {t("carteValableInfo")}
          </div>

          {error && <div style={{ color: "#A8542E", fontSize: 12.5, marginTop: 10 }}>{error}</div>}

          <button type="button" onClick={addArtisan} style={{ ...primaryBtn, marginTop: 16 }}>{t("enregistrer")}</button>
        </div>
      )}

      <div style={{ display: "flex", gap: 10, margin: "18px 0 14px", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 180 }}>
          <Search size={15} style={{ position: "absolute", left: 12, top: 11, color: "var(--text-faint)" }} />
          <input
            style={{ ...inputStyle, paddingLeft: 34 }}
            placeholder={t("rechercherArtisanSite")}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <select style={{ ...inputStyle, maxWidth: 170 }} value={filtreStatut} onChange={(e) => setFiltreStatut(e.target.value)}>
          <option value="tous">{t("tousStatuts")}</option>
          <option value="en_regle">{t("enRegleOpt")}</option>
          <option value="non_regle">{t("nonRegleOpt")}</option>
        </select>
        {artisans.length > 0 && (
          <button type="button" onClick={exportCsv} style={ghostBtn}>
            <Printer size={14} /> CSV
          </button>
        )}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.length === 0 && <EmptyState text={t("aucunArtisanMoment")} />}
        {filtered.map((a) => (
          <div
            key={a.id}
            onClick={() => setProfilArtisan(a)}
            style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, cursor: "pointer" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 5,
                  background: a.photo ? `url(${a.photo}) center/cover` : "var(--bg-page)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {!a.photo && <Users size={16} color="var(--text-faint)" />}
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--text)" }}>
                  {a.prenom ? `${a.prenom} ${a.nom}` : a.nom}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
                  {a.numeroCarte ? `${a.numeroCarte} · ` : ""}{a.site || t("siteNonPreciseTexte")} · CNI {a.cni || "—"}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ExpirationBadge dateExpiration={a.dateExpiration} seuil={seuilRenouvellement} />
              <StatutBadge statut={a.statut} />
              <button
                onClick={(e) => { e.stopPropagation(); removeArtisan(a.id); }}
                style={{ background: "none", border: "none", color: "#A8542E", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {profilArtisan && (
        <ArtisanProfile
          artisan={profilArtisan}
          artisans={artisans}
          setArtisans={setArtisans}
          onClose={() => setProfilArtisan(null)}
          accessToken={accessToken}
          agent={agent}
          seuilRenouvellement={seuilRenouvellement}
        />
      )}
    </div>
  );
}

function ArtisanProfile({ artisan, artisans, setArtisans, onClose, accessToken, agent, seuilRenouvellement }) {
  const t = useT();
  const commune = ARRONDISSEMENTS.find((a) => a.id === artisan.arrondissementId);
  const [mode, setMode] = useState("view"); // view | confirm | edit
  const [editForm, setEditForm] = useState({
    telephone: artisan.telephone || "",
    site: artisan.site || "",
    gpsSite: artisan.gpsSite || "",
    lieuNaissance: artisan.lieuNaissance || "",
    statut: artisan.statut,
    substanceCategorie: artisan.substanceCategorie || "Métaux précieux",
    substance: artisan.substance || "Or",
    photo: artisan.photo || "",
  });

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setEditForm((f) => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveChanges = () => {
    const patch = { ...editForm, modifiePar: fullName(agent), modifieLe: new Date().toISOString() };
    const next = artisans.map((a) => (a.id === artisan.id ? { ...a, ...patch } : a));
    setArtisans(next);
    saveKey(STORAGE_KEYS.artisans, next, accessToken);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(28,43,57,0.55)",
        zIndex: 60,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "32px 16px",
        overflowY: "auto",
      }}
      onClick={mode === "view" ? onClose : undefined}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "var(--bg-page)", width: "100%", maxWidth: 440, borderRadius: 6, overflow: "hidden", position: "relative" }}
      >
        <div style={{ background: "var(--text)", padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ color: "#C9962C", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'IBM Plex Mono', monospace" }}>
            {mode === "edit" ? t("modifierProfilTitre") : t("profilArtisanTitre")}
          </span>
          {mode !== "confirm" && (
            <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--bg-page)", cursor: "pointer" }}>
              <X size={18} />
            </button>
          )}
        </div>

        <div style={{ padding: "22px 20px" }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center", marginBottom: 18 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 8,
                background: (mode === "edit" ? editForm.photo : artisan.photo) ? `url(${mode === "edit" ? editForm.photo : artisan.photo}) center/cover` : "#fff",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {!(mode === "edit" ? editForm.photo : artisan.photo) && <Users size={24} color="var(--text-faint)" />}
            </div>
            <div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: "var(--text)" }}>
                {artisan.prenom ? `${artisan.prenom} ${artisan.nom}` : artisan.nom}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <StatutBadge statut={mode === "edit" ? editForm.statut : artisan.statut} />
                <ExpirationBadge dateExpiration={artisan.dateExpiration} seuil={seuilRenouvellement} />
              </div>
              {mode === "edit" && (
                <div style={{ marginTop: 6 }}>
                  <input type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 11.5 }} />
                </div>
              )}
            </div>
          </div>

          {mode !== "edit" ? (
            <div style={{ display: "grid", gap: 8, fontSize: 13.5, color: "var(--text-strong)" }}>
              <ProfileRow label={t("numeroCarteLabel")} value={artisan.numeroCarte || "—"} />
              <ProfileRow label={t("dateNaissanceDoc")} value={formatDateFR(artisan.dateNaissance) || "—"} />
              <ProfileRow label={t("lieuNaissanceDoc")} value={artisan.lieuNaissance || "—"} />
              <ProfileRow label={t("numeroCni")} value={artisan.cni || "—"} />
              <ProfileRow label={t("telephoneDoc")} value={artisan.telephone || "—"} />
              <ProfileRow label={t("siteExploitation")} value={artisan.site || "—"} />
              <ProfileRow
                label={t("coordonneesGps")}
                value={
                  artisan.gpsSite ? (
                    <button
                      type="button"
                      onClick={() => openGoogleMaps(artisan.gpsSite)}
                      title={t("ouvrirGoogleMaps")}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--text)", fontWeight: 600, textDecoration: "underline", textDecorationColor: "#C9962C", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "inherit" }}
                    >
                      {artisan.gpsSite}
                    </button>
                  ) : "—"
                }
              />
              <ProfileRow label={t("zoneProspectionDoc")} value={artisan.zoneProspection || "Bénoué"} />
              <ProfileRow label={t("categorieSubstanceLabel")} value={artisan.substanceCategorie || "—"} />
              <ProfileRow label={t("substanceExploiteeLabel")} value={artisan.substance || "—"} />
              <ProfileRow label={t("communeDoc")} value={commune?.commune || "—"} />
              <ProfileRow label={t("dateDelivranceDoc")} value={formatDateFR(artisan.dateDelivrance) || "—"} />
              <ProfileRow label={t("dateExpirationDoc")} value={formatDateFR(artisan.dateExpiration) || "—"} />
              <div style={{ marginTop: 6, paddingTop: 10, borderTop: "1px dashed var(--border)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
                <div>{t("creePar2")} <b style={{ color: "var(--text)" }}>{artisan.creePar || "—"}</b>{artisan.creeLe ? ` ${t("leMot")} ${formatDateTimeFR(artisan.creeLe)}` : ""}</div>
                {(artisan.modifiePar && artisan.modifieLe && artisan.modifieLe !== artisan.creeLe) && (
                  <div>{t("derniereModifPar2")} <b style={{ color: "var(--text)" }}>{artisan.modifiePar}</b> {t("leMot")} {formatDateTimeFR(artisan.modifieLe)}</div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ fontSize: 11, color: "var(--text-faint)" }}>
                {t("infosIdentiteNote")}
              </div>
              <div>
                <label style={labelStyle}>{t("lieuNaissanceDoc")}</label>
                <input style={inputStyle} value={editForm.lieuNaissance} onChange={(e) => setEditForm({ ...editForm, lieuNaissance: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>{t("telephoneDoc")}</label>
                <input style={inputStyle} value={editForm.telephone} onChange={(e) => setEditForm({ ...editForm, telephone: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>{t("siteExploitation")}</label>
                <input style={inputStyle} value={editForm.site} onChange={(e) => setEditForm({ ...editForm, site: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>{t("coordonneesGps")}</label>
                <GpsField value={editForm.gpsSite} onChange={(v) => setEditForm({ ...editForm, gpsSite: v })} />
              </div>
              <div>
                <label style={labelStyle}>{t("typeSubstanceExploiter")}</label>
                <select
                  style={inputStyle}
                  value={editForm.substanceCategorie}
                  onChange={(e) => {
                    const cat = e.target.value;
                    setEditForm({ ...editForm, substanceCategorie: cat, substance: SUBSTANCE_CATEGORIES[cat][0] });
                  }}
                >
                  {SUBSTANCE_CATEGORIE_KEYS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t("substancePrecise")}</label>
                <select style={inputStyle} value={editForm.substance} onChange={(e) => setEditForm({ ...editForm, substance: e.target.value })}>
                  {SUBSTANCE_CATEGORIES[editForm.substanceCategorie].map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t("statutLabel")}</label>
                <select style={inputStyle} value={editForm.statut} onChange={(e) => setEditForm({ ...editForm, statut: e.target.value })}>
                  <option value="en_regle">{t("enRegleOpt")}</option>
                  <option value="non_regle">{t("nonRegleOpt")}</option>
                </select>
              </div>
            </div>
          )}

          {/* Pied de page : boutons selon le mode */}
          {mode === "view" && (
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 22 }}>
              <button type="button" onClick={onClose} style={primaryBtn}>{t("enregistrer")}</button>
              <button type="button" onClick={() => setMode("confirm")} style={ghostBtn}>
                <Pencil size={14} /> {t("modifier")}
              </button>
            </div>
          )}
          {mode === "edit" && (
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 20 }}>
              <button type="button" onClick={saveChanges} style={primaryBtn}>{t("enregistrer")}</button>
            </div>
          )}
        </div>

        {/* Fenêtre de confirmation centrée */}
        {mode === "confirm" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(28,43,57,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <div style={{ background: "#fff", borderRadius: 6, padding: "22px 20px", maxWidth: 320, textAlign: "center" }}>
              <AlertTriangle size={30} color="#A8542E" style={{ marginBottom: 10 }} />
              <div style={{ color: "#A8542E", fontWeight: 700, fontSize: 14.5, lineHeight: 1.4 }}>
                {t("voulezVousModifier")}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 18, justifyContent: "center" }}>
                <button type="button" onClick={() => setMode("edit")} style={{ ...primaryBtn, minWidth: 70, justifyContent: "center" }}>{t("oui")}</button>
                <button type="button" onClick={() => setMode("view")} style={{ ...ghostBtn, minWidth: 70, justifyContent: "center" }}>{t("non")}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileRow({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--border-light)", paddingBottom: 6 }}>
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: "right" }}>{value}</span>
    </div>
  );
}

function StatutBadge({ statut }) {
  const enRegle = statut === "en_regle";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11.5,
        fontFamily: "'IBM Plex Mono', monospace",
        padding: "5px 10px",
        borderRadius: 20,
        background: enRegle ? "#EAF0E5" : "#F5E4DC",
        color: enRegle ? "#4A5D3A" : "#A8542E",
      }}
    >
      {enRegle ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
      {enRegle ? "EN RÈGLE" : "NON EN RÈGLE"}
    </span>
  );
}

/* Badge d'alerte sur l'expiration de la carte d'artisan (n'affiche rien si loin de l'échéance) */
function ExpirationBadge({ dateExpiration, seuil }) {
  const statut = statutExpiration(dateExpiration, seuil);
  if (!statut) return null;
  const jours = joursAvantExpiration(dateExpiration);
  const expiree = statut === "expiree";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 11.5,
        fontFamily: "'IBM Plex Mono', monospace",
        padding: "5px 10px",
        borderRadius: 20,
        background: expiree ? "#F5E4DC" : "#FBEFD9",
        color: expiree ? "#A8542E" : "#8A6416",
      }}
    >
      <CalendarClock size={13} />
      {expiree ? `CARTE EXPIRÉE (${Math.abs(jours)} j)` : `À RENOUVELER — ${jours} j`}
    </span>
  );
}

/* ---- Fiche de déclaration ---- */
const MOIS_NOMS = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
const TAUX_PAR_CATEGORIE = {
  "Pierres précieuses": 8,
  "Pierre de taille/ornementales": 2,
  "Métaux précieux": 5,
  "Métaux de base et autres substances minérales": 3,
};

const BENEFICIAIRES = {
  CTD: { label: "Commune (CTD)", taux: 25, compte: "421 XXXXX" },
  MINMIDT: { label: "MINMIDT", taux: 5, compte: "447 766 1005" },
  MINFI: { label: "MINFI (DGI)", taux: 5, compte: "447 106" },
  TRESOR: { label: "Trésor public", taux: 65, compte: "71 630" },
};
const DEVISES = { XAF: "XAF", USD: "Dollars (USD)", EUR: "Euro (EUR)" };

function ApercuRow({ label, value, bold }) {
  return (
    <tr style={{ borderBottom: "1px solid var(--border-light)" }}>
      <td style={{ padding: "4px 8px 4px 0", color: "var(--text-muted)", width: "50%" }}>{label}</td>
      <td style={{ padding: "4px 0", fontWeight: bold ? 700 : 600, color: "var(--text)" }}>{value}</td>
    </tr>
  );
}

/* En-tête officiel bilingue partagé par toutes les fiches imprimées (déclarations et contrôles) */
function DeclarationLetterhead() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 16 }}>
      <div style={{ textAlign: "center", fontSize: 9, fontFamily: "'IBM Plex Sans', sans-serif", color: "#1C2B39", lineHeight: 1.5, flex: 1, whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 700 }}>République du Cameroun</div>
        <div>Paix – Travail – Patrie</div>
        <div>Région du Nord</div>
        <div>Département de la Bénoué</div>
      </div>
      <img src={LOGO_CAMEROUN} alt="Armoiries du Cameroun" style={{ width: 42, height: "auto", objectFit: "contain", flexShrink: 0 }} />
      <div style={{ textAlign: "center", fontSize: 9, fontFamily: "'IBM Plex Sans', sans-serif", color: "#1C2B39", lineHeight: 1.5, flex: 1, whiteSpace: "nowrap" }}>
        <div style={{ fontWeight: 700 }}>Republic of Cameroon</div>
        <div>Peace – Work – Fatherland</div>
        <div>North Region</div>
        <div>Bénoué Division</div>
      </div>
    </div>
  );
}

function DeclarationApercu({ record: c }) {
  const t = useT();
  const devise = c.devise || "XAF";
  const fmt = (n) => `${Number(n || 0).toLocaleString("fr-FR")} ${devise}`;

  const montantCommune = (c.taxeTotale || 0) * (BENEFICIAIRES.CTD.taux / 100);
  const montantMinfi = (c.taxeTotale || 0) * (BENEFICIAIRES.MINFI.taux / 100);
  const montantMinmidt = (c.taxeTotale || 0) * (BENEFICIAIRES.MINMIDT.taux / 100);
  const montantTresor = (c.taxeTotale || 0) * (BENEFICIAIRES.TRESOR.taux / 100);

  const th = { border: "1px solid #DCD1B8", padding: "4px 5px", fontSize: 8.5, color: "#1C2B39", background: "#F1EBDD", fontWeight: 700, textAlign: "center", lineHeight: 1.3 };
  const td = { border: "1px solid #DCD1B8", padding: "4px 5px", fontSize: 8.5, color: "#1C2B39", textAlign: "center", lineHeight: 1.3 };

  return (
    <div className="print-area" style={{ ...cardStyle, marginBottom: 18, maxWidth: 800, width: "100%", margin: "0 auto 18px" }}>
      <DeclarationLetterhead />

      <div style={{ fontSize: 13, fontWeight: 700, color: "#1C2B39", marginBottom: 14, textAlign: "center" }}>{t("ficheTitre")} — {c.mois}</div>

      <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>{t("identificationExploitation")}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 16 }}>
        <tbody>
          <ApercuRow label={t("nomRaisonSociale")} value={c.operateur} />
          <ApercuRow label={t("adresseTelDoc")} value={c.adresseTel || "—"} />
          <ApercuRow label={t("numeroContribuable")} value={c.numeroContribuable || "—"} />
          <ApercuRow label={t("referenceTitreMinier")} value={c.referenceTitre || "—"} />
          <ApercuRow label={t("titreMinierDoc")} value={c.titreMinier} />
          <ApercuRow label={t("localisationSite")} value={c.localisation || "—"} />
          <ApercuRow label={t("departementDoc")} value={c.departement} />
          <ApercuRow label={t("arrondissementDoc")} value={c.arrondissement} />
          <ApercuRow label={t("communeDoc")} value={c.commune} />
        </tbody>
      </table>

      <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>{t("quantiteEtTaxe")}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, tableLayout: "fixed" }}>
        <tbody>
          <tr>
            <td style={th}>{t("designation")}</td>
            <td style={th}>{t("quantiteDeclaree")} ({c.unite})</td>
            <td style={th}>{t("tauxApplicable")} ({c.taux}%)</td>
            <td style={th}>{t("montantTaxe")}</td>
          </tr>
          <tr>
            <td style={td}>{c.substance}</td>
            <td style={td}>{c.quantite}</td>
            <td style={td}>{fmt(c.taxeUnitaire)}</td>
            <td style={{ ...td, fontWeight: 700 }}>{fmt(c.taxeTotale)}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>{t("repartition")}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, tableLayout: "fixed" }}>
        <tbody>
          <tr>
            <td style={th}>{t("beneficiaire")}</td>
            <td style={th}>{t("tauxApplicable")}</td>
            <td style={th}>{t("montant")}</td>
            <td style={th}>{t("compteAffectation")}</td>
          </tr>
          <tr>
            <td style={td}>CTD</td>
            <td style={td}>{t("communeDoc")} (25%)</td>
            <td style={td}>{fmt(montantCommune)}</td>
            <td style={td}>{BENEFICIAIRES.CTD.compte}</td>
          </tr>
          <tr>
            <td style={td} rowSpan={2}>ASCAM</td>
            <td style={td}>MINFI (5%)</td>
            <td style={td}>{fmt(montantMinfi)}</td>
            <td style={td}>{BENEFICIAIRES.MINFI.compte}</td>
          </tr>
          <tr>
            <td style={td}>MINMIDT (5%)</td>
            <td style={td}>{fmt(montantMinmidt)}</td>
            <td style={td}>{BENEFICIAIRES.MINMIDT.compte}</td>
          </tr>
          <tr>
            <td style={td}>{t("tresorPublic")}</td>
            <td style={td}>{t("tresorPublic")} (65%)</td>
            <td style={td}>{fmt(montantTresor)}</td>
            <td style={td}>{BENEFICIAIRES.TRESOR.compte}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, padding: "0 16px 10px" }}>
        <div style={{ textAlign: "center", fontSize: 11, color: "#1C2B39" }}>
          <div style={{ marginBottom: 34 }}>{t("signatureExploitant")}</div>
        </div>
        <div style={{ textAlign: "center", fontSize: 11, color: "#1C2B39" }}>
          <div style={{ marginBottom: 34 }}>{t("visaDelegue")}</div>
        </div>
      </div>

      <div className="no-print" style={{ textAlign: "center", fontSize: 11, color: "#A99B7F", marginTop: 6, lineHeight: 1.6 }}>
        {t("ficheCreeePar")} <b style={{ color: "#5B5346" }}>{c.agent || "—"}</b>{c.date ? ` ${t("leMot")} ${formatDateFR(c.date)}` : ""}
        {c.modifie && c.modifiePar && c.modifieLe && (
          <> · {t("derniereModifPar")} <b style={{ color: "#5B5346" }}>{c.modifiePar}</b> {t("leMot")} {formatDateTimeFR(c.modifieLe)}</>
        )}
      </div>
    </div>
  );
}

/* Sélecteur du type d'exploitant, à l'intérieur de l'onglet « Exploitants » */
function ExploitantsTab({
  artisans, setArtisans, exploitants, setExploitants, controles, setControles, arrondissement, accessToken, agent, seuilRenouvellement,
}) {
  const t = useT();
  const [typeExploitant, setTypeExploitant] = useState("artisan"); // artisan | eaux | carrieres
  const [menuOuvert, setMenuOuvert] = useState(false);

  const options = [
    { id: "artisan", label: t("artisanMinierOpt"), icon: <Pickaxe size={14} /> },
    { id: "eaux", label: t("exploitantsEauxOpt"), icon: <Droplet size={14} /> },
    { id: "carrieres", label: t("exploitantsCarrieresOpt"), icon: <Mountain size={14} /> },
  ];
  const current = options.find((o) => o.id === typeExploitant) || options[0];

  return (
    <div>
      <div className="no-print" style={{ position: "relative", marginBottom: 18, maxWidth: 340 }}>
        <label style={labelStyle}>{t("typeExploitantBtn")}</label>
        <button
          type="button"
          onClick={() => setMenuOuvert((s) => !s)}
          style={{ ...inputStyle, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left" }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>{current.icon} {current.label}</span>
          <ChevronRight size={14} style={{ transform: menuOuvert ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }} />
        </button>
        {menuOuvert && (
          <div
            style={{
              position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff",
              border: "1px solid var(--border)", borderRadius: 4, boxShadow: "0 8px 20px rgba(0,0,0,0.12)", zIndex: 20, overflow: "hidden",
            }}
          >
            {options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => { setTypeExploitant(o.id); setMenuOuvert(false); }}
                style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", background: o.id === typeExploitant ? "var(--bg-subtle)" : "none",
                  border: "none", borderBottom: "1px solid var(--border-light)", cursor: "pointer", fontSize: 13, color: "var(--text)", textAlign: "left",
                }}
              >
                {o.icon} {o.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {typeExploitant === "artisan" && (
        <Operateurs
          artisans={artisans}
          setArtisans={setArtisans}
          arrondissement={arrondissement}
          accessToken={accessToken}
          agent={agent}
          seuilRenouvellement={seuilRenouvellement}
        />
      )}
      {typeExploitant === "eaux" && (
        <Exploitants
          type="eaux"
          exploitants={exploitants}
          setExploitants={setExploitants}
          arrondissement={arrondissement}
          accessToken={accessToken}
          agent={agent}
        />
      )}
      {typeExploitant === "carrieres" && (
        <Exploitants
          type="carrieres"
          exploitants={exploitants}
          setExploitants={setExploitants}
          arrondissement={arrondissement}
          accessToken={accessToken}
          agent={agent}
        />
      )}
    </div>
  );
}

/* Registre générique des exploitants (eaux ou produits de carrières) */
function Exploitants({ type, exploitants, setExploitants, arrondissement, accessToken, agent }) {
  const t = useT();
  const items = exploitants.filter((e) => e.type === type);
  const ressources = RESSOURCES_EXPLOITANT[type];
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];
  const todayISO = new Date().toISOString().slice(0, 10);

  const [showForm, setShowForm] = useState(false);
  const [showListe, setShowListe] = useState(false);
  const [q, setQ] = useState("");
  const champsCommunsSupplementaires = {
    nomExploitant: "", telephoneExploitant: "", niu: "", rccm: "", siegeSocial: "",
    statutJuridique: STATUT_JURIDIQUE_OPTIONS[0], statutJuridiqueAutre: "", capitalSocial: "", nombreEmployes: "",
    nombreEquipements: "", equipements: {},
    adresseCompleteType: "telephone", adresseTelephone: "", adresseEmail: "", adresseBoitePostale: "",
    photo: "",
  };
  const emptyForm = type === "eaux"
    ? {
        nomStructure: "", responsableNom: "", responsableTelephone: "",
        typeRessource: ressources[0], site: "", gpsSite: "",
        numeroAutorisation: "", numeroAutorisationConditionnement: "", statut: "en_regle",
        dateDelivrancePermis: todayISO, dateDelivranceConditionnement: todayISO,
        ...champsCommunsSupplementaires,
      }
    : {
        nomStructure: "", responsableNom: "", responsableTelephone: "",
        typeRessource: ressources[0], site: "", gpsSite: "",
        numeroAutorisation: "", statut: "en_regle", dateDelivranceAutorisation: todayISO,
        ...champsCommunsSupplementaires,
      };
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [profilId, setProfilId] = useState(null);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, photo: reader.result }));
    reader.readAsDataURL(file);
  };

  const addExploitant = () => {
    setError("");
    const dateOk = type === "eaux" ? (form.dateDelivrancePermis && form.dateDelivranceConditionnement) : form.dateDelivranceAutorisation;
    const conditionnementOk = type === "eaux" ? form.numeroAutorisationConditionnement.trim() : true;
    if (
      !form.nomStructure.trim() ||
      !form.responsableNom.trim() ||
      !form.numeroAutorisation.trim() ||
      !conditionnementOk ||
      !dateOk ||
      !form.photo
    ) {
      setError(t("champsObligatoiresPhotoStructure"));
      return;
    }
    const horodatage = new Date().toISOString();
    const datesCalculees = type === "eaux"
      ? {
          dateExpirationPermis: addYearsISO(form.dateDelivrancePermis, 5),
          dateExpirationConditionnement: addYearsISO(form.dateDelivranceConditionnement, 5),
        }
      : {
          dateExpirationAutorisation: addYearsISO(form.dateDelivranceAutorisation, 2),
        };
    const next = [
      ...exploitants,
      {
        id: uid(),
        type,
        ...form,
        statutJuridique: form.statutJuridique === "Autre" ? (form.statutJuridiqueAutre.trim() || "Autre") : form.statutJuridique,
        ...datesCalculees,
        arrondissementId: current.id,
        creePar: fullName(agent),
        creeLe: horodatage,
        modifiePar: fullName(agent),
        modifieLe: horodatage,
      },
    ];
    setExploitants(next);
    saveKey(STORAGE_KEYS.exploitants, next, accessToken);
    setForm(emptyForm);
    setShowForm(false);
  };

  const removeExploitant = (id) => {
    if (!window.confirm(t("confirmerSuppressionExploitant"))) return;
    const next = exploitants.filter((e) => e.id !== id);
    setExploitants(next);
    saveKey(STORAGE_KEYS.exploitants, next, accessToken);
  };

  const qLower = q.trim().toLowerCase();
  const filtered = items.filter((e) => !qLower || e.nomStructure.toLowerCase().includes(qLower) || (e.site || "").toLowerCase().includes(qLower));
  const profil = profilId ? items.find((e) => e.id === profilId) : null;
  const ressourceLabel = type === "eaux" ? t("typeRessourceEauLabel") : t("typeRessourceCarriereLabel");
  const titreRegistre = type === "eaux" ? t("registreExploitantsEaux") : t("registreExploitantsCarrieres");

  return (
    <div>
      <SectionHeader
        title={titreRegistre}
        subtitle={`${items.length} — ${current.commune}`}
        action={
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", position: "relative" }}>
            <button style={ghostBtn} onClick={() => setShowListe((s) => !s)}>
              <Users size={14} /> {t("listeExploitantBtn")}
              <ChevronRight size={14} style={{ transform: showListe ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.15s" }} />
            </button>
            <button style={primaryBtn} onClick={() => setShowForm((s) => !s)}>
              {showForm ? <X size={14} /> : <Plus size={14} />} {showForm ? t("fermer") : t("ajouterExploitantBtn")}
            </button>

            {showListe && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  background: "#fff",
                  border: "1px solid var(--border)",
                  borderRadius: 4,
                  width: 260,
                  maxHeight: 280,
                  overflowY: "auto",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  zIndex: 20,
                }}
              >
                {items.length === 0 && (
                  <div style={{ padding: 14, fontSize: 12.5, color: "var(--text-faint)" }}>{t("aucunExploitantEnregistre")}</div>
                )}
                {items.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => { setProfilId(e.id); setShowListe(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 14px",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid var(--border-light)",
                      cursor: "pointer",
                      fontSize: 13,
                      color: "var(--text)",
                    }}
                  >
                    {e.nomStructure}
                  </button>
                ))}
              </div>
            )}
          </div>
        }
      />

      {showForm && (
        <div style={{ ...cardStyle, ...typeBgStyle(type), marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 16, marginBottom: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 6,
                background: form.photo ? `url(${form.photo}) center/cover` : "var(--bg-page)",
                border: form.photo ? "1px solid var(--border)" : "1.5px solid #A8542E",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {!form.photo && <Building2 size={22} color="var(--text-faint)" />}
            </div>
            <div>
              <label style={labelStyle}>{t("photoStructureLabel")}<RequiredMark /></label>
              <input type="file" accept="image/*" onChange={handlePhoto} style={{ fontSize: 12.5, fontFamily: "'IBM Plex Sans', sans-serif" }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>{t("nomStructureLabel")}<RequiredMark /></label>
              <input style={inputStyle} value={form.nomStructure} onChange={(e) => setForm({ ...form, nomStructure: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("responsableLabel")}<RequiredMark /></label>
              <input style={inputStyle} value={form.responsableNom} onChange={(e) => setForm({ ...form, responsableNom: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("responsableTelLabel")}</label>
              <input style={inputStyle} value={form.responsableTelephone} onChange={(e) => setForm({ ...form, responsableTelephone: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("nomExploitantLabel")}</label>
              <input style={inputStyle} value={form.nomExploitant} onChange={(e) => setForm({ ...form, nomExploitant: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("telephoneExploitantLabel")}</label>
              <input style={inputStyle} value={form.telephoneExploitant} onChange={(e) => setForm({ ...form, telephoneExploitant: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("niuLabel")}</label>
              <input style={inputStyle} value={form.niu} onChange={(e) => setForm({ ...form, niu: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("rccmLabel")}</label>
              <input style={inputStyle} value={form.rccm} onChange={(e) => setForm({ ...form, rccm: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("siegeSocialLabel")}</label>
              <input style={inputStyle} value={form.siegeSocial} onChange={(e) => setForm({ ...form, siegeSocial: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("statutJuridiqueLabel")}</label>
              <select style={inputStyle} value={form.statutJuridique} onChange={(e) => setForm({ ...form, statutJuridique: e.target.value })}>
                {STATUT_JURIDIQUE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              {form.statutJuridique === "Autre" && (
                <input
                  style={{ ...inputStyle, marginTop: 8 }}
                  placeholder={t("statutJuridiqueAutrePrecisez")}
                  value={form.statutJuridiqueAutre}
                  onChange={(e) => setForm({ ...form, statutJuridiqueAutre: e.target.value })}
                />
              )}
            </div>
            <div>
              <label style={labelStyle}>{t("capitalSocialLabel")}</label>
              <input style={inputStyle} value={form.capitalSocial} onChange={(e) => setForm({ ...form, capitalSocial: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("nombreEmployesLabel")}</label>
              <input style={inputStyle} value={form.nombreEmployes} onChange={(e) => setForm({ ...form, nombreEmployes: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("nombreEquipementsLabel")}</label>
              <input style={inputStyle} value={form.nombreEquipements} onChange={(e) => setForm({ ...form, nombreEquipements: e.target.value })} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>{t("typeEquipementLabel")}</label>
              <EquipementSelector
                value={form.equipements}
                onChange={(v) => setForm({ ...form, equipements: v })}
                categories={type === "carrieres" ? EQUIPEMENT_CATEGORIES_CARRIERES : EQUIPEMENT_CATEGORIES_EAUX}
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>{t("adresseCompleteLabel")}</label>
              <select
                style={{ ...inputStyle, maxWidth: 260, marginBottom: 8 }}
                value={form.adresseCompleteType}
                onChange={(e) => setForm({ ...form, adresseCompleteType: e.target.value })}
              >
                <option value="telephone">{t("adresseCompleteTelephoneOpt")}</option>
                <option value="email">{t("adresseCompleteEmailOpt")}</option>
                <option value="boitePostale">{t("adresseCompleteBoitePostaleOpt")}</option>
                <option value="tous">{t("adresseCompleteTousOpt")}</option>
              </select>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
                {(form.adresseCompleteType === "telephone" || form.adresseCompleteType === "tous") && (
                  <div>
                    <label style={labelStyle}>{t("telephoneDoc")}</label>
                    <input style={inputStyle} value={form.adresseTelephone} onChange={(e) => setForm({ ...form, adresseTelephone: e.target.value })} />
                  </div>
                )}
                {(form.adresseCompleteType === "email" || form.adresseCompleteType === "tous") && (
                  <div>
                    <label style={labelStyle}>{t("adresseMailLabel")}</label>
                    <input style={inputStyle} value={form.adresseEmail} onChange={(e) => setForm({ ...form, adresseEmail: e.target.value })} />
                  </div>
                )}
                {(form.adresseCompleteType === "boitePostale" || form.adresseCompleteType === "tous") && (
                  <div>
                    <label style={labelStyle}>{t("boitePostaleLabel")}</label>
                    <input style={inputStyle} value={form.adresseBoitePostale} onChange={(e) => setForm({ ...form, adresseBoitePostale: e.target.value })} />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label style={labelStyle}>{ressourceLabel}</label>
              <select style={inputStyle} value={form.typeRessource} onChange={(e) => setForm({ ...form, typeRessource: e.target.value })}>
                {ressources.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("localisationStructure")}</label>
              <input style={inputStyle} value={form.site} onChange={(e) => setForm({ ...form, site: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>{t("coordonneesGps")}</label>
              <GpsField value={form.gpsSite} onChange={(v) => setForm({ ...form, gpsSite: v })} />
            </div>
            <div>
              <label style={labelStyle}>{t("numeroAutorisationLabel")}<RequiredMark /></label>
              <input style={inputStyle} value={form.numeroAutorisation} onChange={(e) => setForm({ ...form, numeroAutorisation: e.target.value })} />
            </div>
            {type === "eaux" && (
              <div>
                <label style={labelStyle}>{t("numeroAutorisationConditionnementLabel")}<RequiredMark /></label>
                <input style={inputStyle} value={form.numeroAutorisationConditionnement} onChange={(e) => setForm({ ...form, numeroAutorisationConditionnement: e.target.value })} />
              </div>
            )}
            <div>
              <label style={labelStyle}>{t("statutLabel")}</label>
              <select style={inputStyle} value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })}>
                <option value="en_regle">{t("enRegleOpt")}</option>
                <option value="non_regle">{t("nonRegleOpt")}</option>
              </select>
            </div>
            {type === "eaux" ? (
              <>
                <div>
                  <label style={labelStyle}>{t("dateDelivrancePermisLabel")}<RequiredMark /></label>
                  <DateNaissancePicker value={form.dateDelivrancePermis} onChange={(v) => setForm({ ...form, dateDelivrancePermis: v })} />
                </div>
                <div>
                  <label style={labelStyle}>{t("dateExpirationPermisLabel")}</label>
                  <input
                    style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }}
                    value={form.dateDelivrancePermis && !form.dateDelivrancePermis.startsWith("XXXX") ? formatDateFR(addYearsISO(form.dateDelivrancePermis, 5)) : "—"}
                    readOnly
                  />
                </div>
                <div>
                  <label style={labelStyle}>{t("dateDelivranceConditionnementLabel")}<RequiredMark /></label>
                  <DateNaissancePicker value={form.dateDelivranceConditionnement} onChange={(v) => setForm({ ...form, dateDelivranceConditionnement: v })} />
                </div>
                <div>
                  <label style={labelStyle}>{t("dateExpirationConditionnementLabel")}</label>
                  <input
                    style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }}
                    value={form.dateDelivranceConditionnement && !form.dateDelivranceConditionnement.startsWith("XXXX") ? formatDateFR(addYearsISO(form.dateDelivranceConditionnement, 5)) : "—"}
                    readOnly
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label style={labelStyle}>{t("dateDelivranceAutorisationLabel")}<RequiredMark /></label>
                  <DateNaissancePicker value={form.dateDelivranceAutorisation} onChange={(v) => setForm({ ...form, dateDelivranceAutorisation: v })} />
                </div>
                <div>
                  <label style={labelStyle}>{t("dateExpirationAutorisationLabel")}</label>
                  <input
                    style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }}
                    value={form.dateDelivranceAutorisation && !form.dateDelivranceAutorisation.startsWith("XXXX") ? formatDateFR(addYearsISO(form.dateDelivranceAutorisation, 2)) : "—"}
                    readOnly
                  />
                </div>
              </>
            )}
          </div>
          {error && <div style={{ color: "#A8542E", fontSize: 12.5, marginTop: 10 }}>{error}</div>}
          <button type="button" onClick={addExploitant} style={{ ...primaryBtn, marginTop: 16 }}>{t("enregistrer")}</button>
        </div>
      )}

      <div style={{ position: "relative", marginBottom: 14 }}>
        <Search size={15} style={{ position: "absolute", left: 12, top: 11, color: "var(--text-faint)" }} />
        <input
          style={{ ...inputStyle, paddingLeft: 34 }}
          placeholder={t("rechercherStructureSite")}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.length === 0 && <EmptyState text={t("aucunExploitantMoment")} />}
        {filtered.map((e) => (
          <div
            key={e.id}
            onClick={() => setProfilId(e.id)}
            style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, cursor: "pointer", flexWrap: "wrap" }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 14.5, color: "var(--text)" }}>{e.nomStructure}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
                {e.typeRessource} · {e.site || t("siteNonPreciseTexte")}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <StatutBadge statut={e.statut} />
              <button
                onClick={(ev) => { ev.stopPropagation(); removeExploitant(e.id); }}
                style={{ background: "none", border: "none", color: "#A8542E", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {profil && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 110, background: "rgba(28,43,57,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
          }}
        >
          <div style={{ background: "var(--bg-page)", width: "100%", maxWidth: 420, maxHeight: "88vh", overflowY: "auto", borderRadius: 6, padding: "24px 22px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 19, color: "var(--text)" }}>{profil.nomStructure}</div>
              <button type="button" onClick={() => setProfilId(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                <X size={20} />
              </button>
            </div>
            {profil.photo && (
              <div
                style={{
                  width: 88, height: 88, borderRadius: 6, margin: "0 auto 16px",
                  background: `url(${profil.photo}) center/cover`, border: "1px solid var(--border)",
                }}
              />
            )}
            <div style={{ display: "grid", gap: 10, fontSize: 13 }}>
              <ProfileRow label={t("responsableLabel")} value={profil.responsableNom || "—"} />
              <ProfileRow label={t("responsableTelLabel")} value={profil.responsableTelephone || "—"} />
              <ProfileRow label={ressourceLabel} value={profil.typeRessource || "—"} />
              <ProfileRow label={t("localisationStructure")} value={profil.site || "—"} />
              <ProfileRow
                label={t("coordonneesGps")}
                value={
                  profil.gpsSite ? (
                    <button
                      type="button"
                      onClick={() => openGoogleMaps(profil.gpsSite)}
                      title={t("ouvrirGoogleMaps")}
                      style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--text)", fontWeight: 600, textDecoration: "underline", textDecorationColor: "#C9962C", fontFamily: "'IBM Plex Sans', sans-serif", fontSize: "inherit" }}
                    >
                      {profil.gpsSite}
                    </button>
                  ) : "—"
                }
              />
              <ProfileRow label={t("numeroAutorisationLabel")} value={profil.numeroAutorisation || "—"} />
              {type === "eaux" && (
                <ProfileRow label={t("numeroAutorisationConditionnementLabel")} value={profil.numeroAutorisationConditionnement || "—"} />
              )}
              <ProfileRow label={t("nomExploitantLabel")} value={profil.nomExploitant || "—"} />
              <ProfileRow label={t("telephoneExploitantLabel")} value={profil.telephoneExploitant || "—"} />
              <ProfileRow label={t("niuLabel")} value={profil.niu || "—"} />
              <ProfileRow label={t("rccmLabel")} value={profil.rccm || "—"} />
              <ProfileRow label={t("siegeSocialLabel")} value={profil.siegeSocial || "—"} />
              <ProfileRow label={t("statutJuridiqueLabel")} value={profil.statutJuridique || "—"} />
              <ProfileRow label={t("capitalSocialLabel")} value={profil.capitalSocial || "—"} />
              <ProfileRow label={t("nombreEmployesLabel")} value={profil.nombreEmployes || "—"} />
              <ProfileRow label={t("nombreEquipementsLabel")} value={profil.nombreEquipements || "—"} />
              <ProfileRow label={t("typeEquipementLabel")} value={formatEquipements(profil.equipements) || "—"} />
              {(profil.adresseCompleteType === "telephone" || profil.adresseCompleteType === "tous") && (
                <ProfileRow label={t("telephoneDoc")} value={profil.adresseTelephone || "—"} />
              )}
              {(profil.adresseCompleteType === "email" || profil.adresseCompleteType === "tous") && (
                <ProfileRow label={t("adresseMailLabel")} value={profil.adresseEmail || "—"} />
              )}
              {(profil.adresseCompleteType === "boitePostale" || profil.adresseCompleteType === "tous") && (
                <ProfileRow label={t("boitePostaleLabel")} value={profil.adresseBoitePostale || "—"} />
              )}
              <ProfileRow label={t("communeDoc")} value={ARRONDISSEMENTS.find((a) => a.id === profil.arrondissementId)?.commune || "—"} />
              {type === "eaux" ? (
                <>
                  <ProfileRow label={t("dateDelivrancePermisLabel")} value={formatDateFR(profil.dateDelivrancePermis) || "—"} />
                  <ProfileRow label={t("dateExpirationPermisLabel")} value={formatDateFR(profil.dateExpirationPermis) || "—"} />
                  <ProfileRow label={t("dateDelivranceConditionnementLabel")} value={formatDateFR(profil.dateDelivranceConditionnement) || "—"} />
                  <ProfileRow label={t("dateExpirationConditionnementLabel")} value={formatDateFR(profil.dateExpirationConditionnement) || "—"} />
                </>
              ) : (
                <>
                  <ProfileRow label={t("dateDelivranceAutorisationLabel")} value={formatDateFR(profil.dateDelivranceAutorisation) || "—"} />
                  <ProfileRow label={t("dateExpirationAutorisationLabel")} value={formatDateFR(profil.dateExpirationAutorisation) || "—"} />
                </>
              )}
              <div style={{ marginTop: 6, paddingTop: 10, borderTop: "1px dashed var(--border)", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6 }}>
                <div>{t("creePar2")} <b style={{ color: "var(--text)" }}>{profil.creePar || "—"}</b>{profil.creeLe ? ` ${t("leMot")} ${formatDateTimeFR(profil.creeLe)}` : ""}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* Unités de saisie disponibles pour les déclarations forfaitaires, avec conversion vers l'unité de base du tarif */
const UNITES_QUANTITE = {
  eaux: [
    { code: "m³", facteur: 1 },
    { code: "dm³", facteur: 0.001 },
    { code: "mm³", facteur: 0.000001 },
  ],
  carrieres: [
    { code: "t", facteur: 1 },
    { code: "kg", facteur: 0.001 },
    { code: "g", facteur: 0.000001 },
  ],
};
const TAUX_BASE_FORFAITAIRE = { eaux: { taux: 800, unite: "m³" }, carrieres: { taux: 200, unite: "t" } };

/* Listes des points de contrôle technique et de surveillance administrative — conformes aux exigences MINMIDT */
/* ==== Modèle complet de la fiche eaux, reproduit fidèlement du document MINMIDT fourni ==== */
const EAU_TYPE_OPTIONS = [
  { key: "mineraleNaturelle", label: "Eau minérale naturelle" },
  { key: "source", label: "Eau de source" },
  { key: "table", label: "Eau de table" },
  { key: "traitee", label: "Eau traitée / conditionnée" },
];
const EAU_ACTIVITE_OPTIONS = [
  { key: "captage", label: "Captage" },
  { key: "traitement", label: "Traitement" },
  { key: "conditionnement", label: "Conditionnement" },
  { key: "embouteillage", label: "Embouteillage" },
  { key: "ensachage", label: "Ensachage" },
  { key: "stockage", label: "Stockage" },
  { key: "distribution", label: "Distribution" },
];

const EAU_DOCUMENTS_VERIF = [
  { section: "Documents administratifs", items: [
    { key: "permisExploitation", label: "Permis d'exploitation" },
    { key: "autorisationConditionnement", label: "Autorisation de conditionnement" },
    { key: "quittancesTaxes", label: "Quittances de paiement des taxes" },
    { key: "declarationsMensuelles", label: "Déclarations mensuelles de l'année d'exercice" },
  ]},
  { section: "Documents techniques", items: [
    { key: "coherenceProduction", label: "Cohérence entre production déclarée et production réelle observée" },
    { key: "registreProduction", label: "Registre de production" },
    { key: "registreAccidents", label: "Registre accidents et incidents" },
    { key: "tracabiliteLots", label: "Traçabilité des lots produits" },
    { key: "rapportsAnalyses", label: "Derniers rapports d'analyses de l'eau" },
    { key: "systemeMesureVolumes", label: "Présence d'un système de mesure des volumes exploités" },
  ]},
];

const EAU_SURVEILLANCE_ETAB = [
  { key: "activiteAutorisee", label: "L'établissement exerce effectivement l'activité autorisée" },
  { key: "siteDeclare", label: "L'établissement est implanté sur le site déclaré" },
  { key: "installationsConformes", label: "Les installations correspondent à celles déclarées à l'administration" },
  { key: "capacitesConnues", label: "Les capacités de production installées sont connues et justifiées" },
  { key: "responsablesIdentifies", label: "Les responsables sont identifiés et disponibles" },
  { key: "affichagesDisponibles", label: "Les affichages obligatoires et consignes sont disponibles" },
  { key: "personnelConnaitProcedures", label: "Le personnel connaît les procédures de production et de qualité" },
  { key: "registresAJour", label: "Les registres réglementaires sont tenus à jour" },
  { key: "actionsCorrectives", label: "Les non-conformités antérieures ont fait l'objet d'actions correctives" },
  { key: "accesInfosControle", label: "L'établissement facilite l'accès aux informations de contrôle" },
];

const EAU_CAPTAGE_ITEMS = [
  { key: "sourceIdentifiee", label: "Source, forage et captage clairement identifié" },
  { key: "ouvrageProtege", label: "Ouvrage de captage protégé contre les pollutions extérieures" },
  { key: "zoneEntretenue", label: "Zone de captage entretenue et sécurisée" },
  { key: "dispositifCollecte", label: "Présence d'un dispositif de collecte et acheminement adapté" },
  { key: "suiviDebit", label: "Existence d'un suivi du débit et volume capté" },
  { key: "controleIntegrite", label: "Existence d'un contrôle de l'intégrité du captage" },
];

const EAU_TRAITEMENT_ITEMS = [
  { key: "reservoirsPropres", label: "Réservoirs propres, étanches et entretenus" },
  { key: "circuitFonctionnel", label: "Circuit de traitement propre et fonctionnel" },
  { key: "equipementsFiltration", label: "Équipements de filtration et désinfection disponibles et fonctionnels" },
  { key: "programmeEntretien", label: "Programme d'entretien préventif des installations" },
  { key: "lignesEnsachage", label: "Lignes d'ensachage et embouteillage propres et protégées" },
  { key: "materiauxAdaptes", label: "Matériaux au contact de l'eau adaptés à l'usage alimentaire" },
  { key: "zoneConditionnement", label: "Zone de conditionnement propre, ventilée et organisée" },
  { key: "protectionContaminations", label: "Protection contre les poussières, insectes et contaminations" },
  { key: "stockageEmballages", label: "Stockage des emballages à l'abri des souillures" },
  { key: "produitsStockes", label: "Produits finis stockés dans de bonnes conditions" },
];

const EAU_QUALITE_ORG_ITEMS = [
  { key: "planControleQualite", label: "Existence d'un plan de contrôle qualité de l'eau" },
  { key: "responsableQualite", label: "Existence d'un responsable qualité, laboratoire et prestataire" },
  { key: "prelevementsTraces", label: "Prélèvements réguliers effectués et tracés" },
  { key: "conservationBulletins", label: "Conservation des bulletins d'analyses" },
  { key: "tracabiliteParLot", label: "Système de traçabilité par lot" },
  { key: "procedureRetrait", label: "Procédure de retrait et blocage en cas de non-conformité" },
];

const EAU_PARAMS_ORGANOLEPTIQUES = [
  { key: "couleur", label: "Couleur" }, { key: "odeur", label: "Odeur" },
  { key: "saveur", label: "Saveur" }, { key: "turbidite", label: "Turbidité et aspect" },
];
const EAU_PARAMS_PHYSICOCHIMIQUES = [
  { key: "ph", label: "PH" }, { key: "temperature", label: "Température" }, { key: "conductivite", label: "Conductivité" },
  { key: "residuSec", label: "Résidu sec et minéralisation" }, { key: "nitrates", label: "Nitrates" }, { key: "nitrites", label: "Nitrites" },
  { key: "ammonium", label: "Ammonium" }, { key: "chlorures", label: "Chlorures" }, { key: "sulfates", label: "Sulfates" },
  { key: "fluorures", label: "Fluorures" }, { key: "ferManganese", label: "Fer et manganèse (si applicable)" },
  { key: "dureteAlcalinite", label: "Dureté et alcalinité (si applicable)" }, { key: "autresParametres", label: "Autres paramètres analysés" },
];
const EAU_PARAMS_MICROBIOLOGIQUES = [
  { key: "coliformesTotaux", label: "Coliformes totaux" }, { key: "coliformesFecaux", label: "Coliformes fécaux et thermotolérants" },
  { key: "eColi", label: "Escherichia coli" }, { key: "streptocoques", label: "Streptocoques et entérocoques fécaux" },
  { key: "germesAerobies", label: "Germes aérobies revivifiables" }, { key: "salmonella", label: "Salmonella (si recherchée)" },
  { key: "autresGermes", label: "Autres germes recherchés" },
];

const EAU_APPRECIATION_OPTIONS = [
  { key: "sincere", label: "Déclarations jugées sincères" },
  { key: "coherentes", label: "Déclarations globalement cohérentes mais nécessitant des vérifications complémentaires" },
  { key: "insuffisances", label: "Déclarations comportant des insuffisances et incohérences" },
  { key: "non_sincere", label: "Déclarations manifestement non sincères sur certains aspects" },
];

const EAU_CONCLUSION_OPTIONS = [
  { key: "satisfaisante", label: "L'établissement présente une situation globalement satisfaisante" },
  { key: "corriger", label: "L'établissement doit corriger certaines insuffisances dans les délais prescrits" },
  { key: "verifSincerite", label: "La sincérité des déclarations nécessite des vérifications complémentaires" },
  { key: "suiviQualite", label: "La qualité de l'eau nécessite un suivi renforcé et des analyses complémentaires" },
];

/* ===== Fiche de contrôle technique et de surveillance administrative des CARRIÈRES ===== */
const CARRIERE_SUBSTANCE_OPTIONS = [
  { key: "sable", label: "Sable" }, { key: "gravier", label: "Gravier" }, { key: "laterite", label: "Latérite" },
  { key: "pierre", label: "Pierre" }, { key: "argile", label: "Argile" },
];

const CARRIERE_SITUATION_ADMIN_ITEMS = [
  { key: "titrePresente", label: "Autorisation / titre présenté" },
  { key: "autorisationValide", label: "Autorisation en cours de validité" },
  { key: "titulaireConforme", label: "Titulaire conforme à l'exploitant" },
  { key: "exploitationPerimetre", label: "Exploitation dans le périmètre autorisé" },
  { key: "substanceConforme", label: "Substance conforme à l'autorisation" },
  { key: "documentsAdmin", label: "Documents administratifs disponibles" },
  { key: "registreExploitation", label: "Registre / cahier d'exploitation disponible" },
  { key: "obligationsFinancieres", label: "Obligations financières suivies" },
  { key: "declarationsRapports", label: "Déclarations / rapports disponibles" },
  { key: "cahierCharges", label: "Cahier des charges respecté, si applicable" },
];

const CARRIERE_CONTROLE_TECHNIQUE_ITEMS = [
  { key: "methodeExploitation", label: "Méthode d'exploitation appropriée" },
  { key: "frontTaille", label: "Front de taille correctement aménagé" },
  { key: "talusBerges", label: "Talus / berges stables" },
  { key: "banquettes", label: "Banquettes réalisées si nécessaires" },
  { key: "profondeurMaitrisee", label: "Profondeur d'exploitation maîtrisée" },
  { key: "enginsEtat", label: "Engins et équipements en état acceptable" },
  { key: "circulationEngins", label: "Circulation des engins organisée" },
  { key: "zoneChargement", label: "Zone de chargement sécurisée" },
  { key: "concassageSecurise", label: "Concassage / criblage sécurisé, si applicable" },
  { key: "installationsElectriques", label: "Installations électriques sécurisées" },
  { key: "stockageMateriaux", label: "Stockage des matériaux organisé" },
  { key: "accesZonesDangereuses", label: "Accès aux zones dangereuses contrôlé" },
];

const CARRIERE_SECURITE_ITEMS = [
  { key: "signalisationSite", label: "Signalisation du site" },
  { key: "balisageZones", label: "Balisage des zones dangereuses" },
  { key: "epiDisponibles", label: "EPI disponibles" },
  { key: "epiUtilises", label: "EPI effectivement utilisés" },
  { key: "premiersSecours", label: "Premiers secours disponibles" },
  { key: "moyensIncendie", label: "Moyens incendie disponibles si nécessaires" },
  { key: "preventionChutes", label: "Prévention des chutes / éboulements" },
  { key: "circulationSecurisee", label: "Circulation sécurisée des engins" },
  { key: "personnelSensibilise", label: "Personnel sensibilisé aux risques" },
];

const CARRIERE_ENVIRONNEMENT_ITEMS = [
  { key: "gestionEauxRuissellement", label: "Gestion des eaux de ruissellement" },
  { key: "gestionDechets", label: "Gestion des déchets" },
  { key: "limitationPoussieres", label: "Limitation des poussières" },
  { key: "limitationNuisances", label: "Limitation des nuisances" },
  { key: "protectionZonesSensibles", label: "Protection des zones sensibles" },
  { key: "mesuresRemiseEnEtat", label: "Mesures de remise en état" },
  { key: "excavationsSecurisees", label: "Excavations / anciens fronts sécurisés" },
];

const CARRIERE_MESURES_OPTIONS = [
  { key: "aucuneObservation", label: "Aucune observation" },
  { key: "regularisationAdmin", label: "Régularisation administrative" },
  { key: "mesuresCorrectives", label: "Mesures correctives" },
  { key: "miseEnDemeure", label: "Mise en demeure à proposer" },
  { key: "controleSuivi", label: "Contrôle de suivi" },
  { key: "rapportHierarchie", label: "Rapport à la hiérarchie" },
  { key: "saisineAutreAdmin", label: "Saisine d'une autre administration" },
];

const CARRIERE_CONCLUSION_OPTIONS = [
  { key: "conforme", label: "Conforme" },
  { key: "conformeAvecObs", label: "Conforme avec observations" },
  { key: "nonConforme", label: "Non conforme" },
  { key: "exploitationIrreguliere", label: "Exploitation irrégulière" },
  { key: "horsPerimetre", label: "Hors périmètre autorisé" },
  { key: "sansTitre", label: "Sans titre / autorisation constatée" },
  { key: "dangerImmediat", label: "Danger immédiat" },
];

const CARRIERE_DOCUMENTS_ANNEXES_OPTIONS = [
  { key: "photographies", label: "Photographies" },
  { key: "coordonneesGPS", label: "Coordonnées GPS" },
  { key: "copieTitre", label: "Copie titre / autorisation" },
  { key: "planPerimetre", label: "Plan / périmètre" },
  { key: "production", label: "Production" },
  { key: "transport", label: "Transport" },
];

function emptyCarriereControleData() {
  return {
    raisonSociale: "", nomCarriere: "", exploitantPromoteur: "", responsable: "", responsableTel: "",
    localite: "", arrondissementTxt: "", communeTxt: "",
    substances: Object.fromEntries(CARRIERE_SUBSTANCE_OPTIONS.map((o) => [o.key, false])),
    substanceAutre: false, substanceAutreTexte: "",
    latitude: "", longitude: "", altitude: "", superficieAutorisee: "", superficieExploitee: "",
    perimetreMaterialise: "",
    situationAdmin: emptyOuiNonMap(CARRIERE_SITUATION_ADMIN_ITEMS),
    numeroTitre: "", dateDelivranceTitre: "", dateExpirationTitre: "",
    controleTechnique: emptyOuiNonMap(CARRIERE_CONTROLE_TECHNIQUE_ITEMS),
    productionConstatee: "", productionUnite: "", stockConstate: "",
    destination: "", moyensTransport: "", documentsTransport: "", observationsProduction: "",
    securite: emptyOuiNonMap(CARRIERE_SECURITE_ITEMS),
    environnement: emptyOuiNonMap(CARRIERE_ENVIRONNEMENT_ITEMS),
    constatsAdmin: "", constatsTechniques: "", constatsSecuriteEnv: "",
    infractions: Array.from({ length: 3 }, () => ({ manquement: "", gravite: "", mesureProposee: "" })),
    referenceTexte: "",
    mesures: Object.fromEntries(CARRIERE_MESURES_OPTIONS.map((o) => [o.key, false])),
    mesureAutre: false, mesureAutreTexte: "",
    delaiConformite: "", dateSuivi: "",
    conclusion: Object.fromEntries(CARRIERE_CONCLUSION_OPTIONS.map((o) => [o.key, false])),
    synthese: "",
    documentsAnnexes: Object.fromEntries(CARRIERE_DOCUMENTS_ANNEXES_OPTIONS.map((o) => [o.key, false])),
    documentsAutre: false, documentsAutreTexte: "", nombrePhotos: "",
    equipe: Array.from({ length: 4 }, () => ({ nom: "", fonction: "", adresseTel: "" })),
  };
}

function emptyOuiNonMap(items) {
  return Object.fromEntries(items.map((it) => [it.key, { valeur: "", observation: "" }]));
}

function emptyEauControleData() {
  return {
    raisonSociale: "", refPermis: "", refConditionnement: "", adresseSiege: "", contacts: "",
    nomExploitant: "", interlocuteur: "",
    typeEau: Object.fromEntries(EAU_TYPE_OPTIONS.map((o) => [o.key, false])),
    typeEauAutre: false, typeEauAutreTexte: "",
    natureActivite: Object.fromEntries(EAU_ACTIVITE_OPTIONS.map((o) => [o.key, false])),
    capaciteProduction: "", effectifPersonnel: "", dateMiseService: "",
    equipe: Array.from({ length: 6 }, () => ({ nom: "", fonction: "", adresseTel: "" })),
    documentsVerif: emptyOuiNonMap(EAU_DOCUMENTS_VERIF.flatMap((g) => g.items)),
    surveillanceEtab: emptyOuiNonMap(EAU_SURVEILLANCE_ETAB),
    captage: emptyOuiNonMap(EAU_CAPTAGE_ITEMS),
    traitement: emptyOuiNonMap(EAU_TRAITEMENT_ITEMS),
    qualiteOrg: emptyOuiNonMap(EAU_QUALITE_ORG_ITEMS),
    paramOrgano: emptyOuiNonMap(EAU_PARAMS_ORGANOLEPTIQUES),
    paramPhysico: emptyOuiNonMap(EAU_PARAMS_PHYSICOCHIMIQUES),
    paramMicrobio: emptyOuiNonMap(EAU_PARAMS_MICROBIOLOGIQUES),
    appreciationGlobale: "",
    motifsConstates: "",
    pointsSatisfaisants: ["", "", ""],
    nonConformites: ["", "", "", "", ""],
    elementsComplement: ["", "", ""],
    mesuresPrescrites: ["", "", "", "", ""],
    piecesJustificatives: "",
    conclusion: Object.fromEntries(EAU_CONCLUSION_OPTIONS.map((o) => [o.key, false])),
  };
}

/* Section de saisie d'une checklist Oui/Non(/N-A) avec observation par ligne (formulaire) */
function ChecklistFormSection({ items, values, onChange, colYes = "Oui", colNo = "Non", naLabel }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((it, i) => (
        <div key={it.key} style={{ borderBottom: "1px solid var(--border-light)", paddingBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12.5, color: "var(--text-strong)", flex: 1, minWidth: 200 }}>{i + 1}. {it.label}</span>
            <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, cursor: "pointer" }}>
                <input type="radio" name={it.key} checked={values[it.key]?.valeur === "oui"} onChange={() => onChange({ ...values, [it.key]: { ...values[it.key], valeur: "oui" } })} /> {colYes}
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, cursor: "pointer" }}>
                <input type="radio" name={it.key} checked={values[it.key]?.valeur === "non"} onChange={() => onChange({ ...values, [it.key]: { ...values[it.key], valeur: "non" } })} /> {colNo}
              </label>
              {naLabel && (
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, cursor: "pointer" }}>
                  <input type="radio" name={it.key} checked={values[it.key]?.valeur === "na"} onChange={() => onChange({ ...values, [it.key]: { ...values[it.key], valeur: "na" } })} /> {naLabel}
                </label>
              )}
            </div>
          </div>
          <input
            style={{ ...inputStyle, marginTop: 6, fontSize: 12 }}
            placeholder="Observations (facultatif)"
            value={values[it.key]?.observation || ""}
            onChange={(e) => onChange({ ...values, [it.key]: { ...values[it.key], observation: e.target.value } })}
          />
        </div>
      ))}
    </div>
  );
}

/* Même checklist, en version imprimable (tableau officiel compact) */
function ChecklistPrintTable({ items, values, colYes = "Oui", colNo = "Non", naLabel, showObservations = true }) {
  const th = { border: "1px solid #DCD1B8", padding: "3px 4px", fontSize: 7.5, color: "#1C2B39", background: "#F1EBDD", fontWeight: 700, textAlign: "center", lineHeight: 1.25 };
  const td = { border: "1px solid #DCD1B8", padding: "3px 4px", fontSize: 7.5, color: "#1C2B39", lineHeight: 1.25 };
  const pctLabel = showObservations ? 42 : 62;
  const pctChk = naLabel ? (showObservations ? 8 : 12) : (showObservations ? 8 : 15);
  const pctObs = showObservations ? (100 - 8 - pctLabel - pctChk * (naLabel ? 3 : 2)) : 0;
  return (
    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14, tableLayout: "fixed" }}>
      <colgroup>
        <col style={{ width: "8%" }} />
        <col style={{ width: `${pctLabel}%` }} />
        <col style={{ width: `${pctChk}%` }} />
        <col style={{ width: `${pctChk}%` }} />
        {naLabel && <col style={{ width: `${pctChk}%` }} />}
        {showObservations && <col style={{ width: `${Math.max(pctObs, 10)}%` }} />}
      </colgroup>
      <tbody>
        <tr>
          <td style={th}>N°</td><td style={th}>Points de contrôle</td><td style={th}>{colYes}</td><td style={th}>{colNo}</td>
          {naLabel && <td style={th}>{naLabel}</td>}
          {showObservations && <td style={th}>Observations</td>}
        </tr>
        {items.map((it, i) => {
          const v = values?.[it.key] || {};
          return (
            <tr key={it.key}>
              <td style={{ ...td, textAlign: "center" }}>{i + 1}</td>
              <td style={td}>{it.label}</td>
              <td style={{ ...td, textAlign: "center" }}>{v.valeur === "oui" ? "☑" : "☐"}</td>
              <td style={{ ...td, textAlign: "center" }}>{v.valeur === "non" ? "☑" : "☐"}</td>
              {naLabel && <td style={{ ...td, textAlign: "center" }}>{v.valeur === "na" ? "☑" : "☐"}</td>}
              {showObservations && <td style={td}>{v.observation || ""}</td>}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

const CONTROLE_TECHNIQUE_ITEMS = {
  eaux: ["installationsCaptage", "equipementsConditionnement", "debitAutorise", "qualiteEau", "systemeTraitement", "hygieneSite"],
  carrieres: ["conformitePlans", "perimetreExploitation", "equipementsExtraction", "mesuresSecurite", "gestionDechets", "rehabilitationSite"],
};
const SURVEILLANCE_ADMIN_ITEMS = {
  eaux: ["autorisationJour", "conditionnementJour", "taxesJour", "registreProductionTenu", "engagementsEnv", "autresDocuments"],
  carrieres: ["autorisationJour", "taxesJour", "registreProductionTenu", "engagementsEnv", "autresDocuments"],
};

/* Fiche de déclaration pour les exploitants des eaux / produits de carrières — taxe forfaitaire par unité physique */
function DeclarationExploitant({ type, items, controles, setControles, arrondissement, accessToken, agent, onClose }) {
  const t = useT();
  const declarations = controles.filter((c) => c.type === "declaration_exploitant" && c.sousType === type);
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];
  const fmt = (n) => `${Number(n || 0).toLocaleString("fr-FR")} XAF`;
  const th = { border: "1px solid #DCD1B8", padding: "4px 5px", fontSize: 8.5, color: "#1C2B39", background: "#F1EBDD", fontWeight: 700, textAlign: "center", lineHeight: 1.3 };
  const td = { border: "1px solid #DCD1B8", padding: "4px 5px", fontSize: 8.5, color: "#1C2B39", textAlign: "center", lineHeight: 1.3 };

  const unitesDispo = UNITES_QUANTITE[type];
  const baseTarif = TAUX_BASE_FORFAITAIRE[type];

  const [wizStep, setWizStep] = useState(items.length > 0 ? "select" : "vide");
  const [selId, setSelId] = useState("");
  const [selMoisNom, setSelMoisNom] = useState(MOIS_NOMS[new Date().getMonth()]);
  const [selAnnee, setSelAnnee] = useState(new Date().getFullYear());
  const [quantite, setQuantite] = useState("");
  const [unite, setUnite] = useState(unitesDispo[0].code);
  const [materiau, setMateriau] = useState(RESSOURCES_EXPLOITANT.carrieres[0]);
  const [savedRecord, setSavedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const structureSel = items.find((s) => s.id === selId);
  const declStructureCourante = declarations.filter((c) => c.exploitantId === selId);
  const currentYear = new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth();
  const moisDispo = Array.from(new Set([...declStructureCourante.map((c) => c.moisNom), MOIS_NOMS[currentMonthIdx]]));
  const anneesDispo = Array.from(new Set([...declStructureCourante.map((c) => c.anneeDecl), currentYear])).sort((a, b) => b - a);

  const facteurUnite = (unitesDispo.find((u) => u.code === unite) || unitesDispo[0]).facteur;
  const taxeTotale = (Number(quantite) || 0) * facteurUnite * baseTarif.taux;

  const validerSelection = () => {
    if (!selId) return;
    setWizStep("form");
  };

  const submitDeclaration = () => {
    if (!quantite || Number(quantite) <= 0) return;
    const maintenant = new Date().toISOString();
    const record = {
      id: editingId || uid(),
      type: "declaration_exploitant",
      sousType: type,
      exploitantId: structureSel.id,
      operateur: structureSel.nomStructure,
      mois: `${selMoisNom} ${selAnnee}`,
      moisNom: selMoisNom,
      anneeDecl: selAnnee,
      commune: current.commune,
      arrondissement: current.label,
      materiau: type === "carrieres" ? materiau : structureSel.typeRessource,
      quantite,
      unite,
      tauxForfaitaire: baseTarif.taux,
      tauxUnite: baseTarif.unite,
      taxeTotale,
      devise: "XAF",
      niu: structureSel.niu || "",
      responsableNom: structureSel.responsableNom || "",
      responsableTelephone: structureSel.responsableTelephone || "",
      numeroAutorisation: structureSel.numeroAutorisation || "",
      numeroAutorisationConditionnement: type === "eaux" ? (structureSel.numeroAutorisationConditionnement || "") : undefined,
      agent: editingId ? (savedRecord?.agent || agent.nom) : agent.nom,
      date: editingId ? (savedRecord?.date || maintenant.slice(0, 10)) : maintenant.slice(0, 10),
      modifiePar: fullName(agent),
      modifieLe: maintenant,
      modifie: !!editingId,
    };
    const next = editingId ? controles.map((c) => (c.id === editingId ? record : c)) : [...controles, record];
    setControles(next);
    saveKey(STORAGE_KEYS.controles, next, accessToken);
    setSavedRecord(record);
    setEditingId(null);
    setWizStep("apercu");
  };

  const startEdit = () => {
    if (!savedRecord) return;
    const rec = savedRecord;
    setSelId(rec.exploitantId);
    setSelMoisNom(rec.moisNom);
    setSelAnnee(rec.anneeDecl);
    setQuantite(rec.quantite);
    setUnite(rec.unite || unitesDispo[0].code);
    if (type === "carrieres") setMateriau(rec.materiau);
    setEditingId(rec.id);
    setWizStep("form");
  };

  const removeDeclaration = (id) => {
    if (!window.confirm(t("confirmerSuppressionFiche"))) return;
    const next = controles.filter((c) => c.id !== id);
    setControles(next);
    saveKey(STORAGE_KEYS.controles, next, accessToken);
    if (savedRecord?.id === id) { setSavedRecord(null); setWizStep(items.length > 0 ? "select" : "vide"); }
  };

  const titre = type === "eaux" ? t("ficheDeclarationEaux") : t("ficheDeclarationCarrieres");

  return (
    <>
      <div className="no-print" style={{ ...cardStyle, ...typeBgStyle(type), marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{titre}</div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        {wizStep === "vide" && (
          <div style={{ fontSize: 12.5, color: "#A8542E" }}>{t("aucuneStructureEnregistree")}</div>
        )}

      {wizStep === "select" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
            <div>
              <label style={labelStyle}>{t("structureLabel2")}</label>
              <select style={inputStyle} value={selId} onChange={(e) => setSelId(e.target.value)}>
                <option value="">{t("choisirOpt")}</option>
                {items.map((s) => <option key={s.id} value={s.id}>{s.nomStructure}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("moisLabelForm")}</label>
              <select style={inputStyle} value={selMoisNom} onChange={(e) => setSelMoisNom(e.target.value)}>
                {moisDispo.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("anneeLabel")}</label>
              <select style={inputStyle} value={selAnnee} onChange={(e) => setSelAnnee(Number(e.target.value))}>
                {anneesDispo.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="button" onClick={validerSelection} style={primaryBtn} disabled={!selId}>{t("validerBtn")}</button>
          </div>
        </div>
      )}

      {wizStep === "form" && structureSel && (
        <div style={{ display: "grid", gap: 14 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
              {t("identificationExploitation")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              <div>
                <label style={labelStyle}>{t("structureLabel2")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={structureSel.nomStructure} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("moisLabelForm")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={`${selMoisNom} ${selAnnee}`} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("departementDoc")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value="Bénoué" readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("communeDoc")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={current.commune} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("niuLabel")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={structureSel.niu || "—"} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("responsableLabel")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={structureSel.responsableNom || "—"} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("responsableTelLabel")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={structureSel.responsableTelephone || "—"} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("numeroAutorisationExploitationLabel")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={structureSel.numeroAutorisation || "—"} readOnly />
              </div>
              {type === "eaux" && (
                <div>
                  <label style={labelStyle}>{t("numeroAutorisationConditionnementLabel")}</label>
                  <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={structureSel.numeroAutorisationConditionnement || "—"} readOnly />
                </div>
              )}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
              {t("quantiteEtTaxe")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              {type === "carrieres" && (
                <div>
                  <label style={labelStyle}>{t("materiauExtrait")}</label>
                  <select style={inputStyle} value={materiau} onChange={(e) => setMateriau(e.target.value)}>
                    {RESSOURCES_EXPLOITANT.carrieres.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
              {type === "eaux" && (
                <div>
                  <label style={labelStyle}>{t("designationSubstance")}</label>
                  <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={structureSel.typeRessource || "—"} readOnly />
                </div>
              )}
              <div>
                <label style={labelStyle}>{type === "eaux" ? t("quantitePrelevee") : t("quantiteExtraite")} ({unite})</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <input style={inputStyle} value={quantite} onChange={(e) => setQuantite(e.target.value)} placeholder="Ex : 120" />
                  <select style={{ ...inputStyle, maxWidth: 90 }} value={unite} onChange={(e) => setUnite(e.target.value)}>
                    {unitesDispo.map((u) => <option key={u.code} value={u.code}>{u.code}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t("taxeForfaitaireParUnite")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={`${baseTarif.taux.toLocaleString("fr-FR")} XAF / ${baseTarif.unite}`} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("montantTaxeTotal")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text)", fontWeight: 700 }} value={`${taxeTotale.toLocaleString("fr-FR")} XAF`} readOnly />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
              {t("repartition")}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
              <tbody>
                <tr>
                  <td style={th}>{t("beneficiaire")}</td>
                  <td style={th}>{t("tauxApplicable")}</td>
                  <td style={th}>{t("montant")}</td>
                  <td style={th}>{t("compteAffectation")}</td>
                </tr>
                <tr>
                  <td style={td}>CTD</td>
                  <td style={td}>{t("communeDoc")} ({BENEFICIAIRES.CTD.taux}%)</td>
                  <td style={td}>{fmt(taxeTotale * (BENEFICIAIRES.CTD.taux / 100))}</td>
                  <td style={td}>{BENEFICIAIRES.CTD.compte}</td>
                </tr>
                <tr>
                  <td style={td} rowSpan={2}>ASCAM</td>
                  <td style={td}>MINFI ({BENEFICIAIRES.MINFI.taux}%)</td>
                  <td style={td}>{fmt(taxeTotale * (BENEFICIAIRES.MINFI.taux / 100))}</td>
                  <td style={td}>{BENEFICIAIRES.MINFI.compte}</td>
                </tr>
                <tr>
                  <td style={td}>MINMIDT ({BENEFICIAIRES.MINMIDT.taux}%)</td>
                  <td style={td}>{fmt(taxeTotale * (BENEFICIAIRES.MINMIDT.taux / 100))}</td>
                  <td style={td}>{BENEFICIAIRES.MINMIDT.compte}</td>
                </tr>
                <tr>
                  <td style={td}>{t("tresorPublic")}</td>
                  <td style={td}>{t("tresorPublic")} ({BENEFICIAIRES.TRESOR.taux}%)</td>
                  <td style={td}>{fmt(taxeTotale * (BENEFICIAIRES.TRESOR.taux / 100))}</td>
                  <td style={td}>{BENEFICIAIRES.TRESOR.compte}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={submitDeclaration} style={primaryBtn} disabled={!quantite}>{t("enregistrerDeclarationBtn")}</button>
            <button type="button" onClick={() => setWizStep("select")} style={ghostBtn}>{t("annuler")}</button>
          </div>
        </div>
      )}
      </div>

      {wizStep === "apercu" && savedRecord && (
        <div>
          <div className="print-area" style={{ ...cardStyle, maxWidth: 800, width: "100%", margin: "0 auto 18px" }}>
            <DeclarationLetterhead />

            <div style={{ fontSize: 13, fontWeight: 700, color: "#1C2B39", marginBottom: 14, textAlign: "center" }}>
              {type === "eaux" ? t("ficheDeclarationEaux") : t("ficheDeclarationCarrieres")} — {savedRecord.mois}
            </div>

            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>{t("identificationExploitation")}</div>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 16 }}>
              <tbody>
                <ApercuRow label={t("structureLabel2")} value={savedRecord.operateur} />
                <ApercuRow label={t("moisLabelForm")} value={savedRecord.mois} />
                <ApercuRow label={t("departementDoc")} value="Bénoué" />
                <ApercuRow label={t("communeDoc")} value={savedRecord.commune} />
                <ApercuRow label={t("niuLabel")} value={savedRecord.niu || "—"} />
                <ApercuRow label={t("responsableLabel")} value={savedRecord.responsableNom || "—"} />
                <ApercuRow label={t("responsableTelLabel")} value={savedRecord.responsableTelephone || "—"} />
                <ApercuRow label={t("numeroAutorisationExploitationLabel")} value={savedRecord.numeroAutorisation || "—"} />
                {type === "eaux" && (
                  <ApercuRow label={t("numeroAutorisationConditionnementLabel")} value={savedRecord.numeroAutorisationConditionnement || "—"} />
                )}
              </tbody>
            </table>

            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>
              {t("quantiteEtTaxe")}
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, tableLayout: "fixed" }}>
              <tbody>
                <tr>
                  <td style={th}>{t("designation")}</td>
                  <td style={th}>{type === "eaux" ? t("quantitePrelevee") : t("quantiteExtraite")} ({savedRecord.unite})</td>
                  <td style={th}>{t("taxeForfaitaireParUnite")}</td>
                  <td style={th}>{t("montantTaxe")}</td>
                </tr>
                <tr>
                  <td style={td}>{type === "eaux" ? savedRecord.materiau || "Eau" : savedRecord.materiau}</td>
                  <td style={td}>{savedRecord.quantite}</td>
                  <td style={td}>{savedRecord.tauxForfaitaire.toLocaleString("fr-FR")} XAF / {savedRecord.tauxUnite || savedRecord.unite}</td>
                  <td style={{ ...td, fontWeight: 700 }}>{fmt(savedRecord.taxeTotale)}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>{t("repartition")}</div>
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, tableLayout: "fixed" }}>
              <tbody>
                <tr>
                  <td style={th}>{t("beneficiaire")}</td>
                  <td style={th}>{t("tauxApplicable")}</td>
                  <td style={th}>{t("montant")}</td>
                  <td style={th}>{t("compteAffectation")}</td>
                </tr>
                <tr>
                  <td style={td}>CTD</td>
                  <td style={td}>{t("communeDoc")} ({BENEFICIAIRES.CTD.taux}%)</td>
                  <td style={td}>{fmt(savedRecord.taxeTotale * (BENEFICIAIRES.CTD.taux / 100))}</td>
                  <td style={td}>{BENEFICIAIRES.CTD.compte}</td>
                </tr>
                <tr>
                  <td style={td} rowSpan={2}>ASCAM</td>
                  <td style={td}>MINFI ({BENEFICIAIRES.MINFI.taux}%)</td>
                  <td style={td}>{fmt(savedRecord.taxeTotale * (BENEFICIAIRES.MINFI.taux / 100))}</td>
                  <td style={td}>{BENEFICIAIRES.MINFI.compte}</td>
                </tr>
                <tr>
                  <td style={td}>MINMIDT ({BENEFICIAIRES.MINMIDT.taux}%)</td>
                  <td style={td}>{fmt(savedRecord.taxeTotale * (BENEFICIAIRES.MINMIDT.taux / 100))}</td>
                  <td style={td}>{BENEFICIAIRES.MINMIDT.compte}</td>
                </tr>
                <tr>
                  <td style={td}>{t("tresorPublic")}</td>
                  <td style={td}>{t("tresorPublic")} ({BENEFICIAIRES.TRESOR.taux}%)</td>
                  <td style={td}>{fmt(savedRecord.taxeTotale * (BENEFICIAIRES.TRESOR.taux / 100))}</td>
                  <td style={td}>{BENEFICIAIRES.TRESOR.compte}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, padding: "0 16px 10px" }}>
              <div style={{ textAlign: "center", fontSize: 11, color: "#1C2B39" }}>
                <div style={{ marginBottom: 34 }}>{t("signatureExploitant")}</div>
              </div>
              <div style={{ textAlign: "center", fontSize: 11, color: "#1C2B39" }}>
                <div style={{ marginBottom: 34 }}>{t("visaDelegue")}</div>
              </div>
            </div>

            <div className="no-print" style={{ textAlign: "center", fontSize: 11, color: "#A99B7F", marginTop: 6, lineHeight: 1.6 }}>
              {t("ficheCreeePar")} <b style={{ color: "#5B5346" }}>{savedRecord.agent}</b> {t("leMot")} {formatDateFR(savedRecord.date)}
            </div>
          </div>

          <div className="no-print" style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> {t("telechargerPdf")}</button>
            <button type="button" onClick={startEdit} style={ghostBtn}><Pencil size={14} /> {t("modifier")}</button>
            <button type="button" onClick={() => removeDeclaration(savedRecord.id)} style={{ ...ghostBtn, color: "#A8542E", borderColor: "#E3B8A8" }}><Trash2 size={14} /> {t("supprimer")}</button>
            <button type="button" onClick={() => { setSavedRecord(null); setWizStep("select"); setSelId(""); setQuantite(""); }} style={ghostBtn}>{t("fermer")}</button>
          </div>
        </div>
      )}

      <div className="no-print" style={{ marginTop: 22, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9962C", marginBottom: 10 }}>
          {t("historiqueDeclarationsStructures")} ({declarations.length})
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {declarations.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{t("aucuneDeclarationEnreg")}</div>}
          {declarations.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--border-light)", borderRadius: 4, padding: "8px 10px" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{c.operateur} — {c.mois}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>{c.quantite} {c.unite} · {c.taxeTotale.toLocaleString("fr-FR")} XAF</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => { setSavedRecord(c); setWizStep("apercu"); }} title={t("voirFicheTitle")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  <Eye size={15} />
                </button>
                <button type="button" onClick={() => removeDeclaration(c.id)} title={t("supprimerTitle")} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8542E" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* Fiche imprimable de contrôle technique et de surveillance administrative — même en-tête officiel que la déclaration */
function ControleTechniqueApercu({ record: c }) {
  const t = useT();
  const itemsCT = CONTROLE_TECHNIQUE_ITEMS[c.sousType] || [];
  const itemsSA = SURVEILLANCE_ADMIN_ITEMS[c.sousType] || [];
  const resultatLabel = { conforme: t("resultatConforme"), non_conforme: t("resultatNonConforme"), reserves: t("resultatReserves") }[c.resultatGlobal] || "—";

  return (
    <div className="print-area" style={{ ...cardStyle, marginBottom: 18, maxWidth: 800, width: "100%", margin: "0 auto 18px" }}>
      <DeclarationLetterhead />

      <div style={{ fontSize: 13, fontWeight: 700, color: "#1C2B39", marginBottom: 4, textAlign: "center" }}>{t("ficheControleTitre")}</div>
      <div style={{ fontSize: 11, color: "#5B5346", marginBottom: 14, textAlign: "center" }}>
        {c.sousType === "eaux" ? t("controleTechniqueSousTitreEaux") : t("controleTechniqueSousTitreCarrieres")}
      </div>

      <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>{t("identificationExploitation")}</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, marginBottom: 16 }}>
        <tbody>
          <ApercuRow label={t("nomStructureLabel")} value={c.operateur} />
          <ApercuRow label={t("responsableLabel")} value={c.responsable || "—"} />
          <ApercuRow label={t("numeroAutorisationLabel")} value={c.numeroAutorisation || "—"} />
          <ApercuRow label={t("communeDoc")} value={c.commune} />
          <ApercuRow label={t("arrondissementDoc")} value={c.arrondissement} />
          <ApercuRow label={t("dateControleLabel")} value={formatDateFR(c.dateControle)} />
          <ApercuRow label={t("inspecteurLabel")} value={c.inspecteur || "—"} />
        </tbody>
      </table>

      <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>{t("sectionControleTechnique")}</div>
      <div style={{ fontSize: 11.5, marginBottom: 16 }}>
        {itemsCT.map((key) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 10, borderBottom: "1px solid #E3DAC6", padding: "3px 0" }}>
            <span>{t("ct_" + key)}</span>
            <span style={{ fontWeight: 700, color: c.controleTechnique?.[key] ? "#4A5D3A" : "#A8542E", whiteSpace: "nowrap" }}>
              {c.controleTechnique?.[key] ? "✓" : "✗"}
            </span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>{t("sectionSurveillanceAdmin")}</div>
      <div style={{ fontSize: 11.5, marginBottom: 16 }}>
        {itemsSA.map((key) => (
          <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 10, borderBottom: "1px solid #E3DAC6", padding: "3px 0" }}>
            <span>{t("sa_" + key)}</span>
            <span style={{ fontWeight: 700, color: c.surveillanceAdmin?.[key] ? "#4A5D3A" : "#A8542E", whiteSpace: "nowrap" }}>
              {c.surveillanceAdmin?.[key] ? "✓" : "✗"}
            </span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>{t("sectionResultat")}</div>
      <div style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 16 }}>{resultatLabel}</div>

      <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 6 }}>{t("sectionObservationsControle")}</div>
      <div style={{ fontSize: 12.5, marginBottom: 18 }}>{c.observations || "—"}</div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, padding: "0 16px 10px" }}>
        <div style={{ textAlign: "center", fontSize: 11, color: "#1C2B39" }}>
          <div style={{ marginBottom: 34 }}>{t("signatureInspecteur")}</div>
        </div>
        <div style={{ textAlign: "center", fontSize: 11, color: "#1C2B39" }}>
          <div style={{ marginBottom: 34 }}>{t("signatureResponsable")}</div>
        </div>
      </div>

      <div className="no-print" style={{ textAlign: "center", fontSize: 11, color: "#A99B7F", marginTop: 6, lineHeight: 1.6 }}>
        {t("ficheControleCreeePar")} <b style={{ color: "#5B5346" }}>{c.agent || "—"}</b>{c.date ? ` ${t("leMot")} ${formatDateFR(c.date)}` : ""}
      </div>
    </div>
  );
}

/* Assistant de saisie de la fiche de contrôle technique et surveillance administrative */
function FicheControleTechnique({ type, items, controles, setControles, arrondissement, accessToken, agent, onClose }) {
  const t = useT();
  const fiches = controles.filter((c) => c.type === "controle_technique" && c.sousType === type);
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];
  const itemsCT = CONTROLE_TECHNIQUE_ITEMS[type];
  const itemsSA = SURVEILLANCE_ADMIN_ITEMS[type];

  const emptyCT = Object.fromEntries(itemsCT.map((k) => [k, false]));
  const emptySA = Object.fromEntries(itemsSA.map((k) => [k, false]));

  const [wizStep, setWizStep] = useState(items.length > 0 ? "select" : "vide");
  const [selId, setSelId] = useState("");
  const [dateControle, setDateControle] = useState(new Date().toISOString().slice(0, 10));
  const [controleTechnique, setControleTechnique] = useState(emptyCT);
  const [surveillanceAdmin, setSurveillanceAdmin] = useState(emptySA);
  const [resultatGlobal, setResultatGlobal] = useState("conforme");
  const [observations, setObservations] = useState("");
  const [savedRecord, setSavedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const structureSel = items.find((s) => s.id === selId);

  const validerSelection = () => {
    if (!selId) return;
    setWizStep("form");
  };

  const submitFiche = () => {
    if (!structureSel || !dateControle) return;
    const maintenant = new Date().toISOString();
    const record = {
      id: editingId || uid(),
      type: "controle_technique",
      sousType: type,
      exploitantId: structureSel.id,
      operateur: structureSel.nomStructure,
      responsable: structureSel.responsableNom,
      numeroAutorisation: structureSel.numeroAutorisation,
      commune: current.commune,
      arrondissement: current.label,
      dateControle,
      inspecteur: fullName(agent),
      controleTechnique,
      surveillanceAdmin,
      resultatGlobal,
      observations,
      agent: editingId ? (savedRecord?.agent || agent.nom) : agent.nom,
      date: editingId ? (savedRecord?.date || maintenant.slice(0, 10)) : maintenant.slice(0, 10),
      modifiePar: fullName(agent),
      modifieLe: maintenant,
      modifie: !!editingId,
    };
    const next = editingId ? controles.map((c) => (c.id === editingId ? record : c)) : [...controles, record];
    setControles(next);
    saveKey(STORAGE_KEYS.controles, next, accessToken);
    setSavedRecord(record);
    setEditingId(null);
    setWizStep("apercu");
  };

  const startEdit = () => {
    if (!savedRecord) return;
    const rec = savedRecord;
    setSelId(rec.exploitantId);
    setDateControle(rec.dateControle);
    setControleTechnique({ ...emptyCT, ...rec.controleTechnique });
    setSurveillanceAdmin({ ...emptySA, ...rec.surveillanceAdmin });
    setResultatGlobal(rec.resultatGlobal);
    setObservations(rec.observations || "");
    setEditingId(rec.id);
    setWizStep("form");
  };

  const removeFiche = (id) => {
    if (!window.confirm(t("confirmerSuppressionFiche"))) return;
    const next = controles.filter((c) => c.id !== id);
    setControles(next);
    saveKey(STORAGE_KEYS.controles, next, accessToken);
    if (savedRecord?.id === id) { setSavedRecord(null); setWizStep(items.length > 0 ? "select" : "vide"); }
  };

  const titre = type === "eaux" ? t("controleTechniqueSousTitreEaux") : t("controleTechniqueSousTitreCarrieres");

  return (
    <>
      <div className="no-print" style={{ ...cardStyle, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{titre}</div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        {wizStep === "vide" && <div style={{ fontSize: 12.5, color: "#A8542E" }}>{t("aucuneStructureEnregistree")}</div>}

      {wizStep === "select" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
            <div>
              <label style={labelStyle}>{t("structureLabel2")}</label>
              <select style={inputStyle} value={selId} onChange={(e) => setSelId(e.target.value)}>
                <option value="">{t("choisirOpt")}</option>
                {items.map((s) => <option key={s.id} value={s.id}>{s.nomStructure}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("dateControleLabel")}</label>
              <DateNaissancePicker value={dateControle} onChange={setDateControle} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="button" onClick={validerSelection} style={primaryBtn} disabled={!selId}>{t("validerBtn")}</button>
          </div>
        </div>
      )}

      {wizStep === "form" && structureSel && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>{t("structureLabel2")}</label>
              <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={structureSel.nomStructure} readOnly />
            </div>
            <div>
              <label style={labelStyle}>{t("dateControleLabel")}</label>
              <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={formatDateFR(dateControle)} readOnly />
            </div>
            <div>
              <label style={labelStyle}>{t("inspecteurLabel")}</label>
              <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={fullName(agent)} readOnly />
            </div>
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>{t("sectionControleTechnique")}</div>
          <div style={{ display: "grid", gap: 6, marginBottom: 18 }}>
            {itemsCT.map((key) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-strong)", cursor: "pointer" }}>
                <input type="checkbox" checked={controleTechnique[key]} onChange={(e) => setControleTechnique({ ...controleTechnique, [key]: e.target.checked })} />
                {t("ct_" + key)}
              </label>
            ))}
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>{t("sectionSurveillanceAdmin")}</div>
          <div style={{ display: "grid", gap: 6, marginBottom: 18 }}>
            {itemsSA.map((key) => (
              <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-strong)", cursor: "pointer" }}>
                <input type="checkbox" checked={surveillanceAdmin[key]} onChange={(e) => setSurveillanceAdmin({ ...surveillanceAdmin, [key]: e.target.checked })} />
                {t("sa_" + key)}
              </label>
            ))}
          </div>

          <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>{t("sectionResultat")}</div>
          <select style={{ ...inputStyle, maxWidth: 280, marginBottom: 18 }} value={resultatGlobal} onChange={(e) => setResultatGlobal(e.target.value)}>
            <option value="conforme">{t("resultatConforme")}</option>
            <option value="non_conforme">{t("resultatNonConforme")}</option>
            <option value="reserves">{t("resultatReserves")}</option>
          </select>

          <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>{t("sectionObservationsControle")}</div>
          <textarea style={{ ...inputStyle, minHeight: 70, resize: "vertical", marginBottom: 16 }} value={observations} onChange={(e) => setObservations(e.target.value)} />

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={submitFiche} style={primaryBtn}>{t("enregistrer")}</button>
            <button type="button" onClick={() => setWizStep("select")} style={ghostBtn}>{t("annuler")}</button>
          </div>
        </div>
      )}
      </div>

      {wizStep === "apercu" && savedRecord && (
        <div className="no-print" style={{ ...cardStyle, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> {t("telechargerPdf")}</button>
            <button type="button" onClick={startEdit} style={ghostBtn}><Pencil size={14} /> {t("modifier")}</button>
            <button type="button" onClick={() => removeFiche(savedRecord.id)} style={{ ...ghostBtn, color: "#A8542E", borderColor: "#E3B8A8" }}><Trash2 size={14} /> {t("supprimer")}</button>
            <button type="button" onClick={() => { setSavedRecord(null); setWizStep("select"); setSelId(""); }} style={ghostBtn}>{t("fermer")}</button>
          </div>
        </div>
      )}
      {wizStep === "apercu" && savedRecord && <ControleTechniqueApercu record={savedRecord} />}

      <div className="no-print" style={{ marginTop: 22, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9962C", marginBottom: 10 }}>
          {t("historiqueControles")} ({fiches.length})
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {fiches.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{t("aucuneFicheControleEnreg")}</div>}
          {fiches.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--border-light)", borderRadius: 4, padding: "8px 10px" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{c.operateur} — {formatDateFR(c.dateControle)}</div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                  {c.resultatGlobal === "conforme" ? t("resultatConforme") : c.resultatGlobal === "non_conforme" ? t("resultatNonConforme") : t("resultatReserves")}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => { setSavedRecord(c); setWizStep("apercu"); }} title={t("voirFicheTitle")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  <Eye size={15} />
                </button>
                <button type="button" onClick={() => removeFiche(c.id)} title={t("supprimerTitle")} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8542E" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* Onglet du tableau de bord : contrôle technique et surveillance administrative (choix eaux / carrières puis exploitant) */
/* Fiche imprimable — reproduction fidèle du modèle MINMIDT « Fiche de surveillance administrative,
   de contrôle et de suivi de la sincérité des déclarations et de la qualité de l'eau » */
function ControleEauApercu({ record: c, arrondissementLabel }) {
  const sec = { fontWeight: 700, fontSize: 10.5, textTransform: "uppercase", textDecoration: "underline", margin: "16px 0 8px", color: "#1C2B39" };
  const label = { fontWeight: 700, fontSize: 10.5, color: "#1C2B39" };
  const val = { fontSize: 10.5, color: "#1C2B39", borderBottom: "1px dotted #999", display: "inline-block", minWidth: 180, paddingLeft: 4 };
  const chk = (checked) => (checked ? "☑" : "☐");
  const d = c.identification || {};
  const eq = c.equipe || [];
  const cl = c.checklist || {};
  const qp = c.qualiteParams || {};
  const sy = c.synthese || {};

  return (
    <div className="print-area" style={{ ...cardStyle, marginBottom: 18, maxWidth: 800, width: "100%", margin: "0 auto 18px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <DeclarationLetterhead />

      <div style={{ fontWeight: 700, fontSize: 12, textAlign: "center", marginBottom: 16, lineHeight: 1.4 }}>
        FICHE DE SURVEILLANCE ADMINISTRATIVE, DE CONTRÔLE ET DE SUIVI DE LA SINCÉRITÉ DES DÉCLARATIONS ET DE LA QUALITÉ DE L'EAU
      </div>

      <div style={sec}>I. Identification de l'établissement</div>
      <div style={{ display: "grid", gap: 5, fontSize: 10.5 }}>
        <div><span style={label}>1. Raison sociale : </span><span style={val}>{d.raisonSociale || ""}</span></div>
        <div><span style={label}>2. Référence du permis d'exploitation : </span><span style={val}>{d.refPermis || ""}</span></div>
        <div><span style={label}>3. Référence autorisation de conditionnement : </span><span style={val}>{d.refConditionnement || ""}</span></div>
        <div><span style={label}>4. Adresse du siège social : </span><span style={val}>{d.adresseSiege || ""}</span></div>
        <div><span style={label}>5. Contacts (Téléphone / Email) : </span><span style={val}>{d.contacts || ""}</span></div>
        <div><span style={label}>6. Nom de l'exploitant : </span><span style={val}>{d.nomExploitant || ""}</span></div>
        <div><span style={label}>7. Interlocuteur principal : </span><span style={val}>{d.interlocuteur || ""}</span></div>
        <div>
          <span style={label}>8. Type d'eau exploitée / produite : </span>
          {EAU_TYPE_OPTIONS.map((o) => <span key={o.key} style={{ marginRight: 10 }}>{chk(d.typeEau?.[o.key])} {o.label}</span>)}
          <span>{chk(d.typeEauAutre)} Autre : <span style={val}>{d.typeEauAutreTexte || ""}</span></span>
        </div>
        <div>
          <span style={label}>9. Nature de l'activité : </span>
          {EAU_ACTIVITE_OPTIONS.map((o) => <span key={o.key} style={{ marginRight: 10 }}>{chk(d.natureActivite?.[o.key])} {o.label}</span>)}
        </div>
        <div><span style={label}>10. Capacité de production déclarée : </span><span style={val}>{d.capaciteProduction || ""}</span></div>
        <div><span style={label}>11. Effectif du personnel : </span><span style={val}>{d.effectifPersonnel || ""}</span></div>
        <div><span style={label}>12. Date de mise en service de l'unité : </span><span style={val}>{formatDateFR(d.dateMiseService) || ""}</span></div>
      </div>

      <div style={sec}>II. Composition de l'équipe de contrôle et représentant de l'entreprise</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
        <tbody>
          <tr>
            <td style={{ ...thControle }}>N°</td><td style={thControle}>Nom des inspecteurs</td><td style={thControle}>Fonction</td><td style={thControle}>Adresse / Téléphone</td>
          </tr>
          {eq.map((row, i) => (
            <tr key={i}>
              <td style={tdControle}>{i + 1}</td><td style={tdControle}>{row.nom}</td><td style={tdControle}>{row.fonction}</td><td style={tdControle}>{row.adresseTel}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={sec}>III. Objet de la mission</div>
      <div style={{ fontSize: 10, lineHeight: 1.5, textAlign: "justify" }}>
        La présente mission a pour objet de procéder à la <b>surveillance administrative</b>, au <b>contrôle de la conformité de l'établissement</b>,
        au <b>suivi de la sincérité des déclarations faites à l'administration</b>, ainsi qu'à la <b>vérification de la qualité de l'eau exploitée,
        produite, conditionnée et mise sur le marché</b>, conformément à la réglementation en vigueur applicable aux établissements classés,
        aux activités industrielles et aux unités de production d'eau destinées à la consommation.
      </div>

      <div style={sec}>IV. Documents administratifs et techniques à vérifier</div>
      {EAU_DOCUMENTS_VERIF.map((grp) => (
        <div key={grp.section}>
          <div style={{ fontWeight: 700, fontSize: 9.5, margin: "6px 0 2px" }}>{grp.section}</div>
          <ChecklistPrintTable items={grp.items} values={cl.documentsVerif} />
        </div>
      ))}

      <div style={sec}>V. Surveillance administrative de l'établissement</div>
      <ChecklistPrintTable items={EAU_SURVEILLANCE_ETAB} values={cl.surveillanceEtab} />

      <div style={sec}>VI. Contrôle des installations de captage, de traitement et de conditionnement</div>
      <div style={{ fontWeight: 700, fontSize: 10, margin: "6px 0 2px", textDecoration: "underline" }}>A. Captage et approvisionnement en eau</div>
      <ChecklistPrintTable items={EAU_CAPTAGE_ITEMS} values={cl.captage} />
      <div style={{ fontWeight: 700, fontSize: 10, margin: "6px 0 2px", textDecoration: "underline" }}>B. Traitement, stockage et conditionnement</div>
      <ChecklistPrintTable items={EAU_TRAITEMENT_ITEMS} values={cl.traitement} />

      <div style={sec}>VII. Contrôle de la qualité de l'eau</div>
      <div style={{ fontWeight: 700, fontSize: 10, margin: "6px 0 2px", textDecoration: "underline" }}>A. Organisation du contrôle qualité</div>
      <ChecklistPrintTable items={EAU_QUALITE_ORG_ITEMS} values={cl.qualiteOrg} />

      <div style={{ fontWeight: 700, fontSize: 10, margin: "10px 0 4px", textDecoration: "underline" }}>
        B. Paramètres de qualité à vérifier à partir des rapports d'analyses disponibles
      </div>
      <div style={{ fontWeight: 700, fontSize: 9.5, margin: "4px 0 2px" }}>1. Paramètres organoleptiques</div>
      <ChecklistPrintTable items={EAU_PARAMS_ORGANOLEPTIQUES} values={qp.paramOrgano} colYes="Conforme" colNo="Non conforme" />
      <div style={{ fontWeight: 700, fontSize: 9.5, margin: "4px 0 2px" }}>2. Paramètres physico-chimiques</div>
      <ChecklistPrintTable items={EAU_PARAMS_PHYSICOCHIMIQUES} values={qp.paramPhysico} colYes="Conforme" colNo="Non conforme" />
      <div style={{ fontWeight: 700, fontSize: 9.5, margin: "4px 0 2px" }}>3. Paramètres microbiologiques</div>
      <ChecklistPrintTable items={EAU_PARAMS_MICROBIOLOGIQUES} values={qp.paramMicrobio} colYes="Conforme" colNo="Non conforme" />

      <div style={{ fontWeight: 700, fontSize: 10, margin: "10px 0 4px", textDecoration: "underline" }}>B. Conclusion sur la sincérité des déclarations</div>
      <div style={{ fontSize: 10, marginBottom: 4 }}><b>Appréciation globale :</b></div>
      <div style={{ fontSize: 10, display: "grid", gap: 3, marginBottom: 8 }}>
        {EAU_APPRECIATION_OPTIONS.map((o) => <div key={o.key}>{chk(sy.appreciationGlobale === o.key)} {o.label}</div>)}
      </div>
      <div style={{ fontSize: 10 }}><b>Motifs / éléments constatés :</b></div>
      <div style={{ fontSize: 10, borderBottom: "1px dotted #999", minHeight: 30, whiteSpace: "pre-wrap" }}>{sy.motifsConstates || ""}</div>

      <div style={sec}>VIII. Constats généraux de la mission</div>
      <div style={{ fontWeight: 700, fontSize: 10, textDecoration: "underline" }}>A. Points satisfaisants</div>
      {(sy.pointsSatisfaisants || []).map((l, i) => (
        <div key={i} style={{ fontSize: 10, borderBottom: "1px dotted #999", minHeight: 16 }}>{i + 1}. {l}</div>
      ))}
      <div style={{ fontWeight: 700, fontSize: 10, textDecoration: "underline", marginTop: 8 }}>B. Non-conformités et insuffisances relevées</div>
      {(sy.nonConformites || []).map((l, i) => (
        <div key={i} style={{ fontSize: 10, borderBottom: "1px dotted #999", minHeight: 16 }}>{i + 1}. {l}</div>
      ))}
      <div style={{ fontWeight: 700, fontSize: 10, textDecoration: "underline", marginTop: 8 }}>C. Éléments nécessitant un complément d'information</div>
      {(sy.elementsComplement || []).map((l, i) => (
        <div key={i} style={{ fontSize: 10, borderBottom: "1px dotted #999", minHeight: 16 }}>{i + 1}. {l}</div>
      ))}

      <div style={sec}>IX. Mesures prescrites et recommandations</div>
      <div style={{ fontSize: 10 }}>Au regard des constats effectués, il est prescrit à l'établissement de :</div>
      {(sy.mesuresPrescrites || []).map((l, i) => (
        <div key={i} style={{ fontSize: 10, borderBottom: "1px dotted #999", minHeight: 16 }}>{i + 1}. {l}</div>
      ))}
      <div style={{ fontSize: 10, marginTop: 8 }}><b>Pièces justificatives à transmettre au MINMIDT :</b></div>
      <div style={{ fontSize: 10, borderBottom: "1px dotted #999", minHeight: 24, whiteSpace: "pre-wrap" }}>{sy.piecesJustificatives || ""}</div>

      <div style={sec}>X. Conclusion de la mission</div>
      <div style={{ fontSize: 10, lineHeight: 1.5 }}>
        À l'issue de la mission de surveillance administrative, de contrôle et de suivi effectuée au sein de l'établissement <b>{d.raisonSociale || "…………"}</b>, il ressort que :
      </div>
      <div style={{ fontSize: 10, display: "grid", gap: 3, margin: "6px 0 16px" }}>
        {EAU_CONCLUSION_OPTIONS.map((o) => <div key={o.key}>{chk(sy.conclusion?.[o.key])} {o.label}</div>)}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, padding: "0 16px 10px" }}>
        <div style={{ textAlign: "center", fontSize: 10.5, color: "#1C2B39" }}><div style={{ marginBottom: 34 }}>Signature de l'inspecteur</div></div>
        <div style={{ textAlign: "center", fontSize: 10.5, color: "#1C2B39" }}><div style={{ marginBottom: 34 }}>Signature du responsable de la structure</div></div>
      </div>

      <div className="no-print" style={{ textAlign: "center", fontSize: 11, color: "#A99B7F", marginTop: 6, lineHeight: 1.6 }}>
        Fiche créée par <b style={{ color: "#5B5346" }}>{c.agent || "—"}</b>{c.date ? ` le ${formatDateFR(c.date)}` : ""}
      </div>
    </div>
  );
}
const thControle = { border: "1px solid #DCD1B8", padding: "3px 4px", fontSize: 8.5, color: "#1C2B39", background: "#F1EBDD", fontWeight: 700, textAlign: "center" };
const tdControle = { border: "1px solid #DCD1B8", padding: "3px 4px", fontSize: 8.5, color: "#1C2B39", minHeight: 16 };

/* Assistant de saisie — fiche complète de surveillance administrative et contrôle technique des eaux */
function FicheControleEau({ items, controles, setControles, arrondissement, accessToken, agent, onClose }) {
  const t = useT();
  const fiches = controles.filter((c) => c.type === "controle_technique" && c.sousType === "eaux");
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];

  const [wizStep, setWizStep] = useState(items.length > 0 ? "select" : "vide");
  const [selId, setSelId] = useState("");
  const [dateControle, setDateControle] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState(emptyEauControleData());
  const [savedRecord, setSavedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const structureSel = items.find((s) => s.id === selId);

  const validerSelection = () => {
    if (!selId || !structureSel) return;
    setData((d) => ({
      ...d,
      raisonSociale: structureSel.nomStructure,
      refPermis: structureSel.numeroAutorisation || "",
      nomExploitant: structureSel.responsableNom || "",
      contacts: structureSel.responsableTelephone || "",
    }));
    setWizStep("form");
  };

  const setList = (field, i, v) => setData((d) => ({ ...d, [field]: d[field].map((x, idx) => (idx === i ? v : x)) }));

  const submitFiche = () => {
    if (!structureSel || !dateControle) return;
    const maintenant = new Date().toISOString();
    const record = {
      id: editingId || uid(),
      type: "controle_technique",
      sousType: "eaux",
      exploitantId: structureSel.id,
      operateur: data.raisonSociale,
      commune: current.commune,
      arrondissement: current.label,
      dateControle,
      inspecteur: fullName(agent),
      identification: {
        raisonSociale: data.raisonSociale, refPermis: data.refPermis, refConditionnement: data.refConditionnement,
        adresseSiege: data.adresseSiege, contacts: data.contacts, nomExploitant: data.nomExploitant, interlocuteur: data.interlocuteur,
        typeEau: data.typeEau, typeEauAutre: data.typeEauAutre, typeEauAutreTexte: data.typeEauAutreTexte,
        natureActivite: data.natureActivite, capaciteProduction: data.capaciteProduction, effectifPersonnel: data.effectifPersonnel,
        dateMiseService: data.dateMiseService,
      },
      equipe: data.equipe,
      checklist: {
        documentsVerif: data.documentsVerif, surveillanceEtab: data.surveillanceEtab,
        captage: data.captage, traitement: data.traitement, qualiteOrg: data.qualiteOrg,
      },
      qualiteParams: { paramOrgano: data.paramOrgano, paramPhysico: data.paramPhysico, paramMicrobio: data.paramMicrobio },
      synthese: {
        appreciationGlobale: data.appreciationGlobale, motifsConstates: data.motifsConstates,
        pointsSatisfaisants: data.pointsSatisfaisants, nonConformites: data.nonConformites, elementsComplement: data.elementsComplement,
        mesuresPrescrites: data.mesuresPrescrites, piecesJustificatives: data.piecesJustificatives, conclusion: data.conclusion,
      },
      agent: editingId ? (savedRecord?.agent || agent.nom) : agent.nom,
      date: editingId ? (savedRecord?.date || maintenant.slice(0, 10)) : maintenant.slice(0, 10),
      modifiePar: fullName(agent),
      modifieLe: maintenant,
      modifie: !!editingId,
    };
    const next = editingId ? controles.map((c) => (c.id === editingId ? record : c)) : [...controles, record];
    setControles(next);
    saveKey(STORAGE_KEYS.controles, next, accessToken);
    setSavedRecord(record);
    setEditingId(null);
    setWizStep("apercu");
  };

  const startEdit = () => {
    if (!savedRecord) return;
    const rec = savedRecord;
    setSelId(rec.exploitantId);
    setDateControle(rec.dateControle);
    setData({
      ...emptyEauControleData(),
      ...rec.identification,
      equipe: rec.equipe || emptyEauControleData().equipe,
      documentsVerif: rec.checklist?.documentsVerif || emptyOuiNonMap(EAU_DOCUMENTS_VERIF.flatMap((g) => g.items)),
      surveillanceEtab: rec.checklist?.surveillanceEtab || emptyOuiNonMap(EAU_SURVEILLANCE_ETAB),
      captage: rec.checklist?.captage || emptyOuiNonMap(EAU_CAPTAGE_ITEMS),
      traitement: rec.checklist?.traitement || emptyOuiNonMap(EAU_TRAITEMENT_ITEMS),
      qualiteOrg: rec.checklist?.qualiteOrg || emptyOuiNonMap(EAU_QUALITE_ORG_ITEMS),
      paramOrgano: rec.qualiteParams?.paramOrgano || emptyOuiNonMap(EAU_PARAMS_ORGANOLEPTIQUES),
      paramPhysico: rec.qualiteParams?.paramPhysico || emptyOuiNonMap(EAU_PARAMS_PHYSICOCHIMIQUES),
      paramMicrobio: rec.qualiteParams?.paramMicrobio || emptyOuiNonMap(EAU_PARAMS_MICROBIOLOGIQUES),
      ...rec.synthese,
    });
    setEditingId(rec.id);
    setWizStep("form");
  };

  const removeFiche = (id) => {
    if (!window.confirm(t("confirmerSuppressionFiche"))) return;
    const next = controles.filter((c) => c.id !== id);
    setControles(next);
    saveKey(STORAGE_KEYS.controles, next, accessToken);
    if (savedRecord?.id === id) { setSavedRecord(null); setWizStep(items.length > 0 ? "select" : "vide"); }
  };

  return (
    <>
      <div className="no-print" style={{ ...cardStyle, ...typeBgStyle("eaux"), marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t("controleTechniqueSousTitreEaux")}</div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        {wizStep === "vide" && <div style={{ fontSize: 12.5, color: "#A8542E" }}>{t("aucuneStructureEnregistree")}</div>}

      {wizStep === "select" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
            <div>
              <label style={labelStyle}>{t("structureLabel2")}</label>
              <select style={inputStyle} value={selId} onChange={(e) => setSelId(e.target.value)}>
                <option value="">{t("choisirOpt")}</option>
                {items.map((s) => <option key={s.id} value={s.id}>{s.nomStructure}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("dateControleLabel")}</label>
              <DateNaissancePicker value={dateControle} onChange={setDateControle} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="button" onClick={validerSelection} style={primaryBtn} disabled={!selId}>{t("validerBtn")}</button>
          </div>
        </div>
      )}

      {wizStep === "form" && structureSel && (
        <div style={{ display: "grid", gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>I. Identification de l'établissement</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
              <div><label style={labelStyle}>Raison sociale</label><input style={inputStyle} value={data.raisonSociale} onChange={(e) => setData({ ...data, raisonSociale: e.target.value })} /></div>
              <div><label style={labelStyle}>Référence du permis d'exploitation</label><input style={inputStyle} value={data.refPermis} onChange={(e) => setData({ ...data, refPermis: e.target.value })} /></div>
              <div><label style={labelStyle}>Référence autorisation de conditionnement</label><input style={inputStyle} value={data.refConditionnement} onChange={(e) => setData({ ...data, refConditionnement: e.target.value })} /></div>
              <div><label style={labelStyle}>Adresse du siège social</label><input style={inputStyle} value={data.adresseSiege} onChange={(e) => setData({ ...data, adresseSiege: e.target.value })} /></div>
              <div><label style={labelStyle}>Contacts (Téléphone / Email)</label><input style={inputStyle} value={data.contacts} onChange={(e) => setData({ ...data, contacts: e.target.value })} /></div>
              <div><label style={labelStyle}>Nom de l'exploitant</label><input style={inputStyle} value={data.nomExploitant} onChange={(e) => setData({ ...data, nomExploitant: e.target.value })} /></div>
              <div><label style={labelStyle}>Interlocuteur principal</label><input style={inputStyle} value={data.interlocuteur} onChange={(e) => setData({ ...data, interlocuteur: e.target.value })} /></div>
              <div><label style={labelStyle}>Capacité de production déclarée</label><input style={inputStyle} value={data.capaciteProduction} onChange={(e) => setData({ ...data, capaciteProduction: e.target.value })} /></div>
              <div><label style={labelStyle}>Effectif du personnel</label><input style={inputStyle} value={data.effectifPersonnel} onChange={(e) => setData({ ...data, effectifPersonnel: e.target.value })} /></div>
              <div><label style={labelStyle}>Date de mise en service de l'unité</label><DateNaissancePicker value={data.dateMiseService} onChange={(v) => setData({ ...data, dateMiseService: v })} /></div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Type d'eau exploitée / produite</label>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {EAU_TYPE_OPTIONS.map((o) => (
                  <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                    <input type="checkbox" checked={data.typeEau[o.key]} onChange={(e) => setData({ ...data, typeEau: { ...data.typeEau, [o.key]: e.target.checked } })} /> {o.label}
                  </label>
                ))}
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" checked={data.typeEauAutre} onChange={(e) => setData({ ...data, typeEauAutre: e.target.checked })} /> Autre :
                </label>
                <input style={{ ...inputStyle, maxWidth: 200 }} value={data.typeEauAutreTexte} onChange={(e) => setData({ ...data, typeEauAutreTexte: e.target.value })} />
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Nature de l'activité</label>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {EAU_ACTIVITE_OPTIONS.map((o) => (
                  <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                    <input type="checkbox" checked={data.natureActivite[o.key]} onChange={(e) => setData({ ...data, natureActivite: { ...data.natureActivite, [o.key]: e.target.checked } })} /> {o.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>II. Équipe de contrôle</div>
            <div style={{ display: "grid", gap: 8 }}>
              {data.equipe.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <input style={inputStyle} placeholder={`Inspecteur ${i + 1} — nom`} value={row.nom} onChange={(e) => setList("equipe", i, { ...row, nom: e.target.value })} />
                  <input style={inputStyle} placeholder="Fonction" value={row.fonction} onChange={(e) => setList("equipe", i, { ...row, fonction: e.target.value })} />
                  <input style={inputStyle} placeholder="Adresse / Téléphone" value={row.adresseTel} onChange={(e) => setList("equipe", i, { ...row, adresseTel: e.target.value })} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>IV. Documents administratifs et techniques à vérifier</div>
            {EAU_DOCUMENTS_VERIF.map((grp) => (
              <div key={grp.section} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 600, fontSize: 12.5, marginBottom: 6 }}>{grp.section}</div>
                <ChecklistFormSection items={grp.items} values={data.documentsVerif} onChange={(v) => setData({ ...data, documentsVerif: v })} />
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>V. Surveillance administrative de l'établissement</div>
            <ChecklistFormSection items={EAU_SURVEILLANCE_ETAB} values={data.surveillanceEtab} onChange={(v) => setData({ ...data, surveillanceEtab: v })} />
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>VI-A. Captage et approvisionnement en eau</div>
            <ChecklistFormSection items={EAU_CAPTAGE_ITEMS} values={data.captage} onChange={(v) => setData({ ...data, captage: v })} />
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>VI-B. Traitement, stockage et conditionnement</div>
            <ChecklistFormSection items={EAU_TRAITEMENT_ITEMS} values={data.traitement} onChange={(v) => setData({ ...data, traitement: v })} />
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>VII-A. Organisation du contrôle qualité</div>
            <ChecklistFormSection items={EAU_QUALITE_ORG_ITEMS} values={data.qualiteOrg} onChange={(v) => setData({ ...data, qualiteOrg: v })} />
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>VII-B1. Paramètres organoleptiques</div>
            <ChecklistFormSection items={EAU_PARAMS_ORGANOLEPTIQUES} values={data.paramOrgano} onChange={(v) => setData({ ...data, paramOrgano: v })} colYes="Conforme" colNo="Non conforme" />
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>VII-B2. Paramètres physico-chimiques</div>
            <ChecklistFormSection items={EAU_PARAMS_PHYSICOCHIMIQUES} values={data.paramPhysico} onChange={(v) => setData({ ...data, paramPhysico: v })} colYes="Conforme" colNo="Non conforme" />
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>VII-B3. Paramètres microbiologiques</div>
            <ChecklistFormSection items={EAU_PARAMS_MICROBIOLOGIQUES} values={data.paramMicrobio} onChange={(v) => setData({ ...data, paramMicrobio: v })} colYes="Conforme" colNo="Non conforme" />
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>Conclusion sur la sincérité des déclarations</div>
            <label style={labelStyle}>Appréciation globale</label>
            <div style={{ display: "grid", gap: 6, marginBottom: 10 }}>
              {EAU_APPRECIATION_OPTIONS.map((o) => (
                <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer" }}>
                  <input type="radio" name="appreciation" checked={data.appreciationGlobale === o.key} onChange={() => setData({ ...data, appreciationGlobale: o.key })} /> {o.label}
                </label>
              ))}
            </div>
            <label style={labelStyle}>Motifs / éléments constatés</label>
            <textarea style={{ ...inputStyle, minHeight: 60, resize: "vertical" }} value={data.motifsConstates} onChange={(e) => setData({ ...data, motifsConstates: e.target.value })} />
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>VIII. Constats généraux de la mission</div>
            <label style={labelStyle}>A. Points satisfaisants</label>
            {data.pointsSatisfaisants.map((v, i) => (
              <input key={i} style={{ ...inputStyle, marginBottom: 6 }} placeholder={`${i + 1}.`} value={v} onChange={(e) => setList("pointsSatisfaisants", i, e.target.value)} />
            ))}
            <label style={{ ...labelStyle, marginTop: 10 }}>B. Non-conformités et insuffisances relevées</label>
            {data.nonConformites.map((v, i) => (
              <input key={i} style={{ ...inputStyle, marginBottom: 6 }} placeholder={`${i + 1}.`} value={v} onChange={(e) => setList("nonConformites", i, e.target.value)} />
            ))}
            <label style={{ ...labelStyle, marginTop: 10 }}>C. Éléments nécessitant un complément d'information</label>
            {data.elementsComplement.map((v, i) => (
              <input key={i} style={{ ...inputStyle, marginBottom: 6 }} placeholder={`${i + 1}.`} value={v} onChange={(e) => setList("elementsComplement", i, e.target.value)} />
            ))}
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>IX. Mesures prescrites et recommandations</div>
            {data.mesuresPrescrites.map((v, i) => (
              <input key={i} style={{ ...inputStyle, marginBottom: 6 }} placeholder={`${i + 1}.`} value={v} onChange={(e) => setList("mesuresPrescrites", i, e.target.value)} />
            ))}
            <label style={{ ...labelStyle, marginTop: 10 }}>Pièces justificatives à transmettre au MINMIDT</label>
            <textarea style={{ ...inputStyle, minHeight: 50, resize: "vertical" }} value={data.piecesJustificatives} onChange={(e) => setData({ ...data, piecesJustificatives: e.target.value })} />
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>X. Conclusion de la mission</div>
            <div style={{ display: "grid", gap: 6 }}>
              {EAU_CONCLUSION_OPTIONS.map((o) => (
                <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer" }}>
                  <input type="checkbox" checked={data.conclusion[o.key]} onChange={(e) => setData({ ...data, conclusion: { ...data.conclusion, [o.key]: e.target.checked } })} /> {o.label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={submitFiche} style={primaryBtn}>{t("enregistrer")}</button>
            <button type="button" onClick={() => setWizStep("select")} style={ghostBtn}>{t("annuler")}</button>
          </div>
        </div>
      )}
      </div>

      {wizStep === "apercu" && savedRecord && (
        <div className="no-print" style={{ ...cardStyle, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> {t("telechargerPdf")}</button>
            <button type="button" onClick={startEdit} style={ghostBtn}><Pencil size={14} /> {t("modifier")}</button>
            <button type="button" onClick={() => removeFiche(savedRecord.id)} style={{ ...ghostBtn, color: "#A8542E", borderColor: "#E3B8A8" }}><Trash2 size={14} /> {t("supprimer")}</button>
            <button type="button" onClick={() => { setSavedRecord(null); setWizStep("select"); setSelId(""); setData(emptyEauControleData()); }} style={ghostBtn}>{t("fermer")}</button>
          </div>
        </div>
      )}
      {wizStep === "apercu" && savedRecord && <ControleEauApercu record={savedRecord} arrondissementLabel={current.label} />}

      <div className="no-print" style={{ marginTop: 22, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9962C", marginBottom: 10 }}>
          {t("historiqueControles")} ({fiches.length})
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {fiches.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{t("aucuneFicheControleEnreg")}</div>}
          {fiches.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--border-light)", borderRadius: 4, padding: "8px 10px" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{c.operateur} — {formatDateFR(c.dateControle)}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => { setSavedRecord(c); setWizStep("apercu"); }} title={t("voirFicheTitle")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  <Eye size={15} />
                </button>
                <button type="button" onClick={() => removeFiche(c.id)} title={t("supprimerTitle")} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8542E" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

/* Aperçu imprimable (A4) — fiche de contrôle technique et de surveillance administrative des carrières.
   En-tête identique à celle de la fiche des exploitants des eaux (DeclarationLetterhead). */
function ControleCarriereApercu({ record: c }) {
  const sec = { fontWeight: 700, fontSize: 10.5, textTransform: "uppercase", textDecoration: "underline", margin: "16px 0 8px", color: "#1C2B39" };
  const label = { fontWeight: 700, fontSize: 10.5, color: "#1C2B39" };
  const val = { fontSize: 10.5, color: "#1C2B39", borderBottom: "1px dotted #999", display: "inline-block", minWidth: 140, paddingLeft: 4 };
  const chk = (checked) => (checked ? "☑" : "☐");
  const d = c.identification || {};
  const eq = c.equipe || [];
  const cl = c.checklist || {};
  const sy = c.synthese || {};
  const inf = c.infractions || [];

  return (
    <div className="print-area" style={{ ...cardStyle, marginBottom: 18, maxWidth: 800, width: "100%", margin: "0 auto 18px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <DeclarationLetterhead />

      <div style={{ fontWeight: 700, fontSize: 12, textAlign: "center", marginBottom: 16, lineHeight: 1.4 }}>
        FICHE DE CONTRÔLE TECHNIQUE ET DE SURVEILLANCE ADMINISTRATIVE DES CARRIÈRES
      </div>

      <div style={sec}>I. Identification de la carrière</div>
      <div style={{ display: "grid", gap: 5, fontSize: 10.5 }}>
        <div><span style={label}>Nom / raison sociale : </span><span style={val}>{d.raisonSociale || ""}</span></div>
        <div><span style={label}>Nom de la carrière : </span><span style={val}>{d.nomCarriere || ""}</span></div>
        <div><span style={label}>Exploitant / Promoteur : </span><span style={val}>{d.exploitantPromoteur || ""}</span></div>
        <div><span style={label}>Responsable : </span><span style={val}>{d.responsable || ""}</span> <span style={label}>Tél. : </span><span style={val}>{d.responsableTel || ""}</span></div>
        <div><span style={label}>Localité / Village : </span><span style={val}>{d.localite || ""}</span></div>
        <div><span style={label}>Arrondissement : </span><span style={val}>{d.arrondissementTxt || ""}</span> <span style={label}>Commune : </span><span style={val}>{d.communeTxt || ""}</span></div>
        <div>
          <span style={label}>Substance(s) : </span>
          {CARRIERE_SUBSTANCE_OPTIONS.map((o) => <span key={o.key} style={{ marginRight: 10 }}>{chk(d.substances?.[o.key])} {o.label}</span>)}
          <span>{chk(d.substanceAutre)} Autre : <span style={val}>{d.substanceAutreTexte || ""}</span></span>
        </div>
      </div>

      <div style={sec}>II. Localisation du site</div>
      <div style={{ display: "grid", gap: 5, fontSize: 10.5 }}>
        <div>
          <span style={label}>Latitude : </span><span style={val}>{d.latitude || ""}</span>{" "}
          <span style={label}>Longitude : </span><span style={val}>{d.longitude || ""}</span>{" "}
          <span style={label}>Altitude : </span><span style={val}>{d.altitude || ""}</span>
        </div>
        <div>
          <span style={label}>Superficie autorisée : </span><span style={val}>{d.superficieAutorisee || ""}</span> ha{" "}
          <span style={label}>Superficie exploitée : </span><span style={val}>{d.superficieExploitee || ""}</span> ha
        </div>
        <div>
          <span style={label}>Périmètre matérialisé : </span>
          {chk(d.perimetreMaterialise === "oui")} Oui &nbsp; {chk(d.perimetreMaterialise === "non")} Non &nbsp; {chk(d.perimetreMaterialise === "partiellement")} Partiellement
        </div>
      </div>

      <div style={sec}>III. Situation administrative</div>
      <ChecklistPrintTable items={CARRIERE_SITUATION_ADMIN_ITEMS} values={cl.situationAdmin} naLabel="N/A" />
      <div style={{ fontSize: 10.5, display: "grid", gap: 4 }}>
        <div><span style={label}>N° du titre / autorisation : </span><span style={val}>{d.numeroTitre || ""}</span></div>
        <div>
          <span style={label}>Délivrance : </span><span style={val}>{formatDateFR(d.dateDelivranceTitre) || ""}</span>{" "}
          <span style={label}>Expiration : </span><span style={val}>{formatDateFR(d.dateExpirationTitre) || ""}</span>
        </div>
      </div>

      <div style={sec}>IV. Contrôle technique de l'exploitation</div>
      <ChecklistPrintTable items={CARRIERE_CONTROLE_TECHNIQUE_ITEMS} values={cl.controleTechnique} colYes="C" colNo="NC" naLabel="N/A" />
      <div style={{ fontSize: 9.5 }}>C = Conforme &nbsp; NC = Non conforme &nbsp; N/A = Non applicable</div>

      <div style={sec}>V. Production et transport</div>
      <div style={{ display: "grid", gap: 5, fontSize: 10.5 }}>
        <div>
          <span style={label}>Production constatée / estimée : </span><span style={val}>{d.productionConstatee || ""}</span>{" "}
          <span style={label}>Unité : </span><span style={val}>{d.productionUnite || ""}</span>{" "}
          <span style={label}>Stock constaté : </span><span style={val}>{d.stockConstate || ""}</span>
        </div>
        <div><span style={label}>Destination : </span><span style={val}>{d.destination || ""}</span></div>
        <div><span style={label}>Moyens de transport : </span><span style={val}>{d.moyensTransport || ""}</span></div>
        <div>
          <span style={label}>Documents de transport : </span>
          {chk(d.documentsTransport === "oui")} Oui &nbsp; {chk(d.documentsTransport === "non")} Non &nbsp; {chk(d.documentsTransport === "na")} N/A
        </div>
        <div><span style={label}>Observations : </span><span style={{ ...val, minWidth: 400 }}>{d.observationsProduction || ""}</span></div>
      </div>

      <div style={sec}>VI. Sécurité</div>
      <ChecklistPrintTable items={CARRIERE_SECURITE_ITEMS} values={cl.securite} naLabel="N/A" showObservations={false} />

      <div style={sec}>VII. Environnement et remise en état</div>
      <ChecklistPrintTable items={CARRIERE_ENVIRONNEMENT_ITEMS} values={cl.environnement} naLabel="N/A" />

      <div style={sec}>VIII. Constats du contrôle</div>
      <div style={{ fontWeight: 700, fontSize: 10, textDecoration: "underline" }}>A. Constatations administratives</div>
      <div style={{ fontSize: 10, borderBottom: "1px dotted #999", minHeight: 24, whiteSpace: "pre-wrap" }}>{sy.constatsAdmin || ""}</div>
      <div style={{ fontWeight: 700, fontSize: 10, textDecoration: "underline", marginTop: 8 }}>B. Constatations techniques</div>
      <div style={{ fontSize: 10, borderBottom: "1px dotted #999", minHeight: 24, whiteSpace: "pre-wrap" }}>{sy.constatsTechniques || ""}</div>
      <div style={{ fontWeight: 700, fontSize: 10, textDecoration: "underline", marginTop: 8 }}>C. Sécurité / environnement</div>
      <div style={{ fontSize: 10, borderBottom: "1px dotted #999", minHeight: 24, whiteSpace: "pre-wrap" }}>{sy.constatsSecuriteEnv || ""}</div>

      <div style={sec}>IX. Infractions / non-conformités</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9, marginBottom: 6 }}>
        <tbody>
          <tr>
            <td style={thControle}>N°</td><td style={thControle}>Manquement / anomalie constatée</td><td style={thControle}>Gravité</td><td style={thControle}>Mesure proposée</td>
          </tr>
          {inf.map((row, i) => (
            <tr key={i}>
              <td style={tdControle}>{i + 1}</td>
              <td style={tdControle}>{row.manquement}</td>
              <td style={tdControle}>{row.gravite ? { F: "Faible", M: "Majeure", G: "Grave / danger" }[row.gravite] : ""}</td>
              <td style={tdControle}>{row.mesureProposee}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontSize: 9.5 }}>F = Faible &nbsp; M = Majeure &nbsp; G = Grave / danger</div>
      <div style={{ fontSize: 10.5 }}><span style={label}>Référence du texte, si identifiée : </span><span style={val}>{sy.referenceTexte || ""}</span></div>

      <div style={sec}>X. Mesures prises / recommandations</div>
      <div style={{ fontSize: 10.5, display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
        {CARRIERE_MESURES_OPTIONS.map((o) => <span key={o.key}>{chk(sy.mesures?.[o.key])} {o.label}</span>)}
        <span>{chk(sy.mesureAutre)} Autre : <span style={val}>{sy.mesureAutreTexte || ""}</span></span>
      </div>
      <div style={{ fontSize: 10.5, marginTop: 4 }}>
        <span style={label}>Délai de mise en conformité : </span><span style={val}>{sy.delaiConformite || ""}</span>{" "}
        <span style={label}>Date prévue du suivi : </span><span style={val}>{formatDateFR(sy.dateSuivi) || ""}</span>
      </div>

      <div style={sec}>XI. Conclusion</div>
      <div style={{ fontSize: 10.5, display: "flex", flexWrap: "wrap", gap: "4px 14px", marginBottom: 6 }}>
        {CARRIERE_CONCLUSION_OPTIONS.map((o) => <span key={o.key}>{chk(sy.conclusion?.[o.key])} {o.label}</span>)}
      </div>
      <div style={{ fontSize: 10.5 }}><b>Synthèse :</b></div>
      <div style={{ fontSize: 10, borderBottom: "1px dotted #999", minHeight: 30, whiteSpace: "pre-wrap" }}>{sy.synthese || ""}</div>

      <div style={sec}>XII. Documents / preuves annexés</div>
      <div style={{ fontSize: 10.5, display: "flex", flexWrap: "wrap", gap: "4px 14px" }}>
        {CARRIERE_DOCUMENTS_ANNEXES_OPTIONS.map((o) => <span key={o.key}>{chk(sy.documentsAnnexes?.[o.key])} {o.label}</span>)}
      </div>
      <div style={{ fontSize: 10.5, marginTop: 4 }}>
        <span>{chk(sy.documentsAutre)} Autres : </span><span style={val}>{sy.documentsAutreTexte || ""}</span>{" "}
        <span style={label}>Nombre de photos : </span><span style={val}>{sy.nombrePhotos || ""}</span>
      </div>

      <div style={sec}>XIII. Inspecteurs chargés du contrôle</div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 9 }}>
        <tbody>
          <tr>
            <td style={thControle}>N°</td><td style={thControle}>Nom des inspecteurs</td><td style={thControle}>Fonction</td><td style={thControle}>Adresse / Téléphone</td>
          </tr>
          {eq.map((row, i) => (
            <tr key={i}>
              <td style={tdControle}>{i + 1}</td><td style={tdControle}>{row.nom}</td><td style={tdControle}>{row.fonction}</td><td style={tdControle}>{row.adresseTel}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, padding: "0 16px 10px" }}>
        <div style={{ textAlign: "center", fontSize: 10.5, color: "#1C2B39" }}><div style={{ marginBottom: 34 }}>Signature du chef de mission</div></div>
        <div style={{ textAlign: "center", fontSize: 10.5, color: "#1C2B39" }}><div style={{ marginBottom: 34 }}>Signature du responsable de la carrière</div></div>
      </div>

      <div className="no-print" style={{ textAlign: "center", fontSize: 11, color: "#A99B7F", marginTop: 6, lineHeight: 1.6 }}>
        Fiche créée par <b style={{ color: "#5B5346" }}>{c.agent || "—"}</b>{c.date ? ` le ${formatDateFR(c.date)}` : ""}
      </div>
    </div>
  );
}

/* Assistant de saisie — fiche complète de contrôle technique et de surveillance administrative des carrières */
function FicheControleCarriere({ items, controles, setControles, arrondissement, accessToken, agent, onClose }) {
  const t = useT();
  const fiches = controles.filter((c) => c.type === "controle_technique" && c.sousType === "carrieres");
  const current = ARRONDISSEMENTS.find((a) => a.id === arrondissement) || ARRONDISSEMENTS[0];

  const [wizStep, setWizStep] = useState(items.length > 0 ? "select" : "vide");
  const [selId, setSelId] = useState("");
  const [dateControle, setDateControle] = useState(new Date().toISOString().slice(0, 10));
  const [data, setData] = useState(emptyCarriereControleData());
  const [savedRecord, setSavedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const structureSel = items.find((s) => s.id === selId);

  const validerSelection = () => {
    if (!selId || !structureSel) return;
    setData((d) => ({
      ...d,
      raisonSociale: structureSel.nomStructure,
      exploitantPromoteur: structureSel.nomStructure,
      responsable: structureSel.responsableNom || "",
      responsableTel: structureSel.responsableTelephone || "",
      arrondissementTxt: current.label,
      communeTxt: current.commune,
      numeroTitre: structureSel.numeroAutorisation || "",
    }));
    setWizStep("form");
  };

  const setInfraction = (i, field, v) => setData((d) => ({ ...d, infractions: d.infractions.map((row, idx) => (idx === i ? { ...row, [field]: v } : row)) }));
  const setEquipe = (i, field, v) => setData((d) => ({ ...d, equipe: d.equipe.map((row, idx) => (idx === i ? { ...row, [field]: v } : row)) }));

  const submitFiche = () => {
    if (!structureSel || !dateControle) return;
    const maintenant = new Date().toISOString();
    const record = {
      id: editingId || uid(),
      type: "controle_technique",
      sousType: "carrieres",
      exploitantId: structureSel.id,
      operateur: data.raisonSociale,
      commune: current.commune,
      arrondissement: current.label,
      dateControle,
      inspecteur: fullName(agent),
      identification: {
        raisonSociale: data.raisonSociale, nomCarriere: data.nomCarriere, exploitantPromoteur: data.exploitantPromoteur,
        responsable: data.responsable, responsableTel: data.responsableTel, localite: data.localite,
        arrondissementTxt: data.arrondissementTxt, communeTxt: data.communeTxt,
        substances: data.substances, substanceAutre: data.substanceAutre, substanceAutreTexte: data.substanceAutreTexte,
        latitude: data.latitude, longitude: data.longitude, altitude: data.altitude,
        superficieAutorisee: data.superficieAutorisee, superficieExploitee: data.superficieExploitee,
        perimetreMaterialise: data.perimetreMaterialise,
        numeroTitre: data.numeroTitre, dateDelivranceTitre: data.dateDelivranceTitre, dateExpirationTitre: data.dateExpirationTitre,
        productionConstatee: data.productionConstatee, productionUnite: data.productionUnite, stockConstate: data.stockConstate,
        destination: data.destination, moyensTransport: data.moyensTransport, documentsTransport: data.documentsTransport,
      },
      equipe: data.equipe,
      checklist: {
        situationAdmin: data.situationAdmin, controleTechnique: data.controleTechnique,
        securite: data.securite, environnement: data.environnement,
      },
      synthese: {
        observationsProduction: data.observationsProduction,
        constatsAdmin: data.constatsAdmin, constatsTechniques: data.constatsTechniques, constatsSecuriteEnv: data.constatsSecuriteEnv,
        referenceTexte: data.referenceTexte,
        mesures: data.mesures, mesureAutre: data.mesureAutre, mesureAutreTexte: data.mesureAutreTexte,
        delaiConformite: data.delaiConformite, dateSuivi: data.dateSuivi,
        conclusion: data.conclusion, synthese: data.synthese,
        documentsAnnexes: data.documentsAnnexes, documentsAutre: data.documentsAutre, documentsAutreTexte: data.documentsAutreTexte,
        nombrePhotos: data.nombrePhotos,
      },
      infractions: data.infractions,
      agent: editingId ? (savedRecord?.agent || agent.nom) : agent.nom,
      date: editingId ? (savedRecord?.date || maintenant.slice(0, 10)) : maintenant.slice(0, 10),
      modifiePar: fullName(agent),
      modifieLe: maintenant,
      modifie: !!editingId,
    };
    const next = editingId ? controles.map((c) => (c.id === editingId ? record : c)) : [...controles, record];
    setControles(next);
    saveKey(STORAGE_KEYS.controles, next, accessToken);
    setSavedRecord(record);
    setEditingId(null);
    setWizStep("apercu");
  };

  const startEdit = () => {
    if (!savedRecord) return;
    const rec = savedRecord;
    setSelId(rec.exploitantId);
    setDateControle(rec.dateControle);
    setData({
      ...emptyCarriereControleData(),
      ...rec.identification,
      equipe: rec.equipe || emptyCarriereControleData().equipe,
      situationAdmin: rec.checklist?.situationAdmin || emptyOuiNonMap(CARRIERE_SITUATION_ADMIN_ITEMS),
      controleTechnique: rec.checklist?.controleTechnique || emptyOuiNonMap(CARRIERE_CONTROLE_TECHNIQUE_ITEMS),
      securite: rec.checklist?.securite || emptyOuiNonMap(CARRIERE_SECURITE_ITEMS),
      environnement: rec.checklist?.environnement || emptyOuiNonMap(CARRIERE_ENVIRONNEMENT_ITEMS),
      infractions: rec.infractions || emptyCarriereControleData().infractions,
      ...rec.synthese,
    });
    setEditingId(rec.id);
    setWizStep("form");
  };

  const removeFiche = (id) => {
    if (!window.confirm(t("confirmerSuppressionFiche"))) return;
    const next = controles.filter((c) => c.id !== id);
    setControles(next);
    saveKey(STORAGE_KEYS.controles, next, accessToken);
    if (savedRecord?.id === id) { setSavedRecord(null); setWizStep(items.length > 0 ? "select" : "vide"); }
  };

  return (
    <>
      <div className="no-print" style={{ ...cardStyle, ...typeBgStyle("carrieres"), marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{t("controleTechniqueSousTitreCarrieres")}</div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        {wizStep === "vide" && <div style={{ fontSize: 12.5, color: "#A8542E" }}>{t("aucuneStructureEnregistree")}</div>}

      {wizStep === "select" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
            <div>
              <label style={labelStyle}>{t("structureLabel2")}</label>
              <select style={inputStyle} value={selId} onChange={(e) => setSelId(e.target.value)}>
                <option value="">{t("choisirOpt")}</option>
                {items.map((s) => <option key={s.id} value={s.id}>{s.nomStructure}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("dateControleLabel")}</label>
              <DateNaissancePicker value={dateControle} onChange={setDateControle} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="button" onClick={validerSelection} style={primaryBtn} disabled={!selId}>{t("validerBtn")}</button>
          </div>
        </div>
      )}

      {wizStep === "form" && structureSel && (
        <div style={{ display: "grid", gap: 24 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>I. Identification de la carrière</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 10 }}>
              <div><label style={labelStyle}>Nom / raison sociale</label><input style={inputStyle} value={data.raisonSociale} onChange={(e) => setData({ ...data, raisonSociale: e.target.value })} /></div>
              <div><label style={labelStyle}>Nom de la carrière</label><input style={inputStyle} value={data.nomCarriere} onChange={(e) => setData({ ...data, nomCarriere: e.target.value })} /></div>
              <div><label style={labelStyle}>Exploitant / Promoteur</label><input style={inputStyle} value={data.exploitantPromoteur} onChange={(e) => setData({ ...data, exploitantPromoteur: e.target.value })} /></div>
              <div><label style={labelStyle}>Responsable</label><input style={inputStyle} value={data.responsable} onChange={(e) => setData({ ...data, responsable: e.target.value })} /></div>
              <div><label style={labelStyle}>Téléphone du responsable</label><input style={inputStyle} value={data.responsableTel} onChange={(e) => setData({ ...data, responsableTel: e.target.value })} /></div>
              <div><label style={labelStyle}>Localité / Village</label><input style={inputStyle} value={data.localite} onChange={(e) => setData({ ...data, localite: e.target.value })} /></div>
              <div><label style={labelStyle}>Arrondissement</label><input style={inputStyle} value={data.arrondissementTxt} onChange={(e) => setData({ ...data, arrondissementTxt: e.target.value })} /></div>
              <div><label style={labelStyle}>Commune</label><input style={inputStyle} value={data.communeTxt} onChange={(e) => setData({ ...data, communeTxt: e.target.value })} /></div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Substance(s)</label>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {CARRIERE_SUBSTANCE_OPTIONS.map((o) => (
                  <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                    <input type="checkbox" checked={data.substances[o.key]} onChange={(e) => setData({ ...data, substances: { ...data.substances, [o.key]: e.target.checked } })} /> {o.label}
                  </label>
                ))}
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" checked={data.substanceAutre} onChange={(e) => setData({ ...data, substanceAutre: e.target.checked })} /> Autre :
                </label>
                <input style={{ ...inputStyle, maxWidth: 200 }} value={data.substanceAutreTexte} onChange={(e) => setData({ ...data, substanceAutreTexte: e.target.value })} />
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>II. Localisation du site</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10 }}>
              <div><label style={labelStyle}>Latitude</label><input style={inputStyle} value={data.latitude} onChange={(e) => setData({ ...data, latitude: e.target.value })} /></div>
              <div><label style={labelStyle}>Longitude</label><input style={inputStyle} value={data.longitude} onChange={(e) => setData({ ...data, longitude: e.target.value })} /></div>
              <div><label style={labelStyle}>Altitude</label><input style={inputStyle} value={data.altitude} onChange={(e) => setData({ ...data, altitude: e.target.value })} /></div>
              <div><label style={labelStyle}>Superficie autorisée (ha)</label><input style={inputStyle} value={data.superficieAutorisee} onChange={(e) => setData({ ...data, superficieAutorisee: e.target.value })} /></div>
              <div><label style={labelStyle}>Superficie exploitée (ha)</label><input style={inputStyle} value={data.superficieExploitee} onChange={(e) => setData({ ...data, superficieExploitee: e.target.value })} /></div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Périmètre matérialisé</label>
              <div style={{ display: "flex", gap: 14 }}>
                {[["oui", "Oui"], ["non", "Non"], ["partiellement", "Partiellement"]].map(([k, l]) => (
                  <label key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                    <input type="radio" name="perimetreMaterialise" checked={data.perimetreMaterialise === k} onChange={() => setData({ ...data, perimetreMaterialise: k })} /> {l}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>III. Situation administrative</div>
            <ChecklistFormSection items={CARRIERE_SITUATION_ADMIN_ITEMS} values={data.situationAdmin} onChange={(v) => setData({ ...data, situationAdmin: v })} naLabel="N/A" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 10, marginTop: 10 }}>
              <div><label style={labelStyle}>N° du titre / autorisation</label><input style={inputStyle} value={data.numeroTitre} onChange={(e) => setData({ ...data, numeroTitre: e.target.value })} /></div>
              <div><label style={labelStyle}>Délivrance</label><DateNaissancePicker value={data.dateDelivranceTitre} onChange={(v) => setData({ ...data, dateDelivranceTitre: v })} /></div>
              <div><label style={labelStyle}>Expiration</label><DateNaissancePicker value={data.dateExpirationTitre} onChange={(v) => setData({ ...data, dateExpirationTitre: v })} /></div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>IV. Contrôle technique de l'exploitation</div>
            <ChecklistFormSection items={CARRIERE_CONTROLE_TECHNIQUE_ITEMS} values={data.controleTechnique} onChange={(v) => setData({ ...data, controleTechnique: v })} colYes="Conforme" colNo="Non conforme" naLabel="N/A" />
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>V. Production et transport</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
              <div><label style={labelStyle}>Production constatée / estimée</label><input style={inputStyle} value={data.productionConstatee} onChange={(e) => setData({ ...data, productionConstatee: e.target.value })} /></div>
              <div><label style={labelStyle}>Unité</label><input style={inputStyle} value={data.productionUnite} onChange={(e) => setData({ ...data, productionUnite: e.target.value })} /></div>
              <div><label style={labelStyle}>Stock constaté</label><input style={inputStyle} value={data.stockConstate} onChange={(e) => setData({ ...data, stockConstate: e.target.value })} /></div>
              <div><label style={labelStyle}>Destination</label><input style={inputStyle} value={data.destination} onChange={(e) => setData({ ...data, destination: e.target.value })} /></div>
              <div><label style={labelStyle}>Moyens de transport</label><input style={inputStyle} value={data.moyensTransport} onChange={(e) => setData({ ...data, moyensTransport: e.target.value })} /></div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Documents de transport</label>
              <div style={{ display: "flex", gap: 14 }}>
                {[["oui", "Oui"], ["non", "Non"], ["na", "N/A"]].map(([k, l]) => (
                  <label key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                    <input type="radio" name="documentsTransport" checked={data.documentsTransport === k} onChange={() => setData({ ...data, documentsTransport: k })} /> {l}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Observations</label>
              <textarea style={{ ...inputStyle, minHeight: 60 }} value={data.observationsProduction} onChange={(e) => setData({ ...data, observationsProduction: e.target.value })} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>VI. Sécurité</div>
            <ChecklistFormSection items={CARRIERE_SECURITE_ITEMS} values={data.securite} onChange={(v) => setData({ ...data, securite: v })} naLabel="N/A" />
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>VII. Environnement et remise en état</div>
            <ChecklistFormSection items={CARRIERE_ENVIRONNEMENT_ITEMS} values={data.environnement} onChange={(v) => setData({ ...data, environnement: v })} naLabel="N/A" />
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>VIII. Constats du contrôle</div>
            <div style={{ display: "grid", gap: 10 }}>
              <div><label style={labelStyle}>A. Constatations administratives</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.constatsAdmin} onChange={(e) => setData({ ...data, constatsAdmin: e.target.value })} /></div>
              <div><label style={labelStyle}>B. Constatations techniques</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.constatsTechniques} onChange={(e) => setData({ ...data, constatsTechniques: e.target.value })} /></div>
              <div><label style={labelStyle}>C. Sécurité / environnement</label><textarea style={{ ...inputStyle, minHeight: 60 }} value={data.constatsSecuriteEnv} onChange={(e) => setData({ ...data, constatsSecuriteEnv: e.target.value })} /></div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>IX. Infractions / non-conformités</div>
            <div style={{ display: "grid", gap: 8 }}>
              {data.infractions.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 2fr", gap: 8 }}>
                  <input style={inputStyle} placeholder={`Manquement / anomalie ${i + 1}`} value={row.manquement} onChange={(e) => setInfraction(i, "manquement", e.target.value)} />
                  <select style={inputStyle} value={row.gravite} onChange={(e) => setInfraction(i, "gravite", e.target.value)}>
                    <option value="">Gravité</option>
                    <option value="F">Faible</option>
                    <option value="M">Majeure</option>
                    <option value="G">Grave / danger</option>
                  </select>
                  <input style={inputStyle} placeholder="Mesure proposée" value={row.mesureProposee} onChange={(e) => setInfraction(i, "mesureProposee", e.target.value)} />
                </div>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Référence du texte, si identifiée</label>
              <input style={inputStyle} value={data.referenceTexte} onChange={(e) => setData({ ...data, referenceTexte: e.target.value })} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>X. Mesures prises / recommandations</div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {CARRIERE_MESURES_OPTIONS.map((o) => (
                <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" checked={data.mesures[o.key]} onChange={(e) => setData({ ...data, mesures: { ...data.mesures, [o.key]: e.target.checked } })} /> {o.label}
                </label>
              ))}
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={data.mesureAutre} onChange={(e) => setData({ ...data, mesureAutre: e.target.checked })} /> Autre :
              </label>
              <input style={{ ...inputStyle, maxWidth: 200 }} value={data.mesureAutreTexte} onChange={(e) => setData({ ...data, mesureAutreTexte: e.target.value })} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, marginTop: 10 }}>
              <div><label style={labelStyle}>Délai de mise en conformité</label><input style={inputStyle} value={data.delaiConformite} onChange={(e) => setData({ ...data, delaiConformite: e.target.value })} /></div>
              <div><label style={labelStyle}>Date prévue du suivi</label><DateNaissancePicker value={data.dateSuivi} onChange={(v) => setData({ ...data, dateSuivi: v })} /></div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>XI. Conclusion</div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {CARRIERE_CONCLUSION_OPTIONS.map((o) => (
                <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" checked={data.conclusion[o.key]} onChange={(e) => setData({ ...data, conclusion: { ...data.conclusion, [o.key]: e.target.checked } })} /> {o.label}
                </label>
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Synthèse</label>
              <textarea style={{ ...inputStyle, minHeight: 80 }} value={data.synthese} onChange={(e) => setData({ ...data, synthese: e.target.value })} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>XII. Documents / preuves annexés</div>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {CARRIERE_DOCUMENTS_ANNEXES_OPTIONS.map((o) => (
                <label key={o.key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                  <input type="checkbox" checked={data.documentsAnnexes[o.key]} onChange={(e) => setData({ ...data, documentsAnnexes: { ...data.documentsAnnexes, [o.key]: e.target.checked } })} /> {o.label}
                </label>
              ))}
              <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, cursor: "pointer" }}>
                <input type="checkbox" checked={data.documentsAutre} onChange={(e) => setData({ ...data, documentsAutre: e.target.checked })} /> Autres :
              </label>
              <input style={{ ...inputStyle, maxWidth: 200 }} value={data.documentsAutreTexte} onChange={(e) => setData({ ...data, documentsAutreTexte: e.target.value })} />
            </div>
            <div style={{ marginTop: 10, maxWidth: 200 }}>
              <label style={labelStyle}>Nombre de photos</label>
              <input style={inputStyle} value={data.nombrePhotos} onChange={(e) => setData({ ...data, nombrePhotos: e.target.value })} />
            </div>
          </div>

          <div>
            <div style={{ fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", marginBottom: 8 }}>XIII. Inspecteurs chargés du contrôle</div>
            <div style={{ display: "grid", gap: 8 }}>
              {data.equipe.map((row, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                  <input style={inputStyle} placeholder={i === 0 ? "Chef de mission — Nom" : "Nom"} value={row.nom} onChange={(e) => setEquipe(i, "nom", e.target.value)} />
                  <input style={inputStyle} placeholder="Fonction" value={row.fonction} onChange={(e) => setEquipe(i, "fonction", e.target.value)} />
                  <input style={inputStyle} placeholder="Adresse / Téléphone" value={row.adresseTel} onChange={(e) => setEquipe(i, "adresseTel", e.target.value)} />
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={submitFiche} style={primaryBtn}>{t("enregistrer")}</button>
            <button type="button" onClick={() => setWizStep("select")} style={ghostBtn}>{t("annuler")}</button>
          </div>
        </div>
      )}
      </div>

      {wizStep === "apercu" && savedRecord && (
        <div className="no-print" style={{ ...cardStyle, marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button type="button" onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> {t("telechargerPdf")}</button>
            <button type="button" onClick={startEdit} style={ghostBtn}><Pencil size={14} /> {t("modifier")}</button>
            <button type="button" onClick={() => removeFiche(savedRecord.id)} style={{ ...ghostBtn, color: "#A8542E", borderColor: "#E3B8A8" }}><Trash2 size={14} /> {t("supprimer")}</button>
            <button type="button" onClick={() => { setSavedRecord(null); setWizStep("select"); setSelId(""); setData(emptyCarriereControleData()); }} style={ghostBtn}>{t("fermer")}</button>
          </div>
        </div>
      )}
      {wizStep === "apercu" && savedRecord && <ControleCarriereApercu record={savedRecord} />}

      <div className="no-print" style={{ marginTop: 22, paddingTop: 16, borderTop: "1px dashed var(--border)" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9962C", marginBottom: 10 }}>
          {t("historiqueControles")} ({fiches.length})
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {fiches.length === 0 && <div style={{ fontSize: 12.5, color: "var(--text-faint)" }}>{t("aucuneFicheControleEnreg")}</div>}
          {fiches.map((c) => (
            <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, background: "#fff", border: "1px solid var(--border-light)", borderRadius: 4, padding: "8px 10px" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--text)" }}>{c.operateur} — {formatDateFR(c.dateControle)}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button type="button" onClick={() => { setSavedRecord(c); setWizStep("apercu"); }} title={t("voirFicheTitle")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  <Eye size={15} />
                </button>
                <button type="button" onClick={() => removeFiche(c.id)} title={t("supprimerTitle")} style={{ background: "none", border: "none", cursor: "pointer", color: "#A8542E" }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ControleTechniqueTab({ exploitants, controles, setControles, arrondissement, accessToken, agent }) {
  const t = useT();
  const [type, setType] = useState("eaux");
  const [showFiche, setShowFiche] = useState(false);
  const items = exploitants.filter((e) => e.type === type);

  const options = [
    { id: "eaux", label: t("exploitantsEauxOpt"), icon: <Droplet size={14} /> },
    { id: "carrieres", label: t("exploitantsCarrieresOpt"), icon: <Mountain size={14} /> },
  ];

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0 !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
          .print-area table { border-collapse: separate !important; border-spacing: 0 !important; }
          .print-area tr, .print-area td, .print-area th { page-break-inside: avoid !important; }
          @page { size: A4; margin: 12mm; }
        }
      `}</style>
      <SectionHeader title={t("controleTechniqueTitre")} subtitle={type === "eaux" ? t("controleTechniqueSousTitreEaux") : t("controleTechniqueSousTitreCarrieres")} />

      <div className="no-print" style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => { setType(o.id); setShowFiche(false); }}
            style={type === o.id ? primaryBtn : ghostBtn}
          >
            {o.icon} {o.label}
          </button>
        ))}
        <button type="button" onClick={() => setShowFiche((s) => !s)} style={{ ...ghostBtn, marginLeft: "auto" }}>
          <ClipboardList size={14} /> {t("remplirFicheControleBtn")}
        </button>
      </div>

      {showFiche && type === "eaux" && (
        <FicheControleEau
          items={items}
          controles={controles}
          setControles={setControles}
          arrondissement={arrondissement}
          accessToken={accessToken}
          agent={agent}
          onClose={() => setShowFiche(false)}
        />
      )}
      {showFiche && type === "carrieres" && (
        <FicheControleCarriere
          items={items}
          controles={controles}
          setControles={setControles}
          arrondissement={arrondissement}
          accessToken={accessToken}
          agent={agent}
          onClose={() => setShowFiche(false)}
        />
      )}
    </div>
  );
}

/* Sélecteur de type de déclaration — artisan minier / exploitants des eaux / exploitants des carrières */
function FicheDeclarationTab({ artisans, exploitants, controles, setControles, agent, accessToken, arrondissement }) {
  const t = useT();
  const [typeDecl, setTypeDecl] = useState("artisan"); // artisan | eaux | carrieres

  const options = [
    { id: "artisan", label: t("artisanMinierOpt"), icon: <Pickaxe size={14} /> },
    { id: "eaux", label: t("exploitantsEauxOpt"), icon: <Droplet size={14} /> },
    { id: "carrieres", label: t("exploitantsCarrieresOpt"), icon: <Mountain size={14} /> },
  ];

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0 !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
          .print-area table { border-collapse: separate !important; border-spacing: 0 !important; }
          .print-area tr, .print-area td, .print-area th { page-break-inside: avoid !important; }
          @page { size: A4; margin: 12mm; }
        }
      `}</style>
      <div className="no-print" style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {options.map((o) => (
          <button key={o.id} type="button" onClick={() => setTypeDecl(o.id)} style={typeDecl === o.id ? primaryBtn : ghostBtn}>
            {o.icon} {o.label}
          </button>
        ))}
      </div>

      {typeDecl === "artisan" && (
        <FicheControle artisans={artisans} controles={controles} setControles={setControles} agent={agent} accessToken={accessToken} />
      )}
      {(typeDecl === "eaux" || typeDecl === "carrieres") && (
        <DeclarationExploitant
          type={typeDecl}
          items={exploitants.filter((e) => e.type === typeDecl)}
          controles={controles}
          setControles={setControles}
          arrondissement={arrondissement}
          accessToken={accessToken}
          agent={agent}
          onClose={() => setTypeDecl("artisan")}
        />
      )}
    </div>
  );
}

function FicheControle({ artisans, controles, setControles, agent, accessToken }) {
  const t = useT();
  const declarations = controles.filter((c) => c.type === "declaration");

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthIdx = now.getMonth();

  /* ---- Nouvelle déclaration ---- */
  const [showWizard, setShowWizard] = useState(false);
  const [wizStep, setWizStep] = useState("select"); // select | form | apercu
  const [selArtisanId, setSelArtisanId] = useState("");
  const [selMoisNom, setSelMoisNom] = useState(MOIS_NOMS[currentMonthIdx]);
  const [selAnnee, setSelAnnee] = useState(currentYear);
  const [savedRecord, setSavedRecord] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const declArtisanCourant = declarations.filter((c) => c.artisanId === selArtisanId);
  const moisDispo = Array.from(new Set([...declArtisanCourant.map((c) => c.moisNom), MOIS_NOMS[currentMonthIdx]]));
  const anneesDispo = Array.from(new Set([...declArtisanCourant.map((c) => c.anneeDecl), currentYear])).sort((a, b) => b - a);

  const [decl, setDecl] = useState({
    numeroContribuable: "",
    referenceTitre: "",
    titreMinier: "Autorisation artisanale",
    localisation: "",
    quantite: "",
    unite: "g",
    montant: "",
    devise: "XAF",
    documents: { autorisation: false, registre: false, quittance: false },
    observations: "",
    beneficiaireType: "CTD",
    beneficiaireSousType: "MINMIDT",
  });

  const artisanSel = artisans.find((a) => a.id === selArtisanId);
  const communeSel = artisanSel ? ARRONDISSEMENTS.find((a) => a.id === artisanSel.arrondissementId) : null;
  const tauxSel = artisanSel ? (TAUX_PAR_CATEGORIE[artisanSel.substanceCategorie] || 5) : 5;
  const montantNum = parseFloat(decl.montant) || 0;
  const quantiteNum = parseFloat(decl.quantite) || 0;
  const taxeUnitaire = montantNum * (tauxSel / 100);
  const taxeTotale = taxeUnitaire * quantiteNum;

  const beneficiaireKey = decl.beneficiaireType === "CTD" ? "CTD" : decl.beneficiaireType === "tresor" ? "TRESOR" : decl.beneficiaireSousType;
  const beneficiaireInfo = BENEFICIAIRES[beneficiaireKey];
  const montantRepartition = taxeTotale * (beneficiaireInfo.taux / 100);

  const moisLabel = `${selMoisNom} ${selAnnee}`;

  const validerSelection = () => {
    if (!artisanSel) return;
    setDecl((d) => ({ ...d, localisation: artisanSel.site || "" }));
    setWizStep("form");
  };

  const resetWizard = () => {
    setShowWizard(false);
    setWizStep("select");
    setSelArtisanId("");
    setSelMoisNom(MOIS_NOMS[currentMonthIdx]);
    setSelAnnee(currentYear);
    setSavedRecord(null);
    setEditingId(null);
    setDecl({
      numeroContribuable: "",
      referenceTitre: "",
      titreMinier: "Autorisation artisanale",
      localisation: "",
      quantite: "",
      unite: "g",
      montant: "",
      devise: "XAF",
      documents: { autorisation: false, registre: false, quittance: false },
      observations: "",
      beneficiaireType: "CTD",
      beneficiaireSousType: "MINMIDT",
    });
  };

  /* Repasse en mode formulaire, pré-rempli avec la déclaration affichée, pour corriger une erreur */
  const startEdit = () => {
    if (!savedRecord) return;
    const rec = savedRecord;
    setEditingId(rec.id);
    setSelArtisanId(rec.artisanId);
    setSelMoisNom(rec.moisNom);
    setSelAnnee(rec.anneeDecl);
    let beneficiaireType = "CTD";
    let beneficiaireSousType = "MINMIDT";
    if (rec.beneficiaire === BENEFICIAIRES.TRESOR.label) {
      beneficiaireType = "tresor";
    } else if (rec.beneficiaire === BENEFICIAIRES.MINMIDT.label) {
      beneficiaireType = "appui";
      beneficiaireSousType = "MINMIDT";
    } else if (rec.beneficiaire === BENEFICIAIRES.MINFI.label) {
      beneficiaireType = "appui";
      beneficiaireSousType = "MINFI";
    }
    setDecl({
      numeroContribuable: rec.numeroContribuable || "",
      referenceTitre: rec.referenceTitre || "",
      titreMinier: rec.titreMinier || "Autorisation artisanale",
      localisation: rec.localisation || "",
      quantite: rec.quantite || "",
      unite: rec.unite || "g",
      montant: rec.montant || "",
      devise: rec.devise || "XAF",
      documents: rec.documents || { autorisation: false, registre: false, quittance: false },
      observations: rec.observations || "",
      beneficiaireType,
      beneficiaireSousType,
    });
    setWizStep("form");
  };

  const submitDeclaration = () => {
    const maintenant = new Date().toISOString();
    const record = {
      id: editingId || uid(),
      type: "declaration",
      operateur: artisanSel.prenom ? `${artisanSel.prenom} ${artisanSel.nom}` : artisanSel.nom,
      artisanId: artisanSel.id,
      mois: moisLabel,
      moisNom: selMoisNom,
      anneeDecl: selAnnee,
      adresseTel: artisanSel.telephone || "",
      numeroContribuable: decl.numeroContribuable,
      referenceTitre: decl.referenceTitre,
      titreMinier: decl.titreMinier,
      localisation: decl.localisation,
      departement: "Bénoué",
      arrondissement: communeSel?.label || "",
      commune: communeSel?.commune || "",
      substance: artisanSel.substance,
      substanceCategorie: artisanSel.substanceCategorie,
      quantite: decl.quantite,
      unite: decl.unite,
      taux: tauxSel,
      montant: decl.montant,
      devise: decl.devise,
      taxeUnitaire,
      taxeTotale,
      beneficiaire: beneficiaireInfo.label,
      tauxRepartition: beneficiaireInfo.taux,
      compteAffectation: beneficiaireInfo.compte,
      montantRepartition,
      documents: decl.documents,
      observations: decl.observations,
      // "agent" et "date" représentent la création d'origine et sont préservés lors d'une modification
      agent: editingId ? (savedRecord?.agent || agent.nom) : agent.nom,
      date: editingId ? (savedRecord?.date || maintenant.slice(0, 10)) : maintenant.slice(0, 10),
      // "modifiePar"/"modifieLe" reflètent toujours la dernière personne à avoir enregistré
      modifiePar: fullName(agent),
      modifieLe: maintenant,
      modifie: !!editingId,
    };
    const next = editingId
      ? controles.map((c) => (c.id === editingId ? record : c))
      : [record, ...controles];
    setControles(next);
    saveKey(STORAGE_KEYS.controles, next, accessToken);
    setSavedRecord(record);
    setEditingId(null);
    setWizStep("apercu");
  };

  const removeDeclaration = (id) => {
    if (!window.confirm(t("confirmerSuppressionFiche"))) return;
    const next = controles.filter((c) => c.id !== id);
    setControles(next);
    saveKey(STORAGE_KEYS.controles, next, accessToken);
    if (savedRecord?.id === id) resetWizard();
  };

  const exportCsv = () => {
    const header = "Mois;Operateur;Commune;Substance;Quantite;Unite;Taux;Montant;Taxe unitaire;Taxe totale;Beneficiaire;Taux repartition;Compte;Montant reparti\n";
    const rows = declarations
      .map((c) =>
        [
          c.mois,
          c.operateur,
          c.commune,
          c.substance,
          c.quantite,
          c.unite,
          `${c.taux}%`,
          c.montant,
          Number(c.taxeUnitaire || 0).toFixed(2),
          Number(c.taxeTotale || 0).toFixed(2),
          c.beneficiaire,
          `${c.tauxRepartition}%`,
          c.compteAffectation,
          Number(c.montantRepartition || 0).toFixed(2),
        ].join(";")
      )
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "declarations-benoue.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ---- Répertoire : consulter une déclaration enregistrée ---- */
  const [showRepertoire, setShowRepertoire] = useState(false);
  const [repArtisanId, setRepArtisanId] = useState("");
  const [repAnnee, setRepAnnee] = useState("");
  const [repMois, setRepMois] = useState("");

  const artisansAvecDeclaration = artisans.filter((a) => declarations.some((c) => c.artisanId === a.id));
  const repDeclArtisan = declarations.filter((c) => c.artisanId === repArtisanId);
  const repAnneesDispo = Array.from(new Set(repDeclArtisan.map((c) => c.anneeDecl))).sort((a, b) => b - a);
  const repMoisDispo = Array.from(new Set(repDeclArtisan.filter((c) => c.anneeDecl === repAnnee).map((c) => c.moisNom)));
  const repResult = declarations.find((c) => c.artisanId === repArtisanId && c.anneeDecl === repAnnee && c.moisNom === repMois);

  const fermerRepertoire = () => {
    setShowRepertoire(false);
    setRepArtisanId("");
    setRepAnnee("");
    setRepMois("");
  };

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; margin: 0 !important; box-shadow: none !important; border: none !important; }
          .no-print { display: none !important; }
          .print-area table { border-collapse: separate !important; border-spacing: 0 !important; }
          .print-area tr, .print-area td, .print-area th { page-break-inside: avoid !important; }
          @page { size: A4; margin: 12mm; }
        }
      `}</style>
      <SectionHeader
        title={t("ficheDeclarationTerrain")}
        subtitle={t("declarationsMensuellesArtisan")}
        action={
          <div className="no-print" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" onClick={() => { setShowWizard(true); setWizStep("select"); setShowRepertoire(false); }} style={primaryBtn}>
              <ClipboardList size={14} /> {t("enregistrerFicheBtn")}
            </button>
            <button type="button" onClick={() => { setShowRepertoire((s) => !s); setShowWizard(false); }} style={ghostBtn}>
              <Search size={14} /> {t("declarationBtn")}
            </button>
            {declarations.length > 0 && (
              <button type="button" onClick={exportCsv} style={ghostBtn}>
                <Printer size={14} /> {t("exporterCsvBtn")}
              </button>
            )}
          </div>
        }
      />

      {/* ======== RÉPERTOIRE ======== */}
      {showRepertoire && (
        <div className="no-print" style={{ ...cardStyle, ...typeBgStyle("artisan"), marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>{t("consulterDeclaration")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
            <div>
              <label style={labelStyle}>{t("artisanLabel")}</label>
              <select style={inputStyle} value={repArtisanId} onChange={(e) => { setRepArtisanId(e.target.value); setRepAnnee(""); setRepMois(""); }}>
                <option value="">{t("choisirOpt")}</option>
                {artisansAvecDeclaration.map((a) => <option key={a.id} value={a.id}>{a.prenom ? `${a.prenom} ${a.nom}` : a.nom}</option>)}
              </select>
            </div>
            {repArtisanId && (
              <div>
                <label style={labelStyle}>{t("anneeLabel")}</label>
                <select style={inputStyle} value={repAnnee} onChange={(e) => { setRepAnnee(Number(e.target.value)); setRepMois(""); }}>
                  <option value="">{t("choisirOpt")}</option>
                  {repAnneesDispo.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}
            {repAnnee !== "" && repAnnee && (
              <div>
                <label style={labelStyle}>{t("moisLabelForm")}</label>
                <select style={inputStyle} value={repMois} onChange={(e) => setRepMois(e.target.value)}>
                  <option value="">{t("choisirOpt")}</option>
                  {repMoisDispo.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            )}
          </div>
          {artisansAvecDeclaration.length === 0 && (
            <div style={{ fontSize: 12.5, color: "var(--text-faint)", marginTop: 10 }}>{t("aucuneDeclarationInstant")}</div>
          )}
          <button type="button" onClick={fermerRepertoire} style={{ ...ghostBtn, marginTop: 16 }}>{t("fermer")}</button>
        </div>
      )}

      {showRepertoire && repResult && (
        <>
          <DeclarationApercu record={repResult} />
          <div className="no-print" style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 18 }}>
            <button type="button" onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> {t("telechargerPdf")}</button>
            <button type="button" onClick={fermerRepertoire} style={ghostBtn}>{t("fermer")}</button>
          </div>
        </>
      )}

      {/* ======== NOUVELLE DÉCLARATION — SÉLECTION ======== */}
      {showWizard && wizStep === "select" && (
        <div className="no-print" style={{ ...cardStyle, ...typeBgStyle("artisan"), marginBottom: 18 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 12 }}>{t("nouvelleDeclarationSelection")}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 12 }}>
            <div>
              <label style={labelStyle}>{t("artisanEnregistreLabel")}</label>
              <select style={inputStyle} value={selArtisanId} onChange={(e) => setSelArtisanId(e.target.value)}>
                <option value="">{t("choisirOpt")}</option>
                {artisans.map((a) => <option key={a.id} value={a.id}>{a.prenom ? `${a.prenom} ${a.nom}` : a.nom}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("moisLabelForm")}</label>
              <select style={inputStyle} value={selMoisNom} onChange={(e) => setSelMoisNom(e.target.value)}>
                {moisDispo.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>{t("anneeLabel")}</label>
              <select style={inputStyle} value={selAnnee} onChange={(e) => setSelAnnee(Number(e.target.value))}>
                {anneesDispo.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
          {artisans.length === 0 && (
            <div style={{ fontSize: 12.5, color: "#A8542E", marginTop: 10 }}>{t("registreVideMessage")}</div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="button" onClick={validerSelection} style={primaryBtn} disabled={!selArtisanId}>{t("validerBtn")}</button>
            <button type="button" onClick={resetWizard} style={ghostBtn}>{t("annuler")}</button>
          </div>
        </div>
      )}

      {/* ======== NOUVELLE DÉCLARATION — FORMULAIRE ======== */}
      {showWizard && wizStep === "form" && artisanSel && (
        <div className="no-print" style={{ display: "grid", gap: 14, marginBottom: 18 }}>
          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
              {t("identificationExploitation")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              <div>
                <label style={labelStyle}>{t("moisLabelForm")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={moisLabel} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("nomRaisonSocialeExploitant")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={artisanSel.prenom ? `${artisanSel.prenom} ${artisanSel.nom}` : artisanSel.nom} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("adresseTelDoc")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={artisanSel.telephone || "—"} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("numeroContribuableLabel")}</label>
                <input style={inputStyle} value={decl.numeroContribuable} onChange={(e) => setDecl({ ...decl, numeroContribuable: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>{t("referenceTitreLabel")}</label>
                <input style={inputStyle} value={decl.referenceTitre} onChange={(e) => setDecl({ ...decl, referenceTitre: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>{t("titreMinierDoc")}</label>
                <select style={inputStyle} value={decl.titreMinier} onChange={(e) => setDecl({ ...decl, titreMinier: e.target.value })}>
                  <option value="Autorisation artisanale">Autorisation artisanale</option>
                  <option value="Autorisation artisanale semi-mécanisée">Autorisation artisanale semi-mécanisée</option>
                  <option value="Aucun">Aucun</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t("localisationSiteLabel")}</label>
                <input style={inputStyle} value={decl.localisation} onChange={(e) => setDecl({ ...decl, localisation: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>{t("departementDoc")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value="Bénoué" readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("arrondissementDoc")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={communeSel?.label || "—"} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("communeDoc")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={communeSel?.commune || "—"} readOnly />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
              {t("quantiteEtTaxe")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              <div>
                <label style={labelStyle}>{t("designationSubstance")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={artisanSel.substance || "—"} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("quantiteProduite")}</label>
                <div style={{ display: "flex", gap: 6 }}>
                  <input style={inputStyle} value={decl.quantite} onChange={(e) => setDecl({ ...decl, quantite: e.target.value })} />
                  <select style={{ ...inputStyle, maxWidth: 80 }} value={decl.unite} onChange={(e) => setDecl({ ...decl, unite: e.target.value })}>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="t">t</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={labelStyle}>{t("tauxApplicableLabel2")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={`${tauxSel} % (${artisanSel.substanceCategorie})`} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("valeurMonetaire")}</label>
                <select style={inputStyle} value={decl.devise} onChange={(e) => setDecl({ ...decl, devise: e.target.value })}>
                  {Object.entries(DEVISES).map(([code, label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t("prixMarche")}</label>
                <input style={inputStyle} value={decl.montant} onChange={(e) => setDecl({ ...decl, montant: e.target.value })} placeholder="Ex : 5000" />
              </div>
              <div>
                <label style={labelStyle}>{t("montantTaxeUnite")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={`${taxeUnitaire.toLocaleString("fr-FR")} ${decl.devise}`} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("montantTotalTaxe")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text)", fontWeight: 700 }} value={`${taxeTotale.toLocaleString("fr-FR")} ${decl.devise}`} readOnly />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
              {t("repartition")}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
              <div>
                <label style={labelStyle}>{t("beneficiaireLabel2")}</label>
                <select style={inputStyle} value={decl.beneficiaireType} onChange={(e) => setDecl({ ...decl, beneficiaireType: e.target.value })}>
                  <option value="CTD">{t("ctdCommuneOpt")}</option>
                  <option value="appui">{t("appuiSuiviControle")}</option>
                  <option value="tresor">{t("tresorPublicOpt2")}</option>
                </select>
              </div>
              {decl.beneficiaireType === "appui" && (
                <div>
                  <label style={labelStyle}>{t("structureLabel")}</label>
                  <select style={inputStyle} value={decl.beneficiaireSousType} onChange={(e) => setDecl({ ...decl, beneficiaireSousType: e.target.value })}>
                    <option value="MINMIDT">MINMIDT</option>
                    <option value="MINFI">MINFI (DGI)</option>
                  </select>
                </div>
              )}
              <div>
                <label style={labelStyle}>{t("tauxApplicableLabel2")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={`${beneficiaireInfo.taux} %`} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("compteAffectation")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text-muted)" }} value={beneficiaireInfo.compte} readOnly />
              </div>
              <div>
                <label style={labelStyle}>{t("montantReparti")}</label>
                <input style={{ ...inputStyle, background: "var(--bg-subtle)", color: "var(--text)", fontWeight: 700 }} value={`${montantRepartition.toLocaleString("fr-FR")} ${decl.devise}`} readOnly />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
              {t("documentsPresentes")}
            </div>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                ["autorisation", t("autorisationExploitation")],
                ["registre", t("registreProduction")],
                ["quittance", t("quittancePaiement")],
              ].map(([key, label]) => (
                <label key={key} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, color: "var(--text-strong)" }}>
                  <input
                    type="checkbox"
                    checked={decl.documents[key]}
                    onChange={(e) => setDecl({ ...decl, documents: { ...decl.documents, [key]: e.target.checked } })}
                  />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div style={cardStyle}>
            <div style={{ fontSize: 12, letterSpacing: "0.06em", textTransform: "uppercase", color: "#C9962C", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 12 }}>
              {t("observationsLabel")}
            </div>
            <textarea
              style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
              value={decl.observations}
              onChange={(e) => setDecl({ ...decl, observations: e.target.value })}
            />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button type="button" onClick={submitDeclaration} style={primaryBtn}>{t("enregistrerDeclarationBtn")}</button>
            <button type="button" onClick={resetWizard} style={ghostBtn}>{t("annuler")}</button>
          </div>
        </div>
      )}

      {/* ======== APERÇU APRÈS ENREGISTREMENT ======== */}
      {showWizard && wizStep === "apercu" && savedRecord && (
        <>
          <DeclarationApercu record={savedRecord} />
          <div className="no-print" style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 18, flexWrap: "wrap" }}>
            <button type="button" onClick={() => window.print()} style={primaryBtn}><Printer size={14} /> {t("telechargerPdf")}</button>
            <button type="button" onClick={startEdit} style={ghostBtn}><Pencil size={14} /> {t("modifier")}</button>
            <button type="button" onClick={() => removeDeclaration(savedRecord.id)} style={{ ...ghostBtn, color: "#A8542E", borderColor: "#E3B8A8" }}><Trash2 size={14} /> {t("supprimer")}</button>
            <button type="button" onClick={resetWizard} style={ghostBtn}>{t("fermer")}</button>
          </div>
        </>
      )}

      <div style={{ marginTop: 24 }} className="no-print">
        <div style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: "#C9962C", fontFamily: "'IBM Plex Mono', monospace", marginBottom: 10 }}>
          {t("historiqueDeclarationTitre")} ({declarations.length})
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          {declarations.length === 0 && <EmptyState text={t("aucuneDeclarationEnreg")} />}
          {declarations.map((c) => (
            <div key={c.id} style={cardStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontWeight: 600, color: "var(--text)" }}>{c.operateur}</div>
                <span style={{ fontSize: 11.5, fontFamily: "'IBM Plex Mono', monospace", color: "#C9962C" }}>{c.mois}</span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 4 }}>
                {c.commune} · {c.quantite} {c.unite} de {c.substance} · taxe totale : {Number(c.taxeTotale || 0).toLocaleString("fr-FR")} {c.devise || "XAF"}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
                <div style={{ fontSize: 11, color: "var(--text-faint)" }}>
                  {t("creeeParTexte")} {c.agent || "—"}{c.modifie ? ` · ${t("modifieeParTexte")} ${c.modifiePar || "—"}` : ""}
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    onClick={() => { setSavedRecord(c); setEditingId(null); setShowWizard(true); setWizStep("apercu"); }}
                    title={t("voirFicheTitle")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}
                  >
                    <Eye size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeDeclaration(c.id)}
                    title={t("supprimerTitle")}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#A8542E" }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---- Cartes d'artisans ---- */
function CarteRectoVerso({ artisan, commune }) {
  const t = useT();
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
    "CARTE:" + (artisan.numeroCarte || artisan.id)
  )}`;
  return (
    <div className="print-area" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div className="carte-page" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          {/* ============ RECTO ============ */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="no-print" style={{ fontSize: 11, color: "#A99B7F", marginBottom: 6, fontFamily: "'IBM Plex Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>Recto</div>
          <div
            className="carte-face"
            style={{
              width: 340,
              height: 214,
              border: "1px solid #DCD1B8",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(28,43,57,0.18)",
              fontFamily: "'IBM Plex Sans', sans-serif",
              background: "#fff",
              padding: "7px 9px 16px",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            <img
              src={LOGO_CAMEROUN}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 210,
                height: "auto",
                transform: "translate(-50%, -50%)",
                filter: "blur(3px)",
                opacity: 0.13,
                pointerEvents: "none",
              }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <CommuneLogo id={commune.id} size={40} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 8, fontWeight: 700, color: "#1C7A4A" }}>RÉPUBLIQUE DU CAMEROUN</div>
                <div style={{ fontSize: 5.5, fontWeight: 600, color: "#1C2B39", letterSpacing: "0.03em" }}>PAIX - TRAVAIL - PATRIE</div>
              </div>
              <img src={LOGO_CAMEROUN} alt="Armoiries du Cameroun" style={{ width: 34, height: "auto", objectFit: "contain" }} />
            </div>

            <div style={{ textAlign: "center", marginTop: 3 }}>
              <div style={{ fontWeight: 700, fontSize: 8, color: "#1C2B39", textTransform: "uppercase", lineHeight: 1.15 }}>{commune.commune}</div>
              <div style={{ fontWeight: 700, fontSize: 9, color: "#1C2B39", textTransform: "uppercase", lineHeight: 1.15 }}>{t("carteTitre")}</div>
            </div>

            <div style={{ display: "flex", gap: 7, marginTop: 5, flex: 1 }}>
              <div
                style={{
                  width: 56,
                  height: 66,
                  borderRadius: 2,
                  background: artisan.photo ? `url(${artisan.photo}) center/cover` : "#F1EBDD",
                  border: "1px solid #DCD1B8",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  WebkitPrintColorAdjust: "exact",
                  printColorAdjust: "exact",
                }}
              >
                {!artisan.photo && <Users size={18} color="#A99B7F" />}
              </div>
              <div style={{ flex: 1, minWidth: 0, fontSize: 6.3, color: "#1C2B39", lineHeight: 1.55 }}>
                <div><u>{t("nomDoc").toUpperCase()}</u> : <b>{artisan.nom.toUpperCase()}</b></div>
                <div><u>{t("prenomDoc").toUpperCase()}</u> : <b>{(artisan.prenom || "").toUpperCase()}</b></div>
                <div><u>{t("dateNaissanceDoc").toUpperCase()}</u> : <b>{formatDateFR(artisan.dateNaissance) || "—"}</b></div>
                <div><u>{t("lieuNaissanceDoc").toUpperCase()}</u> : <b>{(artisan.lieuNaissance || "—").toUpperCase()}</b></div>
                <div><u>{t("numeroCniCarte")}</u> : <b>{artisan.cni || "—"}</b></div>
                <div><u>{t("zoneProspectionCarte")}</u> : <b>{(artisan.zoneProspection || "Bénoué").toUpperCase()}</b></div>
                <div><u>{t("substanceExploitee")}</u> : <b>{(artisan.substance || "—").toUpperCase()}</b></div>
              </div>
              <div style={{ width: 70, flexShrink: 0, textAlign: "center", fontSize: 6 }}>
                <div style={{ color: "#1C2B39" }}>{t("numeroCarteCourt")} :</div>
                <div style={{ fontWeight: 700, fontSize: 6.3, color: "#1C2B39", marginTop: 1, whiteSpace: "nowrap" }}>{artisan.numeroCarte || "—"}</div>
                <div style={{ fontWeight: 700, lineHeight: 1.25, marginTop: 30 }}>{t("leMaireDe")} {commune.label.toUpperCase()}</div>
              </div>
            </div>

            <div style={{ textAlign: "center", fontSize: 6.3 }}>
              <span style={{ position: "relative", left: 12, textDecoration: "underline", fontStyle: "italic" }}>{t("signatureTitulaire")}</span>
            </div>

            <div style={{ marginTop: 2, marginBottom: 8, fontSize: 6.3, color: "#1C2B39", lineHeight: 1.5 }}>
              <div>{t("dateDelivranceCarte")} : <b>{formatDateFR(artisan.dateDelivrance) || "—"}</b></div>
              <div>{t("dateExpirationCarte")} : <b>{formatDateFR(artisan.dateExpiration) || "—"}</b></div>
            </div>
          </div>
          </div>

          {/* ============ VERSO ============ */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div className="no-print" style={{ fontSize: 11, color: "#A99B7F", margin: "22px 0 6px", fontFamily: "'IBM Plex Sans', sans-serif", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "center" }}>Verso</div>
          <div
            className="carte-face"
            style={{
              width: 340,
              height: 214,
              border: "1px solid #DCD1B8",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 10px 30px rgba(28,43,57,0.18)",
              fontFamily: "'IBM Plex Sans', sans-serif",
              background: "#fff",
              padding: "8px 10px",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 700, fontSize: 7.5, color: "#1C7A4A", lineHeight: 1.3 }}>LOI N° 2023/014 DU 19 DEC 2023</div>
              <div style={{ fontWeight: 700, fontSize: 6.3, color: "#1C7A4A", lineHeight: 1.3 }}>{t("loiTitreCarte")}</div>
            </div>

            <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
              <img src={LOGO_CAMEROUN} alt="Armoiries du Cameroun" style={{ width: 36, height: "auto", objectFit: "contain" }} />
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "flex-start", flex: 1 }}>
              <img src={qrSrc} alt="QR code de vérification" style={{ width: 72, height: 72, borderRadius: 3, flexShrink: 0 }} />
              <div style={{ fontSize: 6, color: "#5B5346", lineHeight: 1.4 }}>
                {t("verificationQr")} {commune.commune.replace("Commune de ", "")}.
              </div>
            </div>

            <div style={{ padding: "5px 7px", background: "#F1EBDD", borderRadius: 4, fontSize: 6, fontStyle: "italic", fontWeight: 600, color: "#1C2B39", lineHeight: 1.35 }}>
              {t("mentionLegaleCarte")}
            </div>
          </div>
          </div>
      </div>
    </div>
  );
}

function Cartes({ artisans, cartes, setCartes, accessToken, agent }) {
  const t = useT();
  const [mode, setMode] = useState("idle"); // idle | select | generated
  const [genArtisanId, setGenArtisanId] = useState("");
  const [showRepertoire, setShowRepertoire] = useState(false);
  const [repArtisanId, setRepArtisanId] = useState("");

  const savedArtisanIds = cartes.map((c) => c.artisanId);

  const artisanGen = artisans.find((a) => a.id === genArtisanId);
  const communeGen = artisanGen ? (ARRONDISSEMENTS.find((a) => a.id === artisanGen.arrondissementId) || ARRONDISSEMENTS[0]) : null;

  const artisansAvecCarte = artisans.filter((a) => savedArtisanIds.includes(a.id));
  const artisanRep = artisans.find((a) => a.id === repArtisanId);
  const communeRep = artisanRep ? (ARRONDISSEMENTS.find((a) => a.id === artisanRep.arrondissementId) || ARRONDISSEMENTS[0]) : null;
  const carteRep = artisanRep ? cartes.find((c) => c.artisanId === artisanRep.id) : null;

  const sauvegarderCarte = () => {
    if (!genArtisanId) return;
    const next = savedArtisanIds.includes(genArtisanId)
      ? cartes
      : [...cartes, { id: uid(), artisanId: genArtisanId, creePar: fullName(agent), creeLe: new Date().toISOString() }];
    setCartes(next);
    saveKey(STORAGE_KEYS.cartes, next, accessToken);
    setMode("idle");
    setGenArtisanId("");
  };

  const annuler = () => {
    setMode("idle");
    setGenArtisanId("");
  };

  return (
    <div>
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; }
          .no-print { display: none !important; }
          .carte-page { flex-direction: row !important; align-items: flex-start !important; gap: 8mm !important; padding: 0 !important; margin: 0 !important; }
          .carte-face { box-shadow: none !important; border: none !important; margin: 0 !important; }
          @page { size: 185.21mm 56.61mm; margin: 0; }
        }
      `}</style>
      <SectionHeader title={t("carteArtisanMinierTitre")} subtitle={t("genererCarteRectoVerso")} />

      {mode === "idle" && (
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            type="button"
            style={primaryBtn}
            onClick={() => { setMode("select"); setShowRepertoire(false); }}
          >
            <CreditCard size={14} /> {t("genererUneCarte")}
          </button>
          <button
            type="button"
            style={ghostBtn}
            onClick={() => { setShowRepertoire((s) => !s); setMode("idle"); setRepArtisanId(""); }}
          >
            <Search size={14} /> {t("carteBtn")}
          </button>
        </div>
      )}

      {mode === "idle" && showRepertoire && (
        <div style={{ ...cardStyle, marginTop: 16, maxWidth: 340 }}>
          <label style={labelStyle}>{t("choisirUnArtisan")}</label>
          <select style={inputStyle} value={repArtisanId} onChange={(e) => setRepArtisanId(e.target.value)}>
            <option value="">{t("choisirOpt")}</option>
            {artisansAvecCarte.map((a) => <option key={a.id} value={a.id}>{a.prenom ? `${a.prenom} ${a.nom}` : a.nom}</option>)}
          </select>
          {artisansAvecCarte.length === 0 && (
            <div style={{ fontSize: 12.5, color: "var(--text-faint)", marginTop: 10 }}>{t("aucuneCarteInstant")}</div>
          )}
        </div>
      )}

      {mode === "idle" && showRepertoire && artisanRep && communeRep && (
        <div style={{ marginTop: 18 }}>
          <CarteRectoVerso artisan={artisanRep} commune={communeRep} />
          {carteRep?.creePar && (
            <div className="no-print" style={{ textAlign: "center", fontSize: 11.5, color: "var(--text-faint)", marginTop: 10 }}>
              {t("genereeParTexte")} <b style={{ color: "var(--text-muted)" }}>{carteRep.creePar}</b>{carteRep.creeLe ? ` ${t("leMot")} ${formatDateTimeFR(carteRep.creeLe)}` : ""}
            </div>
          )}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16 }}>
            <button type="button" style={primaryBtn} onClick={() => window.print()}>
              <Printer size={14} /> {t("telechargerPdf")}
            </button>
            <button type="button" style={ghostBtn} onClick={() => { setShowRepertoire(false); setRepArtisanId(""); }}>
              {t("fermer")}
            </button>
          </div>
        </div>
      )}

      {mode === "select" && (
        <div style={{ ...cardStyle, marginTop: 16, maxWidth: 340 }}>
          <label style={labelStyle}>{t("choisirUnArtisan")}</label>
          <select style={inputStyle} value={genArtisanId} onChange={(e) => setGenArtisanId(e.target.value)}>
            <option value="">{t("choisirOpt")}</option>
            {artisans.map((a) => <option key={a.id} value={a.id}>{a.prenom ? `${a.prenom} ${a.nom}` : a.nom}</option>)}
          </select>
          {artisans.length === 0 && (
            <div style={{ fontSize: 12.5, color: "#A8542E", marginTop: 10 }}>{t("registreVideMessage")}</div>
          )}
          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button type="button" style={primaryBtn} disabled={!genArtisanId} onClick={() => setMode("generated")}>{t("genererBtn")}</button>
            <button type="button" style={ghostBtn} onClick={annuler}>{t("annuler")}</button>
          </div>
        </div>
      )}

      {mode === "generated" && artisanGen && communeGen && (
        <div style={{ marginTop: 18 }}>
          <CarteRectoVerso artisan={artisanGen} commune={communeGen} />
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 16, flexWrap: "wrap" }}>
            <button type="button" style={ghostBtn} onClick={() => window.print()}>
              <Printer size={14} /> {t("telechargerPdf")}
            </button>
            <button type="button" style={primaryBtn} onClick={sauvegarderCarte}>
              {t("sauvegarderBtn")}
            </button>
            <button type="button" style={ghostBtn} onClick={annuler}>{t("annuler")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- QR code ---- */
function QrCodeTab() {
  const [url, setUrl] = useState("https://exemple-delegation-bibemi.mon-site.cm");
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(url)}`;

  return (
    <div>
      <SectionHeader title="Accès rapide par QR code" subtitle="Génère un QR code pointant vers l'adresse du site une fois publié" />
      <div style={cardStyle}>
        <label style={labelStyle}>Adresse du site (une fois publié)</label>
        <input style={{ ...inputStyle, maxWidth: 420 }} value={url} onChange={(e) => setUrl(e.target.value)} />
        <div style={{ marginTop: 18 }}>
          <img src={qrSrc} alt="QR code du site" style={{ borderRadius: 6, border: "1px solid var(--border)" }} />
        </div>
        <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 12, maxWidth: 420, lineHeight: 1.6 }}>
          Ce code n'est fonctionnel qu'une fois le site publié à une adresse réelle. Remplacez l'adresse ci-dessus par celle de votre site en ligne, puis imprimez ou partagez ce QR code sur le terrain.
        </div>
      </div>
    </div>
  );
}

/* ---- Inspecteurs ---- */
function Agents({ currentAgent, accessToken }) {
  const t = useT();
  const [agents, setAgents] = useState([currentAgent]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await supaFetch("/rest/v1/agents?select=*&order=created_at.asc", {}, accessToken);
        if (!cancelled) setAgents((rows || []).map((r) => fromDb("agents", r)));
      } catch (e) {
        console.error("Impossible de charger la liste des inspecteurs", e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [accessToken]);

  const removeAgent = async (id) => {
    if (!window.confirm(t("confirmerSuppressionInspecteur2"))) return;
    try {
      await supaFetch(`/rest/v1/agents?id=eq.${id}`, { method: "DELETE" }, accessToken);
      setAgents((prev) => prev.filter((a) => a.id !== id));
    } catch (e) {
      alert(t("suppressionImpossibleMoment"));
    }
  };

  return (
    <div>
      <SectionHeader
        title={t("inspecteursAutorises")}
        subtitle={t("nouveauxComptesInfo")}
      />

      {loading && <div style={{ fontSize: 12.5, color: "var(--text-faint)", marginTop: 10 }}>{t("chargementInspecteurs")}</div>}

      <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
        {agents.map((a) => (
          <div key={a.id} style={{ ...cardStyle, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 5,
                  background: a.photo ? `url(${a.photo}) center/cover` : "var(--bg-page)",
                  border: "1px solid var(--border-light)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {!a.photo && <Users size={16} color="var(--text-faint)" />}
              </div>
              <div>
                <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 600 }}>
                  {a.prenom ? `${a.prenom} ${a.nom}` : a.nom}{" "}
                  {a.id === currentAgent.id && <span style={{ fontSize: 11, color: "#C9962C", fontWeight: 400 }}>{t("vousTexte")}</span>}
                </div>
                <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: "'IBM Plex Mono', monospace" }}>
                  {a.login} · {a.matricule || "—"} · {a.role === "admin" ? t("administrateurRole") : t("inspecteurRole")}
                </div>
              </div>
            </div>
            {a.id === currentAgent.id && (
              <button onClick={() => removeAgent(a.id)} style={{ background: "none", border: "none", color: "#A8542E", cursor: "pointer" }}>
                <X size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---- shared bits ---- */
function SectionHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
      <div>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, color: "var(--text)", margin: 0 }}>{title}</h2>
        {subtitle && <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>{subtitle}</div>}
      </div>
      {action}
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div style={{ ...cardStyle, textAlign: "center", color: "var(--text-faint)", fontSize: 13.5, padding: "28px 18px" }}>
      {text}
    </div>
  );
}

/* Image d'illustration en arrière-plan (voilée) selon le type d'exploitant, utilisée dans les
   écrans d'enregistrement, de déclaration et de fiche de contrôle (artisans / eaux / carrières). */
function typeBgStyle(type) {
  const img = type === "carrieres" ? "/images/carriere-bg.jpg" : type === "artisan" ? "/images/artisan-bg.jpg" : "/images/eau-bg.jpg";
  return {
    backgroundImage: `linear-gradient(rgba(250,248,243,0.94), rgba(250,248,243,0.94)), url(${img})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  };
}

const cardStyle = {
  background: "#fff",
  border: "1px solid var(--border-light)",
  borderRadius: 4,
  padding: "16px 18px",
  boxShadow: "0 1px 3px rgba(28,43,57,0.05)",
  transition: "box-shadow 0.15s ease",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  color: "var(--text-muted)",
  marginBottom: 5,
};

/* ---------------------------------------------------------------
   Root
--------------------------------------------------------------- */
export default function App() {
  const [view, setView] = useState("home"); // home | login | dashboard
  const [agent, setAgent] = useState(null);
  const [session, setSession] = useState(null); // { accessToken }
  const [artisans, setArtisans] = useState([]);
  const [exploitants, setExploitants] = useState([]);
  const [controles, setControles] = useState([]);
  const [etablissements, setEtablissements] = useState([]);
  const [plannings, setPlannings] = useState([]);
  const [rapports, setRapports] = useState([]);
  const [cartes, setCartes] = useState([]);
  const [saveError, setSaveError] = useState(null);
  const [siteSection, setSiteSection] = useState("miniere"); // "miniere" | "industriel"
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileGateOpen, setProfileGateOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [arrondissement, setArrondissement] = useState("bibemi");
  const [jumpTab, setJumpTab] = useState(null);
  const [parametres, setParametres] = useState({
    telephone: "+237 6XX XXX XXX",
    email: "contact@delegation-benoue.cm",
    adresse: "Délégation départementale, Bénoué",
    seuilRenouvellement: 60,
  });
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("theme") || "clair"; } catch { return "clair"; }
  });
  const [langue, setLangue] = useState(() => {
    try { return localStorage.getItem("langue") || "fr"; } catch { return "fr"; }
  });

  const changeTheme = (t) => {
    setTheme(t);
    try { localStorage.setItem("theme", t); } catch {}
  };
  const changeLangue = (l) => {
    setLangue(l);
    try { localStorage.setItem("langue", l); } catch {}
  };

  /* Affiche une bannière visible si un enregistrement Supabase échoue (au lieu d'un échec
     silencieux qui donnait l'impression que les données disparaissaient à la reconnexion). */
  useEffect(() => {
    const onSaveError = (e) => setSaveError(e.detail);
    window.addEventListener("supabase-save-error", onSaveError);
    return () => window.removeEventListener("supabase-save-error", onSaveError);
  }, []);

  const handleLogin = async (agentProfile, accessToken) => {
    setAgent(agentProfile);
    setSession({ accessToken });
    setView("dashboard");
    const [a, c, ca, pa, ex, et, pl, rp] = await Promise.all([
      loadKey(STORAGE_KEYS.artisans, [], accessToken),
      loadKey(STORAGE_KEYS.controles, [], accessToken),
      loadKey(STORAGE_KEYS.cartes, [], accessToken),
      loadKey(STORAGE_KEYS.parametres, [], accessToken),
      loadKey(STORAGE_KEYS.exploitants, [], accessToken),
      loadKey(STORAGE_KEYS.etablissements, [], accessToken),
      loadKey(STORAGE_KEYS.plannings, [], accessToken),
      loadKey(STORAGE_KEYS.rapports, [], accessToken),
    ]);
    setArtisans(a);
    setControles(c);
    setCartes(ca);
    setExploitants(ex);
    setEtablissements(et);
    setPlannings(pl);
    setRapports(rp);
    if (pa && pa[0]) setParametres((prev) => ({ ...prev, ...pa[0] }));
  };

  const handleLogout = (redirectTo = "home") => {
    setAgent(null);
    setSession(null);
    setArtisans([]);
    setExploitants([]);
    setControles([]);
    setEtablissements([]);
    setPlannings([]);
    setRapports([]);
    setCartes([]);
    setView(redirectTo);
    setMenuOpen(false);
    setProfileGateOpen(false);
    setProfileOpen(false);
  };

  return (
    <div data-theme={theme} style={{ minHeight: "100vh" }}>
      <style>{FONTS}</style>
      <style>{THEME_VARS}</style>
      <LangueContext.Provider value={langue}>

      <MenuDrawer
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        agent={agent}
        artisans={artisans}
        exploitants={exploitants}
        controles={controles}
        onLogout={handleLogout}
        onOpenProfile={() => { setProfileGateOpen(true); setMenuOpen(false); }}
        onOpenLogin={() => { setView("login"); setMenuOpen(false); }}
        onGoHome={() => { setView("home"); setMenuOpen(false); }}
        onGoDashboard={() => { setView("dashboard"); setMenuOpen(false); }}
        onJumpToTab={(t) => setJumpTab(t)}
        arrondissement={arrondissement}
        setArrondissement={setArrondissement}
        parametres={parametres}
        setParametres={setParametres}
        accessToken={session?.accessToken}
        theme={theme}
        changeTheme={changeTheme}
        langue={langue}
        changeLangue={changeLangue}
        siteSection={siteSection}
        setSiteSection={setSiteSection}
      />

      {profileGateOpen && agent && (
        <ProfileLockScreen
          agent={agent}
          onUnlock={() => { setProfileGateOpen(false); setProfileOpen(true); }}
          onCancel={() => setProfileGateOpen(false)}
        />
      )}

      {saveError && (
        <div
          style={{
            position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
            background: "#A8542E", color: "#fff", fontSize: 12.5,
            padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
            fontFamily: "'IBM Plex Sans', sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
          }}
        >
          <span>
            <b>Échec de l'enregistrement en ligne</b> (table « {saveError.table} ») — vos dernières modifications n'ont pas été sauvegardées sur le serveur.
            Vérifiez votre connexion et que le script <code>supabase-migration.sql</code> a bien été exécuté, puis réessayez.
            {saveError.message ? ` Détail : ${saveError.message}` : ""}
          </span>
          <button
            type="button"
            onClick={() => setSaveError(null)}
            style={{ background: "none", border: "1px solid rgba(255,255,255,0.5)", borderRadius: 4, color: "#fff", cursor: "pointer", padding: "3px 8px", flexShrink: 0 }}
          >
            Fermer
          </button>
        </div>
      )}

      {profileOpen && agent && (
        <ProfileEdit
          agent={agent}
          accessToken={session?.accessToken}
          setAgent={setAgent}
          onClose={() => setProfileOpen(false)}
          onLogoutToLogin={() => { setProfileOpen(false); handleLogout("login"); }}
          onLockNow={() => setProfileOpen(false)}
        />
      )}

      {view === "home" && (
        <Home onEnter={() => setView("login")} arrondissement={arrondissement} onOpenMenu={() => setMenuOpen(true)} agent={agent} parametres={parametres} />
      )}
      {view === "login" && (
        <LoginScreen onBack={() => setView("home")} onLogin={handleLogin} />
      )}
      {view === "dashboard" && agent && session && siteSection === "miniere" && (
        <Dashboard
          agent={agent}
          accessToken={session.accessToken}
          artisans={artisans}
          setArtisans={setArtisans}
          exploitants={exploitants}
          setExploitants={setExploitants}
          controles={controles}
          setControles={setControles}
          cartes={cartes}
          setCartes={setCartes}
          arrondissement={arrondissement}
          onOpenMenu={() => setMenuOpen(true)}
          jumpTab={jumpTab}
          seuilRenouvellement={parametres.seuilRenouvellement}
        />
      )}
      {view === "dashboard" && agent && session && siteSection === "industriel" && (
        <DashboardIndustriel
          agent={agent}
          accessToken={session.accessToken}
          etablissements={etablissements}
          setEtablissements={setEtablissements}
          plannings={plannings}
          setPlannings={setPlannings}
          rapports={rapports}
          setRapports={setRapports}
          arrondissement={arrondissement}
          onOpenMenu={() => setMenuOpen(true)}
        />
      )}
      </LangueContext.Provider>
    </div>
  );
}
