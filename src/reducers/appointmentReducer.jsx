// Initial state object for the appointment booking form
export const initialState = {
  doctors: [],             // List of all doctors fetched from backend or API
  departments: [],         // Unique list of departments extracted from doctors list
  selectedDepartment: '',  // Department selected by the user in the UI
  selectedDoctorId: '',    // ID of the doctor selected by the user
  selectedDoctor: null,    // Full doctor object corresponding to selectedDoctorId
  availableSlots: [],      // Array of available appointment slots for the selected doctor and date
  selectedDate: '',        // Date selected for the appointment
  selectedTime: '',        // Time slot selected for the appointment
  comments: '',            // Any additional comments entered by the user
  reportFile: null,        // Uploaded report file by the user (optional)
};

// Reducer function to manage appointment booking state updates based on dispatched actions
export function appointmentReducer(state, action) {
  switch (action.type) {

    // Action to set the full list of doctors and extract unique departments from them
    case 'SET_DOCTORS':
      return {
        ...state,
        doctors: action.payload, // Update doctors array with fetched doctors
        // Extract unique department names from doctors list using Set, then convert back to array
        departments: [...new Set(action.payload.map(doc => doc.department))],
      };

    // Action to set the selected department when user picks a department
    case 'SET_DEPARTMENT':
      return {
        ...state,
        selectedDepartment: action.payload, // Update the selected department string
        // Reset dependent selections to defaults because department changed
        selectedDoctorId: '',
        selectedDate: '',
        selectedTime: '',
        selectedDoctor: null,
        availableSlots: [],
      };

    // Action to set the selected doctor's ID when user chooses a doctor from the filtered list
    case 'SET_DOCTOR_ID':
      return {
        ...state,
        selectedDoctorId: action.payload, // Store the chosen doctor's ID
        // Reset dependent selections because doctor changed
        selectedDate: '',
        selectedTime: '',
      };

    // Action to set the full selected doctor object, typically after loading doctor details
    case 'SET_SELECTED_DOCTOR':
      return {
        ...state,
        selectedDoctor: action.payload, // Store doctor object (could include name, specialty, etc.)
      };

    // Action to set the available appointment slots for the selected doctor & date
    case 'SET_AVAILABLE_SLOTS':
      return {
        ...state,
        availableSlots: action.payload, // Update with new slots array
      };

    // Action to set the selected appointment date chosen by the user
    case 'SET_DATE':
      return {
        ...state,
        selectedDate: action.payload, // Store the selected date (string or Date object)
        selectedTime: '', // Reset selected time when date changes
      };

    // Action to set the selected appointment time slot chosen by the user
    case 'SET_TIME':
      return {
        ...state,
        selectedTime: action.payload, // Store selected time slot (e.g., '10:00 AM')
      };

    // Action to update the comments or notes user adds for the appointment
    case 'SET_COMMENTS':
      return {
        ...state,
        comments: action.payload, // Update comments string
      };

    // Action to set the uploaded report file (for example, a medical report PDF)
    case 'SET_REPORT':
      return {
        ...state,
        reportFile: action.payload, // Store the File object from file input
      };

    // Action to reset the entire appointment form state back to initial defaults
    case 'RESET_FORM':
      return initialState;

    // Default case to return current state if action type is unknown
    default:
      return state;
  }
}
