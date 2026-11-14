## Moduł 5: Zaawansowane Alertowanie, Analiza Post-Mortem i Finałowy Projekt

W ostatnim module przechodzimy od zbierania danych do **operacjonalizacji detekcji**. Skupiamy się na tym, jak sprawić, by system nie tylko widział ataki, ale informował o nich w sposób inteligentny i zautomatyzowany.

### 1. Zaawansowane Alertowanie i Standard Sigma

Kluczem do nowoczesnej detekcji jest współdzielenie wiedzy. Zamiast pisać reguły tylko dla jednego systemu (np. tylko dla Splunk), stosujemy standardy uniwersalne.

- **Reguły Sigma:** To otwarty standard zapisu reguł detekcji, który można "przetłumaczyć" na dowolny język (KQL, Splunk SPL, Elastic). Pozwala to na korzystanie z globalnej bazy wiedzy o zagrożeniach.
- **Strojenie (Tuning):** Proces redukcji _False Positives_ poprzez precyzyjne definiowanie progów (thresholds) i wyjątków. Dobry alert to taki, który jest "actionable" – analityk wie dokładnie, co ma z nim zrobić.

---

### 2. Automatyzacja: Detection Engineering Pipeline

Nowoczesne zespoły SOC (Security Operations Center) traktują reguły detekcji jak kod oprogramowania.

- **Podejście "Detection as Code":** Wykorzystanie systemów kontroli wersji (np. Git) do przechowywania reguł.
- **CI/CD w Detekcji:** Automatyczny proces, w którym nowa reguła jest testowana w laboratorium, sprawdzana pod kątem błędów składniowych, a następnie automatycznie wdrażana do systemów produkcyjnych.
- **Rola LLM (Large Language Models):** Wykorzystanie sztucznej inteligencji do asystowania w pisaniu skomplikowanych zapytań, wyjaśniania logów oraz generowania dokumentacji dla analityków.

---

### 3. Analiza Post-Mortem (Po Incydencie)

Zrozumienie, co się stało po zakończeniu incydentu, jest kluczowe dla wzmocnienia obrony.

- **Re-analiza ruchu:** Powrót do zapisanych przepływów (NetFlow) i logów, aby sprawdzić, jak długo intruz był w sieci (Dwell Time).
- **Wzbogacanie o Threat Intelligence:** Wykorzystanie narzędzi takich jak **VirusTotal** do skanowania próbek malware znalezionych podczas incydentu i identyfikacji powiązanych adresów C2.
- **Feedback Loop:** Każdy incydent musi kończyć się aktualizacją reguł detekcji, aby ten sam atak nie mógł zostać powtórzony.

---

### 4. Capstone: Wyzwanie Defend-the-Flag

Kurs kończy się praktycznymi zawodami, które sprawdzają umiejętności z całego tygodnia.

- **Misje:** Twoim zadaniem będzie przejście przez pełny cykl obronny:
    1. Zbudowanie architektury logowania.
    2. Analiza logów systemowych i sieciowych pod presją czasu.
    3. Tworzenie dashboardów wizualizujących ataki w czasie rzeczywistym.
    4. Aktywna obrona przed "żywym" przeciwnikiem lub symulowanym atakiem.

---

### Podsumowanie Labów (Praktyka)

1. **Sigma Coverage:** Mapowanie logów Twojej firmy na reguły Sigma, aby zidentyfikować, na jakie techniki ataku jesteś obecnie ślepy.
2. **VirusTotal Integration:** Automatyzacja sprawdzania hashy plików z logów punktów końcowych w celu szybkiej triady (rozpoznania) złośliwego oprogramowania.
3. **Tworzenie Pipeline'u:** Konfiguracja prostego przepływu pracy, który automatyzuje testowanie nowej reguły detekcji przed jej wdrożeniem.