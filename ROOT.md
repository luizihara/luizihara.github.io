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
├── fiap.advocacyeinfluencia.github.io/       # FIAP Project: Advocacy & Influence
├── fiap.capacitacaoorganizacionalIA.github.io/ # FIAP Project: Org Capacity (IA)
├── fiap.capacitacaoorganizacionalIA2.github.io/ # FIAP Project: Org Capacity (IA - 2)
└── fiap.capacitacaoorganizacionalIA3.github.io/ # FIAP Project: Org Capacity (IA - 3)
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
