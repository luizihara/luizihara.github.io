# Project Overview: Luiz Ihara's Portfolio & FIAP MBA Projects

This repository hosts the personal portfolio website of Luiz Ihara and serves as a monorepo for various projects developed during the FIAP MBA in AI Business Leadership.

## 🏗 Architecture

The project is structured as a **Static Site** hosted on GitHub Pages.

- **Root Site**: Built with [Jekyll](https://jekyllrb.com/) using the `jekyll-theme-cayman`.
- **Sub-projects**: Independent static HTML/CSS/JS applications located in subdirectories. They are served directly by GitHub Pages as sub-paths.

## 📂 Directory Structure

```graphql
luizihara.github.io/
├── _config.yml               # Jekyll configuration (theme, title, etc.)
├── index.md                  # Main homepage content (Markdown)
├── portuguese.md             # Portuguese version of the homepage
├── ROOT.md                   # Project documentation (this file)
│
├── fiap.advocacyeinfluencia/                 # FIAP Project: Advocacy & Influence
└── fiap.capacitacaoorganizacional/           # FIAP Project: Org Capacity (IA)
    ├── index-1.html                          # Part 1
    ├── index-2.html                          # Part 2
    └── index-3.html                          # Part 3
```

## 🚀 How to Run/Deploy

### Deployment
This project relies on **GitHub Pages**.
1. Push changes to the `main` (or `master`) branch.
2. GitHub automatically builds the Jekyll site and serves the static files.

### Adding New Projects
To add a new sub-project (e.g., another FIAP repository):
1. Copy the project folder into the root of this repository.
2. Remove the `.git` folder from the copied project to avoid submodule conflicts `rm -rf project-name/.git`.
3. Add a link to the new project in `index.md` and `portuguese.md`.

## 🛠 Tech Stack
- **Static Gen**: Jekyll
- **Theme**: Cayman
- **Sub-projects**: HTML5, CSS3, JavaScript (Vanilla, Chart.js, Tailwind via CDN)

## 🎨 Standardization Rules

### 1. Site Visit Badge (O Balãozinho)
All `.html` pages in this repository MUST include a floating "Visit Badge" in the bottom-right corner. This badge informs visitors they are browsing `luizihara.github.io`.

**Requirements:**
- **Position**: Fixed at bottom-right (`bottom: 20px`, `right: 20px`).
- **Functionality**: Must have a close button (`×`) that hides the element.
- **Theming**: The badge colors (background, border, text, shadow) **MUST be adapted** to match the specific color palette of the page/project it is inserted into. Do not use a hardcoded default if it clashes with the page design.

**Standard Code Snippet (Adapt Colors):**

```html
<!-- Visit Badge Styles -->
<style>
    .floating-badge {
        position: fixed;
        bottom: 20px;
        right: 20px;
        /* ADAPT COLORS HERE: */
        background-color: #181818; /* e.g. dark background */
        color: #ffffff;
        border: 1px solid #FFC600; /* e.g. highlight color */
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
        /* ------------------ */
        padding: 12px 20px;
        border-radius: 50px;
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 1000;
        font-family: sans-serif; /* Use project font */
        font-size: 14px;
        animation: slideIn 0.5s ease-out forwards;
    }

    .floating-badge a {
        /* ADAPT LINK COLOR: */
        color: #FFC600; 
        text-decoration: none;
        font-weight: bold;
    }

    .floating-badge a:hover {
        text-decoration: underline;
    }

    .close-badge {
        background: none;
        border: none;
        color: inherit;
        opacity: 0.7;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
        line-height: 1;
    }

    .close-badge:hover {
        opacity: 1;
    }

    @keyframes slideIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
</style>

<!-- Visit Badge Script -->
<script>
    function closeBadge() {
        document.getElementById('visit-badge').style.display = 'none';
    }
</script>

<!-- Badge Element (Place at end of body) -->
<div id="visit-badge" class="floating-badge">
    <span class="badge-icon">🌐</span>
    <span>
        Você está visitando o site de 
        <a href="https://luizihara.github.io/" target="_blank">luizihara.github.io</a>
    </span>
    <button class="close-badge" onclick="closeBadge()" title="Fechar">×</button>
</div>
```
