        // Questions data
        const questions = [
            {
                id: 'galentines-vibe',
                title: '🌸 What kind of Gal-entines day are you feeling?',
                type: 'sortable',
                options: [
                    'Chill + cozy ☁️',
                    'Food crawl 🍽️',
                    'Dress up & take pics 📸',
                    'Self-care / wellness 🧖‍♀️',
                    'Spontaneous chaos (go with the flow) ✨'
                ]
            },
            {
                id: 'cafe-vibes',
                title: '☕ Café / Coffee Date Vibes',
                type: 'sortable',
                options: [
                    'Aesthetic cafés (plants, pastel, good lighting) 🌿',
                    'Matcha & specialty drinks 🍵',
                    'Coffee + desserts only 🍰',
                    'Cozy tita cafés 🫶',
                    'Late-night café hopping 🌙'
                ]
            },
            {
                id: 'cuisine',
                title: '🍝 Cuisine You\'re Most Excited For',
                type: 'sortable',
                options: [
                    'Italian 🍝',
                    'Japanese 🍣',
                    'Korean 🥩',
                    'Filipino comfort food 🍛',
                    'Desserts & sweets only 🍩'
                ]
            },
            {
                id: 'restaurant-vibe',
                title: '🍽️ Restaurant Vibe Check (Pick up to 2)',
                type: 'checkbox',
                max: 2,
                options: [
                    'Cute & Instagrammable 💕',
                    'Casual & comfy 👟',
                    'Unlimited / buffet energy 🤭',
                    'Small hidden gem ✨',
                    'Somewhere fancy (dress up!) 💄'
                ]
            },
            {
                id: 'location',
                title: '🛍️ Mall or Area You\'d Love to Go To',
                type: 'sortable',
                options: [
                    'BGC (walk + pics + food) 🌆',
                    'Makati (cafés + museums) 🖼️',
                    'Tondo (walks + food stalls) 🏮',
                    'MOA (sea breeze + chaos) 🌊',
                    'Ortigas (chill hangout) 🏙️'
                ]
            },
            {
                id: 'activity',
                title: '🎨 Activity You\'d Enjoy Most',
                type: 'sortable',
                options: [
                    'Museum / art gallery 🖼️',
                    'Movie date 🎬',
                    'Pottery / painting / DIY workshop 🎨',
                    'Spa / nails / massage 💅',
                    'Just walking + talking 🫂'
                ]
            },
            {
                id: 'outdoor-indoor',
                title: '🌿 Outdoor vs Indoor?',
                type: 'radio',
                options: [
                    'Outdoor girlie 🌞',
                    'Indoor cozy queen 🛋️',
                    'A mix of both ✨'
                ]
            },
            {
                id: 'background-vibes',
                title: '🎶 Background Vibes for the Day',
                type: 'radio',
                options: [
                    'Calm & peaceful 🎧',
                    'Laughing non-stop 😂',
                    'Main-character energy 💃',
                    'Soft girl aesthetic 🌸'
                ]
            },
            {
                id: 'ideal-time',
                title: '⏰ Ideal Time for Our Gal-entines Date',
                type: 'radio',
                options: [
                    'Morning brunch ☀️',
                    'Afternoon hangout 🌤️',
                    'Evening dinner 🌙',
                    'Late-night chill 🌌'
                ]
            },
            {
                id: 'sweet-treat',
                title: '🍰 Sweet Treat Priority',
                type: 'sortable',
                options: [
                    'Cake & pastries 🍰',
                    'Ice cream / gelato 🍨',
                    'Milk tea / matcha 🍵',
                    'Chocolate everything 🍫',
                    '"I\'m not that into sweets" 😌'
                ]
            },
            {
                id: 'bestie-type',
                title: '💕 What kind of Gal-entine are you?',
                type: 'radio',
                options: [
                    'Planner bestie 📋',
                    'Go-with-the-flow bestie 🌊',
                    'Food-first bestie 🍽️',
                    'Photo-op bestie 📸',
                    'Emotional support bestie 🫂'
                ]
            }
        ];

        // State
        let noClickCount = 0;
        const playfulMessages = [
            "Are you suuuuure? 🥺",
            "But we'd be so cute 😭",
            "Don't break my heart bestie 💔",
            "Pretty please? 🙏",
            "I made this whole website for you 😢",
            "One more chance? 💕",
            "The Yes button is right there... 👀"
        ];

        let draggedElement = null;

        // Initialize
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.getElementById('loadingScreen').classList.add('hidden');
            }, 1500);

            createFloatingHearts();
            checkReturnVisitor();
        });

        function createFloatingHearts() {
            const container = document.getElementById('floatingHearts');
            const hearts = ['💕', '💖', '💗', '💝', '💓', '💞'];
            
            for (let i = 0; i < 15; i++) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDelay = Math.random() * 15 + 's';
                heart.style.fontSize = (Math.random() * 20 + 15) + 'px';
                container.appendChild(heart);
            }
        }

        async function checkReturnVisitor() {
            const name = localStorage.getItem('galentine_name');
            if (!name) return;

            const { data } = await supabase
                .from('galentines_responses')
                .select('*')
                .eq('name', name)
                .single();

            if (data) {
                document.getElementById('userName').textContent = name;
                document.getElementById('resultsTitle').innerHTML = `Welcome back, ${name}! 💖`;
                await showResults();
                goToPage('page4');
            }

        }


        async function submitName() {
            const name = document.getElementById('nameInput').value.trim();
            if (!name) return;

            const { data } = await supabase
                .from('galentines_responses')
                .select('name')
                .eq('name', name)
                .single();

            localStorage.setItem('galentine_name', name);
            document.getElementById('userName').textContent = name;

            if (data) {
                await showResults();
                goToPage('page4');
            } else {
                goToPage('page2');
            }
        }


        function handleNo() {
            noClickCount++;
            const yesBtn = document.getElementById('yesBtn');
            const messageDiv = document.getElementById('playfulMessage');
            
            // Show playful message
            const messageIndex = Math.min(noClickCount - 1, playfulMessages.length - 1);
            messageDiv.textContent = playfulMessages[messageIndex];
            
            // Grow yes button
            const currentScale = 1 + (noClickCount * 0.15);
            yesBtn.style.transform = `scale(${currentScale})`;
            yesBtn.classList.add('growing');
            
            setTimeout(() => {
                yesBtn.classList.remove('growing');
            }, 500);
            
            // After 5 clicks, add glow
            if (noClickCount >= 5) {
                yesBtn.classList.add('glow');
            }
        }

        function handleYes() {
            showConfetti();
            setTimeout(() => {
                renderQuestionnaire();
                goToPage('page3');
            }, 1000);
        }

        function showConfetti() {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            document.body.appendChild(confetti);

            const colors = ['#FF4D94', '#FF85C1', '#FFB3D9', '#E6B3FF'];
            
            for (let i = 0; i < 100; i++) {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                piece.style.left = Math.random() * 100 + '%';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.animationDelay = Math.random() * 0.5 + 's';
                confetti.appendChild(piece);
            }

            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }

        function renderQuestionnaire() {
            const container = document.getElementById('questionnaire');
            container.innerHTML = '';

            questions.forEach((question, index) => {
                const questionDiv = document.createElement('div');
                questionDiv.className = 'question';
                questionDiv.innerHTML = `<div class="question-title">${question.title}</div>`;

                if (question.type === 'sortable') {
                    const list = document.createElement('ul');
                    list.className = 'sortable-list';
                    list.id = `list-${question.id}`;

                    question.options.forEach((option, optIndex) => {
                        const li = document.createElement('li');
                        li.className = 'sortable-item';
                        li.draggable = true;
                        li.dataset.questionId = question.id;
                        li.dataset.option = option;
                        li.innerHTML = `<span class="drag-handle">☰</span><span>${option}</span>`;
                        
                        li.addEventListener('dragstart', handleDragStart);
                        li.addEventListener('dragover', handleDragOver);
                        li.addEventListener('drop', handleDrop);
                        li.addEventListener('dragend', handleDragEnd);
                        
                        list.appendChild(li);
                    });

                    questionDiv.appendChild(list);
                } else if (question.type === 'checkbox') {
                    const group = document.createElement('div');
                    group.className = 'checkbox-group';
                    group.id = `group-${question.id}`;

                    question.options.forEach((option, optIndex) => {
                        const label = document.createElement('label');
                        label.className = 'checkbox-item';
                        label.innerHTML = `
                            <input type="checkbox" name="${question.id}" value="${option}" 
                                   onchange="handleCheckboxChange(event, '${question.id}', ${question.max})">
                            <span>${option}</span>
                        `;
                        group.appendChild(label);
                    });

                    questionDiv.appendChild(group);
                } else if (question.type === 'radio') {
                    const group = document.createElement('div');
                    group.className = 'radio-group';

                    question.options.forEach((option, optIndex) => {
                        const label = document.createElement('label');
                        label.className = 'radio-item';
                        label.innerHTML = `
                            <input type="radio" name="${question.id}" value="${option}">
                            <span>${option}</span>
                        `;
                        group.appendChild(label);
                    });

                    questionDiv.appendChild(group);
                }

                container.appendChild(questionDiv);
            });
        }

        // Drag and drop handlers
        function handleDragStart(e) {
            draggedElement = this;
            this.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
        }

        function handleDragOver(e) {
            if (e.preventDefault) {
                e.preventDefault();
            }
            e.dataTransfer.dropEffect = 'move';
            
            const afterElement = getDragAfterElement(this.parentElement, e.clientY);
            if (afterElement == null) {
                this.parentElement.appendChild(draggedElement);
            } else {
                this.parentElement.insertBefore(draggedElement, afterElement);
            }
            
            return false;
        }

        function handleDrop(e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            return false;
        }

        function handleDragEnd(e) {
            this.classList.remove('dragging');
        }

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.sortable-item:not(.dragging)')];

            return draggableElements.reduce((closest, child) => {
                const box = child.getBoundingClientRect();
                const offset = y - box.top - box.height / 2;

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            }, { offset: Number.NEGATIVE_INFINITY }).element;
        }

        function handleCheckboxChange(event, questionId, max) {
            const checkboxes = document.querySelectorAll(`input[name="${questionId}"]`);
            const checked = Array.from(checkboxes).filter(cb => cb.checked);

            if (checked.length > max) {
            event.target.checked = false;
            }

        }

        async function submitQuestionnaire() {
            const answers = {};
            const name = localStorage.getItem('galentine_name');

            questions.forEach(question => {
                if (question.type === 'sortable') {
                    const items = document.querySelectorAll(`#list-${question.id} .sortable-item`);
                    answers[question.id] = Array.from(items).map(item => item.dataset.option);
                } else if (question.type === 'checkbox') {
                    const checked = document.querySelectorAll(`input[name="${question.id}"]:checked`);
                    answers[question.id] = Array.from(checked).map(cb => cb.value);
                } else if (question.type === 'radio') {
                    const selected = document.querySelector(`input[name="${question.id}"]:checked`);
                    answers[question.id] = selected ? selected.value : null;
                }
            });

            // Save to Supbase
            const { error } = await supabase
                .from('galentines_responses')
                .upsert({
                    name: name,
                    answers: answers
                });

                if (error) {
                alert('Oops! Something went wrong 😭');
                console.error(error);
                return;
            }


            showConfetti();
            setTimeout(() => {
                showResults();
                goToPage('page4');
            }, 1000);
        }

        async function showResults() {
            const { data: rows } = await supabase
                .from('galentines_responses')
                .select('*');

                const allAnswers = {};
                rows.forEach(row => {
                allAnswers[row.name] = row.answers;
            });

            const resultsContainer = document.getElementById('resultsContent');
            
            if (Object.keys(allAnswers).length === 0) {
                resultsContainer.innerHTML = '<p>No responses yet! Be the first 💕</p>';
                return;
            }

            // Aggregate data
            const aggregated = aggregateAnswers(allAnswers);
            
            // Generate top 3 combos
            const combos = generateTopCombos(aggregated);
            
            let html = '<div class="results-grid">';
            
            // Show top combos
            html += '<h3 style="color: var(--pink-500); margin-bottom: 15px;">🌸 Top Gal-entines Date Combos</h3>';
            combos.forEach((combo, index) => {
                html += `
                    <div class="combo-card">
                        <div class="combo-title">${index + 1}. ${combo.title}</div>
                        <div class="combo-details">${combo.description}</div>
                    </div>
                `;
            });

            // Show participation
            html += `
                <div class="result-card">
                    <div class="result-title">💕 Besties who responded: ${Object.keys(allAnswers).length}</div>
                    <p style="color: var(--pink-400);">${Object.keys(allAnswers).join(', ')}</p>
                </div>
            `;

            html += '</div>';
            resultsContainer.innerHTML = html;
        }

        function aggregateAnswers(allAnswers) {
            const aggregated = {};

            Object.values(allAnswers).forEach(answers => {
                Object.keys(answers).forEach(questionId => {
                    if (!aggregated[questionId]) {
                        aggregated[questionId] = {};
                    }

                    const answer = answers[questionId];
                    
                    if (Array.isArray(answer)) {
                        // For sortable or checkbox
                        answer.forEach((item, index) => {
                            if (!aggregated[questionId][item]) {
                                aggregated[questionId][item] = { count: 0, totalRank: 0 };
                            }
                            aggregated[questionId][item].count++;
                            // For sortable, lower index = higher rank
                            aggregated[questionId][item].totalRank += (answer.length - index);
                        });
                    } else if (answer) {
                        // For radio
                        if (!aggregated[questionId][answer]) {
                            aggregated[questionId][answer] = { count: 0 };
                        }
                        aggregated[questionId][answer].count++;
                    }
                });
            });

            return aggregated;
        }

        function generateTopCombos(aggregated) {
            const combos = [];

            // Get top choices
            const topVibe = getTopChoice(aggregated['galentines-vibe']);
            const topCafe = getTopChoice(aggregated['cafe-vibes']);
            const topCuisine = getTopChoice(aggregated['cuisine']);
            const topLocation = getTopChoice(aggregated['location']);
            const topActivity = getTopChoice(aggregated['activity']);
            const topTime = getTopChoice(aggregated['ideal-time']);

            // Combo 1: Based on top vibe
            if (topVibe && topVibe.includes('Chill + cozy')) {
                combos.push({
                    title: 'Cozy Bestie Day ☁️',
                    description: `Start: ${topCafe || 'Cozy café'}<br>Activity: Chill walk + chika<br>End: ${topCuisine || 'Comfort food'} dinner<br>✨ Perfect for: Relaxed vibes + quality time`
                });
            } else if (topVibe && topVibe.includes('Food crawl')) {
                combos.push({
                    title: 'Food-First Gal Day 🍽️',
                    description: `Start: ${topCuisine || 'Restaurant'} for early dinner<br>Activity: Walk + digest + chika<br>End: Dessert café nearby<br>✨ Perfect for: Food lovers + casual hangout`
                });
            } else if (topVibe && topVibe.includes('Dress up')) {
                combos.push({
                    title: 'Main Character Energy Day 📸',
                    description: `Start: Brunch at aesthetic café<br>Activity: Photo walk in ${topLocation || 'BGC'}<br>End: Dessert + posting pics together<br>✨ Perfect for: Instagrammable moments`
                });
            }

            // Combo 2: Based on location
            if (topLocation && topLocation.includes('BGC')) {
                combos.push({
                    title: 'BGC Girlie Day 🌆',
                    description: `Start: ${topCafe || 'Aesthetic café'} in BGC<br>Activity: Walk + window shopping + pics<br>End: ${topCuisine || 'Dinner'} + dessert<br>✨ Perfect for: City vibes + good food`
                });
            } else if (topLocation && topLocation.includes('Makati')) {
                combos.push({
                    title: 'Artsy Makati Date 🖼️',
                    description: `Start: Museum or art gallery<br>Activity: Café nearby for life talks<br>End: ${topCuisine || 'Nice dinner'}<br>✨ Perfect for: Culture + chill energy`
                });
            }

            // Combo 3: Based on activity
            if (topActivity && topActivity.includes('Museum')) {
                combos.push({
                    title: 'Cultured Besties Day 🎨',
                    description: `Start: ${topActivity}<br>Activity: Post-museum café debrief<br>End: Light dinner nearby<br>✨ Perfect for: Art appreciators + deep talks`
                });
            } else if (topActivity && topActivity.includes('Spa')) {
                combos.push({
                    title: 'Self-Care Gal-entines 💅',
                    description: `Start: Spa / nails / massage<br>Activity: Light healthy meal<br>End: Tea or coffee to relax<br>✨ Perfect for: Wellness + tita vibes`
                });
            } else if (topActivity && topActivity.includes('Movie')) {
                combos.push({
                    title: 'Movie Night Besties 🎬',
                    description: `Start: ${topTime || 'Afternoon'} movie<br>Activity: ${topCuisine || 'Dinner'} after<br>End: Coffee to rate the movie ⭐<br>✨ Perfect for: Chill + evening hangs`
                });
            }

            // Fill to 3 if needed
            while (combos.length < 3) {
                combos.push({
                    title: 'Spontaneous Gal Day ✨',
                    description: `Start: ${topCafe || 'Cute café'}<br>Activity: Go with the flow!<br>End: ${topCuisine || 'Whatever we\'re craving'}<br>✨ Perfect for: Adventurous besties`
                });
            }

            return combos.slice(0, 3);
        }

        function getTopChoice(questionData) {
            if (!questionData) return null;

            const sorted = Object.entries(questionData).sort((a, b) => {
                const scoreA = a[1].totalRank || a[1].count;
                const scoreB = b[1].totalRank || b[1].count;
                return scoreB - scoreA;
            });

            return sorted[0] ? sorted[0][0] : null;
        }

        function goToPage(pageId) {
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(pageId).classList.add('active');
            window.scrollTo(0, 0);
        }

        async function resetAll() {
            if (!confirm('Are you sure you want to reset all data? 🥺')) return;

            await supabase.from('galentines_responses').delete().neq('name', '');
            localStorage.clear();
            location.reload();
        }


        // Handle enter key on name input
        document.addEventListener('DOMContentLoaded', () => {
            // Enter key submit for name
            const nameInput = document.getElementById('nameInput');
            if (nameInput) {
                nameInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        submitName();
                    }
                });
            }

            // Hide reset button unless owner
            const ownerName = "rein";
            const resetBtn = document.getElementById('resetBtn');

            if (resetBtn && localStorage.getItem('galentine_name') !== ownerName) {
                resetBtn.style.display = 'none';
            }
        });