import { useState } from "react";
import { useHistory } from "react-router";
import { createRes } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsForm from "./ReservationsForm";
export default function NewReservation({ setDate }) {
  const history = useHistory();
  const [error, setError] = useState(null);
  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  const handleChange = (event) => {
    const { target } = event;
    const value = target.value;
    setReservation({ ...reservation, [target.name]: value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    reservation.people = Number(reservation.people); //to change string to number so that it fits the api criteria
    createRes(reservation)
      .then(() => {
        setDate(reservation.reservation_date);
        history.push("/reservations");
      })
      .catch((error) => setError(error));
  };

  return (
    <>
        <div className="mt-5 border rounded text-center text-white p-1 bg-info">
    <h2>Creating reservation </h2>
  </div>
    <ReservationsForm
      submitHandler={submitHandler}
      reservation={reservation}
      setReservation={setReservation}
      handleChange={handleChange}
      error={error}
      ErrorAlert={ErrorAlert}
    />
    </>
  );
}
