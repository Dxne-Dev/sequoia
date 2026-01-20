/**
 * Séquoia - Groq AI Service
 * Ultra-fast AI feedback generation and voice transcription using Groq Cloud
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const GROQ_AUDIO_URL = 'https://api.groq.com/openai/v1/audio/transcriptions'
const GROQ_MODEL = 'llama-3.3-70b-versatile'
const WHISPER_MODEL = 'whisper-large-v3-turbo'

/**
 * Common French grammar corrections (liaison errors with feminine words starting with vowels)
 */
const FRENCH_GRAMMAR_FIXES = [
    // Introduction (féminin commençant par voyelle)
    { wrong: /\bta introduction\b/gi, correct: "ton introduction" },
    { wrong: /\bma introduction\b/gi, correct: "mon introduction" },
    { wrong: /\bsa introduction\b/gi, correct: "son introduction" },
    // Argumentation
    { wrong: /\bta argumentation\b/gi, correct: "ton argumentation" },
    { wrong: /\bma argumentation\b/gi, correct: "mon argumentation" },
    { wrong: /\bsa argumentation\b/gi, correct: "son argumentation" },
    // Analyse
    { wrong: /\bta analyse\b/gi, correct: "ton analyse" },
    { wrong: /\bma analyse\b/gi, correct: "mon analyse" },
    { wrong: /\bsa analyse\b/gi, correct: "son analyse" },
    // Évaluation
    { wrong: /\bta évaluation\b/gi, correct: "ton évaluation" },
    { wrong: /\bma évaluation\b/gi, correct: "mon évaluation" },
    { wrong: /\bsa évaluation\b/gi, correct: "son évaluation" },
    // Orthographe
    { wrong: /\bta orthographe\b/gi, correct: "ton orthographe" },
    { wrong: /\bma orthographe\b/gi, correct: "mon orthographe" },
    { wrong: /\bsa orthographe\b/gi, correct: "son orthographe" },
    // Expression
    { wrong: /\bta expression\b/gi, correct: "ton expression" },
    { wrong: /\bma expression\b/gi, correct: "mon expression" },
    { wrong: /\bsa expression\b/gi, correct: "son expression" },
    // Attention
    { wrong: /\bta attention\b/gi, correct: "ton attention" },
    // Idée
    { wrong: /\bta idée\b/gi, correct: "ton idée" },
    { wrong: /\bma idée\b/gi, correct: "mon idée" },
    { wrong: /\bsa idée\b/gi, correct: "son idée" },
    // Explication
    { wrong: /\bta explication\b/gi, correct: "ton explication" },
    // Organisation
    { wrong: /\bta organisation\b/gi, correct: "ton organisation" },
    // Amélioration
    { wrong: /\bta amélioration\b/gi, correct: "ton amélioration" },
    // Application
    { wrong: /\bta application\b/gi, correct: "ton application" },
    // Approche 
    { wrong: /\bta approche\b/gi, correct: "ton approche" },
    // Erreur
    { wrong: /\bta erreur\b/gi, correct: "ton erreur" },
    // Aisance
    { wrong: /\bta aisance\b/gi, correct: "ton aisance" },
]

/**
 * Clean French text by fixing common grammar errors
 */
function cleanFrenchGrammar(text) {
    let cleaned = text

    for (const fix of FRENCH_GRAMMAR_FIXES) {
        cleaned = cleaned.replace(fix.wrong, fix.correct)
    }

    return cleaned
}

/**
 * Generate a pedagogical feedback using Groq AI
 */
export async function generateAIFeedback(criteria, scores, voiceNote, calculatedGrade, maxGrade) {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY

    if (!apiKey) {
        throw new Error('Clé API Groq non configurée')
    }

    // Build context about the evaluation
    const criteriaDetails = criteria.map(c => {
        const score = scores[c.id] || 0
        let level = 'insuffisant'
        if (score >= 16) level = 'excellent'
        else if (score >= 12) level = 'bien'
        else if (score >= 8) level = 'moyen'

        return `- ${c.name}: ${score}/20 (${level}, poids: ${c.weight})`
    }).join('\n')

    const normalizedGrade = (calculatedGrade / maxGrade) * 20
    let globalLevel = 'en grande difficulté'
    if (normalizedGrade >= 16) globalLevel = 'excellent'
    else if (normalizedGrade >= 12) globalLevel = 'satisfaisant'
    else if (normalizedGrade >= 8) globalLevel = 'moyen'
    else if (normalizedGrade >= 4) globalLevel = 'insuffisant'

    const systemPrompt = `Tu es un assistant pédagogique expert. Ta mission est de rédiger des appréciations de copies pour des élèves, en te basant sur des critères d'évaluation précis.

STRUCTURE OBLIGATOIRE DE LA RÉPONSE (Sandwich Pédagogique) :
1. Une phrase d'accroche sur le niveau global ou un point fort majeur.
2. Une analyse des points à améliorer (sans lister toutes les notes).
3. Une conclusion encourageante avec un conseil pratique pour progresser.

RÈGLES DE STYLE :
- Ton : Bienveillant, constructif, professionnel mais accessible.
- Adresse-toi directement à l'élève ("Tu").
- Ne répète PAS robotiquement les notes de chaque critère (ex: "Tu as eu 12 en grammaire, 14 en syntaxe..."). Synthétise plutôt : "Ta maîtrise de la langue est solide".
- Sois concis : 60 à 100 mots maximum.
- Termine TOUJOURS ta dernière phrase. Ne t'arrête jamais au milieu d'une idée.

RÈGLES DE GRAMMAIRE (CRITIQUE) :
- Devant un mot féminin commençant par une voyelle ou un h muet, utilise TON, MON, SON (jamais ta, ma, sa).
  Exemples : "ton introduction", "ton analyse", "ton argumentation", "ton orthographe".
- Accords parfaits exigés.`

    const userPrompt = `Génère une appréciation concise pour cette copie.

CONTEXTE :
- Note finale : ${calculatedGrade}/${maxGrade} (Niveau : ${globalLevel})
- Détails des critères :
${criteriaDetails}

${voiceNote ? `CONSIGNE SPÉCIFIQUE DU PROFESSEUR (à intégrer absolument) : "${voiceNote}"` : ''}

Tâche : Rédige un paragraphe fluide (pas de liste à puces) qui synthétise ces résultats. Sois encourageant mais exigeant sur les points faibles.`

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.3,
                max_tokens: 500, // Augmenté pour éviter les coupures
                top_p: 0.9
            })
        })

        if (!response.ok) {
            const error = await response.json()
            console.error('Groq API Error:', error)
            throw new Error(error.error?.message || 'Erreur API Groq')
        }

        const data = await response.json()
        let feedback = data.choices[0]?.message?.content?.trim()

        if (!feedback) {
            throw new Error('Réponse vide de l\'API')
        }

        // Post-processing: Clean French grammar errors
        feedback = cleanFrenchGrammar(feedback)

        return feedback
    } catch (error) {
        console.error('Error calling Groq API:', error)
        throw error
    }
}

/**
 * Transcribe audio using Groq Whisper API
 * @param {Blob} audioBlob - The audio blob to transcribe
 * @returns {Promise<string>} - The transcribed text
 */
export async function transcribeAudio(audioBlob) {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY

    if (!apiKey) {
        throw new Error('Clé API Groq non configurée')
    }

    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('model', WHISPER_MODEL)
    formData.append('language', 'fr')
    formData.append('response_format', 'json')

    try {
        const response = await fetch(GROQ_AUDIO_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            },
            body: formData
        })

        if (!response.ok) {
            const error = await response.json()
            console.error('Groq Whisper Error:', error)
            throw new Error(error.error?.message || 'Erreur de transcription')
        }

        const data = await response.json()
        return data.text?.trim() || ''
    } catch (error) {
        console.error('Error transcribing audio:', error)
        throw error
    }
}

/**
 * Check if Groq API is available
 */
export function isGroqAvailable() {
    return !!import.meta.env.VITE_GROQ_API_KEY
}
