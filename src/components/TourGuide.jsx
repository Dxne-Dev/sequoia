import React, { useEffect, useState, useRef } from 'react';
import { useOnboarding } from '../utils/OnboardingContext';
import { X, ChevronRight, ChevronLeft, Volume2 } from 'lucide-react';
import './TourGuide.css';

export default function TourGuide() {
    const { isActive, currentStep, steps, nextStep, prevStep, stopTour } = useOnboarding();
    const [spotlightStyle, setSpotlightStyle] = useState({});
    const [cardStyle, setCardStyle] = useState({});
    const step = steps[currentStep];
    const cardRef = useRef(null);

    useEffect(() => {
        if (!isActive) return;

        const updatePosition = () => {
            const element = document.querySelector(`[data-tour="${step.id}"]`);
            if (element) {
                const rect = element.getBoundingClientRect();
                const padding = 10;

                // Spotlight position
                setSpotlightStyle({
                    top: rect.top - padding,
                    left: rect.left - padding,
                    width: rect.width + padding * 2,
                    height: rect.height + padding * 2,
                    opacity: 1
                });

                // Card position logic
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                let top, left;

                if (step.position === 'bottom') {
                    top = rect.bottom + 20;
                    left = rect.left + rect.width / 2;
                } else if (step.position === 'top') {
                    top = rect.top - 200; // Estimated height
                    left = rect.left + rect.width / 2;
                } else if (step.position === 'right') {
                    top = rect.top;
                    left = rect.right + 20;
                } else {
                    top = rect.top;
                    left = rect.left - 300;
                }

                // Boundary checks
                if (left + 300 > screenWidth) left = screenWidth - 320;
                if (left < 20) left = 20;
                if (top + 150 > screenHeight) top = screenHeight - 170;
                if (top < 20) top = 20;

                setCardStyle({
                    top: `${top}px`,
                    left: `${left}px`,
                    opacity: 1,
                    transform: 'translateY(0)'
                });

                // Scroll element into view if needed
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                // If element is not found on this screen, hide spotlight but show card as modal
                setSpotlightStyle({ opacity: 0 });
                setCardStyle({
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    opacity: 1
                });
            }
        };

        // Delay slightly to allow for transitions
        const timer = setTimeout(updatePosition, 300);
        window.addEventListener('resize', updatePosition);

        return () => {
            clearTimeout(timer);
            window.removeEventListener('resize', updatePosition);
        };
    }, [isActive, currentStep, step]);

    if (!isActive) return null;

    return (
        <div className="tour-overlay">
            {/* Instruction Card */}
            <div className="tour-card animate-fade-in-scale" style={cardStyle} ref={cardRef}>
                <div className="tour-card-header">
                    <div className="tour-audio-indicator">
                        <Volume2 size={16} className="animate-pulse" />
                        <span>Guide Vocal</span>
                    </div>
                    <button className="tour-close" onClick={stopTour}>
                        <X size={18} />
                    </button>
                </div>

                <div className="tour-card-body">
                    <h3>{step.title}</h3>
                    <p>{step.content}</p>
                </div>

                <div className="tour-card-footer">
                    <div className="tour-progress">
                        {steps.map((_, i) => (
                            <div key={i} className={`progress-dot ${i === currentStep ? 'active' : ''}`}></div>
                        ))}
                    </div>
                    <div className="tour-nav">
                        {currentStep > 0 && (
                            <button className="btn-tour-prev" onClick={prevStep}>
                                <ChevronLeft size={18} />
                                <span>Précédent</span>
                            </button>
                        )}
                        <button className="btn-tour-next" onClick={nextStep}>
                            <span>{currentStep === steps.length - 1 ? 'Terminer' : 'Suivant'}</span>
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
