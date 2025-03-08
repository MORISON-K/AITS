import React, { useState } from 'react'

function IssueSubmission_form() {
  const IssueSubmission = ({handlePageChange}) => {}
  const [formData, SetFormData] = useState({
    yearOfStudy: "",
    courseUnit: "",
    issueCategory: "",
    description: "",
  });

  const handleChange = (event) => {
    
    SetFormData({...formData, [event.target.name]: event.target.value});
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!formData.yearOfStudy || !formData.courseUnit || !formData.issueCategory || !formData.description){
      alert("Please fill all the fields");
    }

    console.log("Isue submitted", formData)

  }
  return (
    <div className='issueForm'>
      <h1>Issue Submission Form</h1>
      <form onSubmit={handleSubmit}>
        <label className='issueLabel'>Fill the information accurately</label><br />
        <button className='issueButton'>YEAR OF STUDY</button>
        <select name="yearOfStudy" value={formData.yearOfStudy} onChange={handleChange} className='issueContent'>
          <option value="">Select Year of Study</option>
          <option value="yearOne">Year One</option>
          <option value="yearTwo">Year Two</option>
          <option value="yearThree">Year Three</option>
          <option value="yearFour">Year Four</option>
          <option value="yearFive">Year Five</option>
        </select><br />

        <button className='issueButton'>COURSE UNIT</button>
        <input type="text" name="courseUnit" placeholder='Write Your course here' className='issueContent' /> <br />
        <button className='issueButton'>ISSUE CATEGORY</button>
        <select name="issueCategory" value={formData.issueCategory} onChange={handleChange} className='issueContent'>
          <option value="">Select the Issue Category</option>
          <option value="missingMarks">Missing Marks</option>
          <option value="incorrectGrades">Incorrect Grades</option>
          <option value="remarking">Remarking</option>
          <option value="other">Other</option>
        </select><br />
        <button className='issueButton'>DESCRIPTION</button>
        <input type="text" name='description' placeholder='Describe your issue here' className='issueContent' /><br />
        <button className='issueSubmit-button'>Submit</button>
      </form>

    </div>
  )
}

export default IssueSubmission_form