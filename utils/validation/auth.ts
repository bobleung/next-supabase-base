import { z } from 'zod';

/**
 * Basic schema for email validation
 */
export const emailSchema = z.string()
  .email('Invalid email format')
  .min(1, 'Email is required');

/**
 * Basic schema for password validation
 * Requires at least 6 characters
 */
export const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password is too long');

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

/**
 * Signup form validation schema
 * Includes first name and last name fields in addition to email and password
 */
export const signupSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

/**
 * Type definitions for form data
 */
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Helper function to validate form data
 * Returns the validated data and any validation errors
 */
export function validateFormData<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { data: z.infer<T> | null; errors: Record<string, string> | null } {
  try {
    const validData = schema.parse(data);
    return { data: validData, errors: null };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      
      error.errors.forEach((err) => {
        if (err.path.length > 0) {
          const fieldName = err.path.join('.');
          errors[fieldName] = err.message;
        }
      });
      
      return { data: null, errors };
    }
    
    // For unexpected errors, return a generic error
    return { 
      data: null, 
      errors: { _form: 'An unexpected error occurred during validation' } 
    };
  }
}