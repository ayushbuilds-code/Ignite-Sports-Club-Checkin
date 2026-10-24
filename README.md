# 🔥 IGNITE CLUB — Free Fire Tournament 2026

<p align="center">
  <strong>A modern esports tournament management and team check-in dashboard.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Esports-Free%20Fire-8B5CF6?style=for-the-badge" alt="Esports">
  <img src="https://img.shields.io/badge/Year-2026-06B6D4?style=for-the-badge" alt="2026">
  <img src="https://img.shields.io/badge/Interface-Dark%20Neon-111827?style=for-the-badge" alt="Dark Neon UI">
</p>

Ignite Club is a tournament operations dashboard designed to make esports event management faster, smoother, and more organized. It provides a centralized interface for managing registered teams, tracking player attendance, verifying team leaders, and monitoring tournament check-in progress.

Built for the **Ignite Club Free Fire Tournament 2026**, the dashboard combines a futuristic neon interface with practical registration desk tools.

## 📸 Dashboard Preview

<!-- Add your screenshot to public/screenshots/ignite-dashboard.png -->
<p align="center">
  <img src="public/screenshots/ignite-dashboard.png" alt="Ignite Club Free Fire Tournament Dashboard" width="100%">
</p>

*The dashboard screenshot above is displayed when the image file is added at the specified path.*

## ✨ Key Features

### 📊 Tournament Dashboard
- Total registered team count.
- Teams present and teams pending.
- Overall attendance percentage.
- Tournament lobby readiness progress.
- Tournament slot and group information.

### 👥 Team Management
- View registered teams in a card-based layout.
- Switch between Cards and Table views.
- Search by team name, team ID, or leader.
- Filter teams by attendance status.
- Display team leader details and squad roster.
- View tournament slot numbers and group assignments.

### 📸 Team Check-In & Verification
- Capture a team leader's photograph where camera check-in is implemented.
- Review a captured photograph before confirmation.
- Support manual verification at the registration desk where enabled.
- Record attendance status and check-in time.
- Prevent accidental duplicate check-ins where supported.
- Revert an attendance record when an organizer makes a mistake.

Photographs should only be captured with the leader's consent. Visual photo verification is not the same as automated facial recognition.

### 📡 Live Check-In Activity Feed
- Display recent team registration events.
- Show attendance verification activity.
- Track attendance reversals.
- Display the relevant team ID and team leader.
- Provide timestamps for recent actions.

### ⚡ Tournament Operations
- **Speed Desk Mode** for faster registration desk workflows.
- **Arena Stage** access for tournament display workflows.
- Quick access to team registration.
- Attendance and tournament controls in the admin interface.

### 🎨 Esports UI & Animation
- Dark, neon-inspired interface.
- Ignite Club branding.
- Rotating Ignite logo in the background.
- Purple, cyan, green, and amber accent colors.
- Responsive dashboard cards and panels.
- Animated visual elements designed for an immersive tournament experience.

## 🛠️ Technology Stack

The exact stack depends on the current implementation in the repository. For a typical Vite-based frontend, the technologies may include:

- **Frontend:** React
- **Language:** TypeScript or JavaScript
- **Build Tool:** Vite
- **Styling:** CSS or Tailwind CSS
- **Camera Access:** Browser MediaDevices API
- **Data Storage:** Browser storage or a backend database, depending on configuration
- **Deployment:** Vercel

Check `package.json` and the source files for the definitive list of dependencies and technologies used in this project.

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm, which comes with Node.js
- Git

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Navigate to the Project

```bash
cd YOUR_PROJECT_FOLDER
```

Replace `YOUR_PROJECT_FOLDER` with the actual directory name.

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Development Server

```bash
npm run dev
```

Open the local URL printed in your terminal. Vite commonly uses:

```text
http://localhost:5173
```

### 5. Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

Use the scripts defined in `package.json` if your project uses different commands.

## 🌐 Deployment

This project can be deployed on [Vercel](https://vercel.com/) if its build configuration is compatible.

1. Push the project to GitHub.
2. Sign in to Vercel.
3. Import the GitHub repository.
4. Configure the framework preset and build settings if necessary.
5. Deploy the application.
6. Open the generated deployment URL and test the dashboard.

For a typical Vite frontend:

| Setting | Value |
|---|---|
| Framework preset | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

These settings may need adjustment if the project uses a different framework, workspace, or deployment configuration.

**Important:** Camera access on deployed websites generally requires HTTPS. Also verify that browser storage, team records, and attendance events behave as expected in the deployed environment.

## 📁 Project Structure

The actual structure depends on the repository. A typical frontend application may resemble:

```text
ignite-club/
├── public/
│   └── screenshots/
│       └── ignite-dashboard.png
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── assets/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── package-lock.json
├── vite.config.ts
└── README.md
```

Do not create missing directories just to match this example. Adapt the structure to your actual project.

## 🧭 How to Use the Dashboard

1. Open the deployed application or run it locally.
2. Review the registered teams and tournament slots.
3. Search for the arriving team.
4. Open the team's check-in workflow.
5. Capture the leader's photograph or use manual verification if available.
6. Review the team and verification details.
7. Confirm attendance.
8. Monitor updated statistics and the live activity feed.
9. Correct mistakes using the attendance reversal feature, if enabled.
10. Review overall tournament readiness before the match begins.

## 🔐 Privacy & Data Handling

Team leader photographs and roster information may contain personal data.

- Obtain permission before photographing team leaders.
- Collect only the information required for tournament operations.
- Restrict access to administrative functions where possible.
- Avoid publishing private roster details or photographs without permission.
- Understand whether data is stored locally, in a database, or through an external service.
- Back up important attendance records if the application supports exports.
- Delete photographs and personal data when they are no longer required.

The actual storage and synchronization behavior depends on the implementation. A frontend-only application should not be assumed to synchronize data between multiple devices automatically.

## 🧪 Pre-Tournament Checklist

Before using the dashboard at a live event:

- [ ] Confirm all registered teams and leader details.
- [ ] Check tournament slots and group assignments.
- [ ] Test team search and status filters.
- [ ] Test adding and editing teams.
- [ ] Test camera permissions on the registration device.
- [ ] Verify photo capture and attendance confirmation.
- [ ] Test manual verification, if enabled.
- [ ] Confirm duplicate check-in handling.
- [ ] Test attendance reversal.
- [ ] Verify that the activity feed updates correctly.
- [ ] Test the deployed version on the actual tournament network.
- [ ] Confirm the behavior of data persistence and backups.

## 🛣️ Future Improvements

Potential improvements for future tournament editions include:

- Multi-organizer access with role-based permissions.
- Real-time synchronization across registration desks.
- QR-code-based team check-in.
- Exportable attendance and match reports.
- Dedicated audience and stream display.
- Player roster verification.
- Tournament bracket integration.
- Offline-ready check-in with safe synchronization.
- Audit logs for attendance changes.

These are possible future enhancements, not claims that all of them are already implemented.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Implement and test your changes.
4. Commit your work with a descriptive message.
5. Submit a pull request.

## 📜 License

A license has not been specified in this README. Add an appropriate license file if you intend to permit others to reuse, modify, or distribute the project.

## 👨‍💻 Credits

**Project:** Ignite Club — Free Fire Tournament 2026  
**Purpose:** Esports tournament administration and team check-in  
**Interface:** Dark neon esports dashboard with animated Ignite branding

---

<p align="center">
  <strong>🔥 IGNITE CLUB</strong><br>
  <em>Check In. Gear Up. Dominate the Arena.</em>
</p>
