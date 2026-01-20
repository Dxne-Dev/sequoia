/**
 * Séquoia - Email Service (via EmailJS)
 * Using EmailJS allows sending emails directly from the browser
 * without CORS issues.
 */

const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

export const emailService = {
    sendOTP: async (email, firstName, code) => {
        try {
            const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service_id: SERVICE_ID,
                    template_id: TEMPLATE_ID,
                    user_id: PUBLIC_KEY,
                    template_params: {
                        email: email,
                        first_name: firstName,
                        otp_code: code,
                    },
                }),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Erreur lors de l\'envoi du mail.');
            }

            return true;
        } catch (error) {
            console.error('EmailJS Error:', error);
            throw error;
        }
    }
}
