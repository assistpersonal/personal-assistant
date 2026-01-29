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
    const [isLoading, setIsLoading] = useState(true);

  
    useEffect(() => {
      const getAllTemplates = async () => {
        setIsLoading(true);
        try {
          const res = await axios.get(`${API_URL}/admin/templates`);
          if(res.data.status === 'failed') {
            setTemplates([])
            setFiltered([])
            setSearchedLists([])
            toast.error('Failed to fetch templates')
            return
          }
          setTemplates(res.data)
          setFiltered(res.data)
          setSearchedLists(res.data)
        } catch (error) {
            console.log(error)
            toast.error('Error fetching templates')
            setTemplates([])
            setFiltered([])
            setSearchedLists([])
        } finally {
            setIsLoading(false);
        }
      };
        getAllTemplates();
    }, []);
    


    const deleteTemplate = async (id, type) => {
        try {
            const res = await axios.delete(`${API_URL}/admin/templates/delete/${type}/${id}`);
            if(res.data.status === 'failed') {
              toast.error('Failed to delete template')
              return
            }
            // Update state instead of reloading page
            const updatedTemplates = templates.filter(template => template._id !== id)
            setTemplates(updatedTemplates)
            setFiltered(updatedTemplates)
            setSearchedLists(updatedTemplates)
            toast.success('Template deleted successfully')
          } catch (error) {
              console.log(error)
              toast.error('Error deleting template')
          }
    }

    const handleChange = (event) => {
        setSelectedType(event.target.value);
        
        // Add null check for templates
        if (!templates || templates.length === 0) {
            setFiltered([])
            setSearchedLists([])
            return
        }
        
        if(event.target.value === 'all'){
            setFiltered(templates);
            setSearchedLists(templates);
        } else {
            const filterTemplate = templates.filter((template) => template.type === event.target.value);
            setFiltered(filterTemplate);
            setSearchedLists(filterTemplate);
        }
    };

    const setDefault = async ({ type, _id }) => {
        try {
            const res = await axios.patch(`${API_URL}/admin/templates/${type}/${_id}`);
            if(res.data.status === 'failed') {
              toast.error('Failed to set template as default')
              return
            }
            
            // Update state instead of reloading page
            const updatedTemplates = templates.map(template => ({
                ...template,
                isDefault: template._id === _id
            }))
            
            setTemplates(updatedTemplates)
            setFiltered(updatedTemplates)
            setSearchedLists(updatedTemplates)
            toast.success('Template set as default')
          } catch (error) {
              console.log(error)
              toast.error('Error setting template as default')
          }
    }

    const handleSearch = (value) => {
        if(!value || value.trim() === '') {
            setSearchedLists(filtered || [])
            return
        }
        
        // Add null check for filtered
        if (!filtered || filtered.length === 0) {
            setSearchedLists([])
            return
        }
        
        const filterSearch = filtered.filter((template) => {
            return template.message && template.message.toLowerCase().includes(value.toLowerCase())
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
                        
                        {/* Quantity Display */}
                        {!isLoading && templates && (
                            <div className='flex justify-center pt-2'>
                                <div className='bg-gray-100 rounded-lg px-4 py-2 text-sm text-gray-700'>
                                    <span className='font-medium'>Total: {templates.length}</span>
                                    {type !== 'all' && (
                                        <span className='ml-3 font-medium'>Filtered: {filtered?.length || 0}</span>
                                    )}
                                    {searchLists && searchLists.length !== filtered?.length && (
                                        <span className='ml-3 font-medium'>Search Results: {searchLists.length}</span>
                                    )}
                                </div>
                            </div>
                        )}
                        
                      <div className="container d-flex justify-content-center">

                          {isLoading ? (
                              <div className="flex justify-center items-center py-8">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                  <span className="ml-2 text-gray-600">Loading templates...</span>
                              </div>
                          ) : (
                              <>
                                  {searchLists && searchLists.length > 0 ? <ul className="list-group mt-5 text-white min-w-[360px] w-full">
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
                              </>
                          )}

                      </div>
              </div>
          </section>
      </div>
  )
}

export default TemplateWrapper