# BTRC NEIR Admin Portal

Administrative web application for the Bangladesh Telecommunication Regulatory Commission (BTRC) National Equipment Identity Register (NEIR).

## Stack

- React 19
- Vite 8
- Tailwind CSS v4
- Material UI (MUI)
- React Router
- Lucide React
- JavaScript / JSX

## Run locally

```bash
npm install
npm run dev
```

The local development server runs on port 3000.

## Build

```bash
npm run build
```

The production build is generated in `dist/`.

## GitHub Pages

The project is configured for the repository path `/NEIR/` and uses hash routing so GitHub Pages refreshes and deep links remain stable.

Live URL:

`https://shihab-tech04.github.io/NEIR/`

## Current routes

- `#/login`
- `#/dashboard`
- `#/special-registration`
- `#/lost-stolen`
- `#/device-deregister`
- `#/auto-registration`
- `#/role-management/parent`
- `#/role-management/permission`
- `#/role-management/service-action`
- `#/role-management/roles`
- `#/imei-check`
- `#/manufacturer-imei-upload`
- `#/support-ticket`
- `#/global-imei-block`
- `#/global-imei-block/list`
- `#/office/departments`
- `#/office/designations`
- `#/office/users`
- `#/office/users/new`
- `#/office/users/:id/edit`
- `#/msisdn-imei`

## Architecture

The interface is organized around reusable application primitives for navigation, forms, tables, overlays, feedback states, language preferences, and responsive behavior.

Data access is isolated behind the service layer so backend integration can be completed without rebuilding page-level UI. Authentication state is isolated in `AuthContext` for the same reason.

## Golden rule

**Never change the existing design system or any solved UI unless the user explicitly requests a redesign.** New functionality must be fitted into the existing components, spacing, typography, tables, cards, filters, drawers, modals, responsive behavior, themes, and interaction patterns. Preserve solved work and make the smallest safe change.

## Design system

- Primary NEIR teal palette
- Poppins for English
- Noto Sans Bengali for Bangla
- Shared MUI-backed form fields
- Shared responsive table workspace
- Desktop table to mobile record-card transformation
- Shared modal, drawer, status, feedback, and pagination patterns


### Typography density rule

- No readable UI text is smaller than 14px.
- Large displays use 16px for primary reading text, not as a blanket size for every label or table cell.
- Dense administrative UI (navigation, form labels, table headers/cells, badges and metadata) keeps a 14px minimum to preserve hierarchy and information density.
- Compact / Standard / Large adjust semantic type tokens rather than changing the root document font size.
