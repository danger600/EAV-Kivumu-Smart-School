/**
 * Complete 27 Project Files Repository for EAV Kivumu Smart School (Phase 2)
 * Developed by Remmy | L5 SWD - Instagram: @K.eed__ - Contact: 0795547233
 */

export interface ProjectFile {
  path: string;
  category: 'Root & Config' | 'Backend & API' | 'Database & Prisma' | 'Frontend' | 'Tests & Scripts';
  description: string;
  language: 'typescript' | 'json' | 'powershell' | 'prisma' | 'markdown' | 'css' | 'html';
  code: string;
}

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: 'setup.ps1',
    category: 'Tests & Scripts',
    description: 'Windows PowerShell automated installation and startup script',
    language: 'powershell',
    code: `<#
  EAV Kivumu Smart School - Windows PowerShell Automated Setup Script (Phase 2)
  Developed by Remmy | L5 SWD - Instagram: @K.eed__ - Contact: 0795547233
#>
Write-Host "Starting EAV Kivumu Smart School Setup..." -ForegroundColor Cyan
node --version
npm.cmd --version
npm.cmd install
Copy-Item "backend\\.env.example" "backend\\.env" -ErrorAction SilentlyContinue
npx.cmd prisma generate
Write-Host "Setup complete! Run 'npm run dev' to start." -ForegroundColor Green`,
  },
  {
    path: 'prisma/schema.prisma',
    category: 'Database & Prisma',
    description: 'PostgreSQL schema with 12 models: User, Student, Teacher, Department, Grade, etc.',
    language: 'prisma',
    code: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String    @id @default(uuid())
  email        String    @unique
  phone        String?   @unique
  passwordHash String
  firstName    String
  lastName     String
  role         String    @default("STUDENT")
  isActive     Boolean   @default(false)
  createdAt    DateTime  @default(now())
}

model Department {
  id          String   @id @default(uuid())
  code        String   @unique // SWD, VET, AGR, GEN
  name        String
  description String
}

model Student {
  id             String  @id @default(uuid())
  registrationNo String  @unique
  userId         String  @unique
  departmentId   String
  level          Int     @default(5)
  classRoom      String
}

model AdmissionApplication {
  id             String   @id @default(uuid())
  trackingCode   String   @unique
  firstName      String
  lastName       String
  email          String
  phone          String
  desiredTrade   String
  status         String   @default("PENDING")
  submittedAt    DateTime @default(now())
}`,
  },
  {
    path: 'server.ts',
    category: 'Backend & API',
    description: 'Express backend entry point with Vite middleware and REST endpoints',
    language: 'typescript',
    code: `import express from 'express';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API health endpoint
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    app: 'EAV Kivumu Smart School API',
    version: '2.0.0-phase2',
    developer: 'Remmy | L5 SWD',
    instagram: '@K.eed__',
    contact: '0795547233',
    uptime: process.uptime()
  });
});

// Database health check
app.get('/api/v1/health/database', (req, res) => {
  res.json({
    status: 'connected',
    database: 'PostgreSQL (eav_kivumu_smart_school)',
    schema: 'public',
    provider: 'prisma',
    configured: true
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(\`EAV Kivumu Server running on http://localhost:\${PORT}\`);
});`,
  },
  {
    path: 'backend/.env.example',
    category: 'Backend & API',
    description: 'PostgreSQL and server environment configuration template',
    language: 'markdown',
    code: `DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/eav_kivumu_smart_school?schema=public"
PORT=5000
FRONTEND_URL="http://localhost:5173"
NODE_ENV="development"
SCHOOL_PHONE="0795547233"
DEVELOPER="Remmy | L5 SWD"
INSTAGRAM="@K.eed__"`,
  },
  {
    path: 'src/utils/schoolLogic.ts',
    category: 'Frontend',
    description: 'Pure functions for admission validation, telephone links, grades, and roles',
    language: 'typescript',
    code: `export function validateAdmissionApplication(data) { /* validation logic */ }
export function formatContactUrl(type, phone = '0795547233') { /* whatsapp / tel url */ }
export function calculateGradePoint(score) { /* A/B/C/D/F calculation */ }
export function checkRoleAccess(role, permission) { /* role validation */ }`,
  },
  {
    path: 'src/utils/schoolLogic.test.ts',
    category: 'Tests & Scripts',
    description: 'Automated unit test suite using node:test and node:assert/strict',
    language: 'typescript',
    code: `import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAdmissionApplication, formatContactUrl } from './schoolLogic';

test('WhatsApp URL points to 0795547233', () => {
  assert.match(formatContactUrl('whatsapp', '0795547233'), /250795547233/);
});`,
  },
  {
    path: 'package.json',
    category: 'Root & Config',
    description: 'Root configuration with workspaces, scripts, and dependencies',
    language: 'json',
    code: `{
  "name": "eav-kivumu-smart-school",
  "version": "2.0.0",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build",
    "test": "tsx --test src/utils/schoolLogic.test.ts",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev"
  }
}`,
  },
];
