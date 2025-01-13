# Trip Track Data Documentation

## Data Models

### User Schema

- **\_id**: ObjectId (Primary Key)
- **name**: String
  - Required
  - 2-50 characters
  - Trimmed
- **username**: String
  - Required, Unique
  - 3-30 characters
  - Alphanumeric and underscores only
  - Lowercase
- **email**: String
  - Required, Unique
  - Valid email format
  - Lowercase
- **password**: String
  - Required
  - Minimum 8 characters
  - Excluded from JSON responses
- **bio**: String (Optional)
  - Maximum 500 characters
  - Default: empty string
- **profilePicture**: String (Optional)
  - URL format
  - Default: empty string
- **followers**: Array of ObjectIds (refs User)
- **following**: Array of ObjectIds (refs User)
- **bookmarks**: Array of ObjectIds (refs Route)
- **conversations**: Array of ObjectIds (refs Conversation)
- **isAdmin**: Boolean (Default: false)
- **isProtected**: Boolean (Default: false)
- **createdAt**: Date
- **updatedAt**: Date

### Route Schema

- **\_id**: ObjectId (Primary Key)
- **title**: String
  - Required
  - Maximum 100 characters
  - Trimmed
- **creator**: ObjectId (refs User)
  - Required
- **startPoint**: Point Object
  - Required
  - lat: Number (latitude)
  - lng: Number (longitude)
- **endPoint**: Point Object
  - Required
  - Same structure as startPoint
- **waypoints**: Array of Point Objects
- **travelMode**: String (Enum)
  - Required
  - Values: ["DRIVING", "BICYCLING", "TRANSIT", "WALKING"]
- **description**: String
  - Required
  - Maximum 2000 characters
  - Trimmed
- **totalDistance**: Number
  - Required
  - Minimum 0 (meters)
- **totalTime**: Number
  - Required
  - Minimum 0 (seconds)
- **visibility**: String (Enum)
  - Values: ["public", "private", "followers"]
  - Default: "public"
- **likes**: Array of ObjectIds (refs User)
- **comments**: Array of Comment Objects
- **tags**: Array of Strings
  - Maximum 20 characters per tag
  - Lowercase
- **createdAt**: Date
- **updatedAt**: Date
- **Virtual Fields**:
  - **commentCount**: Number (computed)
  - **likeCount**: Number (computed)
- **Methods**:
  - **isOwner(userId)**: Boolean
  - **isLikedBy(userId)**: Boolean

### Message Schema

- **\_id**: ObjectId (Primary Key)
- **conversation**: ObjectId (refs Conversation)
  - Required
- **sender**: ObjectId (refs User)
  - Required
- **content**: String
  - Required
  - Maximum 1000 characters
  - Trimmed
- **readBy**: Array of ObjectIds (refs User)
- **createdAt**: Date
- **updatedAt**: Date

### Conversation Schema

- **\_id**: ObjectId (Primary Key)
- **participants**: Array of ObjectIds (refs User)
  - Required
  - Minimum 2 participants
- **lastMessage**: ObjectId (refs Message)
- **createdAt**: Date
- **updatedAt**: Date

## Indexes

### User Indexes

- `username`: 1
- `email`: 1
- `createdAt`: -1
- `followers`, `createdAt`: -1
- `following`, `createdAt`: -1
- `bookmarks`, `createdAt`: -1

### Route Indexes

- `creator`, `createdAt`: -1
- `visibility`, `createdAt`: -1
- `tags`, `createdAt`: -1
- `startPoint.lat`, `startPoint.lng`, `createdAt`: -1
- `endPoint.lat`, `endPoint.lng`, `createdAt`: -1
- `likes`, `createdAt`: -1
- `visibility`, `creator`, `createdAt`: -1

### Message Indexes

- `conversation`, `createdAt`: -1
- `sender`, `createdAt`: -1
- `readBy`: 1
- `conversation`, `sender`, `createdAt`: -1

### Conversation Indexes

- `participants`: 1
- `updatedAt`: -1
- `participants`, `updatedAt`: -1
- `lastMessage`, `updatedAt`: -1

## Data Validation

### User Validation

- Name: 2-50 characters
- Username: 3-30 characters, alphanumeric and underscores only
- Email: Valid email format, unique
- Password: Minimum 8 characters
- Bio: Maximum 500 characters
- Profile Picture: Valid string (URL)

### Route Validation

- Title: Maximum 100 characters
- Description: Maximum 2000 characters
- Travel Mode: Must be one of ["DRIVING", "BICYCLING", "TRANSIT", "WALKING"]
- Visibility: Must be one of ["public", "private", "followers"]
- Total Distance: Non-negative number
- Total Time: Non-negative number
- Tags: Each tag maximum 20 characters

### Message Validation

- Content: Required, maximum 1000 characters
- Conversation: Must reference valid conversation
- Sender: Must reference valid user

### Conversation Validation

- Participants: Minimum 2 participants
- Pre-save validation ensures minimum participant count

## Data Relationships

### User Relationships

- User ↔ User (Many-to-Many): followers/following
- User → Route (One-to-Many): created routes
- User → Route (Many-to-Many): liked routes
- User → Route (Many-to-Many): bookmarked routes
- User → Conversation (Many-to-Many): participants
- User → Message (One-to-Many): sent messages
- User → Message (Many-to-Many): readBy

### Route Relationships

- Route → User (Many-to-One): creator
- Route → User (Many-to-Many): likes
- Route → Comment (One-to-Many): embedded comments

### Message Relationships

- Message → Conversation (Many-to-One): conversation
- Message → User (Many-to-One): sender
- Message → User (Many-to-Many): readBy

### Conversation Relationships

- Conversation → User (Many-to-Many): participants
- Conversation → Message (One-to-One): lastMessage
