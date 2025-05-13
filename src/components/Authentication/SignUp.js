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
import { Utensils, ShieldCheck, Users, Award } from 'lucide-react';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function SignUp() {
  const [userRole, setUserRole] = useState("user");
  const [resData, setResData] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [animationProgress, setAnimationProgress] = useState(0);
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationProgress(100);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const schema = yup.object().shape({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
  });

  async function postSignUpInfo(inputData) {
    setLoading(true);
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
        setSnackbarMessage(response.data.message || "Registration failed");
        setSnackbarOpen(true);
      }

      if (response.data !== null && response.data.status === "success") {
        // Show success message before redirecting
        setSnackbarMessage("Account created successfully! Redirecting to login...");
        setSnackbarOpen(true);
        
        // Redirect after a brief delay to show the success message
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred during signup");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }

  async function postSignUpInfoWithGoogle(inputData) {
    setLoading(true);
    try {
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
      
      const response = await axios({
        method: "post",
        url: "/api/v1/users/save",
        data: datas,
      });

      if (response.data !== null) {
        setResData(response.data);
      }

      if (response.data !== null && response.data.status === "fail") {
        setSnackbarMessage(response.data.message || "Registration with Google failed");
        setSnackbarOpen(true);
      }

      if (response.data !== null && response.data.status === "success") {
        // Show success message before redirecting
        setSnackbarMessage("Account created successfully! Redirecting to login...");
        setSnackbarOpen(true);
        
        // Redirect after a brief delay
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred during signup with Google");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }

  const handleAuth = (data) => {
    postSignUpInfoWithGoogle(data);
  };

  // Animated background elements for decoration
  const renderDecorations = () => (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated circles */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full"
          style={{
            backgroundColor: i % 2 === 0 ? 'rgba(118, 181, 197, 0.08)' : 'rgba(6, 57, 112, 0.06)',
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
            border: '2px solid rgba(6, 57, 112, 0.05)',
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
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      {/* Background decorations */}
      {renderDecorations()}

      {/* Main card */}
      <div 
        className="bg-white rounded-2xl shadow-xl w-full max-w-5xl flex flex-col md:flex-row overflow-hidden"
        style={{
          opacity: animationProgress / 100,
          transform: `translateY(${(1 - animationProgress / 100) * 20}px)`,
          transition: 'transform 1s, opacity 1s',
          transitionDelay: '0.2s'
        }}
      >
        {/* Left side - Sign up form */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center gap-6">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-blue-900">Create Your Account</h1>
            <p className="text-slate-500 mt-1">Join Skill Connect and start showcasing your expertise</p>
          </div>

          {/* Google Auth */}
          <div className="w-full">
            <GoogleAuth handleAuth={handleAuth} />
          </div>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <div className="mx-4 text-sm text-slate-500 font-medium">OR CONTINUE WITH EMAIL</div>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          {/* Form */}
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
              errors,
            }) => (
              <Form
                noValidate
                onSubmit={handleSubmit}
                className="flex flex-col gap-4"
              >
                <Row className="mb-0">
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="signUpFirstName">
                      <Form.Label className="text-blue-900 font-medium text-sm mb-1 block">First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={values.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.firstName && errors.firstName}
                        placeholder="John"
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                      />
                      <Form.Control.Feedback type="invalid" className="text-xs mt-1">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group controlId="signUpLastName">
                      <Form.Label className="text-blue-900 font-medium text-sm mb-1 block">Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={values.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.lastName && errors.lastName}
                        placeholder="Doe"
                        className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                      />
                      <Form.Control.Feedback type="invalid" className="text-xs mt-1">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group controlId="signUpEmail" className="mb-3">
                  <Form.Label className="text-blue-900 font-medium text-sm mb-1 block">Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.email && errors.email}
                    placeholder="you@example.com"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  />
                  <Form.Control.Feedback type="invalid" className="text-xs mt-1">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="signUpPassword" className="mb-3">
                  <Form.Label className="text-blue-900 font-medium text-sm mb-1 block">Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.password && errors.password}
                    placeholder="••••••••"
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
                  />
                  <Form.Control.Feedback type="invalid" className="text-xs mt-1">
                    {errors.password}
                  </Form.Control.Feedback>
                  <div className="mt-1 text-xs text-slate-500">
                    Password must be at least 6 characters long
                  </div>
                </Form.Group>

                <div className="mt-2">
                  <Form.Group className="mb-4">
                    <Form.Check
                      id="terms-checkbox"
                      type="checkbox"
                      label={
                        <span className="text-sm text-slate-600">
                          I agree to the <a href="/terms" className="text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="/privacy" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
                        </span>
                      }
                      className="user-select-none"
                    />
                  </Form.Group>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="mt-2 bg-blue-900 hover:bg-blue-800 border-0 rounded-lg py-3 font-bold text-white flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account <BsFillPersonPlusFill />
                    </>
                  )}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-slate-600 mb-3">Already have an account?</p>
                  <Link to='/signin' className="text-decoration-none">
                    <Button 
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg py-2 px-5 font-medium transition-all w-full"
                    >
                      Sign In to Your Account
                    </Button>
                  </Link>
                </div>
              </Form>
            )}
          </Formik>
        </div>

        {/* Right side - Branding panel */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-50 to-blue-100 p-8 flex-col justify-center items-center text-blue-900 relative overflow-hidden border-l border-slate-100">
          {/* Decorative circles */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-96 h-96 rounded-full bg-blue-900/5 -top-20 -right-20"></div>
            <div className="absolute w-96 h-96 rounded-full bg-cyan-500/5 -bottom-20 -left-20"></div>
            
            {/* Additional decorative elements */}
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-blue-900/[0.03]"
                style={{
                  width: `${(i + 2) * 100}px`,
                  height: `${(i + 2) * 100}px`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                }}
              />
            ))}
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-md">
            <div className="mb-3 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-900">
              <Utensils size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Skill Connect</h2>
            <p className="text-blue-700 mb-6 text-lg">Discover opportunities and connect with professionals in your field.</p>
            
            {/* Benefits cards */}
            <div className="grid gap-4 mt-8">
              <div className="bg-white/70 p-4 rounded-lg text-left shadow-sm flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Users size={20} className="text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Connect With Others</p>
                  <p className="text-sm text-slate-600">Build your professional network with like-minded individuals</p>
                </div>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg text-left shadow-sm flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Award size={20} className="text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Showcase Your Skills</p>
                  <p className="text-sm text-slate-600">Display your expertise and gain recognition in your field</p>
                </div>
              </div>
              
              <div className="bg-white/70 p-4 rounded-lg text-left shadow-sm flex items-start gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <ShieldCheck size={20} className="text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 mb-1">Secure Platform</p>
                  <p className="text-sm text-slate-600">Your data is protected with industry-standard security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} Skill Connect. All rights reserved.
      </div>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarMessage.includes("successfully") ? "success" : "error"} 
          sx={{ 
            width: "100%",
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SignUp;