import { useEffect, useState } from "react";
import CharityCard from "../components/CharityCard";

function Charities() {
  const [charities, setCharities] = useState([]);

  useEffect(() => {
    fetch("/api/charities?status=approved")
      .then((res) => res.json())
      .then((data) => setCharities(data))
      .catch((error) => console.error(error));
  }, []);}