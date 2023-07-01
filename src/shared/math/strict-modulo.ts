export default function strictModulo(a: number, b: number) {
    return ((a % b) + b) % b;
}