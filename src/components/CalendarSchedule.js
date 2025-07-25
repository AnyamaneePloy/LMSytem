import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from '@fullcalendar/core';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

function CalendarSchedule() {
  const calendarRef = useRef(null);
  const calendarInstance = useRef(null);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/appointments')
      .then(res => res.json())
      .then(data => setEvents(data))
      .catch(err => console.error('Failed to load events:', err));
  }, []);

  useEffect(() => {
    calendarInstance.current = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      initialView: 'timeGridWeek',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events,
      eventClick: function (info) {
        const caseId = info.event.extendedProps?.caseId;
        if (caseId) {
          window.open(`/legal-case/${caseId}`, '_blank');
        } else {
          alert('No case linked to this event.');
        }
      }
    });

    calendarInstance.current.render();

    return () => calendarInstance.current.destroy();
  }, [events]);

  function openEventModal() {
    const modal = new window.bootstrap.Modal(document.getElementById('eventModal'));
    modal.show();
  }

  function addEvent(e) {
    e.preventDefault();
    const title = document.getElementById('eventTitle').value;
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const datetime = `${date}T${time}:00`;

    const newEvent = {
      title,
      start: datetime,
      color: '#0d6efd'
    };

    fetch('http://localhost:4000/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent)
    });

    calendarInstance.current.addEvent(newEvent);
    const modal = window.bootstrap.Modal.getInstance(document.getElementById('eventModal'));
    modal.hide();
    e.target.reset();
  }

  function filterByDateRange() {
    const startDate = document.getElementById("filterStart").value;
    const endDate = document.getElementById("filterEnd").value;
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    calendarInstance.current.getEvents().forEach(event => {
      const eventStart = new Date(event.start);
      const inRange = eventStart >= start && eventStart <= end;
      if (event.el) event.el.style.display = inRange ? "block" : "none";
    });
  }

  function resetFilters() {
    document.getElementById("filterStart").value = "";
    document.getElementById("filterEnd").value = "";
    calendarInstance.current.getEvents().forEach(event => {
      if (event.el) event.el.style.display = "block";
    });
  }

  return (
    <div className="container py-4">
      <h2 className="text-primary mb-4">🗓️ Calendar Schedule</h2>

      {/* Toolbar */}
      <div className="card p-3 mb-4">
        <div className="row g-2 align-items-end">
          <div className="col-md-2">
            <label className="form-label">Start Date</label>
            <input type="date" id="filterStart" className="form-control" />
          </div>
          <div className="col-md-2">
            <label className="form-label">End Date</label>
            <input type="date" id="filterEnd" className="form-control" />
          </div>
          <div className="col-md-2">
            <label className="form-label">Title</label>
            <input type="text" id="filterTitle" placeholder="Event Title" className="form-control" />
          </div>
          <div className="col-md-2">
            <label className="form-label">Participant</label>
            <input type="text" id="filterParticipant" placeholder="Participant" className="form-control" />
          </div>
          <div className="col-md-2">
            <label className="form-label">Location</label>
            <input type="text" id="filterLocation" placeholder="Location" className="form-control" />
          </div>
          <div className="col-md-2 d-flex gap-2">
            <button className="btn btn-primary w-100" onClick={filterByDateRange}>Search</button>
            <button className="btn btn-secondary w-100" onClick={resetFilters}>Reset</button>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <div ref={calendarRef} className="bg-white p-3 shadow rounded" />

      {/* Add Event Button */}
      <div className="text-end mt-3">
        <button className="btn btn-success" onClick={openEventModal}>+ Add Appointment</button>
      </div>

      {/* Bootstrap Modal */}
      <div className="modal fade" id="eventModal" tabIndex="-1" aria-labelledby="eventModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form id="eventForm" onSubmit={addEvent}>
              <div className="modal-header">
                <h5 className="modal-title" id="eventModalLabel">Add New Appointment</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input type="text" id="eventTitle" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date</label>
                  <input type="date" id="eventDate" className="form-control" required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Time</label>
                  <input type="time" id="eventTime" className="form-control" required />
                </div>
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Save</button>
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CalendarSchedule;
