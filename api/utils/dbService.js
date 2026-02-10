/**
 * dbService.js
 * @description: exports all database related methods
 */
const { Op } = require('sequelize');

const OPERATORS = ['$and', '$or', '$like', '$in', '$eq', '$gt', '$lt', '$gte', '$lte', '$ne', '$nin', '$any', '$between'];

const createOne = async (model, data) => model.create(data);

const createMany = async (model, data, options = { validate: true }) => model.bulkCreate(data, options);

const update = async (model, query, data) => {
  query = queryBuilderParser(query);
  await model.update(data, { where: query });
  const result = await model.findAll({ where: query });
  return result;
};

const destroy = async (model, query) => {
  query = queryBuilderParser(query);
  const result = await model.findAll({ where: query });
  await model.destroy({ where: query });
  return result;
};

const deleteByPk = async (model, pk) => {
  const pkField = model.primaryKeyField || model.primaryKeyAttribute || 'id';
  const found = await model.findOne({ where: { [pkField]: pk } });
  await model.destroy({ where: { [pkField]: pk } });
  return found;
};

const findOne = async (model, query, options = {}) => {
  query = queryBuilderParser(query);
  return model.findOne({ where: query, ...options });
};

const paginate = async (model, query, options = {}) => {
  const models = require('../model');
  query = queryBuilderParser(query);
  const opts = { ...options };
  if (opts.select && opts.select.length) {
    opts.attributes = opts.select;
    delete opts.select;
  }
  if (opts.sort) {
    opts.order = sortParser(opts.sort);
    delete opts.sort;
  }
  if (opts.include && opts.include.length) {
    opts.include = opts.include.map((i) => {
      const inc = { ...i };
      if (inc.model && typeof inc.model === 'string' && models[inc.model]) {
        inc.model = models[inc.model];
      }
      if (inc.query) {
        inc.where = queryBuilderParser(inc.query);
        delete inc.query;
      }
      return inc;
    });
  }
  opts.where = query;
  const result = await model.paginate(opts);
  return {
    data: result.docs,
    paginator: {
      itemCount: result.total,
      perPage: opts.paginate || 25,
      pageCount: result.pages,
      currentPage: opts.page || 1,
    },
  };
};

const findAll = async (model, query, options = {}) => {
  query = queryBuilderParser(query);
  const opts = { ...options };
  if (opts.select && opts.select.length) {
    opts.attributes = opts.select;
    delete opts.select;
  }
  if (opts.sort) {
    opts.order = sortParser(opts.sort);
    delete opts.sort;
  }
  return model.findAll({ where: query, ...opts });
};

const count = async (model, query) => {
  query = queryBuilderParser(query);
  return model.count({ where: query });
};

const upsert = async (model, data, options = {}) => model.upsert(data, options);

const queryBuilderParser = (data) => {
  if (!data) return data;
  const result = JSON.parse(JSON.stringify(data));
  const parse = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    Object.keys(obj).forEach((key) => {
      if (typeof obj[key] === 'object') parse(obj[key]);
      if (OPERATORS.includes(key)) {
        const opKey = key.replace('$', '');
        const op = Op[opKey] || Op[opKey === 'ne' ? 'ne' : opKey === 'nin' ? 'notIn' : opKey];
        if (op) {
          obj[op] = obj[key];
          delete obj[key];
        }
      } else if (key === '$ne') {
        obj[Op.ne] = obj[key];
        delete obj[key];
      } else if (key === '$nin') {
        obj[Op.notIn] = obj[key];
        delete obj[key];
      }
    });
  };
  parse(result);
  return result;
};

const sortParser = (input) => {
  const arr = [];
  if (input && typeof input === 'object') {
    Object.entries(input).forEach(([key, value]) => {
      arr.push([key, value === 1 || value === 'ASC' ? 'ASC' : 'DESC']);
    });
  }
  return arr;
};

module.exports = {
  createOne,
  createMany,
  update,
  destroy,
  deleteByPk,
  findOne,
  paginate,
  findAll,
  count,
  upsert,
  queryBuilderParser,
  sortParser,
};
