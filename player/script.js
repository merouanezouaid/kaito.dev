document.addEventListener('DOMContentLoaded', function() {
    // Set proper Windows XP style icons using Webdings font
    const prevBtn = document.querySelector('.prev');
    const playBtn = document.querySelector('.play');
    const stopBtn = document.querySelector('.stop');
    const nextBtn = document.querySelector('.next');
    const closeBtn = document.querySelector('.close');
    const maximizeBtn = document.querySelector('.maximize');
    const minimizeBtn = document.querySelector('.minimize');

    // Set Windows XP style button texts
    prevBtn.innerHTML = '9';    // Webdings character for previous
    playBtn.innerHTML = '4';    // Webdings character for play
    stopBtn.innerHTML = '=';    // Webdings character for stop
    nextBtn.innerHTML = ':';    // Webdings character for next
    closeBtn.innerHTML = '×';   // Close button
    maximizeBtn.innerHTML = '□'; // Maximize button
    minimizeBtn.innerHTML = '_'; // Minimize button

    let isPlaying = false;

    // Add visualization
    const videoWindow = document.querySelector('.video-window');
    
    // Create visualization container
    const visualization = document.createElement('div');
    visualization.className = 'visualization';
    const canvas = document.createElement('canvas');
    visualization.appendChild(canvas);
    videoWindow.insertBefore(visualization, videoWindow.firstChild);

    // Setup canvas
    const ctx = canvas.getContext('2d');
    let animationFrame;
    let particles = [];

    function resizeCanvas() {
        canvas.width = visualization.offsetWidth;
        canvas.height = visualization.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle class for visualization
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.speed = 1 + Math.random() * 2;
            this.radius = 1 + Math.random() * 2;
            this.hue = Math.random() * 60 - 30; // Blue-ish range
        }

        update() {
            this.y -= this.speed;
            if (this.y < -10) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `hsl(${200 + this.hue}, 70%, 50%)`;
            ctx.fill();
        }
    }

    // Create initial particles
    function initParticles() {
        particles = [];
        for (let i = 0; i < 100; i++) {
            particles.push(new Particle());
        }
    }

    // Add song list and visualization types
    const songs = [
        {
            title: "Find My Way Home - by Sammy Virji",
            artist: "welcome to my portfolio",
            album: "Find My Way Home",
            duration: 258,
            albumArt: "https://geo-media.beatport.com/image_size/1400x1400/0ed179bc-12e0-47b3-b210-5c749bd0b162.jpg"
        },
        {
            title: "One Of Those Nights",
            artist: "salute & Empress Of",
            album: "TRUE MAGIC",
            duration: 187,
            albumArt: "https://f4.bcbits.com/img/a3793060197_65"
        },
        {
            title: "Bohemian Rhapsody",
            artist: "Queen",
            album: "A Night at the Opera",
            duration: 354,
            albumArt: "https://i.scdn.co/image/ab67616d0000b273d254ca497999ae980a5a38c5"
        }
    ];

    const visualizations = {
        water: {
            name: "Ambience: Water",
            render: function(ctx, canvas, time) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });

                // Wave effect
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(0, 150, 255, 0.5)';
                ctx.lineWidth = 2;

                for (let i = 0; i < canvas.width; i++) {
                    const y = Math.sin(i * 0.02 + time) * 20 + canvas.height / 2;
                    if (i === 0) ctx.moveTo(i, y);
                    else ctx.lineTo(i, y);
                }
                ctx.stroke();
            }
        },
        dna: {
            name: "DNA Helix",
            render: function(ctx, canvas, time) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const centerY = canvas.height / 2;
                const amplitude = 50;
                const frequency = 0.02;
                const spacing = 10;

                for (let x = 0; x < canvas.width; x += spacing) {
                    // First strand
                    const y1 = centerY + Math.sin(x * frequency + time) * amplitude;
                    ctx.beginPath();
                    ctx.arc(x, y1, 3, 0, Math.PI * 2);
                    ctx.fillStyle = `hsl(${x * 0.3}, 70%, 50%)`;
                    ctx.fill();

                    // Second strand
                    const y2 = centerY + Math.sin(x * frequency + time + Math.PI) * amplitude;
                    ctx.beginPath();
                    ctx.arc(x, y2, 3, 0, Math.PI * 2);
                    ctx.fillStyle = `hsl(${x * 0.3 + 180}, 70%, 50%)`;
                    ctx.fill();

                    // Connect strands
                    if (x % (spacing * 4) === 0) {
                        ctx.beginPath();
                        ctx.moveTo(x, y1);
                        ctx.lineTo(x, y2);
                        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
                        ctx.stroke();
                    }
                }
            }
        },
        matrix: {
            name: "Digital Rain",
            render: function(ctx, canvas, time) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const fontSize = 14;
                const columns = Math.floor(canvas.width / fontSize);
                
                if (!this.drops) {
                    this.drops = new Array(columns).fill(0);
                }

                ctx.fillStyle = '#0F0';
                ctx.font = `${fontSize}px monospace`;

                for (let i = 0; i < this.drops.length; i++) {
                    const char = String.fromCharCode(0x30A0 + Math.random() * 96);
                    const x = i * fontSize;
                    const y = this.drops[i] * fontSize;

                    ctx.fillText(char, x, y);

                    if (y > canvas.height && Math.random() > 0.99) {
                        this.drops[i] = 0;
                    }
                    this.drops[i]++;
                }
            }
        },
        starfield: {
            name: "Starfield",
            render: function(ctx, canvas, time) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                if (!this.stars) {
                    this.stars = Array.from({length: 200}, () => ({
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        z: Math.random() * 2
                    }));
                }

                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;

                this.stars.forEach(star => {
                    star.z += 0.01;
                    
                    const x = (star.x - centerX) * star.z + centerX;
                    const y = (star.y - centerY) * star.z + centerY;
                    const size = star.z * 2;

                    if (x < 0 || x > canvas.width || y < 0 || y > canvas.height) {
                        star.x = Math.random() * canvas.width;
                        star.y = Math.random() * canvas.height;
                        star.z = 0;
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, size, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${time * 50}, 80%, 80%, ${1 - star.z/2})`;
                    ctx.fill();
                });
            }
        },
        spectrum: {
            name: "Audio Spectrum",
            render: function(ctx, canvas, time) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const barCount = 64;
                const barSpacing = 2;
                const barWidth = (canvas.width / barCount) - barSpacing;
                
                for (let i = 0; i < barCount; i++) {
                    // Simulate audio spectrum with sine waves
                    const height = Math.abs(
                        Math.sin(time * 2 + i * 0.1) * 
                        Math.sin(time * 0.5 + i * 0.05) * 
                        canvas.height * 0.5
                    );
                    
                    const hue = (i / barCount) * 360;
                    ctx.fillStyle = `hsl(${hue}, 80%, 50%)`;
                    
                    ctx.fillRect(
                        i * (barWidth + barSpacing),
                        canvas.height - height,
                        barWidth,
                        height
                    );

                    // Mirror effect
                    ctx.fillRect(
                        i * (barWidth + barSpacing),
                        0,
                        barWidth,
                        height * 0.3
                    );
                }
            }
        },
        vortex: {
            name: "Cosmic Vortex",
            render: function(ctx, canvas, time) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const maxRadius = Math.min(canvas.width, canvas.height) * 0.4;

                for (let i = 0; i < 150; i++) {
                    const angle = (i * 0.1) + time;
                    const spiral = i * 0.2;
                    const x = centerX + Math.cos(angle) * (spiral + Math.sin(time) * 20);
                    const y = centerY + Math.sin(angle) * (spiral + Math.cos(time) * 20);
                    
                    const hue = (angle * 30) % 360;
                    ctx.beginPath();
                    ctx.arc(x, y, 2, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${hue}, 100%, 50%, 0.8)`;
                    ctx.fill();

                    // Connect points to create trails
                    if (i > 0) {
                        const prevAngle = ((i - 1) * 0.1) + time;
                        const prevSpiral = (i - 1) * 0.2;
                        const prevX = centerX + Math.cos(prevAngle) * (prevSpiral + Math.sin(time) * 20);
                        const prevY = centerY + Math.sin(prevAngle) * (prevSpiral + Math.cos(time) * 20);
                        
                        ctx.beginPath();
                        ctx.moveTo(prevX, prevY);
                        ctx.lineTo(x, y);
                        ctx.strokeStyle = `hsla(${hue}, 100%, 50%, 0.3)`;
                        ctx.stroke();
                    }
                }
            }
        },
        plasma: {
            name: "Plasma Wave",
            render: function(ctx, canvas, time) {
                if (!this.imageData) {
                    this.imageData = ctx.createImageData(canvas.width, canvas.height);
                }

                const { width, height } = canvas;
                const { data } = this.imageData;

                for (let x = 0; x < width; x++) {
                    for (let y = 0; y < height; y++) {
                        // Create plasma effect using sine waves
                        const value = Math.sin(x * 0.01 + time) +
                                    Math.sin(y * 0.01 + time) +
                                    Math.sin((x + y) * 0.01 + time) +
                                    Math.sin(Math.sqrt(x * x + y * y) * 0.01 + time);

                        const i = (x + y * width) * 4;
                        const normalized = ((value + 4) / 8) * 255;

                        // Create colorful plasma effect
                        data[i] = normalized;                          // Red
                        data[i + 1] = normalized * Math.sin(time);    // Green
                        data[i + 2] = 255 - normalized;               // Blue
                        data[i + 3] = 255;                           // Alpha
                    }
                }

                ctx.putImageData(this.imageData, 0, 0);
            }
        }
    };

    // Update the animation loop to handle different visualizations
    let currentVisualization = 'water';

    function animate() {
        const time = Date.now() * 0.001;
        visualizations[currentVisualization].render(ctx, canvas, time);

        if (isPlaying) {
            animationFrame = requestAnimationFrame(animate);
        }
    }

    // Add this to handle audio playback
    const audioPlayer = document.querySelector('#audioPlayer');

    // Update play button functionality
    playBtn.addEventListener('click', () => {
        isPlaying = !isPlaying;
        playBtn.innerHTML = isPlaying ? ';' : '4';
        
        if (isPlaying) {
            audioPlayer.play();
            visualization.classList.add('active');
            initParticles();
            animate();
        } else {
            audioPlayer.pause();
            visualization.classList.remove('active');
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        }
        
        document.querySelector('.status').textContent = isPlaying ? 'Playing' : 'Ready';
    });

    // Update stop button functionality
    stopBtn.addEventListener('click', () => {
        isPlaying = false;
        playBtn.innerHTML = '4';
        audioPlayer.pause();
        audioPlayer.currentTime = 0;
        visualization.classList.remove('active');
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
        document.querySelector('.status').textContent = 'Stopped';
        document.querySelector('.time-display').textContent = '00:00';
        document.querySelector('.seek-bar-fill').style.width = '0%';
    });

    // Add hover effect for sidebar items
    document.querySelectorAll('.sidebar div').forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        item.addEventListener('mouseleave', () => {
            item.style.backgroundColor = 'transparent';
        });
    });

    // Update the progress bar functionality
    const seekBar = document.querySelector('.seek-bar');
    const seekBarFill = document.querySelector('.seek-bar-fill');
    const timeDisplay = document.querySelector('.time-display');
    let isDragging = false;
    let duration = 213; // Duration in seconds (3:33)

    // Update seek bar on click/drag
    seekBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        updateSeekBar(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            updateSeekBar(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    function updateSeekBar(e) {
        const rect = seekBar.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        seekBarFill.style.width = `${percentage}%`;
        
        // Update audio position
        const newTime = (percentage / 100) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
        
        // Update time display
        const minutes = Math.floor(newTime / 60);
        const seconds = Math.floor(newTime % 60);
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    // Update progress bar based on audio time
    audioPlayer.addEventListener('timeupdate', () => {
        if (!isDragging) {
            const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            seekBarFill.style.width = `${percentage}%`;
            
            const minutes = Math.floor(audioPlayer.currentTime / 60);
            const seconds = Math.floor(audioPlayer.currentTime % 60);
            timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    });

    // Add volume control functionality
    const volumeSlider = document.querySelector('.volume-slider');
    const volumeFill = document.querySelector('.volume-slider-fill');
    let isDraggingVolume = false;

    volumeSlider.addEventListener('mousedown', (e) => {
        isDraggingVolume = true;
        updateVolume(e);
    });

    document.addEventListener('mousemove', (e) => {
        if (isDraggingVolume) {
            updateVolume(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDraggingVolume = false;
    });

    function updateVolume(e) {
        const rect = volumeSlider.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
        volumeFill.style.width = `${percentage}%`;
        audioPlayer.volume = percentage / 100;
    }

    // Add volume icon click to mute/unmute
    const volumeIcon = document.querySelector('.volume-icon');
    let isMuted = false;
    let previousVolume = 70;

    volumeIcon.addEventListener('click', () => {
        isMuted = !isMuted;
        audioPlayer.muted = isMuted;
        if (isMuted) {
            previousVolume = parseFloat(volumeFill.style.width);
            volumeFill.style.width = '0%';
            volumeIcon.innerHTML = 'W';
        } else {
            volumeFill.style.width = previousVolume + '%';
            volumeIcon.innerHTML = 'X';
        }
    });

    // Handle mute/unmute
    volumeIcon.addEventListener('click', () => {
        isMuted = !isMuted;
        audioPlayer.muted = isMuted;
        if (isMuted) {
            previousVolume = parseFloat(volumeFill.style.width);
            volumeFill.style.width = '0%';
            volumeIcon.innerHTML = 'W';
        } else {
            volumeFill.style.width = previousVolume + '%';
            volumeIcon.innerHTML = 'X';
        }
    });

    // Load metadata when audio is ready
    audioPlayer.addEventListener('loadedmetadata', () => {
        // Update duration
        duration = audioPlayer.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        document.querySelector('.total-time').textContent = 
            `Total Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
    });

    // Content sections
    const contentSections = {
        about: {
            title: "About Me",
            content: `
                <div class="profile-section" style="
                    background-image: url('./image.png');
                    background-size: 50% auto;
                    background-position: top -10px right -10px;
                    background-repeat: no-repeat;
                    position: relative;
                ">
                    <!-- Add an overlay div for transparency -->
                    <div style="
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background-color: rgba(0, 0, 0, 0.75);
                        z-index: 1;
                    "></div>
                    
                    <!-- Wrap content in a div to position above overlay -->
                    <div style="position: relative; z-index: 2;">
                        <h2>Merouane Zouaid</h2>
                        <p class="bio">Machine Learning Engineering student in Rabat, Morocco.</p>
                        <p>Co-founder of <a href="https://x.com/merouanezouaid/status/1861161032598569063" style="color: white; text-decoration: underline;">ALTs Morocco</a>, an open collective where people work on their own ideas.</p>
                        <p>Previously Growth Hacker @<a href="https://buildspace.so" style="color: white; text-decoration: underline;">buildspace</a> for season 5</p>
                        <p>Building AI-powered tools like <a href="https://youloop.framer.ai/" style="color: white; text-decoration: underline;">YouLoop</a>, <a href="https://github.com/merouanezouaid/dwayat.ai" style="color: white; text-decoration: underline;">Dwayat AI</a>, <a href="https://complete-ai.webflow.io/" style="color: white; text-decoration: underline;">Complete AI</a>, <a href="https://omates.framer.ai" style="color: white; text-decoration: underline;">Omates</a>...</p>
                        <p>Launched "30 days of ML," the first ebook in Morocco for machine learning.</p>
                        <p>Currently building <a href="https://kitaby.ma" style="color: white; text-decoration: underline;">kitaby.ma</a>, an online marketplace for new and used books in Morocco.</p>
                        <p class="fun-fact">Fun fact: I make content on <a href="https://youtube.com/@mekaito" style="color: white; text-decoration: underline;">YouTube</a>.</p>
                    </div>
                </div>
            `
        },
        projects: {
            title: "My Projects",
            content: `
                <div class="projects-grid">
                    <div class="project-card">
                        <h3>zklib-js</h3>
                        <span class="status alive">Active</span>
                        <span class="users">3,000+ users</span>
                        <a href="https://github.com/merouanezouaid/zklib-js" class="project-link" style="color: white; text-decoration: underline;">View Project</a>
                    </div>
                    <div class="project-card">
                        <h3>youloop</h3>
                        <span class="status alive">Active</span>
                        <span class="users">300+ users</span>
                        <a href="https://youloop.framer.ai/" class="project-link" style="color: white; text-decoration: underline;">View Project</a>
                    </div>
                    <!-- Add other projects -->
                </div>
            `
        },
        highlights: {
            title: "Recent Highlights",
            content: `
                <div class="highlights-list">
                    <div class="highlight-item">
                        <p>- 2.6k YouTube subscribers, 100,000+ views</p>
                    </div>
                    <div class="highlight-item">
                        <p>- Public speaker at international conferences: Devoxx, DevFest, Google Creators Summit</p>
                    </div>
                    <!-- Add other highlights -->
                    <div class="highlight-item">
                        <p>- Global top 100 Google Solution Challenge for TLDR; AI</p>
                    </div>
                    <div class="highlight-item">
                        <p>- Organized tech events with 300+ attendees</p>
                    </div>
                    <div class="highlight-item">
                        <p>- Machine learning instructor for the Google Developers Certification at GDG</p>
                    </div>
                    <div class="highlight-item">
                        <p>- Launched a podcast: Today's Deep Dive (using NotebookLM)</p>
                    </div>
                    <div class="highlight-item">
                        <p>- Went live on YouTube for 12 hours straight building Omates</p>
                    </div>
                </div>
            `
        },
        presentations: {
            title: "Technical Presentations",
            content: `
                <div class="presentations-list">
                    <div class="presentation-item">
                        <a href="https://docs.google.com/presentation/d/1BJ4p-p_MX4Jqc03kNGx814xh21e5ZrQWXifBGeYAC4Q/edit?usp=sharing" class="presentation-link" style="color: white; text-decoration: underline;"><h3>Why are vector databases so fast?</h3></a>
                    </div>
                    <!-- Add other presentations -->
                    <div class="presentation-item">           
                        <a href="https://docs.google.com/presentation/d/1pet1ds1nMZwNk8XwEC51qtOo6JUA-OGBpjahFPOQmj0/edit?usp=sharing" class="presentation-link" style="color: white; text-decoration: underline;"><h3>Explained: Image Analysis and Processing in R Programming Language</h3></a>
                    </div>
                    <div class="presentation-item">
                        <a href="https://docs.google.com/presentation/d/1psdsgx1bBnqSPTG0o-3LotUbtkDpqpVJE-n1h7DwfTk/edit?usp=sharing" class="presentation-link" style="color: white; text-decoration: underline;"><h3>Open Source 101</h3></a>
                    </div>
                    <div class="presentation-item">
                        <a href="https://docs.google.com/presentation/d/16VDkij48Xa7NdNV2jk8K3SgXxRd7x8y1DJ1_wSSBc4c/edit?usp=sharing" class="presentation-link" style="color: white; text-decoration: underline;"><h3>Intro to the World of AI</h3></a>
                    </div>
                </div>
            `
        },
        socials: {
            title: "Connect With Me",
            content: `
                <div class="social-links">
                    <a href="https://x.com/merouanezouaid" class="social-link twitter" style="color: white; text-decoration: underline;">
                        <i class="bi bi-twitter"></i> Twitter
                    </a>
                    <a href="https://youtube.com/@mekaito" class="social-link youtube" style="color: white; text-decoration: underline;">
                        <i class="bi bi-youtube"></i> YouTube
                    </a>
                    <!-- Add other social links -->
                    <a href="https://github.com/merouanezouaid" class="social-link github" style="color: white; text-decoration: underline;">
                        <i class="bi bi-github"></i> GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/merouanezouaid/" class="social-link linkedin" style="color: white; text-decoration: underline;">
                        <i class="bi bi-linkedin"></i> LinkedIn
                    </a>
                    <a href="https://www.instagram.com/kaito.dev/" class="social-link instagram" style="color: white; text-decoration: underline;">
                        <i class="bi bi-instagram"></i> Instagram
                    </a>
                </div>
            `
        }
    };

    // Handle section switching
    const sidebarItems = document.querySelectorAll('.sidebar div');
    const contentWindow = document.querySelector('.video-window');

    sidebarItems.forEach(item => {
        item.addEventListener('click', () => {
            const section = item.dataset.section;
            if (section && contentSections[section]) {
                // Update content without recreating audio element
                contentWindow.innerHTML = section === 'media' ? `
                    <!-- Track header with artist and title -->
                    <div class="track-header">
                        <div class="artist" id="currentArtist">Loading...</div>
                        <div class="track-name" id="currentTrack">Loading...</div>
                    </div>

                    <!-- Album art (visible when paused) -->
                    <div class="album-display">
                        <img src="loading.gif" alt="Album Art" class="album-art" id="currentAlbumArt">
                    </div>

                    <!-- Visualization -->
                    <div class="visualization">
                        <!-- Visualization content -->
                    </div>
                ` : `
                    <div class="content-section ${section}-section">
                        <h1>${contentSections[section].title}</h1>
                        ${contentSections[section].content}
                    </div>
                `;

                // If switching back to media player, restore state
                if (section === 'media') {
                    // Initialize visualization...
                    // ... (existing visualization code) ...

                    // Load and display metadata
                    loadSongMetadata();
                }
                
                // Update active state
                sidebarItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
            }
        });
    });

    // Add visualization controls functionality
    const prevVizBtn = document.querySelector('.prev-viz');
    const nextVizBtn = document.querySelector('.play-viz'); // Repurpose play-viz as next
    const vizName = document.querySelector('.visualization-name');

    // Function to switch visualization
    function switchVisualization(direction) {
        const vizTypes = Object.keys(visualizations);
        const currentIndex = vizTypes.indexOf(currentVisualization);
        let newIndex;
        
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % vizTypes.length;
        } else {
            newIndex = (currentIndex - 1 + vizTypes.length) % vizTypes.length;
        }
        
        currentVisualization = vizTypes[newIndex];
        vizName.textContent = visualizations[currentVisualization].name;
    }

    // Update visualization button event listeners
    prevVizBtn.addEventListener('click', () => switchVisualization('prev'));
    nextVizBtn.addEventListener('click', () => switchVisualization('next'));

    // Update playlist functionality
    let currentSongIndex = 0;

    function updateSongInfo() {
        const song = songs[currentSongIndex];
        document.querySelector('.artist').textContent = song.artist;
        document.querySelector('.track-name').textContent = song.title;
        document.querySelector('.album-art').src = song.albumArt;
        document.querySelector('.total-time').textContent = `Total Time: ${formatTime(song.duration)}`;
        duration = song.duration;
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Function to switch songs
    function switchSong(direction) {
        if (direction === 'next') {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
            switchVisualization('next');
        } else {
            currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
            switchVisualization('prev');
        }
        
        updateSongInfo();
        if (isPlaying) {
            progress = 0;
            seekBarFill.style.width = '0%';
            timeDisplay.textContent = '00:00';
        }
    }

    // Update next/previous button event listeners
    nextBtn.addEventListener('click', () => switchSong('next'));
    prevBtn.addEventListener('click', () => switchSong('prev'));

    // Update the playlist item click handler
    function updatePlaylistItem(index) {
        currentSongIndex = index;
        updateSongInfo();
        if (isPlaying) {
            progress = 0;
            seekBarFill.style.width = '0%';
            timeDisplay.textContent = '00:00';
        }
    }

    // Update playlist items creation
    const playlistContent = document.querySelector('.playlist-content');
    playlistContent.innerHTML = ''; // Clear existing items
    songs.forEach((song, index) => {
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.textContent = `+ ${song.title} - ${song.artist}`;
        item.addEventListener('click', () => updatePlaylistItem(index));
        playlistContent.appendChild(item);
    });

    // Initialize first song and visualization
    updateSongInfo();
    vizName.textContent = visualizations[currentVisualization].name;

    // Add this after the audioPlayer initialization
    function loadSongMetadata() {
        jsmediatags.read(audioPlayer.src, {
            onSuccess: function(tag) {
                // Extract metadata
                const { title, artist, album } = tag.tags;
                const picture = tag.tags.picture;

                // Update song info in all relevant places
                const artistElements = document.querySelectorAll('.artist, #currentArtist');
                const trackElements = document.querySelectorAll('.track-name, #currentTrack');
                const albumArtElements = document.querySelectorAll('.album-art, #currentAlbumArt');

                artistElements.forEach(el => el.textContent = artist || 'Unknown Artist');
                trackElements.forEach(el => el.textContent = title || 'Unknown Title');

                // Handle album art if present
                if (picture) {
                    const { data, format } = picture;
                    let base64String = "";
                    for (let i = 0; i < data.length; i++) {
                        base64String += String.fromCharCode(data[i]);
                    }
                    const imageUrl = `data:${format};base64,${window.btoa(base64String)}`;
                    albumArtElements.forEach(el => el.src = imageUrl);
                }

                // Update playlist item if it exists
                const playlistItem = document.querySelector('.playlist-item');
                if (playlistItem) {
                    playlistItem.textContent = `+ ${title} - ${artist}`;
                }

                // Update duration
                audioPlayer.addEventListener('loadedmetadata', () => {
                    const duration = audioPlayer.duration;
                    const minutes = Math.floor(duration / 60);
                    const seconds = Math.floor(duration % 60);
                    const totalTimeEl = document.querySelector('.total-time');
                    if (totalTimeEl) {
                        totalTimeEl.textContent = `Total Time: ${minutes}:${seconds.toString().padStart(2, '0')}`;
                    }
                });
            },
            onError: function(error) {
                console.log('Error reading tags:', error.type, error.info);
                // Set fallback values on error
                document.querySelector('#currentArtist').textContent = 'Unknown Artist';
                document.querySelector('#currentTrack').textContent = 'Unknown Track';
            }
        });
    }

    // Call this when the page loads
    loadSongMetadata();

    // Also call it when switching songs (if you have multiple songs)
    function switchSong(direction) {
        // ... existing song switching code ...
        loadSongMetadata();
    }
});