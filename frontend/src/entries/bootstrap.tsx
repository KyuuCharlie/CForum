import '@/styles/globals.css';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { createRoot } from 'react-dom/client';
import * as React from 'react';
import { initTheme } from '@/lib/theme';

export function mount(nodeId: string, element: React.ReactNode) {
	initTheme();

	// Seasonal Liquid Glass UI stylesheet; hosted independently by jsDelivr.
	if (!document.querySelector('link[data-lg-halloween]')) {
		const halloweenStyles = document.createElement('link');
		halloweenStyles.rel = 'stylesheet';
		halloweenStyles.href = 'https://cdn.jsdelivr.net/gh/KyuuCharlie/liquid-glass-ui@main/styles/halloween.css';
		halloweenStyles.dataset.lgHalloween = 'true';
		document.head.appendChild(halloweenStyles);
	}
	document.body.classList.add('lg-halloween');
	const el = document.getElementById(nodeId);
	if (!el) throw new Error(`Missing root element #${nodeId}`);
	createRoot(el).render(
		<React.StrictMode>
			{element}
		</React.StrictMode>
	);
}
