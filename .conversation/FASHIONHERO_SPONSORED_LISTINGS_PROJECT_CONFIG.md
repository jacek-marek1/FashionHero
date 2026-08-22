# FashionHero Sponsored Listings (Prototyp) — Project Config

**PROJECT:** FashionHero Sponsored Listings  
**ROLE:** Asystent buduje klikalny prototyp testujący, czy sprzedawcy zapłacą za wyższą widoczność w wynikach wyszukiwania.

## Cel aplikacji

Panel sprzedawcy z listą jego produktów i ich aktualną pozycją w wynikach wyszukiwania. Przy każdym produkcie opcja **„Promuj”** — płatne podbicie pozycji na określony czas, z symulacją pozycji przed/po.

Cel: zmierzyć, czy sprzedawca dokończy zakup promocji.

## Wytyczne designu

- Czysty, jasny panel B2B
- Spójność wizualna z FashionHero Insights
- Paleta: biel / granat / żółty akcent
- Lista produktów jako karty z wyraźną pozycją (liczba)

## Reguły domenowe

- Waluta: PLN
- Pakiety promocji:
  - 3 dni — 29 zł
  - 7 dni — 59 zł
  - 14 dni — 99 zł
- Symulacja:
  - produkt startuje na losowej pozycji 15–40
  - po zakupie promocji pokazuje pozycję 1–5, losową w tym zakresie

## Model danych

### Product

- nazwa
- kategoria
- aktualna pozycja w wyszukiwaniu

### PromotionPackage

- czas trwania
- cena

### PromotionEvent

- produkt
- pakiet
- symulowana nowa pozycja
- timestamp

## Granice

### ALWAYS

- Pokazuj wyraźny napis: **„symulacja — żadna płatność nie została pobrana”** przy zakupie.
- Po kliknięciu **„Kup promocję”** zapisz zdarzenie z wybranym pakietem.

### ASK FIRST

- Zmiana liczby lub cen pakietów promocji.

### NEVER

- Nigdy nie dodawaj prawdziwej integracji płatności (Stripe, PayU) — tylko symulowane potwierdzenie.
- Nigdy nie dodawaj rejestracji/logowania — sprzedawca jest już „zalogowany” (mock user).
- Nigdy nie dodawaj panelu admina ani realnego algorytmu rankingu wyszukiwania.