# **Moduł 1: Architektura SIEM i Fundamenty ELK 9.x**

## Moduł 1: Inżynieria Detekcji i Architektura SIEM

Pierwsza sekcja kursu koncentruje się na przejściu od pasywnego gromadzenia logów do aktywnego budowania strategii wykrywania zagrożeń. Poniżej znajduje się zestawienie kluczowych zagadnień.

### 1. Fundamenty SIEM i Planowanie

Współczesne systemy SIEM (Security Information and Event Management) muszą radzić sobie z ogromnym wolumenem danych (EPS - Events Per Second). Kluczem do sukcesu nie jest zbieranie "wszystkiego", ale planowanie oparte na ryzyku.

- **Wyzwania branżowe:** Nadmiar fałszywych alarmów (alert fatigue), koszty przechowywania danych i brak widoczności w krytycznych obszarach.
- **Cykl Życia Inżynierii Detekcji:** To proces ciągły, obejmujący:
    1. Identyfikację zagrożeń (Threat Modeling).
    2. Pozyskiwanie odpowiednich telemetrii.
    3. Tworzenie i testowanie reguł detekcji.
    4. Strojenie (Tuning) w celu eliminacji szumu.

---

### 2. Architektura i Zbieranie Danych

Zrozumienie, jak logi trafiają z punktu A (host) do punktu B (SIEM), jest niezbędne dla zachowania integralności danych.

- **Metody zbierania logów:**
    - **Agentowe:** Instalacja oprogramowania (np. Winlogbeat, Splunk Forwarder) – pełna kontrola, mniejsze opóźnienia.
    - **Agentless:** Wykorzystanie natywnych protokołów (WMI, Syslog, SNMP) – łatwiejsze w utrzymaniu, ale bardziej obciążające sieć.
- **Agregacja i Kolejkowanie:** Zastosowanie **Message Brokerów** (np. Apache Kafka, RabbitMQ) pozwala na buforowanie danych, zapobiegając utracie logów podczas nagłych skoków ruchu.


---

### 3. Budowa Laboratorium Detekcji (Detection Lab)

Praktyka wymaga bezpiecznego środowiska do testowania ataków i sprawdzania, czy generują one odpowiednie logi.

- **On-premise vs Cloud:** Chmura (AWS/Azure) oferuje szybką skalowalność i gotowe skrypty do automatyzacji (Terraform/Ansible), natomiast lab lokalny pozwala na lepszą kontrolę nad warstwą sieciową.
- **Honeypoty:** Kluczowy element "aktywnej obrony". Umieszczenie w sieci celowo podatnej maszyny pozwala wykryć intruza na bardzo wczesnym etapie (reconnaissance).

---

### 4. Praca z danymi: Wzbogacanie i Analiza

Surowy log często nie wystarcza do podjęcia decyzji. Inżynieria detekcji polega na nadawaniu kontekstu.

|Proces|Opis|Przykład|
|---|---|---|
|**Parsing**|Zamiana nieustrukturyzowanego tekstu na pola (key-value).|Wyciągnięcie `Source_IP` z ciągu znaków.|
|**Enrichment**|Dodawanie zewnętrznych danych do logu.|Sprawdzenie IP w **AbuseIPDB** lub dodanie nazwy działu do nazwy użytkownika.|
|**Normalization**|Ujednolicenie formatu (np. ECS - Elastic Common Schema).|Każde pole z adresem IP nazywa się tak samo, niezależnie od źródła.|
### Podsumowanie Labów (Praktyka)

W ramach tego modułu wykonasz następujące zadania praktyczne:

1. **MITRE DeTT&CT:** Analiza mapy Twoich logów względem technik ataku, aby znaleźć "ślepe plamy".
2. **AbuseIPDB API:** Automatyczne sprawdzanie reputacji adresów IP bezpośrednio w strumieniu danych.
3. **Case Management:** Integracja SIEM z systemem do zarządzania incydentami (np. TheHive), aby zapewnić mierzalność pracy zespołu SOC.