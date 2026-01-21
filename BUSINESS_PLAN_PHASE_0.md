# Business Plan Phase 0 - Sequoia & EduScan Analytics
**Période : Janvier - Juin 2026**  
**Objectif : Atteindre 500 000 - 2 000 000 FCFA MRR avec bootstrap total**

---

## 🎯 Situation Actuelle & Décision Stratégique

### État des Lieux

| Projet | Positionnement | Cible | Ticket Moyen | Maturité Technique |
|--------|---------------|-------|--------------|-------------------|
| **Sequoia** | Assistant Pédagogique Premium (B2C) | Enseignants individuels (Lycées FR, écoles privées) | 15 000 FCFA/mois/prof | ✅ Fonctionnel (React + Firebase + Groq) |
| **EduScan** | Unité d'Évaluation Externalisée (B2B) | Directions d'établissements (Classes d'examen) | 450 000 FCFA/mois/classe OU 1,2M FCFA/trimestre | ⚠️ Code introuvable (PDF de test existants) |

### Recommandation Stratégique : **"Tête de Pont Hybride"**

**Décision : Lancer SEQUOIA en premier, pivoter vers EduScan après validation.**

**Pourquoi ?**
1. **Sequoia est prêt techniquement** : Tu as déjà l'app, l'IA fonctionne (Groq), Firebase est configuré.
2. **Cycle de vente court** : Un prof peut payer 15k FCFA de sa poche en 5 minutes. Un directeur pour 450k FCFA demande minimum 3 semaines de négociation.
3. **Validation rapide de l'IA** : Si l'IA de Sequoia génère des feedbacks satisfaisants, tu sauras qu'elle peut gérer EduScan (qui est la même brique technique mais en mode "batch processing").
4. **Capital symbolique** : Quand tu iras vendre EduScan à un directeur, tu diras *"Notre IA a déjà corrigé 5 000 copies pour 30 profs"*. Ça valide instantanément.

---

## 📅 Roadmap Phase 0 (6 Mois)

### Mois 1-2 : Lancement Sequoia (Février - Mars 2026)

#### Semaine 1-2 : Finitions & Préparation
- [ ] **Audit technique Sequoia**
  - Vérifier l'authentification Firebase (Login/Signup fonctionnel)
  - Tester le flux complet : Création session → Notation → Export PDF
  - Valider la qualité des feedbacks IA (tester sur 10 copies réelles)
  - Optimiser le style/UX pour mobile (80% des profs corrigent sur téléphone le soir)

- [ ] **Créer les supports de vente**
  - Vidéo démo 90 secondes (écran + voiceover) : "Corrigez 60 copies en 1h au lieu de 3h"
  - Landing page simple (titre, démo, pricing, CTA WhatsApp)
  - Deck de présentation (5 slides max pour pitch direct)

- [ ] **Définir le pricing final**
  - Option A : **15 000 FCFA/mois** (abonnement illimité)
  - Option B : **Freemium** (10 copies gratuites/mois, puis 15k pour illimité)
  - Option C : **Pay-as-you-go** (500 FCFA/copie, pack 50 copies = 20 000 FCFA)
  - **Recommandation** : Lancer avec Option B (freemium attire, puis upsell sur usage)

#### Semaine 3-4 : Acquisition des 5 Premiers Utilisateurs
- [ ] **Prospection directe (Terrain)**
  - Identifier 3 lycées privés ou AEFE à proximité
  - Aller en salle des profs à la pause (15h-16h) ou après les cours
  - Pitch : "Je vous offre 1 mois gratuit si vous testez aujourd'hui sur vos 5 prochaines copies"
  - Objectif : **5 profs testeurs** (2 FR, 1 Hist-Géo, 1 Philo, 1 SES)

- [ ] **Feedback Loop**
  - Appel individuel après 1 semaine d'utilisation
  - Collecter : Temps gagné réel, bugs rencontrés, feedbacks préférés des élèves
  - Ajuster l'IA si besoin (prompts, ton, longueur)

#### Semaine 5-8 : Conversion & Scaling Soft
- [ ] **Convertir les testeurs**
  - Email final du mois gratuit : "Votre bilan : Vous avez gagné 8h ce mois-ci. Pour continuer : 15 000 FCFA/mois"
  - Objectif : **3/5 conversions minimum** = 45 000 FCFA MRR

- [ ] **Bouche-à-oreille structuré**
  - Offrir 1 mois gratuit pour chaque nouveau prof parrainé
  - Demander aux 3 payants de présenter Sequoia en salle des profs (tu es présent)
  - Objectif : +5 profs payants = **120 000 FCFA MRR total**

### Mois 3-4 : Industrialisation du Go-to-Market (Avril - Mai 2026)

#### Acquisition Digitale (Low-Cost)
- [ ] **Ads Facebook/Instagram ultra-ciblées**
  - Audience : "Enseignant" + Localisation (ta ville + capitales AEFE)
  - Budget test : 50 000 FCFA/mois
  - Créa : Carrousel "Avant/Après" (texte brouillon du prof → feedback IA impeccable)
  - Objectif : 20 clics → 5 inscrits → 2 payants (CPA : 25 000 FCFA)

- [ ] **Partenariats écoles**
  - Proposer aux directions : "Offre Corporate" = 10 000 FCFA/mois/prof si 5+ profs de l'école s'inscrivent
  - Objectif : 1 école partenaire (7 profs) = +70 000 FCFA MRR

#### Jalons Financiers
- **Fin Mois 3** : 10-15 profs payants = **150 000 - 225 000 FCFA MRR**
- **Fin Mois 4** : 20-30 profs payants = **300 000 - 450 000 FCFA MRR**

### Mois 5-6 : Pivot EduScan (Juin 2026)

#### Conditions de Déclenchement du Pivot
✅ Sequoia a > 20 utilisateurs payants  
✅ L'IA génère des feedbacks jugés "excellents" (NPS > 8/10)  
✅ MRR Sequoia > 300 000 FCFA (cash disponible pour investir dans EduScan)

#### Sprint EduScan (Si conditions remplies)
- [ ] **Développement du MVP EduScan**
  - Interface "Opérateur" (upload PDF, split pages, queue manager)
  - Intégration OCR (Tesseract.js ou API Google Vision si budget)
  - Réutiliser la brique IA de Sequoia (même Groq, même prompts, mode batch)
  - Générateur de livrables (PDF feedback élèves + CSV notes + Dashboard direction)
  - **Timeline** : 3 semaines de dev intensif

- [ ] **Test Pilote (1 École)**
  - Trouver 1 collège/lycée privé prêt à tester sur 1 devoir
  - Proposition : "Correction gratuite de votre prochaine composition de 3ème (1 matière)"
  - Objectif : Livrer les résultats en 48h, WOW la direction
  - Négocier contrat trimestre suivant : **1 200 000 FCFA/trimestre pour 2 classes**

#### Jalons Financiers EduScan
- **Fin Mois 6** : 
  - Sequoia : 25 profs = 375 000 FCFA MRR
  - EduScan : 1 contrat signé (1,2M FCFA sur 3 mois) = +400 000 FCFA/mois proraté
  - **MRR Total : ~775 000 FCFA**

---

## 💰 Modèle Économique & Coûts

### Structure de Prix

#### Sequoia (B2C)
| Formule | Prix | Cible | Conversion Estimée |
|---------|------|-------|-------------------|
| Freemium | 0 FCFA (10 copies max) | Acquisition | 100 inscrits/mois |
| Premium | 15 000 FCFA/mois | Utilisateurs réguliers | 30% des freemium (30 payants) |
| Corporate | 10 000 FCFA/mois/prof (si 5+) | Établissements | 2-3 écoles/trimestre |

#### EduScan Analytics (B2B)
| Formule | Prix | Cible | Valeur Perçue |
|---------|------|-------|---------------|
| Mensuel | 450 000 FCFA/mois/classe | Compositions mensuelles | Gain temps secrétariat (30h) + profs (60h) |
| Trimestriel | 1 200 000 FCFA (10% réduc) | Compositions + examens blancs | Paiement upfront = trésorerie |
| Annuel | 4 000 000 FCFA (25% réduc) | Fidélisation long terme | Prédictibilité revenue |

### Coûts Opérationnels (Phase 0)

| Poste | Coût Mensuel | Notes |
|-------|-------------|-------|
| **Hébergement Firebase** | 0 - 15 000 FCFA | Gratuit jusqu'à 50 utilisateurs actifs/jour |
| **API Groq (Llama 3)** | 0 - 30 000 FCFA | Plan gratuit : 200 req/jour. Si dépassement → 0.70$/1M tokens (~20 FCFA/feedback) |
| **Domaine + Email Pro** | 5 000 FCFA | sequoia.education + contact@sequoia.education |
| **Marketing Digital** | 50 000 FCFA | Ads Facebook ciblées |
| **Téléphonie/Data** | 10 000 FCFA | WhatsApp Business, démos terrain |
| **Déplacements** | 20 000 FCFA | Visites écoles, meetings clients |
| **TOTAL** | **80 000 - 130 000 FCFA/mois** | Marge brute : 70-85% |

### Seuil de Rentabilité
- **Break-even Sequoia** : 6 profs payants (90 000 FCFA MRR) → Atteint Mois 2
- **Break-even EduScan** : 1 contrat trimestriel → Atteint Mois 6

---

## 🎬 Plan d'Action Immédiat (Semaine 1 - Post-Vacances)

### Jour 1-2 : Audit & Décision
- [ ] Lancer Sequoia en local, tester l'app de bout en bout
- [ ] Corriger 5 copies fictives, vérifier qualité feedbacks IA
- [ ] Décision finale : "Je lance Sequoia" (GO/NO-GO basé sur satisfaction personnelle de l'outil)

### Jour 3-4 : Préparation Terrain
- [ ] Créer une vidéo démo (téléphone qui filme l'écran + voix)
- [ ] Rédiger le pitch 30 secondes (à tester devant miroir)
- [ ] Identifier 2 écoles cibles (chercher sur Google Maps "Lycée privé [ta ville]")
- [ ] Préparer un "cadeau" : Carte de visite + QR Code démo

### Jour 5 : Premier Contact
- [ ] Aller en salle des profs à 15h (pause café)
- [ ] Approche : "Bonjour, je suis développeur et j'ai créé un assistant IA pour les profs. Vous avez 2 minutes pour une démo ?"
- [ ] Objectif : Enregistrer 2 profs dans l'app AVEC LEUR NUMÉRO (pour suivi WhatsApp)

### Semaine 2 : Boucle de Feedback
- [ ] Message WhatsApp J+3 : "Bonjour [Prénom], avez-vous pu tester sur une copie ? Besoin d'aide ?"
- [ ] Appel J+7 : Recueillir verbatim (enregistrer avec permission)
- [ ] Ajuster prompts IA si feedbacks jugés "trop longs" ou "pas assez personnalisés"

---

## 📊 KPIs & Métriques de Succès

### Sequoia (Suivi Hebdomadaire)

| Métrique | Objectif Mois 2 | Objectif Mois 4 | Objectif Mois 6 |
|----------|----------------|-----------------|-----------------|
| **Utilisateurs Inscrits** | 15 | 50 | 120 |
| **Utilisateurs Payants** | 3 | 15 | 30 |
| **MRR** | 45 000 FCFA | 225 000 FCFA | 450 000 FCFA |
| **Taux de Conversion Freemium→Premium** | 20% | 30% | 35% |
| **NPS (Satisfaction)** | 7/10 | 8/10 | 9/10 |
| **Copies Corrigées (Total)** | 150 | 1 000 | 3 000 |

### EduScan (Suivi Mensuel - Dès Mois 5)

| Métrique | Objectif Mois 6 | Objectif Fin Année 1 |
|----------|-----------------|---------------------|
| **Contrats Signés** | 1 (1 classe) | 5 (5 classes ou 2 établissements) |
| **MRR** | 400 000 FCFA | 2 000 000 FCFA |
| **Copies Traitées/Mois** | 420 (1 classe x 7 matières x 60 élèves) | 2 100 |
| **Délai de Livraison Moyen** | < 48h | < 24h (avec scanner ADF) |

### Indicateurs d'Alerte (Red Flags)

🚨 **Arrêter et pivoter si :**
- Mois 2 : < 2 utilisateurs payants Sequoia (marché inexistant ou produit inadapté)
- Mois 3 : Taux de churn > 50% (les profs annulent après 1 mois = problème de valeur)
- Mois 4 : Coût d'acquisition client (CAC) > 50 000 FCFA/prof (pas rentable, revoir distribution)

---

## 🔧 Risques & Mitigation

### Risques Techniques

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Limite API Groq (200 req/jour)** | Blocage croissance | Élevée | Passer à plan payant dès 100 FCFA MRR (coût marginal 20 FCFA/feedback acceptable) |
| **Qualité feedbacks IA jugée "robotique"** | Churn élevé | Moyenne | A/B test sur 3 styles de prompts, laisser le prof choisir son "ton" (strict/bienveillant/motivant) |
| **Firebase coûteux après 50 utilisateurs** | Marge réduite | Faible | Migration vers PostgreSQL + Supabase si dépassement (prévoir 2 jours de dev) |

### Risques Commerciaux

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Profs réticents à l'IA** | Adoption lente | Moyenne | Positionner comme "Assistant" et non "Remplacement". Le prof garde la main sur note et validation finale |
| **Budget serré des écoles (EduScan)** | Paiements retardés | Élevée | Exiger 50% d'acompte à la signature, 50% à livraison des résultats. Pas de crédit. |
| **Copie par concurrent** | Perte d'avantage | Faible (court terme) | Breveter le "workflow vocal + IA" ? Non prioritaire. Miser sur l'exécution rapide (first-mover advantage) |

### Risques Personnels

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Manque de temps (job/études parallèles)** | Lancement retardé | Élevée | Bloquer 2h/jour non-négociables (6h-8h matin OU 22h-00h soir). Weekends = sprint intensifs. |
| **Découragement après échecs commerciaux** | Abandon | Moyenne | Groupe de soutien (1 ami accountability partner). Célébrer micro-victoires (1er inscrit, 1er payant, 1er feedback positif élève). |

---

## 🎓 Condition de Passage à la "Phase 1" (Scale)

### Critères de Validation (Juillet 2026)

✅ **MRR Total ≥ 500 000 FCFA** (combiné Sequoia + EduScan)  
✅ **Trésorerie ≥ 1 500 000 FCFA** (pour investir dans scanner ADF + 3 mois de runway)  
✅ **NPS ≥ 8/10** (les utilisateurs recommandent activement)  
✅ **2+ contrats EduScan signés** (preuve que le B2B fonctionne)

### Investissements Phase 1 (Si validation)

1. **Scanner Professionnel ADF** : ~1 000 000 FCFA (Fujitsu ScanSnap ou équivalent)
2. **Migration API Premium** : Google Document AI (OCR manuscrite haut de gamme) = 150 000 FCFA/mois
3. **Recrutement** : 1 Assistant Opérationnel (scan, upload, support client) = 150 000 FCFA/mois
4. **Marketing Scale** : 300 000 FCFA/mois (Ads, événements, salons éducation)

**Objectif Phase 1** : Atteindre **5 000 000 FCFA MRR** en 12 mois (Décembre 2026).

---

## 🚀 Engagement Personnel

### Mes 3 Règles d'Or (Phase 0)

1. **"Ship, Don't Perfect"** : Lancer Sequoia même si l'UI n'est pas "Instagram-ready". Un prof qui gagne 2h s'en fout des animations CSS.
2. **"Talk to Users Every Week"** : Minimum 3 conversations de 15 minutes avec des utilisateurs actuels ou potentiels. Les insights terrain valent 100x les suppositions.
3. **"Cash is Oxygen"** : Chaque FCFA gagné est réinvesti (jusqu'à atteindre 6 mois de runway). Pas de lifestyle creep.

### Journal de Bord (Accountability)

Je vais tenir un fichier `JOURNAL.md` où chaque semaine je note :
- ✅ Actions réalisées
- 💰 MRR actuel
- 😊 Victoire de la semaine (même micro)
- 😓 Blocker principal
- 🎯 3 actions pour la semaine suivante

---

## 📞 Support & Next Steps

**Prochaine Action (Dans les 48h) :**
- [ ] Lire ce plan à voix haute (pour l'ancrer)
- [ ] Valider techniquement Sequoia avec test réel de 5 copies
- [ ] Prendre rendez-vous avec toi-même dans agenda : "Lundi 9h : Visite Lycée [Nom]"

**Contact :**
- WhatsApp Business : [À créer]
- Email Pro : contact@sequoia.education [À configurer]
- LinkedIn : [Créer profil "Fondateur Sequoia/EduScan" pour crédibilité]

---

**Dernière mise à jour** : 21 janvier 2026  
**Prochaine révision** : 21 février 2026 (post-premier mois)

---

*"Le meilleur moment pour planter un arbre était il y a 20 ans. Le deuxième meilleur moment, c'est maintenant."*  
— Proverbe que Sequoia (l'arbre) approuve. 🌲
