/**
 * crudController.js
 * @description :: generic CRUD controller factory (node_api_kit style, no auth/audit fields)
 * @param {Model} Model - Sequelize model
 * @param {object} schemaKey - { schemaKeys, updateSchemaKeys, findFilterKeys }
 * @returns {object} controller methods
 */
const validation = require('../utils/validateRequest');
const dbService = require('../utils/dbService');

function createCrudController(Model, schemaKey) {
  const pkField = Model.primaryKeyAttribute || 'id';

  const add = async (req, res) => {
    try {
      const dataToCreate = { ...req.body || {} };
      const validateRequest = validation.validateParamsWithJoi(dataToCreate, schemaKey.schemaKeys);
      if (!validateRequest.isValid) {
        return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
      }
      const created = await dbService.createOne(Model, dataToCreate);
      return res.success({ data: created });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };

  const bulkInsert = async (req, res) => {
    try {
      let dataToCreate = req.body.data;
      if (dataToCreate !== undefined && dataToCreate.length) {
        const created = await dbService.createMany(Model, dataToCreate);
        return res.success({ data: { count: created.length || 0 } });
      }
      return res.badRequest({ message: 'data array is required' });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };

  const findAll = async (req, res) => {
    try {
      const dataToFind = req.body || {};
      let query = dataToFind.query !== undefined ? dataToFind.query : {};
      const options = dataToFind.options !== undefined ? dataToFind.options : {};
      const validateRequest = validation.validateFilterWithJoi(
        dataToFind,
        schemaKey.findFilterKeys,
        Model.rawAttributes
      );
      if (!validateRequest.isValid) {
        return res.validationError({ message: validateRequest.message });
      }
      if (dataToFind.isCountOnly) {
        const count = await dbService.count(Model, query);
        return res.success({ data: { totalRecords: count } });
      }
      const result = await dbService.paginate(Model, query, options);
      if (!result) return res.recordNotFound();
      return res.success({ data: result });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };

  const get = async (req, res) => {
    try {
      const id = req.params.id;
      const found = await dbService.findOne(Model, { [pkField]: id });
      if (!found) return res.recordNotFound();
      return res.success({ data: found });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };

  const getCount = async (req, res) => {
    try {
      const dataToCount = req.body || {};
      const where = dataToCount.where || {};
      const validateRequest = validation.validateFilterWithJoi(dataToCount, schemaKey.findFilterKeys);
      if (!validateRequest.isValid) {
        return res.validationError({ message: validateRequest.message });
      }
      const count = await dbService.count(Model, where);
      return res.success({ data: { count } });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };

  const update = async (req, res) => {
    try {
      if (!req.params || !req.params.id) {
        return res.badRequest({ message: 'Insufficient request parameters! id is required.' });
      }
      const dataToUpdate = { ...req.body || {} };
      const validateRequest = validation.validateParamsWithJoi(dataToUpdate, schemaKey.schemaKeys);
      if (!validateRequest.isValid) {
        return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
      }
      const query = { [pkField]: req.params.id };
      const updated = await dbService.update(Model, query, dataToUpdate);
      return res.success({ data: updated });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };

  const partialUpdate = async (req, res) => {
    try {
      if (!req.params || !req.params.id) {
        return res.badRequest({ message: 'Insufficient request parameters! id is required.' });
      }
      const dataToUpdate = { ...req.body };
      const validateRequest = validation.validateParamsWithJoi(dataToUpdate, schemaKey.updateSchemaKeys);
      if (!validateRequest.isValid) {
        return res.validationError({ message: `Invalid values in parameters, ${validateRequest.message}` });
      }
      const query = { [pkField]: req.params.id };
      const updated = await dbService.update(Model, query, dataToUpdate);
      if (!updated || !updated.length) return res.recordNotFound();
      return res.success({ data: updated });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };

  const deleteRecord = async (req, res) => {
    try {
      const result = await dbService.deleteByPk(Model, req.params.id);
      if (!result) return res.recordNotFound();
      return res.success({ data: result });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };

  const deleteMany = async (req, res) => {
    try {
      const { ids } = req.body || {};
      if (!ids || !Array.isArray(ids)) {
        return res.badRequest({ message: 'Insufficient request parameters! ids array is required.' });
      }
      const query = { [pkField]: { $in: ids } };
      const deleted = await dbService.destroy(Model, query);
      return res.success({ data: { count: deleted.length } });
    } catch (error) {
      return res.internalServerError({ message: error.message });
    }
  };

  return {
    add,
    bulkInsert,
    findAll,
    get,
    getCount,
    update,
    partialUpdate,
    deleteRecord,
    deleteMany,
  };
}

module.exports = createCrudController;
