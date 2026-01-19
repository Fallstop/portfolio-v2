Based on the course introduction provided, here is a comprehensive summary of the "Smart Energy Monitor" project for ELECTENG 209, including technical specifications, background context, deliverables, and bonus opportunities.

### **1. Project Background and Motivation**
[cite_start]The project is situated in the context of the global push toward zero emissions by 2050 and the increasing reliance on renewable energy [cite: 62-64]. [cite_start]As energy generation becomes decentralized (DEG), managing energy flow becomes challenging[cite: 31, 40].

* [cite_start]**The Problem:** Distributed sources, loads, and storage systems need to be concurrently managed[cite: 41].
* [cite_start]**The Solution:** A "smart grid" utilizing smart sensors to monitor energy flow, allowing for efficient generation, storage, and retrieval decisions [cite: 42-43].
* [cite_start]**Your Role:** You will design and engineer a **Smart Energy Monitor** capable of measuring and displaying the energy consumed by a specific household appliance[cite: 232, 243].



[Image of smart energy grid diagram]


---

### **2. Technical Specifications & System Architecture**
[cite_start]The project involves designing a hardware and software solution to measure power parameters of a scaled-down AC system[cite: 239, 250]. [cite_start]The system consists of analog circuitry (sensors, amplifiers, filters) and embedded software [cite: 244-245].

#### **System Inputs and Loads**
To simplify the design, the system uses a low-voltage source rather than mains voltage:
* [cite_start]**Source Voltage:** $14~V_{RMS} \pm 10\%$[cite: 291].
* [cite_start]**Source Frequency:** $500~Hz \pm 2\%$ (Note: This is higher than the standard 50Hz grid frequency to reduce the physical size of the AC load)[cite: 251, 291].
* [cite_start]**Load:** A variable resistor in series with a fixed inductor, emulating a household appliance[cite: 251].
* [cite_start]**Load Range:** $2.5~VA$ to $7.5~VA$[cite: 291].
* [cite_start]**Power Factor:** $0.6$ to $0.99$[cite: 291].



#### **Hardware & PCB Requirements**
[cite_start]You are required to design a printed circuit board (PCB) using Altium Designer[cite: 593, 595].
* [cite_start]**PCB Technology:** Double Layer with Plated Through Holes (PTH)[cite: 291].
* [cite_start]**Size Limit:** $20000~mm^{2}$[cite: 291].
* [cite_start]**Components:** Through-hole (TH) and Surface Mount Technology (SMT)[cite: 291].
* [cite_start]**Microcontroller:** The system uses an ATmega328P/PB (Xplained Mini board)[cite: 306, 562].
* [cite_start]**System Clock:** $2~MHz$[cite: 291].

#### **Measurement and Display**
[cite_start]The embedded software must convert analog signals to digital form and calculate energy consumption[cite: 245].
* [cite_start]**ADC Conversion Rate:** $10~kHz$ or slower[cite: 291].
* [cite_start]**UART Baud Rate:** $9600$ Baud[cite: 291].
* [cite_start]**Accuracy:** Measurements must be within 5% of the full-scale reading[cite: 291].
* [cite_start]**Display Data:** Voltage ($V_{rms}$), Current ($mA_{pk}$), and Power ($W$) must be shown on a local LCD display with a 1-second scroll rate[cite: 291].
* [cite_start]**Transmission:** Voltage, Current, Power, and Energy must be transferred via UART[cite: 291].

---

### **3. Assessment and Deliverables**
[cite_start]The course assessment is a mix of individual understanding and group project deliverables [cite: 532-533]. [cite_start]You will work in a team of 4[cite: 315].

[cite_start]**Pass Condition:** You **must** achieve an average score of over 40% across Test 1 and Test 2 to pass the course[cite: 531].

| Component | Weighting | Notes |
| :--- | :--- | :--- |
| **Tests 1 & 2** | 45% | [cite_start]Weeks 5 and 10; includes written concepts and practical simulation/coding [cite: 542-544]. |
| **Weekly Lab Assignments** | 15% | [cite_start]6 assignments designed to guide the design process[cite: 549, 553]. |
| **Lecture Quizzes** | 5% | [cite_start]Capped at 5%; used to track engagement and attendance[cite: 545, 548]. |
| **Project Deliverables** | 15% | [cite_start]Assessed on functionality (5%), measurement accuracy (5%), and quality (5%)[cite: 565]. |
| **Mid-semester Review** | 6% | [cite_start]Validating the analog circuit and UART software before the break [cite: 560-563]. |
| **Final Interview** | 14% | [cite_start]Individual assessment of electronics (7%) and programming (7%) knowledge[cite: 567]. |
| **Bonus** | 5% | [cite_start]Optional Smart Energy Challenge[cite: 533]. |

---

### **4. Bonus Marks: The Smart Energy Challenge**
[cite_start]For teams seeking excellence, there is an optional challenge focused on improving the **Technology Readiness Level (TRL)** of the design [cite: 571-572].

* **Requirements:**
    * [cite_start]Implement a prototype using **SMT** (surface mount technology) components[cite: 573].
    * [cite_start]Include the microcontroller onboard rather than using the development board[cite: 573].
    * [cite_start]Preferably package the device in a small enclosure[cite: 573].
    * [cite_start]Implement wireless communication (Bluetooth or WiFi) with an app to display info on a smart device[cite: 576].
* [cite_start]**Reward:** Up to **4 bonus marks** for successful completion[cite: 578].
* [cite_start]**Finalists:** The top 4 teams will be interviewed by industry judges from **DATAMARS**, with finalists receiving up to **1 additional bonus mark** [cite: 579-580].

[cite_start]**Important Note:** You must complete all standard project tasks before attempting this challenge[cite: 577].

---