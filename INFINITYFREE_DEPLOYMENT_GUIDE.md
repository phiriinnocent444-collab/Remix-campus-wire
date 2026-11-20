# InfinityFree Full-Stack Hosting & Database Guide for ZedWhisper

Everything is pre-configured for Apache + PHP 8.2 with automatic SQLite storage and optional InfinityFree MySQL database integration—including **Campus Buzz**, **ZedWhisper Cinema**, **ZedStore**, **Polls**, and **Dev Lab (SQL Studio & REST API Explorer)**.

---

## Step 1: Activate Your InfinityFree Account & Subdomain

1. Go to **[dash.infinityfree.com](https://dash.infinityfree.com/)** and sign in (or register) using **`phiriinnocent444@gmail.com`**.
2. Open your Gmail inbox and click the **Verify Email Address** link from InfinityFree.
3. Inside the InfinityFree Client Area, click **Create Account** -> select the **Free** plan.
4. Pick any free InfinityFree subdomain (for example: `zedwhisper.infinityfreeapp.com`, `zedwhisperzm.epizy.com`, or `zedcampus.great-site.net`) and click **Check Availability** -> **Create Account**.
5. Wait ~1–2 minutes until your hosting account status changes from *Pending* to **Active**.

---

## Step 2: Choose Your Database Mode

### Option A: Zero-Setup Auto Database (Recommended)
- **No action needed!** When the site receives its first request, `api/db.php` automatically creates and seeds a protected SQLite database at `api/data/campus.db` (protected by `api/data/.htaccess` so it cannot be downloaded publicly).
- All tables (`users`, `posts`, `comments`, `polls`, `poll_options`) and starter campus records are created automatically.

### Option B: InfinityFree VistaPanel MySQL Database
If you want to connect InfinityFree's MySQL server instead:
1. In your InfinityFree Account overview, click **Control Panel (VistaPanel)**.
2. Open **MySQL Databases** -> type a database name (e.g. `zedwhisper`) -> click **Create Database**.
3. Note your VistaPanel credentials:
   - **MySQL Host** (e.g. `sql102.infinityfree.com`)
   - **Database Name** (e.g. `if0_12345678_zedwhisper`)
   - **Username** (e.g. `if0_12345678`)
   - **Password** (your hosting account password from Client Area -> **Account Details**)
4. Open `api/config.php` in your uploaded files and replace the placeholder `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASS` values. `api/db.php` will automatically create and seed all MySQL tables on first visit (or you can import `api/schema.sql` in phpMyAdmin).

---

## Step 3: Upload the Production Package to `htdocs/`

1. In your InfinityFree Account overview, click **File Manager** (Monsta File Manager) or connect via **FileZilla FTP** using the FTP Host, Username, and Password shown in your Account Details.
2. Open the **`htdocs/`** folder.
3. Delete any default placeholder files inside `htdocs/` (such as `index2.html` or `DO NOT UPLOAD FILES HERE`).
4. Upload the freshly compiled contents from `public/infinityfree-htdocs.zip` (or the `dist/` build output) directly into **`htdocs/`** so the folder layout looks like this:
   - `htdocs/.htaccess`
   - `htdocs/index.html`
   - `htdocs/assets/`
   - `htdocs/api/` (`auth.php`, `config.php`, `db.php`, `dev.php`, `health.php`, `polls.php`, `posts.php`, `schema.sql`, `data/.htaccess`)

> **Important:** Make sure `.htaccess` and `index.html` sit directly inside `htdocs/`, not nested inside an extra subfolder.

---

## Step 4: Activate Free SSL & Verify Live Site

1. In the InfinityFree Client Area, open **Free SSL Certificates** -> **New SSL Certificate**.
2. Enter your InfinityFree domain (e.g. `zedwhisper.infinityfreeapp.com`), choose **Let's Encrypt** or **ZeroSSL**, add the CNAME record automatically (1 click for InfinityFree subdomains), and click **Install SSL Certificate Automatically** once issued.
3. Open your live site at `https://<your-subdomain>.infinityfreeapp.com`.
4. Visit `https://<your-subdomain>.infinityfreeapp.com/api/health` to confirm:
   - `"status": "online"`
   - `"fullStack": true`
   - Active database driver (`MySQL` or `SQLite Auto-Engine`).
