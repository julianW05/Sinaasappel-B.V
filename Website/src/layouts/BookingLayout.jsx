import { useState } from "react";
import { collection, addDoc, updateDoc, query, where, getDocs, doc } from "firebase/firestore";
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

    // Check aantal mensen
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

        // Alleen op zaterdag aankomen
        if (dayOfWeek === 6) {
          setBookingData((prevData) => ({
            ...prevData,
            arrivalDate: value,
          }));
          setErrorMessage(""); 
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

      // Alleen op zaterdag vertrekken en minimaal 1 week boeken 
      if (dayOfWeek === 6 && value > arrivalDate) {
        setBookingData((prevData) => ({
          ...prevData,
          leavingDate: value,
        }));
        setErrorMessage(""); 
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

  // Formulier stappen
  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };
  const handlePreviousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  // Check of email al bestaat
  const checkEmailExists = async (email) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);
  
      return !querySnapshot.empty;
    } catch (error) {
      throw error;
    }
  };

  // User inloggen
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

  // Nieuwe boeking aanmaken
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
  
    if (step === 1) {
      if (bookingData.numberOfPeople < 1 || bookingData.numberOfPeople > 6) {
        setErrorMessage("Aantal mensen moet tussen 1 en 6 liggen.");
        return;
      }

      handleNextStep();
    }
  
    if (step === 2) {
      if (isLogin === true) {
        // Loin bestaande gebruiker
        const { email, password } = loginData;
        try {
          // Check login
          const userCredentials = await loginUser(email, password);
          const userID = userCredentials.userID;
  
          // Nieuwe boeking aanmaken
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

          // BoekingID in standplaats zetten
          const standplaatsQuery = query(collection(db, "standplaatsen"), where("nummer", "==", parseInt(bookingData.standplaats)));
          const standplaatsSnapshot = await getDocs(standplaatsQuery);
          if (!standplaatsSnapshot.empty) {
            const standplaatsDoc = standplaatsSnapshot.docs[0];
            const standplaatsRef = doc(db, "standplaatsen", standplaatsDoc.id);
            const standplaatsData = standplaatsDoc.data();
            const updatedBoekingen = standplaatsData.boekingen || [];
            updatedBoekingen.push(bookingRef.id);
            await updateDoc(standplaatsRef, { boekingen: updatedBoekingen });
          } else {
            setErrorMessage("Deze standplaats bestaat niet.");
            return;
          }

          // Reset bookingData
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
  
          // Volgende stap	
          handleNextStep();
          setErrorMessage("Dankjewel voor de boeking");
          return
        } catch (error) {
          console.log(error)
          setErrorMessage("Email of wachtwoord incorrect.");
          return;
        }
      } else {
        // Registreer nieuwe gebruiker
        const { email, password } = bookingData.mainBooker;
  
        try {
          const isEmailExists = await checkEmailExists(email);
  
          if (isEmailExists) {
            setErrorMessage("E-mailadres bestaat al.");
            return; 
          } else {
            // Maak nieuwe user aan
            const usersRef = collection(db, "users");
            const newUser = {
              name: bookingData.mainBooker.firstName + " " + bookingData.mainBooker.lastName,
              email: bookingData.mainBooker.email,
              rol: "klant",
              password: bookingData.password,
            };
            const userRef = await addDoc(usersRef, newUser);
            const userID = userRef.id;
  
            // Maak boeking aan
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
  
            // Reset bookingdata
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

            // Volgende stap
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