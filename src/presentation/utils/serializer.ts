export class Serializer {
    static safeJson(data: any): any {
        if (data === undefined || data === null) return;
        return JSON.parse(JSON.stringify(data, (_, value) => (typeof value === "bigint" ? value.toString() : value)));
    }
}