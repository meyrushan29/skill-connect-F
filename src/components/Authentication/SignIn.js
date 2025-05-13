import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import * as yup from "yup";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import GoogleAuth from "./googleAuth";
import { RiLoginBoxLine } from "react-icons/ri";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Utensils } from 'lucide-react';
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function SignIn() {
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

  const Google_ = () => {
    window.open("http://localhost:5000/auth/google", "_self");
  };

  async function postSignInInfoWithGoogle(inputData) {
    setLoading(true);
    try {
      let datas = {
        email: inputData.user.email,
        password: "PAF2023@@",
      };
      const response = await axios({
        method: "post",
        url: "/api/v1/users/signin",
        data: datas
      });

      if (response.data !== null && response.data.status === "fail") {
        setSnackbarMessage(response.data.message);
        setSnackbarOpen(true);
      }

      if (response.data !== null && response.data.status === "success") {
        setResData(response.data);

        localStorage.setItem("psnUserId", response.data.payload.user.id);
        localStorage.setItem("psnUserFirstName", response.data.payload.user.firstName);
        localStorage.setItem("psnUserLastName", response.data.payload.user.lastName);
        localStorage.setItem("psnUserEmail", response.data.payload.user.email);
        localStorage.setItem("psnBio", response.data.payload.user.bio);
        localStorage.setItem("psnToken", response.data.payload.token);
        navigate("/newsfeed");
      }
    } catch (error) {
      setSnackbarMessage("Authentication failed. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }
  
  const handleAuth = (data) => {
    postSignInInfoWithGoogle(data);
  };
  
  const schema = yup.object().shape({
    email: yup.string().email("Please enter a valid email").required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  async function postSignInInfo(inputData) {
    setLoading(true);
    try {
      const response = await axios({
        method: "post",
        url: "/api/v1/users/signin",
        data: {
          email: inputData.email,
          password: inputData.password,
        },
      });

      if (response.data !== null && response.data.status === "fail") {
        setSnackbarMessage(response.data.message || "Authentication failed");
        setSnackbarOpen(true);
      }

      if (response.data !== null && response.data.status === "success") {
        setResData(response.data);
        localStorage.setItem("psnUserId", response.data.payload.user.id);
        localStorage.setItem("psnUserFirstName", response.data.payload.user.firstName);
        localStorage.setItem("psnBio", response.data.payload.user.bio);
        localStorage.setItem("psnUserLastName", response.data.payload.user.lastName);
        localStorage.setItem("psnUserEmail", response.data.payload.user.email);
        localStorage.setItem("psnToken", response.data.payload.token);
        navigate("/newsfeed");
      }
    } catch (error) {
      setSnackbarMessage("Authentication failed. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  }

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
        {/* Left side - Sign in form */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 flex flex-col justify-center gap-6">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-blue-900">Sign In to Skill Connect</h1>
            <p className="text-slate-500 mt-1">Connect with professionals and showcase your skills</p>
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
            }}
            onSubmit={(values, { setSubmitting }) => {
              postSignInInfo(values);
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
                <Form.Group as={Col} controlId="signInEmail" className="mb-1">
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

                <Form.Group as={Col} controlId="signInPassword" className="mb-1">
                  <div className="flex justify-between items-center mb-1">
                    <Form.Label className="text-blue-900 font-medium text-sm block">Password</Form.Label>
                    <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      Forgot password?
                    </Link>
                  </div>
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
                </Form.Group>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="mt-2 bg-blue-900 hover:bg-blue-800 border-0 rounded-lg py-3 font-bold text-white flex items-center justify-center gap-2 transition-all"
                >
                  {loading ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign In <RiLoginBoxLine />
                    </>
                  )}
                </Button>
                
                <div className="text-center mt-4">
                  <p className="text-slate-600 mb-3">Don't have an account?</p>
                  <Link to='/signup' className="text-decoration-none">
                    <Button 
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg py-2 px-5 font-medium transition-all w-full"
                    >
                      Create a New Account
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

            {/* Animated icons */}
            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <Utensils size={32} className="text-blue-900/20" />
            </div>
            <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2">
              <Utensils size={24} className="text-blue-900/15" />
            </div>
          </div>
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-md">
            <div className="mb-3 inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-900">
              <Utensils size={28} />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Skill Connect</h2>
            <p className="text-blue-700 mb-6 text-lg">Connect with professionals, showcase your skills, and explore opportunities.</p>
            
            <div className="grid grid-cols-3 gap-3 mt-8">
              {["Discovery", "Networking", "Growth"].map((item, i) => (
                <div key={i} className="bg-white/60 p-3 rounded-lg text-center shadow-sm">
                  <p className="font-semibold text-blue-900">{item}</p>
                </div>
              ))}
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
          severity="error" 
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

export default SignIn;