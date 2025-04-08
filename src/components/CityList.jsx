import React from "react";
import styles from "./CityList.module.css";
import CityItem from "./CityItem";
import { useCities } from "../contexts/CitiesContext";
import Message from "./Message";

export default function CityList() {
  const { cities, selectedCity } = useCities();

  if (cities.length < 1)
    return (
      <Message message="You haven't visited any city yet, click on map to get started 😊" />
    );

  return (
    <div className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} selectedCity={selectedCity} key={city.id} />
      ))}
    </div>
  );
}
