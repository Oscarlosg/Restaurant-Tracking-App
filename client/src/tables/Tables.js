import { updateResId } from "../utils/api";

function Tables({ tables, loadDashboard }) {
  function clickHandler(event) {
    let tableId = event.target.value;
    tableId = Number(tableId);
    if (window.confirm("Is this table ready to seat new guests?") === true) {
      updateResId(tableId)
        .then(() => loadDashboard())
        .catch((error) => console.log("error", error));
    }
  } //today cannot be booked for some reason

  function mapTables(tables) {
    return tables.map((table, index) => (
      <div key={index}>
        <h4 className="text-center"> {table.table_name}</h4>
        <p className="text-center">Capacity: {table.capacity}</p>
        {table.reservation_id ? (
          <button
            className="btn btn-dark mb-3 ml-3"
            value={table.table_id}
            data-table-id-finish={table.table_id}
            onClick={clickHandler}
          >
            Finish
          </button>
        ) : null}
        <div className="text-center">
          {!table.reservation_id ? (
            <p
              data-table-id-status={table.table_id}
              className="alert alert-success"
            >
              free
            </p>
          ) : (
            <p
              data-table-id-status={table.table_id}
              className="alert alert-danger"
            >
              occupied
            </p>
          )}
        </div>
      </div>
    ));
  }

  return (
    <div className="">
      <h2 className="pl-4">
        <div className="border bg-white p-2 text-center">Tables</div></h2>
      <div className="pl-4">{mapTables(tables)}</div>
    </div>
  );
}

export default Tables;
