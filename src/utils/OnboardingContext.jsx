import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
    const context = useContext(OnboardingContext);
    if (!context) {
        throw new Error('useOnboarding must be used within an OnboardingProvider');
    }
    return context;
};

export const OnboardingProvider = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [hasSeenTutorial, setHasSeenTutorial] = useState(() => {
        return localStorage.getItem('sequoia_onboarding_complete') === 'true';
    });

    const steps = [
        {
            id: 'welcome_cta',
            title: 'Bienvenue sur Séquoia',
            content: "Votre nouveau compagnon de correction. Cliquez ici pour commencer un nouveau paquet de copies.",
            vocal: "Bienvenue sur Séquoia, votre nouveau compagnon de correction. Je vais vous guider rapidement. Pour commencer, cliquez sur ce bouton pour lancer un nouveau paquet de copies.",
            position: 'bottom',
            screen: 'welcome'
        },
        {
            id: 'setup_config',
            title: 'Configurez votre Séance',
            content: "Définissez le barème et le nombre de copies. Séquoia s'adapte à votre classe.",
            vocal: "Ici, configurez les bases de votre évaluation. Séquoia s'adapte totalement à votre fonctionnement.",
            position: 'right',
            screen: 'setup'
        },
        {
            id: 'setup_presets',
            title: 'Types d\'évaluations',
            content: "Choisissez parmi nos modèles (Dissertation, Oral, Exercice) ou créez le vôtre.",
            vocal: "Gagnez du temps en choisissant un type d'évaluation prédéfini, ou personnalisez tout de A à Z.",
            position: 'top',
            screen: 'setup'
        },
        {
            id: 'voice_grading',
            title: 'La Correction Vocale',
            content: "C'est ici que la magie opère. Cliquez sur le micro pour dicter vos remarques. Séquoia s'occupe du reste.",
            vocal: "C'est ici que la magie opère. Plus besoin de tout écrire à la main, cliquez sur le micro pour dicter vos remarques. Séquoia transcrit tout et calcule même une suggestion de note.",
            position: 'top',
            screen: 'grading'
        },
        {
            id: 'results_summary',
            title: 'Vos Résultats',
            content: "Retrouvez la synthèse de votre classe et exportez vos notes proprement.",
            vocal: "Bravo ! Vous avez terminé. Retrouvez ici la synthèse de votre classe et exportez vos notes en un clic. Vous avez libéré votre soirée !",
            position: 'bottom',
            screen: 'results'
        }
    ];

    const [currentScreen, setCurrentScreen] = useState('welcome');

    const speak = useCallback((text) => {
        // Cancel existing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'fr-FR';
        utterance.rate = 1;
        utterance.pitch = 1.1; // Slightly higher pitch for a friendly "assistant" feel
        window.speechSynthesis.speak(utterance);
    }, []);

    // Sync current step when screen changes
    useEffect(() => {
        if (!isActive) return;

        const stepForScreen = steps.findIndex(s => s.screen === currentScreen);
        if (stepForScreen !== -1 && steps[currentStep].screen !== currentScreen) {
            setCurrentStep(stepForScreen);
            // Delay slightly to ensure screen transition completed before speaking
            const timer = setTimeout(() => {
                speak(steps[stepForScreen].vocal);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [currentScreen, isActive, steps, currentStep, speak]);

    const startTour = useCallback(() => {
        setIsActive(true);
        // Find first step for current screen
        const firstStepIdx = steps.findIndex(s => s.screen === currentScreen);
        const idx = firstStepIdx !== -1 ? firstStepIdx : 0;
        setCurrentStep(idx);
        speak(steps[idx].vocal);
    }, [speak, steps, currentScreen]);

    const stopTour = useCallback(() => {
        setIsActive(false);
        window.speechSynthesis.cancel();
    }, []);

    const completeTour = useCallback(() => {
        setIsActive(false);
        setHasSeenTutorial(true);
        localStorage.setItem('sequoia_onboarding_complete', 'true');
        window.speechSynthesis.cancel();
    }, []);

    const nextStep = useCallback(() => {
        if (currentStep < steps.length - 1) {
            const nextIdx = currentStep + 1;
            // If the next step is on a different screen, we don't force jump 
            // because the user needs to perform an action to get there.
            // But we can check if it's the same screen.
            if (steps[nextIdx].screen === currentScreen) {
                setCurrentStep(nextIdx);
                speak(steps[nextIdx].vocal);
            }
        } else {
            completeTour();
        }
    }, [currentStep, steps, speak, completeTour, currentScreen]);

    const prevStep = useCallback(() => {
        if (currentStep > 0) {
            const prevIdx = currentStep - 1;
            if (steps[prevIdx].screen === currentScreen) {
                setCurrentStep(prevIdx);
                speak(steps[prevIdx].vocal);
            }
        }
    }, [currentStep, steps, speak, currentScreen]);

    return (
        <OnboardingContext.Provider value={{
            isActive,
            currentStep,
            steps,
            hasSeenTutorial,
            currentScreen,
            setCurrentScreen,
            startTour,
            stopTour,
            nextStep,
            prevStep,
            completeTour
        }}>
            {children}
        </OnboardingContext.Provider>
    );
};
