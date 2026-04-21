import React, { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { useNavigate, useParams } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Toast from '../Toast';
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

function UpdateJobStatus() {
  document.title = 'CPMS | Update Job Application Status';
  const navigate = useNavigate();

  const { jobId } = useParams();

  const [data, setData] = useState({});
  const [company, setCompany] = useState(null);
  // useState for load data
  const [currentUser, setCurrentUser] = useState({});

  const [loading, setLoading] = useState(true);

  // useState for toast display
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // checking for authentication
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get(`${BASE_URL}/user/detail`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => {
        setCurrentUser({
          id: res.data.id,
          first_name: res.data.first_name,
          middle_name: res.data.middle_name,
          last_name: res.data.last_name,
          email: res.data.email,
          number: res.data.number,
          role: res.data.role,
          uin: res.data.studentProfile.uin,
        });
      })
      .catch(err => {
        console.log("AddUserTable.jsx => ", err);
        setToastMessage(err);
        setShowToast(true);
      });
  }, []);

  const fetchJobDetail = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tpo/job/${jobId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      )
      setData(response.data);
    } catch (error) {
      if (error.response) {
        if (error?.response.data?.msg) setToastMessage(error.response.data.msg)
        else setToastMessage(error.message)
        setShowToast(true);
        if (error?.response?.data?.msg === "job data not found") navigate('../404');
      }
      console.log("Error while fetching details => ", error);
    }
  }

  const fetchCompanyData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/company/company-data?companyId=${data.company}`);
      setCompany(response.data.company);
    } catch (error) {
      console.log("AddCompany error while fetching => ", error);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchJobDetail();
        if (data?.company) {
          await fetchCompanyData();
        }
        setLoading(false);
      } catch (error) {
        setToastMessage("Error during fetching and applying job");
        setShowToast(true);
        console.error("Error during fetching and applying job:", error);
      }
    };

    fetchData();
  }, [currentUser?.id, data?.company, jobId]);

  return (
    <>
      {/*  any message here  */}
      < Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        message={toastMessage}
        delay={3000}
        position="bottom-end"
      />

      {
        loading ? (
          <div className="flex justify-center h-72 items-center">
            <i className="fa-solid fa-spinner fa-spin text-3xl" />
          </div>
        ) : (
          <>
            <div className="flex justify-center my-6 text-base max-sm:text-sm">
              <div className="flex flex-col gap-2 w-full max-w-3xl">
                <div className="">
                  {/* Basic Details  */}
                  <Accordion defaultActiveKey={['0']} alwaysOpen className='shadow rounded w-full max-sm:w-fit'>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Basic Details</Accordion.Header>
                      <Accordion.Body>
                        <div className="">
                          {/* company name  */}
                          <div className="flex flex-col justify-between py-2">
                            {/* Basic Info */}
                            <div className="flex justify-between">
                              <div className="space-y-4">
                                <div>
                                  <span className="text-gray-700 font-bold">Full Name: </span>
                                  <span className="text-blue-500 font-bold">
                                    {currentUser?.first_name + " "}
                                    {currentUser?.middle_name && currentUser?.middle_name + " "}
                                    {currentUser?.last_name}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-gray-700 font-bold">Email: </span>
                                  <span className="text-blue-500 font-bold">
                                    {currentUser?.email}
                                  </span>
                                </div>

                                <div>
                                  <span className="text-gray-700 font-bold">Number: </span>
                                  <span className="text-blue-500 font-bold">
                                    {currentUser?.number}
                                  </span>
                                </div>

                                {
                                  currentUser?.uin && (
                                    <div>
                                      <span className="text-gray-700 font-bold">UIN: </span>
                                      <span className="text-blue-500 font-bold">
                                        {currentUser?.uin}
                                      </span>
                                    </div>
                                  )
                                }
                                <div>
                                  <span className="text-gray-700 font-bold">Company Name: </span>
                                  <span className="text-blue-500 font-bold">
                                    {company?.companyName}
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-700 font-bold">Job Title: </span>
                                  <span className="text-blue-500 font-bold">
                                    {data?.jobTitle}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </>
        )
      }
    </>
  )
}

export default UpdateJobStatus
