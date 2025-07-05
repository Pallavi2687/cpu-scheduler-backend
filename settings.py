"""
Django settings for cpu‑scheduler backend (Render deployment)
"""
import os
from dotenv import load_dotenv
from pathlib import Path
from decouple import config, Csv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# ───────────────────────────────────────────────────────────────── SECURITY ────
SECRET_KEY  = config("DJANGO_SECRET_KEY")
DEBUG       = config("DJANGO_DEBUG", default=False, cast=bool)

print(f"dusra: {SECRET_KEY }")

ALLOWED_HOSTS = config(
    "DJANGO_ALLOWED_HOSTS",
    default="cpu-scheduler-backend.onrender.com,127.0.0.1,localhost",
    cast=Csv()
)

# ────────────────────────────────────────────── APPS ───
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",          # ← added
    "schedule",
]

# ────────────────────────────────────────── MIDDLEWARE ───
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  
     "django.middleware.common.CommonMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"

# ─────────────────────────────────────────── DATABASE ───
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# ────────────────────────────────────── INTERNATIONALISATION ───
LANGUAGE_CODE = "en-us"
TIME_ZONE     = "UTC"
USE_I18N      = True
USE_TZ        = True

# ───────────────────────────────────────── STATIC FILES ───
STATIC_URL  = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ───────────────────────────────────────────── CORS ───
# 1. Production front‑end URL
# 2. ANY Vercel preview build that begins with 'cpu-scheduler-fron-…'
## ──────────────── CORS + CSRF for both local & production ────────────────
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
     os.getenv("CORS_ALLOWED_ORIGINS"),
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
     os.getenv("CORS_ALLOWED_ORIGINS"),

]
CORS_ALLOW_CREDENTIALS = True

print("🧪 DEBUG CORS:")
print("CORS_ALLOWED_ORIGINS:", CORS_ALLOWED_ORIGINS)
print("CORS_ALLOW_CREDENTIALS:", CORS_ALLOW_CREDENTIALS)
print("INSTALLED_APPS:", INSTALLED_APPS)
print("MIDDLEWARE:", MIDDLEWARE)
