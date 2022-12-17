import { title } from "process";
import React, { useState } from "react";
import API from "../../API";
import './FileUploader.scss';

const FileUploader = (props:any) => {
    const {uid} = props
    const [file, setFile] = useState()

    function handleChange(event:any) {
        setFile(event.target.files[0])
    }

    async function handleSubmit(event:any) {
        event.preventDefault()
        const url = 'http://localhost:3000/uploadFile';
        const formData = new FormData();
        formData.append('filename', uid ?? '');
        formData.append('file', file ?? '');

        const data = await API.uploadFile(formData).then((x) => {
            window.location.reload();
        });

        
    }

    return (
        <div className="container">
            <h2>Prześlij plik</h2>
            <form onSubmit={handleSubmit}>
                <label>
                Wybierz plik:<br/>
                <input type="file" onChange={handleChange} /><br/>
                <input type="submit" value="Upload"/>
                </label>
            </form>
        </div>
    );
}

export default FileUploader;
