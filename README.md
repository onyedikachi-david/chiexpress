# My implementation of Chimoney fullstack developer challenge

## Tech Stack

- Nextjs 14+
- Tailwind CSS
- TypeScript
- CI.
- Sentry
- AppWrite (DB and Auth)

### Getting started

Run the following command on your local environment:

```shell
git clone https://github.com/onyedikachi-david/chiexpress.git
```

cd into the folder

```shell
cd chiexpress
```

Install packages

```shell
npm install
```

Make a copy of .env.example
```shell
cp .env.example .env.local
```

Create the necessary database and collections and fill them accordingly.

Then, you can run locally in development mode with live reload:

```shell
npm run dev
```

Open <http://localhost:3000> with your favorite browser to see your project.

### Challenge Overview

1. sentry integration

![Sentry](https://github.com/onyedikachi-david/chiexpress/assets/51977119/76280cd4-2318-4c37-adbc-d7fb8f77ce2c)

2. Sign in page
   
![Sign in](https://github.com/onyedikachi-david/chiexpress/assets/51977119/abc4e260-9d42-44d8-afe3-164a0eba0f0c)

4. User Dashboard
   
![Dashboard](https://github.com/onyedikachi-david/chiexpress/assets/51977119/28043c53-2018-4017-9a70-3ae307a3426c)


You are tasked with building a simple deployed web application that allows users to create and manage their accounts, send and receive payments, and view transaction history. The application should be built using React with Next.js (or similar frameworks) on the frontend and Node.js with Express on the backend. Firestore/Supabase (for simplicity or another DB of your choice) will be used as the database, and the application should be deployed using Vercel/Render/Heroku/AWS/GCP etc. It should be live and viewable and have CI/CD.

### Requirements

- [x] User Authentication: Implement user authentication using Firebase Authentication or similar. Users should be able to sign up, log in, and log out securely.

- [x] Dashboard: Create a dashboard page where users can view their account balance, recent transactions, and perform actions such as sending and receiving payments. This could be a call to Chimoney to pull user transactions.

- [x] Send Payment: Implement a feature that allows users to send payments to other users and non-users using Chimoney's API. Users should be able to specify the recipient's account ID (through a search), email or phone number and the amount to send.

- [x] Receive Payment: Implement a feature that allows users to receive payments from other users. When a payment is received, it should be reflected in the user's account balance and transaction history. Consider allowing users receive Payments to their email or phone (powered by Chimoney) and cashing it into their Account in the Web App.

- [x] Transaction History: Create a page where users can view their transaction history, including details such as transaction date, type (sent or received), amount, and recipient/sender information. This could be a call to Chimoney's API to pull user transactions and rendering this is a standard table using a table module of your choosing.

- [x] Security: Ensure that sensitive user data such as passwords and payment information is stored securely and encrypted. Implement necessary security measures to prevent common vulnerabilities such as XSS and CSRF attacks.

- [x] API Integration: Integrate Chimoney's API for sending and receiving payments. Refer to Chimoney's API documentation for details on endpoints and authentication.

- [x] CI/CD: Set up continuous integration and deployment using a available tools. Automate the build and deployment process to ensure smooth and efficient deployment of updates.

- [x] Ambition and Alignment: Demonstrate your ambition and alignment with Chimoney's values of excellence, speed, and impact by delivering a high-quality, well-designed application that meets the requirements and exceeds expectations.
