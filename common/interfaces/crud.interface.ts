/**
 * @interface CRUD
 * @description
 * Interface for CRUD operations
 * @method list
 * @method create
 * @method putById
 * @method readById
 * @method deleteById
 * @method patchById
 */
export interface CRUD {
    list: (limit: number, page: number, filterParams: any) => Promise<any>;
    create: (resource: any) => Promise<any>;
    putById: (id: string, resource: any) => Promise<string>;
    readById: (id: string) => Promise<any>;
    deleteById: (id: string) => Promise<string>;
    patchById: (id: string, resource: any) => Promise<string>;
}