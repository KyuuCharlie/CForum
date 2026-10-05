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
        throw new Error('BASE_URL environment variable is required for Cloudflare Email Service');
    }

    let hostname: string;
    try {
        hostname = new URL(baseUrl).hostname;
    } catch {
        throw new Error('BASE_URL is invalid');
    }

    if (!hostname || hostname.endsWith('.workers.dev') || hostname.endsWith('.pages.dev')) {
        throw new Error('BASE_URL must be your custom domain before Cloudflare Email Service can send verification emails');
    }

    return {
        email: `noreply@${hostname}`,
        name: DEFAULT_FROM_NAME,
    };
}

/**
 * Send a transactional email through Cloudflare Email Service.
 *
 * The Worker must have a send_email binding named EMAIL in wrangler.jsonc,
 * and the BASE_URL must point to the custom domain onboarded for Email Sending.
 */
export async function sendEmail(to: string, subject: string, htmlContent: string, env?: any) {
    console.log(`[Email] Sending via Cloudflare Email Service to ${to} - Subject: ${subject}`);

    if (!env?.EMAIL || typeof env.EMAIL.send !== 'function') {
        throw new Error('Cloudflare Email Service EMAIL binding is not configured');
    }

    const from = getEmailSender(env);
    const text = htmlToText(htmlContent);

    try {
        const response = await env.EMAIL.send({
            to,
            from,
            subject,
            html: htmlContent,
            text,
        });

        console.log(`[Email] ✓ Cloudflare Email Service accepted message ${response.messageId || 'without message id'}`);
    } catch (error: any) {
        console.error('[Email] Cloudflare Email Service failed:', error);
        throw new Error(`Cloudflare Email Service 发送失败：${error?.message || 'unknown error'}`);
    }
}
