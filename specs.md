# Open Data Governance Platform Specifications (GovData Guard)

## 1. Executive Summary
This document outlines the technical and functional specifications for a SaaS-based Open Data Governance Platform designed for the Thai market and global expansion. The platform adheres to **DGA (Digital Government Development Agency)** standards and facilitates compliance with the **PDPA (Personal Data Protection Act B.E. 2562)**.

## 2. Compliance & Standards
### 2.1 Thai PDPA Compliance
The system must identify and manage two categories of personal data:
*   **General Personal Data:** Name, Address, Telephone Number, ID Card Number.
*   **Sensitive Personal Data (Section 26):** Race, Ethnicity, Political Opinions, Cult/Religious beliefs, Sexual behavior, Criminal records, Health data, Disability, Trade union information, Genetic/Biometric data.

### 2.2 DGA Data Governance Framework
*   **Metadata Standard:** Core metadata fields must map to DCAT (Data Catalog Vocabulary) and CKAN standards.
*   **Open Data Level:** Support for 1-5 Star Open Data deployment.

## 3. Functional Requirements

### 3.1 Module: Data Catalog (CKAN Compatible)
*   **User Story:** As a Data Steward, I want to list datasets with standardized metadata so that they are discoverable.
*   **Fields:** Title, Description, Owner (Agency), Format, License, Update Frequency, Tags.
*   **Visibility:** Public, Restricted (Internal), Confidential.

### 3.2 Module: PDPA Guardian (Compliance Studio)
*   **User Story:** As a DPO, I want to scan datasets before publication to prevent data leaks.
*   **Features:**
    *   Automated PII Pattern Matching (Regex + AI Contextual).
    *   Specific detection of Thai National IDs (13 digits).
    *   Risk Assessment Scoring (0-100).
    *   Remediation Suggestions (Masking, Hashing, Tokenization).

### 3.3 Module: Intelligence Layer (AI)
*   **Role:** Auto-classification and PII detection.
*   **Technology:** Google Gemini API (`gemini-2.5-flash`).
*   **Tasks:**
    1.  Contextual PII scanning (e.g., distinguishing a random number from an ID).
    2.  Automated Metadata Generation (Title/Description generation from raw data).

## 4. Technical Architecture (TDD/Spec-Driven)
*   **Frontend:** React 19 (SPA), TypeScript (Strict Mode).
*   **Styling:** Tailwind CSS (Utility-first, responsive).
*   **Visualization:** Recharts (Data analytics).
*   **Security:**
    *   Client-side preprocessing where possible.
    *   Transient data processing for AI scans (No storage of raw data in AI logs).
    *   Environment variable management for API Keys.

## 5. Security & Privacy Design
*   **Principle of Least Privilege:** Role-based access (Viewer, Editor, Admin, DPO).
*   **Data Minimization:** AI scans only utilize sample subsets (n=10 rows) to minimize exposure risk during analysis.

## 6. Roadmap
*   **Phase 1 (MVP):** Catalog, Manual Upload Scan, Dashboard.
*   **Phase 2:** API Integration with CKAN instances.
*   **Phase 3:** Automated pipeline connectors (SQL, S3).
