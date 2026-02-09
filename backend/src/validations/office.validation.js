const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createOffice = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    address: Joi.string(),
    manager: Joi.string().custom(objectId),
  }),
};

const getOffices = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOffice = {
  params: Joi.object().keys({
    officeId: Joi.string().custom(objectId),
  }),
};

const updateOffice = {
  params: Joi.object().keys({
    officeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      address: Joi.string(),
      manager: Joi.string().custom(objectId),
    })
    .min(1),
};

const deleteOffice = {
  params: Joi.object().keys({
    officeId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createOffice,
  getOffices,
  getOffice,
  updateOffice,
  deleteOffice,
};
