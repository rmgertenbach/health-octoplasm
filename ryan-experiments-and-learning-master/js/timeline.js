// Healthcare Transparency Timeline Presentation
// React-based scroll presentation

const { useState, useEffect, useRef } = React;

//================================================
// Glossary Term Component & Processing
//================================================

// GlossaryTerm: Subtle hover tooltip for glossary terms
const GlossaryTerm = ({ term, definition, children }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef(null);

    return (
        <span
            className="glossary-term"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{ position: 'relative' }}
        >
            {children}
            {showTooltip && (
                <span className="glossary-tooltip" ref={tooltipRef}>
                    <strong>{term}</strong>
                    <p>{definition}</p>
                </span>
            )}
        </span>
    );
};

// Process text to wrap glossary terms
const processGlossaryTerms = (text) => {
    if (!text || typeof text !== 'string' || typeof glossaryTerms === 'undefined') {
        return text;
    }

    // Sort terms by length (longest first) to match longer phrases before shorter ones
    const terms = Object.keys(glossaryTerms).sort((a, b) => b.length - a.length);

    const parts = [];
    let remainingText = text;
    let lastIndex = 0;
    const matches = [];

    // Find all term matches
    terms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        let match;

        while ((match = regex.exec(text)) !== null) {
            matches.push({
                term: term,
                originalText: match[0],
                index: match.index,
                length: match[0].length
            });
        }
    });

    // Sort matches by position
    matches.sort((a, b) => a.index - b.index);

    // Remove overlapping matches (keep first match)
    const filteredMatches = [];
    let lastEnd = -1;

    matches.forEach(match => {
        if (match.index >= lastEnd) {
            filteredMatches.push(match);
            lastEnd = match.index + match.length;
        }
    });

    // Build result with React elements
    if (filteredMatches.length === 0) {
        return text;
    }

    filteredMatches.forEach((match, idx) => {
        // Add text before match
        if (match.index > lastIndex) {
            parts.push(text.substring(lastIndex, match.index));
        }

        // Add glossary term with tooltip
        parts.push(
            <GlossaryTerm
                key={`term-${idx}`}
                term={match.term}
                definition={glossaryTerms[match.term]}
            >
                {match.originalText}
            </GlossaryTerm>
        );

        lastIndex = match.index + match.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
        parts.push(text.substring(lastIndex));
    }

    return parts;
};

//================================================
// Timeline Data Structure
//================================================
const timelineData = {
    slides: [
        {
            id: 'intro',
            type: 'title',
            year: null,
            era: null,
            title: 'The Evolution of Healthcare Transparency',
            subtitle: 'From Opacity to Accountability (1974-2025)',
            body: '50 years of regulatory groundwork, followed by a revolutionary breakthrough that changed everything.'
        },
        {
            id: 'summary',
            type: 'insight',
            era: 'summary',
            title: 'The Key Insight',
            subtitle: 'Transparency wasn\'t a steady evolution—it was decades of foundation-laying followed by a sudden breakthrough.',
            body: 'When political will, technology, employer frustration, and regulatory capacity aligned simultaneously, the entire healthcare system transformed in just 3 years (2019-2022).'
        },
        {
            id: 'erisa-1974',
            type: 'event',
            year: '1974',
            era: 'foundation',
            eraName: 'Foundation Era',
            title: 'ERISA: The Original Fiduciary Standard',
            subtitle: 'Congress established that employers must act in employees\' best interest—but gave them no way to do it.',
            points: [
                'Employer benefit plans subject to fiduciary duty',
                'Self-insured employers gained flexibility',
                'Set standard enforced 47 years later with CAA',
                'The Gap: Fiduciary duty existed, but no mechanism to fulfill it'
            ]
        },
        {
            id: 'hipaa-1996',
            type: 'event',
            year: '1996',
            era: 'foundation',
            eraName: 'Foundation Era',
            title: 'HIPAA: Privacy Protection (That Got Weaponized)',
            subtitle: 'Legitimate patient privacy became an excuse for hiding prices from employers.',
            quote: '"We can\'t show you that—HIPAA!" became the standard deflection for 25 years.',
            body: 'HIPAA never prohibited employers from seeing de-identified pricing information. But the industry weaponized it to maintain opacity. Transparency and privacy are compatible—but they pretended they weren\'t.'
        },
        {
            id: 'opacity-era',
            type: 'comparison',
            year: '2000s',
            era: 'foundation',
            eraName: 'Foundation Era',
            title: 'The Opacity Era Peaks',
            subtitle: 'Healthcare reached maximum complexity and minimum transparency.',
            before: {
                label: 'Market Characteristics',
                items: [
                    'Negotiated rates = "trade secrets"',
                    'Spread pricing invisible and unchecked',
                    '"Trust us" consulting standard',
                    'Hospital chargemaster 3-5x actual payments'
                ]
            },
            after: {
                label: 'Why Nothing Changed',
                items: [
                    'No legal requirement to disclose',
                    'No employer sophistication',
                    'Profitable status quo for intermediaries',
                    'Complexity as competitive advantage'
                ]
            }
        },
        {
            id: 'aca-2010',
            type: 'event',
            year: '2010',
            era: 'attempts',
            eraName: 'Early Transparency Attempts',
            title: 'The ACA Plants Seeds',
            subtitle: 'Comprehensive reform that included transparency provisions—but they didn\'t grow much.',
            points: [
                'Medical Loss Ratio (80/20 rule) made some costs visible',
                'Summary of Benefits improved plan comprehension',
                'Rate review added accountability for premium increases',
                'But: Didn\'t touch negotiated rates (still secret)',
                'Didn\'t address spread pricing by PBMs/TPAs'
            ],
            insight: 'The ACA established that transparency is a legitimate regulatory goal—but lacked enforcement teeth.'
        },
        {
            id: 'first-hospital-2018',
            type: 'event',
            year: '2018',
            era: 'attempts',
            eraName: 'Early Transparency Attempts',
            title: 'CMS First Hospital Price Requirement',
            subtitle: 'Hospitals required to post "standard charges"—but without enforcement, most ignored it.',
            points: [
                '"Standard charges" undefined (hospitals posted useless chargemasters)',
                'No requirement to show negotiated rates',
                'No penalties for non-compliance',
                'Hospitals posted PDFs in hidden corners of websites'
            ],
            insight: 'This failure proved that voluntary transparency doesn\'t work—and built political will for enforcement.'
        },
        {
            id: 'executive-order-2019',
            type: 'event',
            year: '2019',
            era: 'revolution',
            eraName: 'The Transparency Revolution',
            title: 'Executive Order on Price Transparency',
            subtitle: 'June 24, 2019: The moment everything changed.',
            quote: 'President Trump: "Improving Price and Quality Transparency in American Healthcare to Put Patients First"',
            points: [
                'First time executive branch prioritized transparency',
                'Required hospitals to post negotiated rates',
                'Required insurers to disclose negotiated rates',
                'Created urgency with 60-day deadline',
                'Industry immediately opposed—hospitals sued'
            ]
        },
        {
            id: 'hospital-rule-2019',
            type: 'breakthrough',
            year: '2019',
            era: 'revolution',
            eraName: 'The Transparency Revolution',
            title: 'Hospital Price Transparency Final Rule',
            subtitle: 'November 15, 2019: The rule that broke healthcare secrecy.',
            stats: [
                { number: 'ALL', label: 'Hospitals Must Comply', description: 'Regardless of size or payment type' },
                { number: '$300/day', label: 'Penalty for Non-Compliance', description: 'Up to $109,500 per year' },
                { number: 'JSON', label: 'Machine-Readable Format', description: 'Structured data for analysis' }
            ],
            insight: 'For the first time ever, negotiated rates between hospitals and insurers became public. What United pays vs. Aetna vs. Blue Cross—all visible.',
            example: 'Same procedure at same hospital: Insurer A pays $5,000, Insurer B pays $15,000, Cash price $3,000, Chargemaster $45,000. This is why they fought so hard to keep it secret.'
        },
        {
            id: 'coverage-rule-2020',
            type: 'breakthrough',
            year: '2020',
            era: 'revolution',
            eraName: 'The Transparency Revolution',
            title: 'Transparency in Coverage Final Rule',
            subtitle: 'November 12, 2020: The other half of the transparency revolution.',
            points: [
                'Health plans must publish Machine-Readable Files (MRFs)',
                'In-Network File: All negotiated rates with all providers',
                'Out-of-Network File: Historical allowed amounts',
                'Monthly updates required',
                'Public access—no authentication barriers'
            ],
            insight: 'Hospital rule shows what hospitals charge. Coverage rule shows what insurers pay. Together: Complete visibility into the entire system.',
            stats: [
                { number: '500GB-2TB', label: 'Data Per Major Insurer', description: 'Billions of data points, updated monthly' }
            ]
        },
        {
            id: 'caa-2020',
            type: 'breakthrough',
            year: '2020',
            era: 'revolution',
            eraName: 'The Transparency Revolution',
            title: 'Consolidated Appropriations Act (CAA)',
            subtitle: 'December 27, 2020: The law that changed employer obligations forever.',
            points: [
                'Section 203: Broker compensation disclosure (all fees, conflicts)',
                'Section 204: Gag clauses now illegal',
                'Employers have affirmative duty to monitor vendors',
                'Must use transparency tools—it\'s not optional',
                '"We trusted our consultant" is NOT a defense'
            ],
            quote: 'DOL made clear: Using transparency data isn\'t optional—it\'s a legal requirement.',
            insight: 'This killed the "we can\'t share that" excuse forever.'
        },
        {
            id: 'jan-2021',
            type: 'event',
            year: '2021',
            era: 'implementation',
            eraName: 'Implementation Era',
            title: 'Hospital Transparency Goes Live',
            subtitle: 'January 1, 2021: The data starts flowing—imperfectly, but unstoppably.',
            stats: [
                { number: '~30%', label: 'Initial Compliance', description: 'Many hospitals incomplete or obfuscated' },
                { number: '3-10x', label: 'Price Variation', description: 'Same procedure, same metro area' }
            ],
            insight: 'Despite compliance issues, thousands of hospitals posted usable data. For the first time, employers could see what they\'re actually paying. Journalists could compare. Patients could find cash prices.'
        },
        {
            id: 'july-2022',
            type: 'event',
            year: '2022',
            era: 'implementation',
            eraName: 'Implementation Era',
            title: 'MRFs Go Live',
            subtitle: 'July 1, 2022: The data explosion.',
            stats: [
                { number: '~800GB', label: 'UnitedHealthcare', description: 'Compressed data file size' },
                { number: '~500GB', label: 'Anthem', description: 'Every negotiated rate' },
                { number: 'Monthly', label: 'Updates', description: 'Exponential growth' }
            ],
            insight: 'The MRFs contain exact negotiated rates by payer, provider, procedure. Geographic variation. Evidence of spread pricing. Competitive intelligence. Benchmark data for direct contracting.',
            quote: 'The data exists. The tools to use it don\'t. That\'s Payerset\'s opportunity.'
        },
        {
            id: 'pbgh-2023',
            type: 'proof',
            year: '2023',
            era: 'implementation',
            eraName: 'Implementation Era',
            title: 'The PBGH Demonstration Project',
            subtitle: 'The proof that transparency works.',
            stats: [
                { number: '20-30%', label: 'Average Overpayment', description: 'By employers who analyzed their data' },
                { number: '100-600%', label: 'PBM Spread Pricing', description: 'Markups on some drugs' },
                { number: '100+', label: 'Employers Analyzed', description: 'Milliman actuarial validation' }
            ],
            quote: 'Elizabeth Mitchell (PBGH): "You can\'t fix what you can\'t see. And now we can see everything."',
            caseStudy: 'Cora Opsahl (Oregon employer): Found $5M/year overspend, negotiated direct contracts, removed expensive hospital from network, gave employees "the biggest raise they ever got."'
        },
        {
            id: 'current-2025',
            type: 'current',
            year: '2025',
            era: 'future',
            eraName: 'Current State & Future',
            title: 'Where We Are Now',
            subtitle: 'Late 2025: The tipping point is approaching.',
            stats: [
                { number: '4+ years', label: 'Hospital Data Public', description: 'Billions of negotiated rates' },
                { number: '3+ years', label: 'Payer Data Public', description: 'Monthly updates flowing' },
                { number: '10-15%', label: 'Large Employers Active', description: 'Using transparency data' },
                { number: '~5%', label: 'Patients Have Tools', description: 'Massive opportunity' }
            ],
            barriers: [
                'Complexity: Data hard to parse',
                'Volume: Terabytes overwhelming',
                'Expertise: Few understand how to use it',
                'Inertia: "This is how we\'ve always done it"'
            ]
        },
        {
            id: 'pbgh-playbook',
            type: 'playbook',
            era: 'future',
            eraName: 'Current State & Future',
            title: 'The PBGH Playbook',
            subtitle: 'The proven path forward that works right now.',
            steps: [
                { number: 1, title: 'Get the Data', description: 'Download hospital & payer MRF files, parse and normalize, match to claims' },
                { number: 2, title: 'Analyze Claims', description: 'Compare payments to Medicare, cash prices, other payers, regional rates' },
                { number: 3, title: 'Identify Patterns', description: 'Detect spread pricing, hidden fees, low-value providers, inefficiencies' },
                { number: 4, title: 'Take Action', description: 'Renegotiate contracts, remove bad providers, add good ones, direct contract' },
                { number: 5, title: 'Measure Results', description: 'Track 20-30% savings, monitor quality, employee satisfaction' }
            ],
            result: 'Typical result: 20-30% savings, improved quality, better employee access to care.'
        },
        {
            id: 'payerset-opportunity',
            type: 'opportunity',
            era: 'future',
            eraName: 'Current State & Future',
            title: 'The Payerset Opportunity',
            subtitle: 'You\'re building in the critical window between data and tools.',
            timeline: [
                { phase: 'Phase 1 (2019-2021)', status: 'Complete', description: 'Legislation passed, legal fights won' },
                { phase: 'Phase 2 (2021-2023)', status: 'Complete', description: 'Data goes public, compliance struggles' },
                { phase: 'Phase 3 (2023-2025)', status: 'Current', description: 'Early adopters prove it works (PBGH)' },
                { phase: 'Phase 4 (2025-2027)', status: 'Next', description: 'Early majority adoption, tool proliferation' },
                { phase: 'Phase 5 (2027+)', status: 'Future', description: 'Transparency becomes standard practice' }
            ],
            insight: 'You are here: Building tools in Phase 3 to capture Phase 4 market explosion.',
            windows: [
                { name: 'Employer Analytics', status: 'OPEN NOW', description: 'Claims analysis, overpayment detection, spread pricing ID' },
                { name: 'Patient Tools', status: 'Opening Soon', description: 'Cost estimators, provider comparison, recommendations' },
                { name: 'Market Transformation', status: '2-3 years', description: 'Direct contracting, network optimization, value-based payment' }
            ]
        },
        {
            id: 'lessons',
            type: 'lessons',
            era: 'future',
            eraName: 'Current State & Future',
            title: 'Key Lessons From The Timeline',
            subtitle: 'What 50 years of history teaches us about the next 5 years.',
            lessons: [
                { number: 1, title: 'Transparency Takes Decades, Then Happens All At Once', text: '45 years from ERISA to CAA. But 2019-2022 changed everything.' },
                { number: 2, title: 'Data Without Tools Is Useless', text: 'MRFs exist, but most employers can\'t use them. Make data actionable.' },
                { number: 3, title: 'Proof Points Unlock Markets', text: 'PBGH demonstration was a game-changer. Case studies matter more than theory.' },
                { number: 4, title: 'Incumbents Fight Transparency', text: 'Hospitals sued. Insurers lobbied. TPAs obfuscate. Expect resistance.' },
                { number: 5, title: 'Fiduciary Duty Is Your Legal Ally', text: 'Employers MUST use available tools. Not optional = huge demand driver.' },
                { number: 6, title: 'Small Wins Compound', text: 'Each transparency law built on the previous. Your tools enable the next generation.' }
            ]
        },
        {
            id: 'conclusion',
            type: 'conclusion',
            title: 'You\'re Building Market Infrastructure',
            subtitle: 'Welcome to the transparency revolution.',
            points: [
                'The data is public: Hospital rates (4+ years), Payer rates (3+ years), Billions of data points',
                'The tools are missing: Most employers can\'t use data, Most patients can\'t use data',
                'The opportunity is now: Legal mandate (CAA), Proof of concept (PBGH), Market momentum accelerating'
            ],
            quote: 'When Cora Opsahl says "You can\'t fix what you can\'t see," she\'s describing the 45-year problem. When she says "Now we can see everything," she\'s describing your opportunity.',
            finalWords: 'The transparency infrastructure exists. The market transformation is beginning. The tools to connect data to decisions are emerging. That\'s what you\'re building.'
        }
    ]
};

//================================================
// Custom Hook: Scroll Progress Tracking
//================================================
const useScrollProgress = (totalSlides) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let ticking = false;
        const timelineApp = document.querySelector('.timeline-app');

        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const slides = document.querySelectorAll('.timeline-slide');
                    const windowHeight = window.innerHeight;
                    let activeSlideIndex = 0;
                    let closestDistance = Infinity;

                    slides.forEach((slide, index) => {
                        const rect = slide.getBoundingClientRect();

                        // Make slide visible as soon as any part enters the viewport
                        if (rect.top < windowHeight && rect.bottom > 0) {
                            slide.classList.add('visible');
                        }

                        // Find the slide closest to the top of the viewport
                        const distanceFromTop = Math.abs(rect.top);
                        if (distanceFromTop < closestDistance) {
                            closestDistance = distanceFromTop;
                            activeSlideIndex = index;
                        }
                    });

                    setCurrentSlide(activeSlideIndex);
                    const newProgress = totalSlides > 1 ? (activeSlideIndex / (totalSlides - 1)) * 100 : 0;
                    setProgress(newProgress);

                    ticking = false;
                });
                ticking = true;
            }
        };

        // Make all slides visible immediately on mount
        const makeAllVisible = () => {
            const slides = document.querySelectorAll('.timeline-slide');
            slides.forEach(slide => {
                slide.classList.add('visible');
            });
            handleScroll();
        };

        // Call immediately and after a short delay
        setTimeout(makeAllVisible, 50);

        // Listen to scroll on the timeline-app container, not window
        if (timelineApp) {
            timelineApp.addEventListener('scroll', handleScroll, { passive: true });
        }
        window.addEventListener('resize', handleScroll);

        return () => {
            if (timelineApp) {
                timelineApp.removeEventListener('scroll', handleScroll);
            }
            window.removeEventListener('resize', handleScroll);
        };
    }, [totalSlides]);

    return { currentSlide, progress };
};

//================================================
// Custom Hook: Keyboard Navigation
//================================================
const useKeyboardNavigation = (totalSlides) => {
    useEffect(() => {
        const timelineApp = document.querySelector('.timeline-app');

        const handleKeyPress = (e) => {
            const slides = document.querySelectorAll('.timeline-slide');

            // Find current slide by checking which one is closest to top
            let currentSlideIndex = 0;
            let closestDistance = Infinity;

            slides.forEach((slide, index) => {
                const rect = slide.getBoundingClientRect();
                const distanceFromTop = Math.abs(rect.top);
                if (distanceFromTop < closestDistance) {
                    closestDistance = distanceFromTop;
                    currentSlideIndex = index;
                }
            });

            if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
                e.preventDefault();
                const nextSlide = currentSlideIndex + 1;
                if (nextSlide < totalSlides && slides[nextSlide]) {
                    slides[nextSlide].scrollIntoView({ behavior: 'smooth' });
                }
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const prevSlide = currentSlideIndex - 1;
                if (prevSlide >= 0 && slides[prevSlide]) {
                    slides[prevSlide].scrollIntoView({ behavior: 'smooth' });
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [totalSlides]);
};

//================================================
// Component: Progress Bar
//================================================
const ProgressBar = ({ progress }) => (
    <div className="timeline-progress">
        <div className="timeline-progress-bar" style={{ width: `${progress}%` }}></div>
    </div>
);

//================================================
// Component: Navigation Dots
//================================================
const NavigationDots = ({ totalSlides, currentSlide }) => {
    const scrollToSlide = (index) => {
        const slides = document.querySelectorAll('.timeline-slide');
        if (slides[index]) {
            slides[index].scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="timeline-nav-dots">
            {Array.from({ length: totalSlides }).map((_, index) => (
                <div
                    key={index}
                    className={`timeline-nav-dot ${index === currentSlide ? 'active' : ''}`}
                    onClick={() => scrollToSlide(index)}
                    title={`Slide ${index + 1} ${index === currentSlide ? '(Current)' : ''}`}
                />
            ))}
        </div>
    );
};

//================================================
// Component: Back Button
//================================================
const BackButton = () => (
    <a href="index.html" className="timeline-back-button">
        <i className="fas fa-arrow-left"></i>
        Back to Main Site
    </a>
);

//================================================
// Component: Navigation Hint
//================================================
const NavigationHint = () => (
    <div className="nav-hint">
        <i className="fas fa-chevron-down"></i>
        <span>Scroll or use arrow keys to navigate</span>
    </div>
);

//================================================
// Slide Components
//================================================

// Title Slide
const TitleSlide = ({ data }) => (
    <div className="timeline-slide" data-slide-id={data.id}>
        <div className="slide-content">
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>
            <div className="slide-body">
                <p>{processGlossaryTerms(data.body)}</p>
            </div>
            <NavigationHint />
        </div>
    </div>
);

// Insight Slide
const InsightSlide = ({ data }) => (
    <div className="timeline-slide alternate" data-slide-id={data.id}>
        <div className="slide-content">
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>
            <div className="quote-callout">
                <div className="quote-text">{processGlossaryTerms(data.body)}</div>
            </div>
        </div>
    </div>
);

// Event Slide
const EventSlide = ({ data }) => (
    <div className="timeline-slide" data-slide-id={data.id}>
        <div className="slide-content">
            {data.eraName && <div className={`slide-era-badge ${data.era}`}>{data.eraName}</div>}
            {data.year && <div className="slide-year">{data.year}</div>}
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>

            {data.quote && (
                <div className="quote-callout">
                    <div className="quote-text">{processGlossaryTerms(data.quote)}</div>
                </div>
            )}

            {data.points && (
                <div className="slide-body">
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {data.points.map((point, index) => (
                            <li key={index} style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start' }}>
                                <i className="fas fa-check-circle" style={{ color: 'var(--payerset-blue)', marginRight: '12px', marginTop: '4px' }}></i>
                                <span>{processGlossaryTerms(point)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {data.body && (
                <div className="slide-body">
                    <p>{processGlossaryTerms(data.body)}</p>
                </div>
            )}

            {data.insight && (
                <div className="quote-callout" style={{ marginTop: '32px', borderColor: 'var(--payerset-green)' }}>
                    <div className="quote-text" style={{ fontSize: '20px' }}>
                        <i className="fas fa-lightbulb" style={{ marginRight: '8px', color: 'var(--payerset-green)' }}></i>
                        {processGlossaryTerms(data.insight)}
                    </div>
                </div>
            )}
        </div>
    </div>
);

// Comparison Slide
const ComparisonSlide = ({ data }) => (
    <div className="timeline-slide alternate" data-slide-id={data.id}>
        <div className="slide-content">
            {data.eraName && <div className={`slide-era-badge ${data.era}`}>{data.eraName}</div>}
            {data.year && <div className="slide-year">{data.year}</div>}
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>

            <div className="before-after-grid">
                <div className="before-card">
                    <div className="comparison-label">
                        <i className="fas fa-times-circle"></i>
                        {processGlossaryTerms(data.before.label)}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                        {data.before.items.map((item, index) => (
                            <li key={index} style={{ marginBottom: '12px', fontSize: '16px', color: 'var(--text-secondary)' }}>
                                • {processGlossaryTerms(item)}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="after-card">
                    <div className="comparison-label">
                        <i className="fas fa-exclamation-triangle"></i>
                        {processGlossaryTerms(data.after.label)}
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left' }}>
                        {data.after.items.map((item, index) => (
                            <li key={index} style={{ marginBottom: '12px', fontSize: '16px', color: 'var(--text-secondary)' }}>
                                • {processGlossaryTerms(item)}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// Breakthrough Slide (with stats)
const BreakthroughSlide = ({ data }) => (
    <div className="timeline-slide" data-slide-id={data.id}>
        <div className="slide-content">
            {data.eraName && <div className={`slide-era-badge ${data.era}`}>{data.eraName}</div>}
            {data.year && <div className="slide-year">{data.year}</div>}
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>

            {data.stats && (
                <div className="stat-grid">
                    {data.stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-number">{stat.number}</div>
                            <div className="stat-label">{processGlossaryTerms(stat.label)}</div>
                            <div className="stat-description">{processGlossaryTerms(stat.description)}</div>
                        </div>
                    ))}
                </div>
            )}

            {data.points && (
                <div className="slide-body">
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {data.points.map((point, index) => (
                            <li key={index} style={{ marginBottom: '16px', display: 'flex', alignItems: 'flex-start' }}>
                                <i className="fas fa-arrow-right" style={{ color: 'var(--payerset-blue)', marginRight: '12px', marginTop: '4px' }}></i>
                                <span>{processGlossaryTerms(point)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {data.insight && (
                <div className="quote-callout" style={{ borderColor: 'var(--payerset-green)' }}>
                    <div className="quote-text" style={{ fontSize: '20px' }}>
                        <i className="fas fa-bolt" style={{ marginRight: '8px', color: 'var(--payerset-green)' }}></i>
                        {processGlossaryTerms(data.insight)}
                    </div>
                </div>
            )}

            {data.example && (
                <div className="slide-body" style={{ marginTop: '24px', background: 'var(--bg-light)', padding: '24px', borderRadius: '12px' }}>
                    <p><strong>Real Example:</strong> {processGlossaryTerms(data.example)}</p>
                </div>
            )}
        </div>
    </div>
);

// Proof Slide (PBGH)
const ProofSlide = ({ data }) => (
    <div className="timeline-slide alternate" data-slide-id={data.id}>
        <div className="slide-content">
            {data.eraName && <div className={`slide-era-badge ${data.era}`}>{data.eraName}</div>}
            {data.year && <div className="slide-year">{data.year}</div>}
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>

            <div className="stat-grid">
                {data.stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-number">{stat.number}</div>
                        <div className="stat-label">{processGlossaryTerms(stat.label)}</div>
                        <div className="stat-description">{processGlossaryTerms(stat.description)}</div>
                    </div>
                ))}
            </div>

            {data.quote && (
                <div className="quote-callout">
                    <div className="quote-text">{processGlossaryTerms(data.quote)}</div>
                </div>
            )}

            {data.caseStudy && (
                <div className="slide-body" style={{ background: 'white', padding: '32px', borderRadius: '12px', borderLeft: '4px solid var(--payerset-green)' }}>
                    <p><strong>Case Study:</strong> {processGlossaryTerms(data.caseStudy)}</p>
                </div>
            )}
        </div>
    </div>
);

// Current State Slide
const CurrentSlide = ({ data }) => (
    <div className="timeline-slide" data-slide-id={data.id}>
        <div className="slide-content">
            {data.eraName && <div className={`slide-era-badge ${data.era}`}>{data.eraName}</div>}
            {data.year && <div className="slide-year">{data.year}</div>}
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>

            <div className="stat-grid">
                {data.stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-number">{stat.number}</div>
                        <div className="stat-label">{processGlossaryTerms(stat.label)}</div>
                        <div className="stat-description">{processGlossaryTerms(stat.description)}</div>
                    </div>
                ))}
            </div>

            {data.barriers && (
                <div className="slide-body" style={{ marginTop: '48px' }}>
                    <h3 style={{ fontSize: '24px', marginBottom: '24px', color: 'var(--text-primary)' }}>
                        Barriers Remaining
                    </h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {data.barriers.map((barrier, index) => (
                            <li key={index} style={{ marginBottom: '12px', display: 'flex', alignItems: 'flex-start' }}>
                                <i className="fas fa-triangle-exclamation" style={{ color: 'var(--color-problem)', marginRight: '12px', marginTop: '4px' }}></i>
                                <span>{processGlossaryTerms(barrier)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    </div>
);

// Playbook Slide
const PlaybookSlide = ({ data }) => (
    <div className="timeline-slide alternate" data-slide-id={data.id}>
        <div className="slide-content">
            {data.eraName && <div className={`slide-era-badge ${data.era}`}>{data.eraName}</div>}
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>

            <div className="takeaway-grid">
                {data.steps.map((step) => (
                    <div key={step.number} className="takeaway-card">
                        <div className="takeaway-number">{step.number}</div>
                        <div className="takeaway-title">{processGlossaryTerms(step.title)}</div>
                        <div className="takeaway-description">{processGlossaryTerms(step.description)}</div>
                    </div>
                ))}
            </div>

            <div className="quote-callout" style={{ borderColor: 'var(--payerset-green)', marginTop: '48px' }}>
                <div className="quote-text" style={{ fontSize: '22px' }}>
                    <i className="fas fa-trophy" style={{ marginRight: '8px', color: 'var(--payerset-green)' }}></i>
                    {processGlossaryTerms(data.result)}
                </div>
            </div>
        </div>
    </div>
);

// Opportunity Slide
const OpportunitySlide = ({ data }) => (
    <div className="timeline-slide" data-slide-id={data.id}>
        <div className="slide-content">
            {data.eraName && <div className={`slide-era-badge ${data.era}`}>{data.eraName}</div>}
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>

            <div className="slide-body" style={{ marginBottom: '48px' }}>
                {data.timeline.map((phase, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        marginBottom: '20px',
                        padding: '20px',
                        background: phase.status === 'Current' ? 'var(--bg-light)' : 'white',
                        borderRadius: '8px',
                        border: phase.status === 'Current' ? '2px solid var(--payerset-blue)' : '1px solid var(--border-light)'
                    }}>
                        <div style={{
                            minWidth: '80px',
                            padding: '8px 16px',
                            background: phase.status === 'Complete' ? 'var(--payerset-green)' :
                                        phase.status === 'Current' ? 'var(--payerset-blue)' : 'var(--text-secondary)',
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: 700,
                            textAlign: 'center'
                        }}>
                            {phase.status}
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 700, marginBottom: '4px' }}>{processGlossaryTerms(phase.phase)}</div>
                            <div style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{processGlossaryTerms(phase.description)}</div>
                        </div>
                    </div>
                ))}
            </div>

            {data.insight && (
                <div className="quote-callout" style={{ borderColor: 'var(--payerset-blue)' }}>
                    <div className="quote-text" style={{ fontSize: '22px' }}>
                        <i className="fas fa-location-dot" style={{ marginRight: '8px', color: 'var(--payerset-blue)' }}></i>
                        {processGlossaryTerms(data.insight)}
                    </div>
                </div>
            )}

            {data.windows && (
                <div className="stat-grid" style={{ marginTop: '48px' }}>
                    {data.windows.map((window, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-label">{processGlossaryTerms(window.name)}</div>
                            <div className="stat-number" style={{ fontSize: '32px', margin: '16px 0' }}>
                                {window.status}
                            </div>
                            <div className="stat-description">{processGlossaryTerms(window.description)}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

// Lessons Slide
const LessonsSlide = ({ data }) => (
    <div className="timeline-slide alternate" data-slide-id={data.id}>
        <div className="slide-content">
            {data.eraName && <div className={`slide-era-badge ${data.era}`}>{data.eraName}</div>}
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>

            <div className="takeaway-grid">
                {data.lessons.map((lesson) => (
                    <div key={lesson.number} className="takeaway-card">
                        <div className="takeaway-number">{lesson.number}</div>
                        <div className="takeaway-title">{processGlossaryTerms(lesson.title)}</div>
                        <div className="takeaway-description">{processGlossaryTerms(lesson.text)}</div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// Conclusion Slide
const ConclusionSlide = ({ data }) => (
    <div className="timeline-slide" data-slide-id={data.id}>
        <div className="slide-content">
            <div className="slide-title">{processGlossaryTerms(data.title)}</div>
            <div className="slide-subtitle">{processGlossaryTerms(data.subtitle)}</div>

            <div className="slide-body" style={{ fontSize: '20px', marginBottom: '48px' }}>
                {data.points.map((point, index) => (
                    <p key={index} style={{ marginBottom: '24px' }}>
                        <i className="fas fa-check" style={{ color: 'var(--payerset-green)', marginRight: '12px' }}></i>
                        {processGlossaryTerms(point)}
                    </p>
                ))}
            </div>

            <div className="quote-callout">
                <div className="quote-text">{processGlossaryTerms(data.quote)}</div>
            </div>

            <div className="slide-body" style={{ fontSize: '24px', fontWeight: 600, marginTop: '48px', textAlign: 'center' }}>
                <p>{processGlossaryTerms(data.finalWords)}</p>
            </div>

            <div style={{ marginTop: '48px', display: 'flex', gap: '20px', justifyContent: 'center' }}>
                <a href="index.html" className="slide-cta">
                    <i className="fas fa-home"></i>
                    Back to Main Site
                </a>
                <a href="https://payerset.com" className="slide-cta slide-cta-secondary" target="_blank" rel="noopener noreferrer">
                    <i className="fas fa-external-link-alt"></i>
                    Visit Payerset
                </a>
            </div>
        </div>
    </div>
);

//================================================
// Slide Router Component
//================================================
const SlideRouter = ({ data }) => {
    switch (data.type) {
        case 'title':
            return <TitleSlide data={data} />;
        case 'insight':
            return <InsightSlide data={data} />;
        case 'event':
            return <EventSlide data={data} />;
        case 'comparison':
            return <ComparisonSlide data={data} />;
        case 'breakthrough':
            return <BreakthroughSlide data={data} />;
        case 'proof':
            return <ProofSlide data={data} />;
        case 'current':
            return <CurrentSlide data={data} />;
        case 'playbook':
            return <PlaybookSlide data={data} />;
        case 'opportunity':
            return <OpportunitySlide data={data} />;
        case 'lessons':
            return <LessonsSlide data={data} />;
        case 'conclusion':
            return <ConclusionSlide data={data} />;
        default:
            return <EventSlide data={data} />;
    }
};

//================================================
// Main App Component
//================================================
const TimelineApp = () => {
    const totalSlides = timelineData.slides.length;
    const { currentSlide, progress } = useScrollProgress(totalSlides);
    useKeyboardNavigation(totalSlides);

    // Make first slide visible on mount
    useEffect(() => {
        const firstSlide = document.querySelector('.timeline-slide');
        if (firstSlide) {
            firstSlide.classList.add('visible');
        }
    }, []);

    return (
        <div className="timeline-app">
            <BackButton />
            <ProgressBar progress={progress} />
            <NavigationDots totalSlides={totalSlides} currentSlide={currentSlide} />

            {timelineData.slides.map((slide, index) => (
                <SlideRouter key={slide.id} data={slide} index={index} />
            ))}
        </div>
    );
};

//================================================
// Mount the App
//================================================
const container = document.getElementById('timeline-root');
const root = ReactDOM.createRoot(container);
root.render(<TimelineApp />);
