import React, { useState } from 'react'
import VideoLogo from "../assets/video-posting.png"
import { Alert, Button, Card, Label, Progress, Textarea, TextInput } from 'flowbite-react'
import axios from 'axios';
import toast from 'react-hot-toast';

export default function VideoStreaming() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [meta, setMeta] = useState({
    title: "",
    description: "",
  });
  const [progress, setProgress] = useState(0);
  const [upload, setUpload] = useState(false);
  const [message, setMessage] = useState("");

  function handleFileChange(event) {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  }
  function handleFeildChange(event) {
    setMeta({
      ...meta,
      [event.target.name]: event.target.value
    })
  }
  function handleSubmit(formEvent) {
    formEvent.preventDefault();
    if (!selectedFile) {
      alert("Select file");
      return;
    }
    saveVideoToServer(selectedFile, meta);

  }

  function restForm() {
    setMeta({
      title: "",
      description: ""
    })
    setSelectedFile(null);
    setUpload(false);
  }

  async function saveVideoToServer(video, videoMetaData) {
    setUpload(true);
    try {
      let formData = new FormData();
      formData.append("title", videoMetaData.title);
      formData.append("description", videoMetaData.description);
      formData.append("file", video);

      let response = await axios.post("http://localhost:8080/api/v1/videos",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(progress);
            setProgress(progress);
          }
        }

      );
      console.log(response);
      setMessage("File Uploaded...");
      setProgress(0);
      setUpload(false);
      restForm();
      toast.success("File Uploaded...")
    } catch (error) {
      console.log(error);
      setMessage("Error in Uploading file");
      setProgress(0);
      setUpload(false);
      toast.error("Error in Uploading file");
    }
  }


  return (
    <div className='text-white'>

      <Card className='flex'>
        <h1>Upload Videos</h1>
        <form onSubmit={handleSubmit} className='space-y-6'>

          <div className='mb-2 block'>
            <Label value='Video Title' />
            <TextInput value={meta.title} placeholder='Enter Video Title' name='title' onChange={handleFeildChange} />
          </div>

          <div className="max-w-md">
            <div className="mb-2 block">
              <Label htmlFor="comment" value="Video Desciption" />
            </div>
            <Textarea  value={meta.description} id="comment" onChange={handleFeildChange} name='description' placeholder="Leave a comment..." required rows={4} />
          </div>

          <div className="flex items-center space-x-6">

            <div className="shrink-0">
              <img className="h-16 w-16 object-cover "
                src={VideoLogo}
                alt="Current profile photo" />
            </div>
            <label className="block">
              <span className="sr-only">Choose profile photo</span>
              <input
                type="file"
                name='file'
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 "
              />
            </label>
          </div>
          <div>
            {upload &&
              <Progress
                progress={progress}
                textLabel='Uploading'
                size="lg"
                labelProgress
                labelText
              />
            }
          </div>
          <div>
            {message && message == "File Uploaded..." ?
              <Alert color={'success'}
                rounded
                withBorderAccent
                onDismiss={()=>{
                  setMessage("");
                }}
              >
                <span className="font-medium">Success alert!</span>
                {message}
                

              </Alert> :
              message &&
              <Alert color={'failure'}>
                <span className="font-medium">Error alert!</span>
                {message}

              </Alert>
            }

          </div>
          <div className='flex justify-center'>
            <Button disabled={progress} type='submit'>Upload</Button>
          </div>
        </form>

      </Card>
    </div>
  )
}
