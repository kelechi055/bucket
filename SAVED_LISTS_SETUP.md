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

## Notes, trip planning, and public links

Progress filters, stop notes, and trip dates work with the existing owner-only saved-list rules. Public sharing additionally requires publishing the updated `firestore.rules` in the Firebase console's **Firestore Database → Rules** tab. Keep the existing private-list rule and add the `sharedLists` rule; never replace the rules with unrestricted access.

Share opens a preview of what will be published. **Create public link** saves a read-only copy of the title and stops. Notes, profile details, trip dates, and completion progress are excluded. **Refresh public copy** updates that snapshot. **Disable link** revokes it; deleting the source list also disables access. A shared link does not require signing in, and public collection searches are denied.

Run `npm test` for progress, date-validation, itinerary-ordering, and public-copy privacy checks.

## Favorites, maps, custom stops, and collaboration

Pin a list to keep it at the top of your collection; star individual stops and use **Favorite stops** to find them. **Add stop** lets you save your own places, descriptions, and website links. In the itinerary, drag a handle or use the arrows to reorder stops within a day. Reordering preserves each stop's notes, progress, and date.

**Map view** locates stops on demand using Photon and displays an OpenStreetMap map with attribution. The map shows the matched place name and links to Google Maps so visitors can check a match. Unmatched stops remain accessible through their original map links. No map API key is required. The public Photon service is suitable for light usage and may throttle requests; configure a dedicated geocoder before substantially increasing traffic.

**Collaborate → Create shared plan** makes a separate copy with live shared stops, dates, ordering, and progress. The original list remains private. The owner can create, replace, or disable editor invitations and remove collaborators. New members sign in at `/join/[inviteId]` and explicitly choose **Join shared plan**. Personal notes and favorites live in each member's own preference documents and are never readable by other members. Only the owner can publish a public copy, invite others, or delete the shared plan. Removing a member also disables the current invitation to prevent rejoining through the old link. Members can leave a plan themselves. A plan supports up to 20 members and 100 stops.

Publish the latest `firestore.rules` to enable the new collections. Run `npm test` for planning logic and `npm run test:rules` for Firestore access tests (requires Java 21+). The rules tests require an isolated demo emulator and never connect to production data.
