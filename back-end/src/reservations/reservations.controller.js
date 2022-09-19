/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const date = req.query.date;
  const mobile = req.query.mobile_number;
  if (date) {
    const data = await service.listDate(date);
    return res.json({
      data,
    });
  }
  if (mobile) {
    const data = await service.listMobile(mobile);
    return res.json({
      data,
    });
  } else {
    const data = await service.list();
    return res.json({ data });
  }
}

function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `${req.params.reservation_id}`,
  });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

function isNumber(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const isNumber = data[propertyName].replace(/-/g, "");
    if (Number(isNumber)) {
      return next();
    }
    next({ status: 400, message: `${propertyName}` });
  };
}

function isTime(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const isTime = data[propertyName].replace(/:/g, "");
    if (Number(isTime)) {
      return next();
    }
    next({ status: 400, message: `${propertyName}` });
  };
}

async function update(req, res) {
  const resId = req.params.reservation_id;
  const resData = req.body.data;
  const updatedRes = {
    ...resData,
    reservation_id: resId,
  };
  const data = await service.update(updatedRes);
  res.json({ data });
}

function isPeopleNumber(req, res, next) {
  const { data = {} } = req.body;
  if (Number.isInteger(data.people)) {
    return next();
  }
  next({ status: 400, message: `people is not a number` });
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `${propertyName}` });
  };
}

function isTuesday(req, res, next) {
  const { data = {} } = req.body; // gets the body of data from the JSON
  const day = new Date(data.reservation_date);
  const dayOf = day.getUTCDay(); // returns from 0-6 0 sunday ->
  if (dayOf === 2) {
    return next({ status: 400, message: `closed` });
  }
  return next();
}

function isFutureRes(req, res, next) {
  const { data = {} } = req.body;
  const day = new Date(`${data.reservation_date} ${data.reservation_time} `);
  const today = new Date(); // empty argument = current
  if (day < today) {
    return next({ status: 400, message: "Needs to be future date" });
  }
  return next();
}

function openHours(req, res, next) {
  const { data = {} } = req.body;
  const time = data.reservation_time;
  const currentTime = new Date();
  if (currentTime < time) {
    return next({
      status: 400,
      message: `please make reservation for a time after current time`,
    });
  }
  if (time < "10:30" || time > "20:30") {
    return next({
      status: 400,
      message: `Hours of operation are between 10:30AM to 09:30PM, latest reservations 1 hour before closing`,
    });
  }
  return next();
}

function isFinished(req, res, next) {
  let reservation = res.locals.reservation;
  if (reservation.status === "finished") {
    return next({
      status: 400,
      message: reservation.status,
    });
  }
  return next();
}

function resStatus(req, res, next) {
  const { data = {} } = req.body;
  const status = data.status;
  if (!status) {
    return next();
  }
  if (status !== "booked")
    return next({
      status: 400,
      message: status,
    });
  return next();
}

function validStatus(req, res, next) {
  let validStatuses = [`booked`, `seated`, `finished`, `cancelled`];
  const { data = {} } = req.body;
  const status = data.status;
  if (!validStatuses.includes(status)) {
    return next({
      status: 400,
      message: "unknown status",
    });
  }
  return next();
}

module.exports = {
  list: [asyncErrorBoundary(list)],
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    isTuesday,
    isPeopleNumber,
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    isNumber("reservation_date"),
    isNumber("mobile_number"),
    isTime("reservation_time"),
    isFutureRes,
    openHours,
    resStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],

  update: [
    reservationExists,
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    isNumber("mobile_number"),
    isPeopleNumber,
    isNumber("reservation_date"),
    isTime("reservation_time"),
    asyncErrorBoundary(update),
  ],
  updateStatus: [reservationExists, isFinished, validStatus, asyncErrorBoundary(update)], 
};//comment
