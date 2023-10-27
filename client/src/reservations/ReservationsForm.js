import { useHistory } from "react-router";

function ReservationsForm({
  submitHandler,
  reservation,
  setReservation,
  error,
  ErrorAlert,
}) {
  const history = useHistory();

  const handleChange = (event) => {
    const { target } = event;
    const value = target.value;
    setReservation({ ...reservation, [target.name]: value });
  };

  return (
    <>
      <form onSubmit={submitHandler}>
        <div  className="mt-3 form-group">
          <input
          className="form-control"
            name="first_name"
            value={reservation.first_name}
            placeholder="First Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
                    className="form-control"
            name="last_name"
            value={reservation.last_name}
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
                    className="form-control"
            name="mobile_number"
            value={reservation.mobile_number}
            placeholder="Mobile Number"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
                    className="form-control"
            type="number"
            name="people"
            value={reservation.people}
            placeholder="Party Size"
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
                    className="form-control"
            name="reservation_date"
            type="date"
            value={reservation.reservation_date}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <input
                    className="form-control"
            type="time"
            name="reservation_time"
            value={reservation.reservation_time}
            onChange={handleChange}
          />
        </div>
        <div>
        <button  className="w-100 btn btn-primary mr-2 mt-2 mb-3 pt-2 pb-2" type="submit">submit</button>
        </div>
        <button className="btn w-100 btn-secondary mb-4 pt-2 pb-2" onClick={() => history.push("/dashboard")}>cancel</button>
      </form>
      <ErrorAlert error={error} />
    </>
  );
}

export default ReservationsForm;
