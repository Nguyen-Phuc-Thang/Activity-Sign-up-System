# Activity Sign-up System
## Problem statement
MINDS
> How might we reduce friction in activity sign-ups for both individuals and caregivers, while reducing manual effort for staff in managing and consolidating registration data?

## Setting up
### Downloads
1. Download the source code or clone the project to your computer
2. Install Node.js to use ``npm``
3. Navigate to the project directory and run ``npm run dev`` in the terminal to launch the code
4. Access the localhost on your browser (normally ``localhost:5173``)
### Testing account for logging in
We have created an administrator account for trial use of the website <br>
``Email: admin@gmail.com`` <br>
``Password: admin``<br>
You can then use this account to add care-givers and care-recipients accounts yourself, log in to those accounts and use the features

## Usage instructions
Different roles using the website will have different interface. You need to read this instructions while navigating on the page
### Admin
- Login with your admin account
- On the navigation bar, you can view and edit your profile by clicking on the user icon
- **Activity**
  - The page shows the list of current activities that you can manage, click on the activity card to view the details
  - On the activity details page, you can also edit the activity's information, as well as delete the activity
  - To add new activity, click on the dashed-frame at the end of the activities list and key in the information
- **Account**
  - This page has two modes: Add Single Account and Add Multiple Accounts
  - Adding Single Account: Key in the email, password, role, and information of the new user. You can only create 1 account at a time by doing this way
  - Adding Multiple Accounts: The system will create accounts for you. You just need to upload a CSV file containing the emails of the care-recipients and care-givers in the correct format, and voila! 

### Care-giver
- Login with your care-giver account
- On the navigation bar, you can view and edit your profile by clicking on the user icon
- **Activity**: You can view the current activities
- **My Recipients**: You can view the recipients who have been registered to be associated with you
- **Requests**: You can view the requests to attend certain activities made by your recipients. You can choose whether to Accept or Reject
  - If you choose to accept the request, you need to fill in the registration form to register your recipients to attend the activity
- **Calendar**: This page allows you to have a clear view of the dates of the activities, which you have registered for your recipients
-  
### Care-recipient
- Login with your care-recipient account
- On the navigation bar, you can view and edit your profile by clicking on the user icon
- **Activity**: This page is super simple, just showing the running activities. You can read the descriptions of the activities
  - If you want to participate in a certain activity, just do one click to send a request and your care-giver will do the rest for you 
