# GovData Guard: Development Milestones
## Accelerated 8-Month Delivery Plan

**Document Control**
- **Project:** GovData Guard - Open Data Governance Platform
- **Version:** 2.0.0
- **Timeline:** 8 Months (Compressed from 12 months)
- **Last Updated:** 2025-12-30
- **Status:** Approved for Execution

---

## Overview

This document defines **executable milestones** with clear success criteria, test criteria, and AI-agent-ready prompts for the GovData Guard platform. The timeline has been compressed from 12 to 8 months while maintaining full feature delivery through parallel development streams and strategic prioritization.

### Timeline Acceleration Strategy
- **Parallel Development:** Frontend and Backend teams work simultaneously
- **Firebase-First:** Use Firebase for faster infrastructure setup (saves 2-3 weeks)
- **MVP-First Features:** Core features in MS1, polish in MS2
- **Agile Sprints:** 2-week sprints with continuous integration

---

## Milestone 1 (MS1): MVP Foundation
**Duration:** Months 1-2.5 (10 weeks)  
**Theme:** Core Platform Functionality

### MS1 Objectives
Build the foundational platform with essential data governance and PDPA compliance features that allow users to upload, scan, and approve datasets.

### MS1 Deliverables

#### 1.1 Platform Infrastructure
- React 19 + TypeScript project with Tailwind CSS
- Firebase setup (Hosting, Functions, Firestore, Storage, Authentication)
- CI/CD pipeline with GitHub Actions
- Development, Staging, Production environments

#### 1.2 Authentication & Authorization
- Firebase Authentication integration
- Role-based access control (Viewer, Editor, Admin, DPO)
- Login/logout UI with role-based dashboards
- JWT token management

#### 1.3 Data Catalog Module
- Dataset CRUD operations (Create, Read, Update, Delete)
- Dataset registration form with metadata fields
- Dataset listing with search and filter
- Dataset detail view
- File upload (CSV, JSON, XML) with parsing
- DCAT-compliant metadata structure
- Visibility controls (Public, Restricted, Confidential)

#### 1.4 PDPA Guardian - Basic Scanning
- Regex-based PII detection:
  - Thai National ID (13 digits with checksum validation)
  - Email addresses
  - Phone numbers (Thai format: +66, 0xx-xxx-xxxx)
  - Thai addresses
- Risk scoring algorithm (0-100 scale)
- Basic remediation suggestions (Mask, Hash, Suppress)
- Scan results display with PII findings

#### 1.5 AI Integration - Phase 1
- Google Gemini API integration (`gemini-2.5-flash`)
- Contextual PII scanning (10 row samples max)
- Sample data preprocessing for privacy
- AI-powered field classification

#### 1.6 Dashboard & Analytics
- Compliance overview dashboard
- Dataset statistics (total, pending scans, compliant)
- Risk score distribution chart
- Recent activity feed
- Responsive design (mobile/tablet/desktop)

---

### MS1 Success Criteria

✅ **Functional Requirements:**
1. Users can register and login with role-based access
2. Data Stewards can upload datasets (CSV, JSON, XML) up to 100MB
3. System detects Thai National IDs with >95% accuracy (checksum validation)
4. System detects emails and phone numbers with >90% accuracy
5. Risk scores are calculated and displayed (0-100 scale)
6. DPO can view scan results and approve/reject datasets
7. Dashboard shows real-time compliance metrics
8. All API endpoints return responses within 2 seconds (p95)

✅ **Technical Requirements:**
1. TypeScript strict mode with zero `any` types in core modules
2. Unit test coverage >80% for business logic
3. All components are responsive (mobile-first design)
4. Firebase security rules prevent unauthorized access
5. Firestore queries use indexes (no full collection scans)
6. Environment variables secure API keys (no hardcoded secrets)

✅ **Security Requirements:**
1. All data in transit uses TLS 1.3
2. Firebase Authentication enforces strong passwords
3. RBAC prevents privilege escalation
4. Audit logs record all dataset modifications
5. PII samples are masked in UI (12345****0123)
6. AI API calls do not log raw data


###MS1 Test Criteria

#### T1.1 Unit Tests
- Thai National ID validator: valid/invalid checksums, edge cases
- Email/phone regex patterns: Thai formats, internationalization
- Risk scoring algorithm: PII count, sensitivity weighting
- DCAT metadata mapping: completeness, accuracy
- File parsers (CSV, JSON, XML): encoding, malformed data
- **Coverage Target:** >80% for all business logic

#### T1.2 Integration Tests  
- Authentication: login, logout, role assignment, token refresh
- Dataset API: CRUD operations, authorization checks, pagination
- File upload: large files, concurrent uploads, format validation
- PII scanning: end-to-end scan workflow, Gemini API integration
- Firestore operations: create, read, update, delete with security rules
- **Target:** All critical paths tested, <5% failure rate

#### T1.3 E2E Tests (Playwright)
- Complete user journey: login → upload dataset → scan → approve
- DPO workflow: review scan results, approve/reject
- Search and filter: keyword search, metadata filters, sorting
- Responsive design: mobile, tablet, desktop viewports
- **Target:** 10+ critical user flows, all passing

#### T1.4 Performance Tests
- API response time: p95 < 2s for all endpoints
- Dashboard load time: < 3s initial, < 1s cached
- File upload: 100MB file completes within 2 minutes
- Concurrent users: 50 users without degradation
- **Tool:** k6 load testing

---

### MS1 AI Agent Prompt

**Copy this prompt to any AI coding assistant to implement MS1:**

```
You are a senior full-stack engineer building the MVP for "GovData Guard," an Open Data Governance platform for Thai PDPA compliance.

CONTEXT:
- Tech Stack: React 19, TypeScript (strict), Tailwind CSS, Firebase (Hosting, Functions, Firestore, Storage, Auth)
- AI: Google Gemini API (gemini-2.5-flash) for PII detection
- Target: Thai government agencies needing PDPA compliance

YOUR TASK: Implement Milestone 1 (MVP Foundation) - 10 weeks

REQUIREMENTS:
1. Setup Firebase project with all services
2. Create React app with TypeScript strict mode
3. Implement authentication (Firebase Auth) with 4 roles: Viewer, Editor, Admin, DPO
4. Build Data Catalog module:
   - Dataset CRUD with Firestore
   - File upload to Firebase Storage (CSV, JSON, XML)
   - Search and filter UI
   - DCAT-compliant metadata
5. Build PDPA Guardian scanning:
   - Regex detectors: Thai National ID (13 digits + checksum), Email, Phone, Address
   - Google Gemini API integration for contextual PII (max 10 rows)
   - Risk scoring: 0-100 based on PII count and sensitivity
   - Display findings with masked samples
6. Build Dashboard:
   - Total datasets, pending scans, risk distribution
   - Recharts for visualization
   - Responsive design
7. Security:
   - Firebase Security Rules for RBAC
   - TLS for all connections
   - No PII in logs
   - Audit trail in Firestore

SUCCESS CRITERIA:
- Users can upload datasets and scan for PII
- Thai National ID detection: >95% accuracy
- Risk scores displayed correctly
- DPO can approve/reject scans
- All responses < 2s (p95)
- Test coverage > 80%

DELIVERABLES:
1. Complete source code with folder structure
2. Firebase configuration files (firebase.json, firestore.rules, storage.rules)
3. Unit tests (Jest) for PII detectors and risk scoring
4. Integration tests for API endpoints
5. E2E test for complete workflow (Playwright)
6. README with setup instructions
7. Environment variables template (.env.example)

CONSTRAINTS:
- TypeScript strict mode (no `any` types)
- Mobile-first responsive design
- Follow React 19 best practices (hooks, no class components)
- ESLint + Prettier configured
- Git commits follow conventional commits format

START by creating the project structure and Firebase configuration.
```

---

## Milestone 2 (MS2): Integration & Enterprise Core
**Duration:** Months 2.5-5.5 (12 weeks)  
**Theme:** Automation, Integration, and Advanced Features

### MS2 Objectives
Enhance the platform with enterprise features, external integrations, advanced AI capabilities, and comprehensive reporting while maintaining high performance.

### MS2 Deliverables

#### 2.1 CKAN Integration
- CKAN API client for bi-directional sync
- Import/export datasets with metadata mapping
- Scheduled synchronization (Cloud Functions cron)

#### 2.2 Advanced AI Capabilities
- Automated metadata generation
- Data quality assessment
- Multi-language support (Thai + English)
- Chain-of-Verification for reduced false positives

#### 2.3 Workflow Automation
- Scheduled scans (daily, weekly, monthly)
- Email notifications (Firebase Extensions)
- Multi-level approval workflows
- Batch processing

#### 2.4 Reporting & Analytics
- Compliance trend analysis (30/60/90 days)
- Export to PDF and Excel
- Custom report builder
- ROPA tracking

#### 2.5 Data Pipeline Connectors
- PostgreSQL, MySQL connectors
- AWS S3, Google Cloud Storage connectors
- REST API connector with authentication
- Connection testing and validation

#### 2.6 Enhanced Security
- SSO integration (Google OAuth)
- Advanced audit logging
- Data lineage tracking
- Rate limiting

#### 2.7 Performance Optimization
- Firestore query optimization
- Caching strategy
- Code splitting and lazy loading
- Service Worker for offline capability

---

### MS2 Success Criteria

✅ **Functional Requirements:**
1. CKAN sync imports 1000+ datasets successfully
2. AI metadata generation: >80% user acceptance
3. Scheduled scans run reliably (99% success rate)
4. Reports export correctly to PDF/Excel
5. SQL and S3 connectors retrieve data successfully

✅ **Performance Requirements:**
1. Dashboard loads < 1.5s (p95)
2. Large dataset scans (10k rows) complete < 5 minutes
3. API response times < 500ms for cached queries
4. System handles 100 concurrent users

✅ **Integration Requirements:**
1. CKAN mapping is bidirectional and lossless
2. SQL connectors support PostgreSQL 12+, MySQL 8+
3. External connections have timeout (30s) and retry logic

---

### MS2 Test Criteria

#### T2.1 CKAN Integration Tests
- Import/export with metadata validation
- Pagination for large catalogs
- Error handling for connection failures
- Scheduled sync execution

#### T2.2 AI Enhancement Tests
- Metadata generation accuracy (compare to ground truth)
- Data quality detection (missing values, format issues)
- Multi-language PII detection (Thai and English)
- False positive rate reduction

#### T2.3 Workflow Tests
- Scheduled scans trigger correctly
- Email notifications sent within 5 minutes
- Multi-level approval state transitions
- Batch processing handles multiple datasets

#### T2.4 Connector Tests
- PostgreSQL/MySQL connection and query execution
- S3/GCS file listing and download
- REST API authentication methods
- Connection timeout and retry behavior

#### T2.5 Performance Tests
- Load test: 100 concurrent users
- Large dataset processing time
- Dashboard rendering performance
- Firestore query optimization verification

---

### MS2 AI Agent Prompt

```
You are continuing development on "GovData Guard" - MS1 (MVP) is complete. Now implement MS2: Integration & Enterprise Core.

CONTEXT:
- MS1 Completed: Basic data catalog, PII scanning, dashboard
- Tech Stack: React 19 + TypeScript + Firebase + Gemini API
- Current State: Users can upload datasets and scan for PII manually

YOUR TASK: Implement Milestone 2 (Integration & Enterprise) - 12 weeks

REQUIREMENTS:
1. CKAN Integration:
   - Build CKAN API client (TypeScript)
   - Implement import/export with metadata mapping
   - Create scheduled sync (Cloud Functions cron)

2. Advanced AI:
   - Implement metadata generation from dataset samples
   - Build data quality assessment
   - Add Thai + English language support
   - Implement Chain-of-Verification

3. Workflow Automation:
   - Scheduled scans using Cloud Functions triggers
   - Email notifications via Firebase Extensions
   - Multi-level approval workflows
   - Batch processing

4. Reporting:
   - Compliance trend charts (Recharts)
   - Export to PDF (jsPDF) and Excel (XLSX)
   - Custom report builder
   - ROPA tracking interface

5. Data Connectors:
   - PostgreSQL, MySQL connectors (Cloud Functions)
   - AWS S3, GCS connectors
   - REST API connector with auth
   - Connection testing UI

6. Security & Performance:
   - Google OAuth SSO
   - Enhanced audit logging
   - Data lineage visualization
   - Rate limiting
   - Firestore optimization

SUCCESS CRITERIA:
- CKAN sync imports 1000+ datasets
- AI metadata: >80% acceptance
- Scheduled scans: 99% uptime
- Reports export correctly
- Dashboard loads < 1.5s (p95)

DELIVERABLES:
1. CKAN integration module with tests
2. Enhanced AI service
3. Workflow automation Cloud Functions
4. Reporting module with PDF/Excel export
5. Data connector modules
6. Performance optimization docs
7. Integration and load tests

CONSTRAINTS:
- Maintain backward compatibility with MS1
- Monitor Firebase limits
- Implement request queuing for Gemini API
- Stream processing for large files
- Mobile-responsive

START by creating the CKAN integration module.
```

---

## Milestone 3 (MS3): Enterprise Scale & Production Readiness
**Duration:** Months 5.5-8 (10 weeks)  
**Theme:** Scale, Security, Multi-tenancy, and Market Launch

### MS3 Objectives
Transform the platform into an enterprise-ready, multi-tenant SaaS with advanced security, high performance, and production-grade operations.

### MS3 Deliverables

#### 3.1 Multi-Tenancy Architecture
- Organization management system
- Tenant isolation in Firestore
- Usage quotas and billing (Stripe)
- White-labeling (custom logo, colors, domain)
- Cross-organization collaboration

#### 3.2 Advanced Data Pipeline
- Real-time streaming (Kafka, Pub/Sub)
- GraphQL API connector
- MSSQL and Oracle connectors
- Incremental sync with change detection
- Data transformation rules

#### 3.3 Enterprise Security
- SAML 2.0 SSO integration
- Two-factor authentication (TOTP)
- IP whitelisting
- Custom roles with granular permissions
- ISO 27001 preparation
- Security scanning (Snyk, OWASP ZAP)

#### 3.4 Advanced Analytics
- Predictive analytics for compliance trends
- Anomaly detection
- Natural language queries
- Smart recommendations
- Custom KPI dashboards

#### 3.5 Performance & Scale
- Firestore pagination for large datasets
- Image optimization (WebP, lazy loading)
- CDN integration
- Horizontal scaling documentation
- Caching strategy

#### 3.6 Production Operations
- Comprehensive monitoring (Firebase Performance, Cloud Logging)
- Alerting system (Cloud Monitoring)
- Automated backup strategy
- Disaster recovery runbook
- SLA tracking (99.9% uptime)

#### 3.7 Market Launch
- Thai and English localization (100% coverage)
- User onboarding flow
- Video tutorials and documentation
- API documentation (OpenAPI/Swagger)
- Developer portal
- Marketing website
- Public demo environment

---

### MS3 Success Criteria

✅ **Scale Requirements:**
1. Handles 10,000+ datasets per tenant
2. Supports 500+ concurrent users
3. API response times: p95 < 500ms, p99 < 1000ms
4. Dashboard loads < 1s (p95)
5. Large scans (100k rows) complete < 15 minutes

✅ **Multi-Tenancy Requirements:**
1. Complete data isolation between organizations
2. Usage quotas enforced correctly
3. Billing integration calculates costs accurately
4. White-labeling applies consistently

✅ **Security Requirements:**
1. SAML SSO works with Okta, Azure AD
2. 2FA reduces unauthorized access by >95%
3. Security audit finds zero critical vulnerabilities
4. Penetration testing passes

✅ **Operations Requirements:**
1. System uptime: 99.9% over 30 days
2. Automated backups restore successfully
3. MTTR < 4 hours
4. Disaster recovery tested quarterly

✅ **Launch Readiness:**
1. Thai localization: 100% coverage, native approved
2. User documentation complete
3. API documentation accurate
4. 3+ pilot customers onboarded

---

### MS3 Test Criteria

#### T3.1 Multi-Tenancy Tests
- Tenant isolation: users cannot access other orgs' data
- Usage quota enforcement
- Billing calculation accuracy
- White-labeling application

#### T3.2 Advanced Pipeline Tests
- Real-time streaming message processing
- GraphQL query execution
- MSSQL/Oracle connectivity
- Incremental sync accuracy

#### T3.3 Security Tests
- SAML SSO authentication flow
- 2FA TOTP generation and validation
- IP whitelisting enforcement
- Custom role permission checks
- Security vulnerability scanning

#### T3.4 Scale & Performance Tests
- Load test: 500 concurrent users
- API response time under load
- Large dataset processing time
- Dashboard performance with 10k+ datasets
- Firestore query optimization

#### T3.5 Disaster Recovery Test
- Backup creation and restoration
- Data integrity verification
- Recovery time measurement
- Failover procedures

---

### MS3 AI Agent Prompt

```
You are finalizing "GovData Guard" for production launch. MS1 and MS2 are complete. Now implement MS3: Enterprise Scale & Production Readiness.

CONTEXT:
- MS1 Complete: MVP with catalog, scanning, dashboard
- MS2 Complete: CKAN integration, advanced AI, workflows, connectors
- Current State: Functional platform used by pilot customers
- Deployment: Firebase (Firestore, Cloud Functions, Hosting, Storage)

YOUR TASK: Implement Milestone 3 (Enterprise & Launch) - 10 weeks

REQUIREMENTS:

1. Multi-Tenancy:
   - Organization management UI
   - Tenant-scoped Firestore queries
   - Usage quotas enforcement
   - Billing integration (Stripe)
   - White-labeling system
   - Cross-org collaboration

2. Advanced Pipelines:
   - Pub/Sub connector (real-time streaming)
   - GraphQL API connector
   - MSSQL and Oracle connectors
   - Incremental sync
   - Data transformation UI

3. Enterprise Security:
   - SAML 2.0 SSO
   - Two-factor authentication (TOTP)
   - IP whitelisting
   - Custom roles with granular permissions
   - Security audit logging
   - ISO 27001 preparation
   - Snyk integration

4. Advanced Analytics:
   - Predictive analytics (Gemini)
   - Anomaly detection
   - Natural language query interface
   - Smart recommendations
   - Custom KPI builder
   - Benchmarking

5. Performance:
   - Firestore pagination (cursor-based)
   - Image optimization (WebP)
   - Code splitting (React.lazy)
   - Service Worker (offline support)
   - Composite indexes
   - Monitoring and alerting

6. Production Ops:
   - Monitoring dashboard
   - Automated backups (daily)
   - Disaster recovery runbook
   - Incident response procedures
   - SLA tracking (99.9%)
   - Cost monitoring

7. Launch:
   - Thai + English localization
   - User onboarding wizard
   - Video tutorials
   - API documentation (OpenAPI)
   - Developer portal
   - Marketing website
   - Public demo

SUCCESS CRITERIA:
- 10k+ datasets/tenant, 500+ concurrent users
- API: p95 < 500ms, p99 < 1000ms
- 99.9% uptime
- SAML SSO with Okta/Azure AD
- Zero critical security vulnerabilities
- Thai localization 100% coverage
- 3+ pilot customers onboarded

DELIVERABLES:
1. Multi-tenancy system
2. Advanced connectors (Pub/Sub, GraphQL, MSSQL, Oracle)
3. Enterprise security (SAML, 2FA, IP whitelist, custom roles)
4. Advanced analytics and NL query
5. Performance optimization
6. Production monitoring and alerting
7. Disaster recovery runbook
8. Complete localization (Thai + English)
9. User docs and video tutorials
10. API documentation (OpenAPI)
11. Marketing website
12. Public demo
13. Load tests
14. Security audit report

CONSTRAINTS:
- Backward compatible with MS1/MS2
- Firebase limits (Blaze plan)
- Optimize Gemini API token usage
- Mobile responsive
- Zero downtime deployments

START by implementing multi-tenancy with organization management.
```

---

## Quick Reference: Execution Guide

### Parallel Development Strategy

**Weeks 1-10 (MS1):**
- Team A: Frontend (React components, UI/UX)
- Team B: Backend (Firebase Functions, Firestore)
- Team C: AI Integration (Gemini API, PII detection)

**Weeks 11-22 (MS2):**
- Team A: CKAN integration, Reporting
- Team B: Data connectors, Workflows
- Team C: Advanced AI, Performance

**Weeks 23-32 (MS3):**
- Team A: Multi-tenancy, Localization
- Team B: Enterprise security, Pipelines
- Team C: Analytics, Launch prep, Docs

### Success Metrics (Track Weekly)

| Metric | Target | Tool |
|--------|--------|------|
| **Development Velocity** | 20 story points/sprint | Jira/Linear |
| **Test Coverage** | >80% | Jest |
| **Build Success** | >95% | GitHub Actions |
| **API Response (p95)** | <500ms | Firebase Performance |
| **Bug Escape Rate** | <5/sprint | Bug tracker |
| **User Satisfaction** | NPS >40 | Surveys |
| **Documentation** | 100% features | Manual review |
| **Security Vulns** | 0 critical | Snyk, OWASP ZAP |

---

## Risk Mitigation

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Timeline Slippage** | Medium | High | Weekly reviews, early escalation, buffer in MS3 |
| **Gemini Rate Limits** | High | Medium | Queue, caching, fallback to regex |
| **Firebase Costs** | Medium | Medium | Daily monitoring, query optimization, budget alerts |
| **Security Vulnerabilities** | Low | Critical | Regular audits, automated scanning, code reviews |
| **Team Unavailability** | Medium | Medium | Cross-training, documentation, backup resources |
| **Scope Creep** | High | High | Strict change control, prioritize ruthlessly |

---

**Document Version:** 2.0.0  
**Timeline:** 8 Months (Accelerated)  
**Last Updated:** 2025-12-30  
**Status:** Approved for Execution

---

*This milestone document provides executable, concise, and testable milestones with AI-agent-ready prompts for consistent implementation.*
