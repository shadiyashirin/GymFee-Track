# GymFeeTrack: Subscription & Payment Tracker

## 🚀 Project Overview
A full-stack web application designed for gym owners and members to manage subscriptions and track payments. Built as a learning project to master the integration of a React frontend with a Django REST API.

## ✨ Key Features
- **User Authentication:** Secure member registration and login.
- **Role-Based Access:** Differentiated dashboards and permissions for members and admins.
- **Membership Plans:** Admins can create, update, and delete membership plans. All users can view plans.
- **Subscription Management:** Admins can manage member subscriptions and record payments.
- **Member Dashboard:** Members can view their current subscription status and payment history.
- **RESTful API:** All interactions between the frontend and backend are handled via a REST API.

## 💻 Technologies Used
### Backend
- **Python 3.8+**
- **Django 3.2+**
- **Django REST Framework (DRF)**: For building the API endpoints and serializers.
- **Django CORS Headers**: For enabling cross-origin communication with the frontend.

### Frontend
- **React 18+**
- **JavaScript (ES6+)**
- **Axios**: For making HTTP requests to the backend API.
- **React Router DOM**: For client-side routing and protecting private pages.
- **React Context API**: For global state management (authentication status, user roles).


## 💡 What I Learned 
- **Full-Stack Architecture:** The fundamental principles of separating a backend API from a React frontend.
- **Django REST Framework:** Building robust and secure APIs with serializers, views, and URL routing.
- **Token Authentication:** The complete flow of obtaining and using an authentication token to secure API endpoints.
- **React State Management:** Using `useState`, `useEffect`, and the Context API to manage and share data across components efficiently.
- **Conditional Rendering:** Displaying UI elements based on user roles (`isAdmin`) and authentication status.
- **React Router:** Implementing client-side routing and protecting routes with custom `PrivateRoute` components.
- **Debugging Skills:** Using browser developer tools (Console, Network tab) to diagnose and fix complex full-stack errors.


## 🚀 Next Steps (Future Enhancements)
- Integrate a real payment gateway (Stripe or Razorpay).
- Add a member profile page for updating personal information.
- Implement password reset functionality.
- Add a chart to the admin dashboard for monthly revenue tracking.
