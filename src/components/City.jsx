import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import { useCities } from "../contexts/CitiesContext";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const [city, setCity] = useState(null);
  const { handleSelectedCity } = useCities();
  const { id } = useParams();

  useEffect(
    function () {
      async function fetchCity() {
        const res = await fetch(`http://localhost:5000/cities?id=${id}`);
        const data = await res.json();
        setCity(data[0]);
        handleSelectedCity(id);
      }
      fetchCity();
    },
    [id]
  );

  if (!city) return <Spinner />;

  const { cityName, emoji, date, notes } = city;
  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton type="back">&larr;</BackButton>
      </div>
    </div>
  );
}

export default City;
