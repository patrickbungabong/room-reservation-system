const spec = {
  openapi: '3.0.0',
  info: { title: 'Room Reservation API', version: '1.0.0', description: 'REST API for Room Reservation System' },
  servers: [{ url: 'http://localhost:5000/api', description: 'Local' }],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    schemas: {
      User: { type: 'object', properties: { _id: { type: 'string' }, name: { type: 'string' }, email: { type: 'string' }, role: { type: 'string', enum: ['student', 'admin'] } } },
      Room: { type: 'object', properties: { _id: { type: 'string' }, name: { type: 'string' }, capacity: { type: 'number' }, location: { type: 'string' }, description: { type: 'string' }, isActive: { type: 'boolean' } } },
      Reservation: { type: 'object', properties: { _id: { type: 'string' }, student: { $ref: '#/components/schemas/User' }, room: { $ref: '#/components/schemas/Room' }, date: { type: 'string', format: 'date-time' }, startTime: { type: 'string' }, endTime: { type: 'string' }, purpose: { type: 'string' }, status: { type: 'string', enum: ['pending', 'approved', 'rejected', 'cancelled'] }, adminComment: { type: 'string' } } },
    },
  },
  paths: {
    '/auth/register': { post: { summary: 'Register', requestBody: { content: { 'application/json': { schema: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string' }, email: { type: 'string' }, password: { type: 'string' }, role: { type: 'string', enum: ['student', 'admin'] } } } } } }, responses: { 201: { description: 'Created' } } } },
    '/auth/login': { post: { summary: 'Login', requestBody: { content: { 'application/json': { schema: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string' }, password: { type: 'string' } } } } } }, responses: { 200: { description: 'OK' } } } },
    '/users': { get: { summary: 'Get all users (admin)', security: [{ bearerAuth: [] }], responses: { 200: { description: 'OK' } } } },
    '/users/{id}': { get: { summary: 'Get user by ID' }, put: { summary: 'Update user' }, delete: { summary: 'Delete user (admin)' } },
    '/rooms': { get: { summary: 'Get all rooms' }, post: { summary: 'Create room (admin)' } },
    '/rooms/{id}': { get: { summary: 'Get room by ID' }, put: { summary: 'Update room (admin)' }, delete: { summary: 'Delete room (admin)' } },
    '/reservations': { get: { summary: 'Get all reservations (admin)' }, post: { summary: 'Create reservation' } },
    '/reservations/my': { get: { summary: 'Get my reservations' } },
    '/reservations/{id}': { get: { summary: 'Get reservation' }, delete: { summary: 'Delete reservation (admin)' } },
    '/reservations/{id}/approve': { put: { summary: 'Approve (admin)' } },
    '/reservations/{id}/reject': { put: { summary: 'Reject (admin)' } },
    '/reservations/{id}/cancel': { put: { summary: 'Cancel pending' } },
  },
};

export default spec;
