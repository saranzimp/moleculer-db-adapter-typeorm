import { ConnectionOptions, Connection, Repository, FindOneOptions, DeepPartial, FindConditions } from 'typeorm';
import * as Moleculer from 'moleculer';
import { Service, ServiceBroker } from 'moleculer';
export declare class TypeOrmDbAdapter<T> {
    broker: Moleculer.ServiceBroker;
    service: Moleculer.Service;
    repository: Repository<T>;
    connection: Connection;
    private opts;
    private entity;
    constructor(opts: ConnectionOptions);
    find(filters: any): Promise<number> | Promise<T[]>;
    findOne(query: FindOneOptions): Promise<T | undefined>;
    findById(id: number): Promise<T>;
    findByIds(idList: any[]): Promise<T[]>;
    count(filters?: {}): Promise<number> | Promise<T[]>;
    insert(entity: any): Promise<any>;
    create(entity: any): Promise<any>;
    insertMany(entities: any[]): Promise<T[][]>;
    beforeSaveTransformID(entity: T, _idField: string): T;
    afterRetrieveTransformID(entity: T, _idField: string): T;
    init(broker: ServiceBroker, service: Service): void;
    connect(): Promise<void | Connection>;
    disconnect(): Promise<void>;
    updateMany(where: FindConditions<T>, update: DeepPartial<T>): Promise<import("typeorm").UpdateResult>;
    updateById(id: number, update: {
        $set: DeepPartial<T>;
    }): Promise<import("typeorm").UpdateResult>;
    removeMany(where: FindConditions<T>): Promise<import("typeorm").DeleteResult>;
    removeById(id: number): Promise<{
        id: number;
    }>;
    clear(): Promise<void>;
    entityToObject(entity: T): T;
    createCursor(params: any, isCounting?: boolean): Promise<number> | Promise<T[]>;
    private _runQuery;
    private _enrichWithOptionalParameters;
    private transformSort;
}
