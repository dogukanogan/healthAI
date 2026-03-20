import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function PeopleList() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ type: '', message: '' });
  
  // Modal acik/kapali durumlari
  const [editPerson, setEditPerson] = useState(null);
  const [deletePersonId, setDeletePersonId] = useState(null);

  useEffect(() => {
    fetchPeople();
  }, []);

  const fetchPeople = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/people`);
      setPeople(response.data);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', message: 'Failed to load people.' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/people/${editPerson.id}`, {
        full_name: editPerson.full_name,
        email: editPerson.email
      });
      setStatus({ type: 'success', message: 'Person updated successfully.' });
      setEditPerson(null);
      fetchPeople();
    } catch (error) {
      if (error.response?.data?.error === 'EMAIL_ALREADY_EXISTS') {
        setStatus({ type: 'error', message: 'Update failed: Email already exists.' });
      } else {
        setStatus({ type: 'error', message: 'Update failed.' });
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/people/${deletePersonId}`);
      setStatus({ type: 'success', message: 'Person deleted successfully.' });
      setDeletePersonId(null);
      fetchPeople();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to delete person.' });
    }
  };

  return (
    <div className="card">
      <h1>Registered People</h1>
      
      {status.message && (
        <div className={`message ${status.type}`}>
          {status.message}
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {people.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No people registered yet.</td>
                </tr>
              ) : (
                people.map((person) => (
                  <tr key={person.id}>
                    <td>{person.id}</td>
                    <td>{person.full_name}</td>
                    <td>{person.email}</td>
                    <td>
                      <div className="actions">
                        <button 
                          className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}
                          onClick={() => setEditPerson(person)}
                        >
                          Edit
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => setDeletePersonId(person.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Duzenleme Modali */}
      {editPerson && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Edit Person</h2>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={editPerson.full_name}
                  onChange={(e) => setEditPerson({ ...editPerson, full_name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-input"
                  value={editPerson.email}
                  onChange={(e) => setEditPerson({ ...editPerson, email: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-danger" onClick={() => setEditPerson(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Silme Onay Modali */}
      {deletePersonId && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Deletion</h2>
            <p>Are you sure you want to delete this person? This action cannot be undone.</p>
            <div className="modal-actions">
              <button className="btn" style={{ border: '1px solid var(--border)' }} onClick={() => setDeletePersonId(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" style={{ backgroundColor: 'var(--danger)', color: 'white' }} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PeopleList;
