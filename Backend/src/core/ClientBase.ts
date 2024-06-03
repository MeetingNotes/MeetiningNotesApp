class ClientError extends Error {
    constructor(message: string) {
        super(message);
    }
}

abstract class ClientBase<BackendType> {
    protected _backend: BackendType;

    constructor(backend: BackendType) {
        this._backend = backend;
    }

    public abstract read(options: any): Promise<any | null>;
    public abstract write(opts: object): Promise<void>;
}

abstract class ReadonlyClientBase<BackendType> extends ClientBase<BackendType> {
    constructor(backend: BackendType) {
        super(backend);
    }

    override write(_opts: object): Promise<void> {
        throw new ClientError(`${this.constructor.name} is readonly`);
    }
}

export { ClientBase, ReadonlyClientBase };