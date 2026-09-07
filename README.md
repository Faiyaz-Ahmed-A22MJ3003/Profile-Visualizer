# Kasatria Profile Visualizer

An interactive 3D web application built with **Next.js**, **Three.js**, and the **Google Sheets API**. The application authenticates users via Google OAuth, retrieves profile data from a Google Sheet, and renders interactive 3D profile cards across four spatial layout configurations.

---

## What the Project Does

The Kasatria Profile Visualizer authenticates users using Google OAuth 2.0 to access read-only profile records stored in a Google Sheet.

Upon successful authentication, the application parses the sheet data into structured profile objects and renders them as interactive DOM elements in a 3D scene using Three.js `CSS3DRenderer`.

Users can inspect profiles, switch between geometric layouts, manipulate the 3D camera, manually rotate the visualization, slice grid layers, and view color-coded financial metrics.

---

## Main Features

- **Google OAuth Authentication**  
  Login integration using `@react-oauth/google` requesting the read-only Google Sheets scope:
  `https://www.googleapis.com/auth/spreadsheets.readonly`

- **Live Google Sheets Ingestion**  
  Fetches and parses up to 200 profile rows from Google Sheets.

- **Dynamic Net Worth Color-Coding**
  - **Red:** Net worth < $100,000
  - **Orange:** Net worth $100,000 – $200,000
  - **Green:** Net worth > $200,000

- **4 Visualization Modes**  
  Smooth animated transitions between:
  - Table
  - Sphere
  - Helix
  - Grid

- **3-Axis Manual Rotation Controls**  
  Independent X, Y, and Z rotation sliders allow the visualization to be manually oriented.

- **Grid Layer Slicing**  
  A dedicated depth control can be used to isolate specific planes in Grid mode.

- **Camera & Rotation Reset**  
  The Reset control returns the camera position and model orientation to their default states.

- **Interactive Navigation**  
  Uses Three.js `TrackballControls` for mouse-based camera navigation combined with keyboard shortcuts for switching layouts.

---

## Technology Stack

| Component | Technology / Library |
| :--- | :--- |
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI Library** | [React 19](https://react.dev/) |
| **3D Rendering** | [Three.js](https://threejs.org/) (`CSS3DRenderer`, `TrackballControls`) |
| **Animations** | [@tweenjs/tween.js](https://github.com/tweenjs/tween.js/) |
| **Authentication** | [@react-oauth/google](https://www.npmjs.com/package/@react-oauth/google) |
| **Language** | TypeScript |
| **Data Source** | Google Sheets API |

---

## Project Structure

```text
├── components/
│   ├── fetchSheetsData.tsx       # Google Sheets API integration and data parsing
│   ├── GoogleAuthProvider.tsx    # OAuth Provider wrapper component
│   ├── Login.tsx                 # Authentication landing interface
│   └── Visualization_3.tsx       # Three.js 3D engine, layout algorithms & control panel
├── globals.css                   # Visual theme, overlay controls & CSS3D card styles
├── layout.tsx                    # App root layout with font and OAuth provider integration
├── page.tsx                      # Main view managing login and visualization state
├── next.config.ts                # Next.js environment configuration
└── package.json                  # Dependencies and npm script definitions
```

---

## Google OAuth Setup

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Select or create a Google Cloud project.
3. Navigate to **Google Auth Platform** and configure the OAuth application.
4. Configure the application for the appropriate user type.
5. Navigate to **Clients** and create an OAuth client.
6. Set the **Application type** to **Web application**.
7. Under **Authorized JavaScript origins**, add the local development origin:

   ```text
   http://localhost:3000
   ```

8. Add the production deployment domain under **Authorized JavaScript origins**.
9. Save the configuration and copy the generated **Client ID**.
10. Configure the required Google Sheets read-only scope:

   ```text
   https://www.googleapis.com/auth/spreadsheets.readonly
   ```

> **Security:** Do not commit OAuth secrets, access tokens, or other credentials to the repository.

---

## Google Sheets API Setup

1. In the Google Cloud Console, navigate to **APIs & Services → Library**.
2. Search for **Google Sheets API**.
3. Click **Enable**.
4. Configure the OAuth application and request the read-only Sheets scope:

   ```text
   https://www.googleapis.com/auth/spreadsheets.readonly
   ```

5. Grant the appropriate user accounts access to the spreadsheet if spreadsheet permissions are restricted.
6. Configure the application with the target spreadsheet and sheet/tab used by the data-fetching component.

---

## Required Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

The actual Client ID should be supplied through your environment configuration rather than hard-coded into application source files.

---

## Google Sheet Data Format

The application expects six columns containing the profile information.

| Index | Attribute | Type | Description |
| :---: | :--- | :--- | :--- |
| 0 | **Photo** | `string` | Public image URL for the profile avatar |
| 1 | **Name** | `string` | Full name |
| 2 | **Age** | `number / string` | Profile age |
| 3 | **Country** | `string` | Country name |
| 4 | **Interest** | `string` | List or description of interests |
| 5 | **Net Worth** | `string / number` | Financial value parsed by the application |

The application is designed to fetch up to **200 profiles**.

---

## Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create `.env.local` and add the Google OAuth Client ID:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 3. Run the Development Server

```bash
npm run dev
```

### 4. Open the Application

Navigate to:

```text
http://localhost:3000
```

---

## Available NPM Commands

### Development

```bash
npm run dev
```

Starts the Next.js development server.

### Production Build

```bash
npm run build
```

Creates an optimized production build.

### Production Server

```bash
npm run start
```

Starts the application using the production build.

### Linting

```bash
npm run lint
```

Runs the project's linting configuration.

---

## How the 3D Visualization Works

The application uses Three.js to create a 3D visualization while keeping the profile cards as HTML elements.

### CSS3DRenderer

Three.js `CSS3DRenderer` transforms HTML elements into `CSS3DObject` nodes and positions them in 3D coordinate space. This allows the profile cards to retain their HTML/CSS appearance while being manipulated as objects within the Three.js scene.

### Layout Targets

Each profile is assigned a target position and orientation for every available visualization mode.

When the user switches layouts, the application interpolates the current position and rotation of each profile card toward its corresponding target.

### Tween.js Animation

`@tweenjs/tween.js` is used to create smooth transitions between layouts by interpolating profile positions and rotations.

### Visualization Group

The profile objects are contained inside a dedicated visualization group. This allows the entire model to be manually rotated independently from the camera.

---

## Available Layouts

### Table

Arranges all profile cards into a **20 × 10** two-dimensional matrix.

The cards are positioned evenly across the X and Y axes.

### Sphere

Distributes profile cards across the surface of a 3D sphere, creating an orbital spherical arrangement.

### Helix

Arranges the profiles along a **vertical double helix**, with two strands winding around a central vertical axis.

### Grid

Arranges the profiles into a **5 × 4 × 10** three-dimensional grid.

The Grid layout can be explored using the depth/layer controls to isolate specific planes.

---

## Controls & Shortcuts

### Mouse Controls

| Action | Control |
| :--- | :--- |
| **Rotate View** | Left Click + Drag |
| **Zoom In / Out** | Mouse Wheel |
| **Pan View** | Right Click + Drag |

### Keyboard Shortcuts

| Key | Action |
| :---: | :--- |
| `T` | Switch to **Table** layout |
| `S` | Switch to **Sphere** layout |
| `H` | Switch to **Helix** layout |
| `G` | Switch to **Grid** layout |
| `R` | Reset camera position and model rotation |

### Rotation Controls

The model can be manually rotated using the three axis sliders:

- **X** — Rotate around the X axis
- **Y** — Rotate around the Y axis
- **Z** — Rotate around the Z axis

The values are displayed in degrees and can be adjusted independently.

### Reset Functionality

The Reset control returns the camera to its default position and target while resetting the model's manual X, Y, and Z rotation values to `0°`.

The currently selected visualization layout is preserved.

Reset can be triggered using either:

- The **Reset Camera** button
- The `R` keyboard shortcut

---

## Net Worth Visualization

Profile cards are color-coded according to their net worth:

| Color | Net Worth |
| :--- | :--- |
| 🔴 **Red** | Below $100,000 |
| 🟠 **Orange** | $100,000 – $200,000 |
| 🟢 **Green** | Above $200,000 |

This provides a quick visual indication of the financial category of each profile while exploring the 3D visualization.

---

## Google OAuth Production Configuration

For the deployed application to be accessible to users outside the original Google Workspace organization, the Google OAuth application must be configured for external users rather than being restricted to an internal organization.

The production OAuth configuration should include:

- The correct external user configuration
- The production Vercel origin
- The required Google Sheets read-only scope
- The appropriate OAuth publishing/verification configuration where required

Users must still successfully authenticate with Google and receive the permissions requested by the application before profile data can be retrieved.

---

## Limitations & Configuration Notes

- **Maximum Data Size:** The application is designed around a maximum of 200 profile records.
- **Google Account Requirement:** Users must authenticate with a Google account.
- **Google Sheets Permissions:** The authenticated user must be able to access the spreadsheet according to its configured permissions.
- **Column Ordering:** The data parser depends on the expected column ordering and structure described above.
- **Internet Connection:** Profile images and Google Sheets data require network access.
- **OAuth Configuration:** The application's Google OAuth configuration must contain the correct authorized origins for both local development and production.
- **API Access:** The Google Sheets API must remain enabled for the Google Cloud project used by the application.

---

## Project Purpose

This project demonstrates the integration of:

- Modern React/Next.js development
- Google OAuth authentication
- Google Sheets API data ingestion
- TypeScript
- Three.js 3D visualization
- CSS3D rendering
- Interactive camera controls
- Animated 3D transformations
- Manual 3D model manipulation
- Vercel deployment

The result is an interactive profile visualization system that combines live cloud-hosted data with an animated 3D interface.
