# Contributing to queryFi

Thank you for considering contributing to queryFi! We welcome contributions from the community to help improve the project.

## How to Contribute

1. **Fork the Repository:**
   - Click the "Fork" button on GitHub to create your copy of the repository.

2. **Clone the Fork:**
   ```bash
   git clone your-fork
   ```

3. **Create a Branch:**
   - Use a descriptive branch name:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Changes:**
   - Make your changes following the project's coding standards.

5. **Run Tests:**
- If you added a new method make sure to create a test for it in /tests

   ```bash
   npm test
   ```

6. **Commit Changes:**
   - Use [Conventional Commits](https://www.conventionalcommits.org/):
   ```bash
   git commit -m "feat: add new feature description"
   ```

7. **Push Changes:**
   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request:**
   - Go to the repository on GitHub.
   - Click "New Pull Request" and follow the instructions.

---

## Development Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Add the package locally to your project:**

    a. On your fork folder:

        npm link

    b. In your project folder:
        
        npm link your-package
    
    c. Use the package
        
        import { createQuery } from 'your-package';

3. **Run Tests Locally:**
   ```bash
   npm test
   ```

---

## Issue Reporting

- If you have new ideas or you just found something not working as expected, open an issue. 😊

---

## Additional Notes

- All changes must pass linting and tests.
- Follow the project's folder structure and naming conventions.

Thank you for contributing! 🎉

