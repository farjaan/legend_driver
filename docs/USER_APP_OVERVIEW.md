# Legend Car Rental — User App Overview

> **Source repo:** `/Users/farjaanpatel/legend-car-rental`  
> **Purpose:** Customer-facing mobile app — browse, book, pay, manage rentals.  
> **Audience:** Product + Driver app team — reference when building `LegendDriver`.  
> **Last reviewed:** May 2026

---

## 1. Summary

| Item | Detail |
|------|--------|
| App name | Legend Car Rental |
| Role | **Customer / hirer** |
| Stack | React Native **0.82**, React 19, TypeScript |
| State | **Zustand** (+ AsyncStorage persist on auth/settings) |
| API | **Axios** → `/User/Api/*` |
| Navigation | React Navigation 7 (native stack + bottom tabs) |
| i18n | **i18next** — `en` + `ar` (RTL) |
| Maps | react-native-maps, Google Places (MapPicker) |
| Payments | Server-driven **Noon** (WebView from `InitiatePayment`) |

**Driver app alignment:** User app **reads** vehicle handover fields (`checkout_*`, `check_in_*`) on Booking Overview. It does **not** write them. Driver app will **produce** that data.

---

## 2. Repository layout

```
legend-car-rental/
├── android/ ios/              # Flavors: development, staging, production
├── env/                       # .env.development | .staging | .production
├── docs/                      # handover, API evidence, payments
├── src/
│   ├── api/                   # models, services, urls, interceptors
│   ├── features/              # Screens by domain
│   ├── store/                 # Zustand stores
│   ├── hooks/
│   ├── navigation/
│   ├── i18n/locales/          # en.json, ar.json
│   ├── services/              # notifications, analytics, offline queue
│   ├── components/
│   └── config/
└── App.tsx
```

**Key paths**

| Area | Path |
|------|------|
| Navigator | `src/navigation/AppNavigator.tsx` |
| Endpoints | `src/api/urls/endpoints.ts` |
| Base URL | `src/api/urls/baseURL.ts`, `src/config/buildEnv.ts` |
| Booking models | `src/api/models/booking.models.ts` |
| Booking API | `src/api/services/bookingService.ts` |
| Create booking | `src/hooks/useBooking.ts` |
| Booking store | `src/store/bookingStore.ts` |
| API handover doc | `docs/handover/02-api.md` |

---

## 3. Environments & API base

| Environment | Default `API_BASE_URL` |
|-------------|------------------------|
| Development | `https://legendapi.andhera.in` |
| Staging | `https://admin-portal-stg.legendrentacar.com` |
| Production | `https://admin-portal.legendrentacar.com` |

All mobile paths are under **`/User/Api/...`**.  
Webhooks and admin APIs are **not** used by the user app (see `docs/handover/02-api.md`).

---

## 4. Authentication & onboarding

### Login (phone OTP)

| Step | Implementation |
|------|----------------|
| UI | `src/features/auth/Login/index.tsx` |
| Flow | Country (+971 default) → encrypt phone → `sendLoginOTP` → OTP modal → `verifyLoginOTP` |
| APIs | `POST /User/Api/sendLoginOTP`, `verifyLoginOTP` |
| Tokens | JWT access + refresh; `x-refresh-token` + `x-session-id` on refresh |
| Store | `src/store/authStore.ts` |

### Signup & KYC

| Screen | Path |
|--------|------|
| Signup / personal info | `src/features/auth/Signup/index.tsx` |
| KYC (booking flow) | `src/features/booking/Kyc/` |
| Document APIs | `updateUserDocuments`, `fetchUserKycDetails`, `checkUserDocStatus` |

**KYC documents (customer):** passport, Emirates ID, driving license (encrypted upload fields).

### Onboarding splash

- `Onboarding` screen exists but cold start is typically **Splash → Demo** (3s), not forced onboarding.

### Language (EN / AR)

| Item | Path |
|------|------|
| Locales | `src/i18n/locales/en.json`, `ar.json` |
| Init | `src/i18n/index.ts` (device locale → ar or en) |
| Persist | `src/store/languageStore.ts` |
| Hook | `src/hooks/useLanguage.ts` (`isRTL`, `t()`) |

RTL is applied across major screens. Settings may not expose full language toggle in all builds — infrastructure is ready.

---

## 5. Navigation & screens

### Root flow

```
Splash → Demo (hub) OR Main tabs
         ↓
    Login / Signup / CarDetail / Payment / KYC / BookingOverview ...
```

### Main tabs

| Tab | Screen |
|-----|--------|
| Home | Car listing, filters, promos |
| My Bookings | Booking list by status filter |
| Profile | Account, settings, support |

### Important stack screens

| Route | Feature | Notes |
|-------|---------|-------|
| `Demo` | Marketplace demo hub | Default after splash |
| `CarDetail` | Plan, tenure, insurance, delivery mode | |
| `MapPicker` | Pickup vs paid delivery pin | Free/paid location APIs |
| `Payment` | Pricing + pay | Noon WebView |
| `Kyc` | Document upload if required | |
| `BookingOverview` | Full booking + handover read-only | **checkout_*** / **check_in_*** |
| `DepositHistory` | Deposit auth / retries | |
| `ServiceRequest` | Standalone | **Stub — no API submit** |
| `BreakdownRequest` | Standalone | **Stub — no API submit** |
| `CollectionRequest` | Standalone | **Stub — no API submit** |
| `ViewServiceStatus` | Issue ticket thread | **API wired** |
| `SubmitIssue` | Profile support | **API wired** |

Navigator: `src/navigation/AppNavigator.tsx`

---

## 6. Booking product (customer)

### Rental categories (`booking_type` on `addBooking`)

| Category | `booking_type` value |
|----------|----------------------|
| Short-term | `Daily/Weekly` |
| Monthly | `Monthly Plans` |
| Long lease | `Lease` |
| Lease-to-own | `Lease-to-own` |

### Logistics: pickup vs delivery

| UI mode (CarDetail) | Backend `delivery_status` |
|-------------------|---------------------------|
| Counter / branch pickup | `self_pickup` |
| Doorstep / paid delivery | `paid_delivery` |

**Required on create:** `latitude`, `longitude`, `pick_up_location`, `drop_off_location`, addresses.

Map picker: `src/features/maps/MapPickerScreen.tsx`  
- Tab `pickup` → free locations (`fetchFreelocationList`)  
- Tab `delivery` → paid pin (`fetchPaidlocationList`, `save_user_location`)

### Return location

- Same or different drop-off via `bookingStore` (`returnSameLocation`, `returnLocation`).

### “Book with driver” (chauffeur)

| Item | Status in user app |
|------|-------------------|
| Store flag | `bookWithDriver` in `bookingStore.ts` |
| UI | Shown on Confirmation / invoice text |
| `addBooking` payload | **Not sent** — no dedicated API field in mobile |
| Live trip / driver assign | **Not implemented** |

Driver app + backend must own chauffeur product; user app will consume status later.

### “Additional driver” add-on

- i18n + store label; not clearly mapped to a dedicated API field in `useBooking.ts`.

---

## 7. Booking lifecycle (customer view)

### List filters (`fetchBookingList` → `type`)

`all` | `pending` | `confirm` | `active` | `completed` | `cancelled` | `closing` | `increase_duration` | `replacement` | `overdue`

My Bookings tabs: `src/features/tabs/MyBookings/`

### Backend `booking_status` (examples)

- `BOOKING_PENDING`, `BOOKING_CONFIRMED`, `BOOKING_COMPLETED`, `BOOKING_CANCELLED`
- Extension flows: status may include `extension` / `EXTENSION_REQUESTED`

### Customer actions (from Booking Overview)

| Action | API |
|--------|-----|
| Cancel | `requestBookingCancellation` |
| Extend | `requestBookingExtension` |
| Close early | `requestBookingClosure` (+ penalty/refund from API) |
| Replace vehicle | `requestVehicleReplacement` |
| Service (modal) | `submitIssues` with booking id |

**Note:** “Request Collection” quick action uses **vehicle replacement** API, not a physical collection job.

Derived UI logic: `src/hooks/useBookingOverviewDerived.ts`

---

## 8. Handover contract (user reads — driver writes)

Defined on `BookingDetails` in `src/api/models/booking.models.ts`.

### Check-out (delivery / handover to customer)

| Field | Type | User UI |
|-------|------|---------|
| `checkout_oldmeter_reading` | number | Odometer (km) |
| `checkout_fuel_level` | string | Fuel level |
| `checkout_car_checklist` | string[] | Checklist items |
| `checkout_existing_scratches` | string | Scratches notes |
| `checkout_car_photos` | `{ image }[]` | Photo gallery |
| `checkout_customer_signed` | boolean | Signed Yes/No badge |

Display: `src/features/booking/BookingOverview/components/BookingOverviewCheckoutSection/`

### Check-in (return / collection)

| Field | Type | User UI |
|-------|------|---------|
| `check_in_branch_location` | string | Branch |
| `check_in_fuel_level` | string | Fuel |
| `check_in_damages` | `{ description, cost }[]` | Damage list |
| `check_in_car_photos` | `CarPhoto[]` | Photos |
| `check_in_customer_signed` | boolean | Signed |
| `check_in_final_odometer` | number | Final km |
| `check_in_traffic_fines` | number | Fines (if > 0) |
| `check_in_total_damages` | number | Damage total |
| `check_in_final_payable` | string | In model; limited UI |

Display: `src/features/booking/BookingOverview/components/BookingOverviewCheckinSection/`

Populated via **`POST /User/Api/fetchBookingDetails`** — expected source: **driver app or admin**, not customer app.

---

## 9. Maps & location (user app)

| Capability | Status |
|------------|--------|
| Map picker for booking | Yes |
| Geolocation permission | Yes |
| Saved user address on booking | `userLocation` (apartment, address, landmark) |
| Coords on booking | `latitude`, `longitude` (hidden on overview UI) |
| Live driver tracking | **No** |
| OTP / QR handover | **No** |

---

## 10. Payments & charges

### Methods

`Pay_at_Center` | `Card` | `Apple_Pay`

### Flow

1. `addBooking` → `booking_id`
2. `InitiatePayment` → checkout URL (Noon WebView)
3. `fetchPaymentStatus` / `BookingPayment`
4. Saved cards, deposits, installments, retries

### Charge fields on booking

`subtotal_amount`, `discount_amount`, `tax_amount`, `insurance_amount`, `additional_charges`, `pickup_price`, `dropoff_price`, `total_amount`, `deposite_amount`, `cancellation_charges`, `refund_amount`

### Penalties (customer-visible)

- Early closure: `penalty_fee`, `estimated_refund` (closure modals)
- Check-in: `check_in_traffic_fines`, `check_in_total_damages`

Docs: `docs/NOON_PAYMENTS_EVALUATE_RESPONSE_OVERVIEW.md`

---

## 11. Support & issues

| Feature | Wired to API? | Path |
|---------|---------------|------|
| Submit issue | Yes | `src/features/profile/SubmitIssue/` |
| Issue ticket chat | Yes | `IssueTicketDetail`, `ViewServiceStatus` |
| Service request modal (from booking) | Yes | `ServiceRequestModal` → `submitIssues` |
| Help center tickets | Yes | Profile HelpCenter flow |
| Standalone Breakdown screen | **No (stub)** | `features/booking/BreakdownRequest` |
| Standalone Collection screen | **No (stub)** | `features/booking/CollectionRequest` |
| Standalone Service screen | **No (stub)** | `features/booking/ServiceRequest` |

---

## 12. Vehicle data on booking

`vehicle_inventory` on `BookingDetails`:

- `branch_name`, `make`, `model`, `year`, `plate_number`, `vin`, `color`, `transmission`, `fuel_type`, etc.

Driver job detail should show the same vehicle identity fields for consistency.

---

## 13. What user app does NOT have (driver app scope)

These are **explicit gaps** — driver app must implement (initially with **dummy data**):

- Driver login / employee ID
- Job inbox, accept/reject
- Live location / “driver on the way” (user app has no consumer UI yet)
- OTP / QR handover verify
- Trip timer, chauffeur trip flow
- Ops / dispatch chat
- Driver penalties / ratings workflow
- Job status FSM: Assigned → En route → Arrived → Handover complete
- Writing `checkout_*` / `check_in_*`
- Shift online/offline
- Driver KYC (license, fleet vehicle authorization)

---

## 14. API endpoint catalog (user — reference)

Full list: `src/api/urls/endpoints.ts`

### Auth

- `sendLoginOTP`, `verifyLoginOTP`, `refreshToken`, `userSignup`, `verifyOTP`, `logoutUser`

### Booking (most relevant for driver alignment)

| Endpoint | Purpose |
|----------|---------|
| `addBooking` | Create rental |
| `fetchBookingList` | List by status type |
| `fetchBookingDetails` | Detail + handover fields |
| `requestBookingCancellation` | Cancel |
| `requestBookingExtension` | Extend |
| `requestVehicleReplacement` | Swap (not physical collection) |
| `requestBookingClosure` | Early close |

### Support

- `fetchIssue`, `submitIssues`, `createIssueTicket`, `fetchUserIssueTickets`, `sendIssueTicketMessage`

### Locations

- `fetchFreelocationList`, `fetchPaidlocationList`, `save_user_location`

---

## 15. Stores (Zustand) — quick index

| Store | Role |
|-------|------|
| `authStore` | Session, tokens, user |
| `bookingStore` | Selection, pricing, `bookWithDriver`, locations |
| `languageStore` | `en` \| `ar` |
| `kycStore` | Document flow |
| `paymentStore` | Payment state |
| `supportStore` | Issues |
| `notificationsStore` | Push inbox |
| `homeStore` / `carMetaStore` | Catalog |

---

## 16. Alignment checklist for driver team

When implementing driver features, keep **field names and semantics** identical to user `BookingDetails` for:

- [ ] All `checkout_*` fields on delivery handover
- [ ] All `check_in_*` fields on return
- [ ] `booking_reference`, vehicle plate/make/model
- [ ] `delivery_status`, addresses, coords (for maps)
- [ ] `booking_status` vs separate **job_status** (recommend separate job entity in backend)

User app will continue to **display** handover blocks on Booking Overview once driver submits data via future Driver API.

---

## 17. Related documents

| Document | Location |
|----------|----------|
| Driver app build spec | `LegendDriver/docs/DRIVER_APP_SPEC.md` |
| Mobile API handover | `legend-car-rental/docs/handover/02-api.md` |
| Contract evidence | `legend-car-rental/docs/D1_BACKEND_CONTRACT_MAPPING_EVIDENCE.md` |

---

*This file should be updated when the user app gains driver-facing consumer features (e.g. live tracking on Booking Overview).*
