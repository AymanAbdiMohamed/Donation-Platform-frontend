import { useEffect, useState } from "react";

function AdminDashboard() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    fetch("/api/charities")
      .then((res) => res.json())
      .then((data) => setCharities(data))
      .catch((err) => console.error(err));
  }, []);}