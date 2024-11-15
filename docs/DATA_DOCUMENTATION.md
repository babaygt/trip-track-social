# Trip Track Data Documentation

## Data Models

### User Schema

- **\_id**: ObjectId (Primary Key)
- **name**: String (Required)
- **username**: String (Required, Unique)
- **email**: String (Required, Unique)
- **password**: String (Hashed)
- **bio**: String
- **profilePicture**: String (URL)
- **followers**: Array of ObjectIds
- **following**: Array of ObjectIds
- **createdAt**: Date
- **updatedAt**: Date

### Route Schema

- **\_id**: ObjectId (Primary Key)
- **title**: String (Required)
- **creator**: ObjectId (Reference to User)
- **startPoint**: Point Object
  - **lat**: Number
  - **lng**: Number
- **endPoint**: Point Object
- **waypoints**: Array of Point Objects
- **travelMode**: String (Enum)
- **description**: String
- **totalDistance**: Number (meters)
- **totalTime**: Number (seconds)
- **visibility**: String (Enum)
- **likes**: Array of ObjectIds
- **comments**: Array of Comment Objects
- **createdAt**: Date
- **updatedAt**: Date

### Message Schema

- **\_id**: ObjectId (Primary Key)
- **conversation**: ObjectId (Reference to Conversation)
- **sender**: ObjectId (Reference to User)
- **content**: String
- **readBy**: Array of ObjectIds
- **createdAt**: Date

## Data Validation

All data models include validation rules enforced at both database and API levels:

1. **User Validation**

   - Username: 3-20 characters, alphanumeric
   - Email: Valid email format
   - Password: Minimum 8 characters

2. **Route Validation**

   - Title: 3-100 characters
   - Description: Maximum 2000 characters
   - Coordinates: Valid latitude/longitude ranges

3. **Message Validation**
   - Content: Non-empty, maximum 1000 characters
