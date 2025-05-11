import React from "react";
import {HashRouter, Routes, Route} from "react-router-dom";


import HomePage from "./HomePage";
import NotFoundPage from "./NotFoundPage";
import SignIn from "./Authentication/SignIn";
import SignUp from "./Authentication/SignUp";
import NewsFeed from "./Navbar/NewsFeed";
import NewsFeedContent from "./PostManagement/NewsFeedContent";
import FollowingList from "./FollowComponents/FollowingList";
import FollowerList from "./FollowComponents/FollowerList";
import Profile from "./Profile";
import MyProfile from "./MyProfile/MyProfile";
import AllAccounts from "./FollowComponents/AllAccounts";
import UnauthorizedPage from "./Authentication/UnauthorizedPage";
import SkilllinkLanding from "./SkilllinkLanding";
import ProgressTracker from "../components/Progress/ProgressTracker";
import ProgressDashboard from "../components/Progress/ProgressDashboard";
import EducationalContentPage from "./EducationalContent/EducationalContentPage";
import SocialNetworkPage from "./FollowComponents/SocialNetworkPage";

const userId = localStorage.getItem("psnUserId");

function AppContainer() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/s" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/newsfeed" element={<NewsFeed />}>
          <Route path="" element={<NewsFeedContent />} />
          <Route path="following" element={<FollowingList />} />
          <Route path="follower" element={<FollowerList />} />
          <Route path="profile" element={<Profile />} />
          <Route path="myprofile" element={<MyProfile />} />
          <Route path="allaccounts" element={<AllAccounts />} />
          <Route path="progress" element={<ProgressTracker userId={userId} />} />
          <Route path="dashboard" element={<ProgressDashboard userId={userId} />} />
          <Route path="education" element={<EducationalContentPage />} />
          <Route path="all" element={<SocialNetworkPage />} />  
        </Route>
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />        
      </Routes>
    </HashRouter>
  );
}

export default AppContainer;
