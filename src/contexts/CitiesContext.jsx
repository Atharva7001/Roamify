/* eslint-disable react/prop-types */
import React, { createContext, useEffect, useContext, useReducer } from "react";

const BASE_URL = "http://localhost:5000";
const CitiesContext = createContext();

const initialState = {
  cities: [],
  selectedCity: null,
  isLoading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, cities: action.payload, isLoading: false };
    case "city/loaded":
      return { ...state, selectedCity: action.payload, isLoading: false };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        selectedCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        cities: state.cities.filter((city) => city.id !== action.payload),
        isLoading: false,
      };
    case "default":
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, selectedCity, isLoading }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function handleSelectedCity(city) {
    dispatch({ type: "city/loaded", payload: city });
  }

  useEffect(function () {
    async function getCities() {
      const res = await fetch(`${BASE_URL}/cities`);
      const data = await res.json();
      dispatch({ type: "cities/loaded", payload: data });
    }
    getCities();
  }, []);

  async function createCity(city) {
    try {
      dispatch({ type: "loading" });
      if (!city) return;
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(city),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      alert("There was an error creating city...");
    }
  }

  async function deleteCity(id) {
    try {
      dispatch({ type: "loading" });
      if (!id) return;
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });
      dispatch({ type: "city/deleted", payload: id });
    } catch {
      alert("There was an error deleting city...");
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
