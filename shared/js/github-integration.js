/**
 * GitHub Integration Module
 * Automatischer Import von Code-Workflows aus GitHub-Repositories
 */

class GitHubIntegration {
    constructor() {
        this.apiBase = 'https://api.github.com';
        this.cache = new Map();
        this.cacheTimeout = 5 * 60 * 1000; // 5 Minuten
    }

    /**
     * Sucht nach populären Repositories mit GitHub Actions Workflows
     * @param {string} query - Suchbegriff
     * @param {number} limit - Anzahl der Ergebnisse
     */
    async searchWorkflowRepositories(query = 'github-actions', limit = 10) {
        try {
            const searchUrl = `${this.apiBase}/search/repositories?q=${encodeURIComponent(query)}+topic:github-actions&sort=stars&order=desc&per_page=${limit}`;
            
            const response = await fetch(searchUrl);
            if (!response.ok) {
                throw new Error(`GitHub API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.items.map(repo => ({
                id: repo.id,
                name: repo.name,
                fullName: repo.full_name,
                description: repo.description,
                stars: repo.stargazers_count,
                language: repo.language,
                topics: repo.topics || [],
                url: repo.html_url,
                workflowsUrl: `${this.apiBase}/repos/${repo.full_name}/contents/.github/workflows`
            }));
        } catch (error) {
            console.error('Error searching GitHub repositories:', error);
            return [];
        }
    }

    /**
     * Lädt Workflow-Dateien aus einem Repository
     * @param {string} repoFullName - Repository Name (owner/repo)
     */
    async getRepositoryWorkflows(repoFullName) {
        const cacheKey = `workflows_${repoFullName}`;
        
        // Cache-Check
        if (this.cache.has(cacheKey)) {
            const cached = this.cache.get(cacheKey);
            if (Date.now() - cached.timestamp < this.cacheTimeout) {
                return cached.data;
            }
        }

        try {
            const workflowsUrl = `${this.apiBase}/repos/${repoFullName}/contents/.github/workflows`;
            const response = await fetch(workflowsUrl);
            
            if (!response.ok) {
                if (response.status === 404) {
                    return []; // Keine Workflows gefunden
                }
                throw new Error(`GitHub API Error: ${response.status}`);
            }

            const files = await response.json();
            const workflows = [];

            // Laden der Workflow-Inhalte
            for (const file of files) {
                if (file.name.endsWith('.yml') || file.name.endsWith('.yaml')) {
                    try {
                        const contentResponse = await fetch(file.download_url);
                        const content = await contentResponse.text();
                        
                        workflows.push({
                            name: file.name.replace(/\.(yml|yaml)$/, ''),
                            filename: file.name,
                            content: content,
                            size: file.size,
                            downloadUrl: file.download_url,
                            htmlUrl: file.html_url,
                            type: this.detectWorkflowType(content),
                            triggers: this.extractWorkflowTriggers(content),
                            jobs: this.extractWorkflowJobs(content)
                        });
                    } catch (error) {
                        console.warn(`Failed to load workflow ${file.name}:`, error);
                    }
                }
            }

            // Cache speichern
            this.cache.set(cacheKey, {
                data: workflows,
                timestamp: Date.now()
            });

            return workflows;
        } catch (error) {
            console.error('Error loading repository workflows:', error);
            return [];
        }
    }

    /**
     * Analysiert den Workflow-Type basierend auf dem Inhalt
     * @param {string} content - YAML-Inhalt des Workflows
     */
    detectWorkflowType(content) {
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('deploy') || lowerContent.includes('deployment')) {
            return 'deployment';
        } else if (lowerContent.includes('test') || lowerContent.includes('ci')) {
            return 'testing';
        } else if (lowerContent.includes('build')) {
            return 'build';
        } else if (lowerContent.includes('release') || lowerContent.includes('publish')) {
            return 'release';
        } else if (lowerContent.includes('security') || lowerContent.includes('scan')) {
            return 'security';
        }
        
        return 'general';
    }

    /**
     * Extrahiert Trigger aus dem Workflow
     * @param {string} content - YAML-Inhalt des Workflows
     */
    extractWorkflowTriggers(content) {
        const triggers = [];
        const onMatch = content.match(/on:\s*([^]*?)(?=\n\w|\n#|\njobs:|$)/);
        
        if (onMatch) {
            const onSection = onMatch[1];
            if (onSection.includes('push')) triggers.push('push');
            if (onSection.includes('pull_request')) triggers.push('pull_request');
            if (onSection.includes('schedule')) triggers.push('schedule');
            if (onSection.includes('workflow_dispatch')) triggers.push('manual');
            if (onSection.includes('release')) triggers.push('release');
        }
        
        return triggers.length > 0 ? triggers : ['push'];
    }

    /**
     * Extrahiert Job-Informationen aus dem Workflow
     * @param {string} content - YAML-Inhalt des Workflows
     */
    extractWorkflowJobs(content) {
        const jobs = [];
        const jobsMatch = content.match(/jobs:\s*([^]*?)$/);
        
        if (jobsMatch) {
            const jobsSection = jobsMatch[1];
            const jobMatches = jobsSection.match(/^\s+(\w+):/gm);
            
            if (jobMatches) {
                jobMatches.forEach(match => {
                    const jobName = match.trim().replace(':', '');
                    jobs.push(jobName);
                });
            }
        }
        
        return jobs;
    }

    /**
     * Konvertiert einen GitHub-Workflow zu einem Stack-Format
     * @param {Object} workflow - Workflow-Objekt
     * @param {Object} repository - Repository-Objekt
     */
    workflowToStack(workflow, repository) {
        return {
            id: `github_${repository.id}_${workflow.filename}`,
            title: `${workflow.name} - ${repository.name}`,
            description: `GitHub Actions Workflow aus ${repository.fullName}${repository.description ? ': ' + repository.description : ''}`,
            category: 'development',
            type: workflow.type,
            source: 'github',
            creator: repository.fullName.split('/')[0],
            stats: {
                stars: repository.stars,
                language: repository.language,
                size: Math.round(workflow.size / 1024) + 'KB'
            },
            tags: [
                'github-actions',
                'workflow',
                workflow.type,
                ...(repository.topics || []),
                ...workflow.triggers
            ],
            content: {
                workflow: workflow.content,
                filename: workflow.filename,
                jobs: workflow.jobs,
                triggers: workflow.triggers
            },
            links: {
                source: workflow.htmlUrl,
                repository: repository.url,
                download: workflow.downloadUrl
            },
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
    }

    /**
     * Importiert Workflows aus populären Repositories
     * @param {Array} categories - Kategorien zum Durchsuchen
     */
    async importPopularWorkflows(categories = ['ci-cd', 'deployment', 'testing', 'docker', 'node.js', 'python']) {
        const allStacks = [];
        
        for (const category of categories) {
            try {
                console.log(`Importiere Workflows für Kategorie: ${category}`);
                
                const repositories = await this.searchWorkflowRepositories(category, 5);
                
                for (const repo of repositories) {
                    const workflows = await this.getRepositoryWorkflows(repo.fullName);
                    
                    for (const workflow of workflows) {
                        const stack = this.workflowToStack(workflow, repo);
                        allStacks.push(stack);
                    }
                    
                    // Rate Limiting beachten
                    await this.delay(100);
                }
                
                // Zwischen Kategorien warten
                await this.delay(500);
            } catch (error) {
                console.error(`Error importing workflows for category ${category}:`, error);
            }
        }
        
        return allStacks;
    }

    /**
     * Hilfsfunktion für Delays
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Bereinigt den Cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Gibt Cache-Statistiken zurück
     */
    getCacheStats() {
        return {
            entries: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }
}

// GitHub-Integration-Helper Funktionen
export const githubIntegration = new GitHubIntegration();

/**
 * GitHub Workflow Widget für das Dashboard
 */
export class GitHubWorkflowWidget {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.integration = githubIntegration;
        this.workflows = [];
        this.isLoading = false;
    }

    /**
     * Initialisiert das Widget
     */
    async init() {
        if (!this.container) {
            console.error('GitHub Workflow Widget container not found');
            return;
        }

        this.render();
        await this.loadWorkflows();
    }

    /**
     * Rendert das grundlegende Widget-HTML
     */
    render() {
        this.container.innerHTML = `
            <div class="github-integration-widget">
                <div class="section-header">
                    <h3 class="section-title">
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                        </svg>
                        GitHub Workflows
                    </h3>
                    <button class="btn btn-ghost btn-sm" id="refreshWorkflows">
                        <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        Aktualisieren
                    </button>
                </div>
                <div class="github-workflows-list" id="workflowsList">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <span>Lade GitHub Workflows...</span>
                    </div>
                </div>
            </div>
        `;

        // Event Listeners
        const refreshButton = this.container.querySelector('#refreshWorkflows');
        refreshButton.addEventListener('click', () => this.loadWorkflows(true));
    }

    /**
     * Lädt Workflows
     */
    async loadWorkflows(forceRefresh = false) {
        if (this.isLoading) return;
        
        this.isLoading = true;
        const workflowsList = this.container.querySelector('#workflowsList');
        
        try {
            if (forceRefresh) {
                this.integration.clearCache();
            }

            // Lade beliebte Workflows
            this.workflows = await this.integration.importPopularWorkflows(['ci-cd', 'deployment', 'docker']);
            
            this.renderWorkflows();
        } catch (error) {
            console.error('Error loading GitHub workflows:', error);
            workflowsList.innerHTML = `
                <div class="error-message">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Fehler beim Laden der GitHub Workflows
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Rendert die Workflows-Liste
     */
    renderWorkflows() {
        const workflowsList = this.container.querySelector('#workflowsList');
        
        if (this.workflows.length === 0) {
            workflowsList.innerHTML = `
                <div class="empty-state">
                    <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p>Keine Workflows gefunden</p>
                </div>
            `;
            return;
        }

        // Limitiere auf die ersten 5 Workflows für das Dashboard
        const displayWorkflows = this.workflows.slice(0, 5);
        
        workflowsList.innerHTML = displayWorkflows.map(workflow => `
            <div class="workflow-item" data-workflow-id="${workflow.id}">
                <div class="workflow-icon">
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                </div>
                <div class="workflow-info">
                    <h4 class="workflow-title">${workflow.title}</h4>
                    <p class="workflow-meta">
                        <span class="workflow-creator">von ${workflow.creator}</span>
                        <span class="workflow-type">${workflow.type}</span>
                    </p>
                    <div class="workflow-stats">
                        <span class="stat">
                            <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                            ${workflow.stats.stars}
                        </span>
                        <span class="stat">
                            <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                            ${workflow.stats.language || 'YAML'}
                        </span>
                    </div>
                </div>
                <div class="workflow-actions">
                    <button class="btn btn-ghost btn-xs" onclick="window.open('${workflow.links.source}', '_blank')">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </button>
                    <button class="btn btn-primary btn-xs" onclick="githubWorkflowWidget.importWorkflow('${workflow.id}')">
                        Import
                    </button>
                </div>
            </div>
        `).join('');

        // Global verfügbar machen für onclick Handler
        window.githubWorkflowWidget = this;
    }

    /**
     * Importiert einen Workflow als Stack
     */
    async importWorkflow(workflowId) {
        const workflow = this.workflows.find(w => w.id === workflowId);
        if (!workflow) {
            console.error('Workflow not found:', workflowId);
            return;
        }

        try {
            // Simuliere das Speichern in der lokalen Datenbank
            const existingStacks = JSON.parse(localStorage.getItem('importedStacks') || '[]');
            
            // Prüfe, ob bereits importiert
            const isAlreadyImported = existingStacks.some(s => s.id === workflow.id);
            if (isAlreadyImported) {
                alert('Dieser Workflow wurde bereits importiert!');
                return;
            }

            existingStacks.push(workflow);
            localStorage.setItem('importedStacks', JSON.stringify(existingStacks));

            // Zeige Erfolg
            this.showImportSuccess(workflow.title);
            
            console.log('Workflow imported successfully:', workflow);
        } catch (error) {
            console.error('Error importing workflow:', error);
            alert('Fehler beim Importieren des Workflows');
        }
    }

    /**
     * Zeigt eine Erfolgs-Nachricht
     */
    showImportSuccess(workflowTitle) {
        // Erstelle temporäre Erfolgs-Nachricht
        const successMessage = document.createElement('div');
        successMessage.className = 'import-success-toast';
        successMessage.innerHTML = `
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span>"${workflowTitle}" erfolgreich importiert!</span>
        `;
        
        document.body.appendChild(successMessage);
        
        // Animiere ein und aus
        setTimeout(() => successMessage.classList.add('show'), 100);
        setTimeout(() => {
            successMessage.classList.remove('show');
            setTimeout(() => document.body.removeChild(successMessage), 300);
        }, 3000);
    }
}

export default GitHubIntegration; 