import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Editor } from 'primereact/editor';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { API_URL } from '../../../../../config';


const MessagePopup = ({ onClose }) => {
    const [type, setSelectedType] = useState("birthday");
    const [message, setMessage] = useState("");
    const popup = useSelector((state) => state.global.popup);
    const [templates, setTemplates] = useState(null);
    const getCurruser = useSelector((state) => state.global.user)
    const [filteredTemplates, setFilteredTemplates] = useState(null)

    console.log('user is', getCurruser)

    console.log('popup is', popup)

    useEffect(() => {
        const getAllTemplates = async () => {
            try {
              const res = await axios.get(`${API_URL}/admin/templates`);
              if(res.data.status == 'failed') {
                setTemplates(null)
                return
              }
              setTemplates(res.data)
              const findTemplate = res.data.find((template) => (template.type == type && template.isDefault))
              const templateLists = res.data.filter((template) => template.type === type)
              console.log('findtemplate', findTemplate.message)
              setMessage(findTemplate.message)
              setFilteredTemplates(templateLists.sort((a,b) => b.isDefault - a.isDefault))
              console.log('templates', templateLists)
            } catch (error) {
                console.log(error)
            }
          };
          getAllTemplates();
    }, [])

    const handleChange = (event) => {
        setSelectedType(event.target.value);
        const findTemplate = templates.find((template) => (template.type == event.target.value && template.isDefault))
        const templateLists = templates.filter((template) => template.type === event.target.value)
        setFilteredTemplates(templateLists.sort((a,b) => b.isDefault - a.isDefault))
        setMessage(templateLists?.message ?? findTemplate?.message)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!type.trim() || !message.trim()) {
          alert("Type and message cannot be empty!");
          return;
        }
        await sendWishes()
        await onClose()
        setSelectedType("");
        setMessage("");
    }

    const sendWishes = async() => {
        const payload = {
            name: popup?.state?.user?.name,
            whatsapp_number: '7871235366',
            message: message,
            senderDetails: getCurruser
        }
        console.log('payload', payload)
        try {
            const res = await axios.post(`${API_URL}/user/send-wishes`, payload);
            if (res.data.status == 'failed') {
                toast.error(res.data.message)
                return
            }
            toast.success('Message sent successfully')
        } catch (error) {
            console.log(error)
        }
    }

    const selectTemplate = (e) => {
      console.log(e.target.value)
      setMessage(e.target.value)
    }

    console.log('templates', templates)

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-xl mt-6">
    <h2 className="text-2xl font-semibold mb-4">Sending Wishes to {popup?.state?.user?.name}</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
          <label htmlFor="fruit-select">Choose a Template Type: </label>
          <select
              style={{ border: '1px solid black' }}
              id="fruit-select"
              value={type}
              defaultValue={'birthday'}
              onChange={handleChange}
          >
              <option value="birthday">Birthday</option>
              <option value="anniversary">Anniversary</option>
          </select>
      </div>
      <div>
          <label htmlFor="fruit-select">Choose Templates: </label>
          <select
              style={{ border: '1px solid black' }}
              id="fruit-select"
              onChange={(e) => selectTemplate(e)}
              className="w-full"
          >
              {filteredTemplates?.map((template) => <option key={template.id} value={template.message}>{template.message}</option>)}
          </select>
      </div>
      <div>
        <label className="block text-gray-700 font-medium">Message</label>
        <textarea
          value={message ?? ''}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your message here..."
          rows="5"
          readOnly
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {/* <div className="card">
            <Editor value={text} onTextChange={(e) => setMessage(e.htmlValue)} style={{ height: '120px' }} />
        </div> */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Send wishes
      </button>
    </form>
  </div>
  )
}

export default MessagePopup