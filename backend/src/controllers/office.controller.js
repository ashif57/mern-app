const httpStatus = require('http-status');
const pick = require('../utils/pick');
const catchAsync = require('../utils/catchAsync');
const { officeService } = require('../services');
const AppError = require('../utils/AppError');

const createOffice = catchAsync(async (req, res) => {
  const office = await officeService.createOffice(req.body);
  res.status(httpStatus.CREATED).send(office);
});

const getOffices = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await officeService.queryOffices(filter, options);
  res.send(result);
});

const getOffice = catchAsync(async (req, res) => {
  const office = await officeService.getOfficeById(req.params.officeId);
  if (!office) {
    throw new AppError(httpStatus.NOT_FOUND, 'Office not found');
  }
  res.send(office);
});

const updateOffice = catchAsync(async (req, res) => {
  const office = await officeService.updateOfficeById(req.params.officeId, req.body);
  res.send(office);
});

const deleteOffice = catchAsync(async (req, res) => {
  await officeService.deleteOfficeById(req.params.officeId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createOffice,
  getOffices,
  getOffice,
  updateOffice,
  deleteOffice,
};
