class TimelineApp {
    constructor() {
        this.canvas = document.getElementById('timelineCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Timeline configuration
        this.START_YEAR = -15000000000; // 15 miliarde î.Hr.
        this.END_YEAR = 2100;          // 2100 d.Hr.
        this.current_center_year = 1;  // Pornește centrat pe anul 1
        
        // Zoom configuration
        this.min_zoom = 0.000001;
        this.max_zoom = 1000000000;
        this.zoom_factor = this.max_zoom; // Pornește cu zoom maxim
        
        // Canvas properties
        this.canvas_width = 1200;
        this.canvas_height = 600;
        this.timeline_y = 300; // Poziția Y a axei cronologice
        
        // Event management
        this.events = [];
        this.selected_event = null;
        this.editing_event = null;
        this.right_click_year = null;
        
        // Mouse state
        this.mouse_down = false;
        this.last_mouse_x = 0;
        this.last_mouse_y = 0;
        
        this.initializeCanvas();
        this.setupEventListeners();
        this.loadEvents();
        this.updateDisplay();
    }
    
    initializeCanvas() {
        // Set canvas size
        this.canvas.width = this.canvas_width;
        this.canvas.height = this.canvas_height;
        
        // Make canvas responsive
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        const container = this.canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        this.canvas_width = containerRect.width;
        this.canvas_height = containerRect.height;
        
        this.canvas.width = this.canvas_width;
        this.canvas.height = this.canvas_height;
        this.timeline_y = this.canvas_height / 2;
        
        this.updateDisplay();
    }
    
    setupEventListeners() {
        // Mouse events for canvas
        this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
        this.canvas.addEventListener('contextmenu', (e) => this.onRightClick(e));
        
        // Button events
        document.getElementById('addEventBtn').addEventListener('click', () => this.addEvent());
        document.getElementById('editEventBtn').addEventListener('click', () => this.editSelectedEvent());
        document.getElementById('deleteEventBtn').addEventListener('click', () => this.deleteSelectedEvent());
        document.getElementById('resetZoomBtn').addEventListener('click', () => this.resetZoom());
        document.getElementById('saveEventsBtn').addEventListener('click', () => this.saveEvents());
        document.getElementById('loadEventsBtn').addEventListener('click', () => this.loadEventsFromFile());
        
        // Modal events
        this.setupModalEvents();
        
        // Context menu events
        this.setupContextMenu();
        
        // Keyboard events
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
    }
    
    setupModalEvents() {
        const modal = document.getElementById('eventModal');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancelBtn');
        const saveBtn = document.getElementById('saveEventBtn');
        
        closeBtn.addEventListener('click', () => this.hideModal());
        cancelBtn.addEventListener('click', () => this.hideModal());
        saveBtn.addEventListener('click', () => this.saveEventFromModal());
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hideModal();
            }
        });
    }
    
    setupContextMenu() {
        const contextMenu = document.getElementById('contextMenu');
        
        document.getElementById('addEventHere').addEventListener('click', () => {
            contextMenu.style.display = 'none';
            this.addEventAtYear(this.right_click_year);
        });
        
        document.getElementById('editSelectedEvent').addEventListener('click', () => {
            contextMenu.style.display = 'none';
            this.editSelectedEvent();
        });
        
        document.getElementById('deleteSelectedEvent').addEventListener('click', () => {
            contextMenu.style.display = 'none';
            this.deleteSelectedEvent();
        });
        
        // Hide context menu when clicking elsewhere
        document.addEventListener('click', () => {
            contextMenu.style.display = 'none';
        });
    }
    
    // Coordinate conversion methods
    yearToX(year) {
        const total_range = this.END_YEAR - this.START_YEAR;
        const visible_range = total_range / this.zoom_factor;
        const start_visible = this.current_center_year - visible_range / 2;
        
        if (year < start_visible || year > start_visible + visible_range) {
            return null; // Event is outside visible range
        }
        
        const relative_pos = (year - start_visible) / visible_range;
        return relative_pos * this.canvas_width;
    }
    
    xToYear(x) {
        const total_range = this.END_YEAR - this.START_YEAR;
        const visible_range = total_range / this.zoom_factor;
        const start_visible = this.current_center_year - visible_range / 2;
        
        const relative_pos = x / this.canvas_width;
        return start_visible + relative_pos * visible_range;
    }
    
    // Mouse event handlers
    onMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.mouse_down = true;
        this.last_mouse_x = x;
        this.last_mouse_y = y;
        
        // Check if clicking on an event
        this.selected_event = this.getEventAtPosition(x, y);
        this.updateDisplay();
    }
    
    onMouseMove(e) {
        if (!this.mouse_down) return;
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        const dx = x - this.last_mouse_x;
        
        // Pan the timeline
        const total_range = this.END_YEAR - this.START_YEAR;
        const visible_range = total_range / this.zoom_factor;
        const pan_amount = -(dx / this.canvas_width) * visible_range;
        
        this.current_center_year += pan_amount;
        
        // Clamp to bounds
        const half_visible = visible_range / 2;
        this.current_center_year = Math.max(this.START_YEAR + half_visible, 
                                          Math.min(this.END_YEAR - half_visible, this.current_center_year));
        
        this.last_mouse_x = x;
        this.updateDisplay();
    }
    
    onMouseUp(e) {
        this.mouse_down = false;
    }
    
    onWheel(e) {
        e.preventDefault();
        
        const zoom_change = e.deltaY > 0 ? 0.9 : 1.1;
        const new_zoom = this.zoom_factor * zoom_change;
        
        this.zoom_factor = Math.max(this.min_zoom, Math.min(this.max_zoom, new_zoom));
        this.updateDisplay();
    }
    
    onRightClick(e) {
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        this.right_click_year = Math.round(this.xToYear(x));
        
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.style.left = e.pageX + 'px';
        contextMenu.style.top = e.pageY + 'px';
        contextMenu.style.display = 'block';
    }
    
    onKeyDown(e) {
        if (e.key === 'Delete' && this.selected_event) {
            this.deleteSelectedEvent();
        }
    }
    
    // Event management methods
    getEventAtPosition(x, y) {
        for (let event of this.events) {
            const event_x = this.yearToX(event.start_year);
            if (event_x === null) continue;
            
            const event_width = Math.max(20, event.title.length * 8);
            const event_height = 60;
            const event_y = this.timeline_y - 80;
            
            if (x >= event_x - event_width/2 && x <= event_x + event_width/2 &&
                y >= event_y && y <= event_y + event_height) {
                return event;
            }
        }
        return null;
    }
    
    addEvent() {
        this.editing_event = null;
        this.showModal('Adaugă Eveniment');
    }
    
    addEventAtYear(year) {
        this.editing_event = null;
        this.showModal('Adaugă Eveniment');
        document.getElementById('startYear').value = year;
    }
    
    editSelectedEvent() {
        if (!this.selected_event) {
            alert('Selectează un eveniment pentru a-l edita!');
            return;
        }
        
        this.editing_event = this.selected_event;
        this.showModal('Editează Eveniment');
        this.populateModalWithEvent(this.selected_event);
    }
    
    deleteSelectedEvent() {
        if (!this.selected_event) {
            alert('Selectează un eveniment pentru a-l șterge!');
            return;
        }
        
        if (confirm(`Ești sigur că vrei să ștergi evenimentul "${this.selected_event.title}"?`)) {
            const index = this.events.indexOf(this.selected_event);
            if (index > -1) {
                this.events.splice(index, 1);
                this.selected_event = null;
                this.updateDisplay();
                this.saveEvents();
            }
        }
    }
    
    // Modal management
    showModal(title) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('eventModal').style.display = 'block';
        
        if (!this.editing_event) {
            this.clearModal();
        }
    }
    
    hideModal() {
        document.getElementById('eventModal').style.display = 'none';
        this.clearModal();
    }
    
    clearModal() {
        document.getElementById('eventTitle').value = '';
        document.getElementById('startYear').value = '';
        document.getElementById('endYear').value = '';
        document.getElementById('eventDescription').value = '';
        document.querySelector('input[name="eventColor"]:checked').checked = false;
        document.getElementById('color1').checked = true;
    }
    
    populateModalWithEvent(event) {
        document.getElementById('eventTitle').value = event.title;
        document.getElementById('startYear').value = event.start_year;
        document.getElementById('endYear').value = event.end_year || '';
        document.getElementById('eventDescription').value = event.description || '';
        
        const colorInput = document.querySelector(`input[value="${event.color}"]`);
        if (colorInput) {
            colorInput.checked = true;
        }
    }
    
    saveEventFromModal() {
        const title = document.getElementById('eventTitle').value.trim();
        const startYear = parseInt(document.getElementById('startYear').value);
        const endYear = document.getElementById('endYear').value ? parseInt(document.getElementById('endYear').value) : null;
        const description = document.getElementById('eventDescription').value.trim();
        const color = document.querySelector('input[name="eventColor"]:checked').value;
        
        if (!title) {
            alert('Titlul evenimentului este obligatoriu!');
            return;
        }
        
        if (isNaN(startYear)) {
            alert('Anul de început trebuie să fie un număr valid!');
            return;
        }
        
        const eventData = {
            title: title,
            start_year: startYear,
            end_year: endYear,
            description: description,
            color: color
        };
        
        if (this.editing_event) {
            // Update existing event
            Object.assign(this.editing_event, eventData);
        } else {
            // Add new event
            this.events.push(eventData);
        }
        
        this.hideModal();
        this.updateDisplay();
        this.saveEvents();
    }
    
    // Zoom and navigation
    resetZoom() {
        this.zoom_factor = this.max_zoom;
        this.current_center_year = 1;
        this.updateDisplay();
    }
    
    // Display methods
    updateDisplay() {
        this.clearCanvas();
        this.drawTimeline();
        this.drawEvents();
        this.updateInfoPanel();
    }
    
    clearCanvas() {
        this.ctx.fillStyle = '#2c3e50';
        this.ctx.fillRect(0, 0, this.canvas_width, this.canvas_height);
    }
    
    drawTimeline() {
        const total_range = this.END_YEAR - this.START_YEAR;
        const visible_range = total_range / this.zoom_factor;
        const start_visible = this.current_center_year - visible_range / 2;
        const end_visible = start_visible + visible_range;
        
        // Draw main timeline
        this.ctx.strokeStyle = '#ecf0f1';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.timeline_y);
        this.ctx.lineTo(this.canvas_width, this.timeline_y);
        this.ctx.stroke();
        
        // Calculate appropriate interval for marks
        const interval = this.calculateInterval(visible_range);
        
        // Draw year marks and labels
        this.ctx.fillStyle = '#ecf0f1';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        
        let year = Math.floor(start_visible / interval) * interval;
        while (year <= end_visible) {
            const x = this.yearToX(year);
            if (x !== null && x >= 0 && x <= this.canvas_width) {
                // Draw mark
                this.ctx.beginPath();
                this.ctx.moveTo(x, this.timeline_y - 10);
                this.ctx.lineTo(x, this.timeline_y + 10);
                this.ctx.stroke();
                
                // Draw label
                const label = this.formatYear(year);
                this.ctx.fillText(label, x, this.timeline_y + 30);
            }
            year += interval;
        }
    }
    
    calculateInterval(visible_range) {
        const target_marks = 10;
        const raw_interval = visible_range / target_marks;
        
        const magnitude = Math.pow(10, Math.floor(Math.log10(raw_interval)));
        const normalized = raw_interval / magnitude;
        
        let interval;
        if (normalized <= 1) interval = magnitude;
        else if (normalized <= 2) interval = 2 * magnitude;
        else if (normalized <= 5) interval = 5 * magnitude;
        else interval = 10 * magnitude;
        
        return Math.max(1, interval);
    }
    
    formatYear(year) {
        if (year < 0) {
            const absYear = Math.abs(year);
            if (absYear >= 1000000000) {
                return `${(absYear / 1000000000).toFixed(1)}B î.Hr.`;
            } else if (absYear >= 1000000) {
                return `${(absYear / 1000000).toFixed(1)}M î.Hr.`;
            } else {
                return `${absYear} î.Hr.`;
            }
        } else {
            if (year >= 1000000) {
                return `${(year / 1000000).toFixed(1)}M d.Hr.`;
            } else {
                return `${year} d.Hr.`;
            }
        }
    }
    
    drawEvents() {
        for (let event of this.events) {
            const x = this.yearToX(event.start_year);
            if (x === null) continue;
            
            // Event box
            const box_width = Math.max(120, event.title.length * 8);
            const box_height = 60;
            const box_x = x - box_width / 2;
            const box_y = this.timeline_y - 80;
            
            // Draw event box
            this.ctx.fillStyle = event.color || '#4CAF50';
            if (event === this.selected_event) {
                this.ctx.strokeStyle = '#FFD700';
                this.ctx.lineWidth = 3;
                this.ctx.strokeRect(box_x, box_y, box_width, box_height);
            }
            this.ctx.fillRect(box_x, box_y, box_width, box_height);
            
            // Draw event line to timeline
            this.ctx.strokeStyle = event.color || '#4CAF50';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(x, box_y + box_height);
            this.ctx.lineTo(x, this.timeline_y);
            this.ctx.stroke();
            
            // Draw event text
            this.ctx.fillStyle = 'white';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            
            // Title
            this.ctx.fillText(event.title, x, box_y + 20);
            
            // Year
            this.ctx.font = '10px Arial';
            const yearText = this.formatYear(event.start_year);
            this.ctx.fillText(yearText, x, box_y + 35);
            
            // End year if applicable
            if (event.end_year) {
                const endYearText = `- ${this.formatYear(event.end_year)}`;
                this.ctx.fillText(endYearText, x, box_y + 48);
            }
        }
    }
    
    updateInfoPanel() {
        const zoomInfo = document.getElementById('zoomInfo');
        const rangeInfo = document.getElementById('rangeInfo');
        
        zoomInfo.textContent = `Zoom: ${this.zoom_factor.toExponential(2)}x`;
        
        const total_range = this.END_YEAR - this.START_YEAR;
        const visible_range = total_range / this.zoom_factor;
        const start_visible = this.current_center_year - visible_range / 2;
        const end_visible = start_visible + visible_range;
        
        rangeInfo.textContent = `Interval: ${this.formatYear(start_visible)} - ${this.formatYear(end_visible)}`;
    }
    
    // Data persistence
    saveEvents() {
        const eventsData = JSON.stringify(this.events, null, 2);
        localStorage.setItem('timelineEvents', eventsData);
        
        // Also create downloadable file
        const blob = new Blob([eventsData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'events.json';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('Evenimente salvate!');
    }
    
    loadEvents() {
        // Try to load from localStorage first
        const savedEvents = localStorage.getItem('timelineEvents');
        if (savedEvents) {
            try {
                this.events = JSON.parse(savedEvents);
                this.updateDisplay();
                return;
            } catch (e) {
                console.error('Eroare la încărcarea evenimentelor din localStorage:', e);
            }
        }
        
        // If no saved events, load default events
        this.loadDefaultEvents();
    }
    
    loadEventsFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        this.events = JSON.parse(e.target.result);
                        this.updateDisplay();
                        localStorage.setItem('timelineEvents', e.target.result);
                        alert('Evenimente încărcate cu succes!');
                    } catch (error) {
                        alert('Eroare la încărcarea fișierului JSON!');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }
    
    loadDefaultEvents() {
        this.events = [
            {
                "title": "Big Bang",
                "start_year": -13800000000,
                "end_year": null,
                "description": "Începutul universului cunoscut",
                "color": "#FF9800"
            },
            {
                "title": "Formarea sistemului solar",
                "start_year": -4600000000,
                "end_year": null,
                "description": "Formarea Soarelui și planetelor",
                "color": "#FF9800"
            },
            {
                "title": "Apariția primelor forme de viață",
                "start_year": -3800000000,
                "end_year": null,
                "description": "Primele organisme unicelulare",
                "color": "#4CAF50"
            },
            {
                "title": "Apariția oxigenului în atmosferă",
                "start_year": -2400000000,
                "end_year": null,
                "description": "Marea oxidare",
                "color": "#2196F3"
            },
            {
                "title": "Apariția eucariotiților",
                "start_year": -2100000000,
                "end_year": null,
                "description": "Primele celule cu nucleu",
                "color": "#4CAF50"
            },
            {
                "title": "Explozia cambrană",
                "start_year": -541000000,
                "end_year": -485400000,
                "description": "Diversificarea rapidă a vieții",
                "color": "#4CAF50"
            },
            {
                "title": "Primele pești",
                "start_year": -500000000,
                "end_year": null,
                "description": "Apariția vertebratelor",
                "color": "#2196F3"
            },
            {
                "title": "Plantele colonizează uscatul",
                "start_year": -450000000,
                "end_year": null,
                "description": "Prima vegetație terestră",
                "color": "#4CAF50"
            },
            {
                "title": "Primele reptile",
                "start_year": -320000000,
                "end_year": null,
                "description": "Apariția reptilelor",
                "color": "#FF9800"
            },
            {
                "title": "Extincția Permian-Triasic",
                "start_year": -252000000,
                "end_year": null,
                "description": "Marea extincție",
                "color": "#F44336"
            },
            {
                "title": "Primii dinozauri",
                "start_year": -230000000,
                "end_year": null,
                "description": "Apariția dinozaurilor",
                "color": "#FF9800"
            },
            {
                "title": "Primele mamifere",
                "start_year": -200000000,
                "end_year": null,
                "description": "Apariția mamiferelor",
                "color": "#9C27B0"
            },
            {
                "title": "Extincția dinozaurilor",
                "start_year": -66000000,
                "end_year": null,
                "description": "Impactul asteroidului",
                "color": "#F44336"
            },
            {
                "title": "Apariția primatelor",
                "start_year": -55000000,
                "end_year": null,
                "description": "Primii primați",
                "color": "#9C27B0"
            },
            {
                "title": "Homo sapiens",
                "start_year": -300000,
                "end_year": null,
                "description": "Apariția omului modern",
                "color": "#607D8B"
            },
            {
                "title": "Agricultură",
                "start_year": -10000,
                "end_year": null,
                "description": "Începutul agriculturii",
                "color": "#4CAF50"
            },
            {
                "title": "Prima civilizație (Mesopotamia)",
                "start_year": -3500,
                "end_year": null,
                "description": "Sumerienii",
                "color": "#FF9800"
            },
            {
                "title": "Inventarea scrisului",
                "start_year": -3200,
                "end_year": null,
                "description": "Cuneiforme",
                "color": "#2196F3"
            },
            {
                "title": "Piramidele din Egipt",
                "start_year": -2580,
                "end_year": -2510,
                "description": "Marea Piramidă din Giza",
                "color": "#FF9800"
            },
            {
                "title": "Nașterea lui Iisus",
                "start_year": 1,
                "end_year": null,
                "description": "Începutul erei creștine",
                "color": "#9C27B0"
            },
            {
                "title": "Căderea Imperiului Roman",
                "start_year": 476,
                "end_year": null,
                "description": "Sfârșitul antichității",
                "color": "#F44336"
            },
            {
                "title": "Renașterea",
                "start_year": 1400,
                "end_year": 1600,
                "description": "Reînnoire culturală",
                "color": "#FF9800"
            },
            {
                "title": "Revoluția industrială",
                "start_year": 1760,
                "end_year": 1840,
                "description": "Mecanizarea",
                "color": "#607D8B"
            },
            {
                "title": "Primul război mondial",
                "start_year": 1914,
                "end_year": 1918,
                "description": "Marele Război",
                "color": "#F44336"
            },
            {
                "title": "Al doilea război mondial",
                "start_year": 1939,
                "end_year": 1945,
                "description": "Cel mai devastator război",
                "color": "#F44336"
            },
            {
                "title": "Era internetului",
                "start_year": 1990,
                "end_year": null,
                "description": "Revoluția digitală",
                "color": "#2196F3"
            },
            {
                "title": "Inteligența Artificială Generală",
                "start_year": 2035,
                "end_year": null,
                "description": "IA depășește capacitățile umane",
                "color": "#9C27B0"
            },
            {
                "title": "Fuziunea nucleară comercială",
                "start_year": 2040,
                "end_year": null,
                "description": "Energie curată nelimitată",
                "color": "#4CAF50"
            },
            {
                "title": "Prima colonie pe Marte",
                "start_year": 2050,
                "end_year": null,
                "description": "Umanitatea devine multiplanetară",
                "color": "#FF9800"
            },
            {
                "title": "Nanotechnologia avansată",
                "start_year": 2060,
                "end_year": null,
                "description": "Manipularea materiei la nivel atomic",
                "color": "#2196F3"
            },
            {
                "title": "Extinderea în sistemul solar",
                "start_year": 2080,
                "end_year": null,
                "description": "Colonii pe Europa și Titan",
                "color": "#607D8B"
            },
            {
                "title": "Prima navă interstelară",
                "start_year": 2100,
                "end_year": null,
                "description": "Călătoria către Proxima Centauri",
                "color": "#FF9800"
            }
        ];
        
        this.updateDisplay();
        this.saveEvents();
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TimelineApp();
});
