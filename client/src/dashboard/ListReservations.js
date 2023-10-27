import { updateRes } from "../utils/api";

function ListReservations({ reservation, loadDashboard }) {
  function seatButton() {
    if (reservation.status === "booked") {
      return (
        <a href={`/reservations/${reservation.reservation_id}/seat`}>
          <button className="btn btn-dark mb-3 mr-2">Seat</button>
        </a>
      );
    } else return null;
  }

  function cancelHandler(event) {
    event.preventDefault();
    const cancelledRes = { ...reservation, status: "cancelled" };
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      ) === true
    ) {
      updateRes(cancelledRes, reservation.reservation_id)
        .then(() => loadDashboard())
        .catch((error) => console.log("error", error));
    }
  }

  return (
    <div className="border rounded p-3 mb-3 mr-3 bg-light">
      <div>
        <h2>{`${reservation.first_name} ${reservation.last_name}'s Reservation`}</h2>
      </div>
      <div style={{ display: "flex" }}>
        <div className="">{seatButton()}</div>
        <a href={`/reservations/${reservation.reservation_id}/edit`}>
          <button className="btn btn-dark mb-3 mr-2">Edit</button>
        </a>
        <button
          onClick={cancelHandler}
          data-reservation-id-cancel={reservation.reservation_id}
          className="btn btn-dark mb-3"
        >
          Cancel
        </button>
      </div>
      <div>
        <h6>Check-in Time</h6>
        <p>{reservation.reservation_time}</p>
      </div>
      <div>
        <h6>Reservation Date</h6>
        <p>{reservation.reservation_date}</p>
      </div>
      <div>
        <h6>Guest Amount</h6>
        <p>{reservation.people}</p>
      </div>
      <div>
        <h6>Contact Info</h6>
        <p>{reservation.mobile_number}</p>
      </div>
      <div>
        <h6>Status</h6>
        <p data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </p>
      </div>
    </div>
  );
}

export default ListReservations;
