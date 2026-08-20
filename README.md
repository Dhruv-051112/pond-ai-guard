# Aqua AI Dashboard

Build a professional, modern, responsive web application frontend for my final-year engineering project:

Project Title:
AIoT-Based Aquaculture Monitoring and Edge AI Prediction System

IMPORTANT PROJECT METHODOLOGY

The current system uses an ESP32 as the main edge computing/controller device.

The current physical sensing system uses ONLY:

DS18B20 temperature sensor

TDS (Total Dissolved Solids) sensor

Do NOT add or show LDR, MQ-2, turbidity sensor, pH sensor, INA219, ACS712, SCT-013, or any other removed sensor.

The system performs Edge AI/ML-based water-quality analysis on the ESP32.

The system should display:

Temperature

TDS

Predicted Dissolved Oxygen (DO)

Biological Delta (Δ)

Overall water-condition status

Historical sensor readings

AI prediction information

Device/system status

Important: The current methodology does NOT include automatic aerator control. Do not add an automatic aerator/pump control feature.

The frontend is currently being developed independently of the backend/API. Therefore, use realistic MOCK DATA for now. Structure the code cleanly so the mock data can later be replaced by REST API responses without redesigning the UI.

TECHNOLOGY STACK

Use:

React

TypeScript

Vite

Tailwind CSS

Recharts for graphs/charts

Lucide React for icons

Create a clean component-based architecture.

Do not use Streamlit.

The application must be suitable for opening and further editing in VS Code.

DESIGN REQUIREMENTS

Create a premium dark-themed engineering/AIoT dashboard.

The visual style should be similar to a modern industrial IoT monitoring system.

Use:

Dark background

Dark cards/panels

Subtle borders

Professional typography

Cyan/blue/green accent colors

Clear warning/error colors

Soft shadows and subtle glow effects

Rounded cards

Clean spacing

Responsive layout

Avoid excessive gradients, excessive animations, cartoon-style graphics, or a generic template appearance.

The application should look like a real engineering product rather than a simple student HTML page.

MAIN NAVIGATION

Create a left sidebar navigation containing:

Dashboard

Live Monitoring

Water Quality

AI Prediction

Historical Data

Alerts

System Status

About Project

Include:

Project logo/icon

Project name

ESP32 device status

Online/Offline indicator

Sidebar collapse option

On mobile, convert the sidebar into a responsive menu.

1. DASHBOARD PAGE

Create a professional overview dashboard.

Top section:

AIoT Aquaculture Monitoring System

Subtitle:

"Edge AI-Based Real-Time Water Quality Monitoring"

Show:

Device status: ONLINE

ESP32 device ID

Last updated timestamp

System uptime

Data collection status

Create prominent metric cards for:

Temperature

Example:
28.4 °C

Show:

Current value

Normal range

Small trend indicator

Temperature icon

TDS

Example:
420 ppm

Show:

Current value

Normal/abnormal status

Trend indicator

Predicted Dissolved Oxygen

Example:
6.8 mg/L

Show:

Predicted DO

Status

AI/brain icon

Normal range

Biological Delta (Δ)

Example:
1.2 mg/L

Clearly explain:

Δ = Baseline DO − Actual/Predicted DO

Use a visual indicator showing whether Delta is within the acceptable threshold.

For the current demonstration, use:

Delta threshold = 2.0 mg/L

If Delta is below 2.0 mg/L:
Status = NORMAL

If Delta reaches/exceeds 2.0 mg/L:
Status = ATTENTION

Do not show an automatic aerator action.

WATER QUALITY OVERVIEW

Create a section displaying:

Temperature:
28.4 °C

TDS:
420 ppm

Predicted DO:
6.8 mg/L

Biological Delta:
1.2 mg/L

Overall condition:
NORMAL

Use professional status badges.

2. LIVE MONITORING PAGE

Create a live monitoring interface.

Show large real-time cards for:

Temperature

TDS

Predicted DO

Biological Delta

Include:

Last reading time

Device ID

Sensor status

Data update indicator

Create a real-time style chart showing temperature and TDS trends.

Use mock readings that change slightly over time to simulate live data.

Make it visually clear that these are currently simulated/mock readings.

3. WATER QUALITY PAGE

Create a detailed water-quality monitoring page.

Include separate sections for:

Temperature

Show:

Current temperature

Minimum

Maximum

Average

Normal operating range

Historical chart

TDS

Show:

Current TDS

Minimum

Maximum

Average

Historical chart

Dissolved Oxygen

Show:

Predicted DO

DO status

Historical prediction chart

Biological Delta

Show:

Current Delta

Threshold

Historical Delta chart

Status

Use clean charts and informative tooltips.

4. AI PREDICTION PAGE

Create a dedicated Edge AI/ML page.

Title:

Edge AI Prediction

Explain briefly:

"The ESP32 performs local AI/ML inference for water-quality analysis without requiring continuous cloud-based computation."

Display:

Model Input

Temperature

TDS

Model Output

Predicted Dissolved Oxygen

Biological Delta

Water-condition classification

Create a visual flow:

Temperature + TDS
↓
Edge AI Model
↓
Predicted DO
↓
Delta Calculation
↓
Water Condition

Also display:

Inference Location: ESP32 Edge Device

Cloud Dependency: Not Required for Inference

Do not claim a specific ML algorithm unless it is explicitly provided in the project data.

Do not mention XGBoost anywhere because it is not part of the current methodology.

Do not claim that Random Forest is used unless the model is explicitly configured in the code/data.

5. HISTORICAL DATA PAGE

Create a professional historical data section.

Include:

Date/time filter

Sensor selector

Data table

Temperature graph

TDS graph

Predicted DO graph

Delta graph

Use realistic mock historical data for at least the previous 24 hours.

The table should contain:

Timestamp | Temperature | TDS | Predicted DO | Delta | Status

Add:

Search

Filtering

Sorting

Pagination

6. ALERTS PAGE

Create an alerts/notifications page.

Examples:

Normal:
"Temperature within acceptable range."

Warning:
"Biological Delta approaching threshold."

Critical:
"Biological Delta exceeded configured threshold."

Clearly state that alerts are informational only in the current prototype.

Do NOT create automatic pump/aerator controls.

Include:

Alert severity

Timestamp

Sensor/parameter

Description

Resolved/Active status

Use realistic mock alerts.

7. SYSTEM STATUS PAGE

Create a system-health dashboard.

Show:

ESP32

Status: ONLINE

Temperature Sensor

Status: CONNECTED

TDS Sensor

Status: CONNECTED

Edge AI Model

Status: ACTIVE

Data Acquisition

Status: ACTIVE

API

Status: NOT CONNECTED / MOCK MODE

Database

Status: MOCK DATA

This is important because the backend/API will be connected later.

Add a clear banner:

Prototype Mode — Using Mock Sensor Data

This should make the current development stage transparent.

8. ABOUT PROJECT PAGE

Create a professional project information page.

Include:

Project Objective

Real-time monitoring and intelligent analysis of aquaculture water conditions using a low-cost ESP32-based edge computing platform.

Current Sensors

DS18B20 Temperature Sensor

TDS Sensor

Edge Device

ESP32

AI/ML

Local edge inference for predicting Dissolved Oxygen and deriving Biological Delta.

Biological Delta

Δ = Baseline DO − Actual/Predicted DO

Current System

Sensor Data
→ ESP32
→ Edge AI Processing
→ DO Prediction
→ Delta Calculation
→ Water Condition Assessment
→ Web Dashboard

Do not mention removed sensors or removed features.

MOCK DATA REQUIREMENTS

Create a centralized mock-data file/service.

Do NOT hard-code sensor values throughout individual UI components.

Create a clean data structure so that later the mock service can easily be replaced by an API service.

For example, conceptually:

sensorData = {
temperature,
tds,
predictedDO,
delta,
timestamp,
deviceId,
status
}

Historical data should be stored as an array of readings.

Create a separate service layer such as:

src/services/

with a mock data service.

Later, the API service can replace this without requiring major UI changes.

PROJECT STRUCTURE

Use a clean structure similar to:

src/
├── components/
├── pages/
├── layouts/
├── services/
├── data/
├── hooks/
├── types/
├── utils/
└── App.tsx

Keep components reusable.

Create reusable components for:

Metric cards

Status badges

Charts

Data tables

Sidebar

Header

Alert cards

Device status indicators

IMPORTANT BACKEND PREPARATION

Do NOT build the backend yet.

However, design the frontend so it can later communicate with REST APIs.

Create a service abstraction such as:

sensorService

with functions conceptually like:

getLatestSensorData()
getHistoricalSensorData()
getPrediction()
getAlerts()

For now these functions should return mock data.

Later they can be replaced with actual API calls.

Do not make the frontend dependent on the mock-data implementation.

API PLACEHOLDER

Add a configuration file for a future API base URL.

Example concept:

VITE_API_BASE_URL

Use a placeholder value for now.

Do not attempt to call a real API.

RESPONSIVENESS

The dashboard must work properly on:

Desktop

Laptop

Tablet

Mobile

Prioritize the desktop dashboard because it will be demonstrated during the project seminar.

PERFORMANCE

Keep the frontend lightweight.

Avoid unnecessary libraries.

Charts should be responsive.

Components should be reusable.

Do not add unnecessary backend functionality.

FINAL REQUIREMENT

The final result should look like a complete professional AIoT aquaculture monitoring application even though it is currently using mock data.

The application should be ready to:

Run locally in VS Code

Be pushed to GitHub

Later connect to a Python/REST backend

Later receive real ESP32 sensor data

Later replace mock data with real database/API data

Before finishing, verify that:

Navigation works

All pages load

Charts render

Mock data appears correctly

No broken links

No console errors

Responsive layout works

The application can run with npm install and npm run dev

Do not add features that are not part of the current methodology.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pond-ai-guard.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/1a759f16-58b8-4668-8f3a-699c8db5b886).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
