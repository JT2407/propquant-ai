<div align="center">
<img width="1200" height="475" alt="Product Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Institutional Real Estate Underwriting Engine

Enterprise-grade real estate underwriting and investment analysis platform designed for **deterministic financial modeling** with **AI-assisted interpretation**.

This application ingests property listings from public real estate platforms, performs **fully formula-driven underwriting**, and produces professional-grade investment memos suitable for private equity, family offices, and institutional investors.

---

## Core Capabilities

- Deterministic calculation of NOI, DSCR, and post-debt cash flows  
- Interest-rate sensitivity and capital stack analysis  
- Institutional-quality scoring: Asset Quality, Deal Economics, Leverage Impact  
- AI-generated narrative and risk interpretation (numbers always deterministic)  
- Multi-currency support: ZAR, USD, EUR  
- Structural integrity and market risk assessment  

---

## Architectural Principles

- **All numeric outputs are formula-driven**; AI only interprets results  
- **Fully reproducible outputs** for identical inputs  
- **Auditability & transparency** for enterprise usage  
- **No hardcoded keys or sensitive info in repository**  

---

## Tech Stack

- **Language:** TypeScript / Node.js  
- **AI Layer:** Google Gemini API (narrative only)  
- **Financial Engine:** Deterministic modeling  
- **Architecture:** Modular, service-oriented  

---

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+  
- NPM / Yarn / PNPM  
- Google Gemini API key  

### Setup

1. Clone this repository:

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
