/**
 * Séquoia - AI Feedback Generator
 * Transforms teacher's raw input into professional, kind pedagogical feedback
 */

// Feedback templates based on performance levels
const FEEDBACK_TEMPLATES = {
    excellent: {
        intro: [
            "Excellent travail !",
            "Félicitations pour ce travail de grande qualité !",
            "Bravo, c'est un travail remarquable !",
            "Un travail qui témoigne d'un réel investissement."
        ],
        body: [
            "Tu maîtrises parfaitement les concepts abordés.",
            "Ta réflexion est approfondie et bien structurée.",
            "L'argumentation est solide et convaincante.",
            "Tu fais preuve d'une excellente compréhension du sujet."
        ],
        conclusion: [
            "Continue sur cette lancée !",
            "C'est exactement ce qui est attendu, voire au-delà.",
            "Un travail qui peut servir d'exemple.",
            "Tes efforts portent leurs fruits, bravo !"
        ]
    },
    good: {
        intro: [
            "Bon travail dans l'ensemble.",
            "Un travail satisfaisant.",
            "Tu as fourni un travail de bonne qualité.",
            "C'est un travail bien mené."
        ],
        body: [
            "Tu as compris l'essentiel des notions.",
            "Ton travail montre une bonne maîtrise du sujet.",
            "L'analyse est pertinente dans sa globalité.",
            "Tu démontres de bonnes capacités de réflexion."
        ],
        conclusion: [
            "Quelques approfondissements te permettraient de viser l'excellence.",
            "Avec un peu plus de rigueur, tu peux encore progresser.",
            "Continue à approfondir ton analyse pour aller encore plus loin.",
            "Tu es sur la bonne voie !"
        ]
    },
    average: {
        intro: [
            "Un travail correct qui mérite d'être approfondi.",
            "Tu as fait des efforts, mais le résultat reste moyen.",
            "C'est un travail acceptable, avec des points à améliorer.",
            "Tu as posé les bases, mais il faut aller plus loin."
        ],
        body: [
            "Certaines notions semblent comprises, d'autres méritent d'être revues.",
            "L'analyse reste en surface et gagnerait à être développée.",
            "Il y a de bonnes idées, mais elles ne sont pas assez exploitées.",
            "La structure est présente mais le contenu doit être enrichi."
        ],
        conclusion: [
            "Je t'encourage à revoir les points essentiels du cours.",
            "N'hésite pas à me solliciter si tu as des questions.",
            "Avec plus de travail, tu peux nettement progresser.",
            "Prends le temps de relire les consignes pour les prochains travaux."
        ]
    },
    below: {
        intro: [
            "Ce travail est en dessous des attentes.",
            "Des difficultés importantes sont visibles dans ce travail.",
            "Le travail fourni n'est pas suffisant.",
            "Il y a des lacunes importantes à combler."
        ],
        body: [
            "Les notions fondamentales ne semblent pas acquises.",
            "L'analyse est trop superficielle ou hors sujet par endroits.",
            "Il manque des éléments essentiels à la réflexion.",
            "La méthodologie n'est pas respectée."
        ],
        conclusion: [
            "Il est important que tu reviennes me voir pour en discuter.",
            "Je te conseille de revoir l'ensemble du cours sur ce chapitre.",
            "Avec un accompagnement ciblé, tu peux remonter la pente.",
            "Ne te décourage pas, mais il faut reprendre les bases."
        ]
    },
    poor: {
        intro: [
            "Ce travail nécessite une reprise complète.",
            "Le travail rendu ne correspond pas aux attentes.",
            "Des efforts importants restent à fournir.",
            "Ce travail reflète des difficultés majeures."
        ],
        body: [
            "Les concepts de base ne sont pas maîtrisés.",
            "Le sujet n'a pas été compris ou traité correctement.",
            "Il y a un décalage important entre le travail attendu et ce qui a été fourni.",
            "La méthodologie et les connaissances sont à revoir entièrement."
        ],
        conclusion: [
            "Un rendez-vous pour faire le point est nécessaire.",
            "Il faut reprendre le travail depuis le début avec de l'aide.",
            "Je reste disponible pour t'aider à comprendre ce qui n'a pas fonctionné.",
            "Ne reste pas seul(e) face à ces difficultés, viens me voir."
        ]
    }
}

// Criterion-specific feedback snippets
const CRITERION_FEEDBACK = {
    intro: {
        high: "L'introduction est efficace et pose bien le sujet.",
        medium: "L'introduction est présente mais pourrait être plus percutante.",
        low: "L'introduction est trop succincte ou absente."
    },
    fond: {
        high: "Le fond est riche et les arguments sont pertinents.",
        medium: "Le fond est correct mais manque parfois de profondeur.",
        low: "Le fond est insuffisant, les arguments manquent de substance."
    },
    forme: {
        high: "La forme est soignée et la rédaction fluide.",
        medium: "La forme est acceptable mais quelques maladresses persistent.",
        low: "La forme est à retravailler (syntaxe, clarté)."
    },
    argumentation: {
        high: "L'argumentation est construite et convaincante.",
        medium: "L'argumentation est présente mais pourrait être plus rigoureuse.",
        low: "L'argumentation est faible ou désorganisée."
    },
    conclusion: {
        high: "La conclusion synthétise bien le propos.",
        medium: "La conclusion existe mais reste basique.",
        low: "La conclusion est absente ou trop courte."
    },
    orthographe: {
        high: "L'orthographe est maîtrisée.",
        medium: "Quelques fautes d'orthographe à corriger.",
        low: "Trop de fautes d'orthographe, une relecture s'impose."
    },
    comprehension: {
        high: "La compréhension du sujet est excellente.",
        medium: "La compréhension est partielle.",
        low: "Le sujet n'a pas été bien compris."
    },
    methode: {
        high: "La méthode est rigoureuse et bien appliquée.",
        medium: "La méthode est suivie mais avec quelques erreurs.",
        low: "La méthode n'est pas maîtrisée."
    },
    resultat: {
        high: "Les résultats sont justes et bien présentés.",
        medium: "Les résultats sont partiellement corrects.",
        low: "Les résultats sont incorrects ou absents."
    },
    presentation: {
        high: "La présentation est claire et soignée.",
        medium: "La présentation est correcte.",
        low: "La présentation est à améliorer."
    },
    contenu: {
        high: "Le contenu est riche et maîtrisé.",
        medium: "Le contenu est correct mais perfectible.",
        low: "Le contenu est insuffisant."
    },
    expression: {
        high: "L'expression orale est fluide et claire.",
        medium: "L'expression orale est correcte mais perfectible.",
        low: "L'expression orale est à travailler."
    },
    posture: {
        high: "La posture et l'aisance sont remarquables.",
        medium: "La posture est correcte.",
        low: "Plus d'aisance serait bienvenue."
    },
    temps: {
        high: "Le temps a été parfaitement géré.",
        medium: "La gestion du temps est acceptable.",
        low: "La gestion du temps est à améliorer."
    }
}

/**
 * Get performance level based on score
 */
function getPerformanceLevel(score) {
    if (score >= 16) return 'excellent'
    if (score >= 12) return 'good'
    if (score >= 8) return 'average'
    if (score >= 4) return 'below'
    return 'poor'
}

/**
 * Get criterion level (high/medium/low) based on score
 */
function getCriterionLevel(score, maxGrade = 20) {
    const normalized = (score / maxGrade) * 20
    if (normalized >= 14) return 'high'
    if (normalized >= 8) return 'medium'
    return 'low'
}

/**
 * Pick a random element from an array
 */
function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)]
}

/**
 * Generate personalized feedback based on scores and voice note
 */
export function generateFeedback(criteria, scores, voiceNote, calculatedGrade, maxGrade) {
    // Normalize grade to 20-point scale for level calculation
    const normalizedGrade = (calculatedGrade / maxGrade) * 20
    const level = getPerformanceLevel(normalizedGrade)
    const templates = FEEDBACK_TEMPLATES[level]

    // Build intro
    let feedback = pickRandom(templates.intro) + ' '

    // Add criterion-specific feedback (pick top 2-3 notable ones)
    const criteriaFeedback = []
    criteria.forEach(criterion => {
        const score = scores[criterion.id] || 0
        const criterionMax = criterion.maxScore || maxGrade || 20
        const criterionLevel = getCriterionLevel(score, criterionMax)
        const criterionId = criterion.id.toLowerCase().replace(/[^a-z]/g, '')

        // Find matching criterion feedback
        for (const [key, feedbacks] of Object.entries(CRITERION_FEEDBACK)) {
            if (criterionId.includes(key) || criterion.name.toLowerCase().includes(key)) {
                criteriaFeedback.push({
                    score,
                    level: criterionLevel,
                    text: feedbacks[criterionLevel]
                })
                break
            }
        }
    })

    // Sort by importance (low scores first for improvement areas, then high for praise)
    const lowScores = criteriaFeedback.filter(c => c.level === 'low')
    const highScores = criteriaFeedback.filter(c => c.level === 'high')
    const mediumScores = criteriaFeedback.filter(c => c.level === 'medium')

    // Add body feedback
    feedback += pickRandom(templates.body) + ' '

    // Add specific criterion feedback
    if (highScores.length > 0) {
        feedback += highScores.slice(0, 2).map(c => c.text).join(' ') + ' '
    }
    if (mediumScores.length > 0 && highScores.length < 2) {
        feedback += mediumScores.slice(0, 1).map(c => c.text).join(' ') + ' '
    }
    if (lowScores.length > 0) {
        feedback += 'Points à améliorer : ' + lowScores.slice(0, 2).map(c => c.text.toLowerCase()).join(', ') + '. '
    }

    // Add voice note if present
    if (voiceNote && voiceNote.trim()) {
        feedback += '\n\nNote personnelle : ' + voiceNote.trim()
    }

    // Add conclusion
    feedback += '\n\n' + pickRandom(templates.conclusion)

    return feedback.trim()
}

/**
 * Check coherence between feedback sentiment and grade
 */
export function checkCoherence(scores, calculatedGrade, maxGrade) {
    const normalizedGrade = (calculatedGrade / maxGrade) * 20

    // Calculate average score
    const scoreValues = Object.values(scores)
    if (scoreValues.length === 0) return null

    // Normalize avgScore to a 20-point scale for comparison
    const rawAvg = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length
    const avgScore = (rawAvg / maxGrade) * 20

    // Check for significant discrepancy
    const scoreDiff = Math.abs(avgScore - normalizedGrade)

    if (scoreDiff > 4) {
        if (avgScore > normalizedGrade) {
            return "Les curseurs sont plutôt positifs mais la note calculée est basse. Vérifiez les pondérations."
        } else {
            return "Les curseurs sont plutôt bas mais la note calculée est élevée. Vérifiez les pondérations."
        }
    }

    // Check for extreme cases using normalized values
    const highScores = scoreValues.filter(s => (s / maxGrade) * 20 >= 16).length
    const lowScores = scoreValues.filter(s => (s / maxGrade) * 20 < 8).length

    if (highScores > scoreValues.length * 0.7 && normalizedGrade < 12) {
        return "La majorité des critères sont 'Excellent' mais la note reste modeste."
    }

    if (lowScores > scoreValues.length * 0.7 && normalizedGrade >= 14) {
        return "La majorité des critères sont faibles mais la note est élevée."
    }

    return null
}
