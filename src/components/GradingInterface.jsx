import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import {
    TreePine, FileText, ChevronLeft, ChevronRight, Sparkles,
    Mic, Square, AlertTriangle, Check, Minus, Plus, X, Loader2, Cpu,
    Volume2, MicOff
} from 'lucide-react'
import { generateFeedback, checkCoherence } from '../utils/feedbackGenerator'
import { generateAIFeedback, transcribeAudio, isGroqAvailable } from '../utils/groqService'
import './GradingInterface.css'

export default function GradingInterface({ session, students, onStudentUpdate, onFinish, onBack }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isRecording, setIsRecording] = useState(false)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [generatedFeedback, setGeneratedFeedback] = useState('')
    const [coherenceWarning, setCoherenceWarning] = useState(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [useAI, setUseAI] = useState(isGroqAvailable())
    const [aiError, setAiError] = useState(null)
    const [voiceError, setVoiceError] = useState(null)
    const [isTranscribing, setIsTranscribing] = useState(false)
    const [useWhisper, setUseWhisper] = useState(false) // Use Whisper API instead of Web Speech

    const mediaRecorderRef = useRef(null)
    const audioChunksRef = useRef([])
    const recognitionRef = useRef(null)

    const currentStudent = students[currentIndex]
    const completedCount = students.filter(s => s.isCompleted).length

    // Calculate grade based on weighted criteria scores
    const calculateGrade = useCallback((scores) => {
        if (!session || !session.criteria) return 0

        const totalWeight = session.criteria.reduce((sum, c) => sum + c.weight, 0)
        if (totalWeight === 0) return 0

        let weightedSum = 0
        session.criteria.forEach(criterion => {
            const score = scores[criterion.id] || 0
            const normalized = (score / 20) * criterion.weight
            weightedSum += normalized
        })

        const grade = (weightedSum / totalWeight) * session.maxGrade
        return Math.round(grade * 10) / 10
    }, [session])

    // Current student's calculated grade
    const calculatedGrade = useMemo(() => {
        return calculateGrade(currentStudent?.scores || {})
    }, [currentStudent?.scores, calculateGrade])

    // Update student score for a criterion
    const handleScoreChange = useCallback((criterionId, value) => {
        const newScores = { ...currentStudent.scores, [criterionId]: parseInt(value) }
        onStudentUpdate(currentStudent.id, { scores: newScores })
    }, [currentStudent, onStudentUpdate])

    // Handle voice note update
    const handleVoiceNoteChange = useCallback((note) => {
        onStudentUpdate(currentStudent.id, { voiceNote: note })
    }, [currentStudent.id, onStudentUpdate])

    // Check if Web Speech API is available
    const isWebSpeechAvailable = () => {
        return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window
    }

    // Start recording with Whisper API (MediaRecorder)
    const startWhisperRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
            })

            audioChunksRef.current = []

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data)
                }
            }

            mediaRecorder.onstop = async () => {
                stream.getTracks().forEach(track => track.stop())

                if (audioChunksRef.current.length > 0) {
                    setIsTranscribing(true)
                    try {
                        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
                        const transcript = await transcribeAudio(audioBlob)

                        if (transcript) {
                            const newNote = currentStudent.voiceNote
                                ? currentStudent.voiceNote + ' ' + transcript
                                : transcript
                            handleVoiceNoteChange(newNote)
                        }
                        setVoiceError(null)
                    } catch (error) {
                        console.error('Transcription error:', error)
                        setVoiceError('Erreur de transcription: ' + error.message)
                    } finally {
                        setIsTranscribing(false)
                    }
                }
            }

            mediaRecorderRef.current = mediaRecorder
            mediaRecorder.start()
            setIsRecording(true)
            setVoiceError(null)
        } catch (error) {
            console.error('Error accessing microphone:', error)
            if (error.name === 'NotAllowedError') {
                setVoiceError('Accès au microphone refusé. Veuillez autoriser l\'accès dans les paramètres du navigateur.')
            } else {
                setVoiceError('Erreur d\'accès au microphone: ' + error.message)
            }
        }
    }

    // Stop Whisper recording
    const stopWhisperRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop()
        }
        setIsRecording(false)
    }

    // Start recording with Web Speech API
    const startWebSpeechRecording = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

        if (!SpeechRecognition) {
            setVoiceError('Votre navigateur ne supporte pas la reconnaissance vocale. Utilisez Chrome ou Edge.')
            return
        }

        try {
            const recognition = new SpeechRecognition()
            recognition.lang = 'fr-FR'
            recognition.continuous = true
            recognition.interimResults = true

            recognition.onstart = () => {
                setIsRecording(true)
                setVoiceError(null)
            }

            recognition.onresult = (event) => {
                let interimTranscript = ''
                let finalTranscript = ''

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript + ' '
                    } else {
                        interimTranscript += transcript
                    }
                }

                if (finalTranscript) {
                    const newNote = currentStudent.voiceNote
                        ? currentStudent.voiceNote + ' ' + finalTranscript.trim()
                        : finalTranscript.trim()
                    handleVoiceNoteChange(newNote)
                }
            }

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error)
                setIsRecording(false)

                switch (event.error) {
                    case 'not-allowed':
                        setVoiceError('Accès au microphone refusé. Cliquez sur l\'icône cadenas dans la barre d\'adresse pour autoriser.')
                        break
                    case 'no-speech':
                        setVoiceError('Aucune parole détectée. Parlez plus fort ou rapprochez-vous du micro.')
                        break
                    case 'network':
                        setVoiceError('Erreur réseau. Vérifiez votre connexion internet.')
                        break
                    case 'audio-capture':
                        setVoiceError('Microphone non détecté. Vérifiez qu\'un micro est branché.')
                        break
                    default:
                        setVoiceError('Erreur de reconnaissance vocale: ' + event.error)
                }
            }

            recognition.onend = () => {
                setIsRecording(false)
            }

            recognitionRef.current = recognition
            recognition.start()
        } catch (error) {
            console.error('Error starting speech recognition:', error)
            setVoiceError('Impossible de démarrer la reconnaissance vocale: ' + error.message)
        }
    }

    // Stop Web Speech recording
    const stopWebSpeechRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
        }
        setIsRecording(false)
    }

    // Toggle voice recording
    const toggleRecording = useCallback(() => {
        if (isRecording) {
            // Stop recording
            if (useWhisper) {
                stopWhisperRecording()
            } else {
                stopWebSpeechRecording()
            }
        } else {
            // Start recording
            if (useWhisper && isGroqAvailable()) {
                startWhisperRecording()
            } else if (isWebSpeechAvailable()) {
                startWebSpeechRecording()
            } else {
                setVoiceError('Aucune méthode de reconnaissance vocale disponible.')
            }
        }
    }, [isRecording, useWhisper, currentStudent.voiceNote, handleVoiceNoteChange])

    // Generate feedback (AI or template-based)
    const handleGenerateFeedback = useCallback(async () => {
        setIsGenerating(true)
        setAiError(null)

        try {
            let feedback

            if (useAI && isGroqAvailable()) {
                // Use Groq AI
                feedback = await generateAIFeedback(
                    session.criteria,
                    currentStudent.scores,
                    currentStudent.voiceNote,
                    calculatedGrade,
                    session.maxGrade
                )
            } else {
                // Fallback to template-based generation
                feedback = generateFeedback(
                    session.criteria,
                    currentStudent.scores,
                    currentStudent.voiceNote,
                    calculatedGrade,
                    session.maxGrade
                )
            }

            setGeneratedFeedback(feedback)
            setShowFeedbackModal(true)

            // Check coherence
            const warning = checkCoherence(currentStudent.scores, calculatedGrade, session.maxGrade)
            setCoherenceWarning(warning)
        } catch (error) {
            console.error('Feedback generation error:', error)
            setAiError(error.message)

            // Fallback to template if AI fails
            const fallbackFeedback = generateFeedback(
                session.criteria,
                currentStudent.scores,
                currentStudent.voiceNote,
                calculatedGrade,
                session.maxGrade
            )
            setGeneratedFeedback(fallbackFeedback)
            setShowFeedbackModal(true)
        } finally {
            setIsGenerating(false)
        }
    }, [useAI, session, currentStudent, calculatedGrade])

    // Apply feedback and mark as completed
    const handleApplyFeedback = useCallback((customGrade = null) => {
        onStudentUpdate(currentStudent.id, {
            feedback: generatedFeedback,
            finalGrade: customGrade !== null ? customGrade : calculatedGrade,
            isCompleted: true
        })
        setShowFeedbackModal(false)
        setCoherenceWarning(null)
        setAiError(null)

        // Auto-navigate to next student
        if (currentIndex < students.length - 1) {
            setTimeout(() => setCurrentIndex(currentIndex + 1), 300)
        }
    }, [currentStudent.id, generatedFeedback, calculatedGrade, currentIndex, students.length, onStudentUpdate])

    // Navigation
    const goToPrevious = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }, [currentIndex])

    const goToNext = useCallback(() => {
        if (currentIndex < students.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }, [currentIndex, students.length])

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (showFeedbackModal) return

            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                goToPrevious()
            } else if (e.key === 'ArrowRight' && currentIndex < students.length - 1) {
                goToNext()
            } else if (e.key === 'Enter' && e.ctrlKey) {
                handleGenerateFeedback()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentIndex, students.length, showFeedbackModal, goToPrevious, goToNext, handleGenerateFeedback])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop()
            }
        }
    }, [])

    // Get score level for visual feedback
    const getScoreLevel = (score) => {
        if (score >= 16) return 'excellent'
        if (score >= 12) return 'good'
        if (score >= 8) return 'average'
        if (score >= 4) return 'below'
        return 'poor'
    }

    return (
        <div className="grading-interface">
            {/* Top Bar */}
            <header className="top-bar">
                <div className="logo">
                    <TreePine size={24} className="logo-icon" />
                    <span>Séquoia</span>
                </div>

                <div className="progress-container">
                    <span className="progress-text">{completedCount} / {students.length} copies</span>
                    <div className="progress-bar">
                        <div
                            className="progress-fill"
                            style={{ width: `${(completedCount / students.length) * 100}%` }}
                        ></div>
                    </div>
                </div>

                <div className="top-bar-actions">
                    {/* AI Toggle */}
                    <button
                        className={`btn btn-sm ${useAI ? 'btn-ai-active' : 'btn-ghost'}`}
                        onClick={() => setUseAI(!useAI)}
                        disabled={!isGroqAvailable()}
                        title={isGroqAvailable() ? 'Activer/désactiver l\'IA Groq' : 'Clé API non configurée'}
                    >
                        <Cpu size={16} />
                        <span>IA {useAI ? 'ON' : 'OFF'}</span>
                    </button>

                    {completedCount === students.length && (
                        <button className="btn btn-primary" onClick={onFinish}>
                            <FileText size={18} />
                            <span>Voir les résultats</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <main className="grading-main">
                {/* Student Navigation Sidebar */}
                <aside className="student-sidebar">
                    <h3 className="sidebar-title">Copies</h3>
                    <div className="student-list">
                        {students.map((student, index) => (
                            <button
                                key={student.id}
                                className={`student-item ${index === currentIndex ? 'active' : ''} ${student.isCompleted ? 'completed' : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <span className="student-number">{index + 1}</span>
                                <span className="student-name">{student.name}</span>
                                {student.isCompleted && (
                                    <span className="student-grade">{student.finalGrade}/{session.maxGrade}</span>
                                )}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Grading Panel */}
                <section className="grading-panel animate-slide-in-right" key={currentStudent.id}>
                    <div className="grading-header">
                        <div className="student-info">
                            <h2>Copie n°{currentIndex + 1}</h2>
                            <input
                                type="text"
                                className="input student-name-input"
                                placeholder="Nom de l'élève (optionnel)"
                                value={currentStudent.name.startsWith('Élève') ? '' : currentStudent.name}
                                onChange={(e) => onStudentUpdate(currentStudent.id, {
                                    name: e.target.value || `Élève ${currentStudent.id}`
                                })}
                            />
                        </div>
                        <div className="calculated-grade">
                            <span className="grade-label">Note calculée</span>
                            <span className="grade-value">{calculatedGrade}</span>
                            <span className="grade-max">/ {session.maxGrade}</span>
                        </div>
                    </div>

                    {/* Criteria Sliders */}
                    <div className="criteria-sliders">
                        {session.criteria.map(criterion => (
                            <div key={criterion.id} className="slider-container criterion-slider">
                                <div className="slider-header">
                                    <span className="slider-label">{criterion.name}</span>
                                    <span className={`slider-value score-${getScoreLevel(currentStudent.scores[criterion.id] || 0)}`}>
                                        {currentStudent.scores[criterion.id] || 0}/20
                                    </span>
                                </div>
                                <div className="slider-track-container">
                                    <input
                                        type="range"
                                        className="slider"
                                        min="0"
                                        max="20"
                                        step="1"
                                        value={currentStudent.scores[criterion.id] || 0}
                                        onChange={(e) => handleScoreChange(criterion.id, e.target.value)}
                                    />
                                    <div
                                        className={`slider-fill score-${getScoreLevel(currentStudent.scores[criterion.id] || 0)}`}
                                        style={{ width: `${((currentStudent.scores[criterion.id] || 0) / 20) * 100}%` }}
                                    ></div>
                                </div>
                                <div className="slider-labels">
                                    <span>Insuffisant</span>
                                    <span>Moyen</span>
                                    <span>Bien</span>
                                    <span>Excellent</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Voice Note */}
                    <div className="voice-note-section">
                        <div className="voice-note-header">
                            <div className="voice-note-title">
                                <h3>Note vocale personnalisée</h3>
                                {isGroqAvailable() && (
                                    <button
                                        className={`btn btn-sm ${useWhisper ? 'btn-whisper-active' : 'btn-ghost'}`}
                                        onClick={() => setUseWhisper(!useWhisper)}
                                        title={useWhisper ? 'Mode Whisper (plus précis)' : 'Mode navigateur (instantané)'}
                                    >
                                        {useWhisper ? 'Whisper' : 'Natif'}
                                    </button>
                                )}
                            </div>
                            <button
                                className={`btn ${isRecording ? 'btn-recording' : 'btn-secondary'} ${isTranscribing ? 'btn-transcribing' : ''}`}
                                onClick={toggleRecording}
                                disabled={isTranscribing}
                                data-tour="voice_grading"
                            >
                                {isTranscribing ? (
                                    <>
                                        <Loader2 size={16} className="spinning" />
                                        <span>Transcription...</span>
                                    </>
                                ) : isRecording ? (
                                    <>
                                        <Square size={16} />
                                        <span>Arrêter</span>
                                    </>
                                ) : (
                                    <>
                                        <Mic size={16} />
                                        <span>Dicter</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {voiceError && (
                            <div className="voice-error">
                                <MicOff size={16} />
                                <span>{voiceError}</span>
                            </div>
                        )}

                        <textarea
                            className="input voice-note-input"
                            placeholder="Ajoutez une remarque spécifique pour cet élève... (ex: 'N'oublie pas de citer le texte')"
                            value={currentStudent.voiceNote}
                            onChange={(e) => handleVoiceNoteChange(e.target.value)}
                        />

                        {isRecording && (
                            <div className="recording-indicator">
                                <div className="sound-wave">
                                    <span className="wave-bar"></span>
                                    <span className="wave-bar"></span>
                                    <span className="wave-bar"></span>
                                    <span className="wave-bar"></span>
                                    <span className="wave-bar"></span>
                                </div>
                                <span>Écoute en cours... Parlez maintenant</span>
                            </div>
                        )}
                    </div>

                    {/* Generate Button */}
                    <div className="grading-actions">
                        <button
                            className="btn btn-primary btn-lg generate-btn"
                            onClick={handleGenerateFeedback}
                            disabled={isGenerating}
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 size={20} className="spinning" />
                                    <span>Génération en cours...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles size={20} />
                                    <span>Générer le feedback {useAI ? '(IA)' : ''}</span>
                                </>
                            )}
                        </button>
                    </div>
                </section>
            </main>

            {/* Navigation Footer */}
            <footer className="grading-footer">
                <button
                    className="btn btn-secondary"
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                >
                    <ChevronLeft size={18} />
                    <span>Précédent</span>
                </button>

                <div className="keyboard-hints">
                    <span className="keyboard-hint">
                        <span className="kbd">←</span> / <span className="kbd">→</span> Navigation
                    </span>
                    <span className="keyboard-hint">
                        <span className="kbd">Ctrl</span>+<span className="kbd">↵</span> Générer
                    </span>
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={goToNext}
                    disabled={currentIndex === students.length - 1}
                >
                    <span>Suivant</span>
                    <ChevronRight size={18} />
                </button>
            </footer>

            {/* Feedback Modal */}
            {showFeedbackModal && (
                <div className="modal-overlay" onClick={() => setShowFeedbackModal(false)}>
                    <div className="modal feedback-modal animate-fade-in-scale" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-title">
                                <Sparkles size={20} />
                                <h3>Feedback généré {useAI && !aiError ? '(IA)' : ''}</h3>
                            </div>
                            <button className="btn btn-ghost btn-icon" onClick={() => setShowFeedbackModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        {aiError && (
                            <div className="ai-error-warning">
                                <AlertTriangle size={18} />
                                <span>Erreur IA : {aiError}. Feedback généré avec les templates.</span>
                            </div>
                        )}

                        {coherenceWarning && (
                            <div className="coherence-warning">
                                <AlertTriangle size={18} />
                                <span>{coherenceWarning}</span>
                            </div>
                        )}

                        <div className="modal-content">
                            <div className="feedback-preview">
                                <textarea
                                    className="input feedback-textarea"
                                    value={generatedFeedback}
                                    onChange={(e) => setGeneratedFeedback(e.target.value)}
                                />
                            </div>

                            <div className="grade-adjustment">
                                <span className="grade-adjustment-label">Note finale :</span>
                                <div className="grade-input-group">
                                    <button
                                        className="btn btn-icon"
                                        onClick={() => handleApplyFeedback(Math.max(0, calculatedGrade - 0.5))}
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="final-grade">{calculatedGrade} / {session.maxGrade}</span>
                                    <button
                                        className="btn btn-icon"
                                        onClick={() => handleApplyFeedback(Math.min(session.maxGrade, calculatedGrade + 0.5))}
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowFeedbackModal(false)}>
                                Modifier
                            </button>
                            <button className="btn btn-primary btn-lg" onClick={() => handleApplyFeedback()}>
                                <Check size={18} />
                                <span>Valider</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
