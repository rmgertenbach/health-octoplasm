/**
 * Component Loader - Payerset Healthcare Transparency Platform
 * Dynamically loads shared header and footer components into pages
 * Created: November 21, 2024
 */

(function() {
    'use strict';

    const ComponentLoader = {
        /**
         * Configuration
         */
        config: {
            headerPath: '/shared/components/header.html',
            footerPath: '/shared/components/footer.html',
            headerTargetId: 'header-placeholder',
            footerTargetId: 'footer-placeholder',
            retryAttempts: 3,
            retryDelay: 1000
        },

        /**
         * Load header component into page
         * @param {string} targetElementId - ID of element to inject header into
         * @returns {Promise<void>}
         */
        async loadHeader(targetElementId) {
            const targetId = targetElementId || this.config.headerTargetId;
            const target = document.getElementById(targetId);

            if (!target) {
                console.warn(`[ComponentLoader] Header target element #${targetId} not found`);
                return;
            }

            // Show loading skeleton
            target.innerHTML = '<div class="loading-skeleton" style="height: 64px;"></div>';

            try {
                const html = await this.fetchComponent(this.config.headerPath);
                target.innerHTML = html;
                this.executeScripts(target);
                console.log('[ComponentLoader] Header loaded successfully');
            } catch (error) {
                console.error('[ComponentLoader] Failed to load header:', error);
                target.innerHTML = this.getErrorHTML('Failed to load navigation');
            }
        },

        /**
         * Load footer component into page
         * @param {string} targetElementId - ID of element to inject footer into
         * @returns {Promise<void>}
         */
        async loadFooter(targetElementId) {
            const targetId = targetElementId || this.config.footerTargetId;
            const target = document.getElementById(targetId);

            if (!target) {
                console.warn(`[ComponentLoader] Footer target element #${targetId} not found`);
                return;
            }

            // Show loading skeleton
            target.innerHTML = '<div class="loading-skeleton" style="height: 200px; margin-top: 4rem;"></div>';

            try {
                const html = await this.fetchComponent(this.config.footerPath);
                target.innerHTML = html;
                this.executeScripts(target);
                console.log('[ComponentLoader] Footer loaded successfully');
            } catch (error) {
                console.error('[ComponentLoader] Failed to load footer:', error);
                target.innerHTML = this.getErrorHTML('Failed to load footer');
            }
        },

        /**
         * Fetch component HTML with retry logic
         * @param {string} path - Path to component file
         * @param {number} attempt - Current attempt number
         * @returns {Promise<string>}
         */
        async fetchComponent(path, attempt = 1) {
            try {
                const response = await fetch(path);

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                return await response.text();
            } catch (error) {
                if (attempt < this.config.retryAttempts) {
                    console.warn(`[ComponentLoader] Retry ${attempt}/${this.config.retryAttempts} for ${path}`);
                    await this.delay(this.config.retryDelay);
                    return this.fetchComponent(path, attempt + 1);
                }
                throw error;
            }
        },

        /**
         * Execute inline scripts from loaded HTML
         * @param {HTMLElement} container - Container element with scripts
         */
        executeScripts(container) {
            const scripts = container.querySelectorAll('script');

            scripts.forEach(oldScript => {
                const newScript = document.createElement('script');

                // Copy attributes
                Array.from(oldScript.attributes).forEach(attr => {
                    newScript.setAttribute(attr.name, attr.value);
                });

                // Copy content
                newScript.textContent = oldScript.textContent;

                // Replace old script with new one to execute it
                oldScript.parentNode.replaceChild(newScript, oldScript);
            });
        },

        /**
         * Get error message HTML
         * @param {string} message - Error message to display
         * @returns {string}
         */
        getErrorHTML(message) {
            return `
                <div class="load-error" style="
                    padding: 1rem;
                    background: var(--danger-red, #EF4444);
                    color: white;
                    text-align: center;
                    border-radius: 8px;
                    font-weight: 600;
                ">
                    ${message}
                </div>
            `;
        },

        /**
         * Delay helper for retry logic
         * @param {number} ms - Milliseconds to delay
         * @returns {Promise<void>}
         */
        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        /**
         * Load all components (header and footer)
         * @returns {Promise<void>}
         */
        async loadAll() {
            const startTime = performance.now();

            try {
                // Load header and footer in parallel for better performance
                await Promise.all([
                    this.loadHeader(),
                    this.loadFooter()
                ]);

                const endTime = performance.now();
                console.log(`[ComponentLoader] All components loaded in ${Math.round(endTime - startTime)}ms`);
            } catch (error) {
                console.error('[ComponentLoader] Error loading components:', error);
            }
        },

        /**
         * Initialize component loader
         */
        init() {
            console.log('[ComponentLoader] Initializing...');
            this.loadAll();
        }
    };

    /**
     * Auto-initialize when DOM is ready
     */
    function autoInit() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => ComponentLoader.init());
        } else {
            // DOM is already ready
            ComponentLoader.init();
        }
    }

    // Export to window for manual use
    window.ComponentLoader = ComponentLoader;

    // Auto-initialize
    autoInit();

})();
