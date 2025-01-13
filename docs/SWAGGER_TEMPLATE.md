# Swagger Documentation Template

Use this template when documenting new API endpoints.

## Basic Endpoint Template

```typescript
/**
 * @swagger
 * /api/resource:
 *   post:
 *     tags: [ResourceCategory]
 *     summary: Short description of what the endpoint does
 *     description: Detailed description of the endpoint's functionality
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: paramName
 *         required: true
 *         schema:
 *           type: string
 *         description: Description of the parameter
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requiredField
 *             properties:
 *               field:
 *                 type: string
 *                 description: Field description
 *     responses:
 *       200:
 *         description: Success response description
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseModel'
 *       400:
 *         description: Error response description
 */
```

## Schema Template

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     ModelName:
 *       type: object
 *       required:
 *         - requiredField1
 *         - requiredField2
 *       properties:
 *         field1:
 *           type: string
 *           description: Field description
 *         field2:
 *           type: number
 *           minimum: 0
 *           description: Field description
 *         relationField:
 *           $ref: '#/components/schemas/RelatedModel'
 */
```

## Common Patterns

### Pagination Parameters

```typescript
/**
 * parameters:
 *   - in: query
 *     name: page
 *     schema:
 *       type: integer
 *       minimum: 1
 *       default: 1
 *     description: Page number
 *   - in: query
 *     name: limit
 *     schema:
 *       type: integer
 *       minimum: 1
 *       maximum: 100
 *       default: 10
 *     description: Items per page
 */
```

### Error Responses

```typescript
/**
 * responses:
 *   400:
 *     description: Bad Request
 *     content:
 *       application/json:
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: "Error message here"
 *   401:
 *     description: Unauthorized
 *   404:
 *     description: Resource not found
 */
```

### Authentication

```typescript
/**
 * security:
 *   - sessionAuth: []
 */
```

## Examples

### User Endpoint

```typescript
/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User found successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 */
```

### Route Creation

```typescript
/**
 * @swagger
 * /api/routes:
 *   post:
 *     tags: [Routes]
 *     summary: Create a new route
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startPoint
 *               - endPoint
 *               - travelMode
 *             properties:
 *               title:
 *                 type: string
 *               startPoint:
 *                 $ref: '#/components/schemas/Point'
 *               endPoint:
 *                 $ref: '#/components/schemas/Point'
 *               travelMode:
 *                 type: string
 *                 enum: [DRIVING, WALKING, BICYCLING, TRANSIT]
 *     responses:
 *       201:
 *         description: Route created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Route'
 */
```

## Best Practices

1. **Consistency**

   - Use consistent naming for similar operations
   - Maintain consistent response formats
   - Follow the same pattern for error responses

2. **Clarity**

   - Write clear, concise descriptions
   - Include relevant examples
   - Document all possible responses

3. **Completeness**

   - Document all parameters
   - Include all possible response codes
   - Specify authentication requirements

4. **Maintenance**

   - Update documentation when endpoints change
   - Remove documentation for deprecated endpoints
   - Keep examples up to date

5. **Security**
   - Don't include sensitive data in examples
   - Document security requirements clearly
   - Include rate limiting information if applicable
