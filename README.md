# eVote Platform

The eVote platform is a dynamic web application designed to facilitate online voting. It allows users to participate in elections, create their own polls, and view real-time results. This project demonstrates the use of React for the frontend and Java Spring Boot for the backend.

## Description

eVote is intended to make online voting accessible and straightforward. Users can register, log in, participate in active elections, or view results of past elections. Administrators can manage elections, users, and view voting results.

## Getting Started

These instructions will guide you through setting up your project locally. To get a local copy up and running, follow these simple steps.

### Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js v20.12.0
- Java JDK 21.0.2
- Maven v3.9.5
- Spring Boot v3.2.4
- MySQL (Version 8.0 or higher recommended)
- Dependencies for running this project are listed in the `pom.xml` file located in the backend directory. Ensure these dependencies are correctly resolved via Maven.

### Installing

1. **Clone the backend repository:**

```bash
git clone https://github.com/taurencijus/eVote-app.git
cd eVote
```
2. **Set up the backend:**

Navigate to the backend directory and run:
```
cd backend
mvn install
mvn spring-boot:run
```
This will start the Spring Boot server on 'localhost:8080'.

3. **Clone the frontend repository:**

```bash
git clone https://github.com/taurencijus/eVote-app-FE.git
cd eVote-frontend
```
4. **Set up the frontend:**
```
npm install
npm start
```
This will start the React application on 'localhost:3000'.

### Configuring the Database

Create a new MySQL database named 'evote' and configure the 'application.properties' file in the backend's 'src/main/resources' folder with your MySQL user and password.

## Usage

There are two roles for the app: User and Admin.

To create a User:

- Navigate to the Home page of the app and click the 'Register' button.
- Or click the 'Register' button in the navigation bar.

To create an Admin:

- An Admin account is created automatically when the app is initially started.
- Username: admin
- Password: password123
- Note: Please change the default password immediately after setup for security.
- Recommendation: Create a new user account, change new user account role to Admin, login to this new Admin account and delete the automatically created Admin account. All of this can be done in the 'User List' of the 'Admin Dashboard'.

### As an Admin

First, log in to the platform.

To manage Elections:

- Navigate to 'Admin Dashboard', check the Elections List.
- To create an election click on 'Create New Election' button. Fill in the election information (title, description), select start date and end date, add vote options with names and descriptions by clicking 'Add Vote Option' button and click 'Create Election' button.
- To edit an election click on the 'Edit' button. In the '/edit-election' page update the election information (title, description), add remove vote options with 'Add Vote Option' and 'Remove' buttons, change vote option information (name, description), and click 'Save Changes' button.
- To delete an election click on the 'Delete' button.
- To view results of an active or finished election click the 'View Results' button.

To manage Users:

- Navigate to 'Admin Dashboard', check the User List.
- To create new User/Admin click 'Create New User' button, fill in the user information (username, email, password) select role (user, admin) and click 'Create User' button.
- To edit User/Admin click 'Edit' button, edit the information and click 'Save' button.
- To delete User/Admin click 'Delete' button.

### As a User

To vote in an election:

- Login to the platform.
- Navigate to the 'User Dashboard'.
- Click on 'Vote' for any of the active elections.

To view election results:

- Go to your dashboard.
- Click on 'View Results' for any completed elections.

##Contact

Tauras Monkus - taurasmonkus@gmail.com
Project Link backend: https://github.com/taurencijus/eVote-app.git
Project Link frontend: https://github.com/taurencijus/eVote-app-FE.git
