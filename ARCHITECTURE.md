# Robeen - Project Architecture

## Table of Contents
1. [Project Overview](#project-overview)
2. [Repository Structure](#repository-structure)
3. [Backend Architecture](#backend-architecture)
4. [Frontend/Mobile Architecture](#frontendmobile-architecture)
5. [Deployment Architecture](#deployment-architecture)
6. [Database Schema](#database-schema)
7. [Data Flow Diagrams](#data-flow-diagrams)
8. [Additional Notes](#additional-notes)

---

## Project Overview

**Robeen** is an AI-powered baby care assistant mobile application that helps parents understand why their baby is crying through video/audio analysis and provides personalized guidance.

### Technology Stack

#### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Authentication**: JWT (Access tokens: 15min, Refresh tokens: 7 days)
- **AI Integration**: Google Gemini AI (multiple models)
  - `gemini-2.0-flash-exp` - Video analysis
  - `gemini-1.5-pro` - General chat
  - `gemini-2.0-flash-thinking-exp-1219` - Complex reasoning
  - Text-to-Speech and Live Audio models
- **Deployment**: Vercel Serverless Functions

#### Frontend/Mobile
- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Mobile**: Capacitor (iOS + Web)
- **State Management**: React Context + Hooks
- **Styling**: Tailwind CSS + CSS Modules
- **Routing**: React Router v6
- **Charts**: Recharts

#### Storage & Services
- **File Storage**: Supabase Storage (videos, profile pictures)
- **Environment Management**: dotenv
- **API Security**: Helmet, CORS, Rate Limiting

### Key Features
1. **Baby Cry Analysis** - Upload video/audio for AI-powered analysis
2. **Live Chat Assistant** - Real-time AI chat with baby care advice
3. **Analysis History** - Track past analyses with insights
4. **Baby Profile Management** - Store baby information and preferences
5. **User Authentication** - Secure login/signup with JWT
6. **Multimodal AI** - Video, audio, and text analysis capabilities

---

## Repository Structure

### Local File System
```
/Users/eimribar/robeen/
├── .git/                           # Git repository
├── .vercel/                        # Vercel deployment config (links to 'backend' project)
│   └── project.json                # Project ID: prj_GnIeeSK6XwVo18yOXrRZFVoAsNLv
├── .gitignore
├── vercel.json                     # Vercel build configuration for monorepo
├── package.json                    # Root workspace config
├── ARCHITECTURE.md                 # This file
│
├── packages/
│   ├── backend/                    # Express.js API backend
│   │   ├── src/
│   │   │   ├── index.ts            # Express server entry point
│   │   │   ├── routes/             # API route handlers
│   │   │   │   ├── auth.ts         # POST /api/auth/login, /signup, /refresh
│   │   │   │   ├── profile.ts      # GET/PUT /api/profile, /api/profile/baby
│   │   │   │   ├── analysis.ts     # POST /api/analysis, GET /api/analysis/history
│   │   │   │   └── liveApi.ts      # POST /api/live-api/chat, /analyze-audio
│   │   │   ├── middleware/
│   │   │   │   ├── auth.ts         # JWT verification middleware
│   │   │   │   └── errorHandler.ts # Global error handler
│   │   │   ├── utils/
│   │   │   │   ├── supabaseClient.ts  # Supabase client singleton
│   │   │   │   ├── db.ts           # Database operations layer
│   │   │   │   └── gemini.ts       # Gemini AI client
│   │   │   └── types/
│   │   │       ├── database.types.ts  # Auto-generated Supabase types
│   │   │       └── user.ts         # User, BabyProfile, AnalysisRecord types
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── .env                    # Backend environment variables
│   │
│   ├── mobile/                     # React + Capacitor mobile app
│   │   ├── src/
│   │   │   ├── main.tsx            # React app entry point
│   │   │   ├── App.tsx             # Root component with routing
│   │   │   ├── pages/              # Page components
│   │   │   │   ├── Splash.tsx
│   │   │   │   ├── Welcome.tsx
│   │   │   │   ├── Login.tsx
│   │   │   │   ├── Signup.tsx
│   │   │   │   ├── Home.tsx
│   │   │   │   ├── Analysis.tsx
│   │   │   │   ├── History.tsx
│   │   │   │   ├── Chat.tsx
│   │   │   │   ├── Onboarding/
│   │   │   │   └── Settings/
│   │   │   ├── components/         # Reusable UI components
│   │   │   ├── services/           # API clients and utilities
│   │   │   │   ├── api.ts          # HTTP client (fetch wrapper)
│   │   │   │   ├── auth.ts         # Auth API calls
│   │   │   │   ├── profile.ts      # Profile API calls
│   │   │   │   ├── analysis.ts     # Analysis API calls
│   │   │   │   ├── liveApi.ts      # Live API calls
│   │   │   │   └── storage.ts      # Supabase storage client
│   │   │   ├── context/
│   │   │   │   └── AuthContext.tsx # Global auth state management
│   │   │   ├── hooks/              # Custom React hooks
│   │   │   └── types/              # TypeScript type definitions
│   │   ├── ios/                    # iOS Capacitor project
│   │   ├── public/
│   │   ├── package.json
│   │   ├── capacitor.config.ts
│   │   ├── vite.config.ts
│   │   └── .env.staging / .env.production
│   │
│   └── shared/                     # Shared types/utilities (if needed)
│
└── src/                            # Root React app (web version)
    ├── components/
    ├── pages/
    └── ...
```

### GitHub Repository
- **URL**: `https://github.com/eimribar/Robeen-production`
- **Branches**:
  - `main` - Production branch (auto-deploys to Vercel)
  - Feature branches as needed

### Vercel Projects
- **Project Name**: `backend`
- **Project ID**: `prj_GnIeeSK6XwVo18yOXrRZFVoAsNLv`
- **Organization**: `yessai` (team_0zkMh0NWCMZrWtTdnbKxnf2m)
- **Production URL**: `https://api.robeen.ai`
- **Auto-deployment**: Enabled on `main` branch pushes

---

## Backend Architecture

### Express.js Server (`packages/backend/src/index.ts`)

The backend is an Express.js application configured for Vercel serverless deployment.

**Server Configuration:**
```typescript
const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'http://localhost:5173',
    'capacitor://localhost',
    'ionic://localhost'
  ],
  credentials: true
}));

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 900000,  // 15 minutes
  max: 100           // 100 requests per window
}));

// Body parsing
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
```

**Endpoints:**
- `GET /` - API welcome message with endpoint listing
- `GET /health` - Health check endpoint
- `/api/auth/*` - Authentication routes
- `/api/profile/*` - User and baby profile routes
- `/api/analysis/*` - Video/audio analysis routes
- `/api/live-api/*` - Live chat and audio analysis routes

### API Routes

#### Authentication Routes (`src/routes/auth.ts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Create new user account | No |
| POST | `/api/auth/login` | Login with email/password | No |
| POST | `/api/auth/refresh` | Refresh access token | No (requires refresh token) |

**Request/Response Examples:**

```typescript
// POST /api/auth/signup
Request: {
  email: "user@example.com",
  password: "securePassword123",
  name: "John Doe"
}
Response: {
  user: { id, email, name },
  accessToken: "eyJhbGc...",
  refreshToken: "eyJhbGc..."
}

// POST /api/auth/login
Request: {
  email: "user@example.com",
  password: "securePassword123"
}
Response: {
  user: { id, email, name },
  accessToken: "eyJhbGc...",
  refreshToken: "eyJhbGc..."
}

// POST /api/auth/refresh
Request: {
  refreshToken: "eyJhbGc..."
}
Response: {
  accessToken: "eyJhbGc..."
}
```

#### Profile Routes (`src/routes/profile.ts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/profile` | Get current user profile | Yes |
| PUT | `/api/profile` | Update user profile | Yes |
| GET | `/api/profile/baby` | Get baby profile | Yes |
| PUT | `/api/profile/baby` | Update baby profile | Yes |

#### Analysis Routes (`src/routes/analysis.ts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/analysis` | Analyze baby cry video/audio | Yes |
| GET | `/api/analysis/history` | Get user's analysis history | Yes |
| DELETE | `/api/analysis/:id` | Delete analysis by ID | Yes |

**Analysis Request:**
```typescript
Request: {
  videoBase64?: string,          // Base64 encoded video
  audioBase64?: string,          // Base64 encoded audio
  mimeType: "video/mp4" | "audio/wav",
  babyAge?: number,              // Age in months
  context?: string               // Additional context from user
}

Response: {
  id: string,
  analysis: {
    reason: "Hunger" | "Tired" | "Pain" | "Overstimulation" | "Diaper",
    confidence: 0.85,
    description: "Detailed emotional state description",
    steps: ["Step 1: ...", "Step 2: ...", "Step 3: ..."],
    probabilities: {
      hunger: 0.85,
      tired: 0.05,
      pain: 0.03,
      overstimulation: 0.04,
      diaper: 0.03
    },
    context: "Analysis context and reasoning"
  },
  createdAt: "2025-11-25T10:30:00Z"
}
```

#### Live API Routes (`src/routes/liveApi.ts`)
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/live-api/chat` | Chat with AI assistant | Yes |
| POST | `/api/live-api/analyze-audio` | Real-time audio analysis | Yes |

### Authentication Flow

**JWT Token Strategy:**
1. **Access Token**: Short-lived (15 minutes), used for API requests
2. **Refresh Token**: Long-lived (7 days), used to obtain new access tokens

**Middleware (`src/middleware/auth.ts`):**
```typescript
// Verifies JWT access token on protected routes
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ error: 'Access token required' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
```

**Token Generation:**
```typescript
// Access token (15 min)
const accessToken = jwt.sign(
  { userId: user.id, email: user.email },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

// Refresh token (7 days)
const refreshToken = jwt.sign(
  { userId: user.id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);
```

### Database Layer (`src/utils/db.ts`)

**SupabaseDB Class** provides abstraction over Supabase operations:

```typescript
class SupabaseDB {
  // User operations
  async createUser(user: User): Promise<User>
  async getUserById(id: string): Promise<User | null>
  async getUserByEmail(email: string): Promise<User | null>
  async updateUser(id: string, updates: Partial<User>): Promise<User | null>

  // Baby profile operations
  async createBabyProfile(profile: BabyProfile): Promise<BabyProfile>
  async getBabyProfileByUserId(userId: string): Promise<BabyProfile | null>
  async updateBabyProfile(userId: string, updates: Partial<BabyProfile>): Promise<BabyProfile | null>

  // Analysis operations
  async createAnalysis(analysis: AnalysisRecord): Promise<AnalysisRecord>
  async getAnalysisByUserId(userId: string): Promise<AnalysisRecord[]>
  async getAnalysisById(id: string): Promise<AnalysisRecord | null>
  async deleteAnalysis(id: string): Promise<boolean>
}
```

**Type Safety:**
- All database operations use auto-generated types from `database.types.ts`
- Insert operations: `Database['public']['Tables']['table_name']['Insert']`
- Update operations: `Database['public']['Tables']['table_name']['Update']`
- Row operations: `Database['public']['Tables']['table_name']['Row']`

### Gemini AI Integration (`src/utils/gemini.ts`)

**Model Configuration:**
```typescript
const models = {
  video: 'gemini-2.0-flash-exp',              // Video analysis
  chat: 'gemini-1.5-pro',                      // General chat
  thinking: 'gemini-2.0-flash-thinking-exp-1219', // Complex reasoning
  tts: 'text-to-speech-model',                 // Text-to-speech
  liveAudio: 'live-audio-model'                // Live audio processing
};
```

**Analysis Prompt Structure:**
```typescript
const systemPrompt = `
You are an expert baby cry analyzer. Analyze the provided video/audio and determine:
1. Primary reason for crying (Hunger/Tired/Pain/Overstimulation/Diaper)
2. Confidence score (0-1)
3. Emotional state description
4. Actionable steps for parents
5. Probability distribution across all categories

Context: Baby age ${babyAge} months, ${additionalContext}
`;
```

### Environment Variables

**Required Variables (`packages/backend/.env`):**
```bash
# Server
PORT=3001
NODE_ENV=development|production

# Supabase
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...
SUPABASE_ANON_KEY=eyJhbGc...

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Gemini AI
GEMINI_API_KEY=AIzaSy...

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,capacitor://localhost

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Vercel (auto-set by Vercel)
VERCEL=1
VERCEL_ENV=production
```

---

## Frontend/Mobile Architecture

### React Application Structure

**Entry Point (`packages/mobile/src/main.tsx`):**
```typescript
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Root Component (`packages/mobile/src/App.tsx`):**
```typescript
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/analysis" element={<ProtectedRoute><Analysis /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/onboarding/*" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
          <Route path="/settings/*" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### Pages

#### 1. Authentication Flow
- **Splash** (`pages/Splash.tsx`) - App logo with auto-navigation
- **Welcome** (`pages/Welcome.tsx`) - Onboarding intro with Login/Signup buttons
- **Login** (`pages/Login.tsx`) - Email/password login form
- **Signup** (`pages/Signup.tsx`) - New user registration form

#### 2. Main App Flow
- **Home** (`pages/Home.tsx`) - Dashboard with quick actions
- **Analysis** (`pages/Analysis.tsx`) - Video/audio upload and analysis results
- **History** (`pages/History.tsx`) - Past analysis records with charts
- **Chat** (`pages/Chat.tsx`) - Live AI chat assistant

#### 3. Onboarding Flow (`pages/Onboarding/`)
- **BabyName** - Enter baby's name
- **Gender** - Select baby's gender
- **BirthDate** - Select baby's birth date
- **ProfilePicture** - Upload baby's photo
- **Notifications** - Configure notification preferences

#### 4. Settings Flow (`pages/Settings/`)
- **SettingsMain** - Settings menu
- **Profile** - Edit user profile
- **BabyProfile** - Edit baby profile
- **Preferences** - App preferences (units, notifications)
- **Account** - Account management (logout, delete account)

### Services Layer (`packages/mobile/src/services/`)

**API Client (`api.ts`):**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.robeen.ai';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('accessToken');

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired - try refresh
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        return apiRequest(endpoint, options); // Retry with new token
      }
      // Refresh failed - redirect to login
      window.location.href = '/login';
    }
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}
```

**Auth Service (`auth.ts`):**
```typescript
export async function login(email: string, password: string) {
  const data = await apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return data.user;
}

export async function signup(email: string, password: string, name?: string) {
  const data = await apiRequest<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  });

  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);

  return data.user;
}

export async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;

  try {
    const data = await apiRequest<{ accessToken: string }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });

    localStorage.setItem('accessToken', data.accessToken);
    return true;
  } catch (error) {
    localStorage.clear();
    return false;
  }
}
```

**Analysis Service (`analysis.ts`):**
```typescript
export async function analyzeVideo(
  videoBase64: string,
  mimeType: string,
  babyAge?: number,
  context?: string
) {
  return apiRequest<AnalysisResponse>('/api/analysis', {
    method: 'POST',
    body: JSON.stringify({
      videoBase64,
      mimeType,
      babyAge,
      context,
    }),
  });
}

export async function getAnalysisHistory() {
  return apiRequest<AnalysisRecord[]>('/api/analysis/history', {
    method: 'GET',
  });
}
```

**Storage Service (`storage.ts`):**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export async function uploadVideo(
  videoBlob: Blob,
  userId: string
): Promise<string> {
  const fileName = `${userId}/${Date.now()}.mp4`;

  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, videoBlob);

  if (error) throw error;

  return data.path;
}

export function getVideoUrl(path: string): string {
  const { data } = supabase.storage
    .from('videos')
    .getPublicUrl(path);

  return data.publicUrl;
}
```

### State Management

**AuthContext (`context/AuthContext.tsx`):**
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing token on mount
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchCurrentUser().then(setUser).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // ... implementation

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### Capacitor Configuration (`packages/mobile/capacitor.config.ts`)

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.robeen.app',
  appName: 'Robeen',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor',
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    },
    Storage: {
      group: 'com.robeen.app'
    }
  }
};

export default config;
```

### Build Scripts (`packages/mobile/package.json`)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "build:staging": "VITE_ENV=staging vite build",
    "build:production": "VITE_ENV=production vite build",
    "build:mobile:staging": "VITE_ENV=staging npm run build",
    "build:mobile:production": "VITE_ENV=production npm run build",
    "cap:sync": "cap sync",
    "cap:sync:staging": "npm run build:mobile:staging && cap sync",
    "cap:sync:production": "npm run build:mobile:production && cap sync",
    "cap:open:ios": "cap open ios",
    "ios:staging": "npm run build:mobile:staging && cap sync && cap open ios",
    "ios:production": "npm run build:mobile:production && cap sync && cap open ios"
  }
}
```

### Environment Variables

**Staging (`.env.staging`):**
```bash
VITE_API_URL=https://api-staging.robeen.ai
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_ENV=staging
```

**Production (`.env.production`):**
```bash
VITE_API_URL=https://api.robeen.ai
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_ENV=production
```

---

## Deployment Architecture

### Vercel Configuration

**Project Settings:**
- **Framework Preset**: Other
- **Build Command**: `cd packages/backend && npm install && npm run build`
- **Output Directory**: `packages/backend/dist`
- **Install Command**: `npm install`
- **Root Directory**: `/` (monorepo root)

**Monorepo Configuration (`vercel.json`):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "packages/backend/src/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "packages/backend/src/index.ts"
    }
  ]
}
```

**Project Link (`.vercel/project.json`):**
```json
{
  "projectId": "prj_GnIeeSK6XwVo18yOXrRZFVoAsNLv",
  "orgId": "team_0zkMh0NWCMZrWtTdnbKxnf2m",
  "projectName": "backend"
}
```

### Domain Configuration

**Production Domain:**
- **Custom Domain**: `api.robeen.ai`
- **DNS Type**: CNAME
- **DNS Value**: `cname.vercel-dns.com`

**Default Vercel Domain:**
- `backend-xxxx.vercel.app` (auto-generated)

### Environment Variables (Vercel Dashboard)

All backend environment variables must be configured in Vercel dashboard:

```bash
# Add via Vercel CLI
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_KEY
vercel env add JWT_SECRET
vercel env add JWT_REFRESH_SECRET
vercel env add GEMINI_API_KEY
vercel env add ALLOWED_ORIGINS

# Or via Vercel Dashboard
# Settings > Environment Variables
```

**Environment Scopes:**
- Production
- Preview
- Development

### CI/CD Pipeline

**Automatic Deployments:**
1. Push to `main` branch triggers production deployment
2. Pull requests trigger preview deployments
3. Vercel runs build command automatically
4. Zero-downtime deployment with rollback capability

**Manual Deployments:**
```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel
```

### Deployment Checklist

Before deploying:
- [ ] All environment variables set in Vercel
- [ ] TypeScript compilation successful (`npm run build`)
- [ ] Database migrations applied (if any)
- [ ] Supabase types regenerated (`npx supabase gen types`)
- [ ] API routes tested locally
- [ ] CORS origins updated
- [ ] Rate limits configured
- [ ] Git changes committed and pushed

---

## Database Schema

### Supabase PostgreSQL Database

**Connection Details:**
- **Project URL**: `https://uytqxlbymowzaagmvznl.supabase.co`
- **Database**: PostgreSQL 15
- **Row Level Security**: Enabled on all tables
- **Storage**: Separate buckets for videos and profile pictures

### Tables

#### 1. `users`
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | User ID |
| `email` | TEXT | UNIQUE, NOT NULL | User email (login) |
| `password_hash` | TEXT | NOT NULL | Bcrypt hashed password |
| `name` | TEXT | NULL | User's full name |
| `onboarding_completed` | BOOLEAN | DEFAULT false | Whether onboarding is done |
| `notification_preferences` | BOOLEAN | DEFAULT true | Enable/disable notifications |
| `use_metric_units` | BOOLEAN | DEFAULT false | Use metric vs imperial units |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Account creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`

**RLS Policies:**
```sql
-- Users can read their own data
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);
```

#### 2. `baby_profiles`
Stores baby information for each user (one-to-one relationship).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Profile ID |
| `user_id` | UUID | FOREIGN KEY (users.id), UNIQUE, NOT NULL | Owner user ID |
| `baby_name` | TEXT | NOT NULL | Baby's name |
| `gender` | TEXT | NOT NULL | "male", "female", or "other" |
| `birth_date` | DATE | NOT NULL | Baby's date of birth |
| `profile_picture_url` | TEXT | NULL | URL to profile picture in storage |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Profile creation timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `user_id`
- FOREIGN KEY `user_id` → `users.id` ON DELETE CASCADE

**RLS Policies:**
```sql
-- Users can read their baby profile
CREATE POLICY "Users can view own baby profile"
ON baby_profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their baby profile
CREATE POLICY "Users can create own baby profile"
ON baby_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their baby profile
CREATE POLICY "Users can update own baby profile"
ON baby_profiles FOR UPDATE
USING (auth.uid() = user_id);
```

#### 3. `analyses`
Stores baby cry analysis records.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Analysis ID |
| `user_id` | UUID | FOREIGN KEY (users.id), NOT NULL | Owner user ID |
| `video_url` | TEXT | NULL | URL to video in storage (if uploaded) |
| `primary_reason` | TEXT | NULL | Main cry reason (Hunger/Tired/etc) |
| `confidence_score` | DECIMAL(3,2) | NULL | Confidence (0.00 - 1.00) |
| `emotional_state` | TEXT | NULL | Detailed description of emotional state |
| `actionable_steps` | JSONB | NULL | Array of recommended steps |
| `chart_data` | JSONB | NULL | Probability distribution object |
| `analysis_context` | TEXT | NULL | Context and reasoning from AI |
| `medical_disclaimer` | TEXT | NULL | Legal disclaimer text |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Analysis timestamp |

**JSONB Structure:**

`actionable_steps`:
```json
["Step 1: Check if baby is hungry", "Step 2: Try feeding", "Step 3: Burp after feeding"]
```

`chart_data`:
```json
{
  "hunger": 0.85,
  "tired": 0.05,
  "pain": 0.03,
  "overstimulation": 0.04,
  "diaper": 0.03
}
```

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `created_at` (for sorting)
- FOREIGN KEY `user_id` → `users.id` ON DELETE CASCADE

**RLS Policies:**
```sql
-- Users can read their analyses
CREATE POLICY "Users can view own analyses"
ON analyses FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their analyses
CREATE POLICY "Users can create own analyses"
ON analyses FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can delete their analyses
CREATE POLICY "Users can delete own analyses"
ON analyses FOR DELETE
USING (auth.uid() = user_id);
```

#### 4. `chat_history`
Stores AI chat conversation history.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Message ID |
| `user_id` | UUID | FOREIGN KEY (users.id), NOT NULL | Owner user ID |
| `role` | TEXT | NOT NULL | "user" or "assistant" |
| `message` | TEXT | NOT NULL | Message content |
| `sources` | JSONB | NULL | Referenced sources (if any) |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Message timestamp |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id, created_at` (for retrieving chat history)
- FOREIGN KEY `user_id` → `users.id` ON DELETE CASCADE

**RLS Policies:**
```sql
-- Users can read their chat history
CREATE POLICY "Users can view own chat history"
ON chat_history FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert chat messages
CREATE POLICY "Users can create own chat messages"
ON chat_history FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Storage Buckets

#### 1. `videos`
Stores uploaded baby cry videos.

**Configuration:**
- Public: No (require authentication)
- File size limit: 50MB
- Allowed MIME types: `video/mp4`, `video/quicktime`, `video/webm`

**Path Structure:**
```
videos/
  ├── {user_id}/
  │   ├── {timestamp_1}.mp4
  │   ├── {timestamp_2}.mp4
  │   └── ...
```

**RLS Policies:**
```sql
-- Users can upload to their own folder
CREATE POLICY "Users can upload own videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Users can read their own videos
CREATE POLICY "Users can view own videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'videos' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

#### 2. `profile-pictures`
Stores baby profile pictures.

**Configuration:**
- Public: Yes (publicly accessible URLs)
- File size limit: 5MB
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`

**Path Structure:**
```
profile-pictures/
  ├── {user_id}/
  │   └── baby-profile.jpg
```

### Database Triggers

**Update `updated_at` on row modification:**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_baby_profiles_updated_at BEFORE UPDATE ON baby_profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Type Generation

**Generate TypeScript types from Supabase schema:**
```bash
# Install Supabase CLI
npm install -D supabase

# Generate types (requires SUPABASE_ACCESS_TOKEN)
SUPABASE_ACCESS_TOKEN="sbp_xxx" npx supabase gen types typescript \
  --project-id uytqxlbymowzaagmvznl \
  > packages/backend/src/types/database.types.ts
```

---

## Data Flow Diagrams

### 1. User Authentication Flow

```
┌─────────────┐
│   Mobile    │
│   Client    │
└──────┬──────┘
       │
       │ POST /api/auth/signup
       │ { email, password, name }
       ▼
┌─────────────────────────────────────┐
│         Express Backend             │
│  ┌────────────────────────────┐    │
│  │  auth.ts (route handler)   │    │
│  │  1. Validate input         │    │
│  │  2. Hash password (bcrypt) │    │
│  │  3. Call db.createUser()   │    │
│  └────────┬───────────────────┘    │
│           ▼                         │
│  ┌────────────────────────────┐    │
│  │  db.ts (database layer)    │    │
│  │  1. Insert user record     │    │
│  │  2. Return user object     │    │
│  └────────┬───────────────────┘    │
└───────────┼─────────────────────────┘
            ▼
   ┌─────────────────┐
   │    Supabase     │
   │   PostgreSQL    │
   │  (users table)  │
   └────────┬────────┘
            │
            │ User created
            ▼
   ┌─────────────────────┐
   │  Generate Tokens    │
   │  - Access (15min)   │
   │  - Refresh (7days)  │
   └────────┬────────────┘
            │
            │ { user, accessToken, refreshToken }
            ▼
┌─────────────┐
│   Mobile    │
│   Client    │
│ Store tokens│
│ in storage  │
└─────────────┘
```

### 2. Video Analysis Flow

```
┌─────────────┐
│   Mobile    │
│   Client    │
└──────┬──────┘
       │
       │ 1. User records video via Camera API
       │ 2. Convert to Base64
       │ 3. POST /api/analysis
       │    { videoBase64, mimeType, babyAge, context }
       │    Authorization: Bearer <accessToken>
       ▼
┌──────────────────────────────────────────────┐
│            Express Backend                   │
│  ┌─────────────────────────────────┐        │
│  │  authenticateToken middleware   │        │
│  │  - Verify JWT                   │        │
│  │  - Extract userId               │        │
│  └──────────┬──────────────────────┘        │
│             ▼                                │
│  ┌─────────────────────────────────┐        │
│  │  analysis.ts (route handler)    │        │
│  │  1. Decode Base64 video         │        │
│  │  2. Get baby profile (for age)  │        │
│  │  3. Call Gemini API             │        │
│  └──────────┬──────────────────────┘        │
└─────────────┼────────────────────────────────┘
              ▼
   ┌───────────────────────────┐
   │      Gemini AI API        │
   │  (gemini-2.0-flash-exp)   │
   │                           │
   │  Analyze:                 │
   │  - Video frames           │
   │  - Audio patterns         │
   │  - Baby age context       │
   │  - User context           │
   └───────────┬───────────────┘
               │
               │ AI Response
               │ { reason, confidence, description, steps, probabilities }
               ▼
┌──────────────────────────────────────────────┐
│            Express Backend                   │
│  ┌─────────────────────────────────┐        │
│  │  analysis.ts (route handler)    │        │
│  │  4. Structure analysis result   │        │
│  │  5. Call db.createAnalysis()    │        │
│  └──────────┬──────────────────────┘        │
│             ▼                                │
│  ┌─────────────────────────────────┐        │
│  │  db.ts (database layer)         │        │
│  │  - Insert analysis record       │        │
│  │  - Return full analysis object  │        │
│  └──────────┬──────────────────────┘        │
└─────────────┼────────────────────────────────┘
              ▼
   ┌────────────────────┐
   │    Supabase        │
   │   PostgreSQL       │
   │ (analyses table)   │
   └────────┬───────────┘
            │
            │ Analysis saved
            │ { id, userId, analysis, createdAt }
            ▼
┌─────────────┐
│   Mobile    │
│   Client    │
│ Display:    │
│ - Reason    │
│ - Chart     │
│ - Steps     │
└─────────────┘
```

### 3. Profile Management Flow

```
┌─────────────┐
│   Mobile    │
│   Client    │
│ (Onboarding)│
└──────┬──────┘
       │
       │ 1. Complete onboarding steps
       │ 2. Upload profile picture to Supabase Storage
       │ 3. PUT /api/profile/baby
       │    { babyName, gender, birthDate, profilePictureUrl }
       │    Authorization: Bearer <accessToken>
       ▼
┌──────────────────────────────────────────────┐
│            Express Backend                   │
│  ┌─────────────────────────────────┐        │
│  │  authenticateToken middleware   │        │
│  │  - Extract userId from JWT      │        │
│  └──────────┬──────────────────────┘        │
│             ▼                                │
│  ┌─────────────────────────────────┐        │
│  │  profile.ts (route handler)     │        │
│  │  1. Check if profile exists     │        │
│  │  2. Create or update profile    │        │
│  └──────────┬──────────────────────┘        │
│             ▼                                │
│  ┌─────────────────────────────────┐        │
│  │  db.ts (database layer)         │        │
│  │  - getBabyProfileByUserId()     │        │
│  │  - createBabyProfile() OR       │        │
│  │    updateBabyProfile()          │        │
│  └──────────┬──────────────────────┘        │
└─────────────┼────────────────────────────────┘
              ▼
   ┌────────────────────┐
   │    Supabase        │
   │   PostgreSQL       │
   │(baby_profiles tbl) │
   └────────┬───────────┘
            │
            │ Profile saved
            │ { id, userId, babyName, gender, birthDate, ... }
            ▼
┌─────────────┐
│   Mobile    │
│   Client    │
│ Update UI   │
│ Mark onboard│
│ complete    │
└─────────────┘
       │
       │ PUT /api/profile
       │ { onboardingCompleted: true }
       ▼
┌──────────────────────────────────────────────┐
│            Express Backend                   │
│  ┌─────────────────────────────────┐        │
│  │  profile.ts                     │        │
│  │  - db.updateUser()              │        │
│  │  - Set onboarding_completed     │        │
│  └─────────────────────────────────┘        │
└──────────────────────────────────────────────┘
              ▼
   ┌────────────────────┐
   │    Supabase        │
   │   PostgreSQL       │
   │   (users table)    │
   └────────────────────┘
```

### 4. Token Refresh Flow

```
┌─────────────┐
│   Mobile    │
│   Client    │
└──────┬──────┘
       │
       │ API Request with expired access token
       ▼
┌──────────────────────────────────────────────┐
│            Express Backend                   │
│  ┌─────────────────────────────────┐        │
│  │  authenticateToken middleware   │        │
│  │  - jwt.verify() throws error    │        │
│  │  - Return 401 Unauthorized      │        │
│  └─────────────────────────────────┘        │
└──────────────────────────────────────────────┘
       │
       │ 401 Unauthorized
       ▼
┌─────────────┐
│   Mobile    │
│   Client    │
│  apiRequest │
│  catches 401│
└──────┬──────┘
       │
       │ POST /api/auth/refresh
       │ { refreshToken: "eyJhbGc..." }
       ▼
┌──────────────────────────────────────────────┐
│            Express Backend                   │
│  ┌─────────────────────────────────┐        │
│  │  auth.ts (route handler)        │        │
│  │  1. Verify refresh token        │        │
│  │  2. Extract userId              │        │
│  │  3. Generate new access token   │        │
│  │  4. Return { accessToken }      │        │
│  └─────────────────────────────────┘        │
└──────────────────────────────────────────────┘
       │
       │ { accessToken: "eyJhbGc..." }
       ▼
┌─────────────┐
│   Mobile    │
│   Client    │
│ 1. Store new│
│    token    │
│ 2. Retry    │
│    original │
│    request  │
└─────────────┘
```

### 5. Data Persistence Flow

**Local Storage (Mobile):**
```
┌──────────────────────────┐
│  localStorage/Capacitor  │
│  Preferences             │
├──────────────────────────┤
│ - accessToken            │
│ - refreshToken           │
│ - user (cached)          │
│ - theme preference       │
│ - language preference    │
└──────────────────────────┘
```

**Remote Storage (Supabase):**
```
┌──────────────────────────┐
│    PostgreSQL Tables     │
├──────────────────────────┤
│ - users                  │
│ - baby_profiles          │
│ - analyses               │
│ - chat_history           │
└──────────────────────────┘
          +
┌──────────────────────────┐
│   Supabase Storage       │
├──────────────────────────┤
│ - videos/                │
│ - profile-pictures/      │
└──────────────────────────┘
```

**Synchronization:**
1. User data fetched on app launch (if token exists)
2. Analysis history fetched when History page opens
3. Baby profile fetched during onboarding/settings
4. Chat history fetched when Chat page opens
5. All writes immediately persisted to Supabase
6. Optimistic UI updates with error rollback

---

## Additional Notes

### Implementation Status

**✅ Completed Features:**
- User authentication (signup, login, token refresh)
- Baby profile management (create, read, update)
- Video/audio analysis with Gemini AI
- Analysis history persistence
- JWT-based authorization
- Supabase integration (database + storage)
- Type-safe database operations
- Error handling middleware
- Rate limiting
- CORS configuration
- Vercel deployment
- iOS mobile app build

**🚧 In Progress:**
- Live audio analysis streaming
- Real-time chat with conversation history
- Push notifications
- Profile picture upload UI
- Analysis result charts/visualizations

**📋 Planned Features:**
- Multi-language support (i18n)
- Dark mode
- Baby growth tracking
- Sleep tracking
- Feeding schedule
- Milestone tracking
- Export analysis reports (PDF)
- Family member sharing
- Offline mode with sync

### Security Considerations

**Authentication:**
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration
- Refresh token rotation (planned)
- HTTP-only cookies for tokens (planned migration from localStorage)

**API Security:**
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS with whitelist
- Input validation on all endpoints
- SQL injection prevention (Supabase client handles escaping)

**Database Security:**
- Row Level Security (RLS) enabled on all tables
- Service key only used server-side
- Anon key used client-side with RLS
- Foreign key constraints with CASCADE delete

**File Upload Security:**
- File size limits (50MB videos, 5MB images)
- MIME type validation
- User-isolated storage paths
- Signed URLs for private files

### Performance Optimizations

**Backend:**
- Supabase client singleton (connection pooling)
- Lazy initialization of clients
- Response compression (planned)
- Caching for frequently accessed data (planned)

**Frontend:**
- Code splitting by route
- Lazy loading of components
- Image optimization (planned)
- Service worker for offline support (planned)

**Database:**
- Indexes on foreign keys
- Indexes on frequently queried columns
- JSONB for flexible data structures
- Efficient RLS policies

### Scalability Considerations

**Serverless Architecture:**
- Auto-scaling on Vercel (no server management)
- Pay-per-execution model
- Cold start mitigation with warm-up functions (planned)

**Database:**
- Supabase auto-scales read replicas
- Connection pooling via PgBouncer
- Horizontal scaling possible with Supabase Pro

**File Storage:**
- CDN-backed storage via Supabase
- Lazy loading of large files
- Video compression before upload (planned)

**AI API:**
- Gemini API handles scaling
- Request batching for efficiency (planned)
- Fallback models for high load (planned)

### Monitoring & Logging

**Current:**
- Morgan HTTP request logging
- Console logs for debugging
- Vercel deployment logs

**Planned:**
- Error tracking (Sentry or similar)
- Performance monitoring (Vercel Analytics)
- User analytics (privacy-focused)
- Database query performance monitoring
- API response time tracking

### Development Workflow

**Local Development:**
```bash
# Terminal 1: Backend
cd packages/backend
npm run dev  # Runs on port 3001

# Terminal 2: Mobile
cd packages/mobile
npm run dev  # Runs on port 5173

# Mobile iOS build
cd packages/mobile
npm run ios:staging
```

**Type Generation:**
```bash
# Generate Supabase types after schema changes
SUPABASE_ACCESS_TOKEN="sbp_xxx" npx supabase gen types typescript \
  --project-id uytqxlbymowzaagmvznl \
  > packages/backend/src/types/database.types.ts
```

**Deployment:**
```bash
# Deploy backend to production
vercel --prod

# Build mobile app for iOS
cd packages/mobile
npm run build:mobile:production
npm run cap:sync
npm run cap:open:ios
# Then build in Xcode
```

### Team Collaboration

**Branch Strategy:**
- `main` - Production (auto-deploys to Vercel)
- `develop` - Integration branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches

**Code Review:**
- Pull requests required for `main` and `develop`
- At least one approval required
- CI checks must pass (TypeScript, tests)

**Communication:**
- Architecture decisions documented in this file
- API changes communicated to mobile team
- Database schema changes require migration plan

### Contact & Resources

**Documentation:**
- Express.js: https://expressjs.com/
- React: https://react.dev/
- Capacitor: https://capacitorjs.com/
- Supabase: https://supabase.com/docs
- Gemini AI: https://ai.google.dev/

**Project Links:**
- Production API: https://api.robeen.ai
- Vercel Dashboard: https://vercel.com/yessai/backend
- Supabase Dashboard: https://supabase.com/dashboard/project/uytqxlbymowzaagmvznl
- GitHub Repository: https://github.com/eimribar/Robeen-production

---

**Last Updated**: 2025-11-25
**Version**: 1.0.0
**Maintainer**: Development Team
