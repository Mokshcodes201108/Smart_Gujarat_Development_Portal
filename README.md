# Smart Gujarat Development Portal (SGDP)
### *"One Portal. Every Project. Zero Duplication."*

![SGDP Banner](https://img.shields.io/badge/Gujarat%20Gov-District%20Development%20Office%20Bharuch-0d9488?style=for-the-badge)
![Challenge](https://img.shields.io/badge/SFIC%202026--27-Problem%20Statement%20PS000010-0284c7?style=for-the-badge)
![Build](https://img.shields.io/badge/React%2019-TypeScript%20%7C%20TailwindCSS-16a34a?style=for-the-badge)
![License](https://img.shields.io/badge/License-Apache%202.0-slate?style=for-the-badge)

**Official Problem Statement:**  
**PS000010 – Regarding Synchronization of Various Developmental Works**  
**Organization:** District Development Office (DDO) – Bharuch, Government of Gujarat.  
**Competition:** Gujarat's Seva First Innovation Challenge (SFIC) 2026–27.  
**Lead Developer & Product Architect:** Moksh Patel ([@Mokshcodes201108](https://github.com/Mokshcodes201108) | `patelmoksh201108@gmail.com`)

---

## 🏛️ Executive Summary & Problem Context

In districts across Gujarat such as Bharuch, multiple state and local government bodies—including the **Roads and Buildings Department (R&B)**, **District Panchayat**, **Gujarat Industrial Development Corporation (GIDC)**, **District Mineral Foundation (DMF)**, and the **Tribal Development Department**—execute civil, water, and infrastructure projects independently under separate budget schemes (MMGSY, 15th Finance Commission, DMF welfare grants, GIAN, etc.).

### The Problem:
Due to fragmented administrative silos and the absence of a unified pre-sanction verification system:
1. **Redundant Project Sanctions:** Similar civil works (such as paving the same road stretch or installing duplicate solar street lights in the same industrial ward) are proposed and sanctioned simultaneously by different departments.
2. **Financial Waste:** Crores of rupees in public exchequer funds are spent redundantly.
3. **Infrastructure Damage:** Newly paved roads are repeatedly dug up by other departments for drainage or water pipelines without prior cross-departmental coordination.
4. **Administrative Delays & Paperwork:** Lack of unified tracking creates delayed technical clearances and opaque project progress.

### Our Solution — SGDP:
**Smart Gujarat Development Portal (SGDP)** is a centralized full-stack government-tech platform that:
- Connects all developmental departments into a unified project registry.
- Features an **AI-powered Multi-Factor Duplicate Detection Engine** that flags spatial and scope overlaps *before* financial approval.
- Intercepts duplicate projects in real time, saving **₹8.45+ Crores** in taxpayer money across Bharuch.
- Bridges government officers with citizens via an interactive **GIS District Map** and a **Public Transparency Tracker**.

---

## 🧠 Core Innovation: AI Smart Duplicate Detection Engine

The AI Sentinel algorithm evaluates incoming developmental works against all existing records using a weighted multi-factor similarity function:

$$\text{Similarity Score} = \min\left(100, \left(W_{\text{loc}} \cdot S_{\text{loc}}\right) + \left(W_{\text{cat}} \cdot S_{\text{cat}}\right) + \left(W_{\text{title}} \cdot S_{\text{title}}\right) + \left(W_{\text{scope}} \cdot S_{\text{scope}}\right) + B_{\text{infra}}\right)$$

Where:
1. **Geospatial Proximity ($S_{\text{loc}}$):** Uses the **Haversine formula** to measure exact physical distance (in km) between GPS coordinates:
   $$d = 2R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
   Points within 400 meters receive a 100% proximity match score.
2. **Administrative Boundary Match:** Exact matching of Village and Taluka names across 9 Talukas of Bharuch.
3. **Semantic Scope & Title Match ($S_{\text{title}}, S_{\text{scope}}$):** Tokenized Jaccard similarity after stop-word removal and Indian administrative token filtering (`gram`, `panchayat`, `yojana`, `nirman`).
4. **Infrastructure Asset Overlap ($B_{\text{infra}}$):** Keyword classification identifying identical civil domains (e.g. `CC Road`, `Asphalt`, `Solar Street Light`, `Reverse Osmosis RO Plant`, `Underground Drainage`).

### Automated Risk Tiers:
| Score Tier | Risk Level | System Action | Recommended Resolution |
|---|---|---|---|
| **70% – 100%** | 🚨 **HIGH RISK** | Blocker Modal Triggered | Mandatory coordination with existing department before sanction |
| **40% – 69%** | ⚠️ **MEDIUM RISK** | Flagged in Registry | Joint site inspection required with DDO Planning Officer |
| **0% – 39%** | 🟢 **LOW RISK** | Clean Approval | Distinct scope verified; safe for budget allocation |

---

## 🚀 Key Modules & Capabilities

### 1. 🔐 Dual-Mode Authentication & Demo Bench
- **Public Citizen Access:** Clean village-level login for tracking works and submitting civic reviews.
- **Officer & Administration Access:** Role-authorized entry for DDO, Executive Engineers, and Assistant Engineers.
- **Dedicated Moksh Patel 1-Click Demo Login:** Instant authorization as **District Lead Innovation Architect & Super Admin** for hackathon judges.
- **Demo Presets:** 1-click access for DDO Bharuch, Executive Engineer (R&B), and Citizen.

### 2. 📝 User Registration Portal
- Registration forms for both **Public Citizens** (with Taluka/Village selection) and **Department Officers** (with Department, Designation, and Employee ID verification).
- Real-time client-side validation and immediate account activation.

### 3. 📊 Executive Dashboard
- Live KPIs derived dynamically from stored projects:
  - Total Works, Ongoing Works, Handed-Over Completed Works, Pending Sanctions.
  - Total Sanctioned Capital (₹92.83+ Cr) vs Utilized Expenditure (₹51.27+ Cr).
  - Intercepted Duplicates (5 clusters) with **₹8.45+ Cr public funds saved**.
- Interactive Recharts:
  - Department distribution donut chart.
  - Sanctioned vs. Utilized expenditure comparison bar chart.
  - Monthly development activity timeline area chart.

### 4. 🗂️ Project Management (Full CRUD)
- Register, edit, delete (with safety confirmation modal), and inspect project dossiers.
- Filter by **Department**, **Taluka**, **Village**, **Category**, and **Status**.
- Search by name, project ID (`GJ-BH-2026-XXX`), scheme, or locality.
- Sort by budget, date, name, and status.
- **1-Click CSV Export** for official reporting.

### 5. 🔍 AI Duplicate Detection Lab & Scanner
- Full district-wide batch scanning across all 26 projects in Bharuch.
- Side-by-side comparative conflict cards showing matching factors.
- **Interactive Sandbox:** Judges can input any custom title, village, or budget to watch the algorithm calculate real-time similarity scores in under 15ms.

### 6. 🗺️ Interactive GIS District Map (Leaflet + OpenStreetMap)
- Centered on Bharuch District (`21.7100°N, 72.9900°E`).
- Color-coded SVG markers:
  - 🟢 **Green:** Completed
  - 🔵 **Blue:** In Progress
  - 🟠 **Orange:** Pending Approval
  - 🔴 **Red (Pulsing):** Duplicate Overlap Zone
- Popups with project details, fly-to hotspot navigator, and department filters.

### 7. 🤝 Department Coordination & Conflict Resolution
- Formal interdepartmental coordination requests workbench (Merge, Re-scope, Reschedule, Cancel Duplicate).
- Official 6-Department Directory with Executive Engineer contact information, phone, email, and office addresses.

### 8. 💰 Fund Management & Fiscal Audit
- Departmental expenditure ledger and scheme-wise allocation breakdown (PMGSY, DMF, GIAN, Smart Village, Tribal Sub-Plan).
- Savings audit tracking exact taxpayer capital preserved through automated duplicate prevention.

### 9. 👥 Citizen Transparency Portal (ગુજરાત વિકાસ પોર્ટલ)
- Non-sensitive public dashboard for searching village projects.
- Ground reality feedback and grievance submission form (Duplicate work alerts, quality feedback, progress ratings).

### 10. 🛡️ Admin Governance Control Center
- User Registry Management (role modifications, account suspension, user provisioning).
- Officer Authorization Queue.
- Security & Action Audit Trail.
- AI Sentinel calibration sliders (sensitivity threshold & proximity radius).

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 19, TypeScript
- **Styling:** Tailwind CSS (Navy Blue `#0F172A`, Teal `#0D9488`, Emerald, Amber & Slate)
- **Mapping:** Leaflet 1.9, OpenStreetMap
- **Data Visualizations:** Recharts
- **Icons:** Lucide React
- **State & Storage:** Persistent LocalStorage Engine with seed resets and audit log tracking
- **Bundler & Tooling:** Vite, Bun / Node.js

---

## 💻 Quick Start & Local Setup

### Prerequisites
- Node.js (v18+) or Bun
- npm or bun package manager

### Installation
```bash
# Clone the repository
git clone https://github.com/Mokshcodes201108/Smart_Gujarat_Development_Portal.git

# Navigate to project directory
cd Smart_Gujarat_Development_Portal

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` (or the port indicated in your terminal) to explore the portal.

---

## 🔑 Demo Personas for Judges & Evaluators

| Persona | Name | Email | Role | Access Level |
|---|---|---|---|---|
| **District Innovation Lead** | **Moksh Patel** | `patelmoksh201108@gmail.com` | **Admin / Lead** | **Full System Access, Admin Console & AI Sentinel** |
| **District Administrator** | Shri B. K. Solanki, IAS | `ddo.bharuch@gujarat.gov.in` | Admin | Full Technical Approvals & DDO Authority |
| **Department Officer** | Er. Rajesh K. Patel | `officer.rnb@gujarat.gov.in` | Officer | Roads & Buildings Proposal & Coordination |
| **Public Citizen** | Hardik K. Parmar | `citizen.bharuch@gujarat.nic.in` | Citizen | Village Works Tracker & Feedback Portal |

*(Note: In the demo login screen, 1-click login buttons are provided to instantly log in as any persona without typing credentials).*

---

## 📍 Sample Bharuch Data & Intentional Duplicate Clusters

The portal includes 26 realistic developmental works located in **Bharuch, Ankleshwar, Vagra, Dahej PCPIR, Amod, Jambusar, Hansot, and Valia**.

5 pairs of overlapping projects are intentionally included so judges can immediately observe the AI Sentinel in action:
1. **Vagra Road Overlap (92% Match):** R&B Dept asphalt strengthening (`GJ-BH-2026-004`) vs. Panchayat Dept CC Road (`GJ-BH-2026-015`) on the exact same temple stretch.
2. **Ankleshwar Solar Street Lights (88% Match):** GIDC Colony solar installation (`GJ-BH-2026-007`) vs. DMF industrial ward illumination (`GJ-BH-2026-016`).
3. **Hansot Drainage Network (85% Match):** GWSSB underground sewage network (`GJ-BH-2026-009`) vs. Panchayat masonry drain construction (`GJ-BH-2026-017`).
4. **Amod Drinking Water Plant (86% Match):** DMF 10,000 LPH RO Plant (`GJ-BH-2026-011`) vs. Panchayat JJM RO unit (`GJ-BH-2026-018`).
5. **Valia Community Hall (79% Match):** Tribal Development cultural auditorium (`GJ-BH-2026-013`) vs. Panchayat Samaj Kalyan Bhavan (`GJ-BH-2026-019`).

---

## 📄 License & Attribution

Developed for the **Gujarat Seva First Innovation Challenge (SFIC) 2026–27** for the **District Development Office – Bharuch, Gujarat**.  
Licensed under the [Apache-2.0 License](LICENSE).
