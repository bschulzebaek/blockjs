export class CompressionUtils {
    public static async compress(data: Uint8Array): Promise<Uint8Array> {
        const stream = new CompressionStream('gzip');
        const writer = stream.writable.getWriter();
        writer.write(data);
        writer.close();
        
        const output: Uint8Array[] = [];
        const reader = stream.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            output.push(value);
        }
        
        const totalLength = output.reduce((acc, val) => acc + val.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of output) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }

    public static async decompress(data: Uint8Array): Promise<Uint8Array> {
        const stream = new DecompressionStream('gzip');
        const writer = stream.writable.getWriter();
        writer.write(data);
        writer.close();
        
        const output: Uint8Array[] = [];
        const reader = stream.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            output.push(value);
        }
        
        const totalLength = output.reduce((acc, val) => acc + val.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const arr of output) {
            result.set(arr, offset);
            offset += arr.length;
        }
        return result;
    }
} 