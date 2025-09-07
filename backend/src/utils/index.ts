import {randomBytes} from 'crypto'

export function generateToken(size = 48) {
    return randomBytes(size).toString('hex')
}

export function minutesFromNow(mins: number) {
    return new Date(Date.now() + mins * 60 * 1000);
}

export function daysFromNow(days: number) {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}
