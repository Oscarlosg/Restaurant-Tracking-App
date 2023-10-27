import { useState } from "react";
import { listReservations } from "../utils/api";
import ListReservations from "../dashboard/ListReservations";

export default function SearchFeature() {
  const [formData, setFormData] = useState({});
  const [reservations, setReservations] = useState([]);
  const [isSearched, setIsSearched] = useState(false);

  const handleChange = (event) => {
    const { target } = event;
    const value = target.value;
    setFormData({ ...formData, [target.name]: value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    setIsSearched(true);
    const abortController = new AbortController();
    listReservations(formData, abortController.signal)
      .then((response) => setReservations(response))
      .catch((error) => console.log(error));
    return () => abortController.abort();
  };

  function mapRerevations() {
    if (!isSearched) {
      return null;
    } else if (reservations.length === 0) {
      return <h5>No reservations found with this phone number</h5>;
    } else {
      return reservations.map((reservation, index) => (
        <div key={index}>
          <ListReservations reservation={reservation} />
        </div>
      ));
    }
  }

  return (
    <>
      <form className="mt-5" onSubmit={submitHandler}>
        <input
        className="form-control"
          onChange={handleChange}
          type="search"
          name="mobile_number"
          placeholder="Enter a customer's phone number"
        ></input>{" "}
        <button className="w-100 btn btn-primary mr-2 mt-2 mb-3 pt-2 pb-2" type="submit">Find</button>
      </form>
      {mapRerevations()}
    </>
  );
}
