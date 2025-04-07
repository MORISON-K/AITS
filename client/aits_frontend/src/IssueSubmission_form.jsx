// import React, { useState } from 'react'

// function IssueSubmission_form() {
//   const IssueSubmission = ({handlePageChange}) => {}
//   const [formData, SetFormData] = useState({
//     yearOfStudy: "",
//     courseUnit: "",
//     issueCategory: "",
//     description: "",
//   });
  

//   const handleChange = (event) => {
    
//     SetFormData({...formData, [event.target.name]: event.target.value});
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();

//     if (!formData.yearOfStudy || !formData.courseUnit || !formData.issueCategory || !formData.description){
//       alert("Please fill all the fields");
//     }

//     console.log("Isue submitted", formData)

//   }
//   return (
//     <div className='issueForm'>
//       <h1 className='issueh1'>Issue Submission Form</h1>
//       <form onSubmit={handleSubmit}>
//         <label className='issueLabel'>Fill the information accurately</label><br />
//         <button className='issueButton'>YEAR OF STUDY</button>
//         <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} className='issueContent'>
//           <option value="">Select Year of Study</option>
//           <option value="yearOne">Year One</option>
//           <option value="yearTwo">Year Two</option>
//           <option value="yearThree">Year Three</option>
//           <option value="yearFour">Year Four</option>
//           <option value="yearFive">Year Five</option>
//         </select><br />

//         <button className='issueButton'>COURSE UNIT</button>
//         <input type="text" name="courseUnit" placeholder='Write Your course here' className='issueContent' /> <br />
//         <button className='issueButton'>ISSUE CATEGORY</button>
//         <select name="issueCategory" value={formData.issueCategory} onChange={handleChange} className='issueContent'>
//           <option value="">Select the Issue Category</option>
//           <option value="missingMarks">Missing Marks</option>
//           <option value="incorrectGrades">Incorrect Grades</option>
//           <option value="remarking">Remarking</option>
//           <option value="other">Other</option>
//         </select><br />
//         <button className='issueButton'>DESCRIPTION</button>
//         <input type="text" name='description' placeholder='Describe your issue here' className='issueContent' /><br />
//         <button className='issueSubmit-button'>Submit</button>
//       </form>

//     </div>
//   )
// }

// export default IssueSubmission_form

import React, { useState } from 'react';
import './IssueSubmission.css'; // Make sure to create this CSS file

function IssueSubmission_form() {
  // State for form data
  const [formData, setFormData] = useState({
    yearOfStudy: "",
    courseUnit: "",
    issueCategory: "",
    description: "",
  });
  
  // State to track current step
  const [currentStep, setCurrentStep] = useState(1);
  
  // Handle form field changes
  const handleChange = (event) => {
    setFormData({...formData, [event.target.name]: event.target.value});
  };
  
  // Navigate to next step
  const nextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 1 && !formData.yearOfStudy) {
      alert("Please select your year of study");
      return;
    }
    if (currentStep === 2 && !formData.courseUnit) {
      alert("Please enter your course unit");
      return;
    }
    if (currentStep === 3 && !formData.issueCategory) {
      alert("Please select an issue category");
      return;
    }
    
    setCurrentStep(currentStep + 1);
  };
  
  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };
  
  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (!formData.description) {
      alert("Please provide a description of your issue");
      return;
    }
    
    // Here you would typically send the data to your backend
    console.log("Issue submitted", formData);
    
    // Show success message
    alert("Your issue has been submitted successfully!");
    
    // Reset form
    setFormData({
      yearOfStudy: "",
      courseUnit: "",
      issueCategory: "",
      description: "",
    });
    setCurrentStep(1);
  };
  
  // Progress indicator
  const renderProgress = () => {
    return (
      <div className="progress-indicator">
        <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>1</div>
        <div className="connector"></div>
        <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>2</div>
        <div className="connector"></div>
        <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>3</div>
        <div className="connector"></div>
        <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>4</div>
      </div>
    );
  };
  
  // Render different form steps
  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="form-step">
            <h2>Year of Study</h2>
            <p>Please select your current year of study</p>
            <select 
              name="yearOfStudy" 
              value={formData.yearOfStudy} 
              onChange={handleChange} 
              className="issueContent"
            >
              <option value="">Select Year of Study</option>
              <option value="yearOne">Year One</option>
              <option value="yearTwo">Year Two</option>
              <option value="yearThree">Year Three</option>
              <option value="yearFour">Year Four</option>
              <option value="yearFive">Year Five</option>
            </select>
            <div className="form-navigation">
              <button type="button" onClick={nextStep} className="next-button">Next</button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="form-step">
            <h2>Course Unit</h2>
            <p>Enter the course unit related to your issue</p>
            <input 
              type="text" 
              name="courseUnit" 
              value={formData.courseUnit}
              onChange={handleChange}
              placeholder="Write your course here" 
              className="issueContent" 
            />
            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="prev-button">Previous</button>
              <button type="button" onClick={nextStep} className="next-button">Next</button>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="form-step">
            <h2>Issue Category</h2>
            <p>Select the category that best describes your issue</p>
            <select 
              name="issueCategory" 
              value={formData.issueCategory} 
              onChange={handleChange} 
              className="issueContent"
            >
              <option value="">Select the Issue Category</option>
              <option value="missingMarks">Missing Marks</option>
              <option value="incorrectGrades">Incorrect Grades</option>
              <option value="remarking">Remarking</option>
              <option value="other">Other</option>
            </select>
            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="prev-button">Previous</button>
              <button type="button" onClick={nextStep} className="next-button">Next</button>
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="form-step">
            <h2>Description</h2>
            <p>Please provide details about your issue</p>
            <textarea 
              name="description" 
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your issue here" 
              className="issueContent description-input" 
              rows="5"
            />
            <div className="form-navigation">
              <button type="button" onClick={prevStep} className="prev-button">Previous</button>
              <button type="button" onClick={handleSubmit} className="submit-button">Submit Issue</button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="issueForm">
      <h1 className="issueh1">Issue Submission Form</h1>
      {renderProgress()}
      <form onSubmit={(e) => e.preventDefault()}>
        {renderStep()}
      </form>
    </div>
  );
}

export default IssueSubmission_form;
