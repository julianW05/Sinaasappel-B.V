import { useState } from "react";
import { collection, addDoc, updateDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase-Config";

import BookingForm from "../components/booking/BookingForm";
import LoginForm from "../components/booking/LoginForm";
import RegisterForm from "../components/booking/RegisterForm";


export default function Booking() {
  const [step, setStep] = useState(1);

  // Booking data
  const [bookingData, setBookingData] = useState({
    numberOfPeople: 1,
    mainBooker: {
      firstName: "",
      lastName: "",
      age: "",
      email: "",
      phoneNumber: "",
    },
    otherPeople: [],
    arrivalDate: "",
    leavingDate: "",
    password: "",
    confirmPassword: "",
    standplaats: "",
  });

  // Login data
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  // Error message
  const [errorMessage, setErrorMessage] = useState("");

  // Login helper
  let isLogin = false;

  const setLogin = () => {
    isLogin = true;
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "numberOfPeople") {
      const numberOfPeople = parseInt(value);
      setBookingData((prevData) => {
        const otherPeople = Array.from({ length: numberOfPeople - 1 }, () => ({}));
        return {
          ...prevData,
          numberOfPeople,
          otherPeople,
        };
      });
    } else if (name.startsWith("mainBooker")) {
      const mainBookerField = name.split(".")[1];
      setBookingData((prevData) => ({
        ...prevData,
        mainBooker: {
          ...prevData.mainBooker,
          [mainBookerField]: value,
        },
      }));
    } else if (name.startsWith("person")) {
      const fieldParts = name.split(".");
      const personIndex = parseInt(fieldParts[0].split("-")[1]) - 1;
      const personField = fieldParts[1];
      setBookingData((prevData) => {
        const updatedOtherPeople = [...prevData.otherPeople];
        updatedOtherPeople[personIndex] = {
          ...updatedOtherPeople[personIndex],
          [personField]: value,
        };
        return {
          ...prevData,
          otherPeople: updatedOtherPeople,
        };
      });
    } else if (name === "arrivalDate") {
      const today = new Date().toISOString().split("T")[0];
      if (value >= today) {
        const selectedDate = new Date(value);
        const dayOfWeek = selectedDate.getDay();

        if (dayOfWeek === 6) {
          // Saturday, update the arrivalDate
          setBookingData((prevData) => ({
            ...prevData,
            arrivalDate: value,
          }));
          setErrorMessage(""); // Clear any previous error message
        } else {
          setErrorMessage("Je kunt alleen op zaterdag aankomen.");
        }
      } else {
        setErrorMessage("Aankomstdatum moet vandaag of later zijn.");
      }
    } else if (name === "leavingDate") {
      const { arrivalDate } = bookingData;
      const selectedDate = new Date(value);
      const dayOfWeek = selectedDate.getDay();

      if (dayOfWeek === 6 && value > arrivalDate) {
        // Saturday and after arrival date, update the leavingDate
        setBookingData((prevData) => ({
          ...prevData,
          leavingDate: value,
        }));
        setErrorMessage(""); // Clear any previous error message
      } else {
        setErrorMessage("Vertrekdatum moet een zaterdag zijn en na de aankomstdatum liggen.");
      }
    } else {
      setBookingData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }

    if (step === 2 && name.startsWith("login")) {
      const loginField = name.split(".")[1];
      setLoginData((prevData) => ({
        ...prevData,
        [loginField]: value,
      }));
    }
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const checkEmailExists = async (email) => {
    try {
      // Initialize Firebase Firestore
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
  
      return !querySnapshot.empty; // Email exists if querySnapshot is not empty
    } catch (error) {
      throw error;
    }
  };

  const loginUser = async (email, password) => {
    const q = query(
      collection(db, "users"),
      where("email", "==", email),
      where("password", "==", password)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      for (const doc of querySnapshot.docs) {
        const userID = doc.id;
        return { userID };
      }
    } else {
      setErrorMessage("Email of wachtwoord incorrect.");
    }
  };

  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
  
    if (step === 1) {
      // Validation for Step 1
      if (bookingData.numberOfPeople < 1 || bookingData.numberOfPeople > 6) {
        setErrorMessage("Aantal mensen moet tussen 1 en 6 liggen.");
        return;
      }

      handleNextStep();
    }
  
    if (step === 2) {
      if (isLogin === true) {
        // Login form submission
        const { email, password } = loginData;
        try {
          const userCredentials = await loginUser(email, password);
          const userID = userCredentials.userID;
  
          // Step 3: Update booking document with the userID
          const bookingsRef = collection(db, "boekingen");
          const newBooking = {
            "arrive-date": bookingData.arrivalDate,
            "leaving-date": bookingData.leavingDate,
            userID: userID,
            "standplaats-nummer": bookingData.standplaats,
            "aantal-personen": bookingData.numberOfPeople,
            "hoofdboeker": {
              "voornaam": bookingData.mainBooker.firstName,
              "achternaam": bookingData.mainBooker.lastName,
              "leeftijd": bookingData.mainBooker.age,
              "email": bookingData.mainBooker.email,
              "telefoonnummer": bookingData.mainBooker.phoneNumber,
            },
            "andere-personen": bookingData.otherPeople.map((person) => ({
              "voornaam": person.firstName,
              "achternaam": person.lastName,
              "leeftijd": person.age,
            })),
          };
          const bookingRef = await addDoc(bookingsRef, newBooking);
  
          // Reset bookingData and loginData states
          setBookingData({
            numberOfPeople: 1,
            mainBooker: {
              firstName: "",
              lastName: "",
              age: "",
              email: "",
              phoneNumber: "",
            },
            otherPeople: [],
            arrivalDate: "",
            leavingDate: "",
            password: "",
            confirmPassword: "",
            standplaats: "",
          });
          setLoginData({
            email: "",
            password: "",
          });
  
          // Move to the next step
          handleNextStep();
          setErrorMessage("Dankjewel voor de boeking");
          return
        } catch (error) {
          console.log(error)
          setErrorMessage("Email of wachtwoord incorrect.");
          return;
        }
      } else {
        // Register form submission
        const { email, password } = bookingData.mainBooker;
  
        try {
          // Check if the email already exists in the database
          // If it exists, display an error message
          // If it doesn't exist, create a new user and update the booking document with the new userID
  
          // Example code (replace with your Firebase authentication logic)
          const isEmailExists = await checkEmailExists(email);
  
          if (isEmailExists) {
            setErrorMessage("E-mailadres bestaat al.");
            return; // Stay on step 2 if email already exists
          } else {
            // Register the user using email and password
            const usersRef = collection(db, "users");
            const newUser = {
              name: bookingData.mainBooker.firstName + " " + bookingData.mainBooker.lastName,
              email: bookingData.mainBooker.email,
              rol: "klant",
              password: bookingData.password,
            };
            const userRef = await addDoc(usersRef, newUser);
            const userID = userRef.id;
  
            // Step 3: Update booking document with the userID
            const bookingsRef = collection(db, "boekingen");
            const newBooking = {
              "arrive-date": bookingData.arrivalDate,
              "leaving-date": bookingData.leavingDate,
              userID: userID,
              "standplaats-nummer": bookingData.standplaats,
              "aantal-personen": bookingData.numberOfPeople,
              "hoofdboeker": {
                "voornaam": bookingData.mainBooker.firstName,
                "achternaam": bookingData.mainBooker.lastName,
                "leeftijd": bookingData.mainBooker.age,
                "email": bookingData.mainBooker.email,
                "telefoonnummer": bookingData.mainBooker.phoneNumber,
              },
              "andere-personen": bookingData.otherPeople.map((person) => ({
                "voornaam": person.firstName,
                "achternaam": person.lastName,
                "leeftijd": person.age,
              })),
            };
            const bookingRef = await addDoc(bookingsRef, newBooking);
  
            // Reset bookingData and loginData states
            setBookingData({
              numberOfPeople: 1,
              mainBooker: {
                firstName: "",
                lastName: "",
                age: "",
                email: "",
                phoneNumber: "",
              },
              otherPeople: [],
              arrivalDate: "",
              leavingDate: "",
              password: "",
              confirmPassword: "",
              standplaats: "",
            });
            setLoginData({
              email: "",
              password: "",
            });

            // Move to the next step
            handleNextStep();
            setErrorMessage("Dankjewel voor de boeking");
            return
          }
        } catch (error) {
          console.log(error);
          setErrorMessage("Fout bij het registreren. Probeer opnieuw.");
        }
      }
    }
  };

  return (
    <div className="main_content">
      <h1>Boeking</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {step === 1 && (
        <BookingForm
          bookingData={bookingData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
        />
      )}

      {step === 2 && (
        <>
          <LoginForm
            loginData={loginData}
            handleInputChange={handleInputChange}
            handlePreviousStep={handlePreviousStep}
            handleSubmit={handleSubmit}
            setLogin = {setLogin}
          />
          <RegisterForm
            bookingData={bookingData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handlePreviousStep={handlePreviousStep}
          />
        </>
      )}
    </div>
  );
}