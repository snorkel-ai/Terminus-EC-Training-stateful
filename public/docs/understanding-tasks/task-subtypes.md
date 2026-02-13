# Understanding Task Subtypes

A subset of the tasks will be aligned to subtypes that target key challenge areas. Tasks can be aligned with multi subtypes if they span multiple challenge areas. These subtypes are defined as:


## 1. Long Context
These tasks are designed to exhaust and test the reasoning capabilities of large context windows. A "Long Context" task is not just about a large file—it's about information density and non-linear retrieval.

### Supported Formats & Examples
* **Text-Heavy Formats:**
    * **PDF:** Academic papers (50–150 pages), regulatory filings (10-K), or ISO technical standards.
    * **DOCX:** Legal contracts with deep appendices or internal architecture proposals.
    * **Markdown/TXT:** Multi-day meeting transcripts or massive technical handbooks.
* **Semi-Structured Content:**
    * **HTML:** Entire documentation sites scraped into a single reference file.
    * **JSON/YAML:** Massive API schemas or nested configuration files with inline documentation.
    * **CSV:** Wide datasets with extensive metadata headers and notes.
* **Conversational/Narrative:**
    * **Chat Logs:** Slack/Discord exports or weeks of customer support transcripts.
    * **Email:** Long back-and-forth threads where the agent must track referenced attachments.

> **Threshold:** Files must be at least **50k tokens** and cannot simply be parsed programmatically or through keyword search. The task must rely on the model's semantic understanding of the provided document.



## 2. Tool Specific
Targeting tools that provide SDKs and APIs where models typically underperform due to less training data or high syntax specificity. 
* **Examples:** Blender, FFmpeg, ImageMagick, Graphviz, MLFlow, WandB, Prefect, Superset, GIMP, QGIS, etc.
* **Goal:** Providing exercises for these tools is highly useful for identifying agent blindspots in specialized workflows.



## 4. API Integration
Simulates real-world agent workflows. 
* **Implementation:** APIs must be mocked within the Docker environment without external dependencies. 
* **Interaction:** The agent interacts strictly via the terminal (no MCP). Source code for the API must be included in the environment.
* **Frameworks:** Flask, Ruby on Rails, Django, Express.js, etc. (**FastAPI** must be minority of total API tasks).



## 5. DB Interaction
Directly addresses high demand for agents capable of complex data engineering.
* **Tech Stack:** Uses SQLite or similar DB tools (Postgres, Parquet, Arrow) in Docker.
* **The "Flat-File" Limit:** DBs represented purely as CSVs should make up minority of DB-based tasks to ensure agents are actually interacting with database engines.


---

## Summary Table: Subtype Constraints

| Subtype | Key Requirement | Success Metric |
| :--- | :--- | :--- |
| **Long Context** | Min 50k tokens | Cannot be solved via simple `grep` |
| **Tool Specific** | Specialized SDK use | Correct output from complex CLI |
| **API Integration** | Source code included | Successful mock-service interaction |
| **DB Interaction** | <20% CSV-based | Correct SQL/Query execution |

---

**Ready to build?**
**[View the Task Authoring Templates](/portal/docs/getting-started/templates)**