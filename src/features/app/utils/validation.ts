import * as z from 'zod';

export const validate = (schema: z.ZodType<any>) => (values: any) => {
  try {
    schema.parse(values);
    return {};
  } catch (error: any) {
    return error.flatten().fieldErrors;
  }
};
