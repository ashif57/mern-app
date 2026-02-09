const httpStatus = require('http-status');
const Office = require('../models/office.model');
const AppError = require('../utils/AppError');

/**
 * Create a office
 * @param {Object} officeBody
 * @returns {Promise<Office>}
 */
const createOffice = async (officeBody) => {
  return Office.create(officeBody);
};

/**
 * Query for offices
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOffices = async (filter, options) => {
  const offices = await Office.paginate(filter, options);
  return offices;
};

/**
 * Get office by id
 * @param {ObjectId} id
 * @returns {Promise<Office>}
 */
const getOfficeById = async (id) => {
  return Office.findById(id);
};

/**
 * Update office by id
 * @param {ObjectId} officeId
 * @param {Object} updateBody
 * @returns {Promise<Office>}
 */
const updateOfficeById = async (officeId, updateBody) => {
  const office = await getOfficeById(officeId);
  if (!office) {
    throw new AppError(httpStatus.NOT_FOUND, 'Office not found');
  }
  Object.assign(office, updateBody);
  await office.save();
  return office;
};

/**
 * Delete office by id
 * @param {ObjectId} officeId
 * @returns {Promise<Office>}
 */
const deleteOfficeById = async (officeId) => {
  const office = await getOfficeById(officeId);
  if (!office) {
    throw new AppError(httpStatus.NOT_FOUND, 'Office not found');
  }
  await office.remove();
  return office;
};

module.exports = {
  createOffice,
  queryOffices,
  getOfficeById,
  updateOfficeById,
  deleteOfficeById,
};
