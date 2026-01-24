import { useState, useMemo } from 'react'
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
    TreePine, ArrowLeft, BarChart3, TrendingUp, TrendingDown,
    Download, Tags, Table, Users, AlertTriangle, Plus, LogOut, CheckCircle2, Archive
} from 'lucide-react'
import './ResultsScreen.css'

export default function ResultsScreen({ session, students, onNewSession, onBackToGrading, onLogout, onArchiveSession }) {
    const [exportType, setExportType] = useState(null)
    const [isExporting, setIsExporting] = useState(false)
    const [showArchiveDialog, setShowArchiveDialog] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState(null)

    // Handle "New Session" click
    const handleNewSessionClick = () => {
        // If already completed, just go
        if (session.status === 'completed') {
            onNewSession()
        } else {
            // Ask user to archive
            setShowArchiveDialog(true)
        }
    }

    const handleConfirmArchive = async (shouldArchive) => {
        setIsExporting(true) // Reuse loading state
        if (shouldArchive) {
            await onArchiveSession(session.id)
        }
        setShowArchiveDialog(false)
        setIsExporting(false)
        onNewSession()
    }

    // Calculate statistics
    const stats = useMemo(() => {
        const grades = students.filter(s => s.isCompleted).map(s => s.finalGrade)
        if (grades.length === 0) return null

        const sum = grades.reduce((a, b) => a + b, 0)
        const average = sum / grades.length
        const sorted = [...grades].sort((a, b) => a - b)
        const median = sorted.length % 2 === 0
            ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
            : sorted[Math.floor(sorted.length / 2)]
        const min = Math.min(...grades)
        const max = Math.max(...grades)

        // Grade distribution
        const distribution = {
            excellent: grades.filter(g => (g / session.maxGrade) * 20 >= 16).length,
            good: grades.filter(g => (g / session.maxGrade) * 20 >= 12 && (g / session.maxGrade) * 20 < 16).length,
            average: grades.filter(g => (g / session.maxGrade) * 20 >= 8 && (g / session.maxGrade) * 20 < 12).length,
            below: grades.filter(g => (g / session.maxGrade) * 20 < 8).length
        }

        return {
            count: grades.length,
            average: Math.round(average * 10) / 10,
            median: Math.round(median * 10) / 10,
            min: Math.round(min * 10) / 10,
            max: Math.round(max * 10) / 10,
            distribution
        }
    }, [students, session.maxGrade])

    // Export PDF with feedback labels (Premium Design & Dynamic Text)
    const exportFeedbackLabels = async () => {
        setIsExporting(true)
        setExportType('labels')

        try {
            const doc = new jsPDF('p', 'mm', 'a4')
            const pageWidth = doc.internal.pageSize.getWidth()
            const pageHeight = doc.internal.pageSize.getHeight()
            const margin = 10
            const labelWidth = (pageWidth - margin * 3) / 2
            const labelHeight = 70 // Slightly taller for better layout

            // Colors
            const colorPrimary = [16, 185, 129] // Emerald 500
            const colorText = [31, 41, 55] // Gray 800
            const colorMuted = [107, 114, 128] // Gray 500

            let x = margin
            let y = margin
            let labelCount = 0

            // --- Title Page with Branding ---
            // Background Header
            doc.setFillColor(...colorPrimary)
            doc.rect(0, 0, pageWidth, 60, 'F')

            // Logo Text
            doc.setFont('helvetica', 'bold')
            doc.setFontSize(28)
            doc.setTextColor(255, 255, 255)
            doc.text('Séquoia', pageWidth / 2, 25, { align: 'center' })

            // Subtitle
            doc.setFontSize(14)
            doc.setFont('helvetica', 'normal')
            doc.text('Assistant de Correction Pédagogique', pageWidth / 2, 35, { align: 'center' })

            // Session Info Box
            doc.setFillColor(255, 255, 255)
            doc.roundedRect(pageWidth / 4, 50, pageWidth / 2, 40, 3, 3, 'F')
            doc.setDrawColor(200, 200, 200)
            doc.rect(pageWidth / 4, 50, pageWidth / 2, 40, 'S') // Border

            doc.setTextColor(...colorText)
            doc.setFontSize(16)
            doc.setFont('helvetica', 'bold')
            doc.text(session.name || 'Session de correction', pageWidth / 2, 65, { align: 'center' })

            doc.setFontSize(12)
            doc.setTextColor(...colorMuted)
            doc.setFont('helvetica', 'normal')
            doc.text(new Date().toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }), pageWidth / 2, 75, { align: 'center' })

            // Footer Branding
            doc.setFontSize(10)
            doc.setTextColor(150, 150, 150)
            doc.text('Généré avec Séquoia - sequoia.app', pageWidth / 2, pageHeight - 15, { align: 'center' })

            doc.addPage()

            // --- Labels Generation ---
            const completedStudents = students.filter(s => s.isCompleted)

            for (const student of completedStudents) {
                // Page Management
                if (labelCount > 0 && labelCount % 2 === 0) {
                    y += labelHeight + margin
                    x = margin
                }

                if (y + labelHeight > pageHeight - margin) {
                    doc.addPage()
                    y = margin
                    x = margin
                    labelCount = 0
                }

                // 1. Label Container (Border)
                doc.setDrawColor(229, 231, 235) // Gray 200
                doc.setLineWidth(0.5)
                doc.roundedRect(x, y, labelWidth, labelHeight, 2, 2, 'S')

                // 2. Header Strip (Emerald)
                doc.setFillColor(...colorPrimary)
                doc.rect(x + 0.5, y + 0.5, labelWidth - 1, 14, 'F')

                // 3. Student Name (White on Green)
                doc.setFontSize(11)
                doc.setTextColor(255, 255, 255)
                doc.setFont('helvetica', 'bold')
                doc.text(student.name, x + 5, y + 9)

                // 4. Grade Badge (White pill on right)
                doc.setFillColor(255, 255, 255)
                doc.roundedRect(x + labelWidth - 25, y + 3, 22, 8, 2, 2, 'F')
                doc.setTextColor(...colorPrimary)
                doc.setFontSize(10)
                doc.setFont('helvetica', 'bold')
                doc.text(`${student.finalGrade}/${session.maxGrade}`, x + labelWidth - 14, y + 8, { align: 'center' })

                // 5. Feedback Body
                // Add "Appréciation" title
                doc.setTextColor(...colorMuted)
                doc.setFontSize(7)
                doc.setFont('helvetica', 'bold')
                doc.text('APPRÉCIATION', x + 5, y + 22)

                // Feedback Text - Dynamic Adjustment
                const feedbackText = student.feedback ? student.feedback.replace(/\n/g, ' ').substring(0, 1000) : ''

                // Calculate optimal font size to fit text
                let fontSize = 9
                let maxLines = 10

                // Scaling logic: Shrink font and allow more lines as text gets longer
                if (feedbackText.length > 350) {
                    fontSize = 8
                    maxLines = 13
                }
                if (feedbackText.length > 500) {
                    fontSize = 7
                    maxLines = 15
                }
                // Last resort for huge texts
                if (feedbackText.length > 700) {
                    fontSize = 6.5
                    maxLines = 17
                }

                doc.setTextColor(...colorText)
                doc.setFontSize(fontSize)
                doc.setFont('helvetica', 'normal')

                const feedbackLines = doc.splitTextToSize(feedbackText, labelWidth - 10)

                // Draw text
                doc.text(feedbackLines.slice(0, maxLines), x + 5, y + 28)

                // Visual indicator if truncated (should barely happen now)
                if (feedbackLines.length > maxLines) {
                    doc.text("...", x + labelWidth - 8, y + labelHeight - 5)
                }

                // 6. Mini Branding (Bottom Right)
                doc.setTextColor(200, 200, 200)
                doc.setFontSize(6)
                doc.setFont('helvetica', 'italic')
                doc.text('Séquoia', x + labelWidth - 5, y + labelHeight - 4, { align: 'right' })

                x += labelWidth + margin
                labelCount++
            }

            doc.save(`sequoia_feedbacks_${Date.now()}.pdf`)
        } catch (error) {
            console.error('Export error:', error)
            alert('Erreur lors de l\'export PDF: ' + error.message)
        }

        setIsExporting(false)
        setExportType(null)
    }

    // Export summary table
    const exportSummaryTable = async () => {
        setIsExporting(true)
        setExportType('table')

        try {
            const doc = new jsPDF('l', 'mm', 'a4') // Landscape
            const pageWidth = doc.internal.pageSize.getWidth()

            // Title
            doc.setFontSize(20)
            doc.setTextColor(16, 185, 129)
            doc.text('Sequoia - Recapitulatif des Notes', pageWidth / 2, 20, { align: 'center' })

            doc.setFontSize(12)
            doc.setTextColor(100, 100, 100)
            doc.text(session.name || 'Session de correction', pageWidth / 2, 28, { align: 'center' })

            // Prepare table data
            const headers = ['#', 'Nom', ...session.criteria.map(c => c.name), 'Note Finale']
            const tableData = students.filter(s => s.isCompleted).map((student, index) => [
                String(index + 1),
                student.name,
                ...session.criteria.map(c => `${student.scores[c.id] || 0}/20`),
                `${student.finalGrade}/${session.maxGrade}`
            ])

            // Generate table using autoTable function directly
            autoTable(doc, {
                head: [headers],
                body: tableData,
                startY: 35,
                theme: 'grid',
                headStyles: {
                    fillColor: [16, 185, 129],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    halign: 'center'
                },
                bodyStyles: {
                    halign: 'center'
                },
                alternateRowStyles: {
                    fillColor: [240, 253, 244]
                },
                columnStyles: {
                    0: { cellWidth: 10 },
                    1: { cellWidth: 40, halign: 'left' }
                }
            })

            // Add statistics
            const finalY = (doc.lastAutoTable?.finalY || 100) + 15

            doc.setFontSize(14)
            doc.setTextColor(30, 30, 30)
            doc.text('Statistiques de la classe', 14, finalY)

            doc.setFontSize(11)
            doc.setTextColor(80, 80, 80)
            if (stats) {
                doc.text(`Moyenne : ${stats.average}/${session.maxGrade}`, 14, finalY + 8)
                doc.text(`Mediane : ${stats.median}/${session.maxGrade}`, 14, finalY + 14)
                doc.text(`Note min : ${stats.min}/${session.maxGrade}`, 80, finalY + 8)
                doc.text(`Note max : ${stats.max}/${session.maxGrade}`, 80, finalY + 14)
                doc.text(`Copies corrigees : ${stats.count}/${students.length}`, 150, finalY + 8)
            }

            doc.save(`sequoia_notes_${Date.now()}.pdf`)
        } catch (error) {
            console.error('Export error:', error)
            alert('Erreur lors de l\'export PDF: ' + error.message)
        }

        setIsExporting(false)
        setExportType(null)
    }

    // Get grade color based on value
    const getGradeColor = (grade) => {
        const normalized = (grade / session.maxGrade) * 20
        if (normalized >= 16) return 'excellent'
        if (normalized >= 12) return 'good'
        if (normalized >= 8) return 'average'
        return 'below'
    }

    const completedCount = students.filter(s => s.isCompleted).length
    const pendingCount = students.length - completedCount

    return (
        <div className="results-screen">
            {/* Header */}
            <header className="top-bar">
                <div className="logo">
                    <TreePine size={24} className="logo-icon" />
                    <span>Séquoia</span>
                </div>
                <div className="session-info">
                    <span className="session-name">{session.name || 'Session de correction'}</span>
                    <span className="badge badge-success">{completedCount} copies terminées</span>
                </div>
                <div className="top-bar-actions">
                    <button className="btn btn-ghost" onClick={onBackToGrading}>
                        <ArrowLeft size={18} />
                        <span>Retour</span>
                    </button>
                    <button className="btn btn-ghost" onClick={onLogout} style={{ marginLeft: '1rem', borderLeft: '1px solid var(--surface-border)', paddingLeft: '1rem' }}>
                        <LogOut size={18} />
                        <span style={{ marginLeft: '0.5rem' }}>Déconnexion</span>
                    </button>
                </div>
            </header>

            <main className="results-main">
                {/* Statistics Panel */}
                {stats && (
                    <section className="stats-section animate-fade-in-up" data-tour="results_summary">
                        <div className="section-header">
                            <BarChart3 size={22} />
                            <h2>Statistiques de la session</h2>
                        </div>
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon-wrapper">
                                    <TrendingUp size={22} />
                                </div>
                                <div className="stat-content">
                                    <span className="stat-value">{stats.average}</span>
                                    <span className="stat-label">Moyenne / {session.maxGrade}</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon-wrapper">
                                    <BarChart3 size={22} />
                                </div>
                                <div className="stat-content">
                                    <span className="stat-value">{stats.median}</span>
                                    <span className="stat-label">Médiane / {session.maxGrade}</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon-wrapper down">
                                    <TrendingDown size={22} />
                                </div>
                                <div className="stat-content">
                                    <span className="stat-value">{stats.min}</span>
                                    <span className="stat-label">Note min / {session.maxGrade}</span>
                                </div>
                            </div>
                            <div className="stat-card">
                                <div className="stat-icon-wrapper up">
                                    <TrendingUp size={22} />
                                </div>
                                <div className="stat-content">
                                    <span className="stat-value">{stats.max}</span>
                                    <span className="stat-label">Note max / {session.maxGrade}</span>
                                </div>
                            </div>
                        </div>

                        {/* Distribution Bar */}
                        <div className="distribution-section">
                            <h3>Répartition des notes</h3>
                            <div className="distribution-bar">
                                {stats.distribution.excellent > 0 && (
                                    <div
                                        className="distribution-segment excellent"
                                        style={{ flex: stats.distribution.excellent }}
                                        title={`Excellent: ${stats.distribution.excellent}`}
                                    >
                                        {stats.distribution.excellent}
                                    </div>
                                )}
                                {stats.distribution.good > 0 && (
                                    <div
                                        className="distribution-segment good"
                                        style={{ flex: stats.distribution.good }}
                                        title={`Bien: ${stats.distribution.good}`}
                                    >
                                        {stats.distribution.good}
                                    </div>
                                )}
                                {stats.distribution.average > 0 && (
                                    <div
                                        className="distribution-segment average"
                                        style={{ flex: stats.distribution.average }}
                                        title={`Moyen: ${stats.distribution.average}`}
                                    >
                                        {stats.distribution.average}
                                    </div>
                                )}
                                {stats.distribution.below > 0 && (
                                    <div
                                        className="distribution-segment below"
                                        style={{ flex: stats.distribution.below }}
                                        title={`Insuffisant: ${stats.distribution.below}`}
                                    >
                                        {stats.distribution.below}
                                    </div>
                                )}
                            </div>
                            <div className="distribution-legend">
                                <span className="legend-item"><span className="legend-color excellent"></span> Excellent (≥16)</span>
                                <span className="legend-item"><span className="legend-color good"></span> Bien (12-15)</span>
                                <span className="legend-item"><span className="legend-color average"></span> Moyen (8-11)</span>
                                <span className="legend-item"><span className="legend-color below"></span> Insuffisant (&lt;8)</span>
                            </div>
                        </div>
                    </section>
                )}

                {/* Export Section */}
                <section className="export-section animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="section-header">
                        <Download size={22} />
                        <h2>Exporter les résultats</h2>
                    </div>
                    <div className="export-cards">
                        <div className="export-card">
                            <div className="export-icon-wrapper">
                                <Tags size={32} />
                            </div>
                            <h3>Vignettes de Feedback</h3>
                            <p>PDF imprimable avec les feedbacks à découper et coller sur les copies</p>
                            <button
                                className="btn btn-primary"
                                onClick={exportFeedbackLabels}
                                disabled={isExporting || completedCount === 0}
                            >
                                <Download size={16} />
                                <span>{isExporting && exportType === 'labels' ? 'Export...' : 'Télécharger'}</span>
                            </button>
                        </div>
                        <div className="export-card">
                            <div className="export-icon-wrapper">
                                <Table size={32} />
                            </div>
                            <h3>Tableau Récapitulatif</h3>
                            <p>PDF avec le tableau des notes pour transfert vers Pronote/ENT</p>
                            <button
                                className="btn btn-primary"
                                onClick={exportSummaryTable}
                                disabled={isExporting || completedCount === 0}
                            >
                                <Download size={16} />
                                <span>{isExporting && exportType === 'table' ? 'Export...' : 'Télécharger'}</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Students List */}
                <section className="students-results-section animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="section-header">
                        <Users size={22} />
                        <h2>Détail par élève</h2>
                    </div>

                    {pendingCount > 0 && (
                        <div className="pending-warning">
                            <AlertTriangle size={18} />
                            <span>{pendingCount} copie{pendingCount > 1 ? 's' : ''} non corrigée{pendingCount > 1 ? 's' : ''}</span>
                            <button className="btn btn-secondary btn-sm" onClick={onBackToGrading}>
                                Continuer la correction
                            </button>
                        </div>
                    )}

                    <div className="students-results-grid">
                        {students.map((student, index) => (
                            <div
                                key={student.id}
                                className={`student-result-card ${student.isCompleted ? 'completed' : 'pending'}`}
                                onClick={() => student.isCompleted && setSelectedStudent(student)}
                            >
                                <div className="student-result-header">
                                    <div className="student-identity">
                                        <span className="student-result-number">{index + 1}</span>
                                        <span className="student-result-name">{student.name}</span>
                                    </div>

                                    {student.isCompleted ? (
                                        <span className={`student-result-grade grade-${getGradeColor(student.finalGrade)}`}>
                                            {student.finalGrade}/{session.maxGrade}
                                        </span>
                                    ) : (
                                        <span className="badge">En attente</span>
                                    )}
                                </div>

                                {student.isCompleted && (
                                    <div className="student-card-actions">
                                        <span className="view-feedback-link">
                                            Voir l'appréciation
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="results-footer">
                <button className="btn btn-secondary" onClick={onBackToGrading}>
                    <ArrowLeft size={18} />
                    <span>Modifier les corrections</span>
                </button>
                <button className="btn btn-primary btn-lg" onClick={handleNewSessionClick}>
                    <Plus size={18} />
                    <span>Nouvelle session</span>
                </button>
            </footer>

            {/* Feedback Detail Modal */}
            {selectedStudent && (
                <div className="dialog-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="dialog-card feedback-modal animate-fade-in-up" onClick={e => e.stopPropagation()}>
                        <div className="dialog-header feedback-header">
                            <div className="feedback-student-info">
                                <h3>{selectedStudent.name}</h3>
                                <span className={`student-result-grade grade-${getGradeColor(selectedStudent.finalGrade)}`}>
                                    {selectedStudent.finalGrade}/{session.maxGrade}
                                </span>
                            </div>
                            <button className="btn-close" onClick={() => setSelectedStudent(null)}>×</button>
                        </div>

                        <div className="feedback-content-scroll">
                            <h4>Appréciation générée</h4>
                            <div className="feedback-text-full">
                                {selectedStudent.feedback || "Aucun feedback généré."}
                            </div>

                            {/* Display criteria details if needed */}
                            <div className="feedback-criteria-summary">
                                <h4>Détail des notes</h4>
                                <div className="criteria-grid-mini">
                                    {session.criteria.map(c => (
                                        <div key={c.id} className="criterion-mini">
                                            <span className="c-name">{c.name}</span>
                                            <span className="c-score">{selectedStudent.scores ? (selectedStudent.scores[c.id] || 0) : 0}/{20}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="dialog-actions">
                            <button className="btn btn-primary" onClick={() => setSelectedStudent(null)}>
                                Fermer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Archive Confirmation Dialog */}
            {showArchiveDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-card animate-fade-in-up">
                        <div className="dialog-header">
                            <Archive size={24} className="text-primary" />
                            <h3>Session terminée ?</h3>
                        </div>
                        <p className="dialog-message">
                            Vous êtes sur le point de quitter cette session. Souhaitez-vous la marquer comme <strong>terminée et archivée</strong> ?
                        </p>
                        <p className="dialog-submessage">
                            Une session archivée est stockée dans vos "Terminées". Sinon, elle restera dans vos sessions "En cours".
                        </p>
                        <div className="dialog-actions">
                            <button
                                className="btn btn-secondary"
                                onClick={() => handleConfirmArchive(false)}
                            >
                                Garder en brouillon
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => handleConfirmArchive(true)}
                            >
                                <CheckCircle2 size={16} />
                                <span>Oui, archiver</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
