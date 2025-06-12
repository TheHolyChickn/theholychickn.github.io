// assets/js/projects.js
document.addEventListener('DOMContentLoaded', function () {
    const projectCardContainer = document.getElementById('projectCardContainer');
    if (!projectCardContainer) {
        console.error('Error: projectCardContainer element not found.');
        return;
    }
    const loadingMessage = projectCardContainer.querySelector('.loading-message');

    // Path to your projects.json file, relative to the projects/index.html file
    const jsonPath = 'projects.json';

    fetch(jsonPath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} while fetching ${jsonPath}`);
            }
            return response.json();
        })
        .then(projects => {
            if (loadingMessage) {
                loadingMessage.remove(); // Remove "Loading..." message
            }

            if (!projects || projects.length === 0) {
                const noProjectsMessage = document.createElement('p');
                noProjectsMessage.textContent = 'No projects listed yet. Check back soon!';
                noProjectsMessage.className = 'no-posts-message'; // Reusing class from blog CSS
                projectCardContainer.appendChild(noProjectsMessage);
                return;
            }

            projects.forEach(project => {
                const cardLink = document.createElement('a');
                cardLink.href = project.link;
                cardLink.className = 'project-card';

                const title = document.createElement('h2');
                title.className = 'project-card-title';
                title.textContent = project.title;

                const description = document.createElement('p');
                description.className = 'project-card-description';
                description.textContent = project.description;

                cardLink.appendChild(title);
                cardLink.appendChild(description);

                projectCardContainer.appendChild(cardLink);
            });
        })
        .catch(error => {
            console.error('Error fetching or parsing projects:', error);
            if (loadingMessage) {
                loadingMessage.textContent = 'Could not load projects. Please try again later.';
                loadingMessage.style.color = 'var(--accent-primary)';
            }
        });
});