========================================================================
ZedWhisper Zambia - InfinityFree Full-Stack Production Package
========================================================================

This package is pre-configured for InfinityFree Apache + PHP 8.2.
It includes the compiled React Single-Page Application and the complete
PHP REST API with automatic database initialization and seeding.

QUICK SETUP STEPS:
------------------
1. Sign in to InfinityFree (https://dash.infinityfree.com) with your account
   and create an Active hosting account + free subdomain.
2. Open "File Manager" (Monsta File Manager) or FileZilla FTP and open `htdocs/`.
3. Delete default placeholder files inside `htdocs/` (e.g., index2.html).
4. Upload all files from this bundle directly into `htdocs/` so that
   `.htaccess`, `index.html`, `assets/`, and `api/` sit inside `htdocs/`.
5. Enable Free SSL in the InfinityFree dashboard for HTTPS access.

DATABASE CONFIGURATION:
-----------------------
- ZERO-CONFIG SQLITE (Default):
  On first request, api/db.php automatically creates and seeds
  api/data/campus.db (protected from public HTTP access by api/data/.htaccess).

- INFINITYFREE MYSQL (Optional):
  Create a MySQL database in VistaPanel, then update DB_HOST, DB_NAME,
  DB_USER, and DB_PASS inside `api/config.php`. Tables are auto-created
  on first request (or import `api/schema.sql` via phpMyAdmin).

INCLUDED API ROUTES (.htaccess):
--------------------------------
- GET  /api/health               -> Runtime & active DB diagnostics
- POST /api/auth/register        -> Student registration
- POST /api/auth/login           -> Student login
- GET  /api/auth/me              -> Current student session
- GET  /api/posts                -> Fetch campus posts & comments
- POST /api/posts                -> Publish new campus whisper/news
- POST /api/posts/{id}/vote      -> Upvote / downvote
- POST /api/posts/{id}/comments  -> Post a peer comment
- GET  /api/polls                -> Fetch active university polls
- POST /api/polls/{id}/vote      -> Cast poll vote
- GET  /api/dev/schema           -> Dev Lab database schema explorer
- POST /api/dev/sql              -> Dev Lab read-only SQL sandbox
- GET  /api/dev/endpoints        -> Dev Lab REST API catalog
========================================================================
