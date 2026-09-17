import { Link } from "react-router-dom";

import "./App.css";

function App() {
    return (
        <main className="landing-page">
            <header className="landing-header">
                <div className="landing-brand">
                    <div className="landing-brand__name">
                        Enterprise Knowledge Platform
                    </div>

                    <div className="landing-brand__tagline">
                        Secure organizational knowledge
                    </div>
                </div>

                <Link
                    to="/login"
                    className="landing-header__link"
                >
                    Sign in
                </Link>
            </header>

            <section className="landing-hero">
                <div className="landing-hero__content">
                    <span className="landing-hero__eyebrow">
                        AI-powered knowledge platform
                    </span>

                    <h1>
                        Find answers across your
                        organization&apos;s knowledge.
                    </h1>

                    <p>
                        Search your organization&apos;s documents,
                        ask questions in natural language, and get
                        answers grounded in the knowledge you have
                        access to.
                    </p>

                    <div className="landing-hero__actions">
                        <Link
                            to="/login"
                            className="landing-button landing-button--primary"
                        >
                            Sign in to continue
                        </Link>
                    </div>
                </div>

                <div className="landing-hero__panel">
                    <div className="landing-hero__panel-header">
                        <span>Knowledge access</span>

                        <span className="landing-status">
                            Available
                        </span>
                    </div>

                    <div className="landing-feature">
                        <div className="landing-feature__icon">
                            Q
                        </div>

                        <div>
                            <strong>
                                Ask your documents
                            </strong>

                            <span>
                                Get natural-language answers
                                from your knowledge base.
                            </span>
                        </div>
                    </div>

                    <div className="landing-feature">
                        <div className="landing-feature__icon">
                            S
                        </div>

                        <div>
                            <strong>
                                Search with context
                            </strong>

                            <span>
                                Find relevant information across
                                accessible documents.
                            </span>
                        </div>
                    </div>

                    <div className="landing-feature">
                        <div className="landing-feature__icon">
                            R
                        </div>

                        <div>
                            <strong>
                                Role-based access
                            </strong>

                            <span>
                                Access knowledge according to your
                                organization&apos;s permissions.
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="landing-footer">
                <span>
                    Secure access to organizational knowledge
                </span>

                <span>
                    Enterprise Knowledge Platform
                </span>
            </footer>
        </main>
    );
}

export default App;