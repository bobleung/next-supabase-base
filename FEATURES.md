# Feature Roadmap

This document outlines planned features and enhancements for the Next.js base project. Features are categorized into planned, in-progress, and completed status.

## Planned Features

### Delete Account Feature
**Priority:** Medium
**Status:** In Progress

**Description:**  
Allow users to permanently delete their account and all associated data.

**Implementation Plan:**

#### 1. Admin Client Setup
**Task:** Create a secure admin client for Supabase operations that require elevated privileges
**File Location:** `utils/supabase/admin.ts`

**Implementation Details:**
- Create a dedicated admin client utility for operations requiring service role privileges
- Use environment variables to securely store and access the service role key
- Configure the client with appropriate security settings

**Environment Variables Required:**
- `SUPABASE_SERVICE_ROLE_KEY` - The service role key from Supabase (never expose to the client)

**Testing Criteria:**
- Verify the admin client can authenticate with Supabase
- Confirm it can perform privileged operations

#### 2. Server Action Implementation
**Task:** Create and implement the delete account server action
**File Location:** `app/secure/profile/actions.ts`

**Implementation Details:**
- Create a `deleteAccount` server action function that accepts both password confirmation and verification text
- Implement validation for the password input and confirmation text using Zod
- Get the current authenticated user from the session
- Verify the user's identity by re-authenticating with their password
- Validate that the user correctly typed "DELETE MY ACCOUNT" before proceeding
- Use regular client to delete user data from the profiles table
- Use admin client to delete the user's auth record
- Sign out the user and redirect to the home page
- Handle errors appropriately at each step

**Security Workflow:**
- Password validation using Zod schema
- Confirmation text validation ("DELETE MY ACCOUNT")
- User authentication verification
- Password re-authentication before any deletion
- Proper error handling with user-friendly messages
- Session termination after account deletion

**Testing Criteria:**
- Create a test user account and attempt deletion with correct password and confirmation text
- Test with incorrect confirmation text to ensure deletion is prevented
- Verify account is removed from both Supabase Auth and profiles table
- Confirm user is redirected to the home page after successful deletion
- Test error paths (wrong password, wrong confirmation text, database errors) return appropriate responses

#### 3. UI Component Development
**Task:** Create the UI components for account deletion
**File Locations:** 
- `app/secure/profile/delete-account.tsx` - Main component
- `app/secure/profile/delete-account-modal.tsx` - Confirmation modal

**Implementation Details:**
- Create a DeleteAccount component that:
  - Shows clear warnings about the irreversible nature of deletion
  - Contains a button to initiate the deletion process
  - Triggers a confirmation modal when clicked
- Create a DeleteAccountModal component that:
  - Displays a prominent warning message
  - Contains a text input field requiring "DELETE MY ACCOUNT" to be typed exactly
  - Contains a password input field for verification
  - Implements real-time validation for the confirmation text
  - Disables the delete button until confirmation text is correct
  - Includes cancel and confirm buttons
  - Shows loading state during processing
  - Displays error messages when appropriate

**UI/UX Considerations:**
- Use attention-grabbing colors (red) for deletion-related elements
- Implement clear and prominent warning text
- Provide multiple confirmation steps to prevent accidental deletion
  - First click initiates the process
  - Typing "DELETE MY ACCOUNT" confirms intent
  - Password verification confirms identity
- Display loading indicators during the deletion process
- Show clear error messages if something goes wrong
- Provide clear instructions about the confirmation text requirement

**Testing Criteria:**
- Verify components render correctly in the profile page
- Confirm warning text is clear and prominent
- Test modal opens and closes as expected
- Verify confirmation text validation works (case-sensitive, exact match)
- Confirm delete button remains disabled until confirmation text is correct
- Check password field validation works correctly
- Ensure loading state appears during submission
- Verify error messages display correctly

#### 4. Integration and Profile Page Updates
**Task:** Connect UI components to server action and integrate with profile page
**File Locations:**
- `app/secure/profile/delete-account-modal.tsx` - For form submission logic
- `app/secure/profile/page.tsx` - For component integration

**Implementation Details:**
- Implement form submission handling in the modal component
- Add real-time validation for the confirmation text field
- Connect the form to the server action
- Handle loading states and error messages
- Import and add the DeleteAccount component to the profile page
- Position it appropriately within the profile UI

**Testing Criteria:**
- Test form submission with various combinations:
  - Correct confirmation text + correct password
  - Correct confirmation text + wrong password
  - Wrong confirmation text + correct password
  - Wrong confirmation text + wrong password
- Verify error messages display correctly for all error scenarios
- Confirm loading state works during submission
- Test cancellation functionality
- Verify successful deletion redirects to home page
- Ensure UI is responsive and accessible on different devices

**Security Considerations:**
- Typed confirmation text prevents accidental deletion
- Password re-authentication prevents unauthorized account deletion
- Server-side validation ensures data integrity
- Complete data removal from all relevant tables
- Session termination after deletion
- Use of admin client with service role key securely on the server

**Future Enhancements:**
- Add option for users to download their data before deletion
- Implement a grace period where account is deactivated but not permanently deleted
- Add admin panel functionality to view and manage deletion requests
- Implement rate limiting for deletion attempts to prevent abuse
