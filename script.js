// Supabase Configuration
        const SUPABASE_URL = 'https://qldhjqejpqbkfyjhuwrd.supabase.co';
        const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZGhqcWVqcHFia2Z5amh1d3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjYzOTQsImV4cCI6MjA4NTcwMjM5NH0.TNFRfoLKwOoG7DtDyF44y2dThK24gmxrJjQ1wWOD1sQ';
        
        let supabase;
        try {
            supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
        } catch (e) {
            console.log('Supabase not configured - using localStorage instead');
        }

        // Floating hearts
        function createFloatingHearts() {
            const hearts = ['💕', '💖', '💗', '💓', '💝', '🌸', '🌺', '✨', '⭐'];
            const container = document.getElementById('floatingHearts');
            
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

        createFloatingHearts();

        // State
        let currentUser = '';
        let currentQuestionIndex = 0;
        let noClickCount = 0;
        let answers = {};

        // Questions
        const questions = [
            {
                id: 'activities',
                question: 'Rank these activities (drag to reorder) 🎨',
                type: 'rank',
                options: ['Chill & Talk', 'Food Crawl', 'Dress Up & Take Pics', 'Self-care/Wellness', 'Spontaneous Chaos']
            },
            {
                id: 'cafe',
                question: 'What café vibes are you into? ☕',
                type: 'rank',
                options: ['Aesthetic Instagrammable', 'Matcha Heaven', 'Cozy & Warm', 'Late-night Café Hopping', 'Minimalist Chic']
            },
            {
                id: 'cuisine',
                question: 'Rank your cuisine preferences 🍝',
                type: 'rank',
                options: ['Italian', 'Japanese', 'Korean', 'Filipino Comfort Food', 'Desserts & Sweets']
            },
            {
                id: 'restaurant',
                question: 'What restaurant vibe speaks to you? 🍽️',
                type: 'rank',
                options: ['Cute & Instagrammable', 'Casual & Comfy', 'Buffet (Eat All You Can)', 'Hidden Gem', 'Fancy & Upscale']
            },
            {
                id: 'area',
                question: 'Where should we hang out? 📍',
                type: 'rank',
                options: ['BGC', 'Makati', 'UP Diliman', 'MOA', 'Ortigas']
            },
            {
                id: 'funActivities',
                question: 'Pick your favorite fun activities (choose multiple!) 🎬',
                type: 'checkbox',
                options: ['Museum or Art Gallery', 'Movie', 'DIY/Workshop', 'Spa Day', 'Just Walking & Talking']
            },
            {
                id: 'indoorOutdoor',
                question: 'Indoor or outdoor? 🌤️',
                type: 'radio',
                options: ['Indoor all the way', 'Outdoor adventures', 'Mix of both']
            },
            {
                id: 'vibes',
                question: 'What\'s your ideal date vibe? ✨',
                type: 'rank',
                options: ['Calm & Peaceful', 'Laughing Non-stop', 'Main Character Energy', 'Soft Girl Aesthetic', 'Spontaneous & Chaotic']
            },
            {
                id: 'timeOfDay',
                question: 'Best time for our date? ⏰',
                type: 'radio',
                options: ['Morning (Brunch vibes)', 'Afternoon (Lunch & chill)', 'Evening (Dinner & sunset)', 'Late-night (Adventure time)']
            },
            {
                id: 'sweetTreat',
                question: 'Sweet treat priorities! 🍰',
                type: 'rank',
                options: ['Cake', 'Ice Cream', 'Milk Tea', 'Chocolate', 'Not really into sweets']
            },
            {
                id: 'perfectThing',
                question: 'One thing that would make this date perfect? 💭',
                type: 'text',
                placeholder: 'Share your thoughts here...'
            },
            {
                id: 'galentineType',
                question: 'What kind of Gal-entine are you? 🌟',
                type: 'radio',
                options: ['The Planner', 'The Spontaneous One', 'The Foodie', 'The Photographer', 'The Vibe Curator']
            }
        ];

        // Screen Navigation
        function showScreen(screenId) {
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            document.getElementById(screenId).classList.add('active');
        }

        // Name submission
        async function submitName() {
            const name = document.getElementById('nameInput').value.trim();
            if (!name) {
                alert('Please enter your name! 💕');
                return;
            }
            
            currentUser = name;
            document.getElementById('userName').textContent = name;
            
            // Check if user has previous responses
            const existingData = await getUserData(name);
            if (existingData) {
                answers = existingData.answers;
                showResults();
            } else {
                showScreen('questionScreen');
            }
        }

        // The Big Question
        function sayYes() {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#FFB6D9', '#E0BBE4', '#FFF4A3']
            });
            
            setTimeout(() => {
                showScreen('questionnaireScreen');
                renderQuestion();
            }, 1000);
        }

        function sayNo() {
            noClickCount++;
            const yesBtn = document.getElementById('yesBtn');
            const noBtn = document.getElementById('noBtn');
            const promptText = document.getElementById('promptText');
            
            const prompts = [
                'Are you sure? 🥺',
                'Pretty please? 💕',
                'Come on, it\'ll be fun! ✨',
                'You know you want to! 💖',
                'Just say yes already! 🌸'
            ];
            
            if (noClickCount < prompts.length) {
                promptText.textContent = prompts[noClickCount - 1];
                yesBtn.classList.add('grow');
                yesBtn.classList.add('wiggle');
                setTimeout(() => {
                    yesBtn.classList.remove('grow', 'wiggle');
                }, 500);
            } else {
                noBtn.style.display = 'none';
                promptText.textContent = 'Okay, I removed the no button! 😄 Now you have to say yes! 💖';
            }
        }

        // Questionnaire
        function renderQuestion() {
            const question = questions[currentQuestionIndex];
            const container = document.getElementById('questionContainer');
            const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
            
            document.getElementById('prevBtn').style.display = currentQuestionIndex > 0 ? 'block' : 'none';
            document.getElementById('nextBtn').textContent = currentQuestionIndex === questions.length - 1 ? 'See Results! 🎉' : 'Next →';
            
            let html = `<div class="question-card"><div class="question-title">${question.question}</div>`;
            
            if (question.type === 'rank') {
                html += '<ul class="draggable-list" id="draggableList">';
                const savedOrder = answers[question.id] || question.options;
                savedOrder.forEach((option, index) => {
                    html += `
                        <li class="draggable-item" draggable="true" data-option="${option}">
                            <span class="rank-number">${index + 1}</span>
                            <span class="drag-handle">☰</span>
                            <span>${option}</span>
                        </li>
                    `;
                });
                html += '</ul>';
            } else if (question.type === 'checkbox') {
                html += '<div class="checkbox-group">';
                const savedAnswers = answers[question.id] || [];
                question.options.forEach(option => {
                    const checked = savedAnswers.includes(option) ? 'checked' : '';
                    html += `
                        <label class="checkbox-label">
                            <input type="checkbox" name="${question.id}" value="${option}" ${checked}>
                            <span>${option}</span>
                        </label>
                    `;
                });
                html += '</div>';
            } else if (question.type === 'radio') {
                html += '<div class="radio-group">';
                const savedAnswer = answers[question.id];
                question.options.forEach(option => {
                    const checked = savedAnswer === option ? 'checked' : '';
                    html += `
                        <label class="radio-label">
                            <input type="radio" name="${question.id}" value="${option}" ${checked}>
                            <span>${option}</span>
                        </label>
                    `;
                });
                html += '</div>';
            } else if (question.type === 'text') {
                const savedAnswer = answers[question.id] || '';
                html += `<textarea id="textAnswer" placeholder="${question.placeholder}">${savedAnswer}</textarea>`;
            }
            
            html += '</div>';
            container.innerHTML = html;
            
            if (question.type === 'rank') {
                initDragAndDrop();
            }
        }

        function initDragAndDrop() {
            const list = document.getElementById('draggableList');
            let draggedElement = null;
            
            list.querySelectorAll('.draggable-item').forEach(item => {
                item.addEventListener('dragstart', function() {
                    draggedElement = this;
                    this.classList.add('dragging');
                });
                
                item.addEventListener('dragend', function() {
                    this.classList.remove('dragging');
                    updateRankNumbers();
                });
                
                item.addEventListener('dragover', function(e) {
                    e.preventDefault();
                    const afterElement = getDragAfterElement(list, e.clientY);
                    if (afterElement == null) {
                        list.appendChild(draggedElement);
                    } else {
                        list.insertBefore(draggedElement, afterElement);
                    }
                });
            });
        }

        function getDragAfterElement(container, y) {
            const draggableElements = [...container.querySelectorAll('.draggable-item:not(.dragging)')];
            
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

        function updateRankNumbers() {
            const items = document.querySelectorAll('.draggable-item');
            items.forEach((item, index) => {
                item.querySelector('.rank-number').textContent = index + 1;
            });
        }

        function saveCurrentAnswer() {
            const question = questions[currentQuestionIndex];
            
            if (question.type === 'rank') {
                const items = document.querySelectorAll('.draggable-item');
                answers[question.id] = Array.from(items).map(item => item.dataset.option);
            } else if (question.type === 'checkbox') {
                const checked = document.querySelectorAll(`input[name="${question.id}"]:checked`);
                answers[question.id] = Array.from(checked).map(cb => cb.value);
            } else if (question.type === 'radio') {
                const selected = document.querySelector(`input[name="${question.id}"]:checked`);
                answers[question.id] = selected ? selected.value : '';
            } else if (question.type === 'text') {
                answers[question.id] = document.getElementById('textAnswer').value;
            }
        }

        function nextQuestion() {
            saveCurrentAnswer();
            
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                renderQuestion();
            } else {
                saveUserData();
                showResults();
            }
        }

        function prevQuestion() {
            saveCurrentAnswer();
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                renderQuestion();
            }
        }

        // Results
        function showResults() {
            showScreen('resultsScreen');
            document.getElementById('userNameResults').textContent = currentUser;
            
            // Generate combo
            const topActivity = answers.activities?.[0] || 'Hanging out';
            const topArea = answers.area?.[0] || 'somewhere fun';
            const topTreat = answers.sweetTreat?.[0] || 'treats';
            
            const comboEmojis = {
                'Chill & Talk': '💬',
                'Food Crawl': '🍽️',
                'Dress Up & Take Pics': '📸',
                'Self-care/Wellness': '🧖',
                'Spontaneous Chaos': '🎉'
            };
            
            document.getElementById('comboEmojis').textContent = 
                (comboEmojis[topActivity] || '✨') + ' + 📍 + ' + 
                (topTreat === 'Not really into sweets' ? '🥤' : '🍰');
            
            document.getElementById('comboDescription').innerHTML = `
                <p style="font-size: 1.2em; color: var(--text-dark);">
                    <strong>${topActivity}</strong> in <strong>${topArea}</strong><br>
                    ${topTreat !== 'Not really into sweets' ? 'with ' + topTreat + ' after!' : 'with drinks!'}
                </p>
            `;
            
            // Show all results
            let resultsHTML = '';
            
            questions.forEach(q => {
                if (answers[q.id]) {
                    let answerText = '';
                    if (Array.isArray(answers[q.id])) {
                        if (q.type === 'rank') {
                            answerText = answers[q.id].slice(0, 3).join(', ');
                        } else {
                            answerText = answers[q.id].join(', ');
                        }
                    } else {
                        answerText = answers[q.id];
                    }
                    
                    if (answerText) {
                        resultsHTML += `
                            <div class="results-card">
                                <div class="results-title">${q.question.replace(/[🎨☕🍝🍽️📍🎬🌤️✨⏰🍰💭🌟]/g, '').trim()}</div>
                                <p>${answerText}</p>
                            </div>
                        `;
                    }
                }
            });
            
            document.getElementById('resultsContainer').innerHTML = resultsHTML;
            
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { y: 0.6 },
                colors: ['#FFB6D9', '#E0BBE4', '#FFF4A3', '#FFD4D4']
            });
        }

        function resetQuiz() {
            currentQuestionIndex = 0;
            noClickCount = 0;
            answers = {};
            document.getElementById('nameInput').value = '';
            document.getElementById('promptText').textContent = '';
            document.getElementById('noBtn').style.display = 'inline-block';
            showScreen('welcomeScreen');
        }

        // Supabase functions
        async function saveUserData() {
            const data = {
                name: currentUser.toLowerCase(),
                answers: answers,
                updated_at: new Date().toISOString()
            };
            
            // Try Supabase first, fallback to localStorage
            if (supabase) {
                try {
                    const { error } = await supabase
                        .from('galentines')
                        .upsert(data, { onConflict: 'name' });
                    
                    if (error) throw error;
                } catch (e) {
                    console.error('Supabase error:', e);
                    localStorage.setItem('galentines_' + currentUser.toLowerCase(), JSON.stringify(data));
                }
            } else {
                localStorage.setItem('galentines_' + currentUser.toLowerCase(), JSON.stringify(data));
            }
        }

        async function getUserData(name) {
            const normalizedName = name.toLowerCase();
            
            // Try Supabase first, fallback to localStorage
            if (supabase) {
                try {
                    const { data, error } = await supabase
                        .from('galentines')
                        .select('*')
                        .eq('name', normalizedName)
                        .single();
                    
                    if (error) throw error;
                    return data;
                } catch (e) {
                    console.log('Checking localStorage instead');
                }
            }
            
            const stored = localStorage.getItem('galentines_' + normalizedName);
            return stored ? JSON.parse(stored) : null;
        }