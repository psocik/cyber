# **Analityka Sieciowa i Punktów Końcowych (Endpoints)

W tym module skupiamy się na dwóch głównych filarach widoczności: ruchu sieciowym (Network) oraz zdarzeniach systemowych (Endpoint).

### 1. Analityka Sieciowa: Kluczowe Protokoły

Większość ataków pozostawia ślad w protokołach bazowych. Skuteczna detekcja opiera się na analizie:

- **DNS (Domain Name System):**
    - **DGA (Domain Generation Algorithms):** Wykrywanie losowo generowanych domen używanych przez malware do komunikacji z serwerem C2.
    - **DNS Tunneling:** Identyfikacja prób eksfiltracji danych poprzez zapytania DNS.
    - **Fast Flux:** Wykrywanie techniki, w której jedna domena szybko zmienia powiązane adresy IP, aby ukryć infrastrukturę atakującego.
- **HTTP/HTTPS:**
    - **User-Agent Analysis:** Szukanie nietypowych klientów (np. skryptów Python, narzędzi takich jak `curl` czy `PowerShell` w miejscach, gdzie powinna być przeglądarka).
    - **Certyfikaty:** Wykrywanie podejrzanych, samopodpisanych lub nowo wystawionych certyfikatów SSL/TLS.
- **SMTP:**
    - **Phishing:** Wykorzystanie "fuzzy matching" do wykrywania domen łudząco podobnych do firmowych (np. `g00gle.com` zamiast `google.com`).

---

### 2. Analityka Punktów Końcowych (Windows)

Endpointy to miejsce, gdzie napastnik wykonuje swoje główne zadania (tzw. post-compromise). Standardowe logi Windows często nie wystarczają, dlatego kluczowe jest rozszerzenie widoczności.

- **Sysmon (System Monitor):** Niezbędne narzędzie Microsoftu, które loguje:
    - Tworzenie procesów (Process Creation - Event ID 1).
    - Nawiązania połączeń sieciowych przez procesy (Event ID 3).
    - Zmiany w rejestrze i tworzenie plików.
- **Zaawansowane Polityki Audytu:** Konfiguracja GPO (Group Policy), aby wymusić logowanie zdarzeń takich jak użycie uprawnień specjalnych czy manipulacja kontami.
- **Typy Logowania (Login Types):** Rozróżnianie logowania interaktywnego (Type 2 - lokalne) od sieciowego (Type 3 - np. przez SMB/RDP), co pozwala wykryć ataki typu **Lateral Movement**.

---

### 3. Analityka Punktów Końcowych (Linux)

Systemy Linux opierają się na standardzie Syslog, ale wymagają dodatkowych narzędzi do głębokiej analityki.

- **auditd (Linux Audit Framework):** Potężny podsystem śledzący wywołania systemowe (syscalls). Pozwala monitorować:
    - Kto modyfikował pliki wrażliwe (np. `/etc/passwd`).
    - Jakie komendy zostały wykonane z uprawnieniami roota.
- **Logi systemowe:** Zrozumienie różnic między `rsyslog` a `syslog-ng` oraz analiza plików w `/var/log/` (auth.log, syslog).

---

### 4. Zapory Hostowe i Zdarzenia Logowania

Ostatnia linia obrony na samym urządzeniu.

- **Firewalle:** Porównanie **iptables/nftables** (Linux) z **Windows Firewall**. Analiza logów zablokowanych połączeń może wskazywać na zainfekowany proces próbujący "wydostać się" z sieci (Beaconing).
- **Failed Logins:** Analiza nieudanych prób logowania pod kątem ataków typu _Brute Force_ lub _Password Spraying_.

---

### Podsumowanie Labów (Praktyka)

	1. **Badanie logów DNS:** Wyszukiwanie anomalii w ruchu DNS przy użyciu filtrów i statystyk (np. długość zapytania, nietypowe rekordy TXT).
1. **Dochodzenie w Windows Logs:** Wykorzystanie Event Viewera i PowerShella do odtworzenia ścieżki ataku (np. od uruchomienia makra w Wordzie do pobrania payloadu).
2. **Konfiguracja auditd:** Ustawienie reguł monitorujących dostęp do krytycznych katalogów systemowych na Linuxie.