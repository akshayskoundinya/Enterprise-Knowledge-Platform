import { Link } from "react-router-dom";

import "./NotFoundPage.css";

function NotFoundPage() {
    return (
        <main className="not-found-page">
            <div className="not-found-card">
                <span className="not-found-code">
                    404
                </span>

                <h1>Page not found</h1>

                <p>
                    The page you are looking for doesn't exist
                    or may have been moved.
                </p>

                <div className="not-found-actions">
                    <Link
                        to="/"
                        className="button button--primary"
                    >
                        Go to home
                    </Link>
                </div>
            </div>
        </main>
    );
}

export default NotFoundPage;