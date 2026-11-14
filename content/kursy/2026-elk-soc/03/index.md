## Moduł 3: Profilowanie Środowiska (Baselining) i UEBA

Podstawą skutecznej detekcji nie są tylko sygnatury znanych wirusów, ale przede wszystkim identyfikacja anomalii. Jeśli nie wiesz, jakie urządzenia masz w sieci, nie zauważysz tego obcego.

### 1. Inwentaryzacja Zasobów (Asset Discovery)

Utrzymanie aktualnej listy sprzętu i oprogramowania to jedno z największych wyzwań w cyberbezpieczeństwie.

- **Metody aktywne:** Skanery podatności (np. Nessus, OpenVAS) i systemy NAC (Network Access Control), które aktywnie „pytają” urządzenia o ich tożsamość.
- **Metody pasywne:** Analiza ruchu sieciowego (NetFlow) oraz logów serwerów **DHCP**. To podejście pozwala wykryć urządzenia, które próbują pozostać w cieniu (nie odpowiadają na skany).
- **Master Inventory:** Łączenie danych z wielu źródeł (np. Active Directory + DHCP + EDR), aby stworzyć jedno, wiarygodne źródło prawdy o stanie sieci.

---

### 2. Monitorowanie Aplikacji i Skryptów

Napastnicy rzadko instalują własne programy – wolą używać narzędzi systemowych (technika _Living off the Land_).

- **Logowanie PowerShell:** Kluczowe dla wykrywania nowoczesnych ataków. Monitorujemy:
    - **Module Logging:** Jakie moduły zostały załadowane.
    - **Script Block Logging:** Pełna treść wykonanego skryptu (nawet jeśli był zaciemniony/obfuscated).
- **Long Tail Analysis:** Metoda statystyczna polegająca na szukaniu procesów lub aplikacji, które występują najrzadziej w całej organizacji. Unikalny proces na jednym komputerze z 1000 to często oznaka infekcji.

---

### 3. Traffic Monitoring (Analiza Ruchu)

Zamiast analizować każdy pakiet (co jest kosztowne), skupiamy się na metadanych ruchu, czyli przepływach (Flows).

- **NetFlow vs sFlow:** Zrozumienie, kiedy analizować pełne statystyki sesji (NetFlow), a kiedy wystarczy próbkowanie (sFlow).
- **Wykrywanie C2 (Command & Control):**
    - **Beaconing:** Szukanie regularnych, powtarzalnych połączeń wychodzących o stałych odstępach czasu (znak rozpoznawczy narzędzi takich jak Cobalt Strike).
    - **Rozmiary transferów:** Nagły wzrost wysyłanych danych (egzfiltracja) przy zachowaniu standardowych portów (np. 443).

---

### 4. UEBA – Zachowanie Użytkowników

UEBA (User and Entity Behavior Analytics) przesuwa ciężar detekcji z „co się dzieje” na „kto to robi i czy to do niego pasuje”.

- **Wzorce aktywności:** Tworzenie profilu dla każdego użytkownika (godziny pracy, typowe lokalizacje logowania, serwery, do których uzyskuje dostęp).
- **Anomalie behawioralne:** Jeśli administrator baz danych nagle zaczyna logować się o 3:00 nad ranem z nowego adresu IP i przegląda pliki kadrowe, system UEBA podniesie alarm, nawet jeśli użyto poprawnych poświadczeń.

---

### Podsumowanie Labów (Praktyka)

1. **Threat Hunting na danych inwentarzowych:** Wykorzystanie zebranych list zasobów do znalezienia „niechcianych gości” w sieci.
2. **Detekcja Cobalt Strike:** Analiza logów sieciowych w celu namierzenia charakterystycznego rytmu „bicia serca” (beaconing) komunikacji z serwerem atakującego.
3. **Ataki na poświadczenia w Linux:** Wykrywanie prób przejęcia kont (np. brute force na SSH) oraz nietypowego użycia komendy `sudo`.
4. **Malicious PowerShell:** Analiza logów Script Block w celu odkodowania złośliwych poleceń zakodowanych w Base64.