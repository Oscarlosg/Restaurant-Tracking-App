import { useState } from "react";
import { useHistory } from "react-router";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function CreateTable({ tables, setTables }) {
  const [error, setError] = useState(null);
  const [newTable, setTable] = useState({
    table_name: "",
    capacity: "",
  });

  const history = useHistory();

  const handleChange = (event) => {
    const { target } = event;
    const value = target.value;
    setTable({ ...newTable, [target.name]: value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    newTable.capacity = Number(newTable.capacity); //to change string to number so that it fits the api criteria
    createTable(newTable)
      .then((updatedTable) => {
        setTables([...tables, updatedTable]);
      })
      .then(() => {
        history.push("/");
      })
      .catch((error) => setError(error));
  };

  return (
    <>
      <form className="mt-5 mr-3 ml-3" onSubmit={submitHandler}>
        <div>
          <input
            className="form-control mb-2"
            name="table_name"
            value={newTable.table_name}
            placeholder="Table Name"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            className="form-control mb-2"
            name="capacity"
            value={newTable.capacity}
            placeholder="Capacity"
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button className="w-100 btn btn-primary mr-2 mt-2 mb-2 pt-2 pb-2" type="submit">submit</button>
        </div>
        <div >
          <button className="w-100 btn btn-secondary mr-2 mb-3 pt-2 pb-2" onClick={() => history.go(-1)}>cancel</button>
        </div>
      </form>
      <ErrorAlert error={error} />
    </>
  );
}

export default CreateTable;
