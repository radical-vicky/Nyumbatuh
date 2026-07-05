# Ultrafy Fiber Network — Win-Win Platform

Full-stack Next.js (App Router) app. Property owners list buildings for free;
in exchange they make Ultrafy the exclusive fiber ISP once approved and live.

## Stack
- Next.js 14 (App Router) + Tailwind CSS
- PostgreSQL via Neon + Prisma ORM
- Cloudinary (property photos)
- Gmail SMTP + Nodemailer (notifications)
- JWT session auth (httpOnly cookie, `jose` — edge-compatible for middleware)

## 1. Install

```bash
npm install
```

## 2. Configure environment

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` / `DIRECT_URL` — from your Neon project (pooled + direct connection strings)
- `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — from cloudinary.com dashboard
- `GMAIL_USER` / `GMAIL_APP_PASSWORD` — a Gmail address + a Google **App Password** (not your normal password; requires 2FA enabled on the Google account)
- `JWT_SECRET` — any long random string (`openssl rand -base64 32`)
- `NOTIFY_TO_EMAIL` — where "new listing" alerts go (defaults to `GMAIL_USER`)

## 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

The seed creates an admin user from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`
in `.env` (defaults to `[email protected]` / `changeme123` — change this password
after first login by adding an owner-facing change-password flow, or by
re-running the seed with new env values).

## 4. Run it

```bash
npm run dev
```

- `/` — landing page
- `/properties` — public listings (only `APPROVED` properties show here)
- `/signup`, `/login` — property owner auth
- `/dashboard` — owner's own listings, create/edit, view status + inquiries
- `/admin/login`, `/admin` — staff review queue (approve/reject submissions)

## How the pieces connect

1. Owner signs up (`/signup`) → session cookie set.
2. Owner submits a property (`/dashboard/new`) → status `PENDING`, images
   uploaded client-side straight to Cloudinary via `/api/upload`, admin gets
   an email via `/api/properties` POST handler.
3. Admin reviews at `/admin`, clicks **Approve** or **Reject**
   (`/api/properties/[id]/approve|reject`) → owner gets an email either way.
4. Approved listings appear on `/properties` and are indexable/SEO-friendly
   (server-rendered, `revalidate = 60`).
5. A tenant fills out the inquiry form on a property page → `/api/inquiries`
   → owner gets an email with the tenant's contact info.
6. Ultrafy staff draft the exclusive-ISP `Contract` for the property from
   `/admin/[id]` and mark it `SENT` → the owner gets an email and signs it
   in-app at `/dashboard/[id]/contract` (see "Contract e-signature" below).

## Contract management

Admins manage the exclusive-ISP contract from each property's detail page:
`/admin/[id]` → "Manage & contract" link from the review queue. Set status
(DRAFT → SENT → SIGNED → ACTIVE → EXPIRED/CANCELLED), start/end dates, a
document URL (e.g. a signed PDF uploaded to Cloudinary or DocuSign link),
and terms/internal notes. `signedAt` is stamped automatically when status
moves to SIGNED or ACTIVE. This is manual data entry, not e-signature —
wire up DocuSign/HelloSign later if you want in-app signing.

## Rate limiting

`/api/auth/login`, `/api/auth/register`, and `/api/inquiries` are rate
limited per-IP (`lib/rate-limit.ts`): 10 login attempts/15min, 5
signups/hour, 8 inquiries/10min. This is an **in-memory** limiter — correct
for a single server instance, but it won't share state if you scale to
multiple instances behind a load balancer. Swap in Upstash Redis (or
similar) at that point; the `rateLimit()` function signature is a drop-in
replacement point.

## Password reset & account settings

- `/forgot-password` → `/api/auth/forgot-password` issues a one-time,
  hashed, 1-hour token (`PasswordResetToken` model) and emails a reset link.
  The response is intentionally identical whether or not the email exists,
  to prevent account enumeration.
- `/reset-password?token=...` → `/api/auth/reset-password` verifies the
  token and sets a new password.
- `/account/change-password` → `/api/auth/change-password` for logged-in
  owners/admins who know their current password (linked from the navbar as
  "Settings").

## Image cleanup

Editing a listing now persists photo changes immediately instead of only on
form save: `ImageUploader` calls `POST /api/properties/[id]/images` right
after a Cloudinary upload to attach it to the property, and
`DELETE /api/properties/[id]/images/[imageId]` on removal, which deletes the
Cloudinary asset **and** the DB row together. (Uploads made while creating a
brand-new listing still batch-attach on submit, since the property doesn't
exist yet to attach to.)

## Contract e-signature (in-app, no third party)

Admins move a contract to `SENT` from `/admin/[id]` — this emails the owner
a link to `/dashboard/[id]/contract`. There, the owner reads the terms and
types their full legal name to sign; this sets status to `SIGNED`, stamps
`signedAt`, and records the typed name + IP address (`ownerSignedName`,
`ownerSignedIp` on `Contract`) as a lightweight clickwrap-style signature.
This is legally lighter-weight than DocuSign/HelloSign's certificate-backed
signatures — swap in one of those if you need stronger evidentiary backing
for a specific market, but this is a real, working signing flow with no
external API keys required.

## Admin access

There's no separate "admin password" baked in anywhere — access comes from
one of two places:

1. **The seeded account** — after `npx prisma db seed`, log in at
   `/admin/login` with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from
   `.env` (defaults to `[email protected]` / `changeme123`).
2. **Promote an existing account** — if you already signed up as an owner
   and want that account to be admin instead:
   ```bash
   npm run make-admin -- [email protected]
   ```
   (or open `npx prisma studio`, find the user in the `User` table, and
   change `role` to `ADMIN` by hand).

Logging in at `/admin/login` with a non-admin account will correctly show
"This account does not have admin access" — that's the app working as
intended, not a bug; it just means you're using an `OWNER`/`TENANT` login
there instead of an `ADMIN` one.

## 3b. When you pull schema updates

Anytime you get an updated `schema.prisma` from further work on this project
(new fields/models), re-run:
```bash
npx prisma migrate dev --name <short description>
```
Prisma only applies what changed, so this is safe to run repeatedly.

## Pinterest-style masonry listings

`/properties` and the homepage's "Featured properties" section now render
with CSS-columns masonry (`columns-2/3/4` + `break-inside-avoid`) instead of
a uniform grid, so cards take their natural photo aspect ratio like a
Pinterest board rather than being cropped to a fixed height. `PropertyCard`
uses a plain `<img>` for the cover photo instead of `next/image` for this
reason — masonry needs the browser to lay out each card at its real aspect
ratio, and `next/image` needs a known width/height ahead of time.

## Multi-select uploads, drag-to-reorder, and video

`ImageUploader` (used on both "list a new property" and "edit listing"):

- **Multi-select**: the file picker already accepts multiple files in one
  go (`multiple` + a loop that uploads them in order).
- **Reorder by drag-and-drop**: drag any thumbnail onto another to swap its
  position. In edit mode this calls `PATCH /api/properties/[id]/images/reorder`
  immediately to persist the new order (and re-picks whichever item is now
  first as the cover photo); for a not-yet-created listing it just reorders
  local state until you submit.
- **Video, optional**: the picker now accepts `image/*,video/*`. Videos
  upload to Cloudinary as `resource_type: "video"` (up to 60MB vs 8MB for
  photos) and render with a native `<video>` player — a play-icon overlay
  in thumbnails, and full controls on the property detail page and card.
  This required one schema change: `PropertyImage` gained a `type` field
  (`MediaType`: `IMAGE` | `VIDEO`) — see the migration note above.

Anyone can browse `/properties` and read full listing details with zero
login — no gate on viewing. The moment someone wants to **contact the
owner or get more info**, `InquiryForm` on the property page swaps to a
"Sign up / Log in to contact owner" prompt. `/api/inquiries` POST requires
a session and trusts the logged-in account's name/email rather than
free-text input, which is both more secure and matches the
browse-then-checkout pattern of Kilimall/most marketplaces.

Signup now supports two roles via a toggle on `/signup`:
- **"I'm looking for a property"** → `TENANT` role, redirected to
  `/properties` after signup.
- **"I'm listing a property"** → `OWNER` role, redirected to `/dashboard`.

`/dashboard` is restricted to `OWNER`/`ADMIN` in middleware — a `TENANT`
account gets redirected to `/properties` if they try to reach it directly.

## Homepage hero carousel

`HeroImage` model + `/admin/hero` lets an admin upload apartment/building
photos (via Cloudinary) that auto-rotate every 5 seconds on the homepage
hero with a crossfade, gradient overlay, headline, and floating glass stat
chips. If no hero images have been uploaded yet, it falls back to a plain
gradient so the homepage never looks broken. `app/page.tsx` also now pulls
in up to 3 real "Featured properties" beneath the hero, pulling straight
from the same `Property` data as `/properties`.

## 3D hover polish

`components/TiltWrapper.tsx` gives property cards a subtle mouse-tracked
3D tilt + glare effect on hover (`PropertyCard` is wrapped in it) — pure
CSS transforms driven by mouse position, no extra dependencies.

## What's intentionally left as a next step

- **Video thumbnails/streaming optimization**: videos currently play the
  original upload directly; Cloudinary can auto-generate poster-frame
  thumbnails and adaptive-bitrate streaming if video usage grows and load
  times become a concern.
- **Stronger e-signature evidence** (certificate-backed audit trail via
  DocuSign/HelloSign) if the current typed-name + IP record isn't enough
  for your legal needs.
- **Multi-instance rate limiting**: swap `lib/rate-limit.ts`'s in-memory
  store for Redis (e.g. Upstash) if you scale beyond one server instance.

## Deploying

Works on Render or Cloudflare Pages (Next.js runtime). Set the same env vars
in your host's dashboard, and make sure the build command runs
`prisma generate` (already wired into `npm run build`) before `next build`.
