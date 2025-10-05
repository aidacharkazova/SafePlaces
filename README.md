# 🌍 SafePlaces — A Safety Rating Platform for Women

**SafePlaces** is a platform where women can **rate and review public places** (such as cafes, parks, or libraries) based on how **safe** they feel.  
The goal of the project is to help women make **informed decisions** about the places they visit and to contribute to building **safer communities**.

---

## 🧠 About the Project

SafePlaces allows users to:

- 📍 Add new places (name, location, type, description, etc.)
- ⭐ Rate places based on how safe they feel
- 💬 Write and read reviews from other users
- 🔍 Filter places by rating or category
- 🔐 Register, log in, and access features securely (with JWT authentication)

---

## ⚙️ Tech Stack

| Category | Technologies Used |
|-----------|------------------|
| **Backend** | Java, Spring Boot, Spring Security, Spring Data MongoDB |
| **Frontend** | Thymeleaf, HTML, CSS |
| **Database** | MongoDB |
| **Deployment (Local)** | Apache Tomcat |
| **Architecture** | RESTful API, MVC Pattern |

---

## 🏗️ Project Architecture

The project follows a **Spring Boot MVC** structure:

```

safeplaces/
├── src/
│   ├── main/
│   │   ├── java/com/safeplaces/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   └── model/
│   │   ├── resources/
│   │   │   ├── templates/       # Thymeleaf HTML files
│   │   │   ├── static/          # CSS, JS, images
│   │   │   └── application.properties
├── pom.xml
└── README.md

````

---

## 🚀 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/SafePlaces.git
````

2. **Open the project** in your IDE (IntelliJ / Eclipse).

3. **Configure MongoDB** connection in:

   ```
   src/main/resources/application.properties
   ```

   Example:

   ```properties
   spring.data.mongodb.uri=mongodb://localhost:27017/safeplaces
   jwt.secret=yourSecretKey
   ```

4. **Run the application:**

   ```bash
   mvn spring-boot:run
   ```

5. Access the app at:
   👉 [http://localhost:8080](http://localhost:8080)

---

## 🌸 Purpose

SafePlaces is built to **empower women** by giving them a platform to **share real experiences** about the safety of public spaces.
By combining **technology and community**, it aims to make urban environments **more transparent, inclusive, and safe**.
