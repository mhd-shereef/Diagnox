export const parseSchemaFields = (schema) => {
  if (!schema || !schema.properties) return [];

  const fields = [];
  for (const [key, value] of Object.entries(schema.properties)) {
    fields.push({
      name: key,
      type: value.type, // e.g., 'integer', 'number', 'string'
      title: value.title || key,
      description: value.description || '',
      default: value.default,
      required: schema.required ? schema.required.includes(key) : false,
    });
  }

  return fields;
};
