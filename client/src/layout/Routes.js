import React, { useState } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import NewReservation from "../reservations/NewReservation";
import CreateTable from "../tables/CreateTable";
import SeatReservation from "../reservations/SeatReservation";
import SearchFeature from "../Search/SearchFeature";
import EditReservations from "../reservations/EditReservations";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */

function Routes() {
  const [date, setDate] = useState(today());
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState([]);
  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          todayDate={date}
          setDate={setDate}
          reservations={reservations}
          setReservations={setReservations}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
          tables={tables}
          setTables={setTables}
          setTablesError={setTablesError}
        />
      </Route>
      <Route path="/reservations/new">
        <NewReservation setDate={setDate} />
      </Route>
      <Route path="/tables/new">
        <CreateTable tables={tables} setTables={setTables} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation
          reservations={reservations}
          setReservations={setReservations}
          reservationsError={reservationsError}
          setReservationsError={setReservationsError}
          tables={tables}
          setTables={setTables}
          tablesError={tablesError}
          setTablesError={setTablesError}
          date={date}
        />
      </Route>
      <Route path="/search">
        <SearchFeature />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservations setDate={setDate} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
