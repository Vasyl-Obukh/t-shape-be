export default {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: { type: 'string', minLength: 10 },
        description: { type: 'string', minLength: 5 },
        count: { type: 'integer', minimum: 0 },
        price: { type: 'integer', minimum: 1 },
        imgUrl: { type: 'string' },
        ram: { type: 'integer', minimum: 1 },
        storage: { type: 'string' },
        display: { type: 'string' }
      },
      required: ['title', 'description', 'count', 'price']
    }
  }
};
