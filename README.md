# Hravé čtení

Interaktivní webová aplikace pro výuku a procvičování čtení pro děti. Aplikace zobrazuje slova a pomocí rozpoznávání hlasu (Web Speech API) kontroluje správnou výslovnost.

## Funkce

- **Výběr písmen**: Rodič může vybrat konkrétní písmena, která chce dítě procvičovat.
- **Nastavení**:
  - Volba velikosti písma.
  - Přepínání mezi velkými (UPPERCASE) a malými písmeny.
  - Nastavení počtu slov ve hře.
- **Hra**:
  - Zobrazení slova.
  - Rozpoznávání hlasu pro kontrolu přečtení.
  - Možnost slovo přeskočit (aplikace ho přečte nahlas).
  - Vizuální a zvuková zpětná vazba (konfety, pochvala).
- **Vyhodnocení**:
  - Přehled úspěšnosti.
  - Seznam chyb.
  - Čas strávený čtením u jednotlivých slov.

## Technologie

- React + TypeScript
- Vite
- Web Speech API (Speech Recognition & Synthesis)
- Lucide React (ikony)
- Canvas Confetti

## Spuštění

1. Nainstalujte závislosti:
   ```bash
   npm install
   ```

2. Spusťte vývojový server:
   ```bash
   npm run dev
   ```

3. Otevřete v prohlížeči (obvykle http://localhost:5173).

## Poznámka k prohlížečům

Aplikace vyžaduje **Web Speech API**, které je nejlépe podporováno v prohlížečích **Google Chrome** nebo **Microsoft Edge**. V jiných prohlížečích nemusí rozpoznávání hlasu fungovat korektně.

