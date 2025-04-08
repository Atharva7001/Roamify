/* eslint-disable react/prop-types */
import React, { createContext, useState, useEffect, useContext } from "react";
import { data } from "react-router-dom";

const BASE_URL = "http://localhost:5000";
const CitiesContext = createContext();

function CitiesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleSelectedCity(city) {
    setSelectedCity(() => city);
  }

  useEffect(function () {
    async function getCities() {
      const res = await fetch(`${BASE_URL}/cities`);
      const data = await res.json();
      setCities(data);
    }
    getCities();
  }, []);

  async function createCity(city) {
    try {
      setIsLoading(true);
      if (!city) return;
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setCities((cities) => [...cities, data]);
    } catch {
      alert("There was an error creating city...");
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id) {
    try {
      setIsLoading(true);
      if (!id) return;
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      setCities((cities) => cities.filter((city) => city.id !== id));
    } catch {
      alert("There was an error deleting city...");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        handleSelectedCity,
        selectedCity,
        createCity,
        isLoading,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) throw new Error("context is used out of scope");
  return context;
}

export { CitiesProvider, useCities };
