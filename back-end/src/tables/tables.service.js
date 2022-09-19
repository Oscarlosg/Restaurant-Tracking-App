const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function create(newTable) {
  return knex("tables")
    .insert(newTable)
    .returning("*")
    .then((tableData) => tableData[0]);
}

function read(table_id) {
  return knex("tables").select("*").where({ table_id: table_id }).first();
}

function update(table) {
  return knex("tables")
    .where({ table_id: table.table_id })
    .update(table)
    .returning("*")
    .then((updatedTable) => updatedTable[0]);
}

function seatTable(table) {
  return knex.transaction(function (trx) {
    return trx("tables")
      .where({ table_id: table.table_id })
      .update(table)
      .returning("*")
      .then((updatedTable) => updatedTable[0])
      .then((updatedTable) => {
        return trx("reservations")
          .where({ reservation_id: updatedTable.reservation_id })
          .update({ status: `seated` })
          .returning("*")
          .then((updatedRes) => updatedRes[0]);
      });
  });
}

function unSeatTable(resId) {
  return knex.transaction(function (trx) {
    return trx("tables")
      .where({ reservation_id: resId })
      .update({ reservation_id: null })
      .then(() => {
        return trx("reservations")
          .where({ reservation_id: resId })
          .update({ status: `finished` });
      });
  });
}

module.exports = {
  list,
  create,
  read,
  update,
  seatTable,
  unSeatTable,
};
