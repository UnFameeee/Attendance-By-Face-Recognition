import React, { useState } from 'react'
import Header from './Header'
import "./Upload.css"

export default function Upload() {
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  function handleFileUpload(event) {
    setImageFile(event.target.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append('myImage', imageFile);
    fetch('/upload/photo', {
      method: 'POST',
      body: formData
    })
      .then(response => {
        // Handle response
      })
      .catch(error => {
        console.log(error)
      });
  }

  return (
    <>
      <Header />
      <div className='upload-container'>
        <form className='form-upload-container' onSubmit={handleSubmit}>
          <img className="upload" src={imageUrl ? imageUrl : "https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png"} alt="Selected image" />
          <input type="file" className="myImage" accept="image/*" onChange={handleFileUpload} />
          <input type='text' className='imageUploadName' placeholder='Photo Name'/>
          <input type="submit" value="Upload Photo" disabled={!imageFile} />
        </form>
      </div>
    </>
  )
}
