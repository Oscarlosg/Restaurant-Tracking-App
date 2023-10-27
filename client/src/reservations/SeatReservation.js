import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, readReservation, updateTable } from "../utils/api";

function SeatReservation({
  reservationsError,
  setReservationsError,
  tables,
  setTables,
  tablesError,
  setTablesError,
  date,
}) {
  const params = useParams();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadDashboard, [params.reservation_id]);
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    readReservation(params.reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationsError);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  const [currentTable, setCurrentTable] = useState({ table_id: "null" });
  const [reservation, setReservation] = useState({});
  const [error, setError] = useState(null);
  const [isNull, setIsNull] = useState();

  function mapAvailableTables() {
    return tables.map((table, index) => {
      return (
        <option key={index} value={table.table_id}>
          {table.table_name} - {table.capacity}
        </option>
      );
    });
  }

  const handleChange = (event) => {
    const { target } = event;
    const value = target.value;
    const foundTable = tables.find((table) => (table.table_id = value));
    setCurrentTable({
      table_id: foundTable.table_id,
      reservation_id: params.reservation_id,
    });
  };

  const history = useHistory();

  const submitHandler = (event) => {
    event.preventDefault();
    if (currentTable.table_id === "null") {
      setIsNull(true);
    } else {
      updateTable(currentTable)
        .then(() => {
          history.push("/reservations");
        })
        .catch((error) => setError(error));
    }
  };

  return (
    <>
      <h2>
        Seating {reservation.first_name} {reservation.last_name}
      </h2>
      <form onSubmit={submitHandler} name="firstName">
        <h3>Available tables</h3>
        <select name="table_id" onChange={handleChange}>
          <option value="null">None</option>
          {tables.length > 0 ? mapAvailableTables() : "Loading..."}
        </select>
        <button className="btn btn-primary ml-1 mr-1" type="submit">
          Seat
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => history.push("/dashboard")}
        >
          cancel
        </button>
      </form>
      <ErrorAlert error={error} />
      {isNull ? (
        <div className="alert alert-danger m-2">Please select a table</div>
      ) : null}
    </>
  );
}

export default SeatReservation;
