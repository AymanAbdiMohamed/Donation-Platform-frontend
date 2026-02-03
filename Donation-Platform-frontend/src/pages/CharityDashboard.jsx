import { useEffect, useState } from "react";

function CharityDashboard({ charityId }) {
  const [donations, setDonations] = useState([]);
  const [stories, setStories] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [newStory, setNewStory] = useState({ title: "", content: "" });}