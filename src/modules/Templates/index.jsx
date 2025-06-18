import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { API_URL } from '../../config';

const TemplateWrapper = () => {
    const navigate = useNavigate()
    const [templates, setTemplates] = useState(null);
    const [filtered, setFiltered] = useState(null)
    const [type, setSelectedType] = useState("all");
    const [searchLists, setSearchedLists] = useState(null)

  
    useEffect(() => {
      const getAllUsers = async () => {
        try {
          const res = await axios.get(`${API_URL}/admin/templates`);
          if(res.data.status == 'failed') {
            setTemplates(null)
            return
          }
          setTemplates(res.data)
          setFiltered(res.data)
          setSearchedLists(res.data)
        } catch (error) {
            console.log(error)
        }
      };
        getAllUsers();
    }, []);
    


    const deleteTemplate = async (id, type) => {
        try {
            const res = await axios.delete(`${API_URL}/admin/templates/delete/${type}/${id}`);
            if(res.data.status == 'failed') {
              setTemplates(null)
              return
            }
            setTemplates(res.data.data)
            setTimeout(() => {
                window.location.reload()
            }, 500)
            toast.success('Template deleted successfully')
            console.log(res.data.data)
          } catch (error) {
              console.log(error)
          }
    }

    const handleChange = (event) => {
        setSelectedType(event.target.value);
        const filterTemplate = templates.filter((template) => template.type === event.target.value);
        if(filterTemplate.length !== 0) {
            setFiltered(filterTemplate);
            setSearchedLists(filterTemplate);
        } else if(event.target.value == 'all'){
            setSearchedLists(templates);
            setFiltered(templates)
        } else {
            setFiltered([])
        }
    };

    const setDefault = async ({ type, _id }) => {
        try {
            const res = await axios.patch(`${API_URL}/admin/templates/${type}/${_id}`);
            if(res.data.status == 'failed') {
              return
            }
            toast.success('Template set as default')
            setTimeout(() => {
                window.location.reload()
            }, 1000)
            console.log(res.data)
          } catch (error) {
              console.log(error)
          }
    }

    const handleSearch = (value) => {
        if(!value || value.trim() === '') {
            setSearchedLists(filtered)
            return
        }
        const filterSearch = filtered.filter((template) => {
            if(template.message.toLowerCase().includes(value.toLowerCase())) {
                return template
            }
        })
        setSearchedLists(filterSearch)

    }

  return (
      <div>

          <section className="testimonial-section mt-[24px]">
              <div className="">
                      <div className="flex justify-between ">
                          <span className='text-3xl text-black font-bold'>Templates</span>
                          <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800" onClick={() => navigate('/admin/templates/create')}>Create</button>
                      </div>
                        <div className='flex justify-center'>
                            <select
                                style={{ border: '1px solid black' }}
                                id="fruit-select"
                                defaultValue={'all'}
                                onChange={handleChange}
                            >
                                <option value="all">All</option>
                                <option value="birthday">Birthday</option>
                                <option value="anniversary">Anniversary</option>
                            </select>
                        </div>
                        <div className='pt-4 flex justify-center'>
                            <input type={'text'} onChange={(e) => handleSearch(e.target.value)} className="border p-2 w-[50%]" placeholder='search templates' />
                        </div>
                      <div className="container d-flex justify-content-center">

                          {searchLists?.length !== 0 ? <ul className="list-group mt-5 text-white min-w-[360px] w-full">
                              {searchLists?.map((template, i) => <li key={i} className="list-group-item d-flex justify-content-between align-content-center">
                                  <div className="flex">
                                      <img src="https://img.icons8.com/color/100/000000/folder-invoices.png" style={{ objectFit: 'contain' }} width="40" />
                                      <div className="ml-2 w-[75%]">
                                          <h6 className="mb-0 !text-[20px] !font-semibold">{template.message}</h6>
                                          <div className="about">
                                              <span className='text-black text-base'>Type: {template.type}</span>
                                          </div>
                                      </div>
                                  </div>
                                  <div className="overlay-quote flex flex-wrap flex-col justify-between ">
                                    <i onClick={() => deleteTemplate(template?._id, template?.type)} style={{top:0, color: "rgb(213, 39, 39)", paddingLeft: "60px",paddingRight: "10px"}} className="fas fa-trash cursor-pointer"></i>
                                    {!template?.isDefault ? <span className='text-blue-600 cursor-pointer' onClick={() => setDefault(template)}>set default</span> : <span className='text-gray-600 '>(default)</span>}
                                  </div>
                              </li>)}
                              </ul>: 
                              <div className='flex justify-center !font-bold !text-2xl'>
                                No Template Found for {type}
                              </div>
                              }

                      </div>
              </div>
          </section>
      </div>
  )
}

export default TemplateWrapper