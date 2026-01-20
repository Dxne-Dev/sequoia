/**
 * Séquoia - Email Service (via Resend)
 * Note: For production, this should be called from a backend/serverless function
 * to keep the API Key secret.
 */

const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;

export const emailService = {
    sendOTP: async (email, firstName, code) => {
        try {
            const response = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${RESEND_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    from: 'Séquoia <onboarding@resend.dev>', // Use your verified domain in production
                    to: [email],
                    subject: `${code} est votre code de vérification Séquoia`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                            <h2 style="color: #1a1a1a;">Bienvenue sur Séquoia, ${firstName} !</h2>
                            <p style="color: #4a5568; line-height: 1.6;">
                                Merci de nous avoir rejoint. Pour finaliser votre inscription et commencer à corriger plus efficacement, 
                                veuillez utiliser le code de vérification suivant :
                            </p>
                            <div style="background: #f7fafc; padding: 24px; border-radius: 8px; text-align: center; margin: 30px 0;">
                                <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #2d3748;">${code}</span>
                            </div>
                            <p style="color: #718096; font-size: 14px;">
                                Ce code expirera dans 10 minutes. Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.
                            </p>
                            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
                            <p style="text-align: center; color: #a0aec0; font-size: 12px;">
                                Séquoia - L'IA au service des enseignants
                            </p>
                        </div>
                    `,
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de l\'envoi du mail.');
            }

            return true;
        } catch (error) {
            console.error('Email Error:', error);
            throw error;
        }
    }
}
