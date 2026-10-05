const DEFAULT_FROM_NAME = '论坛管理员';

function htmlToText(html: string): string {
    return html
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<br\s*\/?\s*>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

function getEmailSender(env: any): { email: string; name: string } {
    const baseUrl = env?.BASE_URL;
    if (!baseUrl) {
        throw new Error('BASE_URL environment variable is required for Brevo email sending');
    }

    let hostname: string;
    try {
        hostname = new URL(baseUrl).hostname;
    } catch {
        throw new Error('BASE_URL is invalid');
    }

    if (!hostname || hostname.endsWith('.workers.dev') || hostname.endsWith('.pages.dev')) {
        throw new Error('BASE_URL must use your custom domain for Brevo email sending');
    }

    return {
        email: env?.BREVO_SENDER_EMAIL || `noreply@${hostname}`,
        name: env?.BREVO_SENDER_NAME || DEFAULT_FROM_NAME,
    };
}

/**
 * Send a transactional email through Brevo's REST API.
 *
 * Required Worker secret:
 *   BREVO_API_KEY
 *
 * Optional Worker secrets:
 *   BREVO_SENDER_EMAIL
 *   BREVO_SENDER_NAME
 *
 * The sender must be verified in Brevo.
 */
export async function sendEmail(to: string, subject: string, htmlContent: string, env?: any) {
    console.log(`[Email] Sending via Brevo to ${to} - Subject: ${subject}`);

    const apiKey = env?.BREVO_API_KEY;
    if (!apiKey) {
        throw new Error('BREVO_API_KEY secret is not configured');
    }

    const sender = getEmailSender(env);
    const text = htmlToText(htmlContent);

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'api-key': apiKey,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                sender,
                to: [{ email: to }],
                subject,
                htmlContent,
                textContent: text,
            }),
        });

        const bodyText = await response.text();
        let body: any = null;
        try {
            body = bodyText ? JSON.parse(bodyText) : null;
        } catch {
            body = bodyText;
        }

        if (!response.ok) {
            console.error('[Email] Brevo API failed:', response.status, body);
            const message = typeof body === 'object' && body?.message
                ? body.message
                : bodyText || `HTTP ${response.status}`;
            throw new Error(`Brevo 发送失败：${message}`);
        }

        console.log(`[Email] ✓ Brevo accepted message ${body?.messageId || 'without message id'}`);
    } catch (error: any) {
        console.error('[Email] Brevo request failed:', error);
        if (error?.message?.startsWith('Brevo 发送失败：')) {
            throw error;
        }
        throw new Error(`Brevo 发送失败：${error?.message || 'network error'}`);
    }
}
