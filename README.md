# Safiri Systems
A web-based platform for managing internal bus transport operations.

## Developer
- Name: Neema Rimba Mariga

## Tech Stack
- Next.js 14, React 18, Tailwind CSS
- MySQL 8.0, Prisma ORM v5.22.0
- Clerk Authentication
- Git & GitHub

## Project Overview
Safiri Systems is an internal operations management platform designed for bus transport companies to efficiently manage their fleet, routes, drivers, trips, and maintenance schedules. The system provides a centralized dashboard for administrative staff to monitor and control all aspects of bus operations.

## Key Features
- Fleet Management: Track all buses with detailed information
- Route Planning: Manage routes with origin, destination, and distance tracking
- Driver Management: Maintain driver records with bus assignments
- Trip Scheduling: Schedule and monitor trips with real-time status updates
- Maintenance Tracking: Record and track vehicle maintenance history
- Dashboard Analytics: Real-time statistics and operational insights
- Responsive Design: Works seamlessly on desktop and mobile devices

## Modules

### 1. Bus Management
- Add, edit, view, and delete buses
- Track plate numbers, models, and capacity
- Monitor bus status (active, maintenance, inactive)
- Search and filter functionality

### 2. Route Management
- Create and manage routes
- Track origin, destination, and distance
- Record estimated travel times
- Route status management

### 3. Driver Management
- Manage driver records and licenses
- Assign drivers to specific buses
- Track driver status (active, on leave, inactive)
- Phone number and contact information

### 4. Trip Management
- Schedule trips with bus, route, and driver assignments
- Set departure and arrival times
- Track trip status (scheduled, in progress, completed, cancelled)
- Add trip notes and special instructions

### 5. Maintenance Tracking
- Record maintenance schedules
- Track maintenance types (oil change, brake service, engine repair, etc.)
- Monitor costs and completion dates
- Maintenance status tracking

## Installation & Setup

### Prerequisites
- Node.js 18 or higher
- MySQL 8.0
- npm or yarn package manager

### Steps

1. Clone the repository
```bash
git clone <repository-url>
cd safiri-systems
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables

Create a .env file in the root directory:
```env
DATABASE_URL="mysql://username:password@localhost:3306/safiri_systems"

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_OUT_URL=/welcome
```

4. Setup database
```bash
npx prisma generate
npx prisma db push
```

5. Run development server
```bash
npm run dev
```

6. Open browser and navigate to http://localhost:3001

## Database Schema

### Tables

1. Bus Table
   - id, plateNumber (unique), model, capacity, status, timestamps

2. Route Table
   - id, name, origin, destination, distance, estimatedTime, status, timestamps

3. Driver Table
   - id, firstName, lastName, licenseNumber (unique), phone, status, timestamps

4. BusDriver Table (Junction)
   - id, busId, driverId, assignedAt, status

5. Trip Table
   - id, busId, routeId, driverId, departureTime, arrivalTime, status, notes, timestamps

6. Maintenance Table
   - id, busId, type, description, scheduledDate, completedDate, cost, status, timestamps

### Relationships
- One Bus has many Trips
- One Route has many Trips
- One Driver has many Trips
- Drivers and Buses have many-to-many relationship via BusDriver table
- One Bus has many Maintenance records

## Project Structure
```
safiri-systems/
├── app/
│   ├── page.tsx                    # Root redirect
│   ├── welcome/page.tsx            # Landing page
│   ├── dashboard/
│   │   ├── layout.tsx              # Sidebar navigation
│   │   ├── page.tsx                # Dashboard home
│   │   ├── buses/
│   │   │   ├── page.tsx            # Buses list
│   │   │   └── form/page.tsx       # Add/Edit bus
│   │   ├── routes/
│   │   │   ├── page.tsx            # Routes list
│   │   │   └── form/page.tsx       # Add/Edit route
│   │   ├── drivers/
│   │   │   ├── page.tsx            # Drivers list
│   │   │   └── form/page.tsx       # Add/Edit driver
│   │   ├── trips/
│   │   │   ├── page.tsx            # Trips list
│   │   │   └── form/page.tsx       # Add/Edit trip
│   │   └── maintenance/
│   │       ├── page.tsx            # Maintenance list
│   │       └── form/page.tsx       # Add/Edit maintenance
│   ├── api/
│   │   ├── buses/route.ts          # Buses API
│   │   ├── routes/route.ts         # Routes API
│   │   ├── drivers/route.ts        # Drivers API
│   │   ├── trips/route.ts          # Trips API
│   │   └── maintenance/route.ts    # Maintenance API
│   ├── about/page.tsx              # About page
│   ├── privacy/page.tsx            # Privacy policy
│   ├── terms/page.tsx              # Terms of service
│   ├── support/page.tsx            # Support page
│   ├── sign-in/[[...sign-in]]/page.tsx
│   └── sign-up/[[...sign-up]]/page.tsx
├── prisma/
│   └── schema.prisma               # Database schema
├── middleware.ts                   # Authentication middleware
├── .env                            # Environment variables
└── package.json
```

## Design System

### Color Scheme
- Primary: Amber (#d97706, #b45309, #92400e)
- Sidebar: bg-amber-50
- Main Background: bg-amber-100
- Table Headers: bg-amber-700 with white text
- Buttons: bg-amber-700, hover:bg-amber-800

### Status Colors
- Active/Success: Green
- Warning/In Progress: Yellow
- Inactive/Cancelled: Red
- Scheduled: Blue

### Responsive Design
- Mobile: Hamburger menu, compact tables, hidden columns
- Desktop: Fixed sidebar, full table view, larger spacing

## Validations

### Auto-Uppercase Fields
- Plate Numbers
- License Numbers

### Numeric Validations
- Distance: min 0.1, max 10,000 km
- Capacity: min 1, max 100 seats
- Cost: min 0 KES

### Length Limits
- Plate/License Numbers: 20 characters
- Names: 50 characters
- Route Names: 100 characters
- Phone Numbers: 15 characters
- Descriptions: 500 characters

## API Endpoints

### Buses
- GET /api/buses - Fetch all buses
- POST /api/buses - Create new bus
- PUT /api/buses - Update bus
- DELETE /api/buses?id={id} - Delete bus

### Routes
- GET /api/routes - Fetch all routes
- POST /api/routes - Create new route
- PUT /api/routes - Update route
- DELETE /api/routes?id={id} - Delete route

### Drivers
- GET /api/drivers - Fetch all drivers with assignments
- POST /api/drivers - Create new driver
- PUT /api/drivers - Update driver
- DELETE /api/drivers?id={id} - Delete driver

### Trips
- GET /api/trips - Fetch all trips with relationships
- POST /api/trips - Create new trip
- PUT /api/trips - Update trip
- DELETE /api/trips?id={id} - Delete trip

### Maintenance
- GET /api/maintenance - Fetch all maintenance records
- POST /api/maintenance - Create new maintenance record
- PUT /api/maintenance - Update maintenance record
- DELETE /api/maintenance?id={id} - Delete maintenance record

## Development Timeline

### Day 1 (March 18, 2026)
- Project setup and initialization
- Database schema design and implementation
- Clerk authentication integration
- Dashboard layout with sidebar navigation
- Buses module (complete CRUD)
- Routes module (complete CRUD)
- Drivers module (complete CRUD with bus assignment)

### Day 2 (March 20, 2026)
- Trips module (complete CRUD)
- Maintenance module (complete CRUD)
- Dashboard statistics with real data
- Footer pages (About, Privacy, Terms, Support)
- Testing and bug fixes

### Day 3 (March 21, 2026)
- Final testing
- Documentation

## Future Enhancements
- SMS notifications via Africa's Talking API for maintenance alerts
- Advanced reporting and analytics
- Route optimization algorithms


## Known Limitations
- SMS notifications not implemented (demonstration code only)
- Single admin user (no role-based access control)
- No file upload for documents
- Basic reporting (no PDF export)

## Technical Decisions

### Why Next.js 14?
- Built-in API routes (no separate backend needed)
- File-based routing system
- Server and client components
- Easy deployment to Vercel
- Production-ready with zero configuration

### Why Prisma ORM?
- Type-safe database queries
- Automatic migrations
- Easy relationship management
- Works with multiple databases
- Better developer experience than raw SQL

### Why Clerk Auth?
- Production-ready authentication
- Pre-built UI components
- Easy integration with Next.js
- Secure session management
- No need to build auth from scratch

### Why MySQL?
- Reliable and widely used
- Good performance for relational data
- Easy to set up locally
- Industry standard

### Why Prisma v5.22.0?
- v7 has adapter compatibility issues with MySQL
- v5 is stable and well-tested
- Simpler configuration

## Security Features
- Protected routes via middleware
- Secure authentication with Clerk
- Environment variables for sensitive data
- Input validation on all forms
- SQL injection prevention via Prisma ORM

## Browser Support
- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## License
This project is developed for academic purposes as a final year project at East African University.

## Contact
For questions or support:
- Developer: Neema Rimba Mariga
- Email: mariganeema@gmail.com

## Acknowledgments

- Clerk (Authentication Service)
- Vercel (Next.js Framework)
- Prisma (Database ORM)

---

© 2026 Safiri Systems. All rights reserved.