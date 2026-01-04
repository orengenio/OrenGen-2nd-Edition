import React, { useState, useEffect } from 'react';
import { Link } from '@tanstack/react-router';

const BookingInterface: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', company: '', notes: ''
  });

  const meetingNames: Record<string, string> = {
    'ai-automations': 'AI & Automations',
    'email-systems': 'Email Systems',
    'lead-generation': 'Lead Generation',
    'marketing-growth': 'Marketing & Growth',
    'business-audit': 'Full Business Audit',
    'website-services': 'Website Services'
  };

  // --- Logic Helpers ---

  const getAvailableDays = () => {
    const available = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() + 1); // Start tomorrow
    
    // Get next 6 valid days
    while (available.length < 6) {
      const dayOfWeek = checkDate.getDay();
      if (dayOfWeek !== 0) { // No Sundays
        available.push(new Date(checkDate));
      }
      checkDate.setDate(checkDate.getDate() + 1);
    }
    return available;
  };

  const isDateAvailable = (date: Date) => {
    const avail = getAvailableDays();
    return avail.some(d => d.toDateString() === date.toDateString());
  };

  const getTimeSlots = (date: Date) => {
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 6) {
      // Saturday: 11am - 3pm
      return ['11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM'];
    } else {
      // Weekdays: 9am - 7pm
      return [
        '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
        '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
        '5:00 PM', '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM'
      ];
    }
  };

  const handleDateClick = (date: Date) => {
    if (!isDateAvailable(date)) return;
    setSelectedDate(date);
    setSelectedTime(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setStep(4);
  };

  // --- Render Helpers ---

  const renderCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0,0,0,0);

    const days = [];
    
    // Empty cells
    for(let i=0; i<firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="day empty"></div>);
    }

    for(let d=1; d<=daysInMonth; d++) {
        const date = new Date(year, month, d);
        const isAvailable = isDateAvailable(date);
        const isSelected = selectedDate?.toDateString() === date.toDateString();
        const isToday = date.toDateString() === today.toDateString();
        
        let className = 'day';
        if (!isAvailable) className += ' disabled';
        if (isSelected) className += ' selected';
        if (isToday) className += ' today';

        days.push(
            <div key={d} className={className} onClick={() => handleDateClick(date)}>
                {d}
            </div>
        );
    }
    return days;
  };

  return (
    <div className="booking-wrapper">
      <style>{`
        .booking-wrapper {
          --bg-primary: #0A0A0F;
          --bg-secondary: #111118;
          --bg-card: #1A1A22;
          --bg-hover: #242430;
          --border: rgba(255,255,255,0.08);
          --border-hover: rgba(204, 85, 0, 0.5);
          --text-primary: #FFFFFF;
          --text-secondary: #9CA3AF;
          --text-muted: #6B7280;
          --orange: #CC5500;
          --orange-light: #FF6B1A;
          --orange-glow: rgba(204, 85, 0, 0.3);
          --green: #22C55E;
          --blue: #3B82F6;
          
          font-family: 'Space Grotesk', sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }
        
        .booking-wrapper .calendar-container {
          width: 100%;
          max-width: 900px;
          background: var(--bg-secondary);
          border-radius: 24px;
          border: 1px solid var(--border);
          overflow: hidden;
          box-shadow: 0 25px 80px rgba(0,0,0,0.5);
        }

        .booking-wrapper h1, .booking-wrapper h2, .booking-wrapper h3 {
             font-family: 'Outfit', sans-serif;
        }

        /* Header */
        .booking-wrapper .calendar-header {
          padding: 2rem;
          border-bottom: 1px solid var(--border);
          text-align: center;
          background: linear-gradient(180deg, rgba(204, 85, 0, 0.05) 0%, transparent 100%);
        }
        
        .booking-wrapper .calendar-header h1 {
          font-size: 1.75rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        
        .booking-wrapper .calendar-header h1 span {
          background: linear-gradient(135deg, var(--orange) 0%, var(--orange-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .booking-wrapper .calendar-header p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }
        
        .booking-wrapper .calendar-header .phone {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: var(--bg-card);
          border-radius: 50px;
          font-size: 0.85rem;
          color: var(--orange);
        }

        /* Progress Steps */
        .booking-wrapper .progress-bar {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        
        .booking-wrapper .progress-step {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--text-muted);
          background: var(--bg-card);
          border: 1px solid var(--border);
          transition: all 0.3s;
        }
        
        .booking-wrapper .progress-step.active {
          background: var(--orange);
          color: white;
          border-color: var(--orange);
        }
        
        .booking-wrapper .progress-step.completed {
          background: rgba(34, 197, 94, 0.1);
          color: var(--green);
          border-color: var(--green);
        }
        
        .booking-wrapper .progress-step .num {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
        }

        .booking-wrapper .progress-step.active .num { background: rgba(255,255,255,0.2); }
        .booking-wrapper .progress-step.completed .num { background: var(--green); color: white; }

        .booking-wrapper .calendar-content { padding: 2rem; }

        /* Meeting Types */
        .booking-wrapper .meeting-types {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }
        
        .booking-wrapper .meeting-type {
          position: relative;
          padding: 1.5rem;
          background: var(--bg-card);
          border: 2px solid var(--border);
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .booking-wrapper .meeting-type:hover { border-color: var(--border-hover); background: var(--bg-hover); }
        .booking-wrapper .meeting-type.selected { border-color: var(--orange); background: rgba(204, 85, 0, 0.1); }
        
        .booking-wrapper .meeting-type::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 4px; border-radius: 4px 0 0 4px; background: var(--orange); opacity: 0; transition: opacity 0.3s;
        }
        .booking-wrapper .meeting-type:hover::before, .booking-wrapper .meeting-type.selected::before { opacity: 1; }

        .booking-wrapper .meeting-type h3 {
          font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; display: flex; align-items: center; gap: 0.75rem;
        }
        
        .booking-wrapper .meeting-type .icon {
          width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.1rem; background: rgba(255,255,255,0.05);
        }
        
        .booking-wrapper .meeting-type p {
          font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; padding-left: calc(36px + 0.75rem);
        }

        .booking-wrapper .meeting-type .check {
          position: absolute; top: 1rem; right: 1rem; width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; transition: all 0.3s;
        }
        .booking-wrapper .meeting-type.selected .check { background: var(--orange); border-color: var(--orange); }
        .booking-wrapper .meeting-type .check svg { width: 14px; height: 14px; color: white; opacity: 0; }
        .booking-wrapper .meeting-type.selected .check svg { opacity: 1; }

        /* Calendar Picker */
        .booking-wrapper .calendar-picker {
          display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;
        }
        @media (max-width: 700px) { .booking-wrapper .calendar-picker { grid-template-columns: 1fr; } }
        
        .booking-wrapper .date-picker {
          background: var(--bg-card); border-radius: 16px; padding: 1.5rem; border: 1px solid var(--border);
        }

        .booking-wrapper .month-nav {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;
        }
        .booking-wrapper .month-nav button {
          width: 36px; height: 36px; border-radius: 10px; background: var(--bg-hover); border: 1px solid var(--border); color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s;
        }
        .booking-wrapper .month-nav button:hover { background: var(--orange); border-color: var(--orange); }

        .booking-wrapper .weekdays, .booking-wrapper .days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 0.25rem; }
        .booking-wrapper .weekday { text-align: center; font-size: 0.75rem; font-weight: 600; color: var(--text-muted); padding: 0.5rem; }
        
        .booking-wrapper .day {
          aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; border: 2px solid transparent;
        }
        .booking-wrapper .day:hover:not(.disabled):not(.empty) { background: var(--bg-hover); }
        .booking-wrapper .day.today { border-color: var(--orange); }
        .booking-wrapper .day.selected { background: var(--orange); color: white; }
        .booking-wrapper .day.disabled { color: var(--text-muted); opacity: 0.3; cursor: not-allowed; }

        /* Time Picker */
        .booking-wrapper .time-picker {
          background: var(--bg-card); border-radius: 16px; padding: 1.5rem; border: 1px solid var(--border);
        }
        .booking-wrapper .time-slots {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem; max-height: 300px; overflow-y: auto; padding-right: 0.5rem;
        }
        .booking-wrapper .time-slot {
          padding: 0.75rem 1rem; background: var(--bg-primary); border: 2px solid var(--border); border-radius: 10px; font-size: 0.9rem; font-weight: 500; cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .booking-wrapper .time-slot:hover { border-color: var(--border-hover); background: var(--bg-hover); }
        .booking-wrapper .time-slot.selected { background: var(--orange); border-color: var(--orange); color: white; }

        /* Form */
        .booking-wrapper .form-group { margin-bottom: 1.5rem; }
        .booking-wrapper .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text-secondary); }
        .booking-wrapper .form-group input, .booking-wrapper .form-group textarea {
          width: 100%; padding: 1rem 1.25rem; background: var(--bg-card); border: 2px solid var(--border); border-radius: 12px; font-size: 1rem; color: var(--text-primary); transition: all 0.2s;
        }
        .booking-wrapper .form-group input:focus, .booking-wrapper .form-group textarea:focus { outline: none; border-color: var(--orange); background: var(--bg-hover); }
        
        .booking-wrapper .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media (max-width: 500px) { .booking-wrapper .form-row { grid-template-columns: 1fr; } }

        /* Buttons */
        .booking-wrapper .btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; padding: 1rem 2rem; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: all 0.2s; border: none; font-family: inherit;
        }
        .booking-wrapper .btn-primary { background: var(--orange); color: white; box-shadow: 0 4px 20px var(--orange-glow); }
        .booking-wrapper .btn-primary:hover { background: var(--orange-light); transform: translateY(-2px); box-shadow: 0 6px 30px var(--orange-glow); }
        .booking-wrapper .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .booking-wrapper .btn-secondary { background: var(--bg-card); color: var(--text-primary); border: 2px solid var(--border); }
        .booking-wrapper .btn-secondary:hover { border-color: var(--orange); }
        .booking-wrapper .btn-group { display: flex; gap: 1rem; justify-content: center; margin-top: 2rem; }

        .booking-wrapper .summary-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 0; border-bottom: 1px solid var(--border); }
        .booking-wrapper .summary-item .icon { width: 40px; height: 40px; border-radius: 10px; background: rgba(204, 85, 0, 0.1); display: flex; align-items: center; justify-content: center; color: var(--orange); }

        .booking-wrapper .spinner {
            width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--orange); border-radius: 50%; animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      
      <div className="calendar-container">
        {/* Header */}
        <div className="calendar-header">
          <img src="https://storage.googleapis.com/msgsndr/5sXsH3sSRgLPVUOIw303/media/690a621f2b2c75f886569ecf.png" alt="OrenGen Worldwide" style={{height: '50px', marginBottom: '1rem'}} />
          <h1>Book Your <span>Strategy Call</span></h1>
          <p>Choose the perfect meeting to match your goals — from AI solutions to marketing growth.</p>
          <div className="phone">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></svg>
             Prefer AI? Call (833) 673-6436
          </div>
        </div>

        {/* Progress */}
        <div className="progress-bar">
          <div className={`progress-step ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
             <span className="num">1</span><span>Service</span>
          </div>
          <div className={`progress-step ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
             <span className="num">2</span><span>Date & Time</span>
          </div>
          <div className={`progress-step ${step === 3 ? 'active' : step > 3 ? 'completed' : ''}`}>
             <span className="num">3</span><span>Details</span>
          </div>
        </div>

        {/* Content */}
        <div className="calendar-content">
          
          {/* Step 1: Meeting Type */}
          {step === 1 && (
            <div className="animate-fadeIn">
                <div className="meeting-types">
                   {Object.entries(meetingNames).map(([key, label]) => (
                       <div 
                         key={key}
                         className={`meeting-type ${selectedMeeting === key ? 'selected' : ''}`}
                         onClick={() => setSelectedMeeting(key)}
                       >
                           <div className="check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg></div>
                           <h3><span className="icon">
                             {key.includes('ai') ? '🤖' : key.includes('email') ? '📧' : key.includes('lead') ? '🎯' : key.includes('marketing') ? '📈' : key.includes('audit') ? '🔍' : '🌐'}
                           </span> {label}</h3>
                           <p>Professional consultation for {label.toLowerCase()}.</p>
                           <span className="inline-block mt-3 px-3 py-1 bg-[var(--bg-primary)] rounded-full text-xs text-[var(--text-muted)]">⏱ 30 min</span>
                       </div>
                   ))}
                </div>
                <div className="btn-group">
                    <button className="btn btn-primary" onClick={() => setStep(2)} disabled={!selectedMeeting}>
                        Continue <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                    </button>
                </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
             <div className="animate-fadeIn">
                 <div className="calendar-picker">
                     <div className="date-picker">
                         <div className="month-nav">
                             <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}>
                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
                             </button>
                             <h3>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
                             <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}>
                                 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
                             </button>
                         </div>
                         <div className="weekdays">
                             {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="weekday">{d}</div>)}
                         </div>
                         <div className="days">
                             {renderCalendarDays()}
                         </div>
                     </div>

                     <div className="time-picker">
                         <h3>Select Time <span style={{fontSize: '0.8rem', fontWeight: 500, color: 'var(--orange)', background: 'rgba(204,85,0,0.1)', padding: '0.25rem 0.75rem', borderRadius: '50px', marginLeft: 'auto'}}>
                            {selectedDate ? selectedDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric'}) : 'Pick a date'}
                         </span></h3>
                         <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)'}}>
                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                             Central Daylight Time (CDT)
                         </div>
                         <div className="time-slots">
                             {!selectedDate ? (
                                 <div style={{gridColumn: '1/-1', textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)'}}>Select a date to view times</div>
                             ) : (
                                 getTimeSlots(selectedDate).map(t => (
                                     <div 
                                        key={t} 
                                        className={`time-slot ${selectedTime === t ? 'selected' : ''}`}
                                        onClick={() => setSelectedTime(t)}
                                     >
                                         {t}
                                     </div>
                                 ))
                             )}
                         </div>
                     </div>
                 </div>
                 <div className="btn-group">
                     <button className="btn btn-secondary" onClick={() => setStep(1)}>Back</button>
                     <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!selectedTime}>Continue</button>
                 </div>
             </div>
          )}

          {/* Step 3: Details */}
          {step === 3 && (
              <div className="animate-fadeIn">
                  <div style={{maxWidth: '500px', margin: '0 auto'}}>
                      <div style={{background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem'}}>
                          <h4 style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '1rem'}}>Booking Summary</h4>
                          <div className="summary-item">
                              <div className="icon">🎯</div>
                              <div>
                                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Service</div>
                                  <div style={{fontWeight: 600}}>{meetingNames[selectedMeeting!]}</div>
                              </div>
                          </div>
                          <div className="summary-item" style={{borderBottom: 'none'}}>
                              <div className="icon">📅</div>
                               <div>
                                  <div style={{fontSize: '0.75rem', color: 'var(--text-muted)'}}>Date & Time</div>
                                  <div style={{fontWeight: 600}}>{selectedDate?.toLocaleDateString()} at {selectedTime}</div>
                              </div>
                          </div>
                      </div>

                      <form onSubmit={handleSubmit}>
                          <div className="form-row">
                              <div className="form-group">
                                  <label>First Name</label>
                                  <input required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="John" />
                              </div>
                              <div className="form-group">
                                  <label>Last Name</label>
                                  <input required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Doe" />
                              </div>
                          </div>
                          <div className="form-group">
                              <label>Email Address</label>
                              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="john@company.com" />
                          </div>
                          <div className="form-group">
                              <label>Notes</label>
                              <textarea rows={3} value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} placeholder="Tell us about your project..."></textarea>
                          </div>
                          
                          <div className="btn-group">
                              <button type="button" className="btn btn-secondary" onClick={() => setStep(2)}>Back</button>
                              <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                  {isSubmitting ? <div className="spinner"></div> : 'Confirm Booking'}
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
              <div className="animate-fadeIn text-center py-12">
                  <div style={{width: '80px', height: '80px', background: 'rgba(34,197,94,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--green)'}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width: '40px', height: '40px'}}><path d="M5 13l4 4L19 7"/></svg>
                  </div>
                  <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem'}}>You're All Set! 🎉</h2>
                  <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Check your email for confirmation.</p>
                  <div className="btn-group">
                      <Link to="/" className="btn btn-primary">Back to Home</Link>
                  </div>
              </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookingInterface;