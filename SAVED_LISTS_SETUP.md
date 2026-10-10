# Enable saved lists

The Save Bucket List button and Saved Lists tab are implemented. Complete these
steps to connect them to the Firebase project already used by the app.

1. Open [Firebase Authentication](https://console.firebase.google.com/project/sunnylist-1f5a2/authentication).
   If prompted, choose **Get started**. The app uses custom tokens to connect
   Clerk accounts to Firebase; no separate Firebase password login is needed.
2. Open [Service Accounts](https://console.firebase.google.com/project/sunnylist-1f5a2/settings/serviceaccounts/adminsdk).
   Choose **Generate new private key** and download the JSON file yourself.
   Keep this file outside the repository.
3. In your local `.env.local`, add the downloaded file's `client_email` and
   `private_key` values. Preserve any existing environment settings.

   ```dotenv
   FIREBASE_CLIENT_EMAIL=replace_with_client_email
   FIREBASE_PRIVATE_KEY="replace_with_private_key"
   ```

   Keep the `private_key` value on one line, including its `\n` escapes, inside
   double quotes. These are server-only credentials: do not add `NEXT_PUBLIC_`,
   commit the JSON key, or paste it into chat. Use a key from `sunnylist-1f5a2`.
4. Open [Firestore](https://console.firebase.google.com/project/sunnylist-1f5a2/firestore).
   Create the database if needed. In the **Rules** tab, publish the rules from
   `firestore.rules`. If other features have rules already, merge the
   `/users/{userId}/savedBucketLists/{listId}` rule into the existing rules and
   make sure no broader rule grants access to another user's lists.
5. Restart the development server after updating `.env.local`.
6. Sign in at `http://localhost:3000/sign-in`, generate a list, and click
   **Save Bucket List**. When **List Saved** appears, choose **Saved Lists**.
   Reload the saved page to confirm persistence. A different signed-in account
   should have its own separate lists.

For Vercel, add the same two Firebase variables in the project's Environment
Variables settings and redeploy. Clerk also needs valid keys for the intended
environment. Your current Clerk application uses unclaimed development credentials;
claim and configure it before a production launch.

If saving returns `permission-denied`, check the Firestore rule and project.
If it says saved lists are not configured, check the two server variables and
restart/redeploy. Never make the entire database publicly readable to fix an error.
