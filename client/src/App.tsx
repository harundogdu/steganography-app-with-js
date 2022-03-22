import React from 'react';
import axios from "axios";


function App() {
    const [encryptedText, setEncryptedText] = React.useState('');
    const [file, setFile] = React.useState(null);
    const [status, setStatus] = React.useState(0);

    const handleEncrypt = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (!file || !encryptedText) {
            alert('Please fill out all fields');
            return;
        }

        const LOCALHOST = process.env.REACT_APP_API_URL;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('encryptedText', encryptedText);

        axios.post(`${LOCALHOST}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                setStatus(res.status);
                setEncryptedText('');
                setFile(null);
            })
            .catch(err => {
                setStatus(err.response.status);
            })
    }
    const handleDecrypt = (e: React.FormEvent<HTMLButtonElement>) => {
    }

    const checkStatus = () => {
        if (status === 200) {
            return (
                <div className="bg-green-500 text-white p-4 my-2 rounded" role="alert">
                    File successfully uploaded!
                </div>
            )
        } else {
            return (
                <div className="bg-red-500 text-white p-4 my-2 rounded" role="alert">
                    File upload failed!
                </div>
            )
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {status !== 0 && checkStatus()}
            <>
                <div className="flex flex-col justify-center mb-4 items-center space-y-4">

                <textarea
                    name="encryptedText"
                    id="encryptedText"
                    placeholder="Enter ur hiding message"
                    value={encryptedText}
                    onChange={(e) => setEncryptedText(e.target.value)}
                    className={`w-full h-32 p-2 border-2 border-gray-400 rounded focus:outline-none focus:border-blue-500 ${encryptedText ? 'border-blue-500' : ''}`}
                />

                    <input
                        id="file"
                        name="file"
                        type="file"
                        onChange={(e: any) => setFile(e.target.files[0])}
                        className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                    />

                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleEncrypt}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Encrypt & Upload
                    </button>
                    <button
                        onClick={handleDecrypt}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                        Decrypt & Download
                    </button>
                </div>
            </>
        </div>
    );
}

export default App;
