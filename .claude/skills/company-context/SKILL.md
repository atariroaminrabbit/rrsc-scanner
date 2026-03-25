# Skill: RoaminRabbit Company Context

## When to use this skill
Read and apply this skill at the start of every session. This file provides essential context about who RoaminRabbit is, what they build, who they build for, and how their core products work. Use this to inform all product decisions, feature planning, UX recommendations, and technical scoping.

---

## Who is RoaminRabbit?

**RoaminRabbit** is a Singapore-based travel eSIM company founded in 2024.

**Mission:** Make staying connected globally easier for travelers.

**Brand identity:** RoaminRabbit is more than a connectivity product — it is a travel lifestyle and community brand that brings people together through shared interests in travel, culture, and social experiences.

**Website:** https://m.roaminrabbit.com/

**Platforms:**
- iOS (Swift, Objective-C, Xcode)
- Android (Kotlin, Android Jetpack, Android Studio)
- Website (web stack to be confirmed with developers)

**Tools & Services:**
- Analytics: Firebase
- Payments: Airwallex, PayPal
- Design: Figma
- Task Management: Linear
- Backend: To be confirmed with developers

---

## Target User

- **Primary user:** Solo travelers
- **Age range:** 20–45 year olds
- **Profile:** Young adults who travel frequently or aspire to, value convenience and connectivity, and are drawn to travel lifestyle communities and social experiences
- **Discovery channels:** Social media, company announcements, word of mouth

---

## Core Products

RoaminRabbit currently has two offerings on the app:

### 1. eSIMs

A marketplace for travelers to purchase and install eSIM data plans for 200+ countries worldwide.

**Key features:**
- Users can browse and explore plans before creating an account
- Plans are browsable by country/destination or region
- Users select their destination and preferred data plan
- Account creation is required before proceeding to checkout
- eSIMs are one-time purchases per destination
- Data top-ups are available for existing eSIMs
- Payments are processed via Airwallex and PayPal
- All purchased eSIMs and their installation statuses are visible on the **My eSIMs** page

**eSIM installation flow:**
After purchase, users install their eSIM via one of three methods:
1. **Direct install** — User taps 'Install' in the app, which deep-links to the device's Settings app to complete setup
2. **QR code** — User scans a QR code to install
3. **Manual** — User manually enters eSIM credentials

The app provides screenshot guides for all three methods to assist users through the process.

---

### 2. RoaminRabbit Social Club

A community platform that hosts curated meetups, social gatherings, and travel-related events for RoaminRabbit members.

**Key features:**
- All Social Club events are free to attend
- Events serve as a user acquisition strategy — users must create a RoaminRabbit account to register
- Users discover events via social media, company announcements, or word of mouth

**Social Club membership & event registration flow:**

1. **Discover** — User hears about an event through social media, announcements, or word of mouth
2. **Account creation** — User creates a RoaminRabbit account (required before registering for any event)
3. **Social Club membership approval** — After account creation, user must apply for Social Club membership by filling out additional profile details not collected during registration:
   - Name
   - Age
   - Gender
4. **Approval** — Once approved as a Social Club member, the user gains access to register for any RoaminRabbit event freely
5. **Event registration** — Approved members register for events directly in the app
6. **In-app confirmation** — After registering, the user receives an in-app confirmation ticket
7. **Day of event** — User presents their in-app ticket at the event

---

## Account Creation Flow

RoaminRabbit uses a streamlined, low-friction sign-up process:

- Users sign up via **phone number** or **Google Sign-In**
- Both methods are supported with **OTP (one-time password) verification**
- If the system detects an existing account under the provided credentials, the user is signed back in automatically
- If no account is found, a new account is created

**Information collected at account creation:**
- Phone number OR Google account

**Additional information collected for Social Club membership:**
- Name
- Age
- Gender

---

## Important Context for Feature Planning

Always keep these in mind when scoping any new feature or product:

- **Platform scope matters** — Always clarify upfront whether a feature is for iOS, Android, website, or all platforms. Android and iOS may have different implementation approaches.
- **Web/backend stack is unconfirmed** — Flag any feature that depends on the web or backend stack until this is confirmed with the development team.
- **Low-friction UX is a core value** — Account creation is intentionally simple (phone or Google only). Any new feature should respect this principle and avoid adding unnecessary steps for users.
- **Social Club is a user acquisition funnel** — Features that touch the Social Club flow directly impact RoaminRabbit's growth strategy. Changes here need extra care.
- **Payments involve Airwallex and PayPal** — Any feature touching the purchase or top-up flow must account for both payment providers and their respective edge cases.
- **Firebase is the analytics layer** — New features should consider what events need to be instrumented in Firebase to track user behavior.
- **Users are non-technical travelers** — All UX should be intuitive and require no technical knowledge. Avoid complexity in user-facing flows.
- **The user base is young adults (20–45)** — Design and copy should feel modern, friendly, and travel-inspired, consistent with the RoaminRabbit lifestyle brand.
