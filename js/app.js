//================================================
// React Imports (from the CDN)
//================================================
const { useState, useEffect } = React;


//================================================
// Custom Hook: useScrollAnimation
// Simple fade-in when elements enter viewport
//================================================
const useScrollAnimation = () => {
    useEffect(() => {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const elements = document.querySelectorAll(
            '.visualization-container, .comparison-side, .impact-card, .story-panel'
        );
        elements.forEach(el => observer.observe(el));

        return () => observer.disconnect();
    }, []);
};


// Particle animations removed for minimalist design


//================================================
// Component: Navigation
//================================================
const Navigation = () => {
    const [diagramsOpen, setDiagramsOpen] = useState(false);
    const [toolsOpen, setToolsOpen] = useState(false);
    const [journalOpen, setJournalOpen] = useState(false);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.nav-dropdown')) {
                setDiagramsOpen(false);
                setToolsOpen(false);
                setJournalOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    return (
        <nav className="nav">
            <a href="#" className="nav-logo">Payerset</a>
            <div className="nav-links">
                <a href="#problem" className="nav-link">The Problem</a>
                <a href="#cuban" className="nav-link">The Questions</a>
                <a href="#proof" className="nav-link">The Proof</a>
                <a href="#solution" className="nav-link">The Solution</a>
                <a href="#impact" className="nav-link">Impact</a>
                <a href="use-cases.html" className="nav-link">Use Cases</a>

                <div className={`nav-dropdown ${diagramsOpen ? 'open' : ''}`}>
                    <div className="nav-link nav-dropdown-toggle" onClick={() => {
                        setDiagramsOpen(!diagramsOpen);
                        setToolsOpen(false);
                        setJournalOpen(false);
                    }}>
                        Diagrams
                        <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="nav-dropdown-menu">
                        <a href="timeline.html" className="nav-dropdown-item">
                            <i className="fas fa-timeline"></i>
                            Transparency Timeline
                        </a>
                        <a href="diagrams/diagram1.html" className="nav-dropdown-item">
                            <i className="fas fa-network-wired"></i>
                            Ecosystem Map
                        </a>
                        <a href="diagrams/diagram2.html" className="nav-dropdown-item">
                            <i className="fas fa-dollar-sign"></i>
                            Money Flows
                        </a>
                        <a href="diagrams/diagram3.html" className="nav-dropdown-item">
                            <i className="fas fa-bolt"></i>
                            Power Map
                        </a>
                        <a href="diagrams/diagram4.html" className="nav-dropdown-item">
                            <i className="fas fa-shield-alt"></i>
                            Conflicts Map
                        </a>
                        <a href="diagrams/diagram5.html" className="nav-dropdown-item">
                            <i className="fas fa-sync-alt"></i>
                            Transformation
                        </a>
                        <a href="diagrams/diagram-test.html" className="nav-dropdown-item">
                            <i className="fas fa-flask"></i>
                            Data Explorer
                            <span className="alpha-badge">Alpha</span>
                        </a>
                    </div>
                </div>

                <div className={`nav-dropdown ${toolsOpen ? 'open' : ''}`}>
                    <div className="nav-link nav-dropdown-toggle" onClick={() => {
                        setToolsOpen(!toolsOpen);
                        setDiagramsOpen(false);
                        setJournalOpen(false);
                    }}>
                        Use Tools
                        <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="nav-dropdown-menu">
                        <a href="experiments/patients/index.html" className="nav-dropdown-item">
                            <i className="fas fa-user"></i>
                            Patient Tools
                        </a>
                        <a href="experiments/employers/index.html" className="nav-dropdown-item">
                            <i className="fas fa-briefcase"></i>
                            Employer Tools
                        </a>
                        <a href="experiments/providers/index.html" className="nav-dropdown-item">
                            <i className="fas fa-user-doctor"></i>
                            Provider Tools
                        </a>
                        <a href="experiments/learn/stakeholder-map.html" className="nav-dropdown-item">
                            <i className="fas fa-graduation-cap"></i>
                            Learn: Stakeholder Map
                        </a>
                    </div>
                </div>

                <div className={`nav-dropdown ${journalOpen ? 'open' : ''}`}>
                    <div className="nav-link nav-dropdown-toggle" onClick={() => {
                        setJournalOpen(!journalOpen);
                        setDiagramsOpen(false);
                        setToolsOpen(false);
                    }}>
                        Journal
                        <i className="fas fa-chevron-down"></i>
                    </div>
                    <div className="nav-dropdown-menu">
                        <a href="journal/index.html" className="nav-dropdown-item">
                            <i className="fas fa-compass"></i>
                            Journal Home
                        </a>
                        <a href="2025-11/persona-campaign-launch.html" className="nav-dropdown-item">
                            <i className="fas fa-rocket"></i>
                            Building the Foundation
                        </a>
                        <a href="2025-11/index.html" className="nav-dropdown-item">
                            <i className="fas fa-file-alt"></i>
                            2025-11: "Explain it to Mom"
                        </a>
                        <a href="2025-11/bill-checker.html" className="nav-dropdown-item">
                            <i className="fas fa-shield-halved"></i>
                            Bill Shield: Check Your Bills
                        </a>
                        <a href="2025-11/provider-reviews.html" className="nav-dropdown-item">
                            <i className="fas fa-star"></i>
                            Provider Reviews
                        </a>
                        <a href="journal/personas-patients.html" className="nav-dropdown-item">
                            <i className="fas fa-user"></i>
                            Personas: Patients
                        </a>
                        <a href="journal/personas-employers.html" className="nav-dropdown-item">
                            <i className="fas fa-briefcase"></i>
                            Personas: Employers
                        </a>
                        <a href="journal/personas-providers.html" className="nav-dropdown-item">
                            <i className="fas fa-user-doctor"></i>
                            Personas: Providers
                        </a>
                    </div>
                </div>

                <a href="https://payerset.com" className="nav-link nav-cta" target="_blank" rel="noopener noreferrer">Visit Payerset</a>
            </div>
        </nav>
    );
};

//================================================
// Component: Hero
//================================================
const Hero = () => {
    return (
        <section className="hero" id="hero">
            <div className="hero-content">
                <h1>Your Healthcare Dollars Are Disappearing</h1>
                <p className="hero-subtitle">
                    We're building the tool that shows where your money actually goes—and gets it back.
                </p>
                <div className="cta-container">
                    <a href="#problem" className="cta-button">See The Problem</a>
                    <a href="experiments/index.html" className="cta-button-secondary">Skip to Tools →</a>
                </div>
            </div>
        </section>
    );
};

//================================================
// Component: ProblemSection
//================================================
const ProblemSection = () => {
    return (
        <section id="problem" className="section dark-system">
            <h2 className="section-title">Where Does $100 Go?</h2>
            <p className="section-subtitle">
                Imagine your employer pays $100 for your healthcare. Here's what actually happens.
            </p>

            <div className="sankey-container">
                <div className="sankey-flow">
                    {/* Employer Node */}
                    <div className="sankey-node">
                        <div className="node-box employer">
                            <div className="node-label">EMPLOYER</div>
                            <div className="node-amount">$100</div>
                        </div>
                    </div>

                    {/* Full Flow Band (Employer to Middleman) */}
                    <div className="sankey-band">
                        <div className="band-shape full"></div>
                    </div>

                    {/* Middleman Node */}
                    <div className="sankey-node">
                        <div className="node-box middleman">
                            <div className="node-label">MIDDLEMAN</div>
                            <div className="node-amount">Takes $30</div>
                        </div>
                    </div>

                    {/* Reduced Flow Band (Middleman to Provider) */}
                    <div className="sankey-band">
                        <div className="band-shape reduced"></div>
                    </div>

                    {/* Provider Node */}
                    <div className="sankey-node">
                        <div className="node-box provider">
                            <div className="node-label">PROVIDER</div>
                            <div className="node-amount">$70</div>
                        </div>
                    </div>
                </div>

                {/* Leak Annotation - Positioned Above Middleman */}
                <div className="leak-annotation">
                    <div className="leak-pointer"></div>
                    <div className="leak-amount">$30 MISSING</div>
                    <div className="leak-description">Hidden in fees, markups, and complexity</div>
                </div>

                {/* Incentive Notes Below Each Node */}
                <div className="incentive-notes">
                    <div className="incentive-note employer-incentive">
                        <strong>Incentive</strong>
                        Reduce costs, keep staff healthy
                    </div>
                    <div className="incentive-note middleman-incentive">
                        <strong>Incentive</strong>
                        Maximize volume and fees, not savings
                    </div>
                    <div className="incentive-note provider-incentive">
                        <strong>Incentive</strong>
                        Get paid fairly for quality care
                    </div>
                </div>
            </div>

            <div className="story-panel">
                <h3>That Missing $30? It's Gone.</h3>
                <p>
                    A middleman takes $30 before anyone gets care. Your doctor gets $70.
                </p>
                <p>
                    That $30? No one knows where it goes. The contracts are secret. Employers can't see it. You can't see it.
                </p>
                <p>
                    <strong>This isn't just money. It's lives.</strong>
                </p>
                <p>
                    Meet Sarah. She needs an MRI for back pain. Hospital charges $3,000. Independent imaging center across town? $400. Same machine, same quality. But her insurance doesn't tell her there's a choice. She pays $3,000 out of pocket—because she hasn't met her $5,000 deductible yet. She goes into credit card debt. Now she delays her next appointment because she can't afford it.
                </p>
                <p>
                    That missing $30 per $100? Over 160 million Americans, over a year? That's $5,000 per family. That's your mom's cancer screening. Your kid's insulin. Your neighbor's surgery they keep delaying.
                </p>
                <p style={{fontSize: '21px', fontWeight: 600, marginTop: '24px'}}>
                    When healthcare costs too much, people wait. Waiting kills.
                </p>
            </div>
        </section>
    );
};

//================================================
// Component: CubanQuestionsSection
//================================================
const CubanQuestionsSection = () => {
    return (
        <section id="cuban" className="section">
            <h2 className="section-title">The 3 Questions That Expose Everything</h2>
            <p className="section-subtitle">
                Mark Cuban says healthcare boils down to three simple questions. The industry's made them impossible to answer.
            </p>

            <div className="impact-grid">
                <div className="impact-card">
                    <div className="impact-icon"><i className="fas fa-dollar-sign"></i></div>
                    <h3 style={{fontSize: '24px', marginBottom: '16px', color: 'var(--text-primary)'}}>How much does it cost?</h3>
                    <p>
                        Nobody knows. Prices are secret. The same MRI costs $400 at one place, $3,000 at another. You only find out after.
                    </p>
                </div>
                <div className="impact-card">
                    <div className="impact-icon"><i className="fas fa-credit-card"></i></div>
                    <h3 style={{fontSize: '24px', marginBottom: '16px', color: 'var(--text-primary)'}}>How do you pay for it?</h3>
                    <p>
                        Through a maze of middlemen. Each one takes a cut. Your employer pays $100, but $30 disappears before the doctor sees a dime.
                    </p>
                </div>
                <div className="impact-card">
                    <div className="impact-icon"><i className="fas fa-triangle-exclamation"></i></div>
                    <h3 style={{fontSize: '24px', marginBottom: '16px', color: 'var(--text-primary)'}}>Who takes the risk for nonpayment?</h3>
                    <p>
                        You do. If your deductible is $3,000 and you have $500 in savings, you're functionally uninsured. You delay care. You get sicker.
                    </p>
                </div>
            </div>

            <div className="story-panel">
                <h3>Cuban's Vision: Back to 1955</h3>
                <p>
                    "Back to 1955, where you can pay with a credit card, cash, or a chicken."
                </p>
                <p>
                    Simple, transparent pricing. No mysterious middlemen. No surprise bills. No choosing between rent and insulin.
                </p>
                <p style={{fontSize: '21px', fontWeight: 600, marginTop: '24px'}}>
                    That's what transparency enables. That's what we're building.
                </p>
                <div className="cta-container">
                    <a href="#proof" className="cta-button">See The Proof</a>
                </div>
            </div>
        </section>
    );
};

//================================================
// Component: PBGHProofSection
//================================================
const PBGHProofSection = () => {
    return (
        <section id="proof" className="section dark-system">
            <h2 className="section-title">
                The Proof: Real Employers Found 30% Overpayment
                <span className="source-badge" data-tooltip="Pacific Business Group on Health Transparency Demonstration Project, 2023">
                    <i className="fas fa-database"></i> PBGH Study
                </span>
            </h2>
            <p className="section-subtitle">
                This isn't theory. The PBGH demonstration project proved transparency works.
            </p>

            <div className="comparison-container">
                <div className="comparison-side before-side">
                    <h3><i className="fas fa-times-circle" style={{marginRight: '8px', color: '#EF4444'}}></i> What Employers Believed</h3>
                    <div className="metric">
                        <div className="metric-label">Their Rates</div>
                        <div className="metric-value" style={{color: '#ef4444'}}>Great</div>
                        <div className="metric-description">
                            Consultants showed "impressive discounts." Everything looked fine.
                        </div>
                    </div>
                    <div className="metric">
                        <div className="metric-label">Quality</div>
                        <div className="metric-value" style={{color: '#ef4444', fontSize: '48px'}}>???</div>
                        <div className="metric-description">
                            No idea if expensive hospitals were actually better. Just trusted the brand.
                        </div>
                    </div>
                </div>

                <div className="comparison-side after-side">
                    <h3><i className="fas fa-check-circle" style={{marginRight: '8px', color: '#10B981'}}></i> What Transparency Revealed</h3>
                    <div className="metric">
                        <div className="metric-label">Actual Overpayment</div>
                        <div className="metric-value" style={{color: '#10B981'}}>30%</div>
                        <div className="metric-description">
                            Paying 30% more than peers for identical care. Millions wasted.
                        </div>
                    </div>
                    <div className="metric">
                        <div className="metric-label">Price vs Quality</div>
                        <div className="metric-value" style={{color: '#10B981', fontSize: '48px'}}>ZERO</div>
                        <div className="metric-description">
                            No correlation. Highest prices often had LOWEST quality. Brand meant nothing.
                        </div>
                    </div>
                </div>
            </div>

            <div className="story-panel">
                <h3>The Uncomfortable Boardroom Moment</h3>
                <p>
                    Picture this: A CFO discovers her company is overpaying by millions. She calls in her consultant.
                </p>
                <p>
                    <strong>"You've been showing us great discounts for years. Why are we paying 30% more than our peers?"</strong>
                </p>
                <p>
                    Consultant stammers: "Well, discounts are measured against chargemaster rates..."
                </p>
                <p>
                    <strong>"So the baseline is meaningless? And you've been taking commission on these inflated prices?"</strong>
                </p>
                <p style={{fontSize: '19px', marginTop: '24px', color: '#6B7281', fontStyle: 'italic'}}>
                    This is happening right now at companies across America. Transparency is exposing decades of overcharging.
                </p>
            </div>
        </section>
    );
};

//================================================
// Component: QualityMetricsSection
//================================================
const QualityMetricsSection = () => {
    return (
        <section id="quality" className="section">
            <h2 className="section-title">
                Quality Doesn't Cost More—It Costs Less
                <span className="source-badge" data-tooltip="Leapfrog Hospital Safety Grades - Independent safety and quality ratings">
                    <i className="fas fa-shield-halved"></i> Leapfrog
                </span>
            </h2>
            <p className="section-subtitle">
                The most expensive hospitals often have the worst safety grades. Leapfrog scores reveal the truth.
            </p>

            <div className="comparison-container">
                <div className="comparison-side before-side">
                    <h3><i className="fas fa-times-circle" style={{marginRight: '8px', color: '#EF4444'}}></i> MegaHealth System</h3>
                    <div className="metric">
                        <div className="metric-label">Hip Replacement Cost</div>
                        <div className="metric-value" style={{color: '#ef4444'}}>$42,000</div>
                        <div className="metric-description">
                            The "prestigious" hospital with billboards everywhere.
                        </div>
                    </div>
                    <div className="metric">
                        <div className="metric-label">Leapfrog Safety Grade</div>
                        <div className="metric-value" style={{color: '#ef4444'}}>C</div>
                        <div className="metric-description">
                            Twice as likely to die from preventable error. But you didn't know that.
                        </div>
                    </div>
                </div>

                <div className="comparison-side after-side">
                    <h3><i className="fas fa-check-circle" style={{marginRight: '8px', color: '#10B981'}}></i> Community Orthopedic</h3>
                    <div className="metric">
                        <div className="metric-label">Hip Replacement Cost</div>
                        <div className="metric-value" style={{color: '#10B981'}}>$18,000</div>
                        <div className="metric-description">
                            Same procedure. Better outcome. Less than half the cost.
                        </div>
                    </div>
                    <div className="metric">
                        <div className="metric-label">Leapfrog Safety Grade</div>
                        <div className="metric-value" style={{color: '#10B981'}}>A</div>
                        <div className="metric-description">
                            Safest care. Best outcomes. But you never heard of them.
                        </div>
                    </div>
                </div>
            </div>

            <div className="story-panel">
                <div className="source-ribbon">
                    <i className="fas fa-database"></i>
                    <strong>Data Source:</strong> Leapfrog Hospital Safety Grades & PBGH Quality Analysis
                </div>
                <h3>Dr. Rodis Improved Safety. Nobody Noticed.</h3>
                <p>
                    Dr. John Rodis became CEO of a hospital with a D safety grade. He worked for years to improve quality. He succeeded—his hospital earned a much higher grade.
                </p>
                <p>
                    He expected volume to increase. Surely employers would steer patients to a safer hospital?
                </p>
                <p>
                    <strong>Result: Crickets. No volume change.</strong>
                </p>
                <p>
                    Why? Because employers didn't have the data. They didn't know his hospital got safer.
                </p>
                <p style={{fontSize: '21px', fontWeight: 600, marginTop: '24px', color: '#10B981'}}>
                    With transparency, quality becomes competitive advantage. Good hospitals finally win.
                </p>
            </div>
        </section>
    );
};

//================================================
// Component: TransformationSection
//================================================
const TransformationSection = ({ stage, setStage }) => {
    return (
        <section id="solution" className="section transformation">
            <h2 className="section-title">The Solution: Clean the Data</h2>
            <p className="section-subtitle">
                New laws force hospitals to publish prices. Payerset makes that data usable.
            </p>

            <button
                className="transform-button"
                onClick={() => setStage('transformed')}
            >
                See How It Works
            </button>

            {stage === 'transformed' && (
                <div className="visualization-container" style={{
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                }}>
                    <div className="money-flow">
                        <div className="player employer">
                            Employer<br/>
                            <small>Pays $70</small>
                        </div>
                        <div className="player transparency">
                            PAYERSET<br/>
                            <small>Price Tracking</small>
                        </div>
                        <div className="player provider">
                            Doctor<br/>
                            <small>Gets $70</small>
                        </div>
                        <div className="flow-label" style={{left: '25%', top: '30%', background: '#3B82F6', color: 'white'}}>
                            <i className="fas fa-file-contract" style={{marginRight: '6px'}}></i> Direct Contract
                        </div>
                        <div className="flow-label" style={{left: '60%', top: '30%', background: '#10B981', color: 'white'}}>
                            <i className="fas fa-check-circle" style={{marginRight: '6px'}}></i> Fair Payment
                        </div>
                        <div className="flow-label" style={{left: '45%', top: '70%', background: '#3B82F6', color: 'white', fontSize: '19px', fontWeight: 700}}>
                            <i className="fas fa-dollar-sign" style={{marginRight: '6px'}}></i> $30 SAVED
                        </div>
                    </div>
                </div>
            )}

            <div className="story-panel">
                <h3>What Just Happened?</h3>
                <p>
                    New laws (2021-2022) force hospitals and insurance companies to publish their actual prices. But the data is a mess—trillions of rows, impossible to use.
                </p>
                <p>
                    <strong>Payerset cleans it, connects it, and makes it searchable.</strong>
                </p>
                <p>
                    Now employers can see what they're actually paying. What doctors are actually receiving. Where the $30 goes.
                </p>
                <p>
                    Armed with data, they contract directly with hospitals. Cut out the middleman.
                </p>
                <p style={{fontSize: '21px', fontWeight: 600, marginTop: '24px', color: '#10B981'}}>
                    Result: $30 saved per $100. That's 300 jobs. Or $3,000 per employee. Or $0 deductibles.
                </p>
            </div>
        </section>
    );
};

//================================================
// Component: ComparisonSection
//================================================
const ComparisonSection = () => {
    return (
        <section id="comparison" className="section comparison">
            <h2 className="section-title">The Same Healthcare. Different Outcomes.</h2>
            <p className="section-subtitle">
                Here's what changes when you can see where the money goes.
            </p>

            <div className="comparison-container">
                <div className="comparison-side before-side">
                    <h3><i className="fas fa-times-circle" style={{marginRight: '8px', color: '#EF4444'}}></i> Without Transparency</h3>
                    <div className="metric">
                        <div className="metric-label">What You Pay</div>
                        <div className="metric-value" style={{color: '#ef4444'}}>$100</div>
                        <div className="metric-description">
                            No idea where it goes. You just pay the bill and hope.
                        </div>
                    </div>
                    <div className="metric">
                        <div className="metric-label">Hidden Fees</div>
                        <div className="metric-value" style={{color: '#ef4444'}}>$30</div>
                        <div className="metric-description">
                            Completely invisible. You can't see it. Can't question it.
                        </div>
                    </div>
                    <div className="metric">
                        <div className="metric-label">Your Deductible</div>
                        <div className="metric-value" style={{color: '#ef4444'}}>$3,000</div>
                        <div className="metric-description">
                            40% of Americans have less than $500 in savings. This deductible might as well be $10 million.
                        </div>
                    </div>
                </div>

                <div className="comparison-side after-side">
                    <h3><i className="fas fa-check-circle" style={{marginRight: '8px', color: '#10B981'}}></i> With Transparency</h3>
                    <div className="metric">
                        <div className="metric-label">What You Pay</div>
                        <div className="metric-value" style={{color: '#10B981'}}>$70</div>
                        <div className="metric-description">
                            Direct contracts. Fair prices. You know exactly what you're paying for.
                        </div>
                    </div>
                    <div className="metric">
                        <div className="metric-label">Hidden Fees</div>
                        <div className="metric-value" style={{color: '#10B981'}}>$0</div>
                        <div className="metric-description">
                            Everything is visible. No middleman taking a cut. Every dollar goes to care.
                        </div>
                    </div>
                    <div className="metric">
                        <div className="metric-label">Your Deductible</div>
                        <div className="metric-value" style={{color: '#10B981'}}>$0</div>
                        <div className="metric-description">
                            The 32BJ Health Fund did this. Removed an expensive hospital, gave members "the biggest raise they ever got."
                        </div>
                    </div>
                </div>
            </div>

            <div className="story-panel">
                <div className="source-ribbon">
                    <i className="fas fa-building"></i>
                    <strong>Data Source:</strong> 32BJ Health Fund Case Study & PBGH Report
                </div>
                <h3>The 32BJ Story: What Happens When You Act</h3>
                <p>
                    32BJ Health Fund discovered one hospital was charging millions more than others for the same care. Not better care—same care, just way more expensive.
                </p>
                <p>
                    So they removed it from the network. Scary decision, right?
                </p>
                <p>
                    <strong>Results:</strong>
                </p>
                <ul style={{marginLeft: '24px', marginTop: '12px', fontSize: '19px', lineHeight: '1.8'}}>
                    <li>Saved millions in excess charges</li>
                    <li>Members got "biggest raise they had ever gotten"</li>
                    <li>Employers got a premium holiday</li>
                    <li>"Almost no member noise" because they shared the savings</li>
                </ul>
                <p style={{fontSize: '21px', fontWeight: 600, marginTop: '24px', color: '#10B981'}}>
                    Transparency + courage = healthcare that actually works for people.
                </p>
            </div>
        </section>
    );
};

//================================================
// Component: ImpactSection
//================================================
const ImpactSection = () => {
    return (
        <section id="impact" className="section impact">
            <h2 className="section-title">The Real Numbers</h2>
            <p className="section-subtitle">
                This isn't theory. This is happening right now.
            </p>

            <div className="impact-grid">
                <div className="impact-card">
                    <div className="impact-icon"><i className="fas fa-sack-dollar"></i></div>
                    <div className="impact-number">30%</div>
                    <div className="impact-label">Overpayment Discovered</div>
                    <p style={{marginTop: '20px'}}>
                        PBGH study: Employers paying 30% more than peers for identical care. That's $5,000+ per family per year.
                    </p>
                </div>
                <div className="impact-card">
                    <div className="impact-icon"><i className="fas fa-users"></i></div>
                    <div className="impact-number">160M</div>
                    <div className="impact-label">Americans in Self-Insured Plans</div>
                    <p style={{marginTop: '20px'}}>
                        Half of America gets healthcare through employer plans. If every employer used transparency: billions saved, millions helped.
                    </p>
                </div>
                <div className="impact-card">
                    <div className="impact-icon"><i className="fas fa-heart-pulse"></i></div>
                    <div className="impact-number">Lives</div>
                    <div className="impact-label">What Really Matters</div>
                    <p style={{marginTop: '20px'}}>
                        When healthcare is affordable, people don't delay treatment. Early detection saves lives. Period.
                    </p>
                </div>
            </div>

            <div className="story-panel">
                <h3>Democratizing Healthcare Price Transparency</h3>
                <p>
                    Payerset delivers the right data, at the right time, to everyone who can use it for good—from employers to researchers to patients.
                </p>
                <p>
                    Federal law now requires price transparency. But the data is a mess—trillions of rows, phantom rates, duplicate entries, irrelevant billing codes. Payerset cleans it, curates it, makes it comprehensive and actionable.
                </p>
                <p>
                    We empower employers to see what they're actually paying. Help insurers monitor network adequacy. Enable researchers to discover insights. Give patients the tools to make informed choices.
                </p>
                <p>
                    When someone doesn't know how to act on transparency, we build the tools and insights to ensure everyone benefits through fair prices and better care.
                </p>
                <p style={{fontSize: '24px', fontWeight: 600, marginTop: '32px', textAlign: 'center'}}>
                    Every line of code helps create a functioning healthcare market.
                </p>
                <p style={{fontSize: '21px', marginTop: '24px', textAlign: 'center', color: '#6B7281'}}>
                    That's not software. That's democratization.
                </p>
                <div className="cta-container">
                    <a href="https://payerset.com" className="cta-button" target="_blank" rel="noopener noreferrer">Explore Payerset</a>
                    <a href="#hero" className="cta-button-secondary">Back to Top</a>
                </div>
            </div>
        </section>
    );
};

//================================================
// Component: Footer
//================================================
const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <div className="footer-logo">Payerset</div>
                    <p>
                        Democratizing healthcare price transparency by cleaning and connecting federal transparency data.
                    </p>
                    <p>
                        Making healthcare affordable, one data point at a time.
                    </p>
                </div>
                <div className="footer-section">
                    <h3>Learn More</h3>
                    <div className="footer-links">
                        <a href="#problem" className="footer-link">The Problem</a>
                        <a href="#cuban" className="footer-link">Cuban's Questions</a>
                        <a href="#proof" className="footer-link">The Proof</a>
                        <a href="#solution" className="footer-link">Our Solution</a>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>Resources</h3>
                    <div className="footer-links">
                        <a href="https://payerset.com" className="footer-link" target="_blank" rel="noopener noreferrer">Payerset.com</a>
                        <a href="use-cases.html" className="footer-link">Use Case Catalog</a>
                        <a href="#quality" className="footer-link">Quality Metrics</a>
                        <a href="#impact" className="footer-link">Real Impact</a>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>Take Action</h3>
                    <div className="footer-links">
                        <a href="use-cases.html" className="footer-link">
                            <i className="fas fa-lightbulb"></i> Browse Use Cases
                        </a>
                        <a href="experiments/patients/search.html" className="footer-link">
                            <i className="fas fa-magnifying-glass"></i> Search Procedure Prices
                        </a>
                        <a href="experiments/employers/benchmark.html" className="footer-link">
                            <i className="fas fa-chart-line"></i> Benchmark Your Rates
                        </a>
                        <a href="experiments/employers/spread-calculator.html" className="footer-link">
                            <i className="fas fa-calculator"></i> Detect Spread Pricing
                        </a>
                        <a href="experiments/providers/market-intel.html" className="footer-link">
                            <i className="fas fa-hospital"></i> Provider Market Intel
                        </a>
                        <a href="experiments/learn/stakeholder-map.html" className="footer-link">
                            <i className="fas fa-graduation-cap"></i> Stakeholder Map
                        </a>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>Data Sources</h3>
                    <div className="footer-links">
                        <a href="https://www.leapfroggroup.org/" className="footer-link" target="_blank" rel="noopener noreferrer">
                            <i className="fas fa-shield-halved"></i> Leapfrog Safety Grades
                        </a>
                        <a href="#proof" className="footer-link">
                            <i className="fas fa-chart-bar"></i> PBGH Transparency Study
                        </a>
                        <a href="#" className="footer-link">
                            <i className="fas fa-file-invoice"></i> Claims Data
                        </a>
                        <a href="#" className="footer-link">
                            <i className="fas fa-server"></i> Machine-Readable Files
                        </a>
                        <a href="#comparison" className="footer-link">
                            <i className="fas fa-building"></i> 32BJ Case Study
                        </a>
                    </div>
                </div>
                <div className="footer-section">
                    <h3>The Mission</h3>
                    <div className="footer-links">
                        <p style={{fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)'}}>
                            "Democratizing healthcare price transparency"
                        </p>
                        <p style={{fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '12px'}}>
                            "You can't fix what you can't see." — Cora Opsahl
                        </p>
                        <p style={{fontSize: '15px', lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '12px'}}>
                            "Back to 1955, where you can pay with cash, card, or a chicken." — Mark Cuban
                        </p>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div>&copy; 2024 Payerset. Built with transparency in mind.</div>
                <div>Empowering 160M Americans through data.</div>
            </div>
        </footer>
    );
};


//================================================
// Component: App (The Main Application)
// This component holds the "stage" state and
// assembles all the other components.
//================================================
const App = () => {
    // 'stage' controls which visualization is active
    const [stage, setStage] = useState('intro');

    // Enable scroll animations
    useScrollAnimation();

    return (
        <div className="app">
            <Navigation />
            <Hero />
            <ProblemSection />
            <CubanQuestionsSection />
            <PBGHProofSection />
            <QualityMetricsSection />
            <TransformationSection stage={stage} setStage={setStage} />
            <ComparisonSection />
            <ImpactSection />
            <Footer />
        </div>
    );
};


//================================================
// Mount the App to the DOM
//================================================
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);
