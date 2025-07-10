# Company X Java & React Style Guide

# Introduction
This style guide outlines the coding conventions for **Java backend** and **React frontend** code developed at Company X. It's designed to promote **consistency, readability, and maintainability** across all our projects.

# Key Principles
* **Readability:** Code should be easy to understand for all team members.
* **Maintainability:** Code should be easy to modify and extend.
* **Consistency:** Adhering to a consistent style across all projects improves collaboration and reduces errors.
* **Performance:** While readability is paramount, code should be efficient.

---

# Java Backend Style Guide

This section covers the coding conventions for Java backend development. It generally aligns with widely accepted Java community standards and Google Java Format, with specific adjustments for Company X.

## Line Length
* **Maximum line length:** 120 characters.
    * Modern IDEs and screens allow for wider lines, which can improve readability for long method signatures or complex expressions.

## Indentation
* **Use 4 spaces per indentation level.**

## Imports
* **Order imports:**
    1.  Static imports
    2.  `java` and `javax` packages
    3.  Third-party packages
    4.  Company X internal packages
* **Group imports:** Imports within each group should be sorted alphabetically.
* **Wildcard imports:** Avoid wildcard imports (e.g., `import java.util.*`) except for specific cases explicitly approved by the team lead (e.g., for `static` imports from test frameworks).

## Naming Conventions

* **Classes:** Use `PascalCase` (CamelCase with initial cap): `UserManager`, `PaymentProcessor`.
* **Interfaces:** Use `PascalCase`: `UserService`, `Authenticator`.
* **Methods:** Use `camelCase`: `calculateTotal()`, `processData()`.
* **Variables:** Use `camelCase`: `userName`, `totalCount`.
* **Constants (static final fields):** Use `SCREAMING_SNAKE_CASE`: `MAX_VALUE`, `DATABASE_NAME`.
* **Packages:** Use `lowercase` with dot separators: `com.companyx.user.service`.

## Javadoc Comments
* **Use Javadoc for all public and protected classes, methods, and fields.**
* **First sentence:** Concise summary of the object's purpose.
* **For complex methods/classes:** Include detailed descriptions of parameters (`@param`), return values (`@return`), exceptions (`@throws`), and any other relevant information.
* **Example:**
    ```java
    /**
     * Calculates the total sum of two integers.
     *
     * @param num1 The first integer.
     * @param num2 The second integer.
     * @return The sum of num1 and num2.
     * @throws IllegalArgumentException if either num1 or num2 is negative.
     */
    public int sum(int num1, int num2) {
        // method body
    }
    ```

## Annotations
* Place annotations on a line preceding the element they annotate. If multiple annotations apply, place them on separate lines.

## Error Handling
* **Use specific exceptions:** Avoid catching broad exceptions like `Exception`. Catch specific exceptions where possible to handle different error conditions appropriately.
* **Handle exceptions gracefully:** Provide informative error messages and avoid crashing the program.
* **Use `try-catch-finally` or `try-with-resources` blocks:** Isolate code that might raise exceptions.
* **Rethrow exceptions:** If an exception cannot be handled locally, rethrow it as a more specific custom exception or a standard runtime exception that provides better context.

## Logging
* **Use a standard logging framework:** Company X uses SLF4j with Logback.
* **Log at appropriate levels:** `TRACE`, `DEBUG`, `INFO`, `WARN`, `ERROR`.
* **Provide context:** Include relevant information in log messages to aid debugging. Use parameterized logging to avoid costly string concatenation when logging is disabled.

## Tooling (Java)
* **Code formatter:** Google Java Format - Enforces consistent formatting automatically.
* **Linter:** SpotBugs/PMD/Checkstyle - Identifies potential issues, bugs, and style violations.

### Example (Java)

```java
package com.companyx.auth.service;

import com.companyx.auth.exception.AuthenticationException;
import com.companyx.user.data.UserRepository;
import com.companyx.user.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Optional;

/**
 * Service for user authentication operations.
 */
@Service
public class AuthenticationService {

    private static final Logger logger = LoggerFactory.getLogger(AuthenticationService.class);
    private static final int SALT_LENGTH = 16; // bytes

    private final UserRepository userRepository;

    public AuthenticationService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Hashes a password with a randomly generated salt.
     *
     * @param password The password to hash.
     * @return A string containing the salt and hashed password, separated by a colon.
     * @throws AuthenticationException if the hashing algorithm is not found.
     */
    public String hashPassword(String password) {
        try {
            SecureRandom random = new SecureRandom();
            byte[] salt = new byte[SALT_LENGTH];
            random.nextBytes(salt);

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] hashedPassword = md.digest(password.getBytes());

            String encodedSalt = Base64.getEncoder().encodeToString(salt);
            String encodedHash = Base64.getEncoder().encodeToString(hashedPassword);

            return encodedSalt + ":" + encodedHash;
        } catch (NoSuchAlgorithmException e) {
            logger.error("SHA-256 algorithm not found", e);
            throw new AuthenticationException("Failed to hash password: " + e.getMessage());
        }
    }

    /**
     * Authenticates a user against the database.
     *
     * @param username The user's username.
     * @param password The user's password.
     * @return True if the user is authenticated, False otherwise.
     * @throws AuthenticationException if an error occurs during authentication.
     */
    public boolean authenticateUser(String username, String password) {
        try {
            Optional<User> userOptional = userRepository.findByUsername(username);

            if (userOptional.isEmpty()) {
                logger.warn("Authentication failed: User not found - {}", username);
                return false;
            }

            User user = userOptional.get();
            String storedHash = user.getPasswordHash();
            String[] parts = storedHash.split(":");
            if (parts.length != 2) {
                logger.error("Invalid stored password hash format for user: {}", username);
                return false;
            }

            byte[] salt = Base64.getDecoder().decode(parts[0]);
            byte[] actualHashedPassword = Base64.getDecoder().decode(parts[1]);

            MessageDigest md = MessageDigest.getInstance("SHA-256");
            md.update(salt);
            byte[] calculatedHash = md.digest(password.getBytes());

            if (MessageDigest.isEqual(calculatedHash, actualHashedPassword)) {
                logger.info("User authenticated successfully - {}", username);
                return true;
            } else {
                logger.warn("Authentication failed: Incorrect password for user - {}", username);
                return false;
            }
        } catch (NoSuchAlgorithmException e) {
            logger.error("SHA-256 algorithm not found during authentication", e);
            throw new AuthenticationException("Authentication error: " + e.getMessage());
        } catch (Exception e) {
            logger.error("An unexpected error occurred during authentication for user {}: {}", username, e.getMessage());
            throw new AuthenticationException("An unexpected error occurred during authentication.");
        }
    }
}
```
---

# React Frontend Style Guide

This section outlines the coding conventions for **React frontend** development using **TypeScript (preferred)** or JavaScript. It emphasizes best practices for building scalable and maintainable user interfaces.

## Line Length
* **Maximum line length:** 100 characters. Similar to the backend, modern screens accommodate wider lines, enhancing component readability.

## Indentation
* **Use 2 spaces per indentation level.** This is a common convention in the JavaScript/React ecosystem.

## File Naming
* **Components:** Use `PascalCase` for component files (e.g., `UserProfile.tsx`, `Button.jsx`).
* **Utility/Hook files:** Use `camelCase` (e.g., `useAuth.ts`, `apiUtils.js`).
* **Index files:** `index.ts` or `index.js` for exporting multiple components from a directory.

## Imports
* **Order imports:**
    1.  Third-party libraries (e.g., `react`, `react-router-dom`)
    2.  Absolute imports for Company X UI libraries/design systems
    3.  Relative imports for local modules (e.g., `../components`, `./utils`)
* **Group imports:** Imports within each group should be sorted alphabetically.

## Naming Conventions

* **Components:** Use `PascalCase`: `UserProfile`, `LoginButton`.
* **Props:** Use `camelCase`: `userName`, `isActive`.
* **State variables (using `useState`):** Use `camelCase`, typically `[value, setValue]` (e.g., `[count, setCount]`).
* **Functions/Methods:** Use `camelCase`: `handleClick()`, `fetchData()`.
* **CSS Classes:** Use `kebab-case`: `user-profile-container`, `button-primary`.
* **Constants:** Use `SCREAMING_SNAKE_CASE` for global or module-level constants (e.g., `API_BASE_URL`).

## Component Structure and Best Practices
* **Functional Components & Hooks:** Prefer **functional components with React Hooks** over class components for new development.
* **Props Destructuring:** Destructure props at the beginning of the component for clarity.
* **Conditional Rendering:** Use ternary operators, logical `&&`, or early returns for conditional rendering.
* **Inline Styles:** Avoid inline styles for complex styling. Prefer CSS Modules, styled-components, or a similar CSS-in-JS solution.
* **Key Prop:** Always provide a `key` prop when rendering lists of elements.
* **Prop Types/TypeScript:**
    * **TypeScript:** Strongly prefer **TypeScript** for type checking component props and state. Define interfaces for props.
    * **Prop Types:** If not using TypeScript, use `prop-types` for runtime type checking.

## JSDoc/TSDoc Comments
* **Document component props:** Use JSDoc (for JavaScript) or TSDoc (for TypeScript) to describe component props.
* **Document functions/hooks:** Explain the purpose, parameters, and return values of complex functions or custom hooks.
* **Example (TypeScript):**
    ```typescript
    /**
     * Props for the Button component.
     */
    interface ButtonProps {
      /**
       * The text to display inside the button.
       */
      label: string;
      /**
       * Callback fired when the button is clicked.
       */
      onClick: () => void;
      /**
       * Whether the button is disabled.
       */
      isDisabled?: boolean;
    }

    /**
     * A reusable button component.
     * @param props The props for the Button component.
     */
    const Button: React.FC<ButtonProps> = ({ label, onClick, isDisabled = false }) => {
      // component body
    };
    ```

## State Management
* **Local State:** Use `useState` for simple component-level state.
* **Global State:** For global application state, use a state management library like **Redux Toolkit, Zustand, or React Context API with `useReducer`** for more complex scenarios. Choose a consistent approach across the project.

## Error Handling
* **Component Error Boundaries:** Use React Error Boundaries to gracefully handle rendering errors within components.
* **API Error Handling:** Implement consistent error handling for API calls (e.g., using `try-catch` with `async/await` and displaying user-friendly error messages).

## Accessibility (A11y)
* **Semantic HTML:** Use semantic HTML elements where appropriate.
* **ARIA Attributes:** Use ARIA attributes to improve accessibility for dynamic content and custom components.
* **Keyboard Navigation:** Ensure all interactive elements are keyboard navigable.

## Tooling (React)
* **Code formatter:** Prettier - Enforces consistent formatting automatically across JavaScript, TypeScript, JSX, and CSS.
* **Linter:** ESLint (with `eslint-plugin-react` and `@typescript-eslint/eslint-plugin` if using TypeScript) - Identifies potential issues, enforces best practices, and flags style violations.

---

### Example (React)

```typescript jsx
import React, { useState, useEffect } from 'react';
import './UserProfile.css'; // Assuming CSS Modules or similar for styling

interface UserData {
  id: number;
  username: string;
  email: string;
}

interface UserProfileProps {
  /**
   * The ID of the user to display.
   */
  userId: number;
  /**
   * Callback fired when the user's profile is successfully loaded.
   */
  onProfileLoaded?: (userData: UserData) => void;
}

/**
 * Displays a user's profile information.
 * Fetches user data from an API based on the provided userId.
 *
 * @param props The props for the UserProfile component.
 */
const UserProfile: React.FC<UserProfileProps> = ({ userId, onProfileLoaded }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/users/${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: UserData = await response.json();
        setUserData(data);
        onProfileLoaded?.(data);
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
        setError('Failed to load user profile. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserProfile();
    }
  }, [userId, onProfileLoaded]); // Re-run effect if userId or onProfileLoaded changes

  if (isLoading) {
    return <div className="user-profile-loading">Loading user profile...</div>;
  }

  if (error) {
    return <div className="user-profile-error">Error: {error}</div>;
  }

  if (!userData) {
    return <div className="user-profile-no-data">No user data available.</div>;
  }

  return (
    <div className="user-profile-container">
      <h2 className="user-profile-title">User Profile</h2>
      <div className="user-profile-details">
        <p><strong>Username:</strong> {userData.username}</p>
        <p><strong>Email:</strong> {userData.email}</p>
      </div>
    </div>
  );
};

export default UserProfile;
```
