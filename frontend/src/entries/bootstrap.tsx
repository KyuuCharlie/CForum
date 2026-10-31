import '@/styles/globals.css';
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import { createRoot } from 'react-dom/client';
import * as React from 'react';
import { initTheme } from '@/lib/theme';

const LIQUID_GLASS_CSS = 'https://cdn.jsdelivr.net/gh/KyuuCharlie/liquid-glass-ui@9cc4efd239fd7a3e30e3800f4ae758baf835be44/styles/liquid-glass.css';
const HALLOWEEN_CSS = 'https://cdn.jsdelivr.net/gh/KyuuCharlie/liquid-glass-ui@main/styles/halloween.css';

function loadStylesheet(href: string, marker: string) {
	if (document.querySelector(`link[data-${marker}]`)) return;
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = href;
	link.dataset[marker] = 'true';
	document.head.appendChild(link);
}

function enableGlassPointerHighlight() {
	if (document.documentElement.dataset.lgPointerReady === 'true') return;
	document.documentElement.dataset.lgPointerReady = 'true';
	document.addEventListener('pointermove', (event) => {
		const target = event.target instanceof Element ? event.target.closest<HTMLElement>('.lg-glass') : null;
		if (!target) return;
		const rect = target.getBoundingClientRect();
		target.style.setProperty('--lg-pointer-x', `${((event.clientX - rect.left) / rect.width) * 100}%`);
		target.style.setProperty('--lg-pointer-y', `${((event.clientY - rect.top) / rect.height) * 100}%`);
	}, { passive: true });
}

export function mount(nodeId: string, element: React.ReactNode) {
	initTheme();
	loadStylesheet(LIQUID_GLASS_CSS, 'lgLiquidGlass');
	loadStylesheet(HALLOWEEN_CSS, 'lgHalloween');
	document.body.classList.add('lg-halloween');
	enableGlassPointerHighlight();

	const el = document.getElementById(nodeId);
	if (!el) throw new Error(`Missing root element #${nodeId}`);
	createRoot(el).render(
		<React.StrictMode>
			{element}
		</React.StrictMode>
	);
}
