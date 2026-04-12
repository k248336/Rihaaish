# Master Test Plan

**Project:** Rihaaish — Real Estate Marketplace Mobile Application  
**Document Version:** 1.0  
**Classification:** Internal / Academic Submission  
**Related Standards:** IEEE 829 (Software Test Documentation) — concepts adapted for agile mobile delivery

---

## 1. Introduction

### 1.1 Purpose

This Master Test Plan (MTP) defines the objectives, scope, strategy, environment, responsibilities, risks, and schedule for verifying and validating the Rihaaish mobile application and its integrated backend services. Its purpose is to ensure that functional and non-functional quality goals are understood, planned, and traceable from requirements through execution and reporting.

### 1.2 Scope

The scope of this plan covers:

- The **React Native** client application (Android and iOS targets).
- **RESTful (or REST-style) Python backend APIs**, including **authentication** (e.g., signup, login, session or token handling) and marketplace-related endpoints consumed by the app.
- **Manual and automated** test activities from early development through pre-release regression.

Out-of-scope items are listed explicitly in Section 4.2. This document does not replace detailed test case specifications or low-level test scripts; it establishes the governing framework for those artifacts.

### 1.3 Intended Audience

| Audience | Use of this document |
|----------|----------------------|
| Course instructors / academic reviewers | Assess testing rigor, alignment with engineering practice, and completeness of planning |
| Project Manager / Product Owner | Align scope, schedule, and release criteria with test effort |
| Developers | Understand test levels, environments, and handoff expectations |
| QA Engineers | Derive test cases, environments, and reporting conventions |
| DevOps / Backend maintainers | Coordinate environments, deployments, and API availability for test cycles |

### 1.4 Document Terminology and Acronyms

| Term / Acronym | Definition |
|----------------|------------|
| **MTP** | Master Test Plan — this document |
| **SUT** | System Under Test — Rihaaish app plus integrated backend in a defined configuration |
| **API** | Application Programming Interface — HTTP-based services exposed by the Python backend |
| **RN** | React Native |
| **RTL** | React Native Testing Library — component and screen testing for React Native |
| **JWT** | JSON Web Token — common pattern for stateless authentication (if used by the backend) |
| **UAT** | User Acceptance Testing |
| **CI** | Continuous Integration |
| **E2E** | End-to-End — tests spanning client, network, and server |
| **NFR** | Non-Functional Requirement (e.g., performance, security baseline) |

### 1.5 References

1. Project repository: Rihaaish — `package.json`, Jest configuration, application source under `src/`.
2. React Native documentation — build, run, and testing guidance for target RN version.
3. Jest — `https://jestjs.io/`
4. React Native Testing Library — `https://callstack.github.io/react-native-testing-library/`
5. IEEE 829-2008 (historical) / contemporary test documentation practice — structure and terminology for test planning (adapted).

### 1.6 Document Overview

Section 2 summarizes the product and technical context. Section 3 defines **test strategy** (levels, types, environment, tools). Section 4 bounds **in-scope and out-of-scope** testing. Section 5 describes **how** frontend, backend, and QA activities are executed. Section 6 lists **deliverables**. Sections 7–9 cover **roles**, **risks**, and a **realistic schedule** for phased testing.

---

## 2. Project Overview

**Rihaaish** is a **real estate marketplace** mobile application comparable in concept to regional platforms such as Zameen.com: users discover property listings, engage with listing content (e.g., media, location), and interact with account-centric flows supported by server-side logic.

**Frontend (React Native):** The client is implemented with React Native (current stack includes React 19.x, React Native 0.82.x), navigation (e.g., native stack, drawer, tabs), **Redux Toolkit** with **redux-persist** and **AsyncStorage** for client state, **axios** for HTTP, and **Formik** / **Yup** (or equivalent) for forms and validation. The UI layer includes reusable components, authenticated and guest flows, and integrations such as **maps**, **media**, and **device information** where applicable.

**Backend (Python APIs):** The server exposes APIs consumed by the mobile app for core domain operations. **Authentication** is integrated end-to-end: **signup** and **login** (and related flows such as token refresh or profile bootstrap, as implemented) are primary integration points between the client and backend.

**Future scalability:** The architecture supports growth through additional listing types, search/filter sophistication, messaging or notifications, and geographic expansion. Testing practices in this plan (regression automation, contract-aware API testing, device matrix sampling) are chosen to scale with feature growth without proportional manual-only effort.

---

## 3. Test Strategy

### 3.1 Test Levels

| Level | Objective | Typical artifacts / execution |
|-------|-----------|------------------------------|
| **Unit** | Verify isolated logic (pure functions, reducers, selectors, utilities, validators) with fast feedback | Jest unit tests; mocked dependencies |
| **Integration** | Verify collaboration between modules (e.g., Redux slice + API client with **axios-mock-adapter**, navigation + screen with RTL) | Jest + RTL; API mocks |
| **System** | Validate the complete mobile app against a **deployed or staging** backend; real device behavior, permissions, offline/poor network | Manual + optional E2E (e.g., Detox/Maestro if adopted); staging SUT |
| **Acceptance** | Confirm the product meets business/stakeholder criteria and is fit for release or milestone demo | UAT scripts, sign-off checklist, demo scenarios |

### 3.2 Test Types

| Type | Focus | Examples for Rihaaish |
|------|--------|---------------------|
| **Functional** | Correctness of features vs. requirements | Listing browse/detail, filters, favorites/saved items (if present), auth success/failure |
| **UI** | Layout, accessibility basics, navigation, error states | Onboarding, login/signup screens, drawer/tabs, form validation messages |
| **API** | Contract, status codes, payloads, auth headers, error models | Signup/login, listing CRUD or read endpoints, pagination |
| **Regression** | No unintended breakage after change | Re-run automated suite + targeted manual smoke on each release candidate |

Non-functional testing (performance smoke, basic security checks on auth and transport) may be applied incrementally; depth depends on release tier and course project constraints.

### 3.3 Test Environment

| Environment | Configuration | Use |
|-------------|---------------|-----|
| **Local development** | Metro bundler, developer machine, mock or local API | Developer TDD, RTL tests, rapid iteration |
| **Android Emulator** | API levels aligned with minimum/target SDK | Layout, intents, back stack, keyboard |
| **iOS Simulator** | Current Xcode-supported runtime | iOS-specific UI and navigation |
| **Physical devices** | Representative OEMs, OS versions, screen sizes | Gestures, camera/gallery (if used), maps, real network |
| **Backend server** | Staging URL / test tenant / seed data | System-level and API tests against realistic data |

Test data shall be **non-production**; credentials must be rotated and not committed to source control.

### 3.4 Test Tools

| Tool | Role |
|------|------|
| **Jest** | Unit and integration test runner (project preset: `react-native`) |
| **React Native Testing Library** | Render components, simulate user events, assert accessible outcomes |
| **react-test-renderer** | Supporting renderer for component tests |
| **axios-mock-adapter** | Stub HTTP for deterministic integration tests |
| **Postman / Insomnia / Bruno** | Manual and collection-based API testing; environment variables for base URL and tokens |
| **ESLint / Prettier** | Static quality gates (complement to functional testing) |
| **Optional E2E** (Detox, Maestro, Appium) | System-level automation if adopted by the team |

---

## 4. Test Scope

### 4.1 In-Scope Features

- **Authentication:** Signup, login, logout, session persistence (e.g., redux-persist), error handling for invalid input and failed API responses.
- **Onboarding and splash** flows leading into authenticated or guest experience.
- **Navigation:** Stack, drawer, and tab flows; deep links if implemented.
- **Core marketplace UX:** Listing discovery, listing detail, search/filter (as implemented), map-related views if enabled.
- **Forms and validation:** Client-side validation aligned with backend rules where documented.
- **API integration:** Request construction, loading and error UI, retry or user messaging as designed.
- **Regression:** Automated tests for critical paths plus manual smoke per build.

### 4.2 Out-of-Scope Features

- **Production load testing** unless explicitly scheduled (capacity planning).
- **Penetration testing** by a specialized security firm (may be replaced by lightweight checklist for academic scope).
- **Third-party SDK internals** (e.g., map provider, analytics) beyond configuration and observable app behavior.
- **Legacy OS versions** below project-defined minimums.
- **Backend implementation unit tests** — covered by backend team policy; *this* MTP focuses on mobile + integration unless the course treats backend as in-scope (then extend Section 5.2 with pytest specifics).

---

## 5. Test Approach

### 5.1 Frontend Testing Approach

- **UI and components:** Use RTL to render screens and components in isolation; assert visible text, roles, and user-visible state changes after events (press, change text, submit).
- **Navigation:** Test navigation params and screen transitions using navigation test utilities or integrated screen tests where practical.
- **State management:** Unit-test Redux reducers and selectors; integration-test thunks/async logic with mocked API layers to verify dispatch sequences and error branches.
- **Manual verification:** Emulator/simulator for visual polish; devices for gestures, keyboard, and OS-specific behavior (safe areas, permissions).

### 5.2 Backend Testing Approach

- **API testing:** Define collections (Postman, etc.) for auth and core resources; include positive, negative (401/403/404/422), and boundary cases (empty lists, invalid IDs).
- **Authentication:** Verify token issuance, authenticated routes, and expiration/refresh behavior per API design.
- **Validation:** Align client Yup schemas with server validation rules; test mismatch cases explicitly (e.g., weak password, duplicate email).
- **Contract stability:** When the API changes, update mobile mocks and collections in the same change set to reduce drift.

### 5.3 QA Approach

- **Manual testing:** Exploratory sessions on staging against seeded data; focused charters (e.g., “first-time user signup on slow 3G”).
- **Bug reporting:** Use a template (steps, expected vs. actual, environment, logs/screenshots, build version, backend release id).
- **Regression:** Gate release candidates with a **smoke suite** (automated + short manual script) before broader regression on high-risk areas (auth, payments if any, listing publish).

---

## 6. Test Deliverables

| Deliverable | Description |
|-------------|-------------|
| **Test cases** | Traceable steps, preconditions, data, expected results (spreadsheet or test management tool) |
| **Automated tests** | Jest/RTL (and optional E2E) in repository with CI-friendly execution |
| **Test execution reports** | Pass/fail per build, environment, and date |
| **Bug reports** | Defect records with severity/priority and reproduction |
| **Test summary report** | Coverage of scope, outstanding defects, release recommendation, known limitations |

---

## 7. Roles and Responsibilities

| Role | Responsibilities |
|------|------------------|
| **Developer** | Write and maintain unit/integration tests; fix defects; support testability (test IDs, feature flags, mock seams) |
| **QA Engineer** | Design test cases, execute manual cycles, log defects, maintain regression suites, validate fixes |
| **Project Manager** | Prioritize scope, approve release criteria, allocate time for test phases, manage stakeholder sign-off |

*Note:* In small academic teams, one person may wear multiple hats; responsibilities still must be explicit per sprint or milestone.

---

## 8. Risk Analysis

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Backend downtime** | Blocks system and API testing; false negatives in client tests hitting live services | Staging SLA; mocks for automated tests; health-check before test runs |
| **API failure / contract drift** | Broken app behavior; flaky tests | Versioned API docs; contract checks; coordinated releases; axios mocks in CI |
| **Device compatibility** | UI defects on specific OEMs or OS versions | Device matrix (minimum set); prioritize popular Android API levels and current iOS |
| **Dependency issues (npm, RN)** | Build failures; toolchain mismatch | Lockfile discipline; documented Node version (`engines`); clean CI install; periodic upgrade windows |

---

## 9. Schedule

The following phased timeline is **illustrative** for a semester-scale or milestone-based project; dates should be adjusted to the academic calendar.

| Phase | Duration (indicative) | Activities |
|-------|------------------------|------------|
| **Test planning & environment setup** | Week 1 | Finalize scope, devices, staging URLs, test accounts, reporting template |
| **Frontend unit/integration** | Weeks 2–4 | Reducer/util tests; RTL for auth and primary screens; stabilize Jest config |
| **Backend API testing** | Weeks 3–5 | Postman collections; auth negative tests; data setup scripts |
| **System & integration** | Weeks 5–7 | End-to-end flows on emulator/device against staging; defect triage |
| **Regression & hardening** | Week 8 | Full regression, fix retest, test summary report, UAT / demo readiness |

**Entry criteria:** Build installs successfully; staging API reachable; test accounts available.  
**Exit criteria:** No open **critical** defects; agreed high/medium defects either fixed or explicitly deferred with documented risk; smoke suite green on release candidate.

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | *(insert date)* | *(insert name)* | Initial Master Test Plan |

---

*End of Master Test Plan*
