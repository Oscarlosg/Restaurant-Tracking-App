import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ListReservations from "./ListReservations";
import { previous, next, today } from "../utils/date-time";
import ListTables from "../tables/Tables";
import useQuery from "../utils/useQuery";


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({
  todayDate,
  setDate,
  reservations,
  setReservations,
  reservationsError,
  setReservationsError,
  tables,
  setTables,
  setTablesError,
}) {
  const query = useQuery();
  const date = query.get("date") || todayDate;

  const [isLoading, setIsLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then((data) => {
        setReservations(data);
      })
      .then(() => setIsLoading(false))
      .catch((error) => console.log(error));

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  setTimeout(() => {
    setIsLoading(false);
  }, 1 * 2500);

  function areReservations() {
    if (reservations.length === 0) {
      if (isLoading) {
        return <h2>Loading...</h2>;
      } else {
        return (
          <h4 style={{ width: "96%" }} className="alert alert-primary">
            There are no reservations for this date yet...
          </h4>
        );
      }
    } else {
      return reservations.map((reservation, index) => (
        <div key={index}>
          <ListReservations
            loadDashboard={loadDashboard}
            reservation={reservation}
          />
        </div>
      ));
    }
  }

  console.log(today());

  return (
    <main style={{ display: "flex" }} className="container mt-3">
      <div>
        <div
          style={{ width: "96%" }}
          className=" border rounded bg-info p-2 mb-3 text-white"
        >
          <h1>Dashboard</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for {date}</h4>
          </div>
        </div>
        <ErrorAlert error={reservationsError} />
        {areReservations()}
        <div className="mb-2">
          <button
            className="btn btn-primary ml-4 pt-2 pb-2"
            onClick={() => {
              setDate(today());
            }}
          >
            Today
          </button>
        </div>
        <button
          className="btn btn-secondary ml-4 mr-3 mb-4 pt-2 pb-2"
          onClick={() => {
            setDate(previous(date));
          }}
        >
          Previous Date
        </button>
        <button
          className="btn btn-secondary mb-4 pt-2 pb-2"
          onClick={() => {
            setDate(next(date));
          }}
        >
          Next Date
        </button>
      </div>
      <div className="border rounded pr-4 pt-4 pb-4 bg-light">
        <ListTables loadDashboard={loadDashboard} tables={tables} />
      </div>
    </main>
  );
}

export default Dashboard;
