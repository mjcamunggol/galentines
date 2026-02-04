const { useState, useEffect, useRef } = React;

    // Initialize Supabase
    const supabase = window.supabase.createClient(
      'https://qldhjqejpqbkfyjhuwrd.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFsZGhqcWVqcHFia2Z5amh1d3JkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMjYzOTQsImV4cCI6MjA4NTcwMjM5NH0.TNFRfoLKwOoG7DtDyF44y2dThK24gmxrJjQ1wWOD1sQ'
    );

    // Sparkle effect
    const createSparkle = (x, y) => {
      const sparkles = ['✨', '💖', '💕', '⭐', '🌟'];
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle';
      sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
      sparkle.style.left = x + 'px';
      sparkle.style.top = y + 'px';
      document.body.appendChild(sparkle);
      setTimeout(() => sparkle.remove(), 2000);
    };

    // Floating hearts background
    const createFloatingHearts = () => {
      const heartsContainer = document.getElementById('hearts-bg');
      if (!heartsContainer) return;
      
      const hearts = ['💕', '💖', '💗', '💝', '💘'];
      
      setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => heart.remove(), 7000);
      }, 2000);
    };

    // Main App Component
    function GalentinesApp() {
      const [stage, setStage] = useState('name'); // name, invite, questions, results
      const [name, setName] = useState('');
      const [rejectCount, setRejectCount] = useState(0);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState('');
      const [existingUser, setExistingUser] = useState(null);
      const [allResults, setAllResults] = useState(null);
      
        // Rankings
        const [activityRanking, setActivityRanking] = useState([
        { id: 1, text: 'Baking Workshop at Bakebe', emoji: '🍰' },
        { id: 2, text: 'Movie night', emoji: '🎬' },
        { id: 3, text: 'Picnic at Ayala Triangles', emoji: '🌸' },
        { id: 4, text: 'Pottery or Painting Workshop', emoji: '🎨' },
        { id: 5, text: 'Spa / self-care', emoji: '💆‍♀️' },
        { id: 6, text: 'Pajama party at a staycation', emoji: '🌙' },
        { id: 7, text: 'Amusement Park', emoji: '🍭' },
        { id: 8, text: 'Escape Room', emoji: '👻' }
        ]);

        const [foodRanking, setFoodRanking] = useState([
        { id: 1, text: 'Korean 🍜', emoji: '🍜' },
        { id: 2, text: 'Japanese 🍣', emoji: '🍣' },
        { id: 3, text: 'Italian 🍝', emoji: '🍝' },
        { id: 4, text: 'Filipino 🍚', emoji: '🍚' },
        { id: 5, text: 'Desserts & coffee 🍰☕', emoji: '🍰' },
        { id: 6, text: 'Burgers 🍔', emoji: '🍔' }
        ]);


      const [vibe, setVibe] = useState('');
      const [availableDates, setAvailableDates] = useState([]);

      useEffect(() => {
        createFloatingHearts();
      }, []);

      const checkExistingUser = async (userName) => {
        try {
          setLoading(true);
          setError('');
          
          const { data, error: fetchError } = await supabase
            .from('galentines')
            .select('*')
            .ilike('name', userName.trim())
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError;
          }

          if (data) {
            setExistingUser(data);
            await fetchResults();
            setStage('results');
          } else {
            setStage('invite');
          }
        } catch (err) {
          console.error('Error checking user:', err);
          setError('Oops! Something went wrong. Try again bestie 💕');
        } finally {
          setLoading(false);
        }
      };

      const handleNameSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
          checkExistingUser(name);
        }
      };

      const handleYes = () => {
        setStage('questions');
      };

      const handleNo = () => {
        setRejectCount(prev => prev + 1);
      };

      const rejectMessages = [
        "Are you suuuure? 🥺",
        "Think about the food tho 🍕👀",
        "Don't break my heart bestie 💔",
        "Please? Pretty please? 🌸",
        "Last chance 😭",
        "I know you want to say yes 💖",
        "C'mon bestieee 🥹"
      ];

      const handleDragStart = (e, index, type) => {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('dragIndex', index);
        e.dataTransfer.setData('dragType', type);
      };

      const handleDragOver = (e) => {
        e.preventDefault();
      };

      const handleDrop = (e, dropIndex, type) => {
        e.preventDefault();
        const dragIndex = parseInt(e.dataTransfer.getData('dragIndex'));
        const dragType = e.dataTransfer.getData('dragType');
        
        if (dragType !== type) return;

        if (type === 'activity') {
          const newRanking = [...activityRanking];
          const [draggedItem] = newRanking.splice(dragIndex, 1);
          newRanking.splice(dropIndex, 0, draggedItem);
          setActivityRanking(newRanking);
        } else {
          const newRanking = [...foodRanking];
          const [draggedItem] = newRanking.splice(dragIndex, 1);
          newRanking.splice(dropIndex, 0, draggedItem);
          setFoodRanking(newRanking);
        }
      };

      const handleDateToggle = (date) => {
        setAvailableDates(prev => {
          if (prev.includes(date)) {
            return prev.filter(d => d !== date);
          } else {
            return [...prev, date].sort((a, b) => a - b);
          }
        });
      };

      const fetchResults = async () => {
        try {
          const { data, error: fetchError } = await supabase
            .from('galentines')
            .select('*');

          if (fetchError) throw fetchError;

          // Calculate aggregated results
          const activityScores = {};
          const foodScores = {};
          const dateScores = {};

          data.forEach(user => {
            if (user.activity_rankings) {
              user.activity_rankings.forEach((activity, index) => {
                const score = user.activity_rankings.length - index;
                activityScores[activity] = (activityScores[activity] || 0) + score;
              });
            }
            if (user.food_rankings) {
              user.food_rankings.forEach((food, index) => {
                const score = user.food_rankings.length - index;
                foodScores[food] = (foodScores[food] || 0) + score;
              });
            }
            if (user.available_dates) {
              user.available_dates.forEach(date => {
                dateScores[date] = (dateScores[date] || 0) + 1;
              });
            }
          });

          const sortedActivities = Object.entries(activityScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);
          
          const sortedFoods = Object.entries(foodScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

          const sortedDates = Object.entries(dateScores)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

          setAllResults({
            activities: sortedActivities,
            foods: sortedFoods,
            dates: sortedDates,
            totalResponses: data.length
          });
        } catch (err) {
          console.error('Error fetching results:', err);
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
          setLoading(true);
          setError('');

          const userData = {
            name: name.trim(),
            accepted: true,
            activity_rankings: activityRanking.map(a => a.text),
            food_rankings: foodRanking.map(f => f.text),
            vibe: vibe,
            available_dates: availableDates
          };

          const { error: insertError } = await supabase
            .from('galentines')
            .insert([userData]);

          if (insertError) throw insertError;

          await fetchResults();
          setStage('results');
        } catch (err) {
          console.error('Error submitting:', err);
          setError('Oops! Something went wrong. Try again bestie 💕');
        } finally {
          setLoading(false);
        }
      };

      const yesButtonScale = 1 + (rejectCount * 0.15);
      const noButtonScale = Math.max(0.5, 1 - (rejectCount * 0.1));

      return (
        <div className="container" onClick={(e) => createSparkle(e.clientX, e.clientY)}>
          <div className="card">
            {loading && <div className="loading">Loading... ✨</div>}
            {error && <div className="error">{error}</div>}

            {!loading && stage === 'name' && (
              <>
                <h1>Hi bestie 💐</h1>
                <p className="subtitle">What's your name?</p>
                <form onSubmit={handleNameSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name here..."
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    <span>Continue 💌</span>
                  </button>
                </form>
              </>
            )}

            {!loading && stage === 'invite' && (
              <>
                <h1>Will you be my</h1>
                <h1 style={{marginTop: '-20px'}}>Gal-entine?</h1>
                <p className="subtitle">💐</p>
                
                {rejectCount > 0 && (
                  <div className="reject-message">
                    {rejectMessages[Math.min(rejectCount - 1, rejectMessages.length - 1)]}
                  </div>
                )}

                <button
                  className="btn btn-yes"
                  onClick={handleYes}
                  style={{ transform: `scale(${yesButtonScale})` }}
                >
                  <span>YES 💖</span>
                </button>
                <button
                  className="btn btn-no"
                  onClick={handleNo}
                  style={{ transform: `scale(${noButtonScale})` }}
                >
                  <span>NO 🙄</span>
                </button>
              </>
            )}

            {!loading && stage === 'questions' && (
              <>
                <h1>Yay! 💖</h1>
                <p className="subtitle">Help me plan our perfect day!</p>

                <form onSubmit={handleSubmit}>
                  <div className="question-section">
                    <div className="question-title">What do you wanna do the most? 💃✨</div>
                    <p style={{textAlign: 'center', fontSize: '0.9em', marginBottom: '15px', color: 'var(--text)', opacity: 0.8}}>
                      Drag to rank!
                    </p>
                    <ul className="draggable-list">
                      {activityRanking.map((activity, index) => (
                        <li
                          key={activity.id}
                          className="draggable-item"
                          draggable
                          onDragStart={(e) => handleDragStart(e, index, 'activity')}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index, 'activity')}
                        >
                          <span className="drag-handle">☰</span>
                          <span className="rank-number">{index + 1}</span>
                          <span>{activity.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="question-section">
                    <div className="question-title">What should we eat bestie? 🍽️💖</div>
                    <p style={{textAlign: 'center', fontSize: '0.9em', marginBottom: '15px', color: 'var(--text)', opacity: 0.8}}>
                      Drag to rank!
                    </p>
                    <ul className="draggable-list">
                      {foodRanking.map((food, index) => (
                        <li
                          key={food.id}
                          className="draggable-item"
                          draggable
                          onDragStart={(e) => handleDragStart(e, index, 'food')}
                          onDragOver={handleDragOver}
                          onDrop={(e) => handleDrop(e, index, 'food')}
                        >
                          <span className="drag-handle">☰</span>
                          <span className="rank-number">{index + 1}</span>
                          <span>{food.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="question-section">
                    <div className="question-title">What's your Gal-entine energy? ✨</div>
                    <div className="option-grid">
                      <button
                        type="button"
                        className={`option-btn ${vibe === 'Soft girl 🌸' ? 'selected' : ''}`}
                        onClick={() => setVibe('Soft girl 🌸')}
                      >
                        Soft girl 🌸
                      </button>
                      <button
                        type="button"
                        className={`option-btn ${vibe === 'Loud & chaotic 🤪' ? 'selected' : ''}`}
                        onClick={() => setVibe('Loud & chaotic 🤪')}
                      >
                        Loud & chaotic 🤪
                      </button>
                      <button
                        type="button"
                        className={`option-btn ${vibe === 'Chill & cozy 🧸' ? 'selected' : ''}`}
                        onClick={() => setVibe('Chill & cozy 🧸')}
                      >
                        Chill & cozy 🧸
                      </button>
                      <button
                        type="button"
                        className={`option-btn ${vibe === 'Main character 💃' ? 'selected' : ''}`}
                        onClick={() => setVibe('Main character 💃')}
                      >
                        Main character 💃
                      </button>
                    </div>
                  </div>

                  <div className="question-section">
                    <div className="question-title">What dates are you available? 📅💖</div>
                    <p style={{textAlign: 'center', fontSize: '0.9em', marginBottom: '15px', color: 'var(--text)', opacity: 0.8}}>
                      Select all dates that work for you! Remember: month of February!
                    </p>
                    <div className="date-grid">
                      {Array.from({ length: 28 }, (_, i) => i + 1).map(date => (
                        <button
                          key={date}
                          type="button"
                          className={`date-btn ${availableDates.includes(date) ? 'selected' : ''}`}
                          onClick={() => handleDateToggle(date)}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                    <p className="date-helper-text">
                      {availableDates.length > 0 
                        ? `${availableDates.length} date${availableDates.length !== 1 ? 's' : ''} selected 💕`
                        : 'Tap dates to select them! ✨'
                      }
                    </p>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={!vibe || availableDates.length === 0}>
                    <span>Submit 💕</span>
                  </button>
                </form>
              </>
            )}

            {!loading && stage === 'results' && allResults && (
              <>
                <h1>{existingUser ? `Welcome back ${existingUser.name}! 💕` : 'Thank you! 💖'}</h1>
                <p className="subtitle">
                  {existingUser 
                    ? "You already said yes 😌" 
                    : "Your vote has been counted!"
                  }
                </p>

                <div className="results-grid">
                  <div className="result-section">
                    <h3>Top Activities 💃</h3>
                    <p style={{fontSize: '0.9em', marginBottom: '20px', opacity: 0.8}}>
                      Looks like this is what we're doing! 👀
                    </p>
                    {allResults.activities.map(([activity, score], index) => {
                      const maxScore = allResults.activities[0][1];
                      const percentage = (score / maxScore) * 100;
                      
                      return (
                        <div key={activity} className="result-item">
                          <div className="result-icon">{index + 1 === 1 ? '👑' : '💖'}</div>
                          <div className="result-info">
                            <div className="result-name">{activity}</div>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{width: `${percentage}%`}}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="result-section">
                    <h3>Top Food Choices 🍽️</h3>
                    <p style={{fontSize: '0.9em', marginBottom: '20px', opacity: 0.8}}>
                      And this is what we're eating! 👀💖
                    </p>
                    {allResults.foods.map(([food, score], index) => {
                      const maxScore = allResults.foods[0][1];
                      const percentage = (score / maxScore) * 100;
                      
                      return (
                        <div key={food} className="result-item">
                          <div className="result-icon">{index + 1 === 1 ? '👑' : '💖'}</div>
                          <div className="result-info">
                            <div className="result-name">{food}</div>
                            <div className="progress-bar">
                              <div 
                                className="progress-fill" 
                                style={{width: `${percentage}%`}}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="result-section">
                    <h3>Most Popular Dates 📅</h3>
                    <p style={{fontSize: '0.9em', marginBottom: '20px', opacity: 0.8}}>
                      When most people are free! 👀✨
                    </p>
                    {allResults.dates && allResults.dates.length > 0 ? (
                      allResults.dates.map(([date, count], index) => {
                        const maxCount = allResults.dates[0][1];
                        const percentage = (count / maxCount) * 100;
                        
                        return (
                          <div key={date} className="result-item">
                            <div className="result-icon">{index + 1 === 1 ? '👑' : '📅'}</div>
                            <div className="result-info">
                              <div className="result-name">
                                February {date} ({count} {count === 1 ? 'person' : 'people'})
                              </div>
                              <div className="progress-bar">
                                <div 
                                  className="progress-fill" 
                                  style={{width: `${percentage}%`}}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p style={{textAlign: 'center', opacity: 0.6}}>No dates selected yet!</p>
                    )}
                  </div>

                  {existingUser && (
                    <div className="result-section">
                      <h3>Your Rankings 💕</h3>
                      <p style={{fontSize: '0.9em', marginBottom: '15px', opacity: 0.8}}>
                        <strong>Activities:</strong>
                      </p>
                      {existingUser.activity_rankings?.map((activity, index) => (
                        <div key={activity} style={{marginBottom: '8px', fontSize: '0.95em'}}>
                          {index + 1}. {activity}
                        </div>
                      ))}
                      <p style={{fontSize: '0.9em', marginTop: '15px', marginBottom: '15px', opacity: 0.8}}>
                        <strong>Food:</strong>
                      </p>
                      {existingUser.food_rankings?.map((food, index) => (
                        <div key={food} style={{marginBottom: '8px', fontSize: '0.95em'}}>
                          {index + 1}. {food}
                        </div>
                      ))}
                      {existingUser.vibe && (
                        <>
                          <p style={{fontSize: '0.9em', marginTop: '15px', marginBottom: '10px', opacity: 0.8}}>
                            <strong>Your vibe:</strong>
                          </p>
                          <div style={{fontSize: '1.1em', fontWeight: '600', color: 'var(--dark-pink)'}}>
                            {existingUser.vibe}
                          </div>
                        </>
                      )}
                      {existingUser.available_dates && existingUser.available_dates.length > 0 && (
                        <>
                          <p style={{fontSize: '0.9em', marginTop: '15px', marginBottom: '10px', opacity: 0.8}}>
                            <strong>Your available dates:</strong>
                          </p>
                          <div style={{fontSize: '0.95em', lineHeight: '1.6'}}>
                            {existingUser.available_dates.sort((a, b) => a - b).map(date => `Feb ${date}`).join(', ')}
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  <p style={{textAlign: 'center', fontSize: '1.1em', color: 'var(--text)', fontWeight: '600'}}>
                    {allResults.totalResponses} bestie{allResults.totalResponses !== 1 ? 's' : ''} said yes so far! 💖
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(<GalentinesApp />);