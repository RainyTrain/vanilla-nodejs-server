export enum Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export type MethodType = { [K in Methods]?: (...args: any[]) => unknown };

export type RouterType = Record<string, MethodType>;

export class Router {
  router: RouterType;

  constructor() {
    this.router = {};
  }

  request(
    method: Methods = Methods.GET,
    path: string,
    handler: (...args: any[]) => unknown,
  ) {
    if (!this.router[path]) {
      this.router[path] = {};
    }

    const route = this.router[path];

    if (route[method]) {
      throw new Error(`This ${route}: ${method} already exists`);
    }

    route[method] = handler;
  }

  get(path: string, handler: (...args: any[]) => unknown) {
    return this.request(Methods.GET, path, handler);
  }

  post(path: string, handler: (...args: any[]) => unknown) {
    return this.request(Methods.POST, path, handler);
  }

  put(path: string, handler: (...args: any[]) => unknown) {
    return this.request(Methods.PUT, path, handler);
  }

  delete(path: string, handler: (...args: any[]) => unknown) {
    return this.request(Methods.DELETE, path, handler);
  }
}
