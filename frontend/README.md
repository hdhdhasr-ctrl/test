# ZNNK Studio — Strona Internetowa Premium z Rezerwacją Online

Kompletny, nowoczesny projekt strony internetowej dla salonu fryzjerskiego **ZNNK Studio** o najwyższym standardzie wizualnym i technicznym. Aplikacja została zoptymalizowana pod kątem wydajności (szybkie ładowanie, lazy loading obrazów), responsywności (mobile & desktop) oraz bezproblemowej integracji z platformą **Netlify** (Serverless Functions) oraz systemem **AI Studio (Express + Vite)**.

---

## 🎨 Charakterystyka Wizualna i Funkcje

- **Styl Premium**: Kolorystyka oparta o głęboką czerń, ekskluzywną złamaną biel oraz szlachetne, metaliczne akcenty złota (`#cea35e`, `#dec18b`).
- **Typografia**: Połączenie luksusowego kroju szeryfowego *Cormorant Garamond* (nagłówki) oraz czytelnego bezszeryfowego *Inter* (tekst).
- **Interaktywny Cennik**: Filtrowanie usług w czasie rzeczywistym (strzyżenie, koloryzacja, stylizacja, pielęgnacja) wraz z czasem trwania zabiegów.
- **Kunsztowna Galeria**: Siatka zdjęć z lazy loadingiem oraz pełnowymiarowym podglądem w modalnym oknie (lightbox) z płynnymi przejściami.
- **Rezerwacja Online**: Formularz rezerwacyjny z zaawansowaną walidacją pól po stronie klienta (blokada terminów wstecz, poprawność telefonu/e-maila).
- **Zabezpieczony Backend**: Klucze API są przechowywane wyłącznie na serwerze i nigdy nie wyciekają do przeglądarki użytkownika.

---

## 📁 Struktura Projektu

```text
├── netlify/
│   └── functions/
│       └── rezerwacja.js      # Serverless function dla Netlify (wysyłka Resend)
├── src/
│   ├── assets/
│   │   └── images/            # Wygenerowane, profesjonalne zdjęcia salonu i prac
│   ├── components/            # Moduły interfejsu (jeśli wymagane wydzielenie)
│   ├── App.tsx                # Główny komponent strony (SPA)
│   ├── index.css              # Style Tailwind v4 i konfiguracja Google Fonts
│   ├── main.tsx               # Punkt wejścia React
│   └── types.ts               # Definicje typów TypeScript
├── .env.example               # Szablon zmiennych środowiskowych
├── index.html                 # Główny dokument HTML
├── metadata.json              # Metadane aplikacji AI Studio
├── netlify.toml               # Konfiguracja budowania i przekierowań na Netlify
├── package.json               # Skrypty i zależności
├── server.ts                  # Serwer Express (backend dla środowiska deweloperskiego)
├── tsconfig.json              # Konfiguracja TypeScript
└── vite.config.ts             # Konfiguracja kompilatora Vite
```

---

## ⚙️ Konfiguracja Zmiennych Środowiskowych

Aby wysyłanie e-maili z formularza rezerwacji działało prawidłowo, wymagane jest skonfigurowanie klucza API z portalu **Resend**:

1. Zarejestruj darmowe konto na [resend.com](https://resend.com).
2. Wygeneruj klucz API (**API Key**).
3. Skonfiguruj zmienną w zależności od środowiska:
   - **Lokalnie / AI Studio**: Dodaj do sekretów lub pliku `.env` zmienną:
     ```env
     RESEND_API_KEY="Twój_Klucz_Resend_API"
     ```
   - **Netlify**: Przejdź do zakładki *Site configuration -> Environment variables* i dodaj zmienną `RESEND_API_KEY`.

> 💡 **Uwaga**: W darmowym planie Resend bez zweryfikowanej własnej domeny, e-maile są wysyłane z domyślnego adresu `onboarding@resend.dev` i mogą być kierowane wyłącznie na Twój adres rejestracyjny (czyli `znnkstudio@gmail.com` lub powiązany).

---

## 🚀 Uruchomienie Lokalne (Development)

Wszystkie wymagane pakiety są już zainstalowane. Aby uruchomić aplikację w środowisku lokalnym wraz z backendem Express:

```bash
# Uruchomienie serwera deweloperskiego (Express + Vite na porcie 3000)
npm run dev
```

Otwórz w przeglądarce adres `http://localhost:3000`. Formularz rezerwacyjny będzie przesyłał dane bezpośrednio do lokalnego endpointu `/api/rezerwacja`, który symuluje działanie funkcji chmurowej Netlify.

---

## ☁️ Instrukcja Wdrożenia na Netlify

Projekt został w pełni przygotowany do natychmiastowego wdrożenia na Netlify w oparciu o dostarczony plik `netlify.toml`.

### Metoda 1: Import z GitHuba (Zalecana)
1. Wrzuć kod projektu do swojego prywatnego lub publicznego repozytorium na **GitHub / GitLab**.
2. Zaloguj się na [netlify.com](https://www.netlify.com) i kliknij **Add new site** -> **Import an existing project**.
3. Wybierz swoje repozytorium.
4. Netlify automatycznie zaczyta konfigurację z pliku `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
5. W sekcji **Environment variables** dodaj zmienną `RESEND_API_KEY` ze swoim kluczem.
6. Kliknij **Deploy site**. Gotowe!

### Metoda 2: Wdrożenie przez Netlify CLI (Ręczne)
Jeśli nie chcesz korzystać z GitHuba, możesz wdrożyć skompilowaną aplikację bezpośrednio ze swojego komputera:

1. Zainstaluj globalnie CLI: `npm install -g netlify-cli`
2. Zbuduj aplikację lokalnie: `npm run build`
3. Zaloguj się i wdróż: `netlify deploy --prod` (wskaż folder `dist` jako publish directory oraz `netlify/functions` dla funkcji).

---

## 🔄 Działanie Przekierowań (Redirects)

W pliku `netlify.toml` skonfigurowano regułę przekierowań:
```toml
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```
Dzięki temu kod w `/src/App.tsx` zawsze wysyła zapytania na jednolity adres `/api/rezerwacja`. Na serwerze deweloperskim obsługuje to bezpośrednio Express (`server.ts`), natomiast po wdrożeniu na Netlify, żądanie jest przezroczysto proxy-owane do bezserwerowej funkcji Netlify Functions bez problemów z CORS!
