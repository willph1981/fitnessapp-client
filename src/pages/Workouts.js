import React, { useState, useEffect } from 'react';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    status: 'pending',
  });

  // Fetch workouts when the component mounts
  const fetchWorkouts = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in!');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/getMyWorkouts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkouts(data.workouts); // Set workouts state with the fetched data
      } else {
        setError('Failed to fetch workouts');
      }
    } catch (error) {
      setError('Error fetching workouts: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts(); // Call fetchWorkouts on component mount
  }, []);

  // Handle adding a new workout
  const handleAddWorkout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in!');
      return;
    }

    try {
      const response = await fetch('https://fitnessapp-api-ln8u.onrender.com/workouts/addWorkout', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newWorkout = await response.json();
        setWorkouts(prevWorkouts => Array.isArray(prevWorkouts) ? [...prevWorkouts, newWorkout] : [newWorkout]);

        setShowModal(false);
        setFormData({ name: '', duration: '', status: 'pending' });
      } else {
        setError('Failed to add workout');
      }
    } catch (error) {
      setError('Error adding workout: ' + error.message);
    }
  };

  // Handle editing a workout
  const handleEditWorkout = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in!');
      return;
    }

    if (!currentWorkout?._id) {
      setError('No workout selected');
      return;
    }



    try {
      

    	console.log('Sending this data to backend:', {
  name: formData.name,
  duration: formData.duration,
  status: formData.status
});



      const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/updateWorkout/${currentWorkout._id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedWorkout = await response.json();
        console.log('Updated Workout:', updatedWorkout);

        // Re-fetch the workouts to ensure the updated workout is displayed
        fetchWorkouts();

        setShowModal(false);
        setCurrentWorkout(null);
        setFormData({ name: '', duration: '', status: 'pending' });


      } else {
        setError('Failed to update workout');
      }
    } catch (error) {
      setError('Error updating workout: ' + error.message);
    }
  };

  // Handle input change in the modal form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(formData);
  };

  // Open the edit modal with the current workout data
  const openEditModal = (workout) => {
    setCurrentWorkout(workout);
    setFormData({
      name: workout.name,
      duration: workout.duration,
      status: workout.status || 'pending',
    });
    setShowModal(true);
  };

  // Delete a workout
  const deleteWorkout = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in!');
      return;
    }

    try {
      const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/deleteWorkout/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setWorkouts(workouts.filter((workout) => workout._id !== id));
      } else {
        setError('Failed to delete workout');
      }
    } catch (error) {
      setError('Error deleting workout: ' + error.message);
    }
  };

 

  const handleCompleteWorkout = async (workoutId) => {
  if (!workoutId) {
    setError('No workout selected');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    setError('No token found, please log in!');
    return;
  }

  try {
    const response = await fetch(`https://fitnessapp-api-ln8u.onrender.com/workouts/completeWorkoutStatus/${workoutId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const updatedWorkout = await response.json();
      console.log('Workout completed:', updatedWorkout);
      // Optionally, you can fetch the workouts again to reflect the changes
      fetchWorkouts();
    } else {
      setError('Failed to complete workout');
    }
  } catch (error) {
    setError('Error completing workout: ' + error.message);
  }
};

 // Render loading, error, or workouts
  if (loading) return <p>Loading your workouts...</p>;
  if (error) return <p>{error}</p>;




  return (
    <div>
      <h1>Your Workouts</h1>

      {!Array.isArray(workouts) || workouts.length === 0 ? (
        <p>No workouts found</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
          {workouts.map((workout) => (
            <div key={workout._id} style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '1rem' }}>
              <h3>{workout.name}</h3>
              <p><strong>Duration:</strong> {workout.duration} mins</p>
              <p><strong>Status:</strong> {workout.status}</p>
              <p><strong>Date Added:</strong> {new Date(workout.dateAdded).toLocaleString()}</p>

              <button onClick={() => openEditModal(workout)}>Edit</button>
              <button onClick={() => deleteWorkout(workout._id)} style={{ marginLeft: '1rem' }}>
                Delete
              </button>
              <button onClick={() => handleCompleteWorkout(workout._id)} style={{ marginLeft: '1rem' }}>Complete</button>


            </div>
          ))}
        </div>
      )}

      <button id="addWorkout" onClick={() => setShowModal(true)} style={{ marginTop: '2rem' }}>
        Add New Workout
      </button>

      {/* Modal for Add/Edit Workout */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#fff', padding: '2rem', borderRadius: '8px', width: '400px'
          }}>
            <h2>{currentWorkout ? 'Edit Workout' : 'Add New Workout'}</h2>

            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <br />
            <label>Duration (mins):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
            />

            <div style={{ marginTop: '1rem' }}>
              <button onClick={currentWorkout ? handleEditWorkout : handleAddWorkout}>
                {currentWorkout ? 'Update Workout' : 'Add Workout'}
              </button>
              <button onClick={() => setShowModal(false)} style={{ marginLeft: '1rem' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;
