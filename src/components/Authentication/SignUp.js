import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { BsFillPersonPlusFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import GoogleAuth from "./googleAuth";
import { Utensils } from 'lucide-react';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function SignUp() {
  const [userRole, setUserRole] = useState("user");
  const [resData, setResData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [animationProgress, setAnimationProgress] = useState(0);


  // Update Signup Coponenet   

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  let navigate = useNavigate();

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
    firstName: yup.string().required(),
    lastName: yup.string().required(),
  });

  async function postSignUpInfo(inputData) {
    console.log(inputData);
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/users/save",
        data: {
          firstName: inputData.firstName,
          lastName: inputData.lastName,
          email: inputData.email,
          password: inputData.password,
          role: userRole,
        },
      });

      if (response.data !== null) {
        setResData(response.data);
      }

      if (response.data !== null && response.data.status === "fail") {
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
      }

      if (response.data !== null && response.data.status === "success") {
        navigate("/signin");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred during signup");
      setSnackbarOpen(true);
    }
  }

  async function postSignUpInfoWithGoogle(inputData) {
    console.log(inputData.user, "user");
    let displayName = [];
    displayName = inputData.user ? inputData.user.displayName : "first name";
    let firstName = displayName;
    let lastName = " ";

    let datas = {
      firstName: firstName,
      lastName: lastName,
      email: inputData.user.email,
      password: "PAF2023@@",
      role: userRole,
    };
    console.log(datas, "datass");
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/users/save",
        data: datas,
      });

      if (response.data !== null) {
        setResData(response.data);
      }

      if (response.data !== null && response.data.status === "fail") {
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
      }

      if (response.data !== null && response.data.status === "success") {
        navigate("/signin");
      }
    } catch (error) {
      setSnackbarMessage("An error occurred during signup with Google");
      setSnackbarOpen(true);
    }

  }

  const handleAuth = (data) => {
    postSignUpInfoWithGoogle(data);
  };

  return (
    <>
      <div style={{
        minHeight: '100vh',
        background: '#F2F4F7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated background elements */}
        <div style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
        }}>
          {/* Animated food/ingredient elements */}
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                backgroundColor: 'white',
                opacity: 0.08,
                width: `${Math.random() * 300 + 50}px`,
                height: `${Math.random() * 300 + 50}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `scale(${animationProgress / 100})`,
                transition: 'transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: `${i * 0.05}s`
              }}
            />
          ))}

          
          
          {/* Kitchen utensil shapes */}
          {[...Array(5)].map((_, i) => (
            <div 
              key={`utensil-${i}`}
              style={{
                position: 'absolute',
                borderRadius: '20%',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                width: `${Math.random() * 100 + 150}px`,
                height: `${Math.random() * 100 + 150}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg) scale(${animationProgress / 100})`,
                transition: 'transform 1.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transitionDelay: `${i * 0.1 + 0.2}s`
              }}
            />
          ))}
        </div>
        

        <div style={{
          background: '#FFFFFF',
          borderRadius: '1rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '900px',
          display: 'flex',
          flexDirection: 'row',
          overflow: 'hidden',
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.2s'
        }}>
          <div style={{
            flex: 1,
            padding: '2.5rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1.5rem'
          }}>


          <div style={{
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '1.75rem',
                fontWeight: 'bold',
                color: '#212937',
                marginBottom: '0.5rem'
              }}>Create New Account</h2>
              
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Google Auth button */}
              <div>
                <GoogleAuth handleAuth={handleAuth} />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '1rem 0'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
              <div style={{ margin: '0 1rem', color: '#19304f', fontSize: '0.875rem' }}>OR</div>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e5e7eb' }} />
            </div>

            <Formik
              validationSchema={schema}
              initialValues={{
                email: "",
                password: "",
                firstName: "",
                lastName: "",
              }}
              onSubmit={(values, { setSubmitting }) => {
                postSignUpInfo(values);
                setSubmitting(false);
              }}
            >
              {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isInValid,
                errors,
              }) => (
                <Form
                  noValidate
                  onSubmit={handleSubmit}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  <Row>
                    <Form.Group as={Col} md="12" controlId="signInFirstName">
                      <Form.Label style={{ color: "#19304f", fontWeight: '500', marginBottom: '0rem' }}>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        isInvalid={touched.firstName && errors.firstName}
                        placeholder="Enter your first name"
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          width: '100%'
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your first name
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="12" controlId="signInLastName">
                      <Form.Label style={{ color: "#19304f", fontWeight: '500', marginBottom: '0rem' }}>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        isInvalid={touched.lastName && errors.lastName}
                        placeholder="Enter your last name"
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          width: '100%'
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your last name
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="12" controlId="signInEmail">
                      <Form.Label style={{ color: "#19304f", fontWeight: '500', marginBottom: '0rem' }}>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={values.email}
                        onChange={handleChange}
                        isInvalid={touched.email && errors.email}
                        placeholder="Enter your email"
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          width: '100%'
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter a valid email
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md="12" controlId="signInPassword">
                      <Form.Label style={{ color: "#19304f", fontWeight: '500', marginBottom: '0rem' }}>Password</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        isInvalid={touched.password && errors.password}
                        placeholder="Enter your password"
                        style={{
                          padding: '0.5rem',
                          borderRadius: '0.5rem',
                          border: '1px solid #d1d5db',
                          width: '100%'
                        }}
                      />
                      <Form.Control.Feedback type="invalid">
                        Please enter your password
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Row>
                  <Button 
                    type="submit" 
                    style={{ 
                      backgroundColor: '#063970',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.5rem',
                      fontWeight: 'bold',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      marginTop: '0.5rem'
                    }}
                  >
                    Sign Up <BsFillPersonPlusFill />
                  </Button>
                  
                  <div style={{ 
                    textAlign: "center", 
                    marginTop: '1rem',
                    display: 'flex',
                    justifyContent: 'center'
                  }}>
                    <Link to='/signin' style={{ textDecoration: 'none' }}>
                      <Button style={{
                        background: '#76B5C5',
                        border: 'none',
                        borderRadius: '0.5rem',
                        padding: '0.5rem 1.5rem',
                        fontWeight: 'bold'
                      }}>
                        Already have an account? Sign In
                      </Button>
                    </Link>
                  </div>
                </Form>
              )}
            </Formik>
          </div>

          {/* Right side decorative panel */}
          <div style={{
            flex: 1,
            background: '',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#063970',
            position: 'relative',
            overflow: 'hidden',
            borderLeft: '1px solid #e5e7eb'
          }}>
  
            
            
            <div style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center'
            }}>
              <h2 style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                marginBottom: '1rem'
              }}>Welcome to Skill Connect</h2>
            </div>
          </div>
        </div>
      </div>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SignUp;