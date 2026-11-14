## Moduł 4: Logowanie i Monitoring w Chmurze

W chmurze granica sieciowa (perymetr) ulega rozmyciu, a tożsamość staje się nową płaszczyzną ataku. Kluczem jest zrozumienie, jak powiązać logi aktywności użytkowników z logami zasobów.

### 1. Ekosystem Microsoft Azure i Entra ID

W Azure fundamentem jest widoczność tego, kto i co robi wewnątrz subskrypcji.

- **Logi Entra ID (dawniej Azure AD):** Najważniejsze źródło prawdy o tożsamości.
    - **Sign-in logs:** Informacje o tym, kto próbował się zalogować, z jakiej lokalizacji i czy użył MFA.
    - **Audit logs:** Ślady zmian w konfiguracji (np. dodanie nowego administratora globalnego).
- **NSG Flow Logs:** Odpowiednik NetFlow w Azure – pozwala śledzić ruch sieciowy przechodzący przez sieciowe grupy zabezpieczeń.
- **Azure Monitor i AMA:** Nowoczesny agent (Azure Monitoring Agent) oraz zasady zbierania danych (DCR), które pozwalają precyzyjnie definiować, jakie dane mają trafiać do SIEM, co optymalizuje koszty.

---

### 2. Microsoft Sentinel i Język KQL

Sentinel to natywny dla chmury system SIEM/SOAR. Jego sercem jest język zapytań **KQL (Kusto Query Language)**.

- **KQL:** Język zoptymalizowany pod kątem szybkości przeszukiwania miliardów rekordów. Kluczowe operatory to `where`, `summarize`, `join` oraz `project`.
- **ASIM (Advanced Security Information Model):** Standard normalizacji danych w Sentinel, który pozwala pisać reguły detekcji niezależne od dostawcy logów (np. jedna reguła dla logów DNS z Windows i Cisco).
- **Playbooki:** Automatyzacja odpowiedzi na incydenty przy użyciu Azure Logic Apps (np. automatyczne blokowanie użytkownika po wykryciu ataku).

---

### 3. Rodzina Microsoft Defender i Copilot

Systemy klasy XDR (Extended Detection and Response) integrują się bezpośrednio z chmurą.
- **Defender for Cloud:** Monitoruje stan bezpieczeństwa (CSPM) oraz chroni obciążenia robocze (CWPP) takie jak kontenery czy bazy danych SQL.
- **Copilot for Security:** Wykorzystanie AI do przyspieszenia analizy incydentów, generowania zapytań KQL na podstawie języka naturalnego i podsumowywania złożonych alertów.
- **Graph Security API:** Potężne narzędzie do programistycznego wyciągania alertów z całego ekosystemu Microsoftu.

---

### 4. AWS Cloud Logging

W AWS nacisk kładziony jest na śledzenie wywołań API i przepływów danych między usługami.
- **CloudTrail:** "Czarna skrzynka" AWS. Rejestruje każde wywołanie API – kto, kiedy i skąd próbował np. usunąć bucket S3 lub zmienić uprawnienia IAM.
- **CloudWatch:** Centrum monitoringu wydajności i logów aplikacji.
- **GuardDuty:** Inteligentna usługa wykrywania zagrożeń, która analizuje CloudTrail i VPC Flow Logs pod kątem anomalii (np. kopanie kryptowalut na instancjach EC2).
- **VPC Flow Logs:** Rejestracja ruchu IP wewnątrz sieci wirtualnej AWS.

---

### Podsumowanie Labów (Praktyka)

1. **Unauthorized Access to Sensitive Data:** Wykorzystanie logów CloudTrail/Azure Activity do wykrycia prób nieautoryzowanego dostępu do magazynów danych (S3/Blob Storage).
2. **Sentinel i KQL:** Pisanie zaawansowanych zapytań wykrywających np. _Impossible Travel_ (logowanie użytkownika z dwóch odległych lokalizacji w krótkim czasie).
3. **Configuring CloudWatch:** Konfiguracja alarmów na podstawie specyficznych wzorców w logach aplikacji AWS.
4. **Defender for Cloud:** Symulacja ataku na maszynę wirtualną i analiza alertów w konsoli Defender.