# Vehicle Inspection API Documentation

> **Version:** 1.0.0  
> **Base URL:** `http://localhost:{PORT}/api/v1`  
> **Content-Type:** `application/json`

---

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
  - [Get All Inspections](#get-all-inspections)
  - [Create Inspection](#create-inspection)
- [Search Inspections](#search-inspections)
  - [Get Inspection by ID](#get-inspection-by-id)
  - [Update Inspection](#update-inspection)
  - [Delete Inspection](#delete-inspection)
- [Error Handling](#error-handling)
- [Examples](#examples)

---

## Overview

The Vehicle Inspection API is a RESTful API built with **Express.js** and **MongoDB** that allows you to manage vehicle inspection records. It provides endpoints for creating, retrieving, and searching vehicle inspections based on chassis numbers, dates, and inspection details.

### Technology Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js v5.2.1 |
| Database | MongoDB (via Mongoose v9.1.6) |
| Configuration | dotenv |

---

## Authentication

> [!NOTE]
> Currently, the API does not implement authentication. All endpoints are publicly accessible.

---

## Data Models

### Inspection Model

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `_id` | ObjectId | Auto | Yes | MongoDB document ID |
| `chassisNumber` | String | ✅ Yes | ✅ Yes | Unique vehicle chassis number |
| `inspectionDetailes` | Number[] | ✅ Yes | No | Array of inspection detail codes |
| `otherDetails` | String | No | No | Additional inspection notes or details |
| `createdAt` | Date | Auto | No | Timestamp when record was created |
| `updatedAt` | Date | Auto | No | Timestamp when record was last updated |

#### Example Inspection Object

```json
{
  "_id": "65abc123def456789012345",
  "chassisNumber": "VIN123456789ABCDEF",
  "inspectionDetailes": [1, 3, 5, 7],
  "otherDetails": "Needs minor paint touch-up",
  "createdAt": "2026-02-08T15:30:00.000Z",
  "updatedAt": "2026-02-08T15:30:00.000Z"
}
```

---

## Endpoints

### Get All Inspections

Retrieves all inspection records, sorted by creation date (newest first).

```http
GET /api/v1/inspections
```

#### Request

- **Method:** `GET`
- **Headers:** None required
- **Body:** None

#### Response

| Status | Description |
|--------|-------------|
| `200 OK` | Returns array of all inspection records |

#### Response Body

```json
[
  {
    "_id": "65abc123def456789012345",
    "chassisNumber": "VIN123456789ABCDEF",
    "inspectionDetailes": [1, 3, 5],
    "otherDetails": "Good condition",
    "createdAt": "2026-02-08T15:30:00.000Z",
    "updatedAt": "2026-02-08T15:30:00.000Z"
  },
  {
    "_id": "65abc124def456789012346",
    "chassisNumber": "VIN987654321FEDCBA",
    "inspectionDetailes": [2, 4, 6],
    "createdAt": "2026-02-07T10:00:00.000Z",
    "updatedAt": "2026-02-07T10:00:00.000Z"
  }
]
```

#### cURL Example

```bash
curl -X GET http://localhost:3000/api/v1/inspections
```

---

### Create Inspection

Creates a new vehicle inspection record.

```http
POST /api/v1/inspections
```

#### Request

- **Method:** `POST`
- **Headers:** 
  - `Content-Type: application/json`
- **Body:** Required

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `chassisNumber` | String | ✅ Yes | Unique vehicle chassis number |
| `inspectionDetailes` | Number[] | ✅ Yes | Array of inspection detail codes |
| `otherDetails` | String | No | Additional inspection details |

```json
{
  "chassisNumber": "VIN123456789ABCDEF",
  "inspectionDetailes": [1, 2, 3, 4, 5],
  "otherDetails": "All checks passed"
}
```

#### Response

| Status | Description |
|--------|-------------|
| `200 OK` | Inspection created successfully |
| `400 Bad Request` | Validation error (missing chassis number or duplicate) |

#### Success Response (200)

```json
{
  "_id": "65abc123def456789012345",
  "chassisNumber": "VIN123456789ABCDEF",
  "inspectionDetailes": [1, 2, 3, 4, 5],
  "otherDetails": "All checks passed",
  "createdAt": "2026-02-08T15:30:00.000Z",
  "updatedAt": "2026-02-08T15:30:00.000Z"
}
```

#### Error Response (400)

```json
{
  "error": "Chassis number is required"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:3000/api/v1/inspections \
  -H "Content-Type: application/json" \
  -d '{
    "chassisNumber": "VIN123456789ABCDEF",
    "inspectionDetailes": [1, 2, 3, 4, 5],
    "otherDetails": "All checks passed"
  }'
```

---

### Search Inspections

Search for inspections by chassis number, date range, or inspection details.

```http
GET /api/v1/inspections/search
```

#### Request

- **Method:** `GET`
- **Headers:** None required
- **Query Parameters:** At least one required

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `chassisNumber` | String | Conditional | Partial or full chassis number (case-insensitive) |
| `startDate` | ISO Date String | Conditional | Start date for date range filter |
| `endDate` | ISO Date String | Conditional | End date for date range filter |
| `inspectionDetailes` | Number or Number[] | Optional | Filter by specific inspection detail code(s) |

> [!IMPORTANT]
> At least one of `chassisNumber`, `startDate`, or `endDate` must be provided.

#### Response

| Status | Description |
|--------|-------------|
| `200 OK` | Returns array of matching inspections |
| `400 Bad Request` | No search parameters provided |
| `404 Not Found` | No inspections match the criteria |
| `500 Internal Server Error` | Server error during search |

#### Success Response (200)

```json
[
  {
    "_id": "65abc123def456789012345",
    "chassisNumber": "VIN123456789ABCDEF",
    "inspectionDetailes": [1, 3, 5],
    "createdAt": "2026-02-08T15:30:00.000Z",
    "updatedAt": "2026-02-08T15:30:00.000Z"
  }
]
```

#### Error Responses

**No search parameters (400):**
```json
{
  "error": "At least one search parameter (chassisNumber, startDate, endDate) is required"
}
```

**No results found (404):**
```json
{
  "error": "No inspections found matching the criteria"
}
```

#### cURL Examples

**Search by chassis number:**
```bash
curl -X GET "http://localhost:3000/api/v1/inspections/search?chassisNumber=VIN123"
```

**Search by date range:**
```bash
curl -X GET "http://localhost:3000/api/v1/inspections/search?startDate=2026-01-01&endDate=2026-02-28"
```

**Search by inspection details:**
```bash
curl -X GET "http://localhost:3000/api/v1/inspections/search?inspectionDetailes=1&inspectionDetailes=3"
```

**Combined search:**
```bash
curl -X GET "http://localhost:3000/api/v1/inspections/search?chassisNumber=VIN&startDate=2026-01-01&inspectionDetailes=5"
```

---

### Get Inspection by ID

Retrieve a single inspection by its MongoDB ID.

```http
GET /api/v1/inspections/id/:id
```

#### Request

- **Method:** `GET`
- **Headers:** None required
- **URL Params:**
  - `id`: The unique MongoDB identifier of the inspection

#### Response

| Status | Description |
|--------|-------------|
| `200 OK` | Returns the requested inspection object |
| `404 Not Found` | No inspection found with the given ID |

#### Success Response (200)

```json
{
  "_id": "65abc123def456789012345",
  "chassisNumber": "VIN123456789ABCDEF",
  "inspectionDetailes": [1, 3, 5],
  "otherDetails": "Needs review",
  "createdAt": "2026-02-08T15:30:00.000Z",
  "updatedAt": "2026-02-08T15:30:00.000Z"
}
```

#### Error Response (404)

```json
{
  "error": "No such inspection"
}
```

#### cURL Example

```bash
curl -X GET http://localhost:3000/api/v1/inspections/id/65abc123def456789012345
```

---

### Update Inspection

Update an existing inspection record by its ID. It accepts partial updates.

```http
PATCH /api/v1/inspections/:id
```

#### Request

- **Method:** `PATCH`
- **Headers:** 
  - `Content-Type: application/json`
- **URL Params:**
  - `id`: The unique MongoDB identifier of the inspection
- **Body:** Fields to update (optional)

#### Request Body

| Field | Type | Description |
|-------|------|-------------|
| `chassisNumber` | String | New chassis number |
| `inspectionDetailes` | Number[] | New array of inspection detail codes |
| `otherDetails` | String | Updated details |

```json
{
  "otherDetails": "Updated notes after review",
  "inspectionDetailes": [1, 3, 5, 8]
}
```

#### Response

| Status | Description |
|--------|-------------|
| `200 OK` | Returns the updated inspection object |
| `404 Not Found` | No inspection found with the given ID |

#### Success Response (200)

```json
{
  "_id": "65abc123def456789012345",
  "chassisNumber": "VIN123456789ABCDEF",
  "inspectionDetailes": [1, 3, 5, 8],
  "otherDetails": "Updated notes after review",
  "createdAt": "2026-02-08T15:30:00.000Z",
  "updatedAt": "2026-02-09T10:00:00.000Z"
}
```

#### cURL Example

```bash
curl -X PATCH http://localhost:3000/api/v1/inspections/65abc123def456789012345 \
  -H "Content-Type: application/json" \
  -d '{
    "otherDetails": "Updated notes"
  }'
```

---

### Delete Inspection

Delete an existing inspection record by its ID.

```http
DELETE /api/v1/inspections/:id
```

#### Request

- **Method:** `DELETE`
- **Headers:** None required
- **URL Params:**
  - `id`: The unique MongoDB identifier of the inspection

#### Response

| Status | Description |
|--------|-------------|
| `200 OK` | Returns the deleted inspection object |
| `404 Not Found` | No inspection found with the given ID |

#### Success Response (200)

```json
{
  "_id": "65abc123def456789012345",
  "chassisNumber": "VIN123456789ABCDEF",
  "inspectionDetailes": [1, 3, 5],
  "otherDetails": "Needs review",
  "createdAt": "2026-02-08T15:30:00.000Z",
  "updatedAt": "2026-02-08T15:30:00.000Z"
}
```

#### cURL Example

```bash
curl -X DELETE http://localhost:3000/api/v1/inspections/65abc123def456789012345
```

---

## Error Handling

The API uses standard HTTP status codes to indicate success or failure:

| Status Code | Meaning |
|-------------|---------|
| `200` | Success - Request completed successfully |
| `400` | Bad Request - Invalid input or validation error |
| `404` | Not Found - Resource not found |
| `500` | Internal Server Error - Server-side error |

### Error Response Format

```json
{
  "error": "Description of the error"
}
```

---

## Examples

### Complete Workflow Example

#### 1. Create a new inspection

```bash
curl -X POST http://localhost:3000/api/v1/inspections \
  -H "Content-Type: application/json" \
  -d '{
    "chassisNumber": "WVWZZZ3CZWE123456",
    "inspectionDetailes": [1, 2, 5, 8, 10]
  }'
```

#### 2. Get all inspections

```bash
curl -X GET http://localhost:3000/api/v1/inspections
```

#### 3. Search by chassis number

```bash
curl -X GET "http://localhost:3000/api/v1/inspections/search?chassisNumber=WVWZZZ"
```

#### 4. Search by date range

```bash
curl -X GET "http://localhost:3000/api/v1/inspections/search?startDate=2026-02-01&endDate=2026-02-28"
```

---

## API Endpoint Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/inspections` | Get all inspections |
| `POST` | `/api/v1/inspections` | Create new inspection |
| `GET` | `/api/v1/inspections/search` | Search inspections |
| `GET` | `/api/v1/inspections/id/:id` | Get inspection by ID |
| `PATCH` | `/api/v1/inspections/:id` | Update inspection |
| `DELETE` | `/api/v1/inspections/:id` | Delete inspection |

---

## Environment Configuration

The API requires the following environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `3000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `vehicle_inspection` |

### Example `.env` file

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=vehicle_inspection
```

---

## Notes

> [!TIP]
> The `chassisNumber` field must be unique across all inspection records. Attempting to create a duplicate will result in a database error.

---

*Generated on: February 8, 2026*
