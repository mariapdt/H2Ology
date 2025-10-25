# H2Ology

A simple, modern website built with HTML, CSS, and JavaScript.

## 🚀 Deploying to GitHub Pages

Follow these steps to deploy your website to GitHub Pages:

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `h2ology`)
4. Make it public
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 2. Push Your Code to GitHub

Open your terminal in this project directory and run:

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit"

# Add your GitHub repository as remote (replace with your repository URL)
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" (top right)
3. Scroll down and click on "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Under "Branch", select `main` and `/ (root)`
6. Click "Save"

### 4. Access Your Website

After a few minutes, your website will be live at:

```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

GitHub will show you the exact URL in the Pages settings.

## 📁 Project Structure

```
H2Ology/
├── index.html      # Main HTML file
├── styles.css      # CSS styles
├── script.js       # JavaScript functionality
├── .gitignore      # Git ignore file
└── README.md       # This file
```

## 🛠️ Development

To develop locally:

1. Open `index.html` in your web browser
2. Make changes to the HTML, CSS, or JavaScript files
3. Refresh the browser to see your changes

Alternatively, you can use a local development server:

```bash
# Using Python 3
python3 -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server
```

Then visit `http://localhost:8000` in your browser.

## 🎨 Customization

- **Colors**: Edit CSS variables in `styles.css` under `:root`
- **Content**: Modify text and structure in `index.html`
- **Functionality**: Add interactive features in `script.js`

## 📝 Features

- ✨ Responsive design
- 🎯 Smooth scrolling navigation
- 🎨 Modern CSS animations
- 📱 Mobile-friendly
- 🚀 Ready for GitHub Pages

## 📄 License

This project is open source and available for personal and commercial use.
