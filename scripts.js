document.addEventListener('DOMContentLoaded', () => {
    // Define variables for each face color
    const aboutMeColor = 0xe0f7fa; // Light Cyan
    const skillsColor = 0xfff9c4; // Light Yellow
    const projectsColor = 0xffe0b2; // Light Orange
    const experienceColor = 0xc8e6c9; // Light Green
    const educationColor = 0xb3e5fc; // Light Blue
    const contactColor = 0xd1c4e9; // Light Purple

    const colors = [
        aboutMeColor, skillsColor, projectsColor, experienceColor, educationColor, contactColor
    ];

    const sections = [
        { id: 'about-me', color: aboutMeColor },
        { id: 'skills', color: skillsColor },
        { id: 'projects', color: projectsColor },
        { id: 'experience', color: experienceColor },
        { id: 'education', color: educationColor },
        { id: 'contact', color: contactColor }
    ];

    const scrollContainer = document.querySelector('.scroll-container');
    const canvas = document.getElementById('3d-canvas');
    const header = document.querySelector('header');
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(300, 300); // Slightly smaller size for the cube

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 5;

    const geometry = new THREE.BoxGeometry(2.5, 2.5, 2.5); // Slightly smaller cube size
    const materials = [
        new THREE.MeshBasicMaterial({ color: experienceColor }), // fourth
        new THREE.MeshBasicMaterial({ color: skillsColor }), // second
        new THREE.MeshBasicMaterial({ color: educationColor }), // fifth
        new THREE.MeshBasicMaterial({ color: contactColor }), // sixth
        new THREE.MeshBasicMaterial({ color: aboutMeColor }), // first
        new THREE.MeshBasicMaterial({ color: projectsColor }) // third
    ];
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    animate();

    const rotations = [
        { x: 0, y: 0 }, // About Me - Light Cyan
        { x: 0, y: Math.PI / 2 }, // Skills - Light Yellow
        { x: 0, y: Math.PI }, // Projects - Light Orange
        { x: 0, y: -Math.PI / 2 }, // Experience - Light Green
        { x: Math.PI / 2, y: 0 }, // Education - Light Blue
        { x: -Math.PI / 2, y: 0 } // Contact - Light Purple
    ];

    // Set initial header color
    header.style.backgroundColor = '#e0f7fa';

    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', (event) => {
        isDragging = true;
        previousMousePosition = { x: event.clientX, y: event.clientY };
    });

    document.addEventListener('mousemove', (event) => {
        if (isDragging) {
            const deltaX = event.clientX - previousMousePosition.x;
            const deltaY = event.clientY - previousMousePosition.y;

            cube.rotation.y += deltaX * 0.01;
            cube.rotation.x += deltaY * 0.01;

            previousMousePosition = { x: event.clientX, y: event.clientY };
        }
    });

    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;

            // Determine the closest section based on the cube's rotation
            let closestSectionIndex = 0;
            let minDistance = Infinity;

            rotations.forEach((rotation, index) => {
                const distance = Math.sqrt(
                    Math.pow(cube.rotation.x - rotation.x, 2) +
                    Math.pow(cube.rotation.y - rotation.y, 2)
                );
                if (distance < minDistance) {
                    closestSectionIndex = index;
                    minDistance = distance;
                }
            });

            // Snap to the closest section
            const targetRotation = rotations[closestSectionIndex];
            gsap.to(cube.rotation, {
                duration: 1,
                x: targetRotation.x,
                y: targetRotation.y,
                ease: "power3.inOut",
                onComplete: () => {
                    // Scroll to the corresponding section
                    scrollContainer.scrollTo({
                        left: closestSectionIndex * window.innerWidth,
                        behavior: 'smooth'
                    });

                    // Animate the header color change
                    const headerTransition = document.createElement('div');
                    headerTransition.classList.add('header-transition');
                    headerTransition.style.setProperty('--header-color', getComputedStyle(document.getElementById(sections[closestSectionIndex].id)).backgroundColor);
                    header.appendChild(headerTransition);

                    // Remove the transition element after the animation is complete
                    setTimeout(() => {
                        headerTransition.remove();
                        header.style.backgroundColor = getComputedStyle(document.getElementById(sections[closestSectionIndex].id)).backgroundColor;
                    }, 500); // Match the duration of the animation
                }
            });

            // Remove the scaling class after snapping
            sections.forEach(section => {
                const element = document.getElementById(section.id);
                element.classList.remove('scaling');
            });
        }
    });

    scrollContainer.addEventListener('scroll', () => {
        const sectionWidth = window.innerWidth;
        const sectionIndex = Math.round(scrollContainer.scrollLeft / sectionWidth);
        const targetRotation = rotations[sectionIndex % rotations.length];

        gsap.to(cube.rotation, {
            duration: 1,
            x: targetRotation.x,
            y: targetRotation.y,
            ease: "power3.inOut"
        });

        // Animate the header color change
        const headerTransition = document.createElement('div');
        headerTransition.classList.add('header-transition');
        headerTransition.style.setProperty('--header-color', getComputedStyle(document.getElementById(sections[sectionIndex].id)).backgroundColor);
        header.appendChild(headerTransition);

        // Remove the transition element after the animation is complete
        setTimeout(() => {
            headerTransition.remove();
            header.style.backgroundColor = getComputedStyle(document.getElementById(sections[sectionIndex].id)).backgroundColor;
        }, 500); // Match the duration of the animation

        // Add the scaling class during scroll
        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (Math.abs(scrollContainer.scrollLeft - sectionWidth * sectionIndex) < sectionWidth / 2) {
                element.classList.add('scaling');
            } else {
                element.classList.remove('scaling');
            }
        });
    });

    scrollContainer.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaY < 0 ? -300 : 300;
        scrollContainer.scrollBy({
            left: delta,
            behavior: 'smooth'
        });

        const sectionWidth = window.innerWidth;
        const sectionIndex = Math.round((scrollContainer.scrollLeft + delta) / sectionWidth);
        const targetRotation = rotations[sectionIndex % rotations.length];

        gsap.to(cube.rotation, {
            duration: 1,
            x: targetRotation.x,
            y: targetRotation.y,
            ease: "power3.inOut"
        });

        // Animate the header color change
        const headerTransition = document.createElement('div');
        headerTransition.classList.add('header-transition');
        headerTransition.style.setProperty('--header-color', getComputedStyle(document.getElementById(sections[sectionIndex].id)).backgroundColor);
        header.appendChild(headerTransition);

        // Remove the transition element after the animation is complete
        setTimeout(() => {
            headerTransition.remove();
            header.style.backgroundColor = getComputedStyle(document.getElementById(sections[sectionIndex].id)).backgroundColor;
        }, 500); // Match the duration of the animation

        // Add the scaling class during scroll
        sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (Math.abs(scrollContainer.scrollLeft - sectionWidth * sectionIndex) < sectionWidth / 2) {
                element.classList.add('scaling');
            } else {
                element.classList.remove('scaling');
            }
        });
    });

    // Show sub page
    window.showSubPage = function(subPageId) {
        const subPage = document.getElementById(subPageId);
        subPage.style.display = 'flex';
        subPage.style.top = '100vh';
        setTimeout(() => {
            subPage.style.top = '0';
        }, 10);
    
        // Animate dots on the skills sub-page
        if (subPageId === 'skills-sub') {
            const skills = document.querySelectorAll('.skill .dots');
            skills.forEach(skill => {
                const skillLevel = parseFloat(skill.getAttribute('data-skill-level')); // Parse skill level as float
                const dots = skill.children;
                for (let i = 0; i < Math.floor(skillLevel); i++) {
                    setTimeout(() => {
                        dots[i].classList.add('revealed');
                    }, i * 100); // Delay each dot's reveal by 100ms
                }
                // If there's a half dot, reveal it
                if (skillLevel % 1 !== 0) {
                    setTimeout(() => {
                        dots[Math.floor(skillLevel)].classList.add('revealed');
                    }, Math.floor(skillLevel) * 100);
                }
            });
        }
    }
    
    // Hide sub page
    window.hideSubPage = function(subPageId) {
        const subPage = document.getElementById(subPageId);
        subPage.style.top = '100vh';
        setTimeout(() => {
            subPage.style.display = 'none';
            if (subPageId === 'skills-sub') {
                const skills = document.querySelectorAll('.skill .dots');
                skills.forEach(skill => {
                    const dots = skill.children;
                    for (let dot of dots) {
                        dot.classList.remove('revealed');
                    }
                });
            }
        }, 500);
    }
});
