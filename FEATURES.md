# Feature Roadmap

This document outlines planned features and enhancements for the Next.js base project. Features are categorized into planned, in-progress, and completed status.

## Planned Features

### Delete Account Feature
**Priority:** Medium
**Status:** Planned

**Description:**  
Allow users to permanently delete their account and all associated data.

**Requirements:**
- Create a "Delete Account" option in the user profile settings
- Implement a confirmation process to prevent accidental deletions
- Require password re-authentication before proceeding
- Delete all user data from both Supabase Auth and the profiles table
- Show clear warnings about the irreversible nature of this action
- Provide feedback on successful account deletion
- Redirect to home page after account deletion
- Include session termination as part of the deletion process

**Technical Implementation:**
1. Add a delete account section to the profile page with appropriate warnings
2. Create a modal for password confirmation and final warning
3. Implement server action for account deletion:
   ```typescript
   // app/secure/profile/actions.ts
   export async function deleteAccount(formData: FormData) {
     const supabase = await createClient()
     const password = formData.get('password') as string
     
     // Validate password and re-authenticate user
     const { data: { user }, error: authError } = 
       await supabase.auth.signInWithPassword({
         email: user.email,
         password: password
       })
     
     if (authError) {
       return { success: false, error: 'Password verification failed' }
     }
     
     // Delete profile data first
     const { error: profileError } = await supabase
       .from('profiles')
       .delete()
       .match({ id: user.id })
     
     if (profileError) {
       return { success: false, error: 'Failed to delete profile data' }
     }
     
     // Delete user account
     const { error: userDeleteError } = await supabase.auth.admin.deleteUser(user.id)
     
     if (userDeleteError) {
       return { success: false, error: 'Failed to delete account' }
     }
     
     // Sign out the user
     await supabase.auth.signOut()
     
     // Redirect to home page
     revalidatePath('/')
     redirect('/')
   }
   ```
4. Handle all possible error states with user-friendly messages
5. Add logging for deletion events for audit purposes

**UI Components:**
- Delete account section in profile settings with warning text
- Password confirmation modal with clear warnings
- Success notification on completion
- Loading state during the deletion process

**Security Considerations:**
- Require password re-authentication to prevent unauthorized account deletion
- Implement rate limiting to prevent abuse
- Ensure all user data is properly removed from all tables
- Consider legal requirements for data retention where applicable

**Testing Plan:**
- Test the complete deletion flow including all error scenarios
- Verify that all user data is properly removed from the database
- Test with various account types and data conditions
- Ensure proper redirection and session termination

**Future Enhancements:**
- Add option for users to download their data before deletion
- Implement a grace period where account is deactivated but not permanently deleted
- Add admin panel functionality to view and manage deletion requests

