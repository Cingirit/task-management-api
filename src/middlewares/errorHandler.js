function notFound(req, res, next) {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
    if (res.headersSent) return next(err);

    const status = err.status || err.statusCode || 500;
    const message = status === 400 && err.type === "entity.parse.failed"
        ? "Request body contains invalid JSON"
        : status >= 500
            ? "Internal server error"
            : err.message || "Request failed";

    res.status(status).json({ error: message });
}

module.exports = { notFound, errorHandler };
