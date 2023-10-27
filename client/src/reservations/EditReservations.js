import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { loadCurrentRes, updateRes } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import ReservationsForm from "./ReservationsForm";

function EditReservations({ setDate }) {
  const history = useHistory();
  const params = useParams();

  const [reservation, setReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  const [error, setError] = useState(null);

  function loadDashboard() {
    const abortController = new AbortController();
    setError(null);
    loadCurrentRes(params.reservation_id, abortController.signal)
      .then((data) => {
        data.reservation_date = formatAsDate(data.reservation_date);
        return data;
      })
      .then(setReservation)
      .catch(setError);
    return () => abortController.abort();
  }

  useEffect(loadDashboard, [params.reservation_id]);

  const submitHandler = (event) => {
    event.preventDefault();
    reservation.people = Number(reservation.people); //to change string to number so that it fits the api criteria
    updateRes(reservation, params.reservation_id)
      .then(() => {
        setDate(reservation.reservation_date);
        history.push(`/reservations`);
      })
      .catch((error) => setError(error));
  };

  return (
    <>
    <div className="mt-3 border p-1 rounded text-center text-white bg-info">
    <h2>Editing reservation id-{reservation.reservation_id} </h2>
  </div>
    <ReservationsForm
      submitHandler={submitHandler}
      reservation={reservation}
      setReservation={setReservation}
      error={error}
      ErrorAlert={ErrorAlert}
    />
    </>
  );
}

export default EditReservations;
