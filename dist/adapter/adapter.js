"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
class TypeOrmDbAdapter {
    constructor(opts) {
        this.opts = opts;
    }
    find(filters) {
        return this.createCursor(filters, false);
    }
    findOne(query) {
        return this.repository.findOne(query);
    }
    findById(id) {
        return this.repository.findByIds([id]).then((result) => Promise.resolve(result[0]));
    }
    findByIds(idList) {
        return this.repository.findByIds(idList);
    }
    count(filters = {}) {
        return this.createCursor(filters, true);
    }
    insert(entity) {
        return this.repository.save(entity);
    }
    create(entity) {
        return this.insert(entity);
    }
    insertMany(entities) {
        return Promise.all(entities.map((e) => this.repository.create(e)));
    }
    beforeSaveTransformID(entity, _idField) {
        return entity;
    }
    afterRetrieveTransformID(entity, _idField) {
        return entity;
    }
    init(broker, service) {
        this.broker = broker;
        this.service = service;
        const entityFromService = this.service.schema.model;
        const isValid = !!entityFromService.constructor;
        if (!isValid) {
            throw new Error('if model provided - it should a typeorm repository');
        }
        this.entity = entityFromService;
    }
    connect() {
        return typeorm_1.createConnection(Object.assign(Object.assign({}, this.opts), { entities: [this.entity], synchronize: true })).then((connection) => {
            this.connection = connection;
            this.repository = this.connection.getRepository(this.entity);
            return Promise.resolve(connection);
        }).catch((err) => {
            // If AlreadyHasActiveConnectionError occurs, return already existent connection
            if (err.name === 'AlreadyHasActiveConnectionError') {
                this.connection = typeorm_1.getConnectionManager().get('default');
                return Promise.resolve();
            }
            throw err;
        });
    }
    disconnect() {
        if (this.connection) {
            return this.connection.close();
        }
        return Promise.resolve();
    }
    updateMany(where, update) {
        const criteria = { where };
        return this.repository.update(criteria, update);
    }
    updateById(id, update) {
        return this.repository.update(id, update.$set);
    }
    removeMany(where) {
        return this.repository.delete(where);
    }
    removeById(id) {
        const result = this.repository.delete(id);
        return result.then(() => {
            return { id };
        });
    }
    clear() {
        return this.repository.clear();
    }
    entityToObject(entity) {
        return entity;
    }
    createCursor(params, isCounting = false) {
        if (params) {
            const query = {
                where: params.query || {}
            };
            this._enrichWithOptionalParameters(params, query);
            return this._runQuery(isCounting, query);
        }
        return this._runQuery(isCounting);
    }
    _runQuery(isCounting, query) {
        if (isCounting) {
            return this.repository.count(query);
        }
        else {
            return this.repository.find(query);
        }
    }
    _enrichWithOptionalParameters(params, query) {
        if (params.search) {
            throw new Error('Not supported because of missing or clause meanwhile in typeorm');
        }
        if (params.sort) {
            const sort = this.transformSort(params.sort);
            if (sort) {
                query.order = sort;
            }
        }
        if (Number.isInteger(params.offset) && params.offset > 0) {
            query.skip = params.offset;
        }
        if (Number.isInteger(params.limit) && params.limit > 0) {
            query.take = params.limit;
        }
    }
    transformSort(paramSort) {
        let sort = paramSort;
        if (typeof sort === 'string') {
            sort = sort.replace(/,/, ' ').split(' ');
        }
        if (Array.isArray(sort)) {
            const sortObj = {};
            sort.forEach((s) => {
                if (s.startsWith('-')) {
                    sortObj[s.slice(1)] = 'DESC';
                }
                else {
                    sortObj[s] = 'ASC';
                }
            });
            // @ts-ignore
            return sortObj;
        }
        if (typeof sort === 'object') {
            return sort;
        }
        return {};
    }
}
exports.TypeOrmDbAdapter = TypeOrmDbAdapter;
//# sourceMappingURL=adapter.js.map